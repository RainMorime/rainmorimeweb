import React, { useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon'; // Import useBox
import { useCompoundBody } from '@react-three/cannon'; // Use compound body for better shape
import * as THREE from 'three';

const Tesseract = forwardRef(({ position, batteryPosition3D, onConnectChange, chargeBattery }, ref) => {
  const meshRef = useRef();
  const connectionLineRef = useRef(); // Ref for potential direct manipulation
  const chargeCooldownRef = useRef(false); // Ref to manage charging cooldown

  // Tesseract Geometry Constants
  const outerSize = 0.4;
  const innerSize = 0.2;
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;

  // Define vertices for the two cubes
  const vertices = useMemo(() => {
    const v = [];
    // Outer cube vertices
    for (let i = 0; i < 8; i++) {
      v.push(new THREE.Vector3(
        (i & 1 ? 1 : -1) * halfOuter,
        (i & 2 ? 1 : -1) * halfOuter,
        (i & 4 ? 1 : -1) * halfOuter
      ));
    }
    // Inner cube vertices
    for (let i = 0; i < 8; i++) {
      v.push(new THREE.Vector3(
        (i & 1 ? 1 : -1) * halfInner,
        (i & 2 ? 1 : -1) * halfInner,
        (i & 4 ? 1 : -1) * halfInner
      ));
    }
    return v;
  }, [halfOuter, halfInner]);

  // Define edges (indices into vertices array)
  const edges = useMemo(() => {
    const e = [];
    // Outer cube edges
    const outerEdges = [
      [0, 1], [1, 3], [3, 2], [2, 0],
      [4, 5], [5, 7], [7, 6], [6, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    // Inner cube edges
    const innerEdges = outerEdges.map(edge => edge.map(v => v + 8));
    // Connecting edges
    const connectingEdges = [];
    for (let i = 0; i < 8; i++) {
      connectingEdges.push([i, i + 8]);
    }
    return [...outerEdges, ...innerEdges, ...connectingEdges];
  }, []);

  // Create geometry for LineSegments
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

  // Physics Body - using a simplified single box for now
  // TODO: Replace with useCompoundBody for better accuracy if needed
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position: position || [0, 5, 0],
    args: [outerSize, outerSize, outerSize],
    linearDamping: 0.1, // Add some damping
    angularDamping: 0.5,
  }), meshRef); // Link physics body to the mesh group

  // Expose API to parent component if necessary (e.g., to get position)
  useImperativeHandle(ref, () => ({ 
    getPosition: () => meshRef.current?.position,
    // Add other methods if needed
  }));

  // Frame loop for interaction logic
  useFrame(({ camera }) => {
    if (!meshRef.current || !batteryPosition3D) return;

    // 1. Get current tesseract world position
    const tesseractWorldPos = new THREE.Vector3();
    meshRef.current.getWorldPosition(tesseractWorldPos);

    // 2. Convert battery NDC to world space using the current camera
    // This is more accurate than the fixed z approach in the parent
    const batteryWorldPos = new THREE.Vector3(batteryPosition3D.x, batteryPosition3D.y, 0.5);
    batteryWorldPos.unproject(camera);
    // Direction vector from camera to the unprojected point
    const dir = batteryWorldPos.sub(camera.position).normalize();
    // Calculate distance from camera to a plane intersecting the battery z
    // This gives a better estimate of the world position
    const distance = (batteryPosition3D.z - camera.position.z) / dir.z;
    const finalBatteryWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

    // 3. Calculate distance
    const dist = tesseractWorldPos.distanceTo(finalBatteryWorldPos);
    const connectionThreshold = 1.5; // Distance threshold for connection

    // 4. Check for connection
    let currentlyConnecting = false;
    if (dist < connectionThreshold) {
      currentlyConnecting = true;
      // Update line points (passed via prop or context later)
      // For now, just log or update state
      // linePoints prop is not directly accessible here, need parent to handle line

      // Trigger charging with cooldown
      if (!chargeCooldownRef.current) {
        chargeBattery();
        chargeCooldownRef.current = true;
        // Set cooldown timer (e.g., 200ms)
        setTimeout(() => {
          chargeCooldownRef.current = false;
        }, 200);
      }
    }

    // Notify parent about connection status change
    onConnectChange(currentlyConnecting);

    // Optional: Rotate the tesseract slowly
    // api.angularVelocity.set(0.1, 0.2, 0.1); // Apply some spin via physics
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.007;

  });

  return (
    <group ref={meshRef}> {/* Group to hold lines and potentially other parts */} 
      <lineSegments geometry={lineGeometry} ref={physicsRef}> {/* Assign physicsRef to lineSegments */} 
        <lineBasicMaterial color="#888888" linewidth={2} /> {/* Changed color to match HUD gray */}
      </lineSegments>
      {/* Optional: Add small spheres at vertices */}
      {/* {vertices.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="cyan" />
        </mesh>
      ))} */}
    </group>
  );
});

Tesseract.displayName = 'Tesseract'; // Add display name for forwardRef

export default Tesseract; 