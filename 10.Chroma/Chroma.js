import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {loadGLTF, loadAudio, loadVideo} from '../Assets/loader.js'
import { createChromaMaterial } from '../Assets/chroma-video.js';


document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: '../Targets/ImageTarget.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    const video = await loadVideo("../Assets/YouTubeAnimation.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1080/1920);
    //const material = new THREE.MeshBasicMaterial({map: texture});
    const material = new THREE.createChromaMaterial(texture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = Math.PI / 2;
    plane.position.y = 0.7;
    plane.scale.multiplyScalar(4);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }

    video.addEventListener("play", () => {
      video.currentTime = 6;
    })
    //luz
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});



