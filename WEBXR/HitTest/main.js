import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
    const initialize = async () => {
        // Obtener botón personalizado AR
        const arButton = document.getElementById("ar-button");

        // ✅ Verifica si el dispositivo es compatible con WebXR en modo AR
        const supported = await navigator.xr?.isSessionSupported("immersive-ar");
        if (!supported) {
            arButton.textContent = "Not Supported";
            arButton.disabled = true; // 🔧 corregido: era "disable", ahora "disabled"
            return;
        }

        // Escena básica
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Luz ambiental
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // ✅ Retícula (reticle) que indica posición del plano detectado
        const reticleGeometry = new THREE.RingGeometry(0.05, 0.1, 32).rotateX(-Math.PI / 2);
        const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // ✅ agregado color y visible por ambos lados
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.matrixAutoUpdate = false; // 🔧 necesario para actualizar solo con matriz
        reticle.visible = false; // 🔧 se activa solo cuando hay plano detectado
        scene.add(reticle);

        // Controlador XR para eventos de toque
        const controller = renderer.xr.getController(0);
        scene.add(controller);

        // ✅ Evento de selección (tap/click en AR)
        controller.addEventListener("select", () => {
            if (!reticle.visible) return; // 🔧 solo si hay plano detectado

            // Crear cubo al tocar
            const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }); // color aleatorio
            const mesh = new THREE.Mesh(geometry, material);

            // ✅ Posicionar y rotar el cubo donde está el reticle
            mesh.position.copy(reticle.position);
            mesh.quaternion.copy(reticle.quaternion);

            scene.add(mesh);
        });

        let currentSession = null;

        // Lógica del botón AR personalizado
        const start = async () => {
            // ✅ Crear sesión AR con soporte para hit-test y overlay
            currentSession = await navigator.xr.requestSession("immersive-ar", {
                requiredFeatures: ['hit-test'],
                optionalFeatures: ['dom-overlay'],
                domOverlay: { root: document.body }
            });

            renderer.xr.enabled = true;
            renderer.xr.setReferenceSpaceType('local');
            await renderer.xr.setSession(currentSession);

            // ✅ Obtener referencia y fuente de hit test
            const session = renderer.xr.getSession();
            const viewerSpace = await session.requestReferenceSpace("viewer"); // espacio del usuario
            const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
            const referenceSpace = await renderer.xr.getReferenceSpace(); // espacio local para coordenadas

            // 🔁 Bucle de animación AR
            renderer.setAnimationLoop((timestamp, frame) => {
                if (!frame) return;

                // ✅ Ejecutar hit test
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0];
                    const pose = hit.getPose(referenceSpace); // obtener posición en espacio local

                    // ✅ Actualizar matriz y descomponer a posición + rotación
                    reticle.visible = true;
                    reticle.matrix.fromArray(pose.transform.matrix);
                    reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale); // 🔧 NECESARIO para poder usar position y quaternion
                } else {
                    reticle.visible = false; // 🔧 ocultar si no hay plano detectado
                }

                // Render de la escena
                renderer.render(scene, camera);
            });

            arButton.textContent = "End"; // cambiar texto del botón
        };

        const end = async () => {
            await currentSession.end();
            renderer.clear();
            renderer.setAnimationLoop(null);
            arButton.textContent = "Start";
        };

        // Evento del botón AR
        arButton.addEventListener("click", () => {
            if (currentSession) {
                end();
                currentSession = null;
            } else {
                start();
            }
        });
    };

    initialize();
});
