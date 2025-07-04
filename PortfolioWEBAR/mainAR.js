import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import { loadGLTF, loadAudio, loadVideo, loadFBX } from '../Assets/loader.js'
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

//PARA LOS VIDEOS DE YOUTUBE
const videoIds = ['pKSogofMfhs', 'J0kA1nhzyYY', '5f6vGwuq3ek'];
let currentVideoIndex = 0;

const createYouTube = () => {
    return new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            const player = new YT.Player('player', {
                videoId: videoIds[currentVideoIndex],
                events: {
                    onReady: () => resolve(player)
                }
            });
        };
    });
};

/*---------------TYPING EFFECT------------------*/
var typingEffect = new Typed(".typedText", {
    strings: [" Uriel Flores"],
    loop: true,
    typeSpeed: 100,
    backSpeed: 200,
    backDelay: 1000
});
var typingEffectExp = new Typed(".typedExp", {
    strings: [" Unity Developer", " Web Developer", " AR Developer", " Game Designer", " Video Editor", " VR Developer", " 3D Developer"],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    backDelay: 2000
})


document.addEventListener('DOMContentLoaded', () => {

    const start = async () => {

        const player = await createYouTube();//ESPERA PARA INICIALZIAR EL METODO

        // initialize MindAR 
        const mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: '../Targets/ImageTarget.mind',
            uiScanning: "#scanning",
            uiLoading: "no"
        });
        const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

        //objetos css a renderizar
        const obj = new CSS3DObject(document.getElementById("contenido-Tarjeta"));//contenedor principal para tamaños
        const cssAnchor = mindarThree.addCSSAnchor(0);
        cssAnchor.group.add(obj);//objetos renderizados

        //CUANDO SE PEIRDE Y ENCUENTRA LA IMAGEN
        cssAnchor.onTargetFound = () => {
            player.playVideo()
        }
        cssAnchor.onTargetLost = () => {
            player.pauseVideo();
        }

        //CAMBAIR VIDEOS CON LEFT Y RIGHT
        document.getElementById('btn-left').addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
            player.loadVideoById(videoIds[currentVideoIndex]);
        });

        document.getElementById('btn-right').addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex + 1) % videoIds.length;
            player.loadVideoById(videoIds[currentVideoIndex]);
        });

        //luz
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        const anchor = mindarThree.addAnchor(0);

        const gltf = await loadGLTF("../Assets/Modelo.glb");
        //scale model
        gltf.scene.scale.set(1, 1, 1);
        //position model
        gltf.scene.position.set(0, -1, 0)
        //model on scene
        anchor.group.add(gltf.scene);
        //ANIMATIONS TO 3D MODELS
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        const clock = new THREE.Clock();

        // start AR
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();

            cssRenderer.render(cssScene, camera);

            gltf.scene.rotation.set(0, gltf.scene.rotation.y + delta, 0);
            mixer.update(delta);
            renderer.render(scene, camera);
        });
    }
    start();
});
