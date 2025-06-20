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
    });
    const { renderer, scene, camera } = mindarThree;

    //luz
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // create anchor
    const anchor = mindarThree.addAnchor(0);

    //create or call 3d model and move position & scale
    const gltf = await loadGLTF("../Assets/musicband-raccoon/scene.gltf");
    //scale model
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    //position model
    gltf.scene.position.set(0, -0.4, 0)
    //model on scene
    anchor.group.add(gltf.scene);

    
    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});



