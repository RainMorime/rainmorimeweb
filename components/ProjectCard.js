import React from 'react';
import styles from '../styles/Home.module.scss'; // 复用 Home 页面的样式

const ProjectCard = ({ project, onClick }) => {
  const { title, description, tech, link, imageUrl } = project; // 解构项目数据

  // 设置图片背景样式 (如果提供了 imageUrl)
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  // 卡片点击处理函数
  const handleCardClick = (e) => {
    if (onClick) { // 如果提供了 onClick 回调，则执行它
      onClick(project, e);
    } else if (link && link !== '#') { // 否则，如果提供了有效链接，则在新标签页打开
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  // 判断卡片是否可点击 (提供了 onClick 回调或有效链接)
  const isClickable = !!onClick || (link && link !== '#');

  return (
    <div 
      className={`${styles.projectCard} ${isClickable ? styles.clickable : ''}`} // 根据是否可点击添加样式
      onClick={isClickable ? handleCardClick : undefined} // 绑定点击事件 (如果可点击)
      role={isClickable ? "button" : undefined} // 设置 ARIA role (如果可点击)
      tabIndex={isClickable ? 0 : undefined} // 使卡片可通过 Tab 键聚焦 (如果可点击)
      onKeyDown={isClickable ? (e) => { // 允许通过 Enter 或 Space 键触发点击 (如果可点击)
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e);
        }
      } : undefined}
    >
      {/* 卡片边框装饰 */}
      <div className={styles.cardBorderTopLeft}></div>
      <div className={styles.cardBorderBottomRight}></div>
      
      {/* 项目图片区域 */}
      <div className={styles.projectImageContainer}>
        <div className={styles.projectImagePlaceholder} style={imageStyle}>
          <div className={styles.imageScanlineOverlay}></div> {/* 图片扫描线效果 */}
        </div>
      </div>
      
      {/* 项目内容区域 */}
      <div className={styles.projectContent}>
        <h3 className={styles.projectTitle}>
          <span className={styles.titleBracket}>[</span>{title}<span className={styles.titleBracket}>]</span> {/* 标题，带方括号 */} 
        </h3>
        <p className={styles.projectDescription}>{description}</p> {/* 项目描述 */}
        <div className={styles.projectTech}> {/* 技术标签 */}
          {tech.map((item, index) => (
            <span key={index} className={styles.techTag}>{item}</span>
          ))}
        </div>
        {/* 如果没有提供 onClick 回调，但有有效链接，则显示一个直接的链接按钮 */}
        {!onClick && link && link !== '#' && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.projectLink}
            onClick={(e) => e.stopPropagation()} // 防止点击链接时触发卡片的 onClick
          >
            Visit
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 