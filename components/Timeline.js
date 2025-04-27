import React from 'react';
import styles from './Timeline.module.scss'; // 我们将创建这个样式文件

const TimelineItem = ({ item, isLast }) => (
  <div className={styles.timelineItem}>
    <div className={styles.timelineDot}></div>
    {!isLast && <div className={styles.timelineLine}></div>}
    <div className={styles.timelineContent}>
      <span className={styles.timelineDate}>{item.date}</span>
      <h3 className={styles.timelineTitle}>{item.title}</h3>
      <p className={styles.timelineInstitution}>{item.institution}</p>
      {item.description && <p className={styles.timelineDescription}>{item.description}</p>}
    </div>
  </div>
);

const Timeline = ({ data }) => {
  return (
    <div className={styles.timelineContainer}>
      {data.map((item, index) => (
        <TimelineItem key={item.id} item={item} isLast={index === data.length - 1} />
      ))}
    </div>
  );
};

export default Timeline; 