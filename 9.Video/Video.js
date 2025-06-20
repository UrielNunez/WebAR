import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadGLTF, loadAudio, loadVideo } from '../Assets/loader.js'

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: '../Targets/ImageTarget.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    const video = await loadVideo("../../WebAR/Assets/YouTubeAnimation.mp4");
    video.muted = true; // <- esto permite autoplay en móviles
    video.loop = true;
    video.playsInline = true; // <- evita que el video se abra a pantalla completa
    video.crossOrigin = "anonymous"; // <- por si el video está en otro dominio
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }
    document.body.addEventListener('click', () => {
      video.muted = false;
      video.volume = 1.0;
      video.play(); // por si estaba pausado o bloqueado
    }, { once: true });

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



