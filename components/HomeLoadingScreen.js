import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/HomeLoadingScreen.module.scss';

const HomeLoadingScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [currentTime, setCurrentTime] = useState('--:--:--');
  const [welcomeMessage, setWelcomeMessage] = useState(false);
  const [showSplitLines, setShowSplitLines] = useState(false);
  
  const containerRef = useRef(null);
  const consoleContentRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const minDisplayTime = 1800; // 最小显示时间 - 从2800减少到1800

  // 使用客户端时间，避免服务器/客户端不匹配错误
  useEffect(() => {
    // 初始化时间
    setCurrentTime(new Date().toLocaleTimeString());
    
    // 每秒更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    // 清理定时器
    return () => clearInterval(timer);
  }, []);

  // 随机生成控制台日志 - 复古终端风格
  const generateLogLine = (progress) => {
    const logs = [
      { threshold: 5, text: "系统初始化中..." },
      { threshold: 10, text: "正在探测硬件_" },
      { threshold: 15, text: "PROCESSIN: 系统编号[INS-001]" },
      { threshold: 20, text: "正在扫描环境参数..." },
      { threshold: 25, text: "检测异常气象现象[ATM-247]" },
      { threshold: 30, text: "建立信号连接..." },
      { threshold: 35, text: "正在连接数据终端[DAT-189]" },
      { threshold: 40, text: "PROCESSIN: 数据库启动" },
      { threshold: 45, text: "加载区域地图文件[MAP-379]" },
      { threshold: 50, text: "解密地图数据..." },
      { threshold: 55, text: "计算生存指数[SRV-682]" },
      { threshold: 60, text: "检查安全协议..." },
      { threshold: 65, text: "PROCESSIN: 校准工业系统" },
      { threshold: 70, text: "初始化防御矩阵" },
      { threshold: 75, text: "加载防护装置[DEF-873]" },
      { threshold: 80, text: "装置自检中..." },
      { threshold: 85, text: "PROCESSIN: 激活安全协议" },
      { threshold: 90, text: "正在检验系统完整性..." },
      { threshold: 95, text: "准备接入主系统[SYS-000]" },
      { threshold: 98, text: "WELCOME, MORIME GUARD." },
      { threshold: 99, text: "欢迎回来，守林人。" }
    ];
    
    const currentLog = logs.find(log => progress >= log.threshold && !logLines.some(l => l.text === log.text));
    if (currentLog) {
      // 加入欢迎文字特效
      if (currentLog.threshold === 98) {
        setWelcomeMessage(true);
      }
      
      // 降低日志输出延迟 - 从240毫秒减少到80毫秒
      setTimeout(() => {
        setLogLines(prev => [...prev, { id: Date.now(), text: currentLog.text }]);
        
        // 自动滚动到底部
        if (consoleContentRef.current) {
          setTimeout(() => {
            // 再次检查 ref 是否仍然存在
            if (consoleContentRef.current) { 
              consoleContentRef.current.scrollTop = consoleContentRef.current.scrollHeight;
            }
          }, 50); // 减少滚动延迟 - 从100减少到50
        }
      }, 80); // 减少日志输出延迟 - 从240减少到80
    }
  };

  // 模拟加载进度
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      setProgress(prev => {
        // 提高进度增长速度 - 从原来的1.5+0.3增加到4.0+0.5
        const newProgress = Math.min(prev + (Math.random() * 4.0 + 0.5), 100);
        
        // 生成日志
        generateLogLine(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // 计算已显示时间
          const elapsedTime = Date.now() - startTimeRef.current;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          // 确保最小显示时间
          setTimeout(() => {
            setIsExiting(true);
            
            // 先显示分割线特效
            setShowSplitLines(true);
            
            // 先执行界面元素的退场动画，再完成整体退场
            setTimeout(() => {
              setLoading(false);
              if (onComplete) {
                onComplete();
              }
            }, 3000); // 增加退场动画时间 - 从2400增加到3000，以适应更多层
          }, remainingTime);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100); // 减少间隔时间 - 从240减少到100
    
    return () => clearInterval(interval);
  }, [onComplete]);

  // 优化的退场动画设置
  const exitTransition = {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1]
  };

  // 明日方舟风格的分段动画效果
  const staggerChildren = {
    opacity: 0,
    transition: {
      staggerChildren: 0.1
    }
  };

  // 文本淡出、变换、缩放效果
  const textExitAnimation = {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  };

  // 控制台特效动画
  const consoleExitAnimation = {
    opacity: 0,
    y: 30,
    scale: 0.98,
    filter: 'brightness(1.5)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  };

  // HUD元素退场特效
  const hudExitAnimations = {
    opacity: 0,
    x: ({ index }) => index % 2 === 0 ? -30 : 30,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  };

  // 左右切割动画
  const horizontalSlideOut = (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : 100,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  // 多层视差退场动画
  const bgSplitAnimationWithLayers = {
    opacity: [1, 1, 0],
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 
      'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' // 收缩到左侧
    ],
    transition: {
      clipPath: {
        duration: 1.2, // 主体内容收缩时间
        ease: [0.65, 0, 0.35, 1],
        times: [0, 1]
      },
      opacity: {
        duration: 1.5, // 整体淡出时间
        times: [0, 0.8, 1],
        ease: [0.65, 0, 0.35, 1]
      }
    }
  };
  
  // 优化的标题动画变量
  const titleVariants = {
    hidden: { 
      opacity: 0,
      filter: "blur(5px)",
      y: -10
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(5px)",
      y: -10,
      transition: {
        duration: 0.4
      }
    }
  };
  
  const subtitleVariants = {
    hidden: { 
      opacity: 0,
      filter: "blur(3px)",
      y: 10 
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.15,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(3px)",
      y: 10,
      transition: {
        duration: 0.3
      }
    }
  };

  // 添加明日方舟多重切割动画
  const arknightTransition = (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <>
          {/* 新增：退场时第二层滑动的背景层 (最慢，最浅) */}
          {isExiting && (
            <motion.div
              key="exit-slide-layer-2" // 唯一 key
              className={styles.exit_slide_layer_2} // z-index: 997
              initial={{ x: '0%', opacity: 0 }} // 初始在屏幕内，透明
              animate={{ // 快速淡入
                opacity: 1,
                transition: {
                  duration: 0.3, // 快速淡入时间
                  delay: 0.05    // 与第一层同时开始淡入
                }
              }}
              exit={{ // 向左移动并淡出，速度最慢
                x: '-100%', // 向左移出屏幕
                opacity: 0,
                transition: {
                  duration: 2.4, // 比 exit_slide_layer(1.8s) 慢
                  ease: [0.65, 0, 0.35, 1] // 保持缓动一致性
                }
              }}
            />
          )}
          
          {/* 退场时第一层滑动的背景层 */}
          {isExiting && (
            <motion.div
              key="exit-slide-layer" // 添加 key 确保 AnimatePresence 能正确处理
              className={styles.exit_slide_layer} // z-index: 998
              initial={{ x: '0%', opacity: 0 }} // 初始在屏幕内，透明
              animate={{ // 快速淡入
                opacity: 1,
                transition: {
                  duration: 0.3, // 快速淡入时间
                  delay: 0.05    // 略微延迟出现
                }
              }}
              exit={{ // 向左移动并淡出，速度稍慢
                x: '-100%', // 向左移出屏幕
                opacity: 0,
                transition: {
                  duration: 1.8, // 比主内容 clipPath(1.2s) 慢
                  ease: [0.65, 0, 0.35, 1] // 保持缓动一致性
                }
              }}
            />
          )}

          {/* 背景层 */}
          <motion.div 
            key="wasteland-background" // 添加 key
            className={`${styles.wasteland_background} ${styles.variables}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={bgSplitAnimationWithLayers} // 背景也使用这个收缩/淡出效果
          />
          
          {/* 主内容层 */}
          <motion.div 
            key="loading-screen" // 添加 key
            className={styles.loading_screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={bgSplitAnimationWithLayers} // 主容器使用这个收缩/淡出效果
            ref={containerRef}
          >
            {/* 网格背景 */}
            <div className={styles.grid_overlay}></div>
            
            {/* 明日方舟风格的分割线特效 */}
            {showSplitLines && (
              <>
                <motion.div
                  className={styles.split_line_horizontal}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                />
                <motion.div
                  className={styles.split_line_vertical}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                />
                {/* 添加水平滑动特效 */}
                <motion.div
                  className={styles.horizontal_slide}
                  initial={{ scaleX: 0, x: "-100%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 0.7, delay: 0, ease: [0.25, 1, 0.5, 1] }
                  }}
                />
                {/* 第二层水平滑动 - 速度稍慢、颜色稍浅 */}
                <motion.div
                  className={styles.horizontal_slide_second}
                  initial={{ scaleX: 0, x: "-150%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "120%", opacity: 0 }}
                  transition={{ 
                    duration: 1.0, // 稍慢
                    delay: 0.05, // 轻微延迟
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 0.85, delay: 0.1, ease: [0.25, 1, 0.5, 1] } // 退场也稍慢
                  }}
                />
                {/* 第三层水平滑动 - 速度最慢、颜色最浅 */}
                <motion.div
                  className={styles.horizontal_slide_third}
                  initial={{ scaleX: 0, x: "-200%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "150%", opacity: 0 }}
                  transition={{ 
                    duration: 1.2, // 最慢
                    delay: 0.1, // 更明显的延迟
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 1.0, delay: 0.2, ease: [0.25, 1, 0.5, 1] } // 退场最慢
                  }}
                />
                {/* 第四层水平滑动 - 更慢、颜色更深 */}
                <motion.div
                  className={styles.horizontal_slide_fourth}
                  initial={{ scaleX: 0, x: "-250%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "180%", opacity: 0.08 }}
                  transition={{ 
                    duration: 1.4, // 比第三层更慢
                    delay: 0.15, // 更长的延迟
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] } // 退场更慢
                  }}
                />
                {/* 第五层水平滑动 - 最慢、颜色最深 */}
                <motion.div
                  className={styles.horizontal_slide_fifth}
                  initial={{ scaleX: 0, x: "-300%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "200%", opacity: 0.06 }}
                  transition={{ 
                    duration: 1.6, // 最慢层
                    delay: 0.2, // 最明显延迟
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 1.4, delay: 0.4, ease: [0.25, 1, 0.5, 1] } // 退场最慢
                  }}
                />
                {/* 第六层水平滑动 - 更慢、颜色更深 */}
                <motion.div
                  className={styles.horizontal_slide_sixth}
                  initial={{ scaleX: 0, x: "-350%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "230%", opacity: 0.04 }}
                  transition={{ 
                    duration: 1.8, // 比第五层更慢
                    delay: 0.25, // 更长的延迟
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 1.6, delay: 0.5, ease: [0.25, 1, 0.5, 1] } // 退场更慢
                  }}
                />
                {/* 第七层水平滑动 - 最慢、颜色最深 */}
                <motion.div
                  className={styles.horizontal_slide_seventh}
                  initial={{ scaleX: 0, x: "-400%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "250%", opacity: 0.02 }}
                  transition={{ 
                    duration: 2.0, // 最慢层
                    delay: 0.3, // 最明显延迟
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 1.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] } // 退场最慢
                  }}
                />
                <motion.div
                  className={styles.split_diamond}
                  initial={{ 
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    rotate: 45
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: 0.3,
                    ease: [0, 0.55, 0.45, 1]
                  }}
                />
                
                {/* 添加多层次切割线 */}
                <motion.div 
                  className={styles.diagonal_line_1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                />
                
                <motion.div 
                  className={styles.diagonal_line_2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.5,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                />
                
                {/* 添加明日方舟标志性的角落切割 */}
                <motion.div 
                  className={styles.corner_cut}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.4,
                    delay: 0.6,
                    ease: [0, 0.55, 0.45, 1]
                  }}
                />
              </>
            )}
            
            {/* 主内容 */} 
            <motion.div 
              className={styles.loading_content} 
              initial={{opacity: 1}} 
              exit={staggerChildren} // 让 loading_content 内的元素执行各自的退场
            >
              {/* LOGO区域 */} 
              <motion.div 
                className={styles.logo_area}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  ease: [0.1, 0.3, 0.2, 1]
                }}
                exit={horizontalSlideOut('left')} // LOGO 向左滑出
              >
                <div className={styles.frame_container}>
                  {/* 标题 - 使用framer-motion优化动画 */} 
                  <div className={styles.title_container}>
                    <motion.h1 
                      className={`${styles.main_title} ${styles.shiny_text}`}
                      variants={titleVariants} // 使用预定义 variants
                      initial="hidden"
                      animate="visible"
                      exit="exit" // 标题使用 variants 定义的 exit
                    >
                      RAIN
                    </motion.h1>
                    <motion.h2 
                      className={`${styles.sub_title} ${styles.shiny_text}`}
                      variants={subtitleVariants} // 使用预定义 variants
                      initial="hidden"
                      animate="visible"
                      exit="exit" // 副标题使用 variants 定义的 exit
                    >
                      MORIME
                    </motion.h2>
                  </div>
                  
                  {/* 装饰框架为工业风格装饰 */} 
                  <motion.div 
                    className={styles.decorative_frame}
                    initial={{ 
                      clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" 
                    }}
                    animate={{ 
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" 
                    }}
                    exit={{ // 框架收缩退场
                      clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }}
                    transition={{ 
                      duration: 0.7,
                      delay: 0.3,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                  ></motion.div>
                  <motion.div 
                    className={styles.industrial_decorations}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} // 工业装饰淡出
                    transition={{ 
                      duration: 0.5,
                      delay: 0.8,
                      ease: "easeOut"
                    }}
                  ></motion.div>
                  <motion.div 
                    className={styles.side_lines}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }} // 侧边线条收缩
                    transition={{ 
                      duration: 0.5,
                      delay: 1.0,
                      ease: "easeOut"
                    }}
                  ></motion.div>
                  <motion.div 
                    className={`${styles.side_lines} ${styles.side_lines_right}`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }} // 侧边线条收缩
                    transition={{ 
                      duration: 0.5,
                      delay: 1.0,
                      ease: "easeOut"
                    }}
                  ></motion.div>
                  <motion.div 
                    className={styles.decoration_dots}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }} // 装饰点消失
                    transition={{ 
                      duration: 0.3,
                      delay: 1.2,
                      ease: "easeOut"
                    }}
                  >
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </motion.div>
                  <motion.div 
                    className={styles.dimension_marker}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }} // 尺寸标记消失
                    transition={{ 
                      duration: 0.3,
                      delay: 1.3,
                      ease: "easeOut"
                    }}
                  ></motion.div>
                </div>
                
                {/* 状态图标 */}
                <div className={styles.status_icon}>
                  <div className={styles.icon_pulse}></div>
                </div>
              </motion.div>
            
              {/* 进度指示区域 */}
              <motion.div 
                className={styles.progress_area}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.6,
                  ease: [0.1, 0.3, 0.2, 1]
                }}
                exit={horizontalSlideOut('left')} // 进度区域向左滑出
              >
                {/* 进度条 */}
                <div className={styles.progress_container}>
                  <div className={styles.progress_track}>
                    <div 
                      className={styles.progress_fill}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  {/* 进度信息 */}
                  <div className={styles.progress_info}>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>SYSTEM STATUS</span>
                      <span className={styles.info_value}>
                        {progress < 30 ? "BOOT" : 
                         progress < 60 ? "SCAN" : 
                         progress < 90 ? "SYNC" : "READY"}
                      </span>
                    </div>
                    <div className={styles.info_row}>
                      <span className={styles.info_label}>DATA LOADING</span>
                      <span className={styles.info_value}>{Math.floor(progress)}%</span>
                    </div>
                  </div>
                </div>
                
                {/* 控制台日志 - 纯黑终端风格 */}
                <motion.div 
                  className={styles.console_output} 
                  exit={consoleExitAnimation} // 控制台使用特定退场动画
                >
                  <div className={styles.console_header}>
                    <span className={styles.header_title}>系统终端</span>
                    <div className={styles.header_controls}>
                      <span className={styles.header_status}>STATUS: ONLINE</span>
                      <span className={styles.header_time}>{currentTime}</span>
                    </div>
                  </div>
                  <div 
                    className={styles.console_content}
                    ref={consoleContentRef}
                  >
                    {logLines.map(line => (
                      <div key={line.id} className={styles.log_line}>
                        <span className={styles.log_prefix}>&gt;</span>
                        <span className={styles.log_text}>{line.text}</span>
                      </div>
                    ))}
                    {/* 添加固定底部提示符 */}
                    {logLines.length > 0 && 
                      <div className={styles.log_line} style={{ opacity: 1 }}>
                        <span className={styles.log_prefix}>&gt;</span>
                        <span className={styles.log_text}>_</span>
                      </div>
                    }
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* HUD元素 - 修改为横向移出 */}
            <motion.div 
              className={styles.hud_elements}
              exit={staggerChildren} // 让 HUD 容器协调子元素退场
            >
              <motion.div 
                className={`${styles.hud_element} ${styles.top_left}`}
                custom={{ index: 0 }}
                exit={horizontalSlideOut('left')} // 左侧 HUD 向左滑出
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>STATUS MONITOR</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.top_right}`}
                custom={{ index: 1 }}
                exit={horizontalSlideOut('right')} // 右侧 HUD 向右滑出
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>SYSTEM ONLINE</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_left}`}
                custom={{ index: 2 }}
                exit={horizontalSlideOut('left')} // 左侧 HUD 向左滑出
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>ID-1A1A1A</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_right}`}
                custom={{ index: 3 }}
                exit={horizontalSlideOut('right')} // 右侧 HUD 向右滑出
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>{currentTime}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomeLoadingScreen; 