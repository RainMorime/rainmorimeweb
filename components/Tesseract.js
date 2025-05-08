import React, { useRef, useState, useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

// 可拖拽、可交互的 Tesseract (超立方体) 组件
const Tesseract = forwardRef(({ 
  position,           // 初始位置
  batteryPosition3D, // 电池在 3D 空间中的位置 (用于连接线和充电逻辑)
  onConnectChange,    // 连接状态变化时的回调
  chargeBattery,      // 充电函数回调
  onDraggingChange,   // 拖拽状态变化时的回调
  isInverted          // 是否处于反色 (满电) 状态，影响核心颜色
}, ref) => {
  const groupRef = useRef(); // Group 引用，作为物理实体和主要操作对象
  const coreRef = useRef();  // 能量核心 Mesh 引用
  const [hovered, setHovered] = useState(false); // 鼠标悬停状态
  const [isDragging, setIsDragging] = useState(false); // 是否正在被拖拽
  const chargeCooldownRef = useRef(false); // 充电冷却状态引用，防止短时间多次触发
  const dragStartPos = useRef(new THREE.Vector3()); // 拖拽开始时 Tesseract 的位置
  // const dragStartMouse = useRef({ x: 0, y: 0 }); // 拖拽开始时鼠标位置 (当前未使用)
  const { camera, mouse /*, viewport*/ } = useThree(); // R3F hooks 获取相机、鼠标等
  
  // Three.js 对象引用和缓存 (用于拖拽计算)
  const raycaster = useMemo(() => new THREE.Raycaster(), []); // 光线投射器
  const targetPosition = useMemo(() => new THREE.Vector3(), []); // 拖拽目标位置
  const targetPlane = useRef(new THREE.Plane()); // 拖拽时鼠标在其上移动的虚拟平面
  const planeNormal = useRef(new THREE.Vector3()); // 拖拽平面的法线
  const mouseNDC = useMemo(() => new THREE.Vector2(), []); // 存储鼠标 NDC 坐标

  // Tesseract 尺寸定义
  const outerSize = 0.4; // 外层立方体边长
  const innerSize = 0.2; // 内层立方体边长
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;

  // Cannon.js 物理引擎设置 (应用到 groupRef)
  const [physicsRef, api] = useBox(() => ({
    mass: 1, // 质量
    position: position ? [position[0], Math.max(position[1], 8), position[2]] : [0, 8, 0], // 初始位置 (确保 Y 不低于8)
    args: [outerSize, outerSize, outerSize], // 物理边界盒尺寸
    linearDamping: 0.1, // 线性阻尼 (减速)
    angularDamping: 0.5, // 角度阻尼 (旋转减速)
    allowSleep: false, // 不允许物体休眠
    material: {
      restitution: 0.8, // 弹性 (碰撞反弹系数)
    }
  }), groupRef);

  // 计算 Tesseract 的顶点 (缓存)
  const vertices = useMemo(() => {
    const v = [];
    for (let i = 0; i < 8; i++) v.push(new THREE.Vector3((i & 1 ? 1 : -1) * halfOuter, (i & 2 ? 1 : -1) * halfOuter, (i & 4 ? 1 : -1) * halfOuter)); // 外层顶点
    for (let i = 0; i < 8; i++) v.push(new THREE.Vector3((i & 1 ? 1 : -1) * halfInner, (i & 2 ? 1 : -1) * halfInner, (i & 4 ? 1 : -1) * halfInner)); // 内层顶点
    return v;
  }, [halfOuter, halfInner]);
  // 计算 Tesseract 的边 (缓存)
  const edges = useMemo(() => {
    const e = [];
    const outerEdges = [ [0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7] ]; // 外层边
    const innerEdges = outerEdges.map(edge => edge.map(v => v + 8)); // 内层边 (顶点索引+8)
    const connectingEdges = []; for (let i = 0; i < 8; i++) { connectingEdges.push([i, i + 8]); } // 连接内外层的边
    return [...outerEdges, ...innerEdges, ...connectingEdges];
  }, []);
  // 创建 Tesseract 线框几何体 (缓存)
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry(); 
    const points = [];
    edges.forEach(([startIdx, endIdx]) => { 
      points.push(vertices[startIdx].x, vertices[startIdx].y, vertices[startIdx].z);
      points.push(vertices[endIdx].x, vertices[endIdx].y, vertices[endIdx].z); 
    });
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, [vertices, edges]);

  // 鼠标按下事件处理 (开始拖拽)
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    onDraggingChange?.(true); // 通知父组件开始拖拽
    if (groupRef.current) { 
      dragStartPos.current.copy(groupRef.current.position); // 记录拖拽起始位置
      // dragStartMouse.current = { x: mouse.x, y: mouse.y }; // 记录鼠标起始位置 (未使用)
      
      // 定义拖拽平面：法线指向相机，并穿过拖拽起始点
      planeNormal.current.copy(camera.getWorldDirection(new THREE.Vector3()).negate());
      targetPlane.current.setFromNormalAndCoplanarPoint(planeNormal.current, dragStartPos.current);
    }
    e.target.setPointerCapture(e.pointerId); // 捕获指针事件
  };
  // 鼠标松开事件处理 (结束拖拽)
  const handlePointerUp = (e) => {
    e.stopPropagation();
    if (e.target.hasPointerCapture(e.pointerId)) { e.target.releasePointerCapture(e.pointerId); } // 释放指针捕获
    setIsDragging(false);
    onDraggingChange?.(false); // 通知父组件结束拖拽
  };
  
  // 鼠标移动事件处理 (拖拽过程中)
  const handlePointerMove = (e) => {
    if (!isDragging || !groupRef.current) return;
    e.stopPropagation();
    // 实际的位置更新逻辑已移至 useFrame 中
  };

  // 通过 ref 暴露接口给父组件
  useImperativeHandle(ref, () => ({
    getPosition: () => groupRef.current?.position, // 获取当前位置
    meshRef: groupRef // 暴露 Group 引用 (用于连接线等)
  }));

  // 每帧更新逻辑
  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // 旋转能量核心
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.015;
      coreRef.current.rotation.y += 0.02;
    }

    let currentlyConnecting = false; // 当前帧的连接状态

    // --- 正在拖拽时的逻辑 ---
    if (isDragging) {
      // 将鼠标 NDC 坐标转换为 3D 世界坐标中的拖拽目标点
      mouseNDC.set(mouse.x, mouse.y);
      raycaster.setFromCamera(mouseNDC, camera);
      if (raycaster.ray.intersectPlane(targetPlane.current, targetPosition)) {
        // 使用物理 API 将 Tesseract 瞬移到目标点 (模拟拖拽)
        api.position.set(targetPosition.x, targetPosition.y, targetPosition.z); 
        api.velocity.set(0, 0, 0); // 清除速度，避免拖拽时漂移
        api.angularVelocity.set(0, 0, 0); // 清除角速度

        // 检查与电池的距离并触发充电 (仅在拖拽时)
        if (batteryPosition3D) { 
          const tesseractWorldPos = targetPosition; // 使用计算出的拖拽目标位置
          
          // 将电池的屏幕坐标转换为 3D 世界坐标
          const batteryWorldPos = new THREE.Vector3(batteryPosition3D.x, batteryPosition3D.y, 0.5);
          batteryWorldPos.unproject(camera);
          const dir = batteryWorldPos.sub(camera.position).normalize();
          const distance = (batteryPosition3D.z - camera.position.z) / dir.z;
          const finalBatteryWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));
          
          const dist = tesseractWorldPos.distanceTo(finalBatteryWorldPos);
          
          if (dist < 2.5) { // 距离小于阈值，视为连接
            currentlyConnecting = true;
            if (!chargeCooldownRef.current) { // 检查充电冷却
              chargeBattery(); 
              chargeCooldownRef.current = true; 
              setTimeout(() => { chargeCooldownRef.current = false; }, 200); // 200ms 冷却时间
            }
          } 
        }
      } else {
        // 光线投射失败，无法确定拖拽位置，不连接
        currentlyConnecting = false; 
      }
    } 
    // --- 未拖拽时的逻辑 ---
    else { 
      currentlyConnecting = false; // 未拖拽，肯定不连接
      
      // 仅在未拖拽时应用自转动画
      groupRef.current.rotation.x += 0.005;
      groupRef.current.rotation.y += 0.007;
      
      // (已移除) 之前在这里检查距离并更新连接状态，现已移至拖拽逻辑中
    }

    // 在每帧结束时，根据计算结果更新连接状态
    onConnectChange(currentlyConnecting);
  });

  return (
    <group ref={groupRef}> {/* 物理实体和根 Group */} 
      {/* Tesseract 线框 */} 
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={hovered ? "#aaaaff" : "#888888"} linewidth={3} />
      </lineSegments>

      {/* 能量核心 (旋转的八面体) */}
      <mesh ref={coreRef} castShadow>
        <octahedronGeometry args={[0.08]} />
        <meshBasicMaterial 
          color={isInverted ? '#E08FFF' : '#B2F2BB'} // 根据反色状态切换颜色
          wireframe={true} // 线框模式
        />
      </mesh>

      {/* 交互辅助 Mesh (不可见，用于捕获鼠标事件) */}
      <mesh
        visible={false}
        scale={[outerSize * 1.5, outerSize * 1.5, outerSize * 1.5]} // 放大交互范围
        onPointerDown={handlePointerDown} // 绑定鼠标按下事件
        onPointerUp={handlePointerUp}     // 绑定鼠标松开事件
        onPointerMove={handlePointerMove}   // 绑定鼠标移动事件
        onPointerOver={() => setHovered(true)} // 鼠标悬停
        onPointerOut={() => setHovered(false)} // 鼠标移出
      >
        <boxGeometry /> {/* 使用简单的立方体作为形状 */} 
        <meshBasicMaterial transparent opacity={0} /> {/* 完全透明 */} 
      </mesh>
    </group>
  );
});

Tesseract.displayName = 'Tesseract'; // 设置 displayName 便于调试
export default Tesseract; 