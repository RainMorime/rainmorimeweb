import React from 'react';
import styles from '../styles/BlogView.module.scss';
import BlogPostCard from './BlogPostCard';

// --- ADD Placeholder Blog Data ---
const placeholderPosts = [
  { id: 'post-1', title: '第一篇博客文章', excerpt: '以后会写点什么...' },
  // --- REMOVE Last 3 Placeholders ---
  //{ id: 'post-2', title: '关于网站设计的思考', excerpt: '探讨本次网站设计背后的理念和技术选型...' },
  //{ id: 'post-3', title: '游戏体验分享：XXX', excerpt: '分享近期玩过的一款游戏的体验和感想...' },
  //{ id: 'post-4', title: '学习笔记：React Hooks', excerpt: '记录学习 React Hooks 过程中的一些关键点...' },
  // --- END REMOVE ---
];
// --- END ADD ---

const BlogView = ({ onPostClick }) => {
  return (
    <div className={styles.blogContainer}>
      <h2 className={styles.blogTitle}>Blog</h2>
      
      {/* --- Replace Placeholder Text with Grid --- */}
      <div className={styles.blogPostGrid}> 
        {placeholderPosts.map(post => (
          <BlogPostCard 
            key={post.id} 
            post={post} 
            onClick={() => onPostClick(post)}
          />
        ))}
      </div>
      {/* --- END REPLACE --- */}

      {/* <p className={styles.placeholderText}>
        博客内容即将上线... (Blog content coming soon...)
      </p> */}
    </div>
  );
};

export default BlogView; 