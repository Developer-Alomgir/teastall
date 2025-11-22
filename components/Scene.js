"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071028);
    scene.fog = new THREE.FogExp2(0x071028, 0.012);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 500);
    camera.position.set(0, 3.8, 12);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.12;
    controls.rotateSpeed = 0.5; controls.zoomSpeed = 0.9; controls.panSpeed = 0.6;
    controls.minDistance = 6; controls.maxDistance = 30;

    // lights
    const ambient = new THREE.AmbientLight(0x9bb7ff, 0.25);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.9);
    directional.position.set(-5, 10, 5);
    directional.castShadow = true;
    scene.add(directional);
    const interior = new THREE.PointLight(0xffe7c9, 1.8, 20);
    interior.position.set(0, 3.2, 2.5);
    scene.add(interior);
    const neonLeft = new THREE.PointLight(0xff69b4, 1.2, 12);
    neonLeft.position.set(-6, 4.2, 2.5);
    scene.add(neonLeft);
    const neonRight = new THREE.PointLight(0x00ffff, 1.2, 12);
    neonRight.position.set(6, 4.2, 2.5);
    scene.add(neonRight);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80,80), new THREE.MeshStandardMaterial({ color: 0x071028, roughness: 0.95 }));
    ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);

    // snow particles
    const snowCount = 1500;
    const positions = new Float32Array(snowCount*3);
    for (let i=0;i<snowCount;i++){
      positions[i*3+0] = (Math.random()-0.5)*60;
      positions[i*3+1] = Math.random()*30 + 2;
      positions[i*3+2] = (Math.random()-0.5)*30;
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const snowMat = new THREE.PointsMaterial({ size: 0.08, color: 0xffffff, transparent:true, opacity:0.9 });
    const snow = new THREE.Points(snowGeo, snowMat);
    scene.add(snow);

    // shop quick structure
    const shop = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1b222b, roughness: 0.85 });
    const back = new THREE.Mesh(new THREE.BoxGeometry(12,6,0.4), wallMat); back.position.set(0,3,-3);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.4,6,8), wallMat); left.position.set(-5,3,1);
    const right = left.clone(); right.position.set(5,3,1);
    shop.add(back,left,right);
    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(6,0.3,1.6), new THREE.MeshStandardMaterial({ color: 0xd6b89a, roughness:0.3 }));
    counterTop.position.set(0,1.2,2.6); shop.add(counterTop);
    const counterBody = new THREE.Mesh(new THREE.BoxGeometry(6,1.4,1.6), new THREE.MeshStandardMaterial({ color:0x2e1b16, roughness:0.8 }));
    counterBody.position.set(0,0.5,2.6); shop.add(counterBody);
    scene.add(shop);

    // GLTF loader - looks for /models/tomcat.glb (user-supplied)
    const loader = new GLTFLoader();
    loader.load('/models/tomcat.glb', gltf => {
      const tom = gltf.scene;
      tom.position.set(0,0,1.2);
      tom.scale.set(1.0,1.0,1.0);
      scene.add(tom);
    }, undefined, () => {
      console.log('No tomcat.glb found; using placeholder.');
    });

    // banner (canvas texture with Bangla)
    const makeBannerTexture = (title, subtitle) => {
      const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#071028'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#00ffa3'; ctx.font = 'bold 160px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width/2, 200);
      ctx.fillStyle = '#ffffff'; ctx.font = '48px sans-serif';
      ctx.fillText(subtitle, canvas.width/2, 320);
      return new THREE.CanvasTexture(canvas);
    };
    const bannerTex = makeBannerTexture('কফি মামা', 'চা • কফি • গরম টিফিন — স্বাদে গুণগত মান');
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(6,1.4), new THREE.MeshBasicMaterial({ map: bannerTex, toneMapped:false, transparent:true }));
    banner.position.set(0,5.5,3.5); scene.add(banner);
    const bannerLight = new THREE.PointLight(0x00ffa3, 2.0, 10); bannerLight.position.set(0,5.5,3.8); scene.add(bannerLight);

    const clock = new THREE.Clock();
    function animate(){
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
      // update snow
      const pos = snow.geometry.attributes.position.array;
      for (let i=0;i<snowCount;i++){
        pos[i*3+1] -= 0.5 * dt;
        if (pos[i*3+1] < -2) pos[i*3+1] = Math.random()*30 + 8;
      }
      snow.geometry.attributes.position.needsUpdate = true;
      // pulses
      neonLeft.intensity = 0.8 + Math.sin(clock.elapsedTime*1.4)*0.3;
      neonRight.intensity = 0.8 + Math.cos(clock.elapsedTime*1.1)*0.3;
      bannerLight.intensity = 1.2 + Math.sin(clock.elapsedTime*2.1)*0.6;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize(){ renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      controls.dispose();
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} className="w-full h-screen" />;
}
