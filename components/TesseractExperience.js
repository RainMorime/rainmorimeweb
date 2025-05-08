import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, usePlane, Debug } from '@react-three/cannon';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import Tesseract from './Tesseract'; // 导入 Tesseract 组件

// 物理碰撞的不可见地面
function Plane(props) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // 水平旋转
    material: {
      restitution: 0.3, // 弹性
    },
    ...props
  }));
  return (
    <mesh ref={ref} receiveShadow> {/* 接收阴影 */}
      <planeGeometry args={[100, 100]} /> {/* 尺寸 */}
      <meshStandardMaterial color="#050a11" transparent opacity={0} /> {/* 透明 */}
    </mesh>
  );
}

// 场景逻辑处理 (例如更新连接线)
function SceneLogic({ isConnecting, tesseractRef, batteryPosition3D, setConnectionLinePoints }) {
  useFrame(({ camera }) => {
    // Tesseract 正在连接且相关引用和位置存在
    if (isConnecting && tesseractRef.current && batteryPosition3D) {
      const tesseractWorldPos = new THREE.Vector3();
      // 获取 Tesseract 的物理实体引用
      const physicsMesh = tesseractRef.current.meshRef ? tesseractRef.current.meshRef.current : tesseractRef.current;
      
      if (physicsMesh) {
        physicsMesh.getWorldPosition(tesseractWorldPos); // 获取 Tesseract 世界坐标

        // 将电池的 NDC 坐标转换为世界坐标
        const batteryWorldPos = new THREE.Vector3(batteryPosition3D.x, batteryPosition3D.y, 0.5);
        batteryWorldPos.unproject(camera);
        const dir = batteryWorldPos.sub(camera.position).normalize();
        const distance = (batteryPosition3D.z - camera.position.z) / dir.z;
        const finalBatteryWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

        // 限制坐标范围，防止线条过长
        tesseractWorldPos.clampLength(0, 50); 
        finalBatteryWorldPos.clampLength(0, 50);

        // 更新连接线端点
        setConnectionLinePoints([tesseractWorldPos, finalBatteryWorldPos]);
      } else {
         // 可选: 若 Tesseract 引用丢失，重置连接线点
         // setConnectionLinePoints([new THREE.Vector3(), new THREE.Vector3()]);
      }
    }
  });
  return null; // 不渲染任何可见内容
}

