\
"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.02);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 4, 16);

    // Controls (smooth touch + desktop)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controls.panSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.enablePan = true;
    controls.minDistance = 8;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 1.2;

    // Lights
    scene.add(new THREE.AmbientLight(0x6040a0, 0.6));

    const mainLight = new THREE.DirectionalLight(0xffeedd, 0.9);
    mainLight.position.set(5, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const pinkLight = new THREE.PointLight(0xff1493, 1.5, 25);
    pinkLight.position.set(-8, 5, 6);
    scene.add(pinkLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 1.2, 25);
    cyanLight.position.set(8, 5, 6);
    scene.add(cyanLight);

    const warmLight = new THREE.PointLight(0xffaa44, 2.5, 15);
    warmLight.position.set(0, 3, 4);
    scene.add(warmLight);

    // Helpers - material factories
    const box = (w,h,d,col,opts={})=>{
      const m = new THREE.MeshStandardMaterial({
        color: col,
        roughness: opts.r ?? 0.7,
        metalness: opts.m ?? 0.1,
        emissive: opts.e ?? 0x000000,
        emissiveIntensity: opts.ei ?? 0
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m);
      mesh.castShadow = true; mesh.receiveShadow = true;
      return mesh;
    };

    const cyl = (rt,rb,h,col,seg=16,opts={})=>{
      const m = new THREE.MeshStandardMaterial({
        color: col, roughness: opts.r ?? 0.6, metalness: opts.m ?? 0.2,
        emissive: opts.e ?? 0x000000, emissiveIntensity: opts.ei ?? 0
      });
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), m);
      mesh.castShadow = true; mesh.receiveShadow = true;
      return mesh;
    };

    // Ground with subtle roughness
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x1a0a25, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI/2;
    ground.receiveShadow = true;
    scene.add(ground);

    // High-render shop group (improved materials, more geometry)
    const shop = new THREE.Group();

    const backWall = box(8,5,0.3,0x5d3a1a, {r:0.6, m:0.2});
    backWall.position.set(0,2.5,-2.5);
    shop.add(backWall);

    const leftWall = box(0.3,5,5.5,0x4a2d15);
    leftWall.position.set(-4,2.5,0);
    shop.add(leftWall);

    const rightWall = box(0.3,5,5.5,0x4a2d15);
    rightWall.position.set(4,2.5,0);
    shop.add(rightWall);

    const floor = box(8,0.2,5.5,0x2d1810);
    floor.position.set(0,0.1,0);
    shop.add(floor);

    // Counter (with smoothness and metalness)
    const counterTop = box(6,0.2,1.4,0xdeb887, { r: 0.3, m: 0.1 });
    counterTop.position.set(0,1.4,2.2);
    shop.add(counterTop);

    const counterBody = box(6,1.4,1.3,0xb8733d, { r:0.7 });
    counterBody.position.set(0,0.7,2.2);
    shop.add(counterBody);

    // Roof and neon trims - slightly higher poly by adding thin extruded boxes
    const roof = box(9,0.5,7,0x9932cc, { e:0x6b238e, ei:0.5, m:0.4, r:0.2 });
    roof.position.set(0,5.25,0);
    shop.add(roof);

    const overhang = box(8.5,0.3,2.5,0x8b008b, { e:0x5a005a, ei:0.4 });
    overhang.position.set(0,4.85,3.5);
    shop.add(overhang);

    const neonColors = [0xff00ff, 0x00ffff];
    for(let i=0;i<2;i++){
      const trim = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.06, 0.06, 4,1,1),
        new THREE.MeshBasicMaterial({ color: neonColors[i] }));
      trim.position.set(0, 4.65 - i*0.12, 4.7);
      shop.add(trim);
    }

    scene.add(shop);

    // Sign group - texture text with glow
    const signGroup = new THREE.Group();
    const signBack = box(6,1.5,0.25,0x0a0a18);
    signGroup.add(signBack);

    const signBorder = new THREE.Mesh(new THREE.BoxGeometry(6.2,1.7,0.2), new THREE.MeshBasicMaterial({ color: 0x00ffa3 }));
    signBorder.position.z = 0.1;
    signGroup.add(signBorder);

    const signInner = box(5.9,1.4,0.22,0x080812);
    signInner.position.z = 0.12;
    signGroup.add(signInner);

    // Canvas texture for text (good quality)
    const createTextTexture = (text, fontSize, color, bgColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = color;
      ctx.shadowBlur = 30;
      ctx.fillStyle = color;
      ctx.fillText(text, canvas.width/2, canvas.height/2);
      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      texture.needsUpdate = true;
      return texture;
    };

    const textTexture = createTextTexture('COFFEE MAMA', 140, '#00ffa3', '#080812');
    const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.5,1.2), new THREE.MeshBasicMaterial({ map: textTexture, transparent: true }));
    textPlane.position.z = 0.25;
    signGroup.add(textPlane);

    const signGlow = new THREE.PointLight(0x00ffa3, 3, 12);
    signGlow.position.set(0,0,2);
    signGroup.add(signGlow);

    signGroup.position.set(0,6.5,3.5);
    scene.add(signGroup);

    // High-render coffee cup (lathe geometry)
    const cupGroup = new THREE.Group();
    const pts = [];
    for(let i=0;i<8;i++){
      pts.push(new THREE.Vector2(0.25 + Math.sin(i*0.4)*0.02, i*0.07));
    }
    const lathe = new THREE.LatheGeometry(pts, 64);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 });
    const cupMesh = new THREE.Mesh(lathe, cupMat);
    cupMesh.castShadow = true; cupMesh.receiveShadow = true;
    cupMesh.scale.set(1.2,1.2,1.2);
    cupGroup.add(cupMesh);

    // handle using torus geometry with more segments
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 16, 48, Math.PI), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    handle.rotation.set(0, Math.PI/2, Math.PI/2);
    handle.position.set(0.4, 0.6, 0);
    cupGroup.add(handle);

    cupGroup.position.set(4.2,6.5,3.8);
    scene.add(cupGroup);

    // Steam particles (soft spheres)
    const steamParts = [];
    for(let i=0;i<20;i++){
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent:true, opacity:0.7 }));
      s.position.set(4.2, 7 + Math.random()*0.6, 3.8);
      s.userData = { spd: 0.006 + Math.random()*0.01, off: Math.random()*Math.PI*2, startY:7 };
      scene.add(s);
      steamParts.push(s);
    }

    // Keeper simplified (improved materials)
    const keeper = new THREE.Group();
    const torso = cyl(0.4,0.35,1.1,0x2d5a27,12);
    torso.position.y = 1.3;
    keeper.add(torso);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), new THREE.MeshStandardMaterial({ color:0xffdbac, roughness:0.8 }));
    head.position.y = 2.15;
    keeper.add(head);
    keeper.position.set(0,0.5,1.2);
    scene.add(keeper);

    // Cups on counter (higher poly)
    const cups = [];
    const createCup = (x,z,col)=>{
      const g = new THREE.Group();
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.14,0.4,32), new THREE.MeshStandardMaterial({ color: col, roughness:0.3 }));
      c.position.y = 0.2;
      g.add(c);
      const cof = new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.08,32), new THREE.MeshStandardMaterial({ color:0x3d1f0d }));
      cof.position.y = 0.36;
      g.add(cof);
      g.position.set(x,1.5,z);
      g.userData = { baseY:1.5, phase: Math.random()*Math.PI*2 };
      return g;
    };
    const cupCols = [0xffffff, 0xff6b6b, 0x87ceeb, 0xffd700];
    [[-2,2],[-0.7,2.1],[0.7,2.1],[2,2]].forEach((p,i)=>{
      const cup = createCup(p[0], p[1], cupCols[i]);
      scene.add(cup); cups.push(cup);
    });

    // Stools
    const stools = [];
    const createStool = (x,z)=>{
      const g = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.35,0.15,32), new THREE.MeshStandardMaterial({ color:0xcd853f }));
      seat.position.y = 0.9; g.add(seat);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.12,0.9,16), new THREE.MeshStandardMaterial({ color:0x3a2510 }));
      leg.position.y = 0.45; g.add(leg);
      g.position.set(x,0,z);
      scene.add(g); stools.push(g);
    };
    [[-1.8,4],[0,4.3],[1.8,4]].forEach(p=>createStool(p[0],p[1]));

    // Lamps
    const lamps = [];
    const createLamp = (x,z,dir=1)=>{
      const g = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,6,12), new THREE.MeshStandardMaterial({ color:0x3d2a5a }));
      pole.position.y = 3; g.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2,0.12,0.12), new THREE.MeshStandardMaterial({ color:0x3d2a5a }));
      arm.position.set(dir,5.8,0); g.add(arm);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), new THREE.MeshBasicMaterial({ color:0xfffacd }));
      bulb.position.set(dir*1.9,5.5,0); g.add(bulb);
      const light = new THREE.PointLight(0xffd700, 2.5, 15);
      light.position.set(dir*1.9,5.5,0); light.castShadow = true; g.add(light);
      g.position.set(x,0,z);
      scene.add(g); lamps.push({g, light, bulb});
    };
    createLamp(-6,5,1); createLamp(6,5,-1);

    // Particles
    const particles = [];
    for(let i=0;i<80;i++){
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.04,8,8), new THREE.MeshBasicMaterial({ color: Math.random()>0.5?0xff69b4:0x00ffff, transparent:true, opacity:0.45 }));
      p.position.set((Math.random()-0.5)*40, Math.random()*18, (Math.random()-0.5)*20);
      p.userData = { spd: 0.004 + Math.random()*0.01, off: Math.random()*Math.PI*2 };
      scene.add(p); particles.push(p);
    }

    // Animation
    let time = 0;
    const clock = new THREE.Clock();

    function animate(){
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;
      // controls auto damping
      controls.update();

      // Auto subtle camera animation when not interacting
      // (we'll let OrbitControls handle user interaction; it automatically disables auto movement)

      // Shopkeeper
      keeper.position.y = 0.5 + Math.sin(time*1.2)*0.04;
      keeper.rotation.y = Math.sin(time*0.6)*0.08;

      // Cups bobbing
      cups.forEach((cup,i)=>{
        cup.position.y = cup.userData.baseY + Math.sin(time*1.5 + cup.userData.phase)*0.02;
        cup.rotation.y = Math.sin(time*0.4 + i)*0.08;
      });

      // Steam
      steamParts.forEach(s=>{
        s.position.y += s.userData.spd;
        s.position.x = 4.2 + Math.sin(time*2.5 + s.userData.off)*0.15;
        s.material.opacity = 0.6 - (s.position.y - s.userData.startY)*0.35;
        s.scale.setScalar(1 + (s.position.y - s.userData.startY)*0.4);
        if(s.position.y > 8.5){
          s.position.y = s.userData.startY;
          s.position.x = 4.2 + (Math.random()-0.5)*0.25;
          s.scale.setScalar(1);
        }
      });

      // Lamp glow
      lamps.forEach((l,i)=>{
        l.light.intensity = 2.5 + Math.sin(time*1.5 + i*2)*0.5;
        const hue = 0.12 + Math.sin(time*0.8 + i)*0.02;
        l.bulb.material.color.setHSL(hue,0.4,0.88);
      });

      // particles float
      particles.forEach(p=>{
        p.position.y += p.userData.spd;
        p.position.x += Math.sin(time*0.4 + p.userData.off)*0.004;
        if(p.position.y > 20){
          p.position.y = -2;
          p.position.x = (Math.random()-0.5)*40;
          p.position.z = (Math.random()-0.5)*20;
        }
      });

      // ambient shifts
      pinkLight.intensity = 1.5 + Math.sin(time*0.6)*0.4;
      cyanLight.intensity = 1.2 + Math.sin(time*0.5 + 1)*0.3;
      warmLight.intensity = 2.5 + Math.sin(time*0.9)*0.4;

      // sign glow
      signGlow.intensity = 3 + Math.sin(time*2.5)*0.8;

      renderer.render(scene, camera);
    }
    animate();

    // Resize handling with DPR adjustments
    function onResize(){
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
}
