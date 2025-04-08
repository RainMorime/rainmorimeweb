import React from 'react';
import styles from './VerticalShinyText.module.scss';

const VerticalShinyText = ({ text, disabled = false, speed = 5, className = '', textVisible, animationDelay }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`
        ${styles.verticalShinyText}
        ${disabled ? styles.disabled : ''}
        ${textVisible ? styles.startAnimation : ''}
        ${className}
      `}
      style={{ animationDuration, animationDelay }}
      data-text={text}
    >
      {text}
    </div>
  );
};

export default VerticalShinyText; 