import React from 'react';
import styles from '../styles/SimpleImageCard.module.scss';

const SimpleImageCard = ({ title, imageUrl }) => {
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardImage} style={imageStyle}>
        {/* Optional: Add an overlay or placeholder content if no image */}
        {!imageUrl && <span className={styles.placeholderText}>No Image</span>}
      </div>
      <h4 className={styles.cardTitle}>{title}</h4>
    </div>
  );
};

export default SimpleImageCard; 