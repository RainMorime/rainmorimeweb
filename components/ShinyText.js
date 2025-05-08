import React from 'react';
import styles from './ShinyText.module.scss';

// 带闪光动画效果的文本组件
const ShinyText = ({
  text,              // 要显示的文本内容
  disabled = false, // 是否禁用闪光动画
  speed = 5,        // 闪光动画速度 (值越小越快，单位：秒)
  className = ''    // 允许传入额外的 CSS 类名
}) => {
  const animationDuration = `${speed}s`; // 计算 CSS 动画时长

  return (
    <div
      className={`${styles.shinyText} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ animationDuration }} // 将动画时长应用为内联样式
    >
      {text}
    </div>
  );
};

export default ShinyText; 