import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RainMorimeEffect = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); // Orthographic for fullscreen quad
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha: true for transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform float time;
      uniform float scanlineIntensity;
      uniform float glitchIntensity;
      uniform float noiseIntensity; // Added noise intensity uniform

      // Simple pseudo-random number generator
      float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0); // Start with transparent black

        // Scanlines
        float scanline = sin(vUv.y * 800.0 + time * 0.5) * 0.5 + 0.5; // Adjusted frequency and speed
        color.rgb += vec3(scanline * scanlineIntensity * 0.05); // Very subtle scanlines mixed with base

        // Glitch effect (Horizontal displacement based on time and randomness)
        float glitchOffset = (rand(vec2(time * 0.1, vUv.y * 0.2)) - 0.5) * 2.0 * glitchIntensity * 0.01; // More subtle glitch
        // Apply glitch only occasionally/randomly
        float glitchTrigger = step(0.995, rand(vec2(time * 0.05))); // Trigger glitch less often
        vec2 glitchUv = vUv + vec2(glitchOffset * glitchTrigger, 0.0);

        // Add subtle background noise
        float noise = (rand(vUv + time * 0.01) - 0.5) * noiseIntensity * 0.1; // Subtle noise amount

        // Combine effects (sampling from a hypothetical background, here we just use noise)
        vec4 textureColor = vec4(vec3(noise), 0.0); // Use noise as the base "texture"

        // We use glitchUv to sample (though we don't have a texture here)
        // If you had a background texture: texture2D(backgroundTexture, glitchUv);
        // Since we don't, let's just use the noise calculation based on original UV for simplicity here
        // and slightly modulate alpha based on scanline and noise
        color.a = clamp(scanline * 0.02 + noise * 0.05, 0.0, 0.1); // Control overall visibility/alpha


        // Final Output - Ensure it remains subtle
        gl_FragColor = color;
      }
    `;


    // Shader Material
    const uniforms = {
      time: { value: 0.0 },
      scanlineIntensity: { value: 0.6 }, // Adjust for subtle scanlines (0.0 to 1.0+)
      glitchIntensity: { value: 0.2 }, // Adjust for subtle glitch (0.0 to 1.0+)
      noiseIntensity: { value: 0.15 } // Adjust noise level
    };
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true, // Ensure transparency works
      depthTest: false,  // No need for depth testing for a fullscreen overlay
      depthWrite: false
    });

    // Fullscreen Quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!renderer || !scene || !camera) {
        console.warn('RainMorimeEffect: Renderer, Scene, or Camera not ready.');
        return;
      }
      requestAnimationFrame(animate);
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.updateProjectionMatrix(); // Orthographic doesn't usually need update on resize unless aspect changes, but good practice
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      // Important: Check if currentMount and renderer.domElement exist before removing
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
         currentMount.removeChild(renderer.domElement);
      }
      // Dispose Three.js objects to free memory
      geometry.dispose();
      material.dispose();
      // scene.dispose(); // Scene doesn't have a dispose method
      renderer.dispose();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Style the container to be fixed and cover the background
  const style = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Place it behind other content
    pointerEvents: 'none' // Prevent it from interfering with clicks
  };

  return <div ref={mountRef} style={style} />;
};

export default RainMorimeEffect;
