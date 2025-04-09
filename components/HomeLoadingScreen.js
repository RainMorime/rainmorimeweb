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
      { threshold: 11, text: "正在探测硬件_" },
      { threshold: 17, text: "系统编号[INS-001]" },
      { threshold: 23, text: "正在扫描环境参数..." },
      { threshold: 29, text: "检测异常气象现象[ATM-247]" },
      { threshold: 35, text: "建立信号连接..." },
      { threshold: 41, text: "正在连接数据终端[DAT-189]" },
      { threshold: 47, text: "数据库启动..." },
      { threshold: 53, text: "加载区域地图文件[MAP-379]" },
      { threshold: 59, text: "解密地图数据..." },
      { threshold: 65, text: "计算生存指数[SRV-682]" },
      { threshold: 71, text: "检查安全协议..." },
      { threshold: 77, text: "校准工业系统" },
      { threshold: 83, text: "正在检验系统完整性..." },
      { threshold: 89, text: "准备接入主系统[SYS-000]" },
      { threshold: 93, text: "WELCOME, MORIME GUARD." },
      { threshold: 97, text: "欢迎回来，守林人。" }
    ];
    
    // 统计"欢迎回来，守林人。"的输出次数
    const welcomeCount = logLines.filter(line => line.text === "欢迎回来，守林人。").length;
    
    // 如果已经输出了两次"欢迎回来，守林人。"，则不再继续输出
    if (welcomeCount >= 2) {
      return;
    }
    
    // 确定当前进度下应显示的最高阈值日志
    let highestThresholdLog = null;
    
    for (let log of logs) {
      if (progress >= log.threshold) {
        highestThresholdLog = log;
      }
    }
    
    if (highestThresholdLog) {
      // 检查是否需要显示欢迎消息
      if (highestThresholdLog.threshold === 97) {
        setWelcomeMessage(true);
      }
      
      // 添加当前最高阈值的日志
      setLogLines(prev => [
        ...prev, 
        { id: Date.now() + Math.random(), text: highestThresholdLog.text }
      ]);
        
      // 自动滚动到底部 - 使用 requestAnimationFrame 确保在DOM更新后滚动
      if (consoleContentRef.current) {
        requestAnimationFrame(() => {
          if (consoleContentRef.current) {
             consoleContentRef.current.scrollTop = consoleContentRef.current.scrollHeight;
          }
        });
      }
    }
  };
  
  // 模拟加载进度
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      setProgress(prev => {
        // 稍微减小进度增长幅度，使其更平稳
        const newProgress = Math.min(prev + (Math.random() * 3.0 + 0.5), 100); 
        
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
    }, 150); // 增加间隔时间 - 从100增加到150毫秒，减慢更新频率
    
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
      'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
    ],
    transition: {
      clipPath: {
        duration: 1.2,
        ease: [0.65, 0, 0.35, 1],
        times: [0, 1]
      },
      opacity: {
        duration: 1.5,
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
          {/* 背景层 */}
          <motion.div 
            className={`${styles.wasteland_background} ${styles.variables}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={bgSplitAnimationWithLayers}
          />
          
          {/* 主内容层 */}
          <motion.div 
            className={styles.loading_screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={bgSplitAnimationWithLayers}
            ref={containerRef}
          >
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
            
            {/* 网格背景 */}
            <div className={styles.grid_overlay}></div>
            
            {/* 新增：背景HUD层 */}
            <motion.div 
              className={styles.background_hud_layer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 1.0 } }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              {/* 背景大圆环 */}
              <div className={styles.hud_background_circle}></div>
              
              {/* 左侧刻度 */}
              <div className={styles.hud_scale_left}>
                <div className={styles.scale_animation_container}> 
                  <motion.div 
                    className={styles.scale_animation_content}
                    animate={{ y: ["0%", "-50%"] }} // 滚动动画
                    transition={{
                      duration: 10, // 滚动速度
                      ease: "linear",
                      repeat: Infinity
                    }}
                  >
                    {/* 连接线 */}
                    <div className={styles.scale_connecting_line}></div>
                    {/* 生成两倍标记以实现无缝滚动 */}
                    {[...Array(20)].map((_, i) => ( // 增加到 20 个标记 (覆盖 200% 高度)
                      <div 
                        key={`scale-l-${i}`} 
                        className={styles.scale_marker} 
                        style={{ top: `${5 + i * 10}%` }} // 调整间距和起始位置 (5% 到 195%)
                      ></div>
                    ))}
                  </motion.div>
                </div>
                <span className={styles.scale_label_v}>ALT</span>
              </div>
              
              {/* 右侧刻度 */}
              <div className={styles.hud_scale_right}>
                 <div className={styles.scale_animation_container}>
                  <motion.div 
                    className={styles.scale_animation_content}
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      duration: 10,
                      ease: "linear",
                      repeat: Infinity
                    }}
                  >
                    {/* 连接线 */}
                    <div className={styles.scale_connecting_line}></div>
                    {/* 生成两倍标记 */}
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={`scale-r-${i}`} 
                        className={styles.scale_marker} 
                        style={{ top: `${5 + i * 10}%` }}
                      ></div>
                    ))}
                  </motion.div>
                </div>
                <span className={styles.scale_label_v}>SPD</span>
              </div>

              {/* 底部散落点 */}
              <div className={styles.hud_scatter_dots}>
                 {[...Array(7)].map((_, i) => (
                    <motion.div 
                      key={`dot-${i}`} 
                      className={styles.scatter_dot} 
                      style={{ 
                        left: `${15 + Math.random() * 70}%`, 
                        bottom: `${5 + Math.random() * 10}%`,
                        transform: `scale(${0.5 + Math.random() * 0.5})`
                      }} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 + Math.random() * 0.3, transition: { delay: 0.8 + Math.random() * 0.5, duration: 0.5 } }}
                    />
                 ))}
              </div>
            </motion.div>
            
            {/* 主内容 */}
            <div className={styles.loading_content}>
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
                exit={horizontalSlideOut('left')}
              >
                <div className={styles.frame_container}>
                  {/* 标题 - 使用framer-motion优化动画 */}
                  <div className={styles.title_container}>
                    <motion.h1 
                      className={`${styles.main_title} ${styles.shiny_text}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={titleVariants}
                    >
                      RAIN
                    </motion.h1>
                    <motion.h2 
                      className={`${styles.sub_title} ${styles.shiny_text}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={subtitleVariants}
                    >
                      MORIME
                    </motion.h2>
                  </div>
                  
                  {/* 装饰框架为工业风格装饰 */}
                  <div className={styles.decorative_frame}></div>
                  <div className={styles.industrial_decorations}></div>
                  <div className={styles.side_lines}></div>
                  <div className={`${styles.side_lines} ${styles.side_lines_right}`}></div>
                  <div className={styles.decoration_dots}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                  <div className={styles.dimension_marker}></div>
                </div>
                
                {/* 状态图标 */}
                <div className={styles.status_icon}>
                  <div className={styles.icon_pulse}></div>
                </div>
              </motion.div>
              
              {/* 控制台日志 - 移到LOGO右侧 */}
              <motion.div 
                className={styles.console_output}    
                initial={{ opacity: 0, x: 30 }} // 从右侧滑入    
                animate={{ opacity: 1, x: 0 }}    
                transition={{ 
                  duration: 0.7, 
                  delay: 0.5, // 稍微延迟出现    
                  ease: [0.1, 0.3, 0.2, 1] 
                }}    
                exit={horizontalSlideOut('right')} // 从右侧滑出
              >    
                <div className={styles.console_header}>    
                  <span className={styles.header_title}>SYSTEM LOG</span>    
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
            </div>
            
            {/* 进度指示区域 - 移到内容区域外部，放置在底部 */}    
            <motion.div     
              className={styles.progress_area}    
              initial={{ opacity: 0, y: 15 }}    
              animate={{ opacity: 1, y: 0 }}    
              transition={{     
                duration: 0.7,     
                delay: 0.8, // 延迟出现    
                ease: [0.1, 0.3, 0.2, 1]    
              }}    
              exit={horizontalSlideOut('left')}    
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
            </motion.div>
            
            {/* HUD元素 - 修改为横向移出 */}
            <motion.div 
              className={styles.hud_elements}
              exit={staggerChildren}
            >
              <motion.div 
                className={`${styles.hud_element} ${styles.top_left}`}
                custom={{ index: 0 }}
                exit={horizontalSlideOut('left')}
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>STATUS MONITOR</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.top_right}`}
                custom={{ index: 1 }}
                exit={horizontalSlideOut('right')}
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>SYSTEM ONLINE</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_left}`}
                custom={{ index: 2 }}
                exit={horizontalSlideOut('left')}
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>ID-1A1A1A</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_right}`}
                custom={{ index: 3 }}
                exit={horizontalSlideOut('right')}
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