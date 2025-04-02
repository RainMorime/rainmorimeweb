import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import CustomCursor from '../../components/CustomCursor';
import styles from '../../styles/Experience.module.scss';

export default function Experience() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 示例经历数据
  const experiences = [
    {
      id: 1,
      title: "高级UI/UX设计师",
      organization: "创新数字科技有限公司",
      period: "2022 - 至今",
      description: [
        "负责公司主要产品的用户界面设计和交互体验优化",
        "带领设计团队完成多个关键项目，提升用户转化率45%",
        "建立完整的设计系统，提高团队工作效率和产品一致性"
      ],
      type: 'work'
    },
    {
      id: 2,
      title: "前端开发工程师",
      organization: "网络科技有限公司",
      period: "2020 - 2022",
      description: [
        "使用React和Three.js开发交互式网页应用",
        "优化网站性能，提高页面加载速度30%",
        "与设计师和后端开发人员协作，确保项目顺利交付"
      ],
      type: 'work'
    },
    {
      id: 3,
      title: "自由设计师",
      organization: "独立工作室",
      period: "2018 - 2020",
      description: [
        "为多家初创公司提供品牌设计和UI/UX设计服务",
        "完成超过20个设计项目，涵盖网站、应用和品牌识别",
        "建立个人设计方法论和工作流程"
      ],
      type: 'work'
    },
    {
      id: 4,
      title: "英语系学士",
      organization: "西安外国语大学",
      period: "2022 - 2026",
      description: [
        "专业：英语系",
        "主修课程：高级英语、英语口语、英语写作",
      ],
      type: 'education'
    }
  ];
  
  const filteredExperiences = filter === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.type === filter);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: { duration: 0.8 }
        },
        exit: { 
          opacity: 0,
          transition: { duration: 0.6 }
        }
      }}
    >
      <Head>
        <title>专业经历 | 森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的职业经历和教育背景" />
      </Head>

      <CustomCursor />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.header_container}>
          <div className={styles.content_container}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.page_header}
            >
              <h1>专业经历</h1>
              <p>
                我的职业旅程与学术背景，展示了我在设计与开发领域的成长轨迹。
              </p>
            </motion.div>
            
            {/* 过滤器 */}
            <motion.div 
              className={styles.filter_container}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setFilter('all')}
                className={`${styles.filter_button} ${filter === 'all' ? styles.active : styles.inactive}`}
              >
                全部
              </button>
              
              <button
                onClick={() => setFilter('work')}
                className={`${styles.filter_button} ${filter === 'work' ? styles.active : styles.inactive}`}
              >
                工作经历
              </button>
              
              <button
                onClick={() => setFilter('education')}
                className={`${styles.filter_button} ${filter === 'education' ? styles.active : styles.inactive}`}
              >
                教育背景
              </button>
            </motion.div>
            
            {/* 经历时间线 */}
            <motion.div
              className={styles.timeline_container}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* 时间线轴 */}
              <div className={styles.timeline_axis}></div>
              
              {/* 经历项目 */}
              {filteredExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={itemVariants}
                  className={styles.experience_item}
                >
                  {/* 时间线圆点 */}
                  <div 
                    className={`${styles.timeline_dot} ${index % 2 === 0 ? styles.odd : styles.even}`}
                  ></div>
                  
                  {/* 经历卡片 */}
                  <div className={styles.experience_card}>
                    {/* 类型标签 */}
                    <span className={`${styles.type_tag} ${styles[experience.type]}`}>
                      {experience.type === 'work' ? '工作' : '教育'}
                    </span>
                    
                    <div className={styles.card_content}>
                      <h3>{experience.title}</h3>
                      <div className={styles.meta_container}>
                        <span className={styles.organization}>{experience.organization}</span>
                        <span className={styles.divider}></span>
                        <span className={styles.period}>{experience.period}</span>
                      </div>
                      
                      <ul className={styles.description_list}>
                        {experience.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* 底部装饰 */}
            <motion.div
              className={styles.bottom_decoration}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            ></motion.div>
          </div>
        </div>
      </main>
    </motion.div>
  );
} 