import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import CustomCursor from '../../components/CustomCursor';
import styles from '../../styles/Life.module.scss';

export default function LifePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('photography');
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const pageVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const itemVariants = {
    initial: { 
      y: 50, 
      opacity: 0 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  const tabs = [
    { id: 'photography', label: '摄影' },
    { id: 'travel', label: '旅行' },
    { id: 'reading', label: '阅读' },
    { id: 'music', label: '音乐' }
  ];

  const photos = [
    { id: 1, category: 'photography', title: '雨中城市', description: '雨中的城市街道，黑白摄影', image: '/path/to/photo1.jpg' },
    { id: 2, category: 'photography', title: '建筑线条', description: '现代建筑的几何线条', image: '/path/to/photo2.jpg' },
    { id: 3, category: 'photography', title: '雨滴特写', description: '叶子上的雨滴特写', image: '/path/to/photo3.jpg' },
    { id: 4, category: 'photography', title: '晨雾森林', description: '晨雾中的森林剪影', image: '/path/to/photo4.jpg' },
    { id: 5, category: 'photography', title: '极简构图', description: '黑白极简主义构图', image: '/path/to/photo5.jpg' },
    { id: 6, category: 'photography', title: '雨后街景', description: '雨后街道的倒影', image: '/path/to/photo6.jpg' },
    
    { id: 7, category: 'travel', title: '东京', description: '东京都市夜景', image: '/path/to/travel1.jpg' },
    { id: 8, category: 'travel', title: '京都', description: '京都传统建筑', image: '/path/to/travel2.jpg' },
    { id: 9, category: 'travel', title: '伦敦', description: '伦敦雨天的街道', image: '/path/to/travel3.jpg' },
    { id: 10, category: 'travel', title: '巴黎', description: '巴黎黑白建筑', image: '/path/to/travel4.jpg' },
    { id: 11, category: 'travel', title: '北欧', description: '北欧极简风景', image: '/path/to/travel5.jpg' },
    { id: 12, category: 'travel', title: '纽约', description: '纽约城市建筑', image: '/path/to/travel6.jpg' },
    
    { id: 13, category: 'reading', title: '设计思维', description: '关于设计思考的书籍', image: '/path/to/book1.jpg' },
    { id: 14, category: 'reading', title: '极简主义', description: '探讨极简主义的生活方式', image: '/path/to/book2.jpg' },
    { id: 15, category: 'reading', title: '东方美学', description: '东方美学与设计', image: '/path/to/book3.jpg' },
    { id: 16, category: 'reading', title: '摄影技术', description: '黑白摄影技巧', image: '/path/to/book4.jpg' },
    
    { id: 17, category: 'music', title: '雨声冥想', description: '雨声与钢琴的冥想音乐', image: '/path/to/music1.jpg' },
    { id: 18, category: 'music', title: '极简电子', description: '极简主义电子音乐', image: '/path/to/music2.jpg' },
    { id: 19, category: 'music', title: '现代古典', description: '现代古典音乐', image: '/path/to/music3.jpg' },
    { id: 20, category: 'music', title: '爵士钢琴', description: '黑白键上的即兴', image: '/path/to/music4.jpg' }
  ];

  const filteredItems = photos.filter(item => item.category === selectedTab);

  const quotes = [
    {
      text: "设计不仅是外表，更是一种生活态度。",
      author: "森雨"
    },
    {
      text: "在黑白灰之间，我寻找着生活的平衡与意义。",
      author: "森雨"
    },
    {
      text: "雨滴的声音是大自然最纯粹的设计。",
      author: "森雨"
    }
  ];

  return (
    <motion.div 
      className={styles.container}
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
      exit="exit"
      variants={pageVariants}
    >
      <Head>
        <title>生活 | 森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的生活方式与日常灵感" />
      </Head>

      <CustomCursor />
      <Navbar />

      <main className={styles.main}>
        <motion.section className={styles.hero} variants={itemVariants}>
          <motion.h1 variants={itemVariants}>生活</motion.h1>
          <motion.p variants={itemVariants}>
            设计不只是工作，更是一种生活方式
          </motion.p>
        </motion.section>

        <motion.section className={styles.quote_section} variants={itemVariants}>
          <div className={styles.quote_container}>
            <motion.div 
              className={styles.quote}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <blockquote>
                <p>{quotes[0].text}</p>
                <cite>— {quotes[0].author}</cite>
              </blockquote>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className={styles.life_section} variants={itemVariants}>
          <div className={styles.section_header}>
            <h2>日常灵感</h2>
            <div className={styles.line}></div>
          </div>
          
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                className={`${styles.tab_btn} ${selectedTab === tab.id ? styles.active : ''}`}
                onClick={() => setSelectedTab(tab.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
          
          <motion.div 
            className={styles.gallery_grid}
            initial="initial"
            animate="animate"
            variants={pageVariants}
          >
            {filteredItems.map((item) => (
              <motion.div 
                className={styles.gallery_item}
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className={styles.image_container}>
                  <div className={styles.placeholder}></div>
                </div>
                <div className={styles.item_info}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.philosophy_section} variants={itemVariants}>
          <div className={styles.section_header}>
            <h2>生活理念</h2>
            <div className={styles.line}></div>
          </div>
          
          <div className={styles.philosophy_content}>
            <motion.div 
              className={styles.philosophy_text}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p>
                我的设计理念源于日常生活的观察与思考，特别是对雨天的感受。雨滴从天而降，
                在城市的钢筋混凝土间形成独特的视觉与听觉体验，这种自然与人工的交融，
                成为我创作的重要灵感来源。
              </p>
              <p>
                在工作之外，我追求极简而有质感的生活方式，喜欢黑白灰的色调，
                注重细节与平衡。通过摄影记录城市与自然的瞬间，通过阅读探索设计思想的源流，
                通过旅行感受不同文化的美学表达。
              </p>
              <p>
                我相信，好的设计应该是功能与美学的完美结合，既解决问题，又带来情感共鸣。
                这种理念不仅体现在我的专业工作中，也渗透到生活的方方面面。
              </p>
            </motion.div>
            <motion.div 
              className={styles.philosophy_image}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={styles.large_placeholder}></div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footer_content}>
          <div className={styles.footer_quote}>
            <blockquote>
              <p>{quotes[1].text}</p>
              <cite>— {quotes[1].author}</cite>
            </blockquote>
          </div>
          <div className={styles.footer_links}>
            <a href="/work">查看作品</a>
            <a href="/#contact">联系我</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
} 