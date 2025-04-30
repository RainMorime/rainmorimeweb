import React, { useState } from 'react';
import styles from '../styles/LifeDetailView.module.scss';
import Lightbox from './Lightbox';

const LifeDetailView = ({ item }) => {
  if (!item) return null; // Don't render if no item is selected

  const { title, description, tech, imageUrl, articleContent, galleryImages } = item;
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  // Split content into paragraphs based on double newline
  const paragraphs = articleContent ? articleContent.split('\n\n') : [];
  
  // Determine which images to use for the gallery and lightbox
  // Use item.galleryImages if available, otherwise fallback (e.g., for Minecraft)
  const imagesForGallery = galleryImages && galleryImages.length > 0 
    ? galleryImages 
    : (item.id === 'mc' ? [
        { src: '/pictures/Minecraft/MC2024.png', caption: 'MC大家庭2024合照' },
        { src: '/pictures/Minecraft/MC2.png'},
        { src: '/pictures/Minecraft/yh.jpg', caption: '营火服务器图标' },
        { src: '/pictures/Minecraft/MC2025.png', caption: 'MC大家庭2025合照' }
      ] : []); // Default to empty array if no specific gallery or fallback

  // --- Add State for Lightbox --- 
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0);

  const openLightbox = (index) => {
    // Ensure the index is valid for the current gallery
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
  // --- End State --- 

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
              
              {/* Render article content WITH interspersed images */} 
              {articleContent && (
                <div className={styles.articleSection}>
                  {paragraphs.map((paragraph, index) => {
                    // Determine the image to display inline (if any)
                    // For simplicity, let's only show inline images if they come from galleryImages
                    // or specifically for Minecraft's fallback.
                    const imageInfo = imagesForGallery[index] 
                                     && (galleryImages || item.id === 'mc') 
                                     ? imagesForGallery[index] 
                                     : null;
                    return (
                      <React.Fragment key={index}>
                        <p>{paragraph}</p>
                        {imageInfo && (
                          <figure 
                            className={`${styles.articleImageFigure} ${styles.clickableFigure}`}
                            onClick={() => openLightbox(index)} 
                          > 
                            <img 
                              src={imageInfo.src} 
                              alt={imageInfo.caption || `${title} illustration ${index + 1}`} 
                              className={styles.articleImage}
                            />
                            {imageInfo.caption && (
                                <figcaption className={styles.articleImageCaption}>{imageInfo.caption}</figcaption>
                            )}
                          </figure>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* --- Add Related Images Section --- */} 
              {imagesForGallery.length > 0 && (
                <div className={styles.relatedImagesSection}>
                  <h4 className={styles.relatedImagesTitle}>图片</h4>
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
              {/* --- End Related Images --- */} 

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

      {/* --- Render Lightbox --- */} 
      {isLightboxOpen && imagesForGallery.length > 0 && (
        <Lightbox 
          image={imagesForGallery[currentLightboxImageIndex]} 
          onClose={closeLightbox}
          onNext={imagesForGallery.length > 1 ? showNextImage : null}
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null}
        />
      )}
      {/* --- End Lightbox --- */} 

    </div>
  );
};

export default LifeDetailView; 