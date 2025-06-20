import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {loadGLTF, loadAudio, loadVideo} from '../Assets/loader.js'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: '../Targets/ImageTarget.mind',
    });
    const { renderer,cssRenderer, scene, cssScene, camera } = mindarThree;
    
    const obj = new CSS3DObject(document.getElementById("ar-div"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  } 
  start();
});



