import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/HomeLoadingScreen.module.scss';
import gsap from 'gsap'; // GSAP 动画库

const HomeLoadingScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(true); // 加载状态
  const [progress, setProgress] = useState(0); // 加载进度
  const [logLines, setLogLines] = useState([]); // 控制台日志行
  const [logQueue, setLogQueue] = useState([]); // 待显示的日志队列
  const [isExiting, setIsExiting] = useState(false); // 是否正在退出的标志 (当前未使用，可考虑移除)
  const [currentTime, setCurrentTime] = useState('--:--:--'); // 当前时间显示
  const [welcomeMessage, setWelcomeMessage] = useState(false); // 是否显示欢迎消息的标志
  const [showSplitLines, setShowSplitLines] = useState(false); // 是否显示转场分割线的标志
  const [letterDelays, setLetterDelays] = useState([]); // "MORIME" 字母动画的随机延迟
  const [rainLetterDelays, setRainLetterDelays] = useState([]); // "RAIN" 字母动画的随机延迟
  const [dotStyles, setDotStyles] = useState([]); // 底部散落装饰点的样式
  
  const containerRef = useRef(null); // 主容器引用
  const consoleContentRef = useRef(null); // 控制台内容区域引用，用于滚动
  const startTimeRef = useRef(Date.now()); // 加载开始时间引用
  const processedLogTextsRef = useRef(new Set()); // 跟踪已处理的日志文本，防止重复
  const welcomeMessageCountsRef = useRef({}); // 跟踪欢迎消息的显示次数
  const minDisplayTime = 1800; // 加载动画最小显示时间 (毫秒)
  const hudCircleRef = useRef(null); // 背景 HUD 大圆环引用
  const rotatingInnerGroupRef = useRef(null); // HUD 右上角旋转内圈组引用
  const sectorPathRef = useRef(null); // HUD 右上角旋转扇形路径引用
  const signalLineRef = useRef(null); // HUD 右上角信号线引用
  const outerCircleGroupRef = useRef(null); // HUD 右上角外圈圆和刻度线的旋转组引用
  
  // 扇形参数 (HUD 右上角)
  const sectorRadius = 50; // 扇形半径
  const sectorAngleWidth = 25; // 扇形固定角度宽度
  
  // const [startTransitionOutTimer, setStartTransitionOutTimer] = useState(false); // 控制转场计时器 (当前未使用，可考虑移除)
  
  // 初始化并每秒更新当前时间
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer); // 清理定时器
  }, []);
  
  // 为 "RAIN" 和 "MORIME" 字母生成随机动画延迟
  useEffect(() => {
    if (loading) {
      const rainWord = "RAIN";
      const morimeWord = "MORIME";
      const rainBaseDelay = 0.8; // RAIN 动画基础延迟
      const rainStaggerAmount = 0.1; // RAIN 字母间隔
      const morimeBaseDelay = rainBaseDelay + rainWord.length * rainStaggerAmount + 0.1; // MORIME 基础延迟
      const morimeStaggerAmount = 0.12; // MORIME 字母间隔

      // 计算 RAIN 的延迟
      const rainIndices = Array.from(Array(rainWord.length).keys());
      // Fisher-Yates shuffle
      for (let i = rainIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rainIndices[i], rainIndices[j]] = [rainIndices[j], rainIndices[i]];
      }
      const rainDelays = Array(rainWord.length).fill(0);
      rainIndices.forEach((originalIndex, shuffledPosition) => {
         rainDelays[originalIndex] = rainBaseDelay + shuffledPosition * rainStaggerAmount;
      });
      setRainLetterDelays(rainDelays);

      // 计算 MORIME 的延迟
      const morimeIndices = Array.from(Array(morimeWord.length).keys());
      // Fisher-Yates shuffle
      for (let i = morimeIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [morimeIndices[i], morimeIndices[j]] = [morimeIndices[j], morimeIndices[i]];
      }
      const morimeDelays = Array(morimeWord.length).fill(0);
      morimeIndices.forEach((originalIndex, shuffledPosition) => {
         morimeDelays[originalIndex] = morimeBaseDelay + shuffledPosition * morimeStaggerAmount;
      });
      setLetterDelays(morimeDelays);
    }
  }, [loading]); // 仅在加载开始时运行
  
  // 根据加载进度生成控制台日志行
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
      { threshold: 59, text: "正在索引伊甸计划基因序列..." },
      { threshold: 65, text: "计算生存指数[SRV-682]" },
      { threshold: 71, text: "加载莱茵计划大气模型..." },
      { threshold: 77, text: "校准工业系统..." },
      { threshold: 83, text: "正在检验系统完整性..." },
      { threshold: 89, text: "准备接入主系统[SYS-000]" },
      { threshold: 93, text: "WELCOME, MORIME GUARD." }, // 欢迎消息1
      { threshold: 97, text: "欢迎回来，守林人。" }     // 欢迎消息2
    ];
    
    let newLinesToAdd = [];

    for (let log of logs) {
      const isWelcome = log.threshold === 93 || log.threshold === 97;
      const currentCount = welcomeMessageCountsRef.current[log.text] || 0;
      // 允许欢迎消息重复显示（最多2次），普通日志不重复
      const canProcess = (isWelcome && currentCount < 2) || (!isWelcome && !processedLogTextsRef.current.has(log.text));
      
      if (progress >= log.threshold && canProcess) {
        if (isWelcome) {
          newLinesToAdd.push({ id: Date.now() + Math.random(), text: log.text });
          welcomeMessageCountsRef.current[log.text] = currentCount + 1;
          if (log.threshold === 97) {
            setWelcomeMessage(true);
          }
        } else {
          processedLogTextsRef.current.add(log.text); // 标记普通日志为已处理

          // 根据概率随机生成 2-4 或 3-8 行带百分比的日志
          let numLines = Math.random() < 0.2 ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 3) + 2;
          let lastPercentage = 0;

          for (let i = 1; i <= numLines; i++) {
            let currentPercentage;
            if (i === numLines) {
              currentPercentage = 100;
            } else {
              const minPercentage = lastPercentage + 5;
              const maxPercentage = Math.max(minPercentage + 5, 100 - (numLines - i) * 5);
              currentPercentage = Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) + minPercentage;
              currentPercentage = Math.min(99, currentPercentage); // 最大99%
            }
            newLinesToAdd.push({ 
              id: Date.now() + Math.random() * i,
              text: `${log.text} ${currentPercentage}%` 
            });
            lastPercentage = currentPercentage;
          }
        }
      }
    }

    if (newLinesToAdd.length > 0) {
      setLogQueue(prev => [...prev, ...newLinesToAdd]); // 将新日志行加入队列
    }
  };
  
  // 处理加载进度条更新及相关逻辑
  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + (Math.random() * 3.0 + 0.5), 100); // 随机增加进度
        generateLogLine(newProgress); // 生成对应进度的日志

        if (newProgress >= 100) {
          clearInterval(interval); // 进度100%，停止更新
          const elapsedTime = Date.now() - startTimeRef.current;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          // 确保在最小显示时间后触发转场分割线动画
          const showSplitTimer = setTimeout(() => {
            setShowSplitLines(true);
          }, remainingTime);
          // 此处不能直接返回 clearTimeout(showSplitTimer)，useEffect 的清理函数在外部返回
          return 100;
        }
        return newProgress;
      });
    }, 80); // 进度条更新频率 (毫秒)

    return () => clearInterval(interval); // 组件卸载时清理 interval
  }, [onComplete]);
  
  // 处理日志队列，实现逐条动画显示日志
  useEffect(() => {
    if (!loading || logQueue.length === 0) return; // 仅在加载中且队列不为空时运行

    const displayInterval = setInterval(() => {
      setLogQueue(currentQueue => {
        if (currentQueue.length === 0) {
          clearInterval(displayInterval); // 队列为空，停止
          return [];
        }
        
        const lineToAdd = currentQueue[0];
        setLogLines(prevLines => [...prevLines, lineToAdd]); // 添加到显示的日志列表

        // 自动滚动控制台到底部
        if (consoleContentRef.current) {
          requestAnimationFrame(() => {
            setTimeout(() => { // 确保 DOM 更新后再滚动
               if (consoleContentRef.current) {
                 consoleContentRef.current.scrollTop = consoleContentRef.current.scrollHeight;
               }
            }, 0);
          });
        }
        return currentQueue.slice(1); // 从队列中移除已显示的行
      });
    }, 70); // 日志显示间隔 (毫秒)

    return () => clearInterval(displayInterval); // 清理定时器
  }, [loading, logQueue]);
  
  // 背景 HUD 大圆环的 GSAP 动画 (旋转与脉冲)
  useEffect(() => {
    if (loading && hudCircleRef.current) {
      const rotationTween = gsap.to(hudCircleRef.current, {
        rotation: 360,
        duration: 90, // 旋转一周时间
        repeat: -1,   // 无限重复
        ease: 'none'
      });
      const pulseTween = gsap.to(hudCircleRef.current, {
        opacity: 0.7, // 目标透明度
        duration: 4,  // 脉冲一次时间
        repeat: -1,
        yoyo: true,   // 往复运动
        ease: 'power1.inOut'
      });
      return () => { // 清理 GSAP 动画
        rotationTween.kill();
        pulseTween.kill();
      };
    }
  }, [loading]);
  
  // 处理加载完成后的转场逻辑
  const handleTransitionOut = () => {
      setLoading(false); // 设置加载状态为 false
      if (onComplete) {
        onComplete(); // 执行传入的 onComplete 回调
      }
    };
  
  // 监听 showSplitLines 状态，当分割线动画开始后，延迟触发最终的退出逻辑
  useEffect(() => {
    if (showSplitLines) {
      const transitionTimer = setTimeout(() => {
        handleTransitionOut();
      }, 600); // 分割线动画播放一段时间后 (600ms) 开始退出
      return () => clearTimeout(transitionTimer); // 清理定时器
    }
  }, [showSplitLines, onComplete]);
  
  // HUD 右上角内圈组的 GSAP 随机旋转动画
  useEffect(() => {
    if (loading && rotatingInnerGroupRef.current) {
      let currentTween;
      const randomRotate = () => {
        if (currentTween) currentTween.kill(); // 停止当前动画
        
        const targetRotation = "+=" + (Math.random() * 180 - 90); // 目标旋转角度 (-90 to +90)
        const duration = gsap.utils.random(0.4, 1.5);          // 动画时长
        const delay = gsap.utils.random(0.03, 0.1);           // 延迟时间
        const ease = gsap.utils.random(["power1.inOut", "power2.inOut", "sine.inOut", "none"]); // 随机缓动

        currentTween = gsap.to(rotatingInnerGroupRef.current, {
          rotation: targetRotation,
          duration: duration,
          ease: ease,
          delay: delay,
          onComplete: randomRotate // 完成后再次调用，形成循环
        });
      };
      randomRotate(); // 启动动画
      return () => gsap.killTweensOf(rotatingInnerGroupRef.current); // 清理 GSAP 动画
    }
  }, [loading]);
  
  // HUD 右上角旋转扇形的 GSAP 动画
  useEffect(() => {
    if (loading && sectorPathRef.current) {
      const angleProxy = { angle: 0 }; // 代理对象存储角度
      const sectorTween = gsap.to(angleProxy, {
        angle: 360,
        duration: 2.5, // 旋转一周时间
        ease: "none",
        repeat: -1,
        onUpdate: () => { // 实时更新扇形路径
          if (sectorPathRef.current) {
            const currentStartAngle = angleProxy.angle;
            const newPathD = describeSector(
              50, 50, // 中心点 cx, cy
              sectorRadius,
              currentStartAngle,
              currentStartAngle + sectorAngleWidth // 结束角度 = 开始角度 + 固定宽度
            );
            sectorPathRef.current.setAttribute('d', newPathD);
          }
        }
      });
      return () => sectorTween.kill(); // 清理 GSAP 动画
    }
  }, [loading, sectorRadius, sectorAngleWidth]);
  
  // HUD 右上角信号线的 GSAP 绘制动画
  useEffect(() => {
    if (loading && signalLineRef.current) {
      const line = signalLineRef.current;
      const lineLength = 160.36; // 线条估算长度

      gsap.set(line, { // 设置初始状态 (隐藏线条)
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
        opacity: 1
      });
      const lineTween = gsap.to(line, { // 绘制动画
        strokeDashoffset: 0,
        duration: 0.6, // 绘制时长
        delay: 1.8,    // 延迟开始
        ease: "power1.inOut"
      });
      return () => lineTween.kill(); // 清理 GSAP 动画
    }
  }, [loading]);
  
  // HUD 右上角外圈及其刻度线的 GSAP 旋转动画
  useEffect(() => {
    if (loading && outerCircleGroupRef.current) {
      const rotationTween = gsap.to(outerCircleGroupRef.current, {
        rotation: 360,
        duration: 60, // 旋转一周时间
        repeat: -1,
        ease: 'none',
        transformOrigin: "50% 50%" // 围绕 SVG 中心旋转
      });
      return () => rotationTween.kill(); // 清理 GSAP 动画
    }
  }, [loading]);
  
  // 客户端生成底部散落装饰点的样式 (仅在加载时生成一次)
  useEffect(() => {
    if (loading) {
      const styles = [];
      for (let i = 0; i < 7; i++) { // 生成 7 个点的样式
        styles.push({
          left: `${15 + Math.random() * 70}%`,
          bottom: `${5 + Math.random() * 10}%`,
          transform: `scale(${0.5 + Math.random() * 0.5})`
        });
      }
      setDotStyles(styles);
    }
  }, [loading]);
  
  // --- Framer Motion 动画变体定义 ---
  // 整体退场过渡效果
  const exitTransition = {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1]
  };

  // 子元素交错退场动画 (当前未使用，但可用于 HUD 元素组)
  const staggerChildren = {
    opacity: 0,
    transition: {
      staggerChildren: 0.1
    }
  };

  // 文本元素通用退场动画
  const textExitAnimation = {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  };

  // 控制台区域退场动画
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

  // HUD 元素通用退场动画 (可配合 staggerChildren 使用)
  const hudExitAnimations = {
    opacity: 0,
    x: ({ index }) => index % 2 === 0 ? -30 : 30, // 根据索引左右移出
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  };

  // 水平滑出动画 (用于转场分割线)
  const horizontalSlideOut = (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : 100,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  // 背景层多层视差切割退场动画
  const bgSplitAnimationWithLayers = {
    opacity: [1, 1, 0],
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 
      'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' // 从右到左擦除效果
    ],
    transition: {
      clipPath: {
        duration: 1.2, // 动画时长
        ease: [0.65, 0, 0.35, 1],
        times: [0, 1]
      },
      opacity: {
        duration: 2.0, // 透明度变化时长
        times: [0, 0.8, 1],
        ease: [0.65, 0, 0.35, 1]
      }
    }
  };
  
  // 标题 ("RAINMORIME") 容器入场动画变体
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.7 } }, // 容器延迟出现
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };
  
  // 主标题 ("RAIN") 字母入场动画变体
  const mainLetterSpanVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.7 } // RAIN 最终透明度
  };

  // 副标题 ("MORIME") 容器入场动画变体
  const subtitleContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  // 副标题 ("MORIME") 字母入场动画变体 (瞬现效果)
  const letterSpanVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.6 } // MORIME 最终透明度
  };  

  // (arknightTransition 未被直接使用，但可作为备选转场效果)
  // const arknightTransition = (direction) => ({
  //   opacity: 0,
  //   x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
  //   y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
  //   transition: {
  //     duration: 0.6,
  //     ease: [0.22, 1, 0.36, 1]
  //   }
  // });

  // 辅助函数：计算 SVG 扇形路径 (d 属性)
  const describeSector = (cx, cy, radius, startAngle, endAngle) => {
    const startRad = ((startAngle % 360) - 90) * Math.PI / 180.0;
    const endRad = ((endAngle % 360) - 90) * Math.PI / 180.0;
    let angleDiff = (endAngle % 360) - (startAngle % 360);
    if (angleDiff <= 0) angleDiff += 360;
    const largeArcFlag = angleDiff <= 180 ? "0" : "1";

    const startX = cx + (radius * Math.cos(startRad));
    const startY = cy + (radius * Math.sin(startRad));
    const endX = cx + (radius * Math.cos(endRad));
    const endY = cy + (radius * Math.sin(endRad));

    return [
        "M", cx, cy,
        "L", startX, startY,
        "A", radius, radius, 0, largeArcFlag, 1, endX, endY,
        "Z"
    ].join(" ");
  }

  return (
    <AnimatePresence mode="wait"> {/* 等待退出动画完成后再渲染新组件 */} 
      {loading && (
        <>
          {/* 背景层 (荒原图片) */}
          <motion.div
            className={`${styles.wasteland_background} ${styles.variables}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={bgSplitAnimationWithLayers} // 应用背景层退场动画
          />
          
          {/* 主内容容器 */}
          <motion.div
            className={styles.loading_screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={bgSplitAnimationWithLayers} // 与背景层使用相同的退场，达到整体效果
            ref={containerRef}
          >
            {/* 转场分割线动画效果 (当 showSplitLines 为 true 时显示) */}
            {showSplitLines && (
              <>
                {/* 水平滑动遮罩层 (多层视差) */}
                <motion.div
                  className={styles.horizontal_slide} // 第一层
                  initial={{ scaleX: 0, x: "-100%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ 
                    duration: 0.8, ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 0.8, delay: 0, ease: [0.25, 1, 0.5, 1] }
                  }}
                />
                <motion.div
                  className={styles.horizontal_slide_second} // 第二层
                  initial={{ scaleX: 0, x: "-150%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "120%", opacity: 0 }}
                  transition={{ 
                    duration: 1.0, delay: 0.05, ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 0.9, delay: 0.05, ease: [0.25, 1, 0.5, 1] } 
                  }}
                />
                <motion.div
                  className={styles.horizontal_slide_third} // 第三层
                  initial={{ scaleX: 0, x: "-200%" }}
                  animate={{ scaleX: 1, x: "0%" }}
                  exit={{ x: "150%", opacity: 0 }}
                  transition={{ 
                    duration: 1.2, delay: 0.1, ease: [0.25, 1, 0.5, 1],
                    exit: { duration: 1.0, delay: 0.1, ease: [0.25, 1, 0.5, 1] } 
                  }}
                />
                
                {/* 中心菱形及交叉线条 */}
                <motion.div 
                  className={styles.split_diamond} // 中心菱形
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div 
                  className={styles.transition_line_horizontal} // 水平线
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div 
                  className={styles.transition_line_vertical} // 垂直线
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div 
                  className={styles.transition_line_diagonal_1} // 对角线1
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div 
                  className={styles.transition_line_diagonal_2} // 对角线2
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* 顶部和底部发光线条 */}
                <motion.div 
                  className={`${styles.transition_glow_line} ${styles.top}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                 <motion.div 
                  className={`${styles.transition_glow_line} ${styles.bottom}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </>
            )}
            
            {/* 网格背景覆盖层 */}
            <div className={styles.grid_overlay}></div>
            
            {/* 背景 HUD 元素层 */}
            <motion.div 
              className={styles.background_hud_layer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 1.0 } }} // 延迟淡入
              exit={{ opacity: 0, transition: { duration: 0.5 } }} // 淡出
            >
              {/* 背景大圆环 (GSAP 控制动画) */}
              <div 
                 className={styles.hud_background_circle} 
                 ref={hudCircleRef} 
                 style={{ opacity: 0.6 }} // GSAP 会覆盖此初始透明度
              ></div>
               
               {/* 右上角 HUD 圆形 SVG 容器 */}
               <svg 
                 className={styles.hud_secondary_circle_svg} 
                 viewBox="0 0 100 100" // SVG 视口
               >
                 {/* 外圈和刻度线的旋转组 (GSAP 控制动画) */}
                 <g ref={outerCircleGroupRef} className={styles.outer_circle_group}>
                   {/* 最外层绘制圆 */}
                   <circle 
                     className={styles.drawable_circle} 
                     cx="50" cy="50" r="48" // cx, cy 圆心; r 半径
                   />
                   {/* 外圈旋转刻度线 (60条) */}
                   { [...Array(60)].map((_, i) => {
                      const angle = i * 6; // 每 6 度一条
                      const rad = angle * Math.PI / 180;
                      const rInner = 46.5; // 刻度线内端半径
                      const rOuter = 48;   // 刻度线外端半径
                      const x1 = (50 + rInner * Math.cos(rad)).toFixed(5); // 保留5位小数避免 hydration error
                      const y1 = (50 + rInner * Math.sin(rad)).toFixed(5);
                      const x2 = (50 + rOuter * Math.cos(rad)).toFixed(5);
                      const y2 = (50 + rOuter * Math.sin(rad)).toFixed(5);
                      return (
                        <line
                          key={`outer-tick-${i}`}
                          className={styles.outer_circle_tick}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                        />
                      );
                    })}
                 </g>
                 {/* 中心实心圆点 (固定) */}
                 <circle 
                   className={styles.center_solid_dot}
                   cx="50" cy="50" r="3"
                 />
                 {/* 内圈空心圆 (固定) */}
                 <circle 
                   className={styles.inner_hollow_circle}
                   cx="50" cy="50" r="8"
                 />

                 {/* 旋转扇形 (GSAP 控制动画) */}
                 <path
                   ref={sectorPathRef}
                   className={styles.rotating_sector}
                   d={describeSector(50, 50, sectorRadius, 0, sectorAngleWidth)} // 初始路径
                 />

                 {/* 不规则旋转的内圈和刻度组 (GSAP 控制动画) */}
                 <g ref={rotatingInnerGroupRef} className={styles.rotating_inner_group}>
                   {/* 旋转的空心圆 */}
                   <circle
                      className={styles.rotating_inner_circle}
                      cx="50" cy="50" r="30"
                   />
                   {/* 旋转圆的刻度线 (36条) */}
                   { [...Array(36)].map((_, i) => {
                      const angle = i * 10; // 每 10 度一条
                      const rad = angle * Math.PI / 180;
                      const rInner = 28.5;
                      const rOuter = 30;
                      const x1 = (50 + rInner * Math.cos(rad)).toFixed(5);
                      const y1 = (50 + rInner * Math.sin(rad)).toFixed(5);
                      const x2 = (50 + rOuter * Math.cos(rad)).toFixed(5);
                      const y2 = (50 + rOuter * Math.sin(rad)).toFixed(5);
                      return (
                        <line
                          key={`tick-${i}`}
                          className={styles.rotating_circle_tick}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                        />
                      );
                    })}
                 </g>

                 {/* 信号线 (GSAP 控制绘制动画) */}
                 <polyline
                   ref={signalLineRef}
                   className={styles.signal_line}
                   points="50,50 75,25 200,25" // 信号线路径点
                 />
               </svg>

               {/* 生物信号文本 (循环淡入淡出动画) */}
               <motion.div
                 className={styles.bio_signal_text}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: [0, 0.7, 0.7, 0] }} // 淡入 -> 保持 -> 淡出
                 transition={{
                   duration: 2,    // 动画总时长
                   delay: 2.4,     // 延迟开始
                   repeat: Infinity, // 无限重复
                   repeatDelay: 0.1, // 重复间隔
                   times: [0, 0.15, 0.85, 1] // 各阶段时间点
                 }}
               >
                 Bio-Signal: Not Detected
               </motion.div>
               
               {/* 右侧条纹渐变装饰 */}
               <div className={styles.right_stripe_gradient}></div>

               {/* 左侧垂直刻度尺 (滚动动画) */}
               <div className={styles.hud_scale_left}>
                <div className={styles.scale_animation_container}> 
                  <motion.div 
                    className={styles.scale_animation_content}
                    animate={{ y: ["0%", "-50%"] }} // 向上滚动
                    transition={{
                      duration: 10, // 滚动速度
                      ease: "linear",
                      repeat: Infinity
                    }}
                  >
                    <div className={styles.scale_connecting_line}></div> {/* 连接线 */}
                    {[...Array(20)].map((_, i) => ( // 生成双倍标记实现无缝滚动
                      <div 
                        key={`scale-l-${i}`} 
                        className={styles.scale_marker} 
                        style={{ top: `${5 + i * 10}%` }}
                      ></div>
                    ))}
                  </motion.div>
                </div>
                <span className={styles.scale_label_v}>ALT</span> {/* 刻度标签 */} 
              </div>
              
              {/* 右侧垂直刻度尺 (滚动动画) */}
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
                    <div className={styles.scale_connecting_line}></div>
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

              {/* 底部散落装饰点 (随机位置和大小) */}
              <div className={styles.hud_scatter_dots}>
                {dotStyles.map((style, i) => (
                  <motion.div
                    key={`dot-${i}`}
                    className={styles.scatter_dot}
                    style={style} // 应用 state 中生成的随机样式
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 0.4 + (i * 0.05), // 基于索引略微改变透明度
                      transition: { delay: 0.8 + (i * 0.08), duration: 0.5 } // 基于索引略微改变延迟
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* 主要加载内容区域 (LOGO、控制台等) */}
            <div className={styles.loading_content}>
              {/* LOGO 及标题区域 */}
              <motion.div 
                className={styles.logo_area} // LOGO 区域容器
                initial={{ opacity: 1, scaleY: 0 }} // 初始从上往下收起
                animate={{ scaleY: 1 }} // 展开动画
                transition={{ 
                  duration: 0.6, delay: 0.2, ease: [0.1, 0.3, 0.2, 1]
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // LOGO 区域退场
              >
                <div className={styles.frame_container}> {/* 标题外框 */} 
                  {/* 标题 (RAINMORIME) */}
                  <div className={styles.title_container}>
                    <motion.h1 
                      className={`${styles.main_title} ${styles.shiny_text}`} // 主标题 "RAIN"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={titleContainerVariants} // 应用容器动画变体 (控制整体显隐和延迟)
                    >
                      { "RAIN".split("").map((char, index) => (
                        <motion.span 
                          key={`rain-${char}-${index}`} 
                          initial="hidden"
                          animate={rainLetterDelays.length > 0 ? "visible" : "hidden"} // 等待延迟数据加载
                          variants={mainLetterSpanVariants} // 应用字母动画变体
                          style={{ display: 'inline-block', position: 'relative' }} 
                          transition={{ 
                            duration: 0.05, // 字母瞬现效果
                            delay: rainLetterDelays[index] || (0.8 + index * 0.1) // 应用计算的随机延迟，提供 fallback
                          }}
                        >
                          {char}
                        </motion.span>
                      )) }
                    </motion.h1>
                    <motion.h2 
                      className={`${styles.sub_title} ${styles.shiny_text}`} // 副标题 "MORIME"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={subtitleContainerVariants}
                    >
                      { "MORIME".split("").map((char, index) => (
                        <motion.span 
                          key={`${char}-${index}`} 
                          initial="hidden"
                          animate={letterDelays.length > 0 ? "visible" : "hidden"}
                          variants={letterSpanVariants}
                          style={{ display: 'inline-block', position: 'relative' }} 
                          transition={{ 
                            duration: 0.05,
                            delay: letterDelays[index] || (0.9 + index * 0.1)
                          }}
                        >
                          {char}
                        </motion.span>
                      )) }
                    </motion.h2>
                  </div>
                  
                  {/* 装饰性元素 (边框、线条、点等) */}
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
                
                {/* 旋转的小方块装饰 */}
                <div className={styles.rotating_square}></div> 
                
                {/* 右上角状态图标 (脉冲动画) */}
                <div className={styles.status_icon}>
                  <div className={styles.icon_pulse}></div>
                </div>
              </motion.div>
              
              {/* 控制台日志输出区域 */}
              <motion.div 
                className={styles.console_output}    
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} // 淡入
                transition={{ duration: 0.7, delay: 1.0, ease: "linear" }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // 退场
              >    
                <div className={styles.console_header}> {/* 控制台头部 */} 
                  <span className={styles.header_title}>SYSTEM LOG</span>    
                </div>    
                <div     
                  className={styles.console_content} /* 日志内容，可滚动 */   
                  ref={consoleContentRef}    
                >    
                  {logLines.map(line => ( /* 渲染日志行 */   
                    <div key={line.id} className={styles.log_line}>    
                      <span className={styles.log_prefix}>&gt;</span> {/* 日志行前缀 */}    
                      <span className={styles.log_text}>
                        {line.text} 
                      </span>    
                    </div>    
                  ))}    
                  {logLines.length > 0 && ( /* 若有日志，显示一个固定的提示符行 */   
                    <div className={styles.log_line} style={{ opacity: 1 }}>    
                      <span className={styles.log_prefix}>&gt;</span>    
                      <span className={styles.log_text}>_</span> {/* 闪烁光标效果 (通过 CSS 实现) */}   
                    </div>    
                  )}    
                </div>    
              </motion.div>
            </div>
            
            {/* 底部进度指示区域 */}
            <motion.div     
              className={styles.progress_area}    
              initial={{ opacity: 0, y: 15 }} // 初始状态：透明且在下方    
              animate={{ opacity: 1, y: 0 }} // 动画：淡入并上移到原位    
              transition={{ duration: 0.7, delay: 0.8, ease: [0.1, 0.3, 0.2, 1] }}    
              exit={{ opacity: 0, transition: { duration: 0.5 } }} // 退场    
            >    
              {/* 进度条容器 */}
              <div className={styles.progress_container}>    
                <div className={styles.progress_track}> {/* 进度条轨道 */}    
                  <div     
                    className={styles.progress_fill} /* 进度条填充部分 */   
                    style={{ width: `${progress}%` }} /* 根据进度更新宽度 */   
                  ></div>    
                </div>    
                
                {/* 进度信息 (系统状态、加载百分比) */}
                <div className={styles.progress_info}>    
                  <div className={styles.info_row}>    
                    <span className={styles.info_label}>SYSTEM STATUS</span>    
                    <span className={styles.info_value}> {/* 根据进度显示不同状态文本 */}   
                      {progress < 30 ? "BOOT" :     
                       progress < 60 ? "SCAN" :     
                       progress < 90 ? "SYNC" : "READY"}    
                    </span>    
                  </div>    
                  <div className={styles.info_row}>    
                    <span className={styles.info_label}>DATA LOADING</span>    
                    <span className={styles.info_value}>{Math.floor(progress)}%</span> {/* 显示加载百分比 */}   
                  </div>    
                </div>    
              </div>    
            </motion.div>
            
            {/* 四角 HUD 文本元素 */}
            <motion.div 
              className={styles.hud_elements}
              exit={staggerChildren} // 应用交错退场 (当前 staggerChildren 定义为整体淡出)
            >
              <motion.div 
                className={`${styles.hud_element} ${styles.top_left}`}
                custom={{ index: 0 }} // 自定义属性，可用于 hudExitAnimations
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // HUD 元素退场
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
                <div className={styles.hud_text}>{currentTime}</div> {/* 显示当前时间 */} 
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomeLoadingScreen;