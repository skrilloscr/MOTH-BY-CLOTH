import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function SpaceBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = window.innerWidth
    const H = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 500)
    camera.position.z = 35

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── STARS (two layers — near bright + far dim) ────────────────────────
    function makeStarField(count, spread, size, opacity, color) {
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * spread
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5 - 15
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity })
      const pts = new THREE.Points(geo, mat)
      scene.add(pts)
      return { pts, geo, mat }
    }

    const stars1 = makeStarField(2400, 220, 0.22, 0.9, 0xfff5e0)   // bright near
    const stars2 = makeStarField(1600, 280, 0.10, 0.5, 0xf4c88a)   // amber tint far

    // ── PLANETS ───────────────────────────────────────────────────────────
    const PLANET_DEFS = [
      { r: 2.2, col: 0xb87850, emi: 0x7a3020, pos: [-28,  9, -45], ring: true,  ringCol: 0xb87850 },
      { r: 1.4, col: 0x8a7060, emi: 0x3a2010, pos: [ 26, -6, -55], ring: false, ringCol: 0 },
      { r: 0.8, col: 0xd4a870, emi: 0x8a5030, pos: [ 14, 18, -40], ring: false, ringCol: 0 },
      { r: 1.7, col: 0x4a6860, emi: 0x1a3830, pos: [-18,-14, -60], ring: true,  ringCol: 0x6a9890 },
      { r: 0.5, col: 0xe0c090, emi: 0x9a7040, pos: [ 35, 12, -30], ring: false, ringCol: 0 },
      { r: 1.0, col: 0x906850, emi: 0x4a2810, pos: [-38,-4,  -35], ring: false, ringCol: 0 },
    ]

    const planets = []
    PLANET_DEFS.forEach((pd, idx) => {
      const geo = new THREE.SphereGeometry(pd.r, 28, 28)
      const mat = new THREE.MeshPhongMaterial({
        color: pd.col, emissive: pd.emi, emissiveIntensity: 0.45,
        shininess: 55, transparent: true, opacity: 0.82,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...pd.pos)
      mesh.userData = {
        rotY:       0.002 + Math.random() * 0.004,
        baseY:      pd.pos[1],
        floatAmp:   0.6  + Math.random() * 1.0,
        floatSpeed: 0.25 + Math.random() * 0.4,
        floatOff:   (idx / PLANET_DEFS.length) * Math.PI * 2,
      }
      scene.add(mesh)
      planets.push(mesh)

      if (pd.ring) {
        const rGeo = new THREE.TorusGeometry(pd.r * 2.0, 0.12, 4, 72)
        const rMat = new THREE.MeshBasicMaterial({ color: pd.ringCol, transparent: true, opacity: 0.28 })
        const ring = new THREE.Mesh(rGeo, rMat)
        ring.rotation.x = Math.PI / 2.4
        mesh.add(ring)

        const rGeo2 = new THREE.TorusGeometry(pd.r * 2.5, 0.06, 4, 72)
        const rMat2 = new THREE.MeshBasicMaterial({ color: pd.ringCol, transparent: true, opacity: 0.14 })
        const ring2 = new THREE.Mesh(rGeo2, rMat2)
        ring2.rotation.x = Math.PI / 2.4
        mesh.add(ring2)
      }
    })

    // ── UFO factory ───────────────────────────────────────────────────────
    function makeUFO() {
      const g = new THREE.Group()

      // Saucer disc (flat sphere)
      const discGeo = new THREE.SphereGeometry(1.0, 18, 10)
      const discMat = new THREE.MeshPhongMaterial({
        color: 0xc8b080, emissive: 0x7a5830, shininess: 160,
        transparent: true, opacity: 0.88,
      })
      const disc = new THREE.Mesh(discGeo, discMat)
      disc.scale.y = 0.22
      g.add(disc)

      // Dome
      const domeGeo = new THREE.SphereGeometry(0.42, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2)
      const domeMat = new THREE.MeshPhongMaterial({
        color: 0xb87850, emissive: 0xb87850, emissiveIntensity: 0.6,
        shininess: 220, transparent: true, opacity: 0.72,
      })
      const dome = new THREE.Mesh(domeGeo, domeMat)
      dome.position.y = 0.18
      g.add(dome)

      // Rim
      const rimGeo = new THREE.TorusGeometry(1.06, 0.07, 8, 36)
      const rimMat = new THREE.MeshBasicMaterial({ color: 0xf4c88a, transparent: true, opacity: 0.65 })
      const rim = new THREE.Mesh(rimGeo, rimMat)
      rim.rotation.x = Math.PI / 2
      rim.position.y = -0.02
      g.add(rim)

      // Underbelly port lights (small spheres)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const lg = new THREE.SphereGeometry(0.07, 6, 6)
        const lm = new THREE.MeshBasicMaterial({ color: 0xf4e8a0, transparent: true, opacity: 0.9 })
        const l = new THREE.Mesh(lg, lm)
        l.position.set(Math.cos(angle) * 0.7, -0.1, Math.sin(angle) * 0.7)
        g.add(l)
      }

      // Glow light
      const glow = new THREE.PointLight(0xb87850, 1.8, 8)
      glow.position.y = -0.4
      g.add(glow)

      return g
    }

    // ── Spaceship factory ─────────────────────────────────────────────────
    function makeShip() {
      const g = new THREE.Group()

      // Hull cone (nose)
      const noseGeo = new THREE.ConeGeometry(0.18, 1.1, 8)
      const noseMat = new THREE.MeshPhongMaterial({
        color: 0xb09070, emissive: 0x503820, shininess: 150,
        transparent: true, opacity: 0.88,
      })
      const nose = new THREE.Mesh(noseGeo, noseMat)
      nose.rotation.z = Math.PI / 2
      nose.position.x = 0.4
      g.add(nose)

      // Body cylinder
      const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.7, 8)
      const bodyMat = new THREE.MeshPhongMaterial({
        color: 0x9a8060, emissive: 0x3a2810, shininess: 100,
        transparent: true, opacity: 0.85,
      })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.rotation.z = Math.PI / 2
      body.position.x = -0.15
      g.add(body)

      // Wings
      const wingGeo = new THREE.BoxGeometry(0.55, 0.04, 0.55)
      const wingMat = new THREE.MeshPhongMaterial({ color: 0x7a6850, shininess: 80, transparent: true, opacity: 0.8 })
      const wL = new THREE.Mesh(wingGeo, wingMat)
      wL.position.set(-0.1, 0, 0.38)
      wL.rotation.x = -0.25
      g.add(wL)
      const wR = wL.clone()
      wR.position.z = -0.38
      wR.rotation.x = 0.25
      g.add(wR)

      // Engine nozzle
      const nozGeo = new THREE.CylinderGeometry(0.12, 0.2, 0.28, 8)
      const nozMat = new THREE.MeshBasicMaterial({ color: 0x6a4828, transparent: true, opacity: 0.7 })
      const noz = new THREE.Mesh(nozGeo, nozMat)
      noz.rotation.z = Math.PI / 2
      noz.position.x = -0.65
      g.add(noz)

      // Engine glow
      const eng = new THREE.PointLight(0xff8840, 1.4, 5)
      eng.position.x = -0.9
      g.add(eng)

      // Cockpit bubble
      const cockGeo = new THREE.SphereGeometry(0.14, 10, 8)
      const cockMat = new THREE.MeshPhongMaterial({ color: 0xb87850, emissive: 0xb87850, emissiveIntensity: 0.5, transparent: true, opacity: 0.7 })
      const cock = new THREE.Mesh(cockGeo, cockMat)
      cock.position.set(0.25, 0.18, 0)
      g.add(cock)

      return g
    }

    // ── Spawn UFOs ────────────────────────────────────────────────────────
    const ufos = []
    const UFO_COUNT = 3
    for (let i = 0; i < UFO_COUNT; i++) {
      const ufo = makeUFO()
      const sc = 0.55 + Math.random() * 0.55
      ufo.scale.setScalar(sc)
      ufo.position.set(
        (Math.random() - 0.5) * 65,
        (Math.random() - 0.5) * 30,
        -8 - Math.random() * 22
      )
      ufo.userData = {
        cx:    (Math.random() - 0.5) * 45,
        cy:    (Math.random() - 0.5) * 18,
        rx:    10 + Math.random() * 16,
        ry:    5  + Math.random() * 9,
        spd:   0.18 + Math.random() * 0.25,
        off:   (i / UFO_COUNT) * Math.PI * 2,
        bob:   0.45 + Math.random() * 0.7,
        wob:   0.06 + Math.random() * 0.08,
      }
      scene.add(ufo)
      ufos.push(ufo)
    }

    // ── Spawn Spaceships ──────────────────────────────────────────────────
    const ships = []
    const SHIP_COUNT = 5
    for (let i = 0; i < SHIP_COUNT; i++) {
      const ship = makeShip()
      const sc = 0.35 + Math.random() * 0.45
      ship.scale.setScalar(sc)

      const dir = new THREE.Vector2(Math.random() - 0.5, (Math.random() - 0.5) * 0.35).normalize()
      const spd = 0.04 + Math.random() * 0.07

      ship.position.set(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 38,
        -6 - Math.random() * 20
      )
      // Rotate to face direction of travel
      ship.rotation.z = Math.atan2(dir.y, dir.x)

      ship.userData = { dir, spd, bob: Math.random() * Math.PI * 2, bobSpd: 0.4 + Math.random() * 0.5 }
      scene.add(ship)
      ships.push(ship)
    }

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.35))
    const sun = new THREE.PointLight(0xf4c88a, 2.5, 200)
    sun.position.set(-35, 25, 10)
    scene.add(sun)
    const fill = new THREE.PointLight(0x3a5850, 1.0, 120)
    fill.position.set(35, -15, 5)
    scene.add(fill)

    // ── Mouse & resize ────────────────────────────────────────────────────
    const mouse = { tx: 0, ty: 0, x: 0, y: 0 }
    const onMouseMove = e => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse parallax
      mouse.x += (mouse.tx - mouse.x) * 0.025
      mouse.y += (mouse.ty - mouse.y) * 0.025
      camera.position.x = mouse.x * 2.5
      camera.position.y = -mouse.y * 1.5
      camera.lookAt(0, 0, 0)

      // Stars drift
      stars1.pts.rotation.y = t * 0.008
      stars1.pts.rotation.x = t * 0.004
      stars2.pts.rotation.y = -t * 0.005

      // Planets
      planets.forEach(p => {
        const d = p.userData
        p.rotation.y += d.rotY
        p.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOff) * d.floatAmp
      })

      // UFOs — figure-eight / ellipse orbit
      ufos.forEach(ufo => {
        const d = ufo.userData
        const a = t * d.spd + d.off
        ufo.position.x = d.cx + Math.cos(a)       * d.rx
        ufo.position.y = d.cy + Math.sin(a * 1.6) * d.ry
        ufo.rotation.y = t * 1.0
        ufo.rotation.z = Math.sin(t * d.bob) * d.wob
      })

      // Ships — straight flight, wrap at boundaries
      ships.forEach(ship => {
        const d = ship.userData
        ship.position.x += d.dir.x * d.spd
        ship.position.y += d.dir.y * d.spd + Math.sin(t * d.bobSpd + d.bob) * 0.007
        if (ship.position.x >  42) ship.position.x = -42
        if (ship.position.x < -42) ship.position.x =  42
        if (ship.position.y >  26) ship.position.y = -26
        if (ship.position.y < -26) ship.position.y =  26
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      stars1.geo.dispose(); stars1.mat.dispose()
      stars2.geo.dispose(); stars2.mat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.38 }}
    />
  )
}
