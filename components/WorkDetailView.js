import React, { useState } from 'react';
import styles from '../styles/WorkDetailView.module.scss'; // Use a new SCSS module
import Lightbox from './Lightbox'; // <-- Import Lightbox

// Reusing ProjectCard might be complex due to layout differences in detail view.
// Let's build a dedicated detail view component.

const WorkDetailView = ({ item }) => { // Removed onBack prop
  if (!item) return null; 

  const { title, description, tech, imageUrl, link, galleryImages, articleContent } = item;
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  // --- Add State and Functions for Lightbox --- 
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0);
  const [lightboxImageObject, setLightboxImageObject] = useState(null); // <-- ADD State for lightbox image object
  const [copiedTextId, setCopiedTextId] = useState(null); // <-- ADD State for copied text feedback

  const imagesForGallery = galleryImages || []; // Use galleryImages if available

  const openLightbox = (index) => {
    if (index >= 0 && index < imagesForGallery.length) {
      setCurrentLightboxImageIndex(index);
      // --- MODIFY: Determine correct caption and set image object --- 
      const baseImage = imagesForGallery[index];
      let captionForLightbox = baseImage.caption; // Default to gallery caption
      
      // Check if it's one of the special inline images for the website project (ID 7)
      if (item.id === 7) {
        if (baseImage.src === '/images/projects/web/wb2.png' || baseImage.src === '/images/projects/web/wb4.png') {
          captionForLightbox = '网站旧设'; // Use specific inline caption
        } else if (baseImage.src === '/images/projects/web/wb0.jpg') { // <-- ADD check for wb0
           captionForLightbox = '以前的网站'; // Use specific inline caption for wb0
        } else if (baseImage.src === '/images/projects/web/wb5.png') { // <-- ADD check for wb5
           captionForLightbox = '一些小设定'; // <-- ADD caption for wb5
        }
      }
      // You might need similar checks for other projects if they have inline images with special captions

      const imageForLightbox = { 
        ...baseImage, 
        caption: captionForLightbox 
      };
      setLightboxImageObject(imageForLightbox); // Set the object with correct caption
      // --- END MODIFY --- 
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImageObject(null); // Clear the image object on close
  };

  const showNextImage = () => {
    setCurrentLightboxImageIndex((prevIndex) => (prevIndex + 1) % imagesForGallery.length);
    // --- MODIFY: Call openLightbox to update caption --- 
    const nextIndex = (currentLightboxImageIndex + 1) % imagesForGallery.length;
    openLightbox(nextIndex); 
    // --- END MODIFY ---
  };

  const showPrevImage = () => {
    setCurrentLightboxImageIndex((prevIndex) => 
      (prevIndex - 1 + imagesForGallery.length) % imagesForGallery.length
    );
    // --- MODIFY: Call openLightbox to update caption --- 
    const prevIndex = (currentLightboxImageIndex - 1 + imagesForGallery.length) % imagesForGallery.length;
    openLightbox(prevIndex);
    // --- END MODIFY --- 
  };
  // --- End State and Functions --- 

  // --- ADD Copy Text Handler --- 
  const handleCopyText = (textToCopy, id) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log(`${id} copied to clipboard!`);
      setCopiedTextId(id);
      setTimeout(() => {
        setCopiedTextId(null);
      }, 1500); // Feedback disappears after 1.5 seconds
    }).catch(err => {
      console.error(`Failed to copy ${id}: `, err);
    });
  };
  // --- END ADD ---

  // --- ADD Paragraph splitting --- 
  const paragraphs = articleContent ? articleContent.split('\n\n') : [];

  // --- ADD Function to render markdown link --- 
  const renderMarkdownLink = (text) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      // Use Bilibili icon if URL matches
      if (linkUrl.includes('bilibili.com')) {
        parts.push(
          <span key={lastIndex} className={styles.iconLinkContainer}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink}>
              <svg className={styles.inlineIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/></g></svg>
              <span className={styles.inlineIconText}>{linkText}</span>
              <div className={styles.iconRipple}></div>
            </a>
          </span>
        );
      } else if (linkUrl.includes('github.com')) {
        parts.push(
          <span key={lastIndex} className={styles.iconLinkContainer}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink} aria-label={linkText}>
              <span className={styles.inlineIconSvgContainer}>
                <svg className={styles.inlineIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"></path>
                </svg>
              </span>
              <span className={styles.inlineIconText}>{linkText}</span>
              <div className={styles.iconRipple}></div>
            </a>
          </span>
        );
      } else {
        parts.push(
          <a key={lastIndex} href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
            {linkText}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // Wrap parts in a fragment
    return <React.Fragment>{parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}</React.Fragment>;
  };
  // --- END ADD ---

  return (
    <div className={styles.detailContainer}>
      {/* Back button removed, handled globally */}

      <h3 className={styles.detailTitle}>{title}</h3>
      
      {/* Top Section: Image + Description/Tags */}
      <div className={styles.detailContent}> 
          <div className={styles.detailImageContainer}>
              <div className={styles.detailImage} style={imageStyle}>
                 {!imageUrl && <span>Image not available</span>} 
                 <div className={styles.imageScanlineOverlay}></div> 
              </div>
          </div>

          <div className={styles.detailText}>
              <p className={styles.detailDescription}>{description}</p>
              
              {/* --- REMOVE Article Content Rendering from here --- */}
              {/* {articleContent && ( ... )} */}

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
      {/* --- End Top Section --- */}

      {/* --- MOVE Article Content Rendering HERE (Below Top Section) --- */}
      {articleContent && (
        <div className={styles.articleSection}>
          {paragraphs.map((paragraph, index) => {
            // --- ADD Image Insertion Logic for Personal Website --- 
            let imagesToRenderAfter = []; // Use array to hold multiple images
            // --- MODIFY: Pass paragraph to a new function --- 
            const renderParagraphContent = (paragraphText) => {
              const parts = [];
              let lastIndex = 0;
              // Regex to find Markdown links OR copyable text
              const combinedRegex = /(\[(.*?)\]\((.*?)\))|(play\.foacraft\.com)|(481423636)/g;
              let match;

              while ((match = combinedRegex.exec(paragraphText)) !== null) {
                // Text before the match
                if (match.index > lastIndex) {
                  parts.push(paragraphText.substring(lastIndex, match.index));
                }
                
                if (match[1]) { // Markdown link found (group 1)
                  const linkText = match[2];
                  const linkUrl = match[3];
                  if (linkUrl.includes('bilibili.com')) {
                    parts.push(
                      <span key={lastIndex} className={styles.iconLinkContainer}>
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink} aria-label={linkText}>
                          <span className={styles.inlineIconSvgContainer}>
                            <svg className={styles.inlineIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/></g></svg>
                          </span>
                          <span className={styles.inlineIconText}>{linkText}</span>
                          <div className={styles.iconRipple}></div>
                        </a>
                      </span>
                    );
                  } else if (linkUrl.includes('github.com')) {
                    parts.push(
                      <span key={lastIndex} className={styles.iconLinkContainer}>
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink} aria-label={linkText}>
                          <span className={styles.inlineIconSvgContainer}>
                            <svg className={styles.inlineIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"></path>
                            </svg>
                          </span>
                          <span className={styles.inlineIconText}>{linkText}</span>
                          <div className={styles.iconRipple}></div>
                        </a>
                      </span>
                    );
                  } else {
                    parts.push(
                      <a key={lastIndex} href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                        {linkText}
                      </a>
                    );
                  }
                } else if (match[4]) { // Server Address found (group 4)
                  const text = match[4];
                  const id = `copy-server-${index}`;
                  parts.push(
                    <span key={lastIndex} className={styles.copyableTextContainer}> {/* Container for positioning feedback */}
                      <button onClick={() => handleCopyText(text, id)} className={styles.copyableTextButton}>
                        {text}
                      </button>
                      {copiedTextId === id && <span className={styles.copyFeedback}>Copied!</span>}
                    </span>
                  );
                } else if (match[5]) { // QQ Number found (group 5)
                   const text = match[5];
                   const id = `copy-qq-${index}`;
                   parts.push(
                     <span key={lastIndex} className={styles.copyableTextContainer}>
                       <button onClick={() => handleCopyText(text, id)} className={styles.copyableTextButton}>
                         {text}
                       </button>
                       {copiedTextId === id && <span className={styles.copyFeedback}>Copied!</span>}
                     </span>
                   );
                }
                
                lastIndex = match.index + match[0].length;
              }

              // Text after the last match
              if (lastIndex < paragraphText.length) {
                parts.push(paragraphText.substring(lastIndex));
              }
              
              return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
            };
            // --- END MODIFY ---
            
            if (item.id === 7) { // Check if it's the website project (assuming id is 7)
               if (index === 1) { // After the second paragraph ("...做一个自己的网站。")
                 const wb0Index = imagesForGallery.findIndex(img => img.src === '/images/projects/web/wb0.jpg');
                 imagesToRenderAfter.push({ 
                   src: '/images/projects/web/wb0.jpg', 
                   caption: '以前的网站',
                   lightboxIndex: wb0Index, 
                   isLightboxClickable: wb0Index !== -1 
                 });
               } else if (index === 2) { // --- ADD: After the third paragraph ("...后话了。")
                 const wb5Index = imagesForGallery.findIndex(img => img.src === '/images/projects/web/wb5.png');
                 if (wb5Index !== -1) {
                   imagesToRenderAfter.push({ 
                     info: { ...imagesForGallery[wb5Index], caption: '一些小设定' }, 
                     lightboxIndex: wb5Index,
                     isLightboxClickable: true
                   });
                 }
               } else if (index === 3) { // --- MODIFY: After the fourth (now last) paragraph ("一些网站旧设") ---
                 const wb2Index = imagesForGallery.findIndex(img => img.src === '/images/projects/web/wb2.png');
                 if (wb2Index !== -1) {
                    imagesToRenderAfter.push({ 
                      info: { ...imagesForGallery[wb2Index], caption: '网站旧设' }, 
                      lightboxIndex: wb2Index,
                      isLightboxClickable: true
                    });
                 }
                 const wb4Index = imagesForGallery.findIndex(img => img.src === '/images/projects/web/wb4.png');
                 if (wb4Index !== -1) {
                    imagesToRenderAfter.push({ 
                      info: { ...imagesForGallery[wb4Index], caption: '网站旧设' }, 
                      lightboxIndex: wb4Index,
                      isLightboxClickable: true
                    });
                 }
               }
            }
            // --- END ADD ---
            return (
              <React.Fragment key={index}>
                <p>{renderParagraphContent(paragraph)}</p>
                {/* Render the specific images if conditions are met */}
                {imagesToRenderAfter.length > 0 && imagesToRenderAfter.map((imgData, imgIndex) => (
                   <figure 
                      key={`${index}-img-${imgIndex}`} 
                      className={`${styles.articleImageFigure} ${imgData.isLightboxClickable ? styles.clickableFigure : ''}`} 
                      onClick={imgData.isLightboxClickable ? () => openLightbox(imgData.lightboxIndex) : undefined}
                   >
                    <img 
                      src={imgData.info ? imgData.info.src : imgData.src} // Handle both formats
                      alt={imgData.info ? imgData.info.caption : imgData.caption} 
                      className={styles.articleImage}
                    />
                    {(imgData.info ? imgData.info.caption : imgData.caption) && 
                      <figcaption className={styles.articleImageCaption}>
                        {imgData.info ? imgData.info.caption : imgData.caption}
                      </figcaption>
                    }
                  </figure>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      )}
      {/* --- END MOVE --- */}

      {/* --- Add Related Images Section --- */}
      {imagesForGallery.length > 0 && (
        <div className={styles.relatedImagesSection}>
          <h4 className={styles.relatedImagesTitle}>相关图片</h4>
          <div className={styles.thumbnailGrid}>
            {imagesForGallery.map((img, index) => (
              <button 
                key={index} 
                className={styles.thumbnailButton} 
                onClick={() => openLightbox(index)} // <-- Add onClick handler
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

      {/* --- Render Lightbox --- */} 
      {isLightboxOpen && imagesForGallery.length > 0 && (
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

export default WorkDetailView; 