import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    mockWithVideo("../Assets/0611.mp4");
    //mockWithImage("../Assets/Tarjeta.jpg");


    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.querySelector("#arContainer"),
      imageTargetSrc: '../Targets/ImageTarget.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    // create AR object
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);

    // create anchor
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



