import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/HomeLoadingScreen.module.scss';
import gsap from 'gsap'; // 导入 GSAP

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
  const [rainLetterDelays, setRainLetterDelays] = useState([]); // 新增：存储 RAIN 字母随机延迟
  
  const containerRef = useRef(null);
  const consoleContentRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const processedLogTextsRef = useRef(new Set()); // 新增：跟踪已处理的日志文本
  const welcomeMessageCountsRef = useRef({}); // 新增：跟踪欢迎消息计数
  const minDisplayTime = 1800; // 最小显示时间 - 从2800减少到1800
  const hudCircleRef = useRef(null); // 新增：为背景圆环添加 ref
  const rotatingInnerGroupRef = useRef(null);
  const sectorPathRef = useRef(null); // 修改：确保 Ref 引用 Path
  const signalLineRef = useRef(null); // 新增：折线 Ref
  const outerCircleGroupRef = useRef(null); // 新增：外圈圆和刻度线的旋转组 Ref
  
  // 定义扇形参数 (移到 useEffect 之前)
  const sectorRadius = 50; // 半径，比旋转圆稍小
  const sectorAngleWidth = 25; // 扇形的固定角度宽度
  
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
  
  // 新增：为 RAIN 和 MORIME 字母生成随机延迟
  useEffect(() => {
    if (loading) {
      const rainWord = "RAIN";
      const morimeWord = "MORIME";
      const rainBaseDelay = 0.8; // RAIN 动画基础延迟 (logo_area 展开后)
      const rainStaggerAmount = 0.1; // RAIN 字母间隔
      const morimeBaseDelay = rainBaseDelay + rainWord.length * rainStaggerAmount + 0.1; // MORIME 基础延迟 (RAIN 结束后 + 0.1s 间隔)
      const morimeStaggerAmount = 0.12; // MORIME 字母间隔

      // --- 计算 RAIN 的延迟 ---
      const rainIndices = Array.from(Array(rainWord.length).keys());
      for (let i = rainIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rainIndices[i], rainIndices[j]] = [rainIndices[j], rainIndices[i]];
      }
      const rainDelays = Array(rainWord.length).fill(0);
      rainIndices.forEach((originalIndex, shuffledPosition) => {
         rainDelays[originalIndex] = rainBaseDelay + shuffledPosition * rainStaggerAmount;
      });
      setRainLetterDelays(rainDelays); // 保存 RAIN 的延迟

      // --- 计算 MORIME 的延迟 ---
      const morimeIndices = Array.from(Array(morimeWord.length).keys());
      for (let i = morimeIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [morimeIndices[i], morimeIndices[j]] = [morimeIndices[j], morimeIndices[i]];
      }
      const morimeDelays = Array(morimeWord.length).fill(0);
      morimeIndices.forEach((originalIndex, shuffledPosition) => {
         morimeDelays[originalIndex] = morimeBaseDelay + shuffledPosition * morimeStaggerAmount;
      });
      setLetterDelays(morimeDelays); // 保存 MORIME 的延迟
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

      // 检查日志文本是否已处理，或者是否是允许重复的欢迎消息
      const currentCount = welcomeMessageCountsRef.current[log.text] || 0;
      const canProcess = (isWelcome && currentCount < 2) || (!isWelcome && !processedLogTextsRef.current.has(log.text));
      
      if (progress >= log.threshold && canProcess) {
        if (isWelcome) {
          newLinesToAdd.push({ id: Date.now() + Math.random(), text: log.text });
          welcomeMessageCountsRef.current[log.text] = currentCount + 1;
          if (log.threshold === 97) {
            setWelcomeMessage(true);
            // 欢迎消息不再直接触发分割线
          }
        } else {
          processedLogTextsRef.current.add(log.text); // 标记普通日志为已处理

          const numLines = Math.floor(Math.random() * 8) + 3; 
          let lastPercentage = 0;

          for (let i = 1; i <= numLines; i++) {
            let currentPercentage;
            if (i === numLines) {
              currentPercentage = 100;
            } else {
              const minPercentage = lastPercentage + 5;
              const maxPercentage = Math.max(minPercentage + 5, 100 - (numLines - i) * 5);
              currentPercentage = Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) + minPercentage;
              currentPercentage = Math.min(99, currentPercentage);
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
      setLogQueue(prev => [...prev, ...newLinesToAdd]);
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
          
          // 确保在最小显示时间后触发分割线
          const showSplitTimer = setTimeout(() => {
            setShowSplitLines(true);
          }, remainingTime);

          // 清理定时器
          // return () => clearTimeout(showSplitTimer); // 不能在 setInterval 的回调中返回清理函数

          return 100;
        }
        
        return newProgress;
      });
    }, 150); 
    
    // 返回清理函数，确保 interval 在组件卸载时被清除
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
  
  // 新增：GSAP 动画效果
  useEffect(() => {
    if (loading && hudCircleRef.current) {
      // 缓慢旋转动画
      const rotationTween = gsap.to(hudCircleRef.current, {
        rotation: 360,
        duration: 90, // 90秒转一圈
        repeat: -1,
        ease: 'none'
      });

      // 透明度脉冲动画 (从 0.5 到 0.7 来回)
      const pulseTween = gsap.to(hudCircleRef.current, {
        opacity: 0.7, // 目标透明度（提高一点可见性）
        duration: 4, // 4秒完成一次脉冲
        repeat: -1,
        yoyo: true, // 来回播放
        ease: 'power1.inOut'
      });

      // 返回清理函数
      return () => {
        rotationTween.kill(); // 停止旋转动画
        pulseTween.kill();    // 停止脉冲动画
      };
    }
  }, [loading]); // 依赖 loading 状态
  
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
        //handleTransitionOut(); // DEBUG: Temporarily disabled for debugging - Re-enable to restore transition
      }, 600); // 延迟 600ms 后开始退出，让分割线动画播放一部分

      // 清理函数
      return () => clearTimeout(transitionTimer);
    }
  }, [showSplitLines, onComplete]); // 依赖 showSplitLines 和 onComplete
  
  // 新增：为旋转内圈添加 GSAP 动画
  useEffect(() => {
    if (loading && rotatingInnerGroupRef.current) {
      // 随机旋转动画
      let currentTween;

      const randomRotate = () => {
        // 先停止当前的动画
        if (currentTween) {
          currentTween.kill();
        }
        
        const targetRotation = "+=" + (Math.random() * 180 - 180); // 随机旋转 -90 到 +90 度
        const duration = gsap.utils.random(0.4, 1.5); // 修改：加快速度，随机持续时间 0.8 到 2.5 秒
        const delay = gsap.utils.random(0.03, 0.1); // 修改：减少延迟，0.05 到 0.2 秒
        const ease = gsap.utils.random(["power1.inOut", "power2.inOut", "sine.inOut", "none"]); // 随机缓动

        currentTween = gsap.to(rotatingInnerGroupRef.current, {
          rotation: targetRotation,
          duration: duration,
          ease: ease,
          delay: delay, // 在上一个完成后延迟启动
          onComplete: randomRotate // 动画完成后再次调用自身，形成循环
        });
      };

      // 启动第一个随机旋转
      randomRotate();

      // 返回清理函数
      return () => {
        gsap.killTweensOf(rotatingInnerGroupRef.current); // 停止所有针对该元素的 tween
      };
    }
  }, [loading]); // 依赖 loading 状态
  
  // 新增：为扇形添加旋转动画
  useEffect(() => {
    if (loading && sectorPathRef.current) {
      const angleProxy = { angle: 0 }; // 代理对象存储角度

      const sectorTween = gsap.to(angleProxy, {
        angle: 360, // 动画目标角度
        duration: 2.5, // 修改：加快旋转速度，4 秒旋转一周
        ease: "none",
        repeat: -1, // 无限重复
        onUpdate: () => {
          if (sectorPathRef.current) {
            const currentStartAngle = angleProxy.angle;
            const newPathD = describeSector(
              50, 50, // Center cx, cy
              sectorRadius,
              currentStartAngle,
              currentStartAngle + sectorAngleWidth // End angle is start + fixed width
            );
            sectorPathRef.current.setAttribute('d', newPathD);
          }
        }
      });

      // 返回清理函数
      return () => {
        sectorTween.kill();
      };
    }
  }, [loading, sectorRadius, sectorAngleWidth]);
  
  // 新增：为信号线添加绘制动画
  useEffect(() => {
    if (loading && signalLineRef.current) {
      // 获取 polyline 元素并计算总长度
      const line = signalLineRef.current;
      // const lineLength = 98.3; // Original
      // const lineLength = 108.3; // Previous: sqrt(800) + 80 ≈ 108.3
      // New calculation: sqrt((70-50)^2 + (70-50)^2) + (180-70) = sqrt(800) + 110 ≈ 138.3
      const lineLength = 138.3; // 新的估算长度 - 进一步加长

      // 设置初始状态 (隐藏线条)
      gsap.set(line, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
        opacity: 1 // Make sure it's visible for animation
      });

      // 创建绘制动画
      const lineTween = gsap.to(line, {
        strokeDashoffset: 0,
        duration: 0.6, // 绘制动画时长
        delay: 1.8, // 在其他元素之后开始 (例如，在内圈淡入后)
        ease: "power1.inOut"
      });

      // 返回清理函数
      return () => {
        lineTween.kill();
      };
    }
  }, [loading]); // 依赖 loading 状态
  
  // 新增：为外圈和其刻度线添加旋转动画
  useEffect(() => {
    if (loading && outerCircleGroupRef.current) {
      const rotationTween = gsap.to(outerCircleGroupRef.current, {
        rotation: 360, // 顺时针旋转
        duration: 60, // 旋转速度 (60秒一圈，比背景慢)
        repeat: -1,
        ease: 'none',
        transformOrigin: "50% 50%" // 确保绕 SVG 中心旋转
      });
      // 返回清理函数
      return () => {
        rotationTween.kill();
      };
    }
  }, [loading]); // 依赖 loading 状态
  
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
      'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' // 修改：从右到左擦除
    ],
    transition: {
      clipPath: {
        duration: 1.2, // 修改：增加时长，减慢效果
        ease: [0.65, 0, 0.35, 1],
        times: [0, 1]
      },
      opacity: {
        duration: 2.0, // 修改：增加时长，减慢效果
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

  // 主标题字母动画 - 类似 subtitle 但 opacity 不同
  const mainLetterSpanVariants = {
    hidden: { 
      opacity: 0, 
    },
    visible: { 
      opacity: 0.7, // 最终状态：可见 (RAIN 的透明度)
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

  // 标题容器动画 - 移除动画效果，仅控制显隐
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.7 } }, // 容器稍晚出现
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  // Helper function to calculate sector path
  const describeSector = (cx, cy, radius, startAngle, endAngle) => {
    // Ensure angles wrap around 360 degrees for calculation
    const startRad = ((startAngle % 360) - 90) * Math.PI / 180.0;
    const endRad = ((endAngle % 360) - 90) * Math.PI / 180.0;
    // Ensure endAngle is always greater than startAngle for arc flag calculation, even across 360 boundary
    let angleDiff = (endAngle % 360) - (startAngle % 360);
    if (angleDiff <= 0) {
        angleDiff += 360;
    }
    const largeArcFlag = angleDiff <= 180 ? "0" : "1";

    const startX = cx + (radius * Math.cos(startRad));
    const startY = cy + (radius * Math.sin(startRad));
    const endX = cx + (radius * Math.cos(endRad));
    const endY = cy + (radius * Math.sin(endRad));

    const d = [
        "M", cx, cy,
        "L", startX, startY,
        "A", radius, radius, 0, largeArcFlag, 1, endX, endY,
        "Z"
    ].join(" ");

    return d;
  }

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
            {/* 修改：新的转场动画 - 菱形和线条 */}
            {showSplitLines && (
              <>
                {/* 重新添加水平滑动特效 */}
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
                
                {/* 中心菱形 */}
                <motion.div 
                  className={styles.split_diamond}
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* 水平线 */}
                <motion.div 
                  className={styles.transition_line_horizontal}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* 垂直线 */}
                <motion.div 
                  className={styles.transition_line_vertical}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* 对角线 1 */}
                <motion.div 
                  className={styles.transition_line_diagonal_1}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* 对角线 2 */}
                <motion.div 
                  className={styles.transition_line_diagonal_2}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* 重新添加顶部和底部线条 */}
                <motion.div 
                  className={`${styles.transition_glow_line} ${styles.top}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} // 与水平/垂直线同步或稍早
                />
                 <motion.div 
                  className={`${styles.transition_glow_line} ${styles.bottom}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} // 与水平/垂直线同步或稍早
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
              {/* 背景大圆环 - 添加 ref */}
              <div 
                 className={styles.hud_background_circle} 
                 ref={hudCircleRef} 
                 style={{ opacity: 0.6 }} // 设置初始透明度，GSAP会覆盖
              ></div>
               
               {/* 修改：使用 SVG 实现右上角中等圆形 */}
               <svg 
                 className={styles.hud_secondary_circle_svg} 
                 viewBox="0 0 100 100" // 定义 SVG 视口
               >
                 {/* 新增：包含外圈和其刻度线的旋转组 */}
                 <g ref={outerCircleGroupRef} className={styles.outer_circle_group}>
                   {/* 最外圈绘制圆 (现在在旋转组内) */}
                   <circle 
                     className={styles.drawable_circle} 
                     cx="50" // 圆心 X 坐标
                     cy="50" // 圆心 Y 坐标
                     r="48"  // 半径 (稍小于50以容纳描边)
                   />
                   {/* 新增：外圈的旋转刻度线 */}
                   { [...Array(60)].map((_, i) => { // 添加 60 条刻度线 (每 6 度一条)
                      const angle = i * 6;
                      const rad = angle * Math.PI / 180;
                      const rInner = 46.5; // 修改：内半径，使其小于外圈半径，指向内侧
                      const rOuter = 48;   // 修改：外半径，与外圈半径一致
                      const x1 = 50 + rInner * Math.cos(rad);
                      const y1 = 50 + rInner * Math.sin(rad);
                      const x2 = 50 + rOuter * Math.cos(rad);
                      const y2 = 50 + rOuter * Math.sin(rad);
                      return (
                        <line
                          key={`outer-tick-${i}`}
                          className={styles.outer_circle_tick}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                        />
                      );
                    })}
                 </g>
                 {/* 中心实心圆点 */}
                 <circle 
                   className={styles.center_solid_dot}
                   cx="50"
                   cy="50"
                   r="3" // 较小半径
                 />
                 {/* 内圈空心圆 (不旋转) */}
                 <circle 
                   className={styles.inner_hollow_circle}
                   cx="50"
                   cy="50"
                   r="8" // 减小半径
                 />

                 {/* 修改：旋转扇形 - 应用 Ref，设置初始 d */}
                 <path
                   ref={sectorPathRef} // 应用 Ref
                   className={styles.rotating_sector}
                   d={describeSector(50, 50, sectorRadius, 0, sectorAngleWidth)} // 设置初始路径
                 />

                 {/* 不规则旋转的内圈和刻度组 */}
                 <g ref={rotatingInnerGroupRef} className={styles.rotating_inner_group}>
                   {/* 旋转的空心圆 */}
                   <circle
                      className={styles.rotating_inner_circle}
                      cx="50" cy="50" r="30" // 半径比 drawable_circle 小，比 inner_hollow_circle 大
                   />
                   {/* 旋转圆的刻度线 (修改：更密集、更短) */}
                   { [...Array(36)].map((_, i) => { // 增加到 36 条刻度线
                      const angle = i * 10; // 每 10 度一条
                      const rad = angle * Math.PI / 180; // 弧度
                      const rInner = 28.5; // 刻度线内半径 (更靠近外圈)
                      const rOuter = 30;   // 刻度线外半径 (保持不变)
                      const x1 = 50 + rInner * Math.cos(rad);
                      const y1 = 50 + rInner * Math.sin(rad);
                      const x2 = 50 + rOuter * Math.cos(rad);
                      const y2 = 50 + rOuter * Math.sin(rad);
                      return (
                        <line
                          key={`tick-${i}`}
                          className={styles.rotating_circle_tick}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                        />
                      );
                    })}
                 </g>

                 {/* 新增：信号线 */}
                 <polyline
                   ref={signalLineRef}
                   className={styles.signal_line}
                   points="50,50 70,70 70,180" // 新的坐标点：右上到水平，并加长
                 />
               </svg>

               {/* 新增：生物信号文本 */}
               <motion.div
                 className={styles.bio_signal_text}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: [0, 0.7, 0.7, 0] }} // 淡入 -> 保持 -> 淡出
                 transition={{
                   duration: 2, // 动画总时长
                   delay: 2.4, // 修改：在线条绘制完成后开始 (1.8s + 0.6s)
                   repeat: Infinity, // 无限重复
                   repeatDelay: 0.1, // 每次重复间隔 0.1 秒
                   times: [0, 0.15, 0.85, 1] // 控制各阶段时间点
                 }}
               >
                 Bio-Signal: Not Detected
               </motion.div>
               
               {/* 新增：右侧条纹渐变 */}
               <div className={styles.right_stripe_gradient}></div>

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
                      exit={{ opacity: 0 }} // 添加退出动画
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
                      variants={titleContainerVariants}
                    >
                      {/* 将 RAIN 拆分为字母并应用随机延迟动画 */}
                      { "RAIN".split("").map((char, index) => (
                        <motion.span 
                          key={`rain-${char}-${index}`} 
                          initial="hidden"
                          animate={rainLetterDelays.length > 0 ? "visible" : "hidden"}
                          variants={mainLetterSpanVariants} // 使用主标题字母变体
                          style={{ display: 'inline-block', position: 'relative' }} 
                          transition={{ 
                            duration: 0.05, // 接近瞬时显现
                            delay: rainLetterDelays[index] || (0.8 + index * 0.1) // 应用计算出的随机延迟，提供 fallback
                          }}
                        >
                          {char}
                        </motion.span>
                      )) }
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
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // 添加退出动画
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>STATUS MONITOR</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.top_right}`}
                custom={{ index: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // 添加退出动画
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>SYSTEM ONLINE</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_left}`}
                custom={{ index: 2 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // 添加退出动画
              >
                <div className={styles.hud_line}></div>
                <div className={styles.hud_text}>ID-1A1A1A</div>
              </motion.div>
              <motion.div 
                className={`${styles.hud_element} ${styles.bottom_right}`}
                custom={{ index: 3 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }} // 添加退出动画
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