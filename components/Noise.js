import { useRef, useEffect } from 'react';
import styles from './Noise.module.scss'; // Use SCSS module

const Noise = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 4, // Slow down refresh slightly
  patternAlpha = 10, // Make alpha lower for subtlety
}) => {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return; // Add check for canvas existence
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Add check for context

    let frame = 0;
    let animationFrameId = null;

    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return; // Add check for pattern context

    const patternData = patternCtx.createImageData(patternSize, patternSize);
    const patternPixelDataLength = patternSize * patternSize * 4;

    const resize = () => {
      // Ensure canvas dimensions match the parent element's dimensions
      // We rely on CSS for positioning and sizing relative to the parent
      // Setting canvas width/height explicitly might not be needed if CSS handles it
      // Let's keep it simple and let CSS manage the size initially.
      // If scaling issues arise, we can revisit this.
      // canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      // canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      // ctx.scale(patternScaleX * window.devicePixelRatio, patternScaleY * window.devicePixelRatio);
    };

    const updatePattern = () => {
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const value = Math.random() * 255;
        patternData.data[i] = value;
        patternData.data[i + 1] = value;
        patternData.data[i + 2] = value;
        patternData.data[i + 3] = patternAlpha;
      }
      patternCtx.putImageData(patternData, 0, 0);
    };

    const drawGrain = () => {
      const { width, height } = canvas; // Use current canvas size
      ctx.clearRect(0, 0, width, height);
      
      // Ensure pattern is created before using it
      if (patternCanvas.width > 0 && patternCanvas.height > 0) {
          const pattern = ctx.createPattern(patternCanvas, 'repeat');
          if (pattern) { // Check if pattern was created successfully
              ctx.fillStyle = pattern;
              ctx.fillRect(0, 0, width, height);
          } else {
              console.error("Failed to create pattern");
          }
      } else {
           console.error("Pattern canvas has zero dimensions");
      }
    };

    const loop = () => {
      // Update and draw only if the canvas has dimensions
      if (canvas.width > 0 && canvas.height > 0) {
          if (frame % patternRefreshInterval === 0) {
            updatePattern();
            drawGrain();
          }
          frame++;
      }
      animationFrameId = window.requestAnimationFrame(loop);
    };

    // Initial setup
    resize(); // Call resize once to set initial scale if needed
    updatePattern(); // Generate the initial pattern
    drawGrain(); // Draw immediately
    loop(); // Start the animation loop

    // Add resize listener
    // window.addEventListener('resize', resize); // Let CSS handle resizing primarily

    // Cleanup function
    return () => {
      // window.removeEventListener('resize', resize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
    // Dependencies: Include props that affect the pattern or drawing
  }, [patternSize, patternRefreshInterval, patternAlpha]); // Removed scaleX/Y for now

  // Use the SCSS module class name
  return <canvas className={styles.noiseOverlay} ref={grainRef} />;
};

export default Noise; 