import React, { useRef, useState, useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

// Restore the Tesseract component with custom drag handlers and interaction mesh
const Tesseract = forwardRef(({ position, batteryPosition3D, onConnectChange, chargeBattery, onDraggingChange, isInverted }, ref) => {
  const groupRef = useRef(); // Use groupRef as the main reference
  const coreRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const chargeCooldownRef = useRef(false);
  const dragStartPos = useRef(new THREE.Vector3());
  const dragStartMouse = useRef({ x: 0, y: 0 });
  const { camera, mouse, viewport } = useThree();
  
  // --- NEW: Refs/Memo for reusable THREE objects during drag ---
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetPlane = useRef(new THREE.Plane());
  const planeNormal = useRef(new THREE.Vector3());
  const mouseNDC = useMemo(() => new THREE.Vector2(), []); // Reusable Vector2 for mouse NDC

  const outerSize = 0.4;
  const innerSize = 0.2;
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;

  // Apply physics to the group
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position: position ? [position[0], Math.max(position[1], 8), position[2]] : [0, 8, 0],
    args: [outerSize, outerSize, outerSize],
    linearDamping: 0.1,
    angularDamping: 0.5,
    allowSleep: false,
    material: {
      restitution: 0.8,
    }
  }), groupRef);

  // Geometry calculations (unchanged)
  const vertices = useMemo(() => {
    const v = [];
    for (let i = 0; i < 8; i++) { /* outer vertices */ v.push(new THREE.Vector3((i & 1 ? 1 : -1) * halfOuter, (i & 2 ? 1 : -1) * halfOuter, (i & 4 ? 1 : -1) * halfOuter)); }
    for (let i = 0; i < 8; i++) { /* inner vertices */ v.push(new THREE.Vector3((i & 1 ? 1 : -1) * halfInner, (i & 2 ? 1 : -1) * halfInner, (i & 4 ? 1 : -1) * halfInner)); }
    return v;
  }, [halfOuter, halfInner]);
  const edges = useMemo(() => {
    const e = [];
    const outerEdges = [ [0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7] ];
    const innerEdges = outerEdges.map(edge => edge.map(v => v + 8));
    const connectingEdges = []; for (let i = 0; i < 8; i++) { connectingEdges.push([i, i + 8]); }
    return [...outerEdges, ...innerEdges, ...connectingEdges];
  }, []);
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry(); const points = [];
    edges.forEach(([startIdx, endIdx]) => { points.push(vertices[startIdx].x, vertices[startIdx].y, vertices[startIdx].z); points.push(vertices[endIdx].x, vertices[endIdx].y, vertices[endIdx].z); });
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, [vertices, edges]);

  // Custom drag handlers (targeting groupRef)
  const handlePointerDown = (e) => {
    console.log("Pointer Down Event triggered!");
    e.stopPropagation();
    setIsDragging(true);
    // --- NEW: Notify parent about drag start ---
    onDraggingChange?.(true);
    if (groupRef.current) { 
      dragStartPos.current.copy(groupRef.current.position); 
      dragStartMouse.current = { x: mouse.x, y: mouse.y }; 
      
      // --- NEW: Define the drag plane on pointer down --- 
      planeNormal.current.copy(camera.getWorldDirection(new THREE.Vector3()).negate());
      targetPlane.current.setFromNormalAndCoplanarPoint(planeNormal.current, dragStartPos.current);
    }
    e.target.setPointerCapture(e.pointerId);
  };
  const handlePointerUp = (e) => {
    console.log("Pointer Up Event triggered!");
    e.stopPropagation();
    if (e.target.hasPointerCapture(e.pointerId)) { e.target.releasePointerCapture(e.pointerId); }
    setIsDragging(false);
    // --- NEW: Notify parent about drag end ---
    onDraggingChange?.(false);
    // api.velocity.set(0, 2, 0); // Remove upward force on release
  };
  
  // --- MODIFIED: Keep handlePointerMove minimal, logic moved to useFrame ---
  const handlePointerMove = (e) => {
    if (!isDragging || !groupRef.current) return; // Check if dragging and ref exists
    e.stopPropagation();
    // --- REMOVED: Raycasting and position setting logic moved to useFrame --- 
  };

  // Expose API
  useImperativeHandle(ref, () => ({ getPosition: () => groupRef.current?.position, meshRef: groupRef }));

  // Frame logic
  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // --- 新增: 旋转能量核心 ---
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.015;
      coreRef.current.rotation.y += 0.02;
    }
    // --- 结束新增 ---

    let currentlyConnecting = false; // Default state for this frame

    // --- Logic for when the Tesseract is being dragged ---
    if (isDragging) {
      // Update position based on mouse/raycaster
      mouseNDC.set(mouse.x, mouse.y); 
      raycaster.setFromCamera(mouseNDC, camera);
      if (raycaster.ray.intersectPlane(targetPlane.current, targetPosition)) {
        api.position.set(targetPosition.x, targetPosition.y, targetPosition.z); 
        api.velocity.set(0, 0, 0); 
        api.angularVelocity.set(0, 0, 0);

        // --- NEW: Check distance and charge ONLY while dragging ---
        if (batteryPosition3D) { 
          const tesseractWorldPos = targetPosition; // Use the calculated target position
          // Or: groupRef.current.getWorldPosition(tesseractWorldPos); // If physics update is needed
          
          const batteryWorldPos = new THREE.Vector3(batteryPosition3D.x, batteryPosition3D.y, 0.5);
          batteryWorldPos.unproject(camera);
          const dir = batteryWorldPos.sub(camera.position).normalize();
          const distance = (batteryPosition3D.z - camera.position.z) / dir.z;
          const finalBatteryWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));
          
          const dist = tesseractWorldPos.distanceTo(finalBatteryWorldPos);
          
          if (dist < 2.5) { // Check distance threshold
            currentlyConnecting = true; // Set connection state true
            // Charge only if dragging and close enough
            if (!chargeCooldownRef.current) { 
              chargeBattery(); 
              chargeCooldownRef.current = true; 
              setTimeout(() => { chargeCooldownRef.current = false; }, 200); 
            }
          } 
          // If dragging but not close enough, currentlyConnecting remains false
        }
        // If no batteryPosition3D while dragging, currentlyConnecting remains false

      } else {
        // console.warn("Drag: Raycaster intersection failed.");
        // If intersection fails, ensure not connecting
        currentlyConnecting = false; 
      }
    } 
    // --- Logic for when the Tesseract is NOT being dragged ---
    else { 
      // Not dragging, so not connecting/charging
      currentlyConnecting = false;
      
      // Apply rotation only when not dragging
      groupRef.current.rotation.x += 0.005;
      groupRef.current.rotation.y += 0.007;

      // --- REMOVED: Charging logic moved to isDragging block ---
      /*
      if (batteryPosition3D) { 
        const tesseractWorldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(tesseractWorldPos);
        const batteryWorldPos = new THREE.Vector3(batteryPosition3D.x, batteryPosition3D.y, 0.5);
        batteryWorldPos.unproject(camera);
        const dir = batteryWorldPos.sub(camera.position).normalize();
        const distance = (batteryPosition3D.z - camera.position.z) / dir.z;
        const finalBatteryWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));
        const dist = tesseractWorldPos.distanceTo(finalBatteryWorldPos);
        // let currentlyConnecting = false; // Moved outside
        if (dist < 2.5) { 
          currentlyConnecting = true;
          // --- CHARGING LOGIC REMOVED FROM HERE --- 
          // if (!chargeCooldownRef.current) { chargeBattery(); chargeCooldownRef.current = true; setTimeout(() => { chargeCooldownRef.current = false; }, 200); }
        }
        // onConnectChange(currentlyConnecting); // Moved outside
      }
      */
    }

    // --- Update connection state at the end of the frame logic ---
    onConnectChange(currentlyConnecting);
  });

  return (
    <group ref={groupRef}>
      {/* Visual Tesseract Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={hovered ? "#aaaaff" : "#888888"} linewidth={3} />
      </lineSegments>

      {/* --- 新增: 能量核心 --- */}
      <mesh ref={coreRef} castShadow> {/* 核心也投射阴影 */}
        <octahedronGeometry args={[0.08]} /> {/* 菱形几何体，尺寸略小于内部空间 */}
        <meshBasicMaterial 
          color={isInverted ? '#E08FFF' : '#B2F2BB'} // 满电粉紫，否则高亮绿
          wireframe={true}      // 设置为线框模式
        />
      </mesh>
      {/* --- 结束新增 --- */}

      {/* Interaction Helper Mesh */}
      <mesh
        visible={false}
        scale={[outerSize * 1.5, outerSize * 1.5, outerSize * 1.5]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
});

Tesseract.displayName = 'Tesseract';
export default Tesseract; 