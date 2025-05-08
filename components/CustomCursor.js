import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/CustomCursor.module.scss';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default'); // 光标状态：'default' 或 'hover'

  useEffect(() => {
    // 更新鼠标位置状态
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    // 清理：移除事件监听器
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  useEffect(() => {
    // 处理链接悬停效果
    const handleLinkHover = () => setCursorVariant('hover');
    const handleLinkLeave = () => setCursorVariant('default');

    // 获取所有可交互元素
    const links = document.querySelectorAll('a, button, .btn, [role="button"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    // 清理：移除每个链接上的事件监听器
    return () => {
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  // Framer Motion 的动画变体定义
  const variants = {
    default: {
      x: mousePosition.x - 12, // 默认状态下光标中心偏移
      y: mousePosition.y - 12,
      opacity: 1,
      height: 24,
      width: 24,
      backgroundColor: 'rgba(255, 255, 255, 0)', // 透明背景
      border: '1px solid rgba(255, 255, 255, 1)', // 白色边框
      transition: {
        type: 'spring', // 弹簧动画
        mass: 0.1,
        stiffness: 900,
        damping: 30
      }
    },
    hover: {
      x: mousePosition.x - 20, // 悬停状态下光标中心偏移
      y: mousePosition.y - 20,
      opacity: 1,
      height: 40,
      width: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // 半透明背景
      border: '1px solid rgba(255, 255, 255, 0.8)', // 较柔和的白色边框
      transition: {
        type: 'spring', // 弹簧动画
        mass: 0.1,
        stiffness: 900,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      className={styles.cursor} // 自定义光标的样式类
      variants={variants}       // 应用动画变体
      animate={cursorVariant}   // 根据当前光标状态执行动画
    />
  );
};

export default CustomCursor; 