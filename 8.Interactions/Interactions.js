import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {loadGLTF, loadAudio} from '../Assets/loader.js'

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
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

    raccoon.scene.userData.clickable = true;

    //model on scene
    // create anchor
    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audioClip = await loadAudio("../Assets/musicband-drum-set.mp3");
    const audio = new THREE.Audio(listener);
    audio.setBuffer(audioClip);
    
    document.body.addEventListener("click", (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = - 1 * ((e.clientY / window.innerHeight) * 2 - 1);
      const mouse = new THREE.Vector2(mouseX, mouseY);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0){
        let o = intersects[0].object;
        while (o.parent && !o.userData.clickable){
          o = o.parent;
        }
        if (o.userData.clickable) {
          if (o === raccoon.scene){
            audio.play();
          }
        }
        
      }
      
    });

    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});



