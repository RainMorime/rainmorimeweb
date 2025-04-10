import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/HomeLoadingScreen.module.scss';

const HomeLoadingScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState([]);
  const [logQueue, setLogQueue] = useState([]); // 新增：待显示日志队列
  const [isExiting, setIsExiting] = useState(false);
  const [currentTime, setCurrentTime] = useState('--:--:--');
  const [welcomeMessage, setWelcomeMessage] = useState(false);
  const [showSplitLines, setShowSplitLines] = useState(false);
  const [letterDelays, setLetterDelays] = useState([]); // 新增：存储字母随机延迟
  
  const containerRef = useRef(null);
  const consoleContentRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const processedLogTextsRef = useRef(new Set()); // 新增：跟踪已处理的日志文本
  const welcomeMessageCountsRef = useRef({}); // 新增：跟踪欢迎消息计数
  const minDisplayTime = 1800; // 最小显示时间 - 从2800减少到1800
  
  const [startTransitionOutTimer, setStartTransitionOutTimer] = useState(false); // 新增 state 控制转场计时器
  
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
  
  // 新增：为 MORIME 字母生成随机延迟
  useEffect(() => {
    if (loading) {
      const word = "MORIME";
      const baseDelay = 0.9; // 基础延迟 (与 RAIN 动画协调)
      const staggerAmount = 0.12; // 每个字母出现的基础间隔
      
      // 创建索引数组 [0, 1, 2, 3, 4, 5]
      const indices = Array.from(Array(word.length).keys());
      
      // 随机打乱索引数组 (Fisher-Yates shuffle)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      
      // 根据打乱后的顺序计算每个字母的延迟时间
      // delays 数组的索引对应字母在 "MORIME" 中的原始位置
      const delays = Array(word.length).fill(0);
      indices.forEach((originalIndex, shuffledPosition) => {
         // 延迟时间 = 基础延迟 + 打乱后的位置 * 间隔时间
         delays[originalIndex] = baseDelay + shuffledPosition * staggerAmount;
      });
      
      setLetterDelays(delays); // 保存计算好的延迟数组
    }
  }, [loading]); // 依赖 loading，确保只在加载开始时运行一次
  
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
    
    let newLinesToAdd = []; // 存储本次要添加的新日志行

    for (let log of logs) {
      const isWelcome = log.threshold === 93 || log.threshold === 97;

      if (isWelcome) {
        // 处理欢迎消息
        const currentCount = welcomeMessageCountsRef.current[log.text] || 0;
        if (progress >= log.threshold && currentCount < 2) {
          newLinesToAdd.push({ id: Date.now() + Math.random(), text: log.text });
          welcomeMessageCountsRef.current[log.text] = currentCount + 1;
          if (log.threshold === 97) {
            setWelcomeMessage(true);
            
            // 如果是第二次显示"欢迎回来，守林人。"，延迟800ms再触发转场
            if (currentCount === 1 && progress >= 100) {
              // 这里使用setTimeout来延迟显示分割线特效
              const delayTransition = setTimeout(() => {
                setShowSplitLines(true);
              }, 800);
              
              // 清理函数，以防组件卸载时计时器仍在运行
              return () => clearTimeout(delayTransition);
            }
          }
        }
      } else {
        // 处理普通日志消息
        // 检查阈值是否达到，并且该日志文本还未被处理
        if (progress >= log.threshold && !processedLogTextsRef.current.has(log.text)) {
          processedLogTextsRef.current.add(log.text); // 标记为已处理
          
          // 为普通日志生成随机数量（3-10）的百分比阶段
          const numLines = Math.floor(Math.random() * 8) + 3; // 生成 3 到 10 之间的随机数
          let lastPercentage = 0;

          for (let i = 1; i <= numLines; i++) {
            let currentPercentage;
            if (i === numLines) {
              // 最后一条必须是 100%
              currentPercentage = 100;
            } else {
              // 生成一个比上一次大，且小于 (100 - (numLines - i) * 5) 的随机百分比，确保后续有空间递增
              // 最小增加 5%，最大增加范围随剩余行数减少而减少
              const minPercentage = lastPercentage + 5;
              const maxPercentage = Math.max(minPercentage + 5, 100 - (numLines - i) * 5);
              currentPercentage = Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) + minPercentage;
              currentPercentage = Math.min(99, currentPercentage); // 确保中间值不超过99
            }

            newLinesToAdd.push({ 
              id: Date.now() + Math.random() * i, // 增加随机性避免key冲突
              text: `${log.text} ${currentPercentage}%` 
            });
            lastPercentage = currentPercentage; // 更新上一次的百分比
          }
        }
      }
    }

    // 如果有新行需要添加，则将它们添加到队列中
    if (newLinesToAdd.length > 0) {
      setLogQueue(prev => [...prev, ...newLinesToAdd]);
      // 不再直接更新 logLines 或在此处滚动
      /*
      setLogLines(prev => [...prev, ...newLinesToAdd]);

      // 自动滚动到底部
      if (consoleContentRef.current) {
        requestAnimationFrame(() => {
          if (consoleContentRef.current) {
             consoleContentRef.current.scrollTop = consoleContentRef.current.scrollHeight;
          }
        });
      }
      */
    }
  };
  
  // 修改：当 progress 达到 100% 时触发分割线，不再在此处直接处理退出
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + (Math.random() * 3.0 + 0.5), 100); 
        generateLogLine(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          const elapsedTime = Date.now() - startTimeRef.current;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          // 只设置 setShowSplitLines 的 timeout
          // 不再检查 welcomeMessageCountsRef 来决定是否设置，统一处理
          setTimeout(() => {
            setShowSplitLines(true);
          }, remainingTime);

          return 100;
        }
        
        return newProgress;
      });
    }, 150); 
    
    return () => clearInterval(interval);
  }, [onComplete]); // 依赖项保持不变
  
  // 新增：处理日志队列，实现逐条显示
  useEffect(() => {
    if (!loading || logQueue.length === 0) return; // 仅在加载中且队列不为空时运行

    const displayInterval = setInterval(() => {
      setLogQueue(currentQueue => {
        if (currentQueue.length === 0) {
          clearInterval(displayInterval); // 队列空了，停止定时器
          return [];
        }
        
        const lineToAdd = currentQueue[0]; // 取出队列的第一条
        
        // 添加到显示的日志行
        setLogLines(prevLines => [...prevLines, lineToAdd]);

        // 自动滚动到底部
        if (consoleContentRef.current) {
          requestAnimationFrame(() => {
            // 短暂延迟后再次检查 current，确保 DOM 更新
            setTimeout(() => {
               if (consoleContentRef.current) {
                 consoleContentRef.current.scrollTop = consoleContentRef.current.scrollHeight;
               }
            }, 0);
          });
        }

        return currentQueue.slice(1); // 从队列中移除已显示的行
      });
    }, 60); // 控制日志显示的间隔时间（毫秒）

    return () => clearInterval(displayInterval); // 组件卸载或 loading 结束时清理定时器

  }, [loading, logQueue]); // 依赖 loading 和 logQueue
  
  // 修改：处理转场退出逻辑
  const handleTransitionOut = () => {
    setLoading(false);
    if (onComplete) {
      onComplete();
    }
  };

  // 新增：useEffect 监听 showSplitLines 并触发最终退出
  useEffect(() => {
    if (showSplitLines) {
      // 当分割线动画开始时，设置一个定时器来触发最终的退出
      const transitionTimer = setTimeout(() => {
        handleTransitionOut();
      }, 800); // 延迟 800ms 后开始退出，让分割线动画播放一部分

      // 清理函数
      return () => clearTimeout(transitionTimer);
    }
  }, [showSplitLines]); // 依赖 showSplitLines
  
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
      'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' // 从右到左擦除
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
  
  // 优化的标题动画变量 - 添加从左滑入效果
  const titleVariants = {
    hidden: { 
      opacity: 0, // 初始不可见
      x: -50 // 从左侧开始
    },
    visible: { 
      opacity: 0.7,
      x: 0, // 移动到最终位置
      filter: "blur(0px)",
      transition: {
        duration: 0.7, // 动画持续时间
        delay: 0.8,    // 在 logo_area 展开后 (0.6s + 0.2s) 延迟触发
        ease: [0.22, 1, 0.36, 1] // Ease-out 缓动
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  // 副标题容器动画 - 移除交错控制，由字母自身控制延迟
  const subtitleContainerVariants = {
    hidden: { 
      opacity: 0 // 容器初始不可见
    },
    visible: { 
      opacity: 1, // 容器变为可见
      transition: {
        // 移除 staggerChildren 和 delayChildren
        // 可以保留一个微小的容器延迟（如果需要）
        // delay: 0.8
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  // 副标题字母动画 - 修改为瞬间显现
  const letterSpanVariants = {
    hidden: { 
      opacity: 0, 
      // y: 10 // 移除 y 轴动画
    },
    visible: { 
      opacity: 0.6, // 最终状态：可见
      // y: 0,     // 移除 y 轴动画
      // transition 定义移到 span 自身，以便应用随机延迟
    } 
    // exit 状态可以省略，因为父容器 subtitleContainerVariants 会处理整体退出
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
                {/* 第七层水平滑动 - 最慢、颜色最深，完成时触发擦除 */}
                <motion.div
                  className={styles.horizontal_slide_seventh}
                  initial={{ scaleX: 0, x: "-400%" }}
                  animate={{ scaleX: 1, x: "0%" }} 
                  exit={{ x: "0%", opacity: 0.02 }} 
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.2,
                    ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
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
                initial={{ opacity: 1, scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.1, 0.3, 0.2, 1]
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
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
                      variants={subtitleContainerVariants} // 使用修改后的容器变体
                    >
                      {/* 将 MORIME 拆分为字母并应用随机延迟动画 */}
                      { "MORIME".split("").map((char, index) => (
                        <motion.span 
                          key={`${char}-${index}`} 
                          initial="hidden"
                          animate={letterDelays.length > 0 ? "visible" : "hidden"}
                          variants={letterSpanVariants} // 使用修改后的字母变体
                          style={{ display: 'inline-block', position: 'relative' }} 
                          transition={{ 
                            duration: 0.05, // 接近瞬时显现
                            delay: letterDelays[index] || (0.9 + index * 0.1) // 应用计算出的随机延迟，提供一个 fallback
                          }}
                        >
                          {char}
                        </motion.span>
                      )) }
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
                
                {/* 新增：旋转的小方框 */}
                <div className={styles.rotating_square}></div> 
                
                {/* 状态图标 */}
                <div className={styles.status_icon}>
                  <div className={styles.icon_pulse}></div>
                </div>
              </motion.div>
              
              {/* 控制台日志 - 作为背景 */}
              <motion.div 
                className={styles.console_output}    
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 1.0,
                  ease: "linear"
                }}    
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
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
                      <span className={styles.log_text}>
                        {line.text} 
                      </span>    
                    </div>    
                  ))}    
                  {/* 添加固定底部提示符 */}    
                  {logLines.length > 0 && (    
                    <div className={styles.log_line} style={{ opacity: 1 }}>    
                      <span className={styles.log_prefix}>&gt;</span>    
                      <span className={styles.log_text}>_</span>    
                    </div>    
                  )}    
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
                delay: 0.8,
                ease: [0.1, 0.3, 0.2, 1]    
              }}    
              exit={{ opacity: 0, transition: { duration: 0.5 } }}    
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
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>STATUS MONITOR</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.top_right}`}
                custom={{ index: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>SYSTEM ONLINE</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_left}`}
                custom={{ index: 2 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>ID-1A1A1A</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_right}`}
                custom={{ index: 3 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
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