// Tesseract 3D 场景主组件
const TesseractExperience = ({ chargeBattery, isActivated, isInverted }) => {
  const [batteryPosition3D, setBatteryPosition3D] = useState(null); // 电池 3D NDC 坐标
  const [isConnecting, setIsConnecting] = useState(false); // Tesseract 是否连接到电池
  const tesseractRef = useRef(); // Tesseract 组件引用
  const [isTesseractDragging, setIsTesseractDragging] = useState(false); // Tesseract 是否被拖拽
  const glRef = useRef(null); // R3F Canvas WebGLRenderer 实例引用
  const [connectionLinePoints, setConnectionLinePoints] = useState([ // 连接线起点和终点
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]);

  // 获取电池图标 DOM 位置并转换为 NDC 坐标
  useEffect(() => {
    const batterySelector = '[class*="powerDisplay"]'; // 电池容器选择器
    const batteryElement = document.querySelector(batterySelector);

    if (!batteryElement) {
      console.error("[TesseractExperience] 找不到电池元素，选择器:", batterySelector);
      setBatteryPosition3D(null);
      return;
    }

    const updatePosition = () => {
      const canvasElement = glRef.current?.domElement; // Canvas DOM 元素
      const iconSelector = '[class*="batteryIcon"]'; // 电池图标选择器
      const iconElement = batteryElement.querySelector(iconSelector);

      if (!canvasElement) {
        console.error("[TesseractExperience] Canvas 元素未找到 (glRef)。");
        setBatteryPosition3D(null);
        return;
      }
      if (!iconElement) {
        console.error("[TesseractExperience] 在 powerDisplay 中找不到电池图标元素。");
        setBatteryPosition3D(null);
        return;
      }

      const canvasRect = canvasElement.getBoundingClientRect();
      const iconRect = iconElement.getBoundingClientRect(); // 图标边界框

      // 确保矩形尺寸有效
      if (iconRect.width > 0 && iconRect.height > 0 && canvasRect.width > 0 && canvasRect.height > 0) {
        // 计算图标相对于 Canvas 的中心点 (右侧偏移模拟电池正极)
        const relativeX = (iconRect.right + 4) - canvasRect.left;
        const relativeY = (iconRect.top + iconRect.height / 2) - canvasRect.top;

        // Canvas 内相对坐标转换为 NDC (-1 到 1)
        const canvasNdcX = (relativeX / canvasRect.width) * 2 - 1;
        const canvasNdcY = -(relativeY / canvasRect.height) * 2 + 1;
        
        // 设置 3D 位置 (NDC 坐标), z 设为 0.1 确保在相机近平面之前
        const newPosition = { x: canvasNdcX, y: canvasNdcY, z: 0.1 }; 
        setBatteryPosition3D(newPosition); 
      } else {
        console.warn('[TesseractExperience] 无效的矩形尺寸，无法计算电池位置。');
        setBatteryPosition3D(null); 
      }
    };

    // 延迟执行首次位置计算
    const initialTimeoutId = setTimeout(updatePosition, 100);

    window.addEventListener('resize', updatePosition); // 监听窗口大小变化
    
    // 监听内容区域滚动
    const scrollSelector = '[class*="contentWrapper"]'; // 内容滚动容器选择器
    const scrollContainer = document.querySelector(scrollSelector);
    
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updatePosition);
    } else {
        console.warn('[TesseractExperience] 找不到滚动容器，将在 window 上监听滚动。');
        window.addEventListener('scroll', updatePosition);
    }

    return () => { // 清理
      clearTimeout(initialTimeoutId);
      window.removeEventListener('resize', updatePosition);
       if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', updatePosition);
       } else {
          window.removeEventListener('scroll', updatePosition);
       }
    };
  }, []); // 仅在挂载和卸载时运行

  // 根据 Tesseract 拖拽状态，控制 Canvas 鼠标事件响应
  // 拖拽时允许 Canvas 捕获事件，否则禁用以允许下方 UI 交互
  useEffect(() => {
    const canvas = glRef.current?.domElement;
    if (canvas) {
      canvas.style.pointerEvents = isTesseractDragging ? 'auto' : 'none';
    }
  }, [isTesseractDragging]);

  // 更新连接状态回调
  const handleConnectChange = (connecting) => {
    if (connecting !== isConnecting) { // 仅当状态变化时更新
      setIsConnecting(connecting);
    }
  };

  return (
    // 3D Canvas 容器 div
    <div style={{ 
      position: 'fixed', 
      top: '17.5vh',    // 匹配 UI 红色区域顶部
      left: '7.3vw',   // 匹配红色区域左侧
      width: '40.2vw',  // 匹配红色区域宽度
      height: '65vh', // 匹配红色区域高度
      zIndex: 7, // 层级
      pointerEvents: 'none', // 容器不响应鼠标事件
    }}>
      <Canvas
        shadows // 启用阴影
        camera={{ position: [-3, -1, 8], fov: 50 }} // 相机
        style={{ 
          background: 'transparent', // 背景透明
          userSelect: 'none', // 禁用文本选择
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
        gl={{ alpha: true }} // WebGL 透明背景
        onCreated={({ gl }) => { // Canvas 创建后
          glRef.current = gl; // 存储 WebGLRenderer
          gl.setClearColor(new THREE.Color(0, 0, 0), 0); // 清除颜色为透明
        }}
      >
        <Suspense fallback={null}> {/* 异步加载占位符 */}
          {/* 灯光 */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow // 平行光投射阴影
            shadow-mapSize-width={1024} // 阴影贴图分辨率
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="red" />
          <pointLight position={[0, 5, -10]} intensity={0.8} color="blue" />

          {/* 激活时渲染物理世界和 Tesseract */}
          {isActivated && (
            <Physics gravity={[0, -9.82, 0]}> {/* 物理世界及重力 */}
              <Plane position={[0, -3, 0]} /> {/* 地面 */} 
              {batteryPosition3D ? ( // 电池位置计算完成后渲染 Tesseract
                <Tesseract
                  ref={tesseractRef}
                  position={[0, 1, 0]} // Tesseract 初始位置 (Y 轴会被物理引擎覆盖)
                  batteryPosition3D={batteryPosition3D}
                  onConnectChange={handleConnectChange}
                  chargeBattery={chargeBattery}
                  onDraggingChange={setIsTesseractDragging} // 拖拽状态回调
                  isInverted={isInverted} // 反色状态
                />
              ) : (
                 null // 电池位置未就绪则不渲染 Tesseract
              )}
              {/* <Debug color="blue" scale={1.1} /> */} {/* 可选: 物理调试视图 */}
            </Physics>
          )}
          {/* 激活且连接时渲染连接线 */}
          {isActivated && isConnecting && (
            <Line
              points={connectionLinePoints} // 连接线端点
              color="#888888" // 线条颜色
              lineWidth={2} // 线条宽度
              dashed={false}
            />
          )}
          {/* 场景逻辑辅助组件 */}
          {isActivated && (
             <SceneLogic 
                isConnecting={isConnecting} 
                tesseractRef={tesseractRef} 
                batteryPosition3D={batteryPosition3D} 
                setConnectionLinePoints={setConnectionLinePoints} // 更新连接线点的函数
             />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TesseractExperience; 