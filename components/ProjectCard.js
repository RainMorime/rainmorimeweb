import React from 'react';
import styles from '../styles/Home.module.scss'; // 复用 Home 的样式

const ProjectCard = ({ project, onClick }) => {
  const { title, description, tech, link, imageUrl } = project;

  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(project, e);
    } else if (link && link !== '#') {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  const isClickable = !!onClick || (link && link !== '#');

  return (
    <div 
      className={`${styles.projectCard} ${isClickable ? styles.clickable : ''}`} 
      onClick={isClickable ? handleCardClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e);
        }
      } : undefined}
    >
      <div className={styles.cardBorderTopLeft}></div>
      <div className={styles.cardBorderBottomRight}></div>
      
      <div className={styles.projectImageContainer}>
        <div className={styles.projectImagePlaceholder} style={imageStyle}>
          <div className={styles.imageScanlineOverlay}></div>
        </div>
      </div>
      
      <div className={styles.projectContent}>
        <h3 className={styles.projectTitle}>
          <span className={styles.titleBracket}>[</span>{title}<span className={styles.titleBracket}>]</span>
        </h3>
        <p className={styles.projectDescription}>{description}</p>
        <div className={styles.projectTech}>
          {tech.map((item, index) => (
            <span key={index} className={styles.techTag}>{item}</span>
          ))}
        </div>
        {!onClick && link && link !== '#' && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.projectLink}
            onClick={(e) => e.stopPropagation()}
          >
            Visit
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 