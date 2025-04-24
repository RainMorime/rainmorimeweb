import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, usePlane, Debug } from '@react-three/cannon';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import Tesseract from './Tesseract'; // Import the Tesseract component

// Invisible plane for the ground
function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow> {/* Make plane receive shadows if needed */} 
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#050a11" transparent opacity={0} /> {/* Invisible */} 
    </mesh>
  );
}

// Helper component to contain the useFrame logic
function SceneLogic({ isConnecting, tesseractRef, batteryPosition3D, setConnectionLinePoints }) {
  useFrame(({ camera }) => {
    if (isConnecting && tesseractRef.current && batteryPosition3D) {
      const tesseractWorldPos = new THREE.Vector3();
      // Access the actual mesh ref inside the Tesseract component if possible
      const physicsMesh = tesseractRef.current.meshRef ? tesseractRef.current.meshRef.current : tesseractRef.current;
      
      if (physicsMesh) {
        physicsMesh.getWorldPosition(tesseractWorldPos);

        // Convert battery NDC to world space using the current camera
        const batteryWorldPos = new THREE.Vector3(batteryPosition3D.x, batteryPosition3D.y, 0.5); // Start with NDC
        batteryWorldPos.unproject(camera);
        const dir = batteryWorldPos.sub(camera.position).normalize();
        const distance = (batteryPosition3D.z - camera.position.z) / dir.z; // Project onto a plane at z=0 relative to battery
        const finalBatteryWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

        // Clamp positions slightly to avoid extreme line lengths if something goes wrong
        tesseractWorldPos.clampLength(0, 50); 
        finalBatteryWorldPos.clampLength(0, 50);

        setConnectionLinePoints([tesseractWorldPos, finalBatteryWorldPos]);
      } else {
         // Optionally reset points if the ref is lost
         // setConnectionLinePoints([new THREE.Vector3(), new THREE.Vector3()]);
      }
    }
  });
  return null; // This component doesn't render anything itself
}

// Main 3D Scene Component
const TesseractExperience = ({ chargeBattery, isActivated }) => {
  const [batteryPosition3D, setBatteryPosition3D] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const tesseractRef = useRef(); // Ref to access Tesseract component
  const [connectionLinePoints, setConnectionLinePoints] = useState([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]);

  // Get battery DOM element position and convert to NDC
  useEffect(() => {
    // Use attribute selector which is more robust with CSS Modules
    const batterySelector = '[class*="powerDisplay"]'; 
    const batteryElement = document.querySelector(batterySelector);

    if (!batteryElement) {
      console.error("Could not find battery element using selector:", batterySelector);
      return; // Stop if element not found
    }

    const updatePosition = () => {
      const rect = batteryElement.getBoundingClientRect();
      // Ensure rect dimensions are valid before calculating
      if (rect.width > 0 && rect.height > 0 && window.innerWidth > 0 && window.innerHeight > 0) {
        const x = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
        const y = -(rect.top + rect.height / 2) / window.innerHeight * 2 + 1;
        // Use a small positive z-value to ensure it's in front of the camera's near plane
        setBatteryPosition3D({ x, y, z: 0.1 }); 
      } else {
        setBatteryPosition3D(null); 
      }
    };

    updatePosition(); // Initial position
    window.addEventListener('resize', updatePosition);
    
    // Also update on scroll potentially, if layout shifts
    const scrollSelector = '[class*="contentWrapper"]'; // Use attribute selector
    const scrollContainer = document.querySelector(scrollSelector); // Adjust if needed
    
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updatePosition);
    } else {
        window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
       if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', updatePosition);
       } else {
          window.removeEventListener('scroll', updatePosition);
       }
    };
  }, []);

  const handleConnectChange = (connecting) => {
    if (connecting !== isConnecting) {
      setIsConnecting(connecting);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 2, pointerEvents: 'none' }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="red" />
          <pointLight position={[0, 5, -10]} intensity={0.8} color="blue" />

          {/* Conditionally render Physics and Tesseract only when activated */}
          {isActivated && (
            <Physics gravity={[0, -9.82, 0]}>
              {/* <Debug color="black" scale={1.1}> */}
                <Plane position={[0, -3, 0]} /> {/* --- MODIFY: Lower the ground plane from -2.23 --- */}
                {batteryPosition3D && (
                  <Tesseract
                    ref={tesseractRef}
                    position={[-3, 5, 0]} // Start position
                    batteryPosition3D={batteryPosition3D}
                    onConnectChange={handleConnectChange}
                    chargeBattery={chargeBattery}
                  />
                )}
              {/* </Debug> */} 
            </Physics>
          )}

          {/* Render connection line (conditionally based on isConnecting state) */}
          {isActivated && isConnecting && (
            <Line
              points={connectionLinePoints}
              color="cyan"
              lineWidth={2}
              dashed={false}
            />
          )}

          {/* Render SceneLogic only when activated and potentially connecting */}
          {isActivated && (
             <SceneLogic 
                isConnecting={isConnecting} 
                tesseractRef={tesseractRef} 
                batteryPosition3D={batteryPosition3D} 
                setConnectionLinePoints={setConnectionLinePoints}
             />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TesseractExperience; 