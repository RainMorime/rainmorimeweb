import React from 'react';
import styles from './Timeline.module.scss'; // 我们将创建这个样式文件

// 单个时间线项目组件
const TimelineItem = ({ item, isLast }) => (
  <div className={styles.timelineItem}>
    <div className={styles.timelineDot}></div> {/* 时间点圆圈 */}
    {!isLast && <div className={styles.timelineLine}></div>} {/* 连接线 (非最后一项) */}
    <div className={styles.timelineContent}> {/* 内容区域 */}
      <span className={styles.timelineDate}>{item.date}</span> {/* 日期 */}
      <h3 className={styles.timelineTitle}>{item.title}</h3> {/* 标题 */}
      <p className={styles.timelineInstitution}>{item.institution}</p> {/* 机构/地点 */}
      {item.description && <p className={styles.timelineDescription}>{item.description}</p>} {/* 可选的描述 */}
    </div>
  </div>
);

// 时间线整体组件
const Timeline = ({ data }) => {
  return (
    <div className={styles.timelineContainer}>
      {/* 遍历数据并渲染每个时间线项目 */}
      {data.map((item, index) => (
        <TimelineItem key={item.id} item={item} isLast={index === data.length - 1} />
      ))}
    </div>
  );
};

export default Timeline; 