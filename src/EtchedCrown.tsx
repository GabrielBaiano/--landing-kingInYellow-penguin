import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragShader = `
  uniform vec3 uBase;
  uniform vec3 uLine;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 keyLight = normalize(vec3(0.8, 1.8, 2.2));
    vec3 fillLight = normalize(vec3(-1.2, 0.4, -0.8));
    float key = max(dot(vNormal, keyLight), 0.0);
    float fill = max(dot(vNormal, fillLight), 0.0) * 0.2;
    float lit = clamp(0.06 + key * 0.78 + fill, 0.0, 1.0);

    // Diagonal engraving lines
    float ang1 = 0.52;
    float coordDiag = vWorldPos.x * sin(ang1) + vWorldPos.y * cos(ang1);
    float coordHoriz = vWorldPos.y;

    // Blend to horizontal on flat surfaces to prevent swirl artifacts
    float flatness = abs(vNormal.y);
    float coord1 = mix(coordDiag, coordHoriz, flatness * flatness);
    float lines1 = sin(coord1 * 380.0) * 0.5 + 0.5;

    float litCurve = lit * lit;
    float th = mix(0.96, 0.04, litCurve);
    float edge1 = 0.015 + lit * 0.01;
    float pat1 = smoothstep(th - edge1, th + edge1, lines1);

    // Cross-hatch in deep shadows only
    float ang2 = -0.45;
    float coord2Diag = vWorldPos.x * sin(ang2) + vWorldPos.y * cos(ang2);
    float coord2 = mix(coord2Diag, coordHoriz * 1.1, flatness * flatness);
    float lines2 = sin(coord2 * 320.0) * 0.5 + 0.5;
    float pat2 = smoothstep(th - edge1, th + edge1, lines2);

    float crossMask = smoothstep(0.35, 0.08, lit);
    float pattern = mix(pat1, pat1 * pat2, crossMask * 0.8);

    // On very flat surfaces, fade to solid shading
    float solidMask = smoothstep(0.85, 0.98, flatness);
    pattern = mix(pattern, step(0.3, lit), solidMask);

    float rim = 1.0 - abs(dot(vNormal, normalize(vec3(0.0, 0.2, 1.0))));
    float rimDark = smoothstep(0.72, 0.95, rim) * 0.15;

    vec3 col = mix(uLine, uBase, pattern);
    col = mix(col, uLine, rimDark);
    gl_FragColor = vec4(col, 1.0);
  }
`

// Single continuous mesh — no seam between band and peaks
function createCrown(): THREE.BufferGeometry {
  const peaks = 5, R = 2.2, thick = 0.35
  const bandH = 0.65, peakH = 1.05
  const totalH = bandH + peakH
  const Ri = R - thick
  const rS = 300, hS = 150
  const yOff = -totalH * 0.3

  function maxH(theta: number): number {
    const pw = (2 * Math.PI) / peaks
    const seg = ((theta % (2 * Math.PI)) + 2 * Math.PI) % pw
    const c = pw / 2
    return bandH + peakH * Math.pow(1.0 - Math.abs(seg - c) / c, 0.6)
  }

  const pos: number[] = [], nrm: number[] = [], uvs: number[] = [], idx: number[] = []
  let vi = 0

  function buildSurf(radius: number, nSign: number): number[][] {
    const grid: number[][] = []
    for (let j = 0; j <= hS; j++) {
      const row: number[] = []
      for (let i = 0; i <= rS; i++) {
        const u = i / rS, theta = u * 2 * Math.PI
        const y = Math.min((j / hS) * totalH, maxH(theta))
        pos.push(Math.cos(theta) * radius, y + yOff, Math.sin(theta) * radius)
        nrm.push(Math.cos(theta) * nSign, 0.1 * nSign, Math.sin(theta) * nSign)
        uvs.push(u, j / hS)
        row.push(vi++)
      }
      grid.push(row)
    }
    return grid
  }

  const outer = buildSurf(R, 1)
  const inner = buildSurf(Ri, -1)

  // Outer faces
  for (let j = 0; j < hS; j++)
    for (let i = 0; i < rS; i++) {
      const a = outer[j][i], b = outer[j][i+1], c = outer[j+1][i], d = outer[j+1][i+1]
      idx.push(a, c, b); idx.push(b, c, d)
    }
  // Inner faces
  for (let j = 0; j < hS; j++)
    for (let i = 0; i < rS; i++) {
      const a = inner[j][i], b = inner[j][i+1], c = inner[j+1][i], d = inner[j+1][i+1]
      idx.push(a, b, c); idx.push(b, d, c)
    }
  // Bottom cap
  for (let i = 0; i < rS; i++) {
    idx.push(outer[0][i], outer[0][i+1], inner[0][i])
    idx.push(outer[0][i+1], inner[0][i+1], inner[0][i])
  }
  // Top cap (zigzag)
  for (let i = 0; i < rS; i++) {
    idx.push(outer[hS][i], inner[hS][i], outer[hS][i+1])
    idx.push(inner[hS][i], inner[hS][i+1], outer[hS][i+1])
  }

  const geo = new THREE.BufferGeometry()
  geo.setIndex(idx)
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.computeVertexNormals()
  return geo
}

export default function EtchedCrown() {
  const ref = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => createCrown(), [])
  const uniforms = useMemo(() => ({
    uBase: { value: new THREE.Color('#f2d80a') },
    uLine: { value: new THREE.Color('#0a0a00') },
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.y = t * 0.2
      ref.current.rotation.x = 0.3 + Math.sin(t * 0.3) * 0.03
      ref.current.rotation.z = Math.sin(t * 0.2) * 0.02 - 0.1
      ref.current.position.y = Math.sin(t * 0.5) * 0.05
    }
  })

  return (
    <mesh ref={ref} geometry={geo} scale={0.6}>
      <shaderMaterial
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
