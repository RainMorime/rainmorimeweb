import React from 'react';
import styles from '../styles/BlogPostCard.module.scss';
// import Link from 'next/link'; // Remove Link import if not used for navigation

const BlogPostCard = ({ post, onClick }) => { // <-- Accept onClick prop
  // Basic structure, add more details later (date, tags, etc.)
  const { id, title, excerpt } = post;

  // Remove postLink if navigation is handled by onClick
  // const postLink = `/blog/${id || 'placeholder'}`;

  // Define an explicit handler to pass both post and event
  const handleCardClick = (e) => {
    if (onClick) {
      onClick(post, e); // Pass post data first, then event object
    }
  };

  return (
    // Change Link to a div or button, and use the explicit handler
    <div className={styles.card} onClick={handleCardClick}> 
        <div className={styles.cardContent}>
          <h4 className={styles.cardTitle}>{title || 'Untitled Post'}</h4>
          <p className={styles.cardExcerpt}>{excerpt || 'No excerpt available.'}</p>
          {/* Add date/tags here later */}
        </div>
        {/* Maybe add a subtle background pattern or border effect */}
    </div>
  );
};

export default BlogPostCard; 