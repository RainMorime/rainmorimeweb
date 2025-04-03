import React from 'react';
import styles from './VerticalShinyText.module.scss';

const VerticalShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`${styles.verticalShinyText} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ animationDuration }}
      data-text={text}
    >
      {text}
    </div>
  );
};

export default VerticalShinyText; 