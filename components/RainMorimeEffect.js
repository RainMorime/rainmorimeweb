import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 全屏背景视觉特效组件 (基于 Three.js Shader)
const RainMorimeEffect = () => {
  const mountRef = useRef(null); // 用于挂载 Three.js Canvas 的 DOM 元素引用

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // 场景设置
    const scene = new THREE.Scene();
    // 使用正交相机渲染全屏四边形
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // WebGL 渲染器，启用 alpha 以便背景透明
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight); // 设置初始尺寸
    renderer.setPixelRatio(window.devicePixelRatio); // 适配高分屏
    currentMount.appendChild(renderer.domElement);

    // 顶点着色器 (Vertex Shader)
    const vertexShader = `
      varying vec2 vUv; // 将 UV 坐标传递给片元着色器
      void main() {
        vUv = uv;
        // 直接使用模型视图投影矩阵变换顶点位置
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // 片元着色器 (Fragment Shader)
    const fragmentShader = `
      varying vec2 vUv; // 接收 UV 坐标
      uniform float time; // 时间变量，用于动画
      uniform float scanlineIntensity; // 扫描线强度
      uniform float glitchIntensity;   // 故障效果强度
      uniform float noiseIntensity;    // 噪点强度

      // 简单的伪随机数生成器
      float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        // 初始颜色为透明黑
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

        // 模拟扫描线效果
        float scanline = sin(vUv.y * 800.0 + time * 0.5) * 0.5 + 0.5; // 调整频率和速度
        color.rgb += vec3(scanline * scanlineIntensity * 0.05); // 混合非常微弱的扫描线

        // 模拟故障效果 (基于时间和随机数的水平位移)
        float glitchOffset = (rand(vec2(time * 0.1, vUv.y * 0.2)) - 0.5) * 2.0 * glitchIntensity * 0.01; // 微弱的位移量
        float glitchTrigger = step(0.995, rand(vec2(time * 0.05))); // 控制故障效果触发频率 (较低概率)
        vec2 glitchUv = vUv + vec2(glitchOffset * glitchTrigger, 0.0); // 计算带故障位移的 UV

        // 添加细微的背景噪点
        float noise = (rand(vUv + time * 0.01) - 0.5) * noiseIntensity * 0.1; // 微弱的噪点量

        // 此处本可以对背景纹理使用 glitchUv 采样，但目前仅使用噪点作为基础
        // vec4 textureColor = texture2D(backgroundTexture, glitchUv);
        // 当前简化为直接使用噪点值作为颜色，并轻微调整 alpha
        color.a = clamp(scanline * 0.02 + noise * 0.05, 0.0, 0.1); // 控制整体可见性和 alpha

        // 输出最终颜色，确保效果保持微妙
        gl_FragColor = color;
      }
    `;

    // Shader 材质
    const uniforms = { // 定义传递给 Shader 的变量
      time: { value: 0.0 },
      scanlineIntensity: { value: 0.6 }, // 扫描线强度 (0.0 - 1.0+)
      glitchIntensity: { value: 0.2 },   // 故障强度 (0.0 - 1.0+)
      noiseIntensity: { value: 0.15 }    // 噪点强度
    };
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true, // 启用透明度
      depthTest: false,  // 禁用深度测试 (因为是全屏覆盖效果)
      depthWrite: false // 禁用深度写入
    });

    // 创建一个覆盖全屏的平面几何体
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // 动画循环
    const clock = new THREE.Clock(); // 用于获取时间增量
    const animate = () => {
      // 检查资源是否准备就绪 (防御性编程)
      if (!renderer || !scene || !camera) {
        console.warn('RainMorimeEffect: 渲染器、场景或相机未就绪。');
        return;
      }
      requestAnimationFrame(animate); // 请求下一帧
      uniforms.time.value = clock.getElapsedTime(); // 更新时间 uniform
      renderer.render(scene, camera); // 渲染场景
    };
    animate(); // 启动动画

    // 处理窗口大小变化
    const handleResize = () => {
      // camera.updateProjectionMatrix(); // 正交相机通常不需要在 resize 时更新投影矩阵
      renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器尺寸
    };
    window.addEventListener('resize', handleResize);

    // 清理函数 (组件卸载时执行)
    return () => {
      window.removeEventListener('resize', handleResize); // 移除 resize 监听
      // 确保 DOM 元素存在再移除 Canvas
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
         currentMount.removeChild(renderer.domElement);
      }
      // 释放 Three.js 资源
      geometry.dispose();
      material.dispose();
      // scene.dispose(); // Scene 没有 dispose 方法
      renderer.dispose();
    };
  }, []); // 空依赖数组确保只在挂载时运行一次

  // 组件容器样式 (固定定位，覆盖全屏，位于内容之后)
  const style = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // 确保在其他内容后面
    pointerEvents: 'none' // 不响应鼠标事件
  };

  return <div ref={mountRef} style={style} />;
};

export default RainMorimeEffect;
