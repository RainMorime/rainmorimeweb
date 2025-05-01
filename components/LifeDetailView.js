import React, { useState, useEffect } from 'react';
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
  const [lightboxImageObject, setLightboxImageObject] = useState(null); // <-- State for lightbox image object

  // Function to get the dynamic caption for WA images
  const getDynamicCaption = (imageSrc) => {
    if (item.id !== 'wa') return null;
    switch (imageSrc) {
      case '/pictures/WHITE_ALBUM/w15.jpg': return '理奈放弃自己的偶像事业后与冬弥来到海边';
      case '/pictures/WHITE_ALBUM/w18.jpg': return '小夜子和冬弥相互依偎';
      case '/pictures/WHITE_ALBUM/w16.jpg': return '遥';
      case '/pictures/WHITE_ALBUM/w20.jpg': return '弥生';
      case '/pictures/WHITE_ALBUM/w3.jpg': return '小夜子名场面';
      case '/pictures/WHITE_ALBUM/w12.jpg': return '理奈和由绮的争执';
      default: return null;
    }
  };

  const openLightbox = (index) => {
    if (index >= 0 && index < imagesForGallery.length) {
      const baseImage = imagesForGallery[index];
      const dynamicCaption = getDynamicCaption(baseImage.src);
      const imageForLightbox = { 
        ...baseImage, 
        caption: dynamicCaption || baseImage.caption // Use dynamic caption if available, else original
      };
      
      setCurrentLightboxImageIndex(index); // Still needed for index tracking
      setLightboxImageObject(imageForLightbox); // Set the object with correct caption
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImageObject(null); // Clear the object
  };

  const showNextImage = () => {
    const nextIndex = (currentLightboxImageIndex + 1) % imagesForGallery.length;
    openLightbox(nextIndex); // Re-call openLightbox to get correct caption
  };

  const showPrevImage = () => {
    const prevIndex = (currentLightboxImageIndex - 1 + imagesForGallery.length) % imagesForGallery.length;
    openLightbox(prevIndex); // Re-call openLightbox to get correct caption
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
                    let imagesToRenderAfter = []; // Array to hold images for this position

                    // Specific logic for Monster Hunter
                    if (item.id === 'mh') {
                      if (index === paragraphs.length - 1) { 
                        const mh4Index = imagesForGallery.findIndex(img => img.src === '/pictures/Monster_Hunter/MH4.jpg');
                        if (mh4Index !== -1) {
                          imagesToRenderAfter.push({ info: imagesForGallery[mh4Index], lightboxIndex: mh4Index });
                        }
                        imagesToRenderAfter.push('separator');
                        imagesToRenderAfter.push({
                          type: 'link',
                          href: 'https://www.bilibili.com/video/BV1n5aTebESo',
                          text: '鏖战冰牙龙'
                        });
                        imagesToRenderAfter.push({
                          type: 'link',
                          href: 'https://www.bilibili.com/video/BV1uNapeDEcS',
                          text: '初见冰呪龙'
                        });
                      }
                    } 
                    // Fallback logic for Minecraft - RESTORE image insertion
                    else if (item.id === 'mc') { 
                      // Add image for this paragraph index if it exists
                      if (imagesForGallery[index]) {
                         imagesToRenderAfter.push({ info: imagesForGallery[index], lightboxIndex: index });
                      }
                      // ALSO add links after the very last paragraph
                      if (index === paragraphs.length - 1) { 
                          imagesToRenderAfter.push('separator'); 
                          imagesToRenderAfter.push({
                            type: 'link',
                            href: 'https://www.bilibili.com/video/BV13G411D7Gq',
                            text: '营火服务器实况'
                          });
                          imagesToRenderAfter.push({
                            type: 'link',
                            href: 'https://www.bilibili.com/video/BV1ce411D7dG',
                            text: '营火高级幻岛'
                          });
                      }
                    } 
                    // --- ADD Jilin Image Insertion Logic --- 
                    else if (item.id === 'jilin') {
                      if (index === 3) { // After the 4th paragraph (index 3)
                        // Add JL1 insertion with caption here
                        const jilin1Index = imagesForGallery.findIndex(img => img.src === '/images/travel/jilin/JL1.jpg');
                        if (jilin1Index !== -1) {
                          imagesToRenderAfter.push({ 
                            info: { ...imagesForGallery[jilin1Index], caption: '高考结束那天，黑云分界线如刀切一般，太阳也正展现着它的曙光' }, 
                            lightboxIndex: jilin1Index 
                          });
                        }
                      } else if (index === 4) { // After the 5th paragraph (index 4)
                        // Keep JL5 insertion
                        const jilin5Index = imagesForGallery.findIndex(img => img.src === '/images/travel/jilin/JL5.jpg');
                        if (jilin5Index !== -1) {
                          imagesToRenderAfter.push({ info: imagesForGallery[jilin5Index], lightboxIndex: jilin5Index });
                        }
                        // REMOVE JL1 insertion from here
                      }
                    }
                    // --- END ADD ---
                    // --- ADD Qinghai Image Insertion Logic --- 
                    else if (item.id === 'qinghai') {
                      let targetImageSrc = null;
                      let targetCaption = null;
                      let isRow = false;
                      let secondTargetImageSrc = null;
                      let secondTargetCaption = null;
                      let multipleImages = []; // For last paragraph

                      if (index === 1) { // After 2nd paragraph
                        isRow = true;
                        targetImageSrc = '/images/travel/qinghai/QH5.jpg';
                        targetCaption = '凌晨的坎布拉';
                        secondTargetImageSrc = '/images/travel/qinghai/QH6.jpg';
                        secondTargetCaption = '我俩在黑夜打着手电筒交替前行';
                      } else if (index === 4) { // After 5th (last) paragraph
                        multipleImages = [
                          { src: '/images/travel/qinghai/QH12.jpg', caption: '青海湖' },
                          { src: '/images/travel/qinghai/QH18.jpg', caption: '落日下的茶卡盐湖' },
                          { src: '/images/travel/qinghai/QH36.jpg', caption: '岗什卡脚下的信号塔' },
                          { src: '/images/travel/qinghai/QH40.jpg', caption: '风雪中的岗什卡' },
                        ];
                      }

                      if (targetImageSrc) {
                        const imgIndex = imagesForGallery.findIndex(img => img.src === targetImageSrc);
                        if (imgIndex !== -1) {
                          imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption: targetCaption }, lightboxIndex: imgIndex });
                        }
                      }
                      if (isRow && secondTargetImageSrc) {
                        const secondImgIndex = imagesForGallery.findIndex(img => img.src === secondTargetImageSrc);
                        if (secondImgIndex !== -1) {
                          imagesToRenderAfter.push({ info: { ...imagesForGallery[secondImgIndex], caption: secondTargetCaption }, lightboxIndex: secondImgIndex });
                        }
                      }
                      if (multipleImages.length > 0) {
                        multipleImages.forEach(imgInfo => {
                          const imgIndex = imagesForGallery.findIndex(img => img.src === imgInfo.src);
                          if (imgIndex !== -1) {
                            imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption: imgInfo.caption }, lightboxIndex: imgIndex });
                          }
                        });
                      }
                    }
                    // --- END ADD ---
                    // --- ADD Korea Image Insertion Logic ---
                    else if (item.id === 'korea') {
                      if (index === 1) { // After 2nd paragraph - Change image to HG3
                        const hg3Index = imagesForGallery.findIndex(img => img.src === '/images/travel/hanguo/HG3.jpg'); // Find HG3 now
                        if (hg3Index !== -1) {
                          imagesToRenderAfter.push({ 
                            info: { ...imagesForGallery[hg3Index], caption: '我和父母一起吃烤肉' }, // Use HG3 index, keep caption
                            lightboxIndex: hg3Index 
                          });
                        }
                      }
                    }
                    // --- END ADD ---
                    // --- ADD Touhou Image Insertion Logic ---
                    else if (item.id === 'thif') {
                      if (index === paragraphs.length - 1) { // After the last paragraph
                        const cg1Index = imagesForGallery.findIndex(img => img.src === '/pictures/Touhou/CG1.png');
                        if (cg1Index !== -1) {
                          imagesToRenderAfter.push({ info: imagesForGallery[cg1Index], lightboxIndex: cg1Index });
                        }
                      }
                    }
                    // --- END ADD ---
                    // --- MODIFY Wukong Logic --- 
                    else if (item.id === 'bmwk') { 
                      if (index === paragraphs.length - 1) { 
                        // Just process the paragraph normally, links added after
                        imagesToRenderAfter.push('separator');
                        imagesToRenderAfter.push({
                          type: 'link',
                          href: 'https://www.bilibili.com/video/BV1bKtXeoET6',
                          text: '实体版开箱' // Text for the link item
                        });
                      }
                    }
                    // --- END MODIFY --- 
                    // --- ADD Titanfall Image Insertion Logic ---
                    else if (item.id === 'titanfall') {
                      if (index === paragraphs.length - 1) { // After the last paragraph
                        const imgIndex = imagesForGallery.findIndex(img => img.src === '/pictures/Titalfall/titan4.jpg');
                        if (imgIndex !== -1) {
                          imagesToRenderAfter.push({ info: imagesForGallery[imgIndex], lightboxIndex: imgIndex });
                        }
                      }
                    }
                    // --- END ADD ---
                    // Specific logic for WHITE ALBUM
                    else if (item.id === 'wa') {
                      let targetImageSrc = null;
                      let targetCaption = null;
                      let isRow = false;
                      let secondTargetImageSrc = null;
                      let secondTargetCaption = null; // Add caption for the second image in row

                      if (index === 0) { // After 1st paragraph
                        targetImageSrc = '/pictures/WHITE_ALBUM/w1.jpg';
                      } else if (index === 3) { // After 4th paragraph
                        targetImageSrc = '/pictures/WHITE_ALBUM/w15.jpg';
                        targetCaption = '理奈放弃自己的偶像事业后与冬弥来到海边';
                      } else if (index === 5) { // After 6th paragraph (previously 5th)
                        targetImageSrc = '/pictures/WHITE_ALBUM/w18.jpg';
                        targetCaption = '小夜子和冬弥相互依偎';
                      } else if (index === 6) { // After 7th paragraph (previously 6th) - ROW
                        isRow = true;
                        targetImageSrc = '/pictures/WHITE_ALBUM/w16.jpg';
                        targetCaption = '遥'; // Caption for w16
                        secondTargetImageSrc = '/pictures/WHITE_ALBUM/w20.jpg';
                        secondTargetCaption = '弥生'; // Caption for w20
                      } else if (index === 8) { // After 9th paragraph
                        targetImageSrc = '/pictures/WHITE_ALBUM/w2.jpg';
                      }

                      if (targetImageSrc) {
                        const imgIndex = imagesForGallery.findIndex(img => img.src === targetImageSrc);
                        if (imgIndex !== -1) {
                          const caption = targetCaption || imagesForGallery[imgIndex].caption;
                          imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption }, lightboxIndex: imgIndex });
                        }
                      }
                      if (isRow && secondTargetImageSrc) {
                         const secondImgIndex = imagesForGallery.findIndex(img => img.src === secondTargetImageSrc);
                         if (secondImgIndex !== -1) {
                           // Use provided caption or default from gallery for the second image
                           const caption = secondTargetCaption || imagesForGallery[secondImgIndex].caption;
                           imagesToRenderAfter.push({ info: { ...imagesForGallery[secondImgIndex], caption }, lightboxIndex: secondImgIndex });
                         }
                      }
                    }
                    
                    // Render paragraph or blockquote (existing logic)
                    const isStrayQuote = item.id === 'stray' && paragraph.includes('——《我是猫》，夏目漱石');

                    // Start Fragment
                    return (
                      <React.Fragment key={index}>
                        {/* Render Paragraph or Blockquote */}
                        {isStrayQuote ? (
                          <blockquote key={`${index}-text`} className={styles.articleBlockquote}>
                            {paragraph.split('\n').map((line, lineIndex) => <span key={lineIndex} style={{ display: 'block' }}>{line}</span>)} 
                          </blockquote>
                        ) : (
                          <p key={`${index}-text`}>{paragraph}</p>
                        )}

                        {/* Render Images/Links After Paragraph */} 
                        {imagesToRenderAfter.length > 0 && (
                          <>
                            {/* Render Row Images if applicable */}
                            {((item.id === 'wa' && index === 6) || (item.id === 'qinghai' && index === 1)) && imagesToRenderAfter.every(i => typeof i === 'object' && i.info) && imagesToRenderAfter.length === 2 && (
                              <div className={styles.inlineImageRow} key={`${index}-img-row`}> 
                                {imagesToRenderAfter.map(({ info, lightboxIndex }) => (
                                  <figure key={info.src} className={`${styles.articleImageFigure} ${styles.clickableFigure} ${styles.rowFigure}`} onClick={() => openLightbox(lightboxIndex)}>
                                    <img src={info.src} alt={info.caption || `${title} illustration`} className={styles.articleImage}/>
                                    {info.caption && <figcaption className={styles.articleImageCaption}>{info.caption}</figcaption>}
                                  </figure>
                                ))}
                              </div>
                            )}

                            {/* Render Stacked Images */}
                            {imagesToRenderAfter
                              .filter(renderItem => typeof renderItem === 'object' && renderItem.info && !((item.id === 'wa' && index === 6) || (item.id === 'qinghai' && index === 1))) // Exclude row images here
                              .map(({ info, lightboxIndex }, itemIndex) => (
                                <figure key={info.src || `${index}-img-${itemIndex}`} className={`${styles.articleImageFigure} ${styles.clickableFigure}`} onClick={() => openLightbox(lightboxIndex)}>
                                  <img src={info.src} alt={info.caption || `${title} illustration`} className={styles.articleImage}/>
                                  {info.caption && <figcaption className={styles.articleImageCaption}>{info.caption}</figcaption>}
                                </figure>
                              ))}
                            
                            {/* Render Link List if separator exists */}
                            {imagesToRenderAfter.includes('separator') && (
                              <div className={styles.articleLinkList} key={`${index}-link-list`}>
                                {imagesToRenderAfter
                                  .filter(renderItem => typeof renderItem === 'object' && renderItem.type === 'link')
                                  .map(linkItem => (
                                    <div key={linkItem.href} className={styles.articleLinkItem}>
                                      <a href={linkItem.href} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink} aria-label={linkItem.text}>
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/></g></svg>
                                      </a>
                                      <span className={styles.articleLinkText}>{linkItem.text}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </> // Closing the outer fragment for images/links
                        )}
                      </React.Fragment> // Closing the main fragment for paragraph+images/links
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
      {isLightboxOpen && lightboxImageObject && (
        <Lightbox 
          image={lightboxImageObject}
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