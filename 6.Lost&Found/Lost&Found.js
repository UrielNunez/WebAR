import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {loadGLTF} from '../Assets/loader.js'

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.querySelector("#arContainer"),
      imageTargetSrc: '../Targets/ImageTarget.mind',
      maxTrack: 2,
    });
    const { renderer, scene, camera } = mindarThree;

    //luz
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    //create or call 3d model and move position & scale
    const raccoon = await loadGLTF("../Assets/musicband-raccoon/scene.gltf");
    //scale model
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    //position model
    raccoon.scene.position.set(0, -0.4, 0)
    //model on scene
    // create anchor
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    raccoonAnchor.onTargetFound = () => {
      console.log("Found")
    }
    raccoonAnchor.onTargetLost = () => {
      console.log("Lost")
    }
    
    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});



