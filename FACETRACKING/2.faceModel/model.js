import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import {loadGLTF} from '../../Assets/loader.js'




document.addEventListener('DOMContentLoaded', () => {

  const start = async () => {

    // initialize MindAR 
    const mindarThree = new MindARThree({
      container: document.body,
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const occluder = await loadGLTF('../../Assets/sparkar-occluder/headOccluder.glb');
    const occluderMaterial = new THREE.MeshBasicMaterial({colorWrite: false});
    occluder.scene.traverse((o) => {
        if(o.isMesh){
            o.material = occluderMaterial;
        }
    });
    occluder.scene.scale.multiplyScalar(0.065);
    occluder.scene.position.set(0, -0.3, 0.15);
    occluder.scene.renderOrder = 0;
    const occluderAnchor = mindarThree.addAnchor(168);
    occluderAnchor.group.add(occluder.scene);


    const glasses = await loadGLTF('../../Assets/glasses1/scene.gltf');
    glasses.scene.renderOrder = 1;
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



