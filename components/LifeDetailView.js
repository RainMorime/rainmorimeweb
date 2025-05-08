import React, { useState, useEffect } from 'react';
import styles from '../styles/LifeDetailView.module.scss';
import Lightbox from './Lightbox';

const LifeDetailView = ({ item }) => {
  if (!item) return null; // 如果没有选中项，则不渲染

  const { title, description, tech, imageUrl, articleContent, galleryImages } = item;
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}; // 主图背景样式

  // 根据双换行符分割文章内容为段落
  const paragraphs = articleContent ? articleContent.split('\n\n') : [];
  
  // 确定用于画廊和灯箱的图片数据源
  // 优先使用 item.galleryImages，否则根据 item.id 提供备用图片 (例如 Minecraft)
  const imagesForGallery = galleryImages && galleryImages.length > 0 
    ? galleryImages 
    : (item.id === 'mc' ? [
        { src: '/pictures/Minecraft/MC2024.png', caption: 'MC大家庭2024合照' },
        { src: '/pictures/Minecraft/MC2.png'},
        { src: '/pictures/Minecraft/yh.jpg', caption: '营火服务器图标' },
        { src: '/pictures/Minecraft/MC2025.png', caption: 'MC大家庭2025合照' }
      ] : []); // 若无特定画廊数据或备用数据，则默认为空数组

  // 灯箱状态管理
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // 灯箱是否打开
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0); // 当前灯箱图片索引
  const [lightboxImageObject, setLightboxImageObject] = useState(null); // 传递给灯箱的图片对象 (包含动态标题)

  // 获取特定图片在特定 Life Item (如 WA, physical-games, qinghai) 中的动态图片说明
  const getDynamicCaption = (imageSrc) => {
    if (item.id === 'wa') { // 白色相簿 (WA)
      switch (imageSrc) {
        case '/pictures/WHITE_ALBUM/w15.jpg': return '理奈放弃自己的偶像事业后与冬弥来到海边';
        case '/pictures/WHITE_ALBUM/w18.jpg': return '小夜子和冬弥相互依偎';
        case '/pictures/WHITE_ALBUM/w16.jpg': return '遥';
        case '/pictures/WHITE_ALBUM/w20.jpg': return '弥生';
        case '/pictures/WHITE_ALBUM/w3.jpg': return '小夜子名场面';
        case '/pictures/WHITE_ALBUM/w12.jpg': return '理奈和由绮的争执';
        default: return null;
      }
    } else if (item.id === 'physical-games') { // 实体游戏收藏
      if (imageSrc === '/pictures/collection/SC13.jpg') return 'Minecraft黑胶唱片';
      if (imageSrc === '/pictures/collection/SC7.jpg') return '《樱之诗》实体版';
    } else if (item.id === 'qinghai') { // 青海旅行
      if (imageSrc === '/images/travel/qinghai/QH5.jpg') return '凌晨的坎布拉';
      if (imageSrc === '/images/travel/qinghai/QH6.jpg') return '我俩在黑夜打着手电筒交替前行';
      if (imageSrc === '/images/travel/qinghai/QH12.jpg') return '青海湖';
      if (imageSrc === '/images/travel/qinghai/QH18.jpg') return '落日下的茶卡盐湖';
      if (imageSrc === '/images/travel/qinghai/QH36.jpg') return '岗什卡脚下的信号塔';
      if (imageSrc === '/images/travel/qinghai/QH40.jpg') return '风雪中的岗什卡';
    }
    return null;
  };

  // 打开灯箱
  const openLightbox = (index) => {
    if (index >= 0 && index < imagesForGallery.length) {
      const baseImage = imagesForGallery[index];
      const dynamicCaption = getDynamicCaption(baseImage.src); // 获取动态图片说明
      
      const imageForLightbox = { 
        ...baseImage, 
        caption: dynamicCaption || baseImage.caption // 优先使用动态说明
      };
      
      setCurrentLightboxImageIndex(index);
      setLightboxImageObject(imageForLightbox); // 设置包含正确说明的图片对象
      setIsLightboxOpen(true);
    }
  };

  // 关闭灯箱
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImageObject(null); // 清除灯箱图片对象
  };

  // 显示下一张灯箱图片 (重新调用 openLightbox 以确保获取正确的动态说明)
  const showNextImage = () => {
    const nextIndex = (currentLightboxImageIndex + 1) % imagesForGallery.length;
    openLightbox(nextIndex);
  };

  // 显示上一张灯箱图片 (同上)
  const showPrevImage = () => {
    const prevIndex = (currentLightboxImageIndex - 1 + imagesForGallery.length) % imagesForGallery.length;
    openLightbox(prevIndex);
  };

  return (
    <div className={styles.detailContainer}>
      {/* 返回按钮 (已移除) 
      <button className={styles.backButton} onClick={onBack}>
        ← BACK
      </button>
      */}

      <h3 className={styles.detailTitle}>{title}</h3>
      
      <div className={styles.detailContent}>
          <div className={styles.detailImageContainer}>
              <div className={styles.detailImage} style={imageStyle}>
                 {!imageUrl && <span>Image not available</span>} {/* 无主图时显示占位文本 */}
                 <div className={styles.imageScanlineOverlay}></div> {/* 图片扫描线覆盖层 */}
              </div>
          </div>

          <div className={styles.detailText}>
              <p className={styles.detailDescription}>{description}</p>
              
              {/* 渲染文章内容，并在段落间插入图片/链接 */}
              {articleContent && (
                <div className={styles.articleSection}>
                  {paragraphs.map((paragraph, index) => {
                    let imagesToRenderAfter = []; // 存储在此段落后渲染的图片或链接对象

                    // --- 特定 Life Item 的图片/链接插入逻辑 ---
                    // 根据 item.id 和段落索引 (index) 决定插入哪些内容
                    
                    // 怪物猎人 (mh)
                    if (item.id === 'mh') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const mh4Index = imagesForGallery.findIndex(img => img.src === '/pictures/Monster_Hunter/MH4.jpg');
                        if (mh4Index !== -1) imagesToRenderAfter.push({ info: imagesForGallery[mh4Index], lightboxIndex: mh4Index });
                        imagesToRenderAfter.push('separator'); // 分隔符，用于后续渲染链接列表
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1n5aTebESo', text: '鏖战冰牙龙' });
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1uNapeDEcS', text: '初见冰呪龙' });
                      }
                    } 
                    // Minecraft (mc)
                    else if (item.id === 'mc') { 
                      if (imagesForGallery[index]) { // 每个段落后尝试插入对应索引的图片
                         imagesToRenderAfter.push({ info: imagesForGallery[index], lightboxIndex: index });
                      }
                      if (index === paragraphs.length - 1) { // 最后一段后加链接
                          imagesToRenderAfter.push('separator'); 
                          imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV13G411D7Gq', text: '营火服务器实况' });
                          imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1ce411D7dG', text: '营火高级幻岛' });
                      }
                    } 
                    // 吉林 (jilin)
                    else if (item.id === 'jilin') {
                      if (index === 3) { // 第4段后
                        const jilin1Index = imagesForGallery.findIndex(img => img.src === '/images/travel/jilin/JL1.jpg');
                        if (jilin1Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[jilin1Index], caption: '高考结束那天，黑云分界线如刀切一般，太阳也正展现着它的曙光' }, lightboxIndex: jilin1Index });
                      } else if (index === 4) { // 第5段后
                        const jilin5Index = imagesForGallery.findIndex(img => img.src === '/images/travel/jilin/JL5.jpg');
                        if (jilin5Index !== -1) imagesToRenderAfter.push({ info: imagesForGallery[jilin5Index], lightboxIndex: jilin5Index });
                      }
                    }
                    // 青海 (qinghai)
                    else if (item.id === 'qinghai') {
                      let targetImageSrc = null, targetCaption = null, isRow = false;
                      let secondTargetImageSrc = null, secondTargetCaption = null;
                      let multipleImages = [];

                      if (index === 1) { // 第2段后 (图片行)
                        isRow = true;
                        targetImageSrc = '/images/travel/qinghai/QH5.jpg'; targetCaption = '凌晨的坎布拉';
                        secondTargetImageSrc = '/images/travel/qinghai/QH6.jpg'; secondTargetCaption = '我俩在黑夜打着手电筒交替前行';
                      } else if (index === 4) { // 第5段 (最后一段) 后 (多图堆叠)
                        multipleImages = [
                          { src: '/images/travel/qinghai/QH12.jpg', caption: '青海湖' },
                          { src: '/images/travel/qinghai/QH18.jpg', caption: '落日下的茶卡盐湖' },
                          { src: '/images/travel/qinghai/QH36.jpg', caption: '岗什卡脚下的信号塔' },
                          { src: '/images/travel/qinghai/QH40.jpg', caption: '风雪中的岗什卡' },
                        ];
                      }

                      if (targetImageSrc) {
                        const imgIndex = imagesForGallery.findIndex(img => img.src === targetImageSrc);
                        if (imgIndex !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption: targetCaption }, lightboxIndex: imgIndex });
                      }
                      if (isRow && secondTargetImageSrc) {
                        const secondImgIndex = imagesForGallery.findIndex(img => img.src === secondTargetImageSrc);
                        if (secondImgIndex !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[secondImgIndex], caption: secondTargetCaption }, lightboxIndex: secondImgIndex });
                      }
                      if (multipleImages.length > 0) {
                        multipleImages.forEach(imgInfo => {
                          const imgIndex = imagesForGallery.findIndex(img => img.src === imgInfo.src);
                          if (imgIndex !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[imgIndex], caption: imgInfo.caption }, lightboxIndex: imgIndex });
                        });
                      }
                    }
                    // 韩国 (korea)
                    else if (item.id === 'korea') {
                      if (index === 1) { // 第2段后
                        const hg3Index = imagesForGallery.findIndex(img => img.src === '/images/travel/hanguo/HG3.jpg');
                        if (hg3Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[hg3Index], caption: '我和父母一起吃烤肉' }, lightboxIndex: hg3Index });
                      }
                    }
                    // 东方凭依华 (thif)
                    else if (item.id === 'thif') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const cg1Index = imagesForGallery.findIndex(img => img.src === '/pictures/Touhou/CG1.png');
                        if (cg1Index !== -1) imagesToRenderAfter.push({ info: imagesForGallery[cg1Index], lightboxIndex: cg1Index });
                      }
                    }
                    // 黑神话：悟空 (bmwk)
                    else if (item.id === 'bmwk') { 
                      if (index === paragraphs.length - 1) { // 最后一段后
                        imagesToRenderAfter.push('separator');
                        imagesToRenderAfter.push({ type: 'link', href: 'https://www.bilibili.com/video/BV1bKtXeoET6', text: '实体版开箱' });
                      }
                    }
                    // 泰坦陨落 (titanfall)
                    else if (item.id === 'titanfall') {
                      if (index === paragraphs.length - 1) { // 最后一段后
                        const imgIndex = imagesForGallery.findIndex(img => img.src === '/pictures/Titalfall/titan4.jpg');
                        if (imgIndex !== -1) imagesToRenderAfter.push({ info: imagesForGallery[imgIndex], lightboxIndex: imgIndex });
                      }
                    }
                    // 实体游戏收藏 (physical-games)
                    else if (item.id === 'physical-games') {
                      if (index === 1) { // 第2段后
                        const sc13Index = imagesForGallery.findIndex(img => img.src === '/pictures/collection/SC13.jpg');
                        if (sc13Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[sc13Index], caption: 'Minecraft黑胶唱片' }, lightboxIndex: sc13Index });
                      } else if (index === paragraphs.length - 1) { // 最后一段后
                        const sc7Index = imagesForGallery.findIndex(img => img.src === '/pictures/collection/SC7.jpg');
                        if (sc7Index !== -1) imagesToRenderAfter.push({ info: { ...imagesForGallery[sc7Index], caption: '《樱之诗》实体版' }, lightboxIndex: sc7Index });
                      }
                    }
                    // 白色相簿 (wa)
                    else if (item.id === 'wa') {
                      let targetImageSrc = null, targetCaption = null, isRow = false;
                      let secondTargetImageSrc = null, secondTargetCaption = null;

                      if (index === 0) { // 第1段后
                        targetImageSrc = '/pictures/WHITE_ALBUM/w1.jpg';
                      } else if (index === 3) { // 第4段后
                        targetImageSrc = '/pictures/WHITE_ALBUM/w15.jpg'; targetCaption = '理奈放弃自己的偶像事业后与冬弥来到海边';
                      } else if (index === 5) { // 第6段后
                        targetImageSrc = '/pictures/WHITE_ALBUM/w18.jpg'; targetCaption = '小夜子和冬弥相互依偎';
                      } else if (index === 6) { // 第7段后 (图片行)
                        isRow = true;
                        targetImageSrc = '/pictures/WHITE_ALBUM/w16.jpg'; targetCaption = '遥';
                        secondTargetImageSrc = '/pictures/WHITE_ALBUM/w20.jpg'; secondTargetCaption = '弥生';
                      } else if (index === 8) { // 第9段后
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
                           const caption = secondTargetCaption || imagesForGallery[secondImgIndex].caption;
                           imagesToRenderAfter.push({ info: { ...imagesForGallery[secondImgIndex], caption }, lightboxIndex: secondImgIndex });
                         }
                      }
                    }
                    // --- 结束特定 Life Item 逻辑 ---
                    
                    const isStrayQuote = item.id === 'stray' && paragraph.includes('——《我是猫》，夏目漱石'); // Stray 项目的特殊引用块处理

                    return (
                      <React.Fragment key={index}>
                        {/* 渲染段落文本或引用块 */}
                        {isStrayQuote ? (
                          <blockquote key={`${index}-text`} className={styles.articleBlockquote}>
                            {paragraph.split('\n').map((line, lineIndex) => <span key={lineIndex} style={{ display: 'block' }}>{line}</span>)}
                          </blockquote>
                        ) : (
                          <p key={`${index}-text`}>{paragraph}</p>
                        )}

                        {/* 在段落后渲染图片和链接 */}
                        {imagesToRenderAfter.length > 0 && (
                          <>
                            {/* 渲染图片行 (若适用) */}
                            {(item.id === 'wa' && index === 6 || item.id === 'qinghai' && index === 1) && 
                             imagesToRenderAfter.every(i => typeof i === 'object' && i.info) && imagesToRenderAfter.length === 2 && (
                              <div className={styles.inlineImageRow} key={`${index}-img-row`}> 
                                {imagesToRenderAfter.map(({ info, lightboxIndex }) => (
                                  <figure key={info.src} className={`${styles.articleImageFigure} ${styles.clickableFigure} ${styles.rowFigure}`} onClick={() => openLightbox(lightboxIndex)}>
                                    <img src={info.src} alt={info.caption || `${title} illustration`} className={styles.articleImage}/>
                                    {info.caption && <figcaption className={styles.articleImageCaption}>{info.caption}</figcaption>}
                                  </figure>
                                ))}
                              </div>
                            )}

                            {/* 渲染堆叠图片 (排除已在行中渲染的) */}
                            {imagesToRenderAfter
                              .filter(renderItem => typeof renderItem === 'object' && renderItem.info && 
                                     !(item.id === 'wa' && index === 6 || item.id === 'qinghai' && index === 1))
                              .map(({ info, lightboxIndex }, itemIndex) => (
                                <figure key={info.src || `${index}-img-${itemIndex}`} className={`${styles.articleImageFigure} ${styles.clickableFigure}`} onClick={() => openLightbox(lightboxIndex)}>
                                  <img src={info.src} alt={info.caption || `${title} illustration`} className={styles.articleImage}/>
                                  {info.caption && <figcaption className={styles.articleImageCaption}>{info.caption}</figcaption>}
                                </figure>
                              ))}
                            
                            {/* 如果存在分隔符 'separator', 则渲染链接列表 */}
                            {imagesToRenderAfter.includes('separator') && (
                              <div className={styles.articleLinkList} key={`${index}-link-list`}>
                                {imagesToRenderAfter
                                  .filter(renderItem => typeof renderItem === 'object' && renderItem.type === 'link')
                                  .map(linkItem => (
                                    <div key={linkItem.href} className={styles.articleLinkItem}>
                                      {linkItem.href.includes('bilibili.com') ? ( // Bilibili 链接特殊处理 (带图标和波纹)
                                        <span className={styles.iconLinkContainer}> 
                                          <a href={linkItem.href} target="_blank" rel="noopener noreferrer" className={styles.inlineIconLink} aria-label={linkItem.text}>
                                            <span className={styles.inlineIconSvgContainer}> {/* SVG 图标容器 */} 
                                              <svg className={styles.inlineIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/></g></svg>
                                            </span>
                                            <span className={styles.inlineIconText}>{linkItem.text}</span> {/* 链接文本在 a 标签内 */}
                                            <div className={styles.iconRipple}></div> {/* 点击波纹效果 */}
                                          </a>
                                        </span>
                                      ) : (
                                        <a href={linkItem.href} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>{linkItem.text}</a> // 普通链接
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </> 
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* 相关图片缩略图展示区域 */}
              {imagesForGallery.length > 0 && (
                <div className={styles.relatedImagesSection}>
                  <h4 className={styles.relatedImagesTitle}>图片</h4>
                  <div className={styles.thumbnailGrid}>
                    {imagesForGallery.map((img, index) => (
                      <button 
                        key={index} 
                        className={styles.thumbnailButton} 
                        onClick={() => openLightbox(index)} // 点击打开灯箱
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

              {/* 技术标签展示区域 */}
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

      {/* 灯箱组件 (当 isLightboxOpen 为 true 且有图片对象时渲染) */}
      {isLightboxOpen && lightboxImageObject && (
        <Lightbox 
          image={lightboxImageObject} // 传递包含正确标题的图片对象
          onClose={closeLightbox} // 关闭回调
          onNext={imagesForGallery.length > 1 ? showNextImage : null} // 下一张回调 (多于一张图时可用)
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null} // 上一张回调 (同上)
        />
      )}

    </div>
  );
};

export default LifeDetailView; 