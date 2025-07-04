import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';




document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
    });
    const { renderer, scene, camera } = mindarThree;

    const geometry = new THREE.SphereGeometry(0.1, 32, 16);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity:0.5});
    const sphere = new THREE.Mesh(geometry,material);

    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(sphere);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } 
  start();
});



