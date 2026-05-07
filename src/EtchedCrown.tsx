import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const etchedVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const etchedFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uLineColor;
  uniform vec3 uBandColor;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Lighting
    vec3 light1 = normalize(vec3(1.5, 2.5, 2.0));
    vec3 light2 = normalize(vec3(-1.0, 0.5, -1.0));
    
    float diff1 = max(dot(vNormal, light1), 0.0);
    float diff2 = max(dot(vNormal, light2), 0.0) * 0.2;
    float ambient = 0.15;
    float lighting = clamp(ambient + diff1 * 0.72 + diff2, 0.0, 1.0);
    
    // Primary engraving lines — fine diagonal hatching
    float angle1 = 0.38;
    float c1 = cos(angle1), s1 = sin(angle1);
    float coord1 = vWorldPosition.x * c1 + vWorldPosition.y * s1;
    float lines1 = sin(coord1 * 280.0) * 0.5 + 0.5;
    
    // Line thickness modulated by lighting
    float thickness = mix(0.9, 0.06, lighting);
    float p1 = smoothstep(thickness - 0.03, thickness + 0.03, lines1);
    
    // Cross-hatch for shadow regions
    float angle2 = angle1 + 1.3;
    float c2 = cos(angle2), s2 = sin(angle2);
    float coord2 = vWorldPosition.x * c2 + vWorldPosition.y * s2;
    float lines2 = sin(coord2 * 220.0) * 0.5 + 0.5;
    float p2 = smoothstep(thickness - 0.03, thickness + 0.03, lines2);
    
    float shadowMask = smoothstep(0.5, 0.1, lighting);
    float pattern = mix(p1, p1 * p2, shadowMask * 0.85);
    
    // Rim darkening for edge definition
    float rim = 1.0 - abs(dot(vNormal, normalize(vec3(0.0, 0.25, 1.0))));
    float rimD = smoothstep(0.72, 1.0, rim) * 0.3;
    
    // Base color: golden yellow on lit surfaces, dark lines in shadows
    vec3 surfColor = mix(uLineColor, uBaseColor, pattern);
    surfColor = mix(surfColor, uLineColor, rimD);
    
    // Horizontal band highlight — a brighter yellow stripe along the base
    float bandY = vWorldPosition.y + 0.35; // adjust to band position
    float bandStripe = smoothstep(0.0, 0.08, bandY) * (1.0 - smoothstep(0.15, 0.3, bandY));
    surfColor = mix(surfColor, uBandColor, bandStripe * 0.5 * lighting);
    
    gl_FragColor = vec4(surfColor, 1.0);
  }
