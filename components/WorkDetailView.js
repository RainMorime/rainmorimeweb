import React from 'react';
import styles from '../styles/WorkDetailView.module.scss'; // Use a new SCSS module

// Reusing ProjectCard might be complex due to layout differences in detail view.
// Let's build a dedicated detail view component.

const WorkDetailView = ({ item }) => { // Removed onBack prop
  if (!item) return null; 

  const { title, description, tech, imageUrl, link } = item;
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  return (
    <div className={styles.detailContainer}>
      {/* Back button removed, handled globally */}

      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailContent}>
          <div className={styles.detailImageContainer}>
              <div className={styles.detailImage} style={imageStyle}>
                 {!imageUrl && <span>Image not available</span>} 
                 <div className={styles.imageScanlineOverlay}></div> 
              </div>
          </div>

          <div className={styles.detailText}>
              <p className={styles.detailDescription}>{description}</p>
              
              {tech && tech.length > 0 && (
                  <div className={styles.detailTechContainer}>
                       <span className={styles.techLabel}>Technologies:</span> 
                       <div className={styles.detailTechTags}> 
                           {tech.map((tag, index) => (
                               <span key={index} className={styles.detailTechTag}>{tag}</span>
                           ))} 
                       </div> 
                  </div>
              )}

              {link && link !== '#' && (
                  <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.detailLink}
                  >
                      Visit Project / Link
                  </a>
              )}
          </div>
      </div>

    </div>
  );
};

export default WorkDetailView; 