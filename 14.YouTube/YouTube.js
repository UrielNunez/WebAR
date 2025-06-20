import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {loadGLTF, loadAudio, loadVideo} from '../Assets/loader.js'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const createYouTube = () => {
  return new Promise((resolve, reject) => {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const onYouTubeIframeAPIReady = () => {
      const player = new YT.Player('player', {
        videoId: 'pKSogofMfhs',
        events: {
          onReady: () => {
            resolve(player);
          }
        }
      })
    }
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  });
}

document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    const player = await createYouTube();

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: '../Targets/ImageTarget.mind',
    });
    const { renderer,cssRenderer, scene, cssScene, camera } = mindarThree;
    
    const obj = new CSS3DObject(document.getElementById("ar-div"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    cssAnchor.onTargetFound = () =>{
      player.playVideo()
    }
     cssAnchor.onTargetLost = () =>{
      player.pauseVideo();
    }

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  } 
  start();
});



