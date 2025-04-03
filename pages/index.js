import Head from 'next/head';
import { useState, useEffect } from 'react';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import VerticalShinyText from '../components/VerticalShinyText';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  
  // 处理加载完成
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // 延迟显示主内容，确保动画转场完成
    setTimeout(() => {
      setMainVisible(true);
    }, 100);
  };

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

      {/* 加载动画，无论何时都渲染，由组件内部控制显示状态 */}
      <HomeLoadingScreen onComplete={handleLoadingComplete} />

      {/* 主内容区域，仅在动画完成后显示 */}
      {mainVisible && (
        <main className={styles.mainLayout}>
          <div className={styles.leftPanel}>
            <div className={styles.logoContainer}>
              {/* 移除img标签，改用CSS背景展示 */}
            </div>
          </div>
          
          <div className={styles.rightPanel}>
            {/* 固定位置的垂直线 */}
            <div className={styles.verticalLine} style={{ left: '0%' }}></div>
            <div className={styles.verticalLine} style={{ left: '16%' }}></div>
            <div className={styles.verticalLine} style={{ left: '32%' }}></div>
            <div className={styles.verticalLine} style={{ left: '48%' }}></div>
            <div className={styles.verticalLine} style={{ left: '64%' }}></div>
            <div className={styles.verticalLine} style={{ left: '80%' }}></div>
            
            {/* 固定列区域 */}
            <div className={styles.column} style={{ left: '0%', width: '16%' }} onClick={() => handleColumnClick(0)}>
              <div className={styles.verticalText}>
                {sectionNames[0].split('').map((char, idx) => (
                  <div key={idx} className={styles.charItem}>
                    <VerticalShinyText text={char} speed={2.5 + idx * 0.15} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.column} style={{ left: '16%', width: '16%' }} onClick={() => handleColumnClick(1)}>
              <div className={styles.verticalText}>
                {sectionNames[1].split('').map((char, idx) => (
                  <div key={idx} className={styles.charItem}>
                    <VerticalShinyText text={char} speed={2.7 + idx * 0.12} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.column} style={{ left: '32%', width: '16%' }} onClick={() => handleColumnClick(2)}>
              <div className={styles.verticalText}>
                {sectionNames[2].split('').map((char, idx) => (
                  <div key={idx} className={styles.charItem}>
                    <VerticalShinyText text={char} speed={2.4 + idx * 0.15} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.column} style={{ left: '48%', width: '16%' }} onClick={() => handleColumnClick(3)}>
              <div className={styles.verticalText}>
                {sectionNames[3].split('').map((char, idx) => (
                  <div key={idx} className={styles.charItem}>
                    <VerticalShinyText text={char} speed={2.6 + idx * 0.13} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.column} style={{ left: '64%', width: '16%' }} onClick={() => handleColumnClick(4)}>
              <div className={styles.verticalText}>
                {sectionNames[4].split('').map((char, idx) => (
                  <div key={idx} className={styles.charItem}>
                    <VerticalShinyText text={char} speed={2.3 + idx * 0.14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
} 