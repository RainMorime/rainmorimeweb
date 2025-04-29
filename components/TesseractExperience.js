import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, usePlane, Debug } from '@react-three/cannon';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import Tesseract from './Tesseract'; // Import the Tesseract component

// Invisible plane for the ground
function Plane(props) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material: {
      restitution: 0.3, // 给地面一点弹性
    },
    ...props
  }));
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
const TesseractExperience = ({ chargeBattery, isActivated, isInverted }) => {
  const [batteryPosition3D, setBatteryPosition3D] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const tesseractRef = useRef(); // Ref to access Tesseract component
  const [isTesseractDragging, setIsTesseractDragging] = useState(false);
  const glRef = useRef(null);
  const [connectionLinePoints, setConnectionLinePoints] = useState([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]);

  // Get battery DOM element position and convert to NDC
  useEffect(() => {
    console.log('[TesseractExperience] useEffect for battery position triggered.'); // DEBUG LOG
    // Use attribute selector which is more robust with CSS Modules
    const batterySelector = '[class*="powerDisplay"]'; 
    const batteryElement = document.querySelector(batterySelector);
    console.log('[TesseractExperience] Querying for battery element with selector:', batterySelector); // DEBUG LOG

    if (!batteryElement) {
      console.error("[TesseractExperience] Could not find battery element using selector:", batterySelector);
      setBatteryPosition3D(null); // Ensure state is null if element not found early
      return; // Stop if element not found
    }
    console.log('[TesseractExperience] Found battery element:', batteryElement); // DEBUG LOG

    const updatePosition = () => {
      console.log('[TesseractExperience] updatePosition function called.'); // DEBUG LOG
      const batteryRect = batteryElement.getBoundingClientRect();
      // --- NEW: Get canvas element and its bounding box ---
      const canvasElement = glRef.current?.domElement;
      // --- NEW: Find the specific battery icon element ---
      const iconSelector = '[class*="batteryIcon"]'; // Selector for the icon
      const iconElement = batteryElement.querySelector(iconSelector);
      console.log('[TesseractExperience] Querying for icon element with selector:', iconSelector); // DEBUG LOG

      if (!canvasElement) {
        console.error("[TesseractExperience] Canvas element not found via glRef.");
        setBatteryPosition3D(null);
        return;
      }
      // --- NEW: Check if icon element was found ---
      if (!iconElement) {
        console.error("[TesseractExperience] Battery icon element not found inside powerDisplay.");
        setBatteryPosition3D(null);
        return;
      }
      console.log('[TesseractExperience] Found icon element:', iconElement); // DEBUG LOG

      // --- NEW: Get icon bounding box ---
      const canvasRect = canvasElement.getBoundingClientRect();
      const iconRect = iconElement.getBoundingClientRect(); 
      console.log('[TesseractExperience] Canvas Rect:', canvasRect); // DEBUG LOG
      console.log('[TesseractExperience] Icon Rect:', iconRect); // DEBUG LOG

      // Ensure rect dimensions are valid before calculating
      // --- MODIFIED: Use iconRect for calculation ---
      if (iconRect.width > 0 && iconRect.height > 0 && canvasRect.width > 0 && canvasRect.height > 0) {
        
        // Calculate position relative to the canvas
        // --- MODIFIED: Target the right edge of the ICON + offset (positive terminal) ---
        const relativeX = (iconRect.right + 4) - canvasRect.left; // Use iconRect.right + offset
        // --- MODIFIED: Target the vertical center of the ICON ---
        const relativeY = (iconRect.top + iconRect.height / 2) - canvasRect.top; // Use iconRect center

        // Convert relative position to Canvas NDC
        const canvasNdcX = (relativeX / canvasRect.width) * 2 - 1;
        const canvasNdcY = -(relativeY / canvasRect.height) * 2 + 1;
        
        // Use a small positive z-value to ensure it's in front of the camera's near plane
        // --- MODIFIED: Use canvas NDC ---
        const newPosition = { x: canvasNdcX, y: canvasNdcY, z: 0.1 };
        console.log('[TesseractExperience] Calculated new batteryPosition3D (NDC):', newPosition); // DEBUG LOG
        setBatteryPosition3D(newPosition); 
      } else {
        console.warn('[TesseractExperience] Invalid rect dimensions, setting batteryPosition3D to null.'); // DEBUG LOG
        setBatteryPosition3D(null); 
      }
    };

    // --- MODIFIED: Add a delay before the initial call --- 
    const initialTimeoutId = setTimeout(() => {
        updatePosition(); // Initial position calculation after delay
    }, 100); // 100ms delay, adjust if needed

    window.addEventListener('resize', updatePosition);
    
    // Also update on scroll potentially, if layout shifts
    const scrollSelector = '[class*="contentWrapper"]'; // Use attribute selector
    const scrollContainer = document.querySelector(scrollSelector); // Adjust if needed
    console.log('[TesseractExperience] Querying for scroll container with selector:', scrollSelector); // DEBUG LOG
    
    if (scrollContainer) {
        console.log('[TesseractExperience] Found scroll container, adding scroll listener.'); // DEBUG LOG
        scrollContainer.addEventListener('scroll', updatePosition);
    } else {
        console.warn('[TesseractExperience] Scroll container not found, adding listener to window.'); // DEBUG LOG
        window.addEventListener('scroll', updatePosition);
    }

    return () => {
      // --- MODIFIED: Clear the timeout on cleanup --- 
      clearTimeout(initialTimeoutId);
      console.log('[TesseractExperience] Cleaning up useEffect for battery position.'); // DEBUG LOG
      window.removeEventListener('resize', updatePosition);
       if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', updatePosition);
       } else {
          window.removeEventListener('scroll', updatePosition);
       }
    };
  }, []); // Keep dependencies empty for DOM element finding

  // --- NEW: useEffect to control canvas pointerEvents based on Tesseract dragging state ---
  useEffect(() => {
    const canvas = glRef.current?.domElement; // Get canvas from stored gl instance
    if (canvas) {
      // console.log(`[TesseractExperience] Setting canvas pointerEvents to: ${isTesseractDragging ? 'auto' : 'none'}`); // DEBUG LOG
      canvas.style.pointerEvents = isTesseractDragging ? 'auto' : 'none';
    }
    // Cleanup function (optional but good practice)
    return () => {
       if (canvas) {
        // console.log("[TesseractExperience] Resetting pointerEvents on cleanup");
        // canvas.style.pointerEvents = 'none'; // Reset if component unmounts while dragging
      }
    };
  }, [isTesseractDragging]); // Depend only on the dragging state

  const handleConnectChange = (connecting) => {
    if (connecting !== isConnecting) {
      setIsConnecting(connecting);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '17.5vh',      // Red Box Top Edge (Estimated)
      left: '7.3vw',     // Red Box Left Edge (Estimated)
      width: '40.2vw',    // Red Box Width (Estimated)
      height: '65vh',   // Red Box Height (Estimated)
      zIndex: 7, 
      pointerEvents: 'none',
    }}>
      <Canvas
        shadows
        camera={{ position: [-3, -1, 8], fov: 50 }}
        style={{ 
          background: 'transparent',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          glRef.current = gl; // Store gl instance
          gl.setClearColor(new THREE.Color(0, 0, 0), 0);
        }}
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

          {isActivated && (
            <Physics gravity={[0, -9.82, 0]}>
              <Plane position={[0, -3, 0]} />
              {batteryPosition3D ? ( // Conditional rendering based on batteryPosition3D
                <Tesseract
                  ref={tesseractRef}
                  position={[0, 1, 0]}
                  batteryPosition3D={batteryPosition3D}
                  onConnectChange={handleConnectChange}
                  chargeBattery={chargeBattery}
                  onDraggingChange={setIsTesseractDragging}
                  isInverted={isInverted}
                />
              ) : (
                // Optionally log or render a placeholder if batteryPosition3D is null
                 null // Render nothing if position is not ready
              )}
            </Physics>
          )}
          {isActivated && isConnecting && (
            <Line
              points={connectionLinePoints}
              color="#888888"
              lineWidth={2}
              dashed={false}
            />
          )}
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