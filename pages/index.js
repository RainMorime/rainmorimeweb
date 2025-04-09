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
  
  // Ref to store the interval ID for ABOUT column's HUD update
  const intervalRef = useRef(null);
  
  // States now hold arrays of indices or null
  const [pulsingNormalIndices, setPulsingNormalIndices] = useState(null);
  const [pulsingReverseIndices, setPulsingReverseIndices] = useState(null);
  const pulseAnimationDuration = 2000; 
  
  // 处理加载完成
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => { // 0.1s after load
      setMainVisible(true);

      // 1. 开始左侧面板动画 (延迟 500ms)
      setTimeout(() => {
        setLeftPanelAnimated(true);
      }, 500);

      // 2. 开始右侧线条动画 (在左侧动画结束后 + 300ms 延迟)
      // 总延迟 = 500ms (初始) + 1400ms (左侧时长) + 300ms (停顿) = 2200ms
      setTimeout(() => {
        setLinesAnimated(true);
      }, 2200);

      // 3. 开始 HUD 动画 (在线条动画结束后 + 200ms 延迟)
      // 总延迟 = 2200ms (线条开始) + 1600ms (线条大致结束) + 200ms (停顿) = 4000ms
      setTimeout(() => {
        setHudVisible(true);
      }, 4000);

      // 4. 开始文字淡入动画 (在 HUD 动画开始后 + 300ms 延迟)
      // 总延迟 = 4000ms (HUD 开始) + 300ms (停顿) = 4300ms
      setTimeout(() => {
        setTextVisible(true);
      }, 4300);

      // 5. 设置动画完成标志 (在文字动画结束后 + buffer)
      // 文字动画 0.3s + 最大交错延迟约 0.5s = 0.8s
      // 总延迟 = 4300ms (文字开始) + 800ms + 200ms (buffer) = 5300ms
      setTimeout(() => {
        setAnimationsComplete(true);
      }, 5300);

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
    let pulseTimeoutId = null;

    if (animationsComplete) {
      pulseIntervalId = setInterval(() => {
        if (pulseTimeoutId) {
          clearTimeout(pulseTimeoutId);
        }

        // Generate three distinct random indices
        const indices = [];
        while (indices.length < 3) {
          const randomIndex = Math.floor(Math.random() * 6);
          if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
          }
        }
        
        // Assign first two to normal, third to reverse
        setPulsingNormalIndices([indices[0], indices[1]]);
        setPulsingReverseIndices([indices[2]]);

        pulseTimeoutId = setTimeout(() => {
          // Reset both states back to null
          setPulsingNormalIndices(null);
          setPulsingReverseIndices(null);
          pulseTimeoutId = null; 
        }, pulseAnimationDuration);

      }, 3000); 
    }

    // Cleanup function
    return () => {
      if (pulseIntervalId) clearInterval(pulseIntervalId);
      if (pulseTimeoutId) clearTimeout(pulseTimeoutId);
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

  // Handler for mouse entering the ABOUT column
  const handleAboutMouseEnter = () => {
    updateRandomHudTexts(); // Update immediately on enter
    // Clear any existing interval before starting a new one
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    // Start interval to update faster (every 50ms)
    intervalRef.current = setInterval(updateRandomHudTexts, 50); 
  };

  // Handler for mouse leaving the ABOUT column
  const handleAboutMouseLeave = () => {
    // Clear the interval when mouse leaves
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Reset ref
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

              // Add event handlers specifically for the ABOUT column (index 4)
              const mouseEnterHandler = index === 4 ? handleAboutMouseEnter : null;
              const mouseLeaveHandler = index === 4 ? handleAboutMouseLeave : null;

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
                  // Attach the mouse enter and leave handlers for ABOUT column
                  onMouseEnter={mouseEnterHandler}
                  onMouseLeave={mouseLeaveHandler}
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