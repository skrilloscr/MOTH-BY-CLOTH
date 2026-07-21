import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/** Animated Three.js background for the promo banner — floating geometric forms */
export default function PromoCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const GOLD = 0xb87850
    const AMBER = 0xf4c88a

    // ── Floating tetrahedra ────────────────────────────────────────────────
    const shapes = []
    const geoms = [
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.IcosahedronGeometry(0.35, 0),
    ]
    for (let i = 0; i < 12; i++) {
      const gIdx = i % 3
      const mat = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? GOLD : AMBER,
        emissive: GOLD,
        emissiveIntensity: 0.2,
        shininess: 120,
        transparent: true,
        opacity: 0.2 + Math.random() * 0.3,
        wireframe: Math.random() > 0.5,
      })
      const mesh = new THREE.Mesh(geoms[gIdx], mat)
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      )
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.012,
        ry: (Math.random() - 0.5) * 0.018,
        fy: (Math.random() * Math.PI * 2),
        fSpeed: 0.3 + Math.random() * 0.5,
        fAmp: 0.15 + Math.random() * 0.25,
      }
      scene.add(mesh)
      shapes.push(mesh)
    }

    // ── Background particle grid ───────────────────────────────────────────
    const pCount = 600
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 30
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: AMBER, size: 0.04, transparent: true, opacity: 0.4 })
    scene.add(new THREE.Points(pGeo, pMat))

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const pt = new THREE.PointLight(GOLD, 4, 20)
    pt.position.set(0, 3, 5)
    scene.add(pt)

    // ── Mouse parallax ────────────────────────────────────────────────────
    const mouse = { tx: 0, ty: 0, x: 0, y: 0 }
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mouse.x += (mouse.tx - mouse.x) * 0.03
      mouse.y += (mouse.ty - mouse.y) * 0.03

      shapes.forEach((s) => {
        s.rotation.x += s.userData.rx
        s.rotation.y += s.userData.ry
        s.position.y += Math.sin(t * s.userData.fSpeed + s.userData.fy) * s.userData.fAmp * 0.01
      })

      camera.position.x = mouse.x * 0.8
      camera.position.y = mouse.y * 0.4
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      geoms.forEach(g => g.dispose())
      shapes.forEach(s => s.material.dispose())
      pGeo.dispose(); pMat.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 z-0" />
}
