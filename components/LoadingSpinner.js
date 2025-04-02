import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/LoadingSpinner.module.scss';

const LoadingSpinner = ({ fullScreen = false, size = 'medium', isVisible = true }) => {
  // 根据大小设置尺寸
  const getSize = () => {
    switch(size) {
      case 'small':
        return { container: '40px', spinner: '30px' };
      case 'large':
        return { container: '120px', spinner: '100px' };
      case 'medium':
      default:
        return { container: '80px', spinner: '60px' };
    }
  };
  
  const dimensions = getSize();
  
  const containerStyle = fullScreen ? 
    { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0, 0, 0, 0.7)' } : 
    { width: dimensions.container, height: dimensions.container };
  
  const spinnerStyle = {
    width: dimensions.spinner,
    height: dimensions.spinner
  };
  
  // 雨滴动画变体
  const rainVariants = {
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 2, // 延长动画时间
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // 旋转动画变体
  const rotateVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2.5, // 设置旋转一圈的时间为2.5秒
        repeat: Infinity,
        ease: "linear"
      }
    },
    exit: {
      rotate: 720, // 退出时再转两圈
      scale: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };
  
  // 容器退出动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeInOut"
      }
    }
  };
  
  // 切割效果动画
  const sliceVariants = {
    hidden: { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" 
    },
    visible: { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      transition: { duration: 0.1 }
    },
    exit: { 
      clipPath: [
        "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        "polygon(0% 40%, 100% 40%, 100% 60%, 0% 60%)",
        "polygon(0% 49%, 100% 49%, 100% 51%, 0% 51%)",
        "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)"
      ],
      transition: {
        duration: 0.8,
        times: [0, 0.4, 0.7, 1],
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`${styles.spinner_container} ${fullScreen ? styles.fullscreen : ''}`} 
          style={containerStyle}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className={styles.slice_container}
            variants={sliceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.spinner} style={spinnerStyle}>
              <div className={styles.spinner_content}>
                <motion.div 
                  className={styles.rain_text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  RAIN
                </motion.div>
                
                {/* 雨滴动画元素 */}
                <div className={styles.rain_drops}>
                  {[...Array(3)].map((_, index) => (
                    <motion.div 
                      key={index}
                      className={styles.drop}
                      variants={rainVariants}
                      animate="animate"
                      custom={index}
                      style={{ 
                        left: `${(index + 1) * 25}%` 
                      }}
                      transition={{
                        delay: index * 0.2, // 错开每个雨滴的动画
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* 旋转边框 */}
              <motion.div 
                className={styles.spinner_border}
                variants={rotateVariants}
                animate="animate"
                exit="exit"
              >
                <div className={styles.spinner_border_inner}></div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingSpinner; 