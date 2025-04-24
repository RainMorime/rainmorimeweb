import React, { useState, useEffect } from 'react';
import styles from './ActivationLever.module.scss';

const ActivationLever = ({ onActivate, isActive }) => {
  const [isPulled, setIsPulled] = useState(isActive);
  const [hasBeenActivatedOnce, setHasBeenActivatedOnce] = useState(isActive);

  useEffect(() => {
    setIsPulled(isActive);
    if (isActive) {
      setHasBeenActivatedOnce(true);
    }
  }, [isActive]);

  const handleLeverClick = () => {
    const nextIsPulled = !isPulled;
    setIsPulled(nextIsPulled);

    if (nextIsPulled && !hasBeenActivatedOnce) {
      setHasBeenActivatedOnce(true);
      onActivate();
    }
  };

  const handleY = isPulled ? 45 : 15;

  return (
    <div 
      className={`${styles.leverContainer}`}
      onClick={handleLeverClick}
    >
      <svg viewBox="0 0 50 80" className={styles.leverSvg}>
        {/* Base/Slot */}
        <rect 
          x="15" y="5" 
          width="20" height="70" 
          className={styles.base}
        />
        {/* Slot Line inside base */}
        <line 
           x1="25" y1="15" 
           x2="25" y2="65" 
           className={styles.slotLine} 
        />

        {/* Lever Handle (Group for easier animation if needed later) */}
        <g transform={`translate(0, ${handleY - 15})`}>
            <line 
              x1="10" y1="15" 
              x2="40" y2="15" 
              className={styles.handleTop} 
            />
            <line 
              x1="25" y1="15" 
              x2="25" y2="35"
              className={styles.handleShaft}
            />
        </g>

        {/* Indicator Light */}
        <circle 
          cx="25" cy="70" 
          r="4" 
          className={`${styles.indicatorLight} ${isPulled ? styles.on : styles.off}`}
        />
        
        {/* Optional Label */}
        {/* 
        <text x="25" y="90" className={styles.labelText}>
          ПУСК
        </text> 
        */}
      </svg>
    </div>
  );
};

export default ActivationLever; 