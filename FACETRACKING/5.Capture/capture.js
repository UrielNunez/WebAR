import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import {loadGLTF} from '../../Assets/loader.js'

const capture = (mindarThree) => {
  const {video, renderer, scene, camera} = mindarThree;
  const rednerCanvas = renderer.domElement;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = rednerCanvas.width;
  canvas.height = rednerCanvas.height;

  const sx = (video,clientWidth - rednerCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
  

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

}



document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const glasses = await loadGLTF('../../Assets/glasses1/scene.gltf');
    glasses.scene.scale.multiplyScalar(0.01);
    
    const anchor = mindarThree.addAnchor(168);
    anchor.group.add(glasses.scene);

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } 
  start();
});



