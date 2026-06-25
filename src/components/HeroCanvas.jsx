import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 9

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Outer particle cloud ──────────────────────────────────────────────
    const COUNT = 2800
    const posArr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const r = 7 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      posArr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      posArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      posArr[i * 3 + 2] = r * Math.cos(phi)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(0.72, 0.47, 0.31),
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Secondary inner particle ring ─────────────────────────────────────
    const COUNT2 = 800
    const posArr2 = new Float32Array(COUNT2 * 3)
    for (let i = 0; i < COUNT2; i++) {
      const r = 2.2 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * 0.6
      posArr2[i * 3]     = r * Math.cos(theta)
      posArr2[i * 3 + 1] = r * Math.sin(phi) * 2
      posArr2[i * 3 + 2] = r * Math.sin(theta)
    }
    const pGeo2 = new THREE.BufferGeometry()
    pGeo2.setAttribute('position', new THREE.BufferAttribute(posArr2, 3))
    const pMat2 = new THREE.PointsMaterial({
      color: new THREE.Color(0.9, 0.78, 0.55),
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
    })
    const innerRing = new THREE.Points(pGeo2, pMat2)
    scene.add(innerRing)

    // ── Central wireframe icosahedron ─────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xb87850,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    scene.add(ico)

    // ── Dark inner fill so wireframe reads as floating orb ────────────────
    const fillGeo = new THREE.IcosahedronGeometry(2.0, 1)
    const fillMat = new THREE.MeshBasicMaterial({
      color: 0x020808,
      transparent: true,
      opacity: 0.92,
    })
    const fill = new THREE.Mesh(fillGeo, fillMat)
    scene.add(fill)

    // ── Outer ring torus ──────────────────────────────────────────────────
    const torusGeo = new THREE.TorusGeometry(3.2, 0.008, 4, 120)
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xb87850,
      transparent: true,
      opacity: 0.25,
    })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.rotation.x = Math.PI / 3
    scene.add(torus)

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.005, 4, 140),
      new THREE.MeshBasicMaterial({ color: 0x8a5c38, transparent: true, opacity: 0.15 })
    )
    torus2.rotation.x = Math.PI / 4
    torus2.rotation.y = Math.PI / 6
    scene.add(torus2)

    // ── Mouse tracking ────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04

      particles.rotation.y = t * 0.04 + mouse.x * 0.25
      particles.rotation.x = t * 0.015 + mouse.y * 0.1

      innerRing.rotation.y = -t * 0.07 + mouse.x * 0.15
      innerRing.rotation.z = t * 0.03

      ico.rotation.y = t * 0.09
      ico.rotation.x = t * 0.05
      ico.rotation.z = t * 0.04
      fill.rotation.copy(ico.rotation)

      torus.rotation.z = t * 0.06
      torus2.rotation.z = -t * 0.04

      // Subtle camera float
      camera.position.x = Math.sin(t * 0.08) * 0.5 + mouse.x * 0.6
      camera.position.y = Math.cos(t * 0.12) * 0.3 + mouse.y * 0.4
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      ;[pGeo, pMat, pGeo2, pMat2, icoGeo, icoMat, fillGeo, fillMat, torusGeo, torusMat].forEach((o) => o.dispose())
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 z-0" />
}
