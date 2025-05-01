import React from 'react';
import styles from '../styles/BlogDetailView.module.scss'; // Use new SCSS module

// Basic structure similar to LifeDetailView
const BlogDetailView = ({ item }) => {
  if (!item) return null; 

  const { title, excerpt, articleContent } = item; // Destructure blog post data
  
  // Basic rendering, can be expanded later
  const paragraphs = articleContent ? articleContent.split('\n\n') : [];

  return (
    <div className={styles.detailContainer}> 
      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailContent}>
          <div className={styles.detailText}>
              {/* Display excerpt or initial part */}
              <p className={styles.detailDescription}>{excerpt}</p> 
              
              {/* Render main article content */}
              {articleContent && (
                <div className={styles.articleSection}>
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
              {/* Add more elements like tags, date, images later if needed */}
          </div>
      </div>
    </div>
  );
};

export default BlogDetailView; 