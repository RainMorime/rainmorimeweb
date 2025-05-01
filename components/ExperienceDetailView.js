import React, { useState } from 'react';
import styles from '../styles/ExperienceDetailView.module.scss';
import Lightbox from './Lightbox';

const ExperienceDetailView = ({ item }) => {
  if (!item) return null;

  const { title, duration, location, details, type, galleryImages } = item;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0);

  const imagesForGallery = galleryImages || [];

  const openLightbox = (index) => {
    if (index >= 0 && index < imagesForGallery.length) {
      setCurrentLightboxImageIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showNextImage = () => {
    setCurrentLightboxImageIndex((prevIndex) => (prevIndex + 1) % imagesForGallery.length);
  };

  const showPrevImage = () => {
    setCurrentLightboxImageIndex((prevIndex) => 
      (prevIndex - 1 + imagesForGallery.length) % imagesForGallery.length
    );
  };

  return (
    <div className={styles.detailContainer}>
      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailMeta}>
        <span className={styles.detailDuration}>
          <span className={styles.metaLabel}>Duration:</span> 
          {duration.split(' - ').map((part, index, arr) => 
             <span key={index} className={styles.timelineNumber}>
               {part}{index < arr.length - 1 ? ' - ' : ''}
             </span>
          )}
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
            <p key={index} className={styles.detailParagraph}>
              {line.split(/(\d{4}(?:\.\d{2})?)/g).map((part, partIndex) => 
                 /\d{4}(?:\.\d{2})?/.test(part) ? 
                 <span key={partIndex} className={styles.timelineNumber}>{part}</span> : 
                 part
              )}
            </p>
         ))}
      </div>

      {imagesForGallery.length > 0 && (
        <div className={styles.relatedImagesSection}>
          <h4 className={styles.relatedImagesTitle}>相关图片</h4>
          <div className={styles.thumbnailGrid}>
            {imagesForGallery.map((img, index) => (
              <button 
                key={index} 
                className={styles.thumbnailButton} 
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={img.src} 
                  alt={img.caption || `${title} thumbnail ${index + 1}`} 
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {isLightboxOpen && imagesForGallery.length > 0 && (
        <Lightbox 
          image={imagesForGallery[currentLightboxImageIndex]} 
          onClose={closeLightbox}
          onNext={imagesForGallery.length > 1 ? showNextImage : null}
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null}
        />
      )}

    </div>
  );
};

export default ExperienceDetailView; 