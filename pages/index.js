import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import VerticalShinyText from '../components/VerticalShinyText';
import styles from '../styles/Home.module.scss';

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
        <meta name="description" content="森雨(RainMorime)的个人网站，展示黑白灰设计的极简美学" />
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
          </div>
          
          <div className={styles.rightPanel}>
            <div className={`${styles.verticalLine} ${linesAnimated ? styles.animated : ''}`} style={{ left: '0%' }}></div>
            <div className={`${styles.verticalLine} ${linesAnimated ? styles.animated : ''}`} style={{ left: '16%' }}></div>
            <div className={`${styles.verticalLine} ${linesAnimated ? styles.animated : ''}`} style={{ left: '32%' }}></div>
            <div className={`${styles.verticalLine} ${linesAnimated ? styles.animated : ''}`} style={{ left: '48%' }}></div>
            <div className={`${styles.verticalLine} ${linesAnimated ? styles.animated : ''}`} style={{ left: '64%' }}></div>
            <div className={`${styles.verticalLine} ${linesAnimated ? styles.animated : ''}`} style={{ left: '80%' }}></div>
            
            {sectionNames.map((name, index) => {
              const columnPercentage = index * 16;
              const hudText = `DATA-Ø0${index + 1}`;

              return (
                <div 
                  key={name}
                  className={`${styles.column} ${styles['column' + index]} ${!animationsComplete ? styles.nonInteractive : ''}`} 
                  style={{ left: `${columnPercentage}%`, width: '16%' }} 
                  onClick={animationsComplete ? () => handleColumnClick(index) : null}
                >
                  <div className={styles.verticalText}>
                    {name.split('').map((char, charIdx) => {
                      const delay = `${charIdx * 0.05}s`;
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
                    {index === 3 && (
                      <>
                        <span className={`${styles.radarRipple} ${styles.ripple1}`}></span>
                        <span className={`${styles.radarRipple} ${styles.ripple2}`}></span>
                        <span className={`${styles.radarRipple} ${styles.ripple3}`}></span>
                      </>
                    )}
                  </div>
                  <div className={styles.cornerHudTopLeft}></div>
                  <div className={styles.cornerHudBottomRight}></div>
                  
                  {/* Main Image HUD */}
                  <div className={styles.imageHud}>
                    <span className={styles.imageHudSquare}></span>
                    <span className={styles.imageHudText}>{hudText}</span>
                  </div>

                  {/* Add 5 extra random HUDs specifically for column 4 (ABOUT) */}
                  {index === 4 && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <div key={`random-${i}`} className={`${styles.imageHud} ${styles.randomHud} ${styles[`randomHud${i + 1}`]}`}>
                          <span className={styles.imageHudSquare}></span>
                          <span className={styles.imageHudText}>{hudText}</span>
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