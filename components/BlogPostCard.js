import React from 'react';
import styles from '../styles/BlogPostCard.module.scss';
// import Link from 'next/link'; // 如果未使用 Link进行导航，则移除导入

const BlogPostCard = ({ post, onClick }) => { // <-- 接收 onClick prop
  // 基本结构，稍后添加更多详细信息 (例如日期、标签等)
  const { id, title, excerpt } = post;

  // 如果导航由 onClick 处理，则移除 postLink
  // const postLink = `/blog/${id || 'placeholder'}`;

  // 定义一个显式处理函数以传递 post 和 event 对象
  const handleCardClick = (e) => {
    if (onClick) {
      onClick(post, e); // 首先传递 post 数据，然后传递 event 对象
    }
  };

  return (
    // 将 Link 更改为 div 或 button，并使用显式处理函数
    <div className={styles.card} onClick={handleCardClick}> 
        <div className={styles.cardContent}>
          <h4 className={styles.cardTitle}>{title || '无标题文章'}</h4>
          <p className={styles.cardExcerpt}>{excerpt || '无摘要信息。'}</p>
          {/* 稍后在此处添加日期/标签 */}
        </div>
        {/* 或许可以添加一个细微的背景图案或边框效果 */}
    </div>
  );
};

export default BlogPostCard; 