//three + vRoid

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';

// ==============================
// VRM MODEL
// ==============================

const container = document.getElementById('vrm-container');

if (container) {

    // Scene
    const scene = new THREE.Scene();
    const lookAtTarget = new THREE.Object3D();
    lookAtTarget.position.set(0, 1.3, 5);
    scene.add(lookAtTarget);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(1, 1, 3);
    camera.lookAt(0, .9, .5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // VRM Loader

    const loader = new GLTFLoader();

    loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
    });

    //マウス位置取得(視線追従)
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    //頭の角度初期設定
    let head = null;
    let headBaseRotation = {
        x: 0,
        y: 0
    };

    //首の角度初期設定
    let neck = null;
    let neckBaseRotation = {
        x: 0,
        y: 0
    };

    let currentVrm = null;

    //まばたき時間初期設定
    let elapsedTime = 0;
    let nextBlinkTime = 2;
    let blinkStartTime = -1;

    const blinkDuration = 0.16;

    //VRM読み込み

    loader.load(
        `${import.meta.env.BASE_URL}models/model.vrm`,
        async (gltf) => {

            currentVrm = gltf.userData.vrm;

            currentVrm.scene.rotation.y = Math.PI;

            scene.add(currentVrm.scene);

            await renderer.compileAsync(scene, camera);

            // 頭のボーンを取得
            head = currentVrm.humanoid.getNormalizedBoneNode('head');

            // 初期角度を保存
            headBaseRotation = {
                x: head.rotation.x,
                y: head.rotation.y
            };

            // 首のボーンを取得
            neck = currentVrm.humanoid.getNormalizedBoneNode('neck');

            // 首の初期角度を保存
            if (neck) {
                neckBaseRotation = {
                    x: neck.rotation.x,
                    y: neck.rotation.y
                };
            }

            // モデルの向きを調整
            currentVrm.scene.rotation.y = 0;

            if (currentVrm.lookAt) {
                currentVrm.lookAt.target = lookAtTarget;
            }

            // 最初のレンダリング
            renderer.render(scene, camera);

            // 描画完了を通知
            window.dispatchEvent(
                new Event("vrm-rendered")
            );

            console.log('VRM loaded!', currentVrm);
        },

        // 読み込み進捗
        (progress) => {
            if (progress.total > 0) {
                const percent =
                    (progress.loaded / progress.total) * 100;

                console.log(`Loading: ${percent.toFixed(1)}%`);
            }
        },

        // エラー
        (error) => {
            console.error("VRM loading failed:", error);
        }
    );

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        elapsedTime += delta;

        // ==============================
        // 視線追従
        // ==============================
        lookAtTarget.position.x = mouseX * 3;
        lookAtTarget.position.y = 1.3 - mouseY * 3.9;

        // ==============================
        // 顔の追従
        // ==============================

        // マウスの位置に応じて目標角度を計算
        const targetHeadY = headBaseRotation.y + mouseX * 0.3;
        const targetHeadX = headBaseRotation.x + mouseY * 0.15;

        // 滑らかに回転させる
        if (currentVrm && head) {
            head.rotation.y = THREE.MathUtils.lerp(
                head.rotation.y,
                targetHeadY,
                0.08
            );

            head.rotation.x = THREE.MathUtils.lerp(
                head.rotation.x,
                targetHeadX,
                0.08
            );
        }

        // ==============================
        // 首の追従
        // ==============================

        if (neck) {

            const targetNeckY = neckBaseRotation.y + mouseX * 0.12;
            const targetNeckX = neckBaseRotation.x + mouseY * 0.06;

            neck.rotation.y = THREE.MathUtils.lerp(
                neck.rotation.y,
                targetNeckY,
                0.08
            );

            neck.rotation.x = THREE.MathUtils.lerp(
                neck.rotation.x,
                targetNeckX,
                0.08
            );
        }

        // ==============================
        // まばたき
        // ==============================

        // 次のまばたきタイミング
        if (elapsedTime >= nextBlinkTime) {
            blinkStartTime = elapsedTime;
            nextBlinkTime = elapsedTime + 2.5 + Math.random() * 3.5;
        }

        let blinkValue = 0;

        if (blinkStartTime >= 0) {
            const progress = (elapsedTime - blinkStartTime) / blinkDuration;

            if (progress < 1) {
                blinkValue = progress < 0.5
                    ? progress * 2
                    : (1 - progress) * 2;
            } else {
                blinkStartTime = -1;
            }
        }

        // ==============================
        // VRM更新
        // ==============================
        if (currentVrm) {
            currentVrm.expressionManager?.setValue('blink', blinkValue);
            currentVrm.update(delta);
        }

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {

        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    });

}

//e:vrm