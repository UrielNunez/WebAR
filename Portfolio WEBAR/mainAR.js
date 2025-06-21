import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
//import {mockWithVideo, mockWithImage} from '../Assets/camera-mock.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadGLTF, loadAudio, loadVideo } from '../Assets/loader.js'
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


        // start AR
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            cssRenderer.render(cssScene, camera);
        });
    }
    start();
});
