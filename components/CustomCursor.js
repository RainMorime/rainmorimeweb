import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/CustomCursor.module.scss';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  useEffect(() => {
    const handleLinkHover = () => setCursorVariant('hover');
    const handleLinkLeave = () => setCursorVariant('default');

    const links = document.querySelectorAll('a, button, .btn, [role="button"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      opacity: 1,
      height: 24,
      width: 24,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      border: '1px solid rgba(255, 255, 255, 1)',
      transition: {
        type: 'spring',
        mass: 0.1,
        stiffness: 900,
        damping: 30
      }
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      opacity: 1,
      height: 40,
      width: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      transition: {
        type: 'spring',
        mass: 0.1,
        stiffness: 900,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      className={styles.cursor}
      variants={variants}
      animate={cursorVariant}
    />
  );
};

export default CustomCursor; 