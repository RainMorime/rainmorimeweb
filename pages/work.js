import React from 'react';
import Head from 'next/head';
import CustomCursor from '../components/CustomCursor';
import styles from '../styles/Page.module.scss'; // We might need to create this style file later
import homeStyles from '../styles/Home.module.scss'; // Import home styles

export default function Work() {
  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>作品 - 森雨</title>
        <meta name="description" content="森雨(RainMorime)的作品展示" />
      </Head>

      {/* Add background elements from Home */}
      <div className={homeStyles.gridBackground}></div>
      <div className={homeStyles.glowEffect}></div>
      <div className={homeStyles.scanLines}></div>

      <CustomCursor />

      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>作品展示</h1>
        <p className={styles.placeholderText}>
          这里将展示我的项目和作品。
          <br />
          敬请期待...
        </p>
        {/* 在这里添加作品列表或网格 */}
      </main>

      {/* 可以考虑添加页脚或其他通用组件 */}
    </div>
  );
} 