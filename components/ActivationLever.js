import React from 'react';
import styles from './ActivationLever.module.scss';

// --- 新增: 定义图标 SVG ---
const icons = {
  discharge: (
    <g className={styles.leverIcon} transform="translate(0, 6)">
      {/* 向下的闪电图标 */}
      <polyline points="28,72 22,78 26,78 22,84 28,78 24,78" strokeWidth="1" />
    </g>
  ),
  drain: (
    <g className={styles.leverIcon} transform="translate(0, 6)">
      {/* 向下流动的波浪线 */}
      <path d="M 20 74 Q 22.5 77, 25 74 T 30 74" strokeWidth="1" />
      <path d="M 20 78 Q 22.5 81, 25 78 T 30 78" strokeWidth="1" />
      <path d="M 20 82 Q 22.5 85, 25 82 T 30 82" strokeWidth="1" />
    </g>
  ),
};

const ActivationLever = ({ onActivate, isActive, iconType, isAnimated }) => {
  const handleLeverClick = () => {
    onActivate();
  };

  const handleY = isActive ? 45 : 15;
  const IconComponent = icons[iconType] || null;

  return (
    <div 
      className={`
        ${styles.leverContainer} 
        ${isActive ? styles.activeState : ''}
        ${isAnimated ? styles.animated : ''} 
      `}
      onClick={handleLeverClick}
    >
      <svg viewBox="0 0 50 90" className={styles.leverSvg}>
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
          r="3.5" 
          className={`${styles.indicatorLight} ${isActive ? styles.on : styles.off}`}
        />
        
        {/* --- 修改: 渲染图标 --- */}
        {IconComponent}
      </svg>
    </div>
  );
};

export default ActivationLever; 