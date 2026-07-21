import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Self-contained Three.js canvas — spinning metallic octahedron gem.
 * Props:
 *   size   – px size of the square canvas (default 110)
 *   color  – hex color of the gem (default 0xb87850 gold)
 *   speed  – rotation multiplier (default 1)
 */
export default function FloatingCrystal({ size = 110, color = 0xb87850, speed = 1 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
    camera.position.z = 3.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Gem (octahedron) ─────────────────────────────────────────────────
    const geo = new THREE.OctahedronGeometry(1.05, 0)
    const mat = new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      shininess: 180,
      specular: new THREE.Color(1, 0.95, 0.8),
      transparent: true,
      opacity: 0.92,
    })
    const gem = new THREE.Mesh(geo, mat)
    scene.add(gem)

    // Wireframe overlay for faceted look
    const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.18 })
    const wire = new THREE.Mesh(new THREE.OctahedronGeometry(1.08, 0), wireMat)
    scene.add(wire)

    // ── Lights ───────────────────────────────────────────────────────────
    const amb = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(amb)

    const key = new THREE.PointLight(0xf4c88a, 3.5, 12)
    key.position.set(2, 3, 2)
    scene.add(key)

    const rim = new THREE.PointLight(0xb87850, 1.5, 10)
    rim.position.set(-2, -1, -2)
    scene.add(rim)

    // ── Orbiting ring ────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(1.5, 0.012, 4, 80)
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.5
    scene.add(ring)

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.007, 4, 90),
      new THREE.MeshBasicMaterial({ color: 0x8a5c38, transparent: true, opacity: 0.2 })
    )
    ring2.rotation.x = Math.PI / 4
    ring2.rotation.y = Math.PI / 5
    scene.add(ring2)

    // ── Mini particles ───────────────────────────────────────────────────
    const pCount = 120
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const r = 1.8 + Math.random() * 0.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pPos[i * 3 + 2] = r * Math.cos(phi)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xf4c88a, size: 0.04, transparent: true, opacity: 0.7 })
    const sparks = new THREE.Points(pGeo, pMat)
    scene.add(sparks)

    // ── Animate ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime() * speed

      gem.rotation.y = t * 0.7
      gem.rotation.x = Math.sin(t * 0.4) * 0.3
      gem.rotation.z = Math.cos(t * 0.3) * 0.15

      wire.rotation.copy(gem.rotation)

      ring.rotation.z = t * 0.5
      ring2.rotation.z = -t * 0.35

      sparks.rotation.y = t * 0.25
      sparks.rotation.x = t * 0.1

      // Float bob
      gem.position.y = Math.sin(t * 0.9) * 0.12
      wire.position.y = gem.position.y

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      ;[geo, mat, wireMat, ringGeo, ringMat, pGeo, pMat].forEach(o => o.dispose())
      renderer.dispose()
    }
  }, [size, color, speed])

  return <div ref={mountRef} style={{ width: size, height: size, display: 'block' }} />
}
