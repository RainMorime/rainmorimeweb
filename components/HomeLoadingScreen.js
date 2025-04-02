import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyText from './ShinyText';
import styles from '../styles/HomeLoadingScreen.module.scss';

const HomeLoadingScreen = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isThundering, setIsThundering] = useState(false);
  const [thunderIntensity, setThunderIntensity] = useState(0);
  const [raindrops, setRaindrops] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const lastThunderProgressRef = useRef(0);
  const minDisplayTime = 2500; // 缩短最小显示时间为2.5秒
  const showStripes = false; // 控制是否显示顶部条格背景

  // 生成雨滴
  useEffect(() => {
    // 修改雨滴生成逻辑
    const generateRaindrops = () => {
      const drops = [];
      // 增加雨滴数量并提高随机性
      for (let i = 0; i < 250; i++) {
        drops.push({
          id: i,
          left: `${Math.random() * 110 - 5}%`, // 范围扩大到-5%~105%确保覆盖边缘
          top: `${Math.random() * -100}%`, // 随机顶部起始位置
          length: 25 + Math.random() * 60, // 更大范围的长度变化
          speed: 1 + Math.random() * 2, // 加快雨滴速度
          delay: Math.random() * 5, // 更大的延迟差异防止整齐排列
        });
      }
      setRaindrops(drops);
    };

    generateRaindrops();
  }, []);

  // 创建打雷效果
  const createThunder = (progressValue) => {
    // 修改为仅在进度达到30%和70%时触发雷电
    const thunderThresholds = [30, 70];
    const currentThreshold = thunderThresholds.find(threshold => 
      Math.floor(lastThunderProgressRef.current / 10) * 10 < threshold && 
      Math.floor(progressValue / 10) * 10 >= threshold
    );
    
    if (!currentThreshold) return;
    
    lastThunderProgressRef.current = progressValue;
    
    // 降低雷电强度使其更柔和
    const intensity = (currentThreshold === 70) ? 0.6 : 0.5;
    
    // 闪电动画序列
    setIsThundering(true);
    setThunderIntensity(intensity);
    
    // 短闪
    setTimeout(() => {
      setThunderIntensity(0);
      
      // 主闪
      setTimeout(() => {
        setThunderIntensity(intensity);
        
        // 渐退
        setTimeout(() => {
          setThunderIntensity(intensity * 0.5);
          setTimeout(() => {
            setThunderIntensity(intensity * 0.2);
            setTimeout(() => {
              setThunderIntensity(0);
              setIsThundering(false);
            }, 150);
          }, 100);
        }, 180);
      }, 70);
    }, 100);
  };

  // 模拟加载进度
  useEffect(() => {
    // 重置开始时间
    startTimeRef.current = Date.now();
    
    // 进度条逻辑
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + (Math.random() * 3 + 1), 100); // 加快进度增长速度
        
        // 检查是否需要触发雷电效果
        createThunder(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // 计算已经显示的时间
          const elapsedTime = Date.now() - startTimeRef.current;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          // 确保至少显示minDisplayTime的时间
          setTimeout(() => {
            // 先触发退场动画
            setIsExiting(true);
            
            // 然后在动画完成后调用回调
            setTimeout(() => {
              setLoading(false);
              if (onLoadingComplete) {
                onLoadingComplete();
              }
            }, 1200); // 减少退场动画等待时间
            
          }, remainingTime);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100); // 减少进度更新间隔，加快整体速度
    
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // 闪电效果样式
  const thunderStyle = {
    filter: `invert(${thunderIntensity}) brightness(1.3)`, // 减少亮度使闪电更柔和
    transition: thunderIntensity > 0 ? 'filter 0.1s ease-in-out' : 'filter 0.3s ease-out' // 更平滑的过渡
  };

  // 添加统一的退场动画变量
  const exitTransition = {
    duration: 0.9, 
    ease: [0.4, 0, 0.2, 1]
  };

  // 添加新的揭幕动画变量
  const revealExitTransition = {
    ...exitTransition,
    ease: [0.8, 0, 0.2, 1] 
  };
  
  // 背景层转场动画，比前层稍慢
  const backgroundRevealTransition = {
    ...revealExitTransition,
    duration: 1.5, // 延长时间使其比前层慢
    delay: 0.15 // 增加延迟，错开动画时间
  };

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <>
          {/* 深灰色背景层 */}
          <motion.div 
            className={styles.loading_screen_background}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              background: '#222',
              zIndex: 999,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 1,
              clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 100% 0% 0%)'],
              transition: backgroundRevealTransition
            }}
          />
          
          {/* 主内容层 */}
          <motion.div 
            className={styles.loading_screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 1,
              clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 100% 0% 0%)'],
              transition: { 
                ...revealExitTransition,
                duration: 1.2
              } 
            }}
            ref={containerRef}
            style={{
              ...isThundering ? thunderStyle : {},
              boxShadow: '0 0 30px rgba(0,0,0,0.5)', // 添加阴影效果
              zIndex: 1000
            }}
          >
            {/* 第一层雨幕 */}
            <div className={styles.rain_layer}>
              {raindrops.map((drop) => (
                <div
                  key={drop.id}
                  className={styles.rain_drop}
                  style={{
                    left: drop.left,
                    top: drop.top,
                    height: `${drop.length}px`,
                    animationDuration: `${drop.speed}s`,
                    animationDelay: `${drop.delay}s`,
                  }}
                />
              ))}
            </div>
            
            {/* 条格背景 - 可控制显示 */}
            {showStripes && (
              <div className={styles.stripe_background}>
                {[...Array(20)].map((_, index) => (
                  <div 
                    key={`stripe-${index}`}
                    className={styles.stripe}
                  />
                ))}
              </div>
            )}
            
            {/* 闪电图层 */}
            {isThundering && (
              <div className={styles.thunder_overlay} style={{ opacity: thunderIntensity * 0.1 }}></div>
            )}
            
            <div className={styles.loading_content}>
              {/* 中央LOGO */}
              <motion.div 
                className={styles.logo_container}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: isExiting ? 0 : 0 // 不再向右移动
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeOut",
                  delay: 0.3
                }}
                exit={{
                  opacity: 0,
                  x: 0, // 不再向右移动
                  transition: exitTransition
                }}
              >
                <div className={styles.logo_design}>
                  <ShinyText text="RAIN" speed={3} className={styles.logo_rain} />
                  <ShinyText text="MORIME" speed={3} className={styles.logo_morime} />
                  <motion.div 
                    className={styles.logo_circle}
                    animate={{ 
                      rotate: 360 
                    }}
                    transition={{ 
                      duration: 30, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  >
                    <div className={styles.logo_dots}></div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* 像素风格进度条 */}
              <div className={styles.loading_progress}>
                <div className={styles.progress_container}>
                  <motion.div 
                    className={styles.progress_bar}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min(progress, 100)}%`,
                      x: isExiting ? '100%' : '0%' // 向右移动
                    }}
                    exit={{
                      x: '100%', // 向右移动
                      transition: exitTransition
                    }}
                    transition={{ 
                      ease: "easeOut",
                      duration: 0.3
                    }}
                  >
                    <div className={styles.progress_glow}></div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className={styles.progress_text}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isExiting ? 0 : 1,
                    y: 0 // 保持垂直位置不变
                  }}
                  exit={{
                    opacity: 0,
                    y: 0, // 保持垂直位置不变
                    transition: exitTransition
                  }}
                  transition={{ delay: 0.5 }}
                >
                  loading {Math.min(Math.round(progress), 100)}%
                </motion.div>
              </div>
            </div>
            
            {/* 地面反光水渍（只在进度100%时显示） */}
            {progress === 100 && (
              <motion.div 
                className={styles.water_reflections}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ 
                  opacity: 0,
                  x: '30%', // 向右移动
                  transition: {
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.8
                }}
              >
                {[...Array(15)].map((_, index) => (
                  <div 
                    key={`reflection-${index}`}
                    className={styles.reflection}
                    style={{
                      left: `${index * 7 + Math.random() * 5}%`,
                      width: `${20 + Math.random() * 80}px`,
                      opacity: 0.1 + Math.random() * 0.3
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomeLoadingScreen; 