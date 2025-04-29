import React from 'react';
import styles from '../styles/ExperienceDetailView.module.scss';

const ExperienceDetailView = ({ item }) => {
  if (!item) return null;

  const { title, duration, location, details, type } = item;

  return (
    <div className={styles.detailContainer}>
      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailMeta}>
        <span className={styles.detailDuration}>
          <span className={styles.metaLabel}>Duration:</span> 
          {duration}
        </span>
        {location && (
           <span className={styles.detailLocation}>
              <span className={styles.metaLabel}>Location:</span>
              {location}
           </span>
        )}
      </div>

      <div className={styles.detailBody}>
         {details && details.map((line, index) => (
            <p key={index} className={styles.detailParagraph}>{line}</p>
         ))}
         {/* You could add more specific content based on item.type here if needed */}
      </div>

    </div>
  );
};

export default ExperienceDetailView; 