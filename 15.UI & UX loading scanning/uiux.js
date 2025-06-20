import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {loadGLTF, loadAudio, loadVideo} from '../Assets/loader.js'

document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: '../Targets/ImageTarget.mind',
      uiScanning: "#scanning" ,
      uiLoading: "no"
    });
    const { renderer,scene,camera } = mindarThree;
    
   const geometry = new THREE.PlaneGeometry(2,2);
   const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
   const plane = new THREE.Mesh(geometry, material);

   const anchor = mindarThree.addAnchor(0);
   anchor.group.add(plane);
   
    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } 
  start();
});



