import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const heroRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const heroControls = useAnimation();
  
  // 处理加载完成
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  
  useEffect(() => {
    // 只有在加载完成后才开始动画
    if (!isLoading) {
      heroControls.start("visible");
    }
  }, [isLoading, heroControls]);

  // 以下是组件动画变量
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Head>
        <title>森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的个人网站，展示黑白灰设计的极简美学" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomCursor />
      <Navbar />

      {isLoading && <HomeLoadingScreen onComplete={handleLoadingComplete} />}

      <main className={styles.main}>
        <section className={styles.hero} ref={heroRef}>
          <div className={styles.hero_content}>
            <motion.div 
              className={styles.hero_text}
              variants={containerVariants}
            >
              <h1>
                <span className={styles.chinese_char}>森雨</span>
                <div className={styles.latin_name}>
                  <ShinyText text="RAIN" speed={3} className={styles.rain_text} />
                  <ShinyText text="MORIME" speed={3} className={styles.morime_text} />
                </div>
              </h1>
            </motion.div>
          </div>
        </section>
      </main>
    </motion.div>
  );
} 