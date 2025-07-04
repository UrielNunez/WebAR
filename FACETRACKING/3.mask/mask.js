import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import {loadGLTF, loadTexture} from '../../Assets/loader.js'




document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const faceMesh = mindarThree.addFaceMesh();
    const texture = await loadTexture("../../Assets/facemesh/face-mask-template/Face_Mask_Template.png");
    faceMesh.material.map = texturee;
    faceMesh.material.transparent = true;
    faceMesh.material.needsUpdate = true;

    scene.add (faceMesh);
   
    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } 
  start();
});



