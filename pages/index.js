import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import VerticalShinyText from '../components/VerticalShinyText';
import styles from '../styles/Home.module.scss';
import React from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [linesAnimated, setLinesAnimated] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const [leftPanelAnimated, setLeftPanelAnimated] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  
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
      }, 3100); // Original: 4300

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

  // 处理列点击事件
  const handleColumnClick = (columnIndex) => {
    console.log(`Column ${columnIndex + 1} clicked`);
    
    // 根据点击的列导航到不同页面
    const routes = [
      '/work',      // 第1列
      '/experience', // 第2列
      '/life',      // 第3列
      '/contact',   // 第4列
      '/about'      // 第5列
    ];
    
    if (columnIndex < routes.length) {
      window.location.href = routes[columnIndex];
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的个人网站" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomCursor />
      
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect}></div>
      <div className={styles.scanLines}></div>

      <HomeLoadingScreen onComplete={handleLoadingComplete} />

      {mainVisible && (
        <main className={styles.mainLayout}>
          <div className={`${styles.leftPanel} ${leftPanelAnimated ? styles.animated : ''}`}>
            <div className={styles.logoContainer}>
            </div>
            <div className={styles.fateTextContainer}>
              <span className={styles.fateText}>You and me, fate is entangled in this moment.</span>
              <div className={styles.fateLine}></div>
            </div>
          </div>
          
          <div className={styles.rightPanel}>
            {[...Array(6)].map((_, index) => { 
              const lineLeftPercentage = index * 16;
              // Determine classes based on includes check
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
              const hudText = `DATA-Ø0${index + 1}`;

              // Task data for the first column - Generate 30 tasks
              const tasks = Array.from({ length: 30 }, (_, i) => {
                const taskNumber = String(i + 1).padStart(3, '0'); // Format number like 001, 002...
                return `TASK-${taskNumber}: Done`;
              });

              return (
                <div 
                  key={name}
                  className={`${styles.column} ${styles['column' + index]} ${!animationsComplete ? styles.nonInteractive : ''}`} 
                  style={{ left: `${columnPercentage}%`, width: '16%' }} 
                  onClick={animationsComplete ? () => handleColumnClick(index) : null}
                  // --- 修改: Use combined handlers ---
                  onMouseEnter={() => handleColumnMouseEnter(index)}
                  onMouseLeave={() => handleColumnMouseLeave(index)}
                >
                  <div className={styles.verticalText}>
                    {name.split('').map((char, charIdx) => {
                      const delay = `${charIdx * 0.02}s`;
                      return (
                        <div key={charIdx} className={styles.charItem}>
                          <VerticalShinyText
                            text={char}
                            textVisible={textVisible}
                            animationDelay={delay}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.hudOverlay}>
                    {/* Render task list only for the first column */}
                    {index === 0 && (
                      <div className={styles.taskContainer}>
                        {tasks.map((task, taskIndex) => (
                          <React.Fragment key={taskIndex}>
                            <div className={styles.taskItem}>
                              <div className={styles.taskSquare}></div>
                              <div className={styles.taskText}>{task}</div>
                            </div>
                            {/* Render line conditionally *after* the item */}
                            {taskIndex < tasks.length - 1 && (
                              <div className={styles.taskLine}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                    {/* 修改: 添加四个分支的结构 - 仅在 column1 (index=1) */}
                    {index === 1 && (
                      <>
                        {/* 分支 1 (Top 20%, Right) */}
                        <div className={`${styles.branchContainer} ${styles.branch1} ${styles.rightBranch}`}>
                          <div className={styles.branchSquare}></div>
                          <div className={styles.branchText}>{branchText1}</div>
                        </div>
                        {/* 分支 2 (Top 40%, Left) */}
                        <div className={`${styles.branchContainer} ${styles.branch2} ${styles.leftBranch}`}>
                          <div className={styles.branchSquare}></div>
                          <div className={styles.branchText}>{branchText2}</div>
                        </div>
                        {/* 分支 3 (Top 60%, Right) */}
                        <div className={`${styles.branchContainer} ${styles.branch3} ${styles.rightBranch}`}>
                          <div className={styles.branchSquare}></div>
                          <div className={styles.branchText}>{branchText3}</div>
                        </div>
                        {/* 分支 4 (Top 80%, Left) */}
                        <div className={`${styles.branchContainer} ${styles.branch4} ${styles.leftBranch}`}>
                          <div className={styles.branchSquare}></div>
                          <div className={styles.branchText}>{branchText4}</div>
                        </div>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <span className={`${styles.radarRipple} ${styles.ripple1}`}></span>
                        <span className={`${styles.radarRipple} ${styles.ripple2}`}></span>
                        <span className={`${styles.radarRipple} ${styles.ripple3}`}></span>
                        <span className={styles.rotatingScanLine}></span>
                      </>
                    )}
                    {index === 2 && <span className={styles.lifeScanlines}></span>}
                  </div>
                  <div className={styles.cornerHudTopLeft}></div>
                  <div className={styles.cornerHudBottomRight}></div>
                  
                  {/* Main Image HUD - Use state for ABOUT, default for others */}
                  <div className={styles.imageHud}>
                    <span className={styles.imageHudSquare}></span>
                    <span className={styles.imageHudText}>
                      {/* Use first element of state array for ABOUT's main HUD */}
                      {index === 4 ? randomHudTexts[0] : hudText}
                    </span>
                  </div>

                  {/* Add 5 extra random HUDs for ABOUT */}
                  {index === 4 && (
                    <>
                      {/* Map over the state array elements 1 through 5 */}
                      {randomHudTexts.slice(1).map((text, i) => (
                        <div key={`random-${i}`} className={`${styles.imageHud} ${styles.randomHud} ${styles[`randomHud${i + 1}`]}`}> 
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
        </main>
      )}
    </div>
  );
}