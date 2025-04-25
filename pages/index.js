import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import VerticalShinyText from '../components/VerticalShinyText';
import RainMorimeEffect from '../components/RainMorimeEffect';
import styles from '../styles/Home.module.scss';
import React from 'react';
import ProjectCard from '../components/ProjectCard';
import Noise from '../components/Noise';
// --- 新增: 引入 Tesseract 体验 --- 
import TesseractExperience from '../components/TesseractExperience';
// --- 新增: 引入激活拉杆 --- 
import ActivationLever from '../components/ActivationLever';

// --- 新增: 引入 GSAP 和 ScrollTrigger ---
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// --- 注册插件 ---
gsap.registerPlugin(ScrollTrigger);

// --- 新增: 示例项目数据 ---
const sampleProjects = [
  {
    id: 1,
    title: 'Project Cyberscape',
    description: 'A procedural city generator visualizing network data streams.',
    tech: ['React', 'Three.js', 'Node.js', 'WebSockets'],
    link: '#', // 替换为实际链接
    imageUrl: '/placeholders/cyberscape.png' // 替换为实际图片路径或占位图
  },
  {
    id: 2,
    title: 'Aether Analytics',
    description: 'Real-time data analysis platform with a retro terminal interface.',
    tech: ['Next.js', 'Chart.js', 'Python (Flask)', 'PostgreSQL'],
    link: '#',
    imageUrl: '/placeholders/aether.png' 
  },
  {
    id: 3,
    title: 'Chrono Courier',
    description: 'Secure messaging system simulation with quantum encryption concepts.',
    tech: ['Vue.js', 'Web Crypto API', 'Firebase'],
    link: '#',
    imageUrl: '/placeholders/chrono.png'
  },
    {
    id: 4,
    title: 'Bio-Synth Composer',
    description: 'Generative music tool based on simulated biological growth patterns.',
    tech: ['Tone.js', 'P5.js', 'JavaScript'],
    link: '#',
    imageUrl: '/placeholders/biosynth.png'
  },
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [linesAnimated, setLinesAnimated] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const [leftPanelAnimated, setLeftPanelAnimated] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  // --- 新增: 打字机效果 State ---
  const [displayedFateText, setDisplayedFateText] = useState('');
  const [isFateTypingActive, setIsFateTypingActive] = useState(false);
  
  // --- 新增: 环境参数打字机效果 ---
  const [displayedEnvParams, setDisplayedEnvParams] = useState('');
  const [isEnvParamsTyping, setIsEnvParamsTyping] = useState(false);
  // --- 新增: Refs for Env Params --- 
  const currentTempRef = useRef(55.0); // Start in the middle of the new range
  const currentPowerRef = useRef(53);  // Start at 53%
  // --- 新增: Ref to store last full text for deletion --- 
  const lastGeneratedParamsRef = useRef(''); 
  
  // 参考当前时间，用于HUD显示
  const timeRef = useRef(new Date());
  const [currentTime, setCurrentTime] = useState('00:00:00');
  
  // Expand state to hold 6 texts, initialize first one appropriately
  const initialRandomTexts = [
    'DATA-Ø05', // Placeholder for the main HUD initially
    ...Array(5).fill('DATA-Ø??') // Placeholders for the 5 random ones
  ]; 
  const [randomHudTexts, setRandomHudTexts] = useState(initialRandomTexts);
  
  // --- 修改: State for 4 Branch Texts ---
  const [branchText1, setBranchText1] = useState('');
  const [branchText2, setBranchText2] = useState('');
  const [branchText3, setBranchText3] = useState('');
  const [branchText4, setBranchText4] = useState('');
  
  // Ref to store the interval ID for ABOUT column's HUD update
  const intervalRef = useRef(null);
  // --- 新增: Ref for Branch Text Interval --- 
  const branchIntervalRef = useRef(null);
  // --- 新增: Ref for Branch Update Counter ---
  const branchUpdateCounterRef = useRef(0);
  
  // States now hold arrays of indices or null
  const [pulsingNormalIndices, setPulsingNormalIndices] = useState(null);
  const [pulsingReverseIndices, setPulsingReverseIndices] = useState(null);
  const pulseAnimationDuration = 2000; 

  // --- 恢复: State for Active Section --- 
  const [activeSection, setActiveSection] = useState('home'); // 'home' or 'content'

  // --- 新增: Ref for Content Wrapper --- 
  const contentWrapperRef = useRef(null);
  // --- 新增: Ref for About Section 和其内部内容容器 ---
  const aboutSectionRef = useRef(null);
  const aboutContentRef = useRef(null);
  // --- 新增: State for Power Level ---
  const [powerLevel, setPowerLevel] = useState(67);
  // --- 新增: 负色状态 --- 
  const [isInverted, setIsInverted] = useState(false);
  // --- 新增: Tesseract 激活状态 --- 
  const [isTesseractActivated, setIsTesseractActivated] = useState(false);

  // 处理加载完成
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => { // 0.1s after load
      setMainVisible(true);

      // 1. 开始左侧面板动画 (建议延迟 200ms)
      setTimeout(() => {
        setLeftPanelAnimated(true);
      }, 200); // Original: 500

      // 2. 开始右侧线条动画 (建议延迟 1400ms)
      setTimeout(() => {
        setLinesAnimated(true);
      }, 1000); // Original: 2200

      // 3. 开始 HUD 动画 (建议延迟 2700ms)
      setTimeout(() => {
        setHudVisible(true);
      }, 2200); // Original: 4000

      // 4. 开始文字淡入动画 (建议延迟 3100ms)
      setTimeout(() => {
        setTextVisible(true);
      }, 2500); // 修改: 从 3100ms 减少到 2500ms

      // 5. 设置动画完成标志 (建议延迟 4200ms)
      setTimeout(() => {
        setAnimationsComplete(true);
      }, 4200); // Original: 5300

    }, 100); // 0.1 seconds delay after loading complete
  };

  // 更新时间
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // useEffect for the pulsing line interval
  useEffect(() => {
    let pulseIntervalId = null;
    let pulseTimeoutIds = []; // Store multiple timeout IDs

    if (animationsComplete) {
      // Define constants outside the interval callback
      const staggerDelay = 200; // Delay between each line's animation start (in ms)
      const animationDuration = 2000; // Duration of the CSS animation

      pulseIntervalId = setInterval(() => {
        // Clear any previous animation timeouts
        pulseTimeoutIds.forEach(clearTimeout);
        pulseTimeoutIds = [];
        // Reset states immediately before starting new sequence
        setPulsingNormalIndices(null);
        setPulsingReverseIndices(null);

        // Generate three distinct random indices
        const indices = [];
        while (indices.length < 3) {
          const randomIndex = Math.floor(Math.random() * 6);
          if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
          }
        }
        
        // Stagger the application of pulsing classes
        // Constants staggerDelay and animationDuration are now defined above

        // Trigger first line (normal pulse)
        const timeoutId1 = setTimeout(() => {
          setPulsingNormalIndices([indices[0]]);
          setPulsingReverseIndices(null); // Ensure only one state is active at a time
        }, 0); // Start immediately
        pulseTimeoutIds.push(timeoutId1);

        // Trigger second line (normal pulse) after delay
        const timeoutId2 = setTimeout(() => {
          setPulsingNormalIndices(prev => (prev ? [...prev, indices[1]] : [indices[1]]));
          // No need to reset reverse here as it wasn't set
        }, staggerDelay);
        pulseTimeoutIds.push(timeoutId2);
        
        // Trigger third line (reverse pulse) after another delay
        const timeoutId3 = setTimeout(() => {
          setPulsingReverseIndices([indices[2]]);
          // Reset normal pulse for the third line if needed, or let them overlap briefly
          // setPulsingNormalIndices(prev => prev?.filter(idx => idx !== indices[0] && idx !== indices[1]) || null);
        }, staggerDelay * 2);
        pulseTimeoutIds.push(timeoutId3);

        // Schedule the final reset after the last animation finishes
        const resetTimeoutId = setTimeout(() => {
          setPulsingNormalIndices(null);
          setPulsingReverseIndices(null);
          pulseTimeoutIds = []; // Clear timeout array after reset
        }, staggerDelay * 2 + animationDuration); // Wait for last animation to end
        pulseTimeoutIds.push(resetTimeoutId);

      }, 2000 + staggerDelay * 2); // Adjust interval to account for stagger - Decreased base from 3000
    }

    // Cleanup function
    return () => {
      if (pulseIntervalId) clearInterval(pulseIntervalId);
      pulseTimeoutIds.forEach(clearTimeout); // Clear all pending timeouts on unmount
    };
  }, [animationsComplete]); 

  // --- 新增: 打字机效果 useEffect --- 
  useEffect(() => {
    if (textVisible) {
      const englishText = "You and me, fate is entangled in this moment.";
      const chineseText = "你我命运于此刻纠缠不休，守林人。";
      const typingDelay = 80; // ms per character (for English)
      const deleteDelay = 50; // ms per character (for English)
      const chineseTypingDelay = 150; // ms per character (slower for Chinese)
      const chineseDeleteDelay = 100; // ms per character (slower for Chinese)
      const pauseAfterType = 1500; // ms pause after typing a sentence
      const pauseAfterDelete = 500; // ms pause after deleting a sentence

      let timeouts = [];
      // 光标在循环开始时激活，在 cleanup 中取消
      setIsFateTypingActive(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedFateText(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          // 使用 setTimeout 确保 callback 在 state 更新后异步执行
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedFateText(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
           // 使用 setTimeout 确保 callback 在 state 更新后异步执行
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      // 定义完整的循环序列函数
      const sequence = () => {
        // 1. 打英文
        typeString(englishText, 0, typingDelay, () => {
          // 2. 暂停
          const timeoutId1 = setTimeout(() => {
            // 3. 删英文
            deleteString(englishText, deleteDelay, () => {
              // 4. 暂停
              const timeoutId2 = setTimeout(() => {
                // 5. 打中文 (使用中文速度)
                typeString(chineseText, 0, chineseTypingDelay, () => {
                  // 6. 暂停
                  const timeoutId3 = setTimeout(() => {
                    // 7. 删中文 (使用中文速度)
                    deleteString(chineseText, chineseDeleteDelay, () => {
                      // 8. 暂停
                      const timeoutId4 = setTimeout(() => {
                        // 9. 重新开始序列
                        sequence();
                      }, pauseAfterDelete);
                      timeouts.push(timeoutId4);
                    });
                  }, pauseAfterType);
                  timeouts.push(timeoutId3);
                });
              }, pauseAfterDelete);
              timeouts.push(timeoutId2);
            });
          }, pauseAfterType);
          timeouts.push(timeoutId1);
        });
      };

      // 启动第一次序列
      sequence();

      // Cleanup function
      return () => {
        timeouts.forEach(clearTimeout);
        // 重置状态并隐藏光标
        setDisplayedFateText(''); 
        setIsFateTypingActive(false);
        timeouts = []; // 清空数组
      };
    }
  }, [textVisible]);

  // --- 新增: 环境参数打字机效果 useEffect --- (修改后)
  useEffect(() => {
    if (textVisible) {
      const typingDelay = 35; // ms per character 
      // --- 新增: 环境参数删除延迟 ---
      const envDeleteDelay = 20; // ms per character (faster deletion)
      
      let timeouts = [];
      setIsEnvParamsTyping(true);

      // Type string function remains the same
      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedEnvParams(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      // --- 新增: 删除环境参数的函数 ---
      const deleteEnvParamsString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedEnvParams(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteEnvParamsString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          // Use setTimeout to ensure callback runs after state update
          const timeoutId = setTimeout(callback, 0); 
          timeouts.push(timeoutId);
        }
      };

      // --- 修改: 更新参数生成逻辑 --- 
      const generateNewParams = () => {
        // 温度: 44-66°C, 每次变化 <= 1.5°C
        const tempChange = (Math.random() * 3) - 1.5; 
        let newTemp = currentTempRef.current + tempChange;
        newTemp = Math.max(44, Math.min(66, newTemp)); 
        currentTempRef.current = newTemp; 
        const tempStr = newTemp.toFixed(1);
        
        const rad = Math.floor(200 + Math.random() * 300);
        const o2 = (8 + Math.random() * 2).toFixed(1); 
        
        const pollutionLevels = ["SEVERE", "CRITICAL", "UNSTABLE", "HAZARDOUS"];
        const pollution = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];
        
        const rainStatus = ["IMMINENT", "LIKELY", "UNLIKELY", "CERTAIN"];
        const rain = rainStatus[Math.floor(Math.random() * rainStatus.length)];
                
        // --- 移除 Power 计算 --- 
        /*
        let newPower = currentPowerRef.current;
        if (newPower > 0) {
          const powerDecrease = Math.floor(Math.random() * 10) + 1; 
          newPower = Math.max(0, newPower - powerDecrease); 
        }
        currentPowerRef.current = newPower; 
        const powerStr = `${newPower}%`;
        */
        
        const warnings = [
          "ALERT: TOXIC EXPOSURE RISK",
          "CAUTION: RADIATION STORM",
          "DANGER: ACID ZONES EXPANDING",
          "URGENT: OXYGEN DEPLETION"
        ];
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        const warningLine = Math.random() > 0.5 ? `\n${randomWarning}` : '';
        
        // --- 修改: 返回更新后的字符串 (移除 POWER) ---
        return `TEMP: ${tempStr}°C\nRAD: ${rad}mSv/h\nO2: ${o2}%\nPOLLUTION: ${pollution}\nACID RAIN: ${rain}${warningLine}`;
      };

      // --- 修改: 包含删除逻辑的启动函数 --- 
      const generateAndType = () => {
        const newParams = generateNewParams();
        lastGeneratedParamsRef.current = newParams; // Store the full new text
        typeString(newParams, 0, typingDelay, () => {
          // Callback after typing is complete: schedule the next update cycle
          const updateTime = 8000 + Math.floor(Math.random() * 7000);
          const restartTimeout = setTimeout(() => {
            startTyping(); // Call startTyping to potentially delete before next update
          }, updateTime);
          timeouts.push(restartTimeout);
        });
      };

      const startTyping = () => {
        const textToDelete = lastGeneratedParamsRef.current;

        if (textToDelete.length > 0) {
          // If there's text from the previous cycle, delete it first
          deleteEnvParamsString(textToDelete, envDeleteDelay, () => {
            // After deletion, generate and type new params
            generateAndType(); 
          });
        } else {
          // First run, nothing to delete, just generate and type
          generateAndType();
        }
      };

      // Initial start typing with delay
      const initialDelay = setTimeout(() => {
        startTyping();
      }, 1000);
      timeouts.push(initialDelay);

      // Cleanup function
      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedEnvParams('');
        setIsEnvParamsTyping(false);
        lastGeneratedParamsRef.current = ''; // Reset ref on cleanup
      };
    }
  }, [textVisible]);

  // --- 新增: Power Level 更新逻辑 ---
  useEffect(() => {
    if (!mainVisible) return; // 只在主界面可见时更新

    const intervalId = setInterval(() => {
      const decrease = Math.floor(Math.random() * 3) + 1; // 随机减 1-3
      // --- MODIFIED: Prevent decrease if power is already 100% ---
      setPowerLevel(prevLevel => {
        if (prevLevel >= 100) {
          return 100; // Keep it at 100
        }
        return Math.max(0, prevLevel - decrease); // Otherwise, decrease and ensure not below 0
      });
    }, 5000); // 每 5 秒

    return () => clearInterval(intervalId); // 清理 interval
  }, [mainVisible]); // 依赖 mainVisible

  // --- 新增: 电池充电函数 --- 
  const chargeBattery = () => {
    setPowerLevel(prevLevel => {
      // Don't charge if already inverted (or at 100)
      if (prevLevel >= 100) return 100;
      const newLevel = Math.min(100, prevLevel + 5); // Increase by 5, cap at 100
      console.log("Charging... New Power Level:", newLevel); // Log charging
      return newLevel;
    });
  };

  // --- 新增: 监听电量以触发负色效果 --- 
  useEffect(() => {
    if (powerLevel === 100 && !isInverted) {
      console.log("Power at 100%! Activating inverted mode.");
      setIsInverted(true);
      // Optional: You could add sound effects or other visual cues here
    }
    // Optional: Add logic here if you want to revert the effect 
    // if the power level drops below 100 for some reason.
    // else if (powerLevel < 100 && isInverted) {
    //   setIsInverted(false);
    // }
  }, [powerLevel, isInverted]);

  // 定义列的数量
  const numberOfColumns = 6; // 共6条边界，产生5个可点击区域

  // 定义每个区域的英文名称（完整单词纵向排列）
  const sectionNames = [
    "WORKS", // 第1列
    "EXPERIENCE", // 第2列
    "LIFE", // 第3列
    "CONTACT", // 第4列
    "ABOUT"  // 第5列
  ];

  // Function to generate and update 6 random numbers
  const updateRandomHudTexts = () => {
    const newTexts = [];
    // Generate 6 random numbers now
    for (let i = 0; i < 6; i++) { 
      const randomNum = Math.floor(Math.random() * 99) + 1; // Random 1-99
      const numStr = String(randomNum).padStart(2, '0');
      newTexts.push(`DATA-Ø${numStr}`);
    }
    setRandomHudTexts(newTexts);
  };

  // --- 修改: Helper function accepts optional length --- 
  const generateRandomChars = (length) => { 
    let targetLength = length;
    // 如果没有提供长度，则默认为3到6的随机长度
    if (typeof length === 'undefined' || length === null) {
      targetLength = Math.floor(Math.random() * 4) + 3; // 3 to 6
    }
    
    // 使用双引号定义字符串，并转义内部的双引号和反斜杠
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:'\",.<>/?~`§±¥₩£¢€©®™×÷≠≤≥∞∑∫√≈≠≡";
    let result = '';
    // 确保targetLength有效
    targetLength = Math.max(0, targetLength); 
    
    for (let i = 0; i < targetLength; i++) { 
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < targetLength - 1) { 
        result += '\n';
      }
    }
    return result;
  };

  // --- 修改: Combined Mouse Enter handler --- 
  const handleColumnMouseEnter = (index) => {
    if (index === 4) { // ABOUT column logic
      updateRandomHudTexts();
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateRandomHudTexts, 50);
    } else if (index === 1) { // EXPERIENCE column logic
      // 重置计数器
      branchUpdateCounterRef.current = 0; 
      if (branchIntervalRef.current) clearInterval(branchIntervalRef.current);
      
      // 定义一个辅助函数来根据有效计数确定长度
      const getTargetLength = (effectiveCount) => {
        if (effectiveCount <= 15) {      
          return 1;
        } else if (effectiveCount <= 24) { 
          return 2;
        } else if (effectiveCount <= 36) { 
          return 3;
        } else if (effectiveCount <= 48) { 
          return 4;
        } else {                 
          // 恢复 4 到 6 的随机长度
          return Math.floor(Math.random() * 3) + 4; // 4, 5, or 6
        }
      };

      // 立即执行一次，根据偏移量计算初始长度
      const initialMainCount = 1;
      const initialLength1 = getTargetLength(initialMainCount + 45);
      const initialLength2 = getTargetLength(initialMainCount + 30);
      const initialLength3 = getTargetLength(initialMainCount + 15);
      const initialLength4 = getTargetLength(initialMainCount + 0);

      setBranchText1(generateRandomChars(initialLength1));
      setBranchText2(generateRandomChars(initialLength2));
      setBranchText3(generateRandomChars(initialLength3));
      setBranchText4(generateRandomChars(initialLength4));
      branchUpdateCounterRef.current = initialMainCount; // 计数器设置为1

      // 启动 interval
      branchIntervalRef.current = setInterval(() => {
        branchUpdateCounterRef.current += 1;
        const mainCount = branchUpdateCounterRef.current;
        
        // 为每个分支计算有效计数并获取目标长度
        const length1 = getTargetLength(mainCount + 45);
        const length2 = getTargetLength(mainCount + 30);
        const length3 = getTargetLength(mainCount + 15);
        const length4 = getTargetLength(mainCount + 0);
        
        // 生成并更新所有四个分支的文本
        setBranchText1(generateRandomChars(length1));
        setBranchText2(generateRandomChars(length2));
        setBranchText3(generateRandomChars(length3));
        setBranchText4(generateRandomChars(length4));

      }, 100); 
    }
  };

  // --- 修改: Combined Mouse Leave handler --- 
  const handleColumnMouseLeave = (index) => {
    if (index === 4) { // ABOUT column logic
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (index === 1) { // EXPERIENCE column logic
      if (branchIntervalRef.current) {
        clearInterval(branchIntervalRef.current);
        branchIntervalRef.current = null;
      }
      // 清空文本并重置计数器
      setBranchText1('');
      setBranchText2('');
      setBranchText3('');
      setBranchText4('');
      branchUpdateCounterRef.current = 0; 
    }
  };

  // 处理列点击事件 - 修改为切换到内容视图并滚动
  const handleColumnClick = (columnIndex) => {
    console.log(`Column ${columnIndex + 1} clicked`);
    const sectionIds = [
      'works-section',
      'experience-section',
      'life-section',
      'contact-section',
      'about-section'
    ];
    
    if (columnIndex < sectionIds.length) {
      const sectionId = sectionIds[columnIndex];
      // 1. 切换到内容视图
      setActiveSection('content');

      // 2. 延迟滚动，确保 contentWrapper 可见且元素已渲染
      // 使用 requestAnimationFrame 确保在下一次绘制前执行
      requestAnimationFrame(() => {
        const targetElement = document.getElementById(sectionId);
        const containerElement = contentWrapperRef.current;
        if (targetElement && containerElement) {
          // 计算目标元素相对于容器顶部的距离
          const offsetTop = targetElement.offsetTop;
          // 滚动容器
          containerElement.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // --- 修改: 处理返回主页视图 --- 
  const handleGoHome = () => {
    setActiveSection('home');
    // 移除滚动逻辑
    // mainLayoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
  };

  // --- 恢复并修改 About Section 弹出动画 useEffect ---
  useEffect(() => {
    // 仅在 contentWrapper 可见时设置动画
    if (activeSection === 'content' && aboutSectionRef.current && aboutContentRef.current) {
      // console.log("Setting up GSAP animation for About section..."); 
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current, // 触发器保持不变
          scroller: contentWrapperRef.current, 
          start: 'top bottom', 
          end: 'bottom top', 
          toggleActions: 'play none none reverse', 
          markers: false, 
        }
      });

      // 修改动画目标为整个 aboutSection
      tl.from(aboutSectionRef.current, { // 修改: 目标改为 aboutSectionRef
        x: '100%', 
        opacity: 0,
        immediateRender: false, 
        duration: 0.8, 
        ease: 'power3.out' 
      });

      // 清理函数保持不变
      return () => {
        // console.log("Cleaning up GSAP animation for About section."); 
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    } 
    // 清理逻辑保持不变
    else {
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === aboutSectionRef.current) {
                // console.log("Cleaning up GSAP trigger on section change."); 
                st.kill();
            }
        });
    }
  }, [activeSection]); 

  // --- 新增: 激活 Tesseract 的回调函数 --- 
  const handleActivateTesseract = () => {
    if (!isTesseractActivated) {
      console.log('Activation Lever Pulled! Activating Tesseract...');
      setIsTesseractActivated(true);
      // You could potentially add a sound effect trigger here
    }
  };

  return (
    <div className={`${styles.container} ${isInverted ? styles.inverted : ''}`}>
      <Head>
        <title>森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的个人网站" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomCursor />
      <RainMorimeEffect />
      
      <HomeLoadingScreen onComplete={handleLoadingComplete} />

      {/* --- MODIFIED: Render TesseractExperience only when activated --- */}
      {isTesseractActivated && (
        <TesseractExperience 
          chargeBattery={chargeBattery} 
          isActivated={isTesseractActivated} // Pass activation state
        />
      )}
      
      {/* --- 静态元素移到顶层 --- */}
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect}></div>
      {/* 四角 HUD */} 
      {mainVisible && (
        <>
          <div className={`${styles.hudElement} ${styles.topLeft} ${hudVisible ? styles.visible : ''}`}>
            <div>TIME: {currentTime}</div>
            <div>SYSTEM_ONLINE</div>
          </div>
          <div className={`${styles.hudElement} ${styles.topRight} ${hudVisible ? styles.visible : ''}`}>
            <div>NEURAL_NETWORK_ACTIVE</div>
            <div>SIGNAL: STABLE</div>
          </div>
          <div className={`${styles.hudElement} ${styles.bottomLeft} ${hudVisible ? styles.visible : ''}`}>
            <div>RAINMORIME</div>
            <div>NAV_SYSTEM_v2.4</div>
          </div>
          <div className={`${styles.hudElement} ${styles.bottomRight} ${hudVisible ? styles.visible : ''}`}>
            <div>TACTICAL_MODE</div>
            <div>SECURE_CONNECTION</div>
          </div>
          {/* 左侧面板 */} 
          <div className={`${styles.leftPanel} ${leftPanelAnimated ? styles.animated : ''}`}> 
            {/* --- 新增: 将激活拉杆移到这里 --- */}
            {mainVisible && (
              <ActivationLever 
                onActivate={handleActivateTesseract} 
                isActive={isTesseractActivated} 
              />
            )}
            {/* --- 修改: Power Display --- */}
            <div className={styles.powerDisplay}>
              <div className={styles.batteryIcon}>
                {/* --- 新增: 动态生成电池格子 --- */}
                {[...Array(5)].map((_, i) => {
                  // 计算当前格子是否应该被填充
                  const shouldBeFilled = powerLevel >= (i + 1) * 20; // 每 20% 填充一格
                  // 特殊处理 100% 的情况，确保最后一格填充
                  const isFilled = (i === 4 && powerLevel === 100) || shouldBeFilled;
                  return (
                    <span 
                      key={i} 
                      className={`${styles.batteryLevelSegment} ${isFilled ? styles.filled : ''}`}>
                    </span>
                  );
                })}
              </div>
              <span className={styles.powerText}>{powerLevel}%</span>
            </div>
            <div className={styles.logoContainer}>
            </div>
            <div className={`${styles.fateTextContainer} ${isFateTypingActive ? styles.typingActive : ''}`}>
              <span className={styles.fateText}>{displayedFateText}</span>
              <div className={styles.fateLine}></div>
            </div>
            <div className={`${styles.envParamsContainer} ${isEnvParamsTyping ? styles.typingActive : ''} ${leftPanelAnimated ? styles.animated : ''}`}>
                <pre className={styles.envParamsText}>
                  {displayedEnvParams}
                </pre>
            </div>
          </div>

          {/* --- 主页视图容器 (仅包含右侧面板) --- */}
          <main className={`${styles.mainLayout} ${activeSection === 'home' ? styles.visible : styles.hidden}`}>
            {/* --- 左侧面板 (已移出) --- */}
            {/* <div className={`${styles.leftPanel} ${leftPanelAnimated ? styles.animated : ''}`}>
              ...
            </div> */}
            
            {/* --- 右侧面板 (保留在 main 内) --- */}
            <div
              className={styles.rightPanel}
            >
              {[...Array(6)].map((_, index) => { 
                const lineLeftPercentage = index * 16;
                const isPulsingNormal = pulsingNormalIndices?.includes(index);
                const isPulsingReverse = pulsingReverseIndices?.includes(index);
                return (
                  <div 
                    key={`line-${index}`}
                    className={`
                      ${styles.verticalLine} 
                      ${linesAnimated ? styles.animated : ''} 
                      ${isPulsingNormal ? styles.pulsing : ''} 
                      ${isPulsingReverse ? styles.pulsingReverse : ''}
                    `}
                    style={{ left: `${lineLeftPercentage}%` }}
                  ></div>
                );
              })}
              
              {sectionNames.map((name, index) => {
                const columnPercentage = index * 16;
                // --- 修改: 从 randomHudTexts 获取正确的 HUD 文本 ---
                const hudText = randomHudTexts[index + 1] || `DATA-Ø0${index + 1}`; // 使用 randomHudTexts 并提供回退
                
                // --- 任务列表内容保持不变 ---
                const tasks = Array.from({ length: 30 }, (_, i) => {
                  const taskNumber = String(i + 1).padStart(3, '0');
                  return `TASK-${taskNumber}: Done`;
                });

                return (
                  <div 
                    key={name}
                    className={`${styles.column} ${styles['column' + index]} ${!animationsComplete ? styles.nonInteractive : ''}`} 
                    style={{ left: `${columnPercentage}%`, width: '16%' }} 
                    onClick={animationsComplete ? () => handleColumnClick(index) : null}
                    onMouseEnter={() => handleColumnMouseEnter(index)}
                    onMouseLeave={() => handleColumnMouseLeave(index)}
                  >
                    <div className={styles.verticalText}>
                      {name.split('').map((char, charIdx) => {
                        const delay = `${charIdx * 0.005}s`;
                        return (
                          <div key={charIdx} className={styles.charItem}>
                            <VerticalShinyText
                              text={char}
                              textVisible={textVisible}
                              animationDelay={delay}
                              speed={0.8}
                            />
                          </div>
                        );
                      })}
                    </div>
                    {/* --- 修改: 添加 hudOverlay 内容 --- */}
                    <div className={styles.hudOverlay}>
                      {/* Column 0 (WORKS) - Task List */}
                      {index === 0 && (
                        <div className={styles.taskContainer}>
                          {tasks.flatMap((task, taskIdx) => [
                            <div key={`task-${taskIdx}`} className={styles.taskItem}>
                              <span className={styles.taskSquare}></span>
                              <div className={styles.taskTextWrapper}>
                                <span className={styles.taskText}>{task}</span>
                              </div>
                            </div>,
                            taskIdx < tasks.length - 1 && <div key={`line-${taskIdx}`} className={styles.taskLine}></div>
                          ])}
                        </div>
                      )}
                      {/* Column 1 (EXPERIENCE) - Branch Lines */}
                      {index === 1 && (
                        <>
                          <div className={`${styles.branchContainer} ${styles.branch1} ${styles.rightBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText1}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch2} ${styles.leftBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText2}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch3} ${styles.rightBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText3}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch4} ${styles.leftBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText4}</pre>
                          </div>
                        </>
                      )}
                      {/* Column 2 (LIFE) - ECG Scanlines */}
                      {index === 2 && <span className={`${styles.lifeScanlines} ${isInverted ? styles.invertedScanlines : ''}`}></span>}

                      {/* Column 3 (CONTACT) - Ripples (Elements added dynamically if needed, or keep static SVG/CSS) */}
                      {index === 3 && (
                          <>
                            <div className={`${styles.radarRipple} ${styles.ripple1}`}></div>
                            <div className={`${styles.radarRipple} ${styles.ripple2}`}></div>
                            <div className={`${styles.radarRipple} ${styles.ripple3}`}></div>
                          </>
                      )}
                      {/* Column 4 (ABOUT) - Additional Random HUDs */}
                      {/* The random HUD elements are handled separately below */}
                    </div>
                    <div className={styles.cornerHudTopLeft}></div>
                    <div className={styles.cornerHudBottomRight}></div>
                    {/* --- 修改: 区分主 Image HUD 和随机 HUD --- */}
                    <div className={styles.imageHud}>
                      <span className={styles.imageHudSquare}></span>
                      <span className={styles.imageHudText}>
                        {index === 4 ? randomHudTexts[0] : hudText} 
                      </span>
                    </div>
                    {/* --- 新增: 为 ABOUT 列添加 5 个随机 HUD 元素 --- */}
                    {index === 4 && (
                      <>
                        {randomHudTexts.slice(1).map((text, randomIdx) => (
                          <div 
                            key={`random-hud-${randomIdx}`} 
                            className={`${styles.imageHud} ${styles.randomHud} ${styles[`randomHud${randomIdx + 1}`]}`} // Correct template literal syntax
                          >
                            <span className={styles.imageHudSquare}></span>
                            <span className={styles.imageHudText}>{text}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* --- 四角 HUD (已移出) --- */}
            {/* <div className={`${styles.hudElement} ...`}> ... </div> */}
            
          </main>

          {/* --- 内容包裹器 --- */}
          <div 
            ref={contentWrapperRef} 
            className={`${styles.contentWrapper} ${activeSection === 'content' ? styles.visible : styles.hidden}`}
          >
            {/* --- 内容区域放在包裹器内部 --- */}
            <div id="works-section" className={`${styles.contentSection} ${styles.worksSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>WORKS</h2>
              <div className={styles.projectGrid}>
                {sampleProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            <div id="experience-section" className={`${styles.contentSection} ${styles.experienceSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>EXPERIENCE</h2>
              <p>这里是 Experience 部分的内容...</p>
              {/* 在这里填充 Experience 相关的内容 */}
            </div>

            <div id="life-section" className={`${styles.contentSection} ${styles.lifeSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>LIFE</h2>
              <p>这里是 Life 部分的内容...</p>
              {/* 在这里填充 Life 相关的内容 */}
            </div>

            <div id="contact-section" className={`${styles.contentSection} ${styles.contactSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>CONTACT</h2>
              <p>这里是 Contact 部分的内容...</p>
              {/* 在这里填充 Contact 相关的内容 */}
            </div>

            <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}> 
              <Noise />
              {/* --- 新增: 内容包裹器，应用动画 --- */}
              <div ref={aboutContentRef}>
                <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
                <h2>ABOUT</h2>
                {/* 修改: 将 "ICP备案: " 包含在链接内 */}
                <div className={styles.footerInfo}>
                  <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                    ICP备案: 陕ICP备2023011267号-1
                  </a>
                </div>

                {/* 修改: 版权信息文本 */} 
                <div className={styles.footerInfo}> 
                  © 2025 朴相霖 / RainMorime 版权所有
                </div>
              </div>
            </div>
          </div> { /* contentWrapper 结束 */ } 
        </>
      )}
    </div>
  );
}