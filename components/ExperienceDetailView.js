import React, { useState } from 'react';
import styles from '../styles/ExperienceDetailView.module.scss';
import Lightbox from './Lightbox';

const ExperienceDetailView = ({ item }) => {
  // console.log("[ExperienceDetailView] Received item:", item); // 调试：接收到的项目数据

  if (!item) {
    // console.log("[ExperienceDetailView] Item is null or undefined, returning null."); // 调试：项目数据为空，不渲染
    return null;
  }

  const { title, duration, location, details, type, galleryImages } = item;
  // console.log(`[ExperienceDetailView] Destructured values: title=${title}, duration=${duration}, location=${location}, details=${details ? 'exists' : 'missing'}`); // 调试：解构后的值

  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // 灯箱是否打开的状态
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0); // 当前灯箱显示的图片索引

  const imagesForGallery = galleryImages || []; // 确保 galleryImages 存在，否则使用空数组

  // 打开灯箱并设置当前图片索引
  const openLightbox = (index) => {
    if (index >= 0 && index < imagesForGallery.length) {
      setCurrentLightboxImageIndex(index);
      setIsLightboxOpen(true);
    }
  };

  // 关闭灯箱
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // 显示下一张图片
  const showNextImage = () => {
    setCurrentLightboxImageIndex((prevIndex) => (prevIndex + 1) % imagesForGallery.length);
  };

  // 显示上一张图片
  const showPrevImage = () => {
    setCurrentLightboxImageIndex((prevIndex) => 
      (prevIndex - 1 + imagesForGallery.length) % imagesForGallery.length
    );
  };

  return (
    <div className={styles.detailContainer}>
      {/* console.log("[ExperienceDetailView] Rendering title:", title) */} {/* 调试：渲染标题 */}
      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailMeta}>
        <span className={styles.detailDuration}>
          <span className={styles.metaLabel}>时长:</span> 
          {typeof duration === 'string' && duration ? (
            duration.split(' - ').map((part, index, arr) => 
               <span key={index} className={styles.timelineNumber}>
                 {part}{index < arr.length - 1 ? ' - ' : ''}
               </span>
            )
          ) : (
            <span className={styles.timelineNumber}>N/A</span>
          )}
        </span>
        {/* console.log("[ExperienceDetailView] Rendering location:", location) */} {/* 调试：渲染地点 */}
        {location && (
           <span className={styles.detailLocation}>
              <span className={styles.metaLabel}>地点:</span>
              {location}
           </span>
        )}
      </div>

      <div className={styles.detailBody}>
         {/* console.log("[ExperienceDetailView] Rendering details:", details) */} {/* 调试：渲染详情 */}
         {details && details.map((line, index) => (
            <p key={index} className={styles.detailParagraph}>
              {/* 将详情文本按年份数字分割，并为数字部分应用特定样式 */}
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
                onClick={() => openLightbox(index)} // 点击缩略图打开灯箱
              >
                <img 
                  src={img.src} 
                  alt={img.caption || `${title} 缩略图 ${index + 1}`} 
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
          onClose={closeLightbox} // 关闭灯箱回调
          onNext={imagesForGallery.length > 1 ? showNextImage : null} // 下一张图片回调
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null} // 上一张图片回调
        />
      )}

    </div>
  );
};

export default ExperienceDetailView; 