`

/**
 * Crown geometry: wider, flatter proportions matching the reference
 * - Thick circular band as base
 * - 5 triangular peaks, shorter relative to base width
 */
function createCrownGeometry(): THREE.BufferGeometry {
  const peaks = 5
  const R = 2.4           // outer radius — wide
  const bandH = 0.65      // band height — thicker band
  const peakH = 1.1       // peak height — shorter peaks for flatter look
  const wallThick = 0.35  // thicker walls

  const rSeg = 200
  const hSeg = 50

  const totalH = bandH + peakH
  const pos: number[] = []
  const norm: number[] = []
  const uv: number[] = []
  const ind: number[] = []

  type VI = number | -1

  function maxHeightAtAngle(theta: number): number {
    const peakW = (2 * Math.PI) / peaks
    const seg = ((theta % (2 * Math.PI)) + 2 * Math.PI) % peakW
    const center = peakW / 2
    // Sharp triangle
    const tri = 1.0 - Math.abs(seg - center) / center
    // Make peaks sharper by raising the triangle curve
    const sharp = Math.pow(tri, 0.7)
    return bandH + peakH * sharp
  }

  function buildSurface(radiusFn: (y: number) => number, normalSign: number): VI[][] {
    const grid: VI[][] = []
    let vi = pos.length / 3

    for (let j = 0; j <= hSeg; j++) {
      const row: VI[] = []
      const t = j / hSeg
      const y = t * totalH

      for (let i = 0; i <= rSeg; i++) {
        const u0 = i / rSeg
        const theta = u0 * 2 * Math.PI
        const mh = maxHeightAtAngle(theta)

        if (y > mh + 0.002) {
          row.push(-1)
          continue
        }

        const r = radiusFn(y)
        const x = Math.cos(theta) * r
        const z = Math.sin(theta) * r
        const yPos = y - totalH * 0.35

        pos.push(x, yPos, z)
        norm.push(Math.cos(theta) * normalSign, 0.1 * normalSign, Math.sin(theta) * normalSign)
        uv.push(u0, t)
        row.push(vi++)
      }
      grid.push(row)
    }
    return grid
  }

  // Outer surface: slight flare at bottom, straight up
  const outerGrid = buildSurface((y: number) => {
    if (y < bandH * 0.15) {
      // Bottom flare
      return R * (1.0 + (1.0 - y / (bandH * 0.15)) * 0.03)
    }
    return R
  }, 1.0)

  // Inner surface
  const innerGrid = buildSurface((y: number) => {
    const outerR = R
    return outerR - wallThick
  }, -1.0)

  function tri(a: VI, b: VI, c: VI) {
    if (a >= 0 && b >= 0 && c >= 0) ind.push(a, b, c)
  }

  function buildFaces(grid: VI[][], flip: boolean) {
    for (let j = 0; j < hSeg; j++) {
      for (let i = 0; i < rSeg; i++) {
        const a = grid[j][i], b = grid[j][i+1]
        const c = grid[j+1][i], d = grid[j+1][i+1]
        if (flip) { tri(a, b, c); tri(b, d, c) }
        else { tri(a, c, b); tri(b, c, d) }
      }
    }
  }

  buildFaces(outerGrid, false)
  buildFaces(innerGrid, true)

  // Bottom cap
  for (let i = 0; i < rSeg; i++) {
    const oa = outerGrid[0][i], ob = outerGrid[0][i+1]
    const ia = innerGrid[0][i], ib = innerGrid[0][i+1]
    tri(oa, ob, ia); tri(ob, ib, ia)
  }

  // Top edge caps along peak boundaries
  for (let j = 0; j < hSeg; j++) {
    for (let i = 0; i < rSeg; i++) {
      const oA = outerGrid[j][i], oB = outerGrid[j+1][i]
      const iA = innerGrid[j][i], iB = innerGrid[j+1][i]

      // Right boundary: current valid, next invalid
      if (outerGrid[j][i] >= 0 && outerGrid[j][i+1] < 0) {
        if (oA >= 0 && iA >= 0 && oB >= 0 && iB >= 0) {
          tri(oA, oB, iA); tri(oB, iB, iA)
        }
      }
      // Left boundary: current invalid, next valid
      if (outerGrid[j][i] < 0 && outerGrid[j][i+1] >= 0) {
        const oC = outerGrid[j][i+1], oD = outerGrid[j+1][i+1]
        const iC = innerGrid[j][i+1], iD = innerGrid[j+1][i+1]
        if (oC >= 0 && iC >= 0 && oD >= 0 && iD >= 0) {
          tri(oC, iC, oD); tri(iC, iD, oD)
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setIndex(ind)
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.computeVertexNormals()
  return geo
}

export default function EtchedCrown() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const geo = useMemo(() => createCrownGeometry(), [])

  const uniforms = useMemo(() => ({
    uBaseColor: { value: new THREE.Color('#f2d80a') },
    uLineColor: { value: new THREE.Color('#0a0a00') },
    uBandColor: { value: new THREE.Color('#e8cc00') },
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2
      // Tilted — more horizontal, showing the band from the side
      meshRef.current.rotation.x = 0.35 + Math.sin(t * 0.35) * 0.035
      meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.02 - 0.1
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.06
    }
  })

  return (
    <mesh ref={meshRef} geometry={geo} scale={0.6}>
      <shaderMaterial
        ref={matRef}
        vertexShader={etchedVertexShader}
        fragmentShader={etchedFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
