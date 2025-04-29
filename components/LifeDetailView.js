import React from 'react';
import styles from '../styles/LifeDetailView.module.scss';

const LifeDetailView = ({ item, onBack }) => {
  if (!item) return null; // Don't render if no item is selected

  const { title, description, tech, imageUrl } = item;
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  return (
    <div className={styles.detailContainer}>
      {/* REMOVE THE BACK BUTTON
      <button className={styles.backButton} onClick={onBack}>
        ← BACK
      </button>
      */}

      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailContent}>
          <div className={styles.detailImageContainer}>
              <div className={styles.detailImage} style={imageStyle}>
                 {/* Optional: Placeholder if no image */} 
                 {!imageUrl && <span>Image not available</span>} 
                 {/* Add scanlines like ProjectCard? */} 
                 <div className={styles.imageScanlineOverlay}></div> 
              </div>
          </div>

          <div className={styles.detailText}>
              <p className={styles.detailDescription}>{description}</p>
              
              {tech && tech.length > 0 && (
                  <div className={styles.detailTechContainer}>
                       <span className={styles.techLabel}>Tags:</span> 
                       <div className={styles.detailTechTags}> 
                           {tech.map((tag, index) => (
                               <span key={index} className={styles.detailTechTag}>{tag}</span>
                           ))} 
                       </div> 
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};

export default LifeDetailView; 