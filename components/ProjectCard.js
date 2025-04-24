import React from 'react';
import styles from '../styles/Home.module.scss'; // 复用 Home 的样式

const ProjectCard = ({ project }) => {
  const { title, description, tech, link, imageUrl } = project;

  return (
    <div className={styles.projectCard}>
      <div className={styles.cardBorderTopLeft}></div>
      <div className={styles.cardBorderBottomRight}></div>
      
      <div className={styles.projectImageContainer}>
        {/* 暂时用 div 做占位符，可以设置背景图 */}
        <div 
          className={styles.projectImagePlaceholder} 
          style={{ backgroundImage: `url(${imageUrl || '/placeholders/default.png'})` }}
        >
          <div className={styles.imageScanlineOverlay}></div> {/* 扫描线叠加 */}
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
        {link && link !== '#' && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.projectLink}
          >
            &gt; VIEW PROJECT_
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 