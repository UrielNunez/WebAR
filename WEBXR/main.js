import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
    const initialize = async () => {

        const arButton = document.getElementById("ar-button");

        const supported = navigator.xr && navigator.xr.isSessionSupported("immersive-ar");
        if (!supported) {
            arButton.textContent = "Not Supported";
            arButton.disable = true;
            return;
        } 

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        const renderer = new THREE.WebGLRenderer({alpha: true});
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
        const material = new THREE.MeshBasicMaterial({color: 0xffbff});
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(0,0, -0.3);
        scene.add(mesh);

        let currentSession = null
        const start = async() => {
            currentSession = await navigator.xr.requestSession("immersive-ar", {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});

            renderer.xr.enabled = true;
            renderer.xr.setReferenceSpaceType('local');
            await renderer.xr.setSession(currentSession);

            arButton.textContent = "End";

            renderer.setAnimationLoop( () => {
                renderer.render(scene,camera);
            });
        }
        const end = async() =>{
            currentSession.end();
            renderer.clear();
            renderer.setAnimationLoop(null);

            arButton.style.display = "none";
        }
        arButton.addEventListener("click", () =>{
            if (currentSession) {
                end();
            } else {
                start();
            }
        });
    }
    initialize();
});