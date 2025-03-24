<template>

    <vue3dLoader :filePath="['/models/output_file.obj']" :mtlPath="['/models/material.mtl']"
        style="width:100%;height:100vh;" />

</template>
<script setup>
import { vue3dLoader } from "vue-3d-loader";
// 初始化Three.js场景
const initScene = () => {
    if (!sceneContainer.value) return;

    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        75,
        sceneContainer.value.clientWidth / sceneContainer.value.clientHeight,
        0.1,
        1000
    );
    camera.position.set(5, 5, 5);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
        sceneContainer.value.clientWidth,
        sceneContainer.value.clientHeight
    );
    sceneContainer.value.appendChild(renderer.domElement);

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 添加轨道控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 添加测试立方体
    const testGeometry = new THREE.BoxGeometry(1, 1, 1);
    const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    scene.add(testCube);

    // 动画循环
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
};
</script>