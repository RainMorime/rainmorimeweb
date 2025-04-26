import React, { useState, useRef, useEffect } from 'react';
import styles from './MusicPlayer.module.scss';

// --- 修改: 终端风格的简洁线条图标 --- 
const PlayIcon = () => <svg viewBox="0 0 10 10" width="10" height="10"><polygon points="3,2 8,5 3,8" fill="currentColor" /></svg>;
const PauseIcon = () => <svg viewBox="0 0 10 10" width="10" height="10">
  <rect x="2" y="2" width="2" height="6" fill="currentColor" />
  <rect x="6" y="2" width="2" height="6" fill="currentColor" />
</svg>;
const PrevIcon = () => <svg viewBox="0 0 10 10" width="10" height="10">
  <rect x="2" y="2" width="1" height="6" fill="currentColor" />
  <polygon points="8,2 4,5 8,8" fill="currentColor" />
</svg>;
const NextIcon = () => <svg viewBox="0 0 10 10" width="10" height="10">
  <polygon points="2,2 6,5 2,8" fill="currentColor" />
  <rect x="7" y="2" width="1" height="6" fill="currentColor" />
</svg>;

// --- 修改: 播放列表数据 --- 
const playlist = [
  {
    title: "Going home",
    artist: "Kenny G",
    src: "/music/Kenny G - Going home.mp3"
  },
  {
    title: "Mice on Venus",
    artist: "C418",
    src: "/music/C418 - Mice on Venus.flac"
  },
  {
    title: "Sweden",
    artist: "C418",
    src: "/music/C418 - Sweden.flac"
  }
];

const MusicPlayer = ({ powerLevel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef(null);
  // --- 修改: 使用播放列表索引 --- 
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  // --- 新增: 播放列表可见状态 --- 
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false); 

  // --- 新增: 判断是否满电 --- 
  const isFullPower = powerLevel === 100;

  const currentTrack = playlist[currentTrackIndex]; // 获取当前歌曲信息

  // --- 修改: 显示标题和艺术家 --- 
  const displayTitle = `${currentTrack.title} - ${currentTrack.artist}`;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    // 关闭抽屉时也隐藏播放列表
    if (isOpen) {
        setIsPlaylistVisible(false); 
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) {
      console.error('Audio Ref not found!');
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      // --- 简化播放逻辑：直接播放 --- 
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error attempting to play audio:", error);
          // 确保状态同步，即使播放失败
          setIsPlaying(false); 
        });
      }
    }
    // 注意: isPlaying 状态由 audio 元素的 play/pause 事件监听器自动更新
  };

  // --- 修改: 上一首 --- 
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + playlist.length) % playlist.length;
      return newIndex;
    });
  };

  // --- 修改: 下一首 --- 
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % playlist.length;
      return newIndex;
    });
  };
  
  // --- 新增: 选择歌曲 --- 
  const selectTrack = (index) => {
    if (index !== currentTrackIndex) {
      setCurrentTrackIndex(index);
    } else {
      // 如果点击的是当前歌曲，则切换播放/暂停状态
      togglePlay(new Event('synthetic')); // 创建一个合成事件
    }
  };

  // --- 新增: 切换播放列表可见性 --- 
  const togglePlaylist = () => {
    setIsPlaylistVisible(!isPlaylistVisible);
  };

  // --- 修改: 监听歌曲索引变化，自动加载并播放 --- 
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      // 如果之前是播放状态，则自动播放新歌曲
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
             console.error("Error auto-playing next/prev track:", error);
             setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIndex]); // 依赖 currentTrackIndex

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      if (progressBarRef.current && duration > 0) {
        const progress = (audio.currentTime / duration) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    };

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime); // 加载后更新一次时间
    };

    const setAudioPlaying = () => setIsPlaying(true);
    const setAudioPaused = () => setIsPlaying(false);
    const handleEnded = () => {
        // 播放结束后自动播放下一首
        handleNext(new Event('synthetic'));
        // 确保下一首会自动播放 (如果之前是播放状态)
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Error playing next track after ended:", error);
                    setIsPlaying(false); 
                });
            }
        }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('play', setAudioPlaying);
    audio.addEventListener('pause', setAudioPaused);
    audio.addEventListener('ended', handleEnded);

    // --- 修改: 清理函数也要更新 --- 
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('play', setAudioPlaying);
      audio.removeEventListener('pause', setAudioPaused);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration, currentTrackIndex]); // --- 修改: 添加 currentTrackIndex 作为依赖 --- 

  return (
    <div className={`${styles.playerContainer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.handle} onClick={toggleDrawer}>
        <div className={styles.handleLine}></div>
        <div className={styles.handleLine}></div>
        <div className={styles.handleLine}></div>
      </div>
      {/* --- 修改: 将 audio 元素移到外面，避免 playerContent 隐藏时无法访问 --- */}
      <audio ref={audioRef} preload="metadata"></audio> 

      {/* --- 修改: 黑胶唱片机制容器 --- */}
      <div className={styles.vinylMechanismContainer}>
        <div className={styles.vinylPlatter}>
          <div className={`${styles.vinylRecord} ${isPlaying ? styles.recordSpinning : ''}`}>
            <div className={styles.vinylLabel}></div>
          </div>
        </div>
        {/* 修改唱臂，添加提示和更流畅的交互 */}
        <div 
          className={`
            ${styles.tonearm} 
            ${isPlaying ? styles.tonearmPlaying : ''} 
            ${!isFullPower ? styles.tonearmLowPower : ''} // 添加低电量样式
          `}
          onClick={togglePlay}
          style={{ 
            cursor: 'pointer',
            // --- 修改: 仅在满电时显示悬浮光晕 --- 
            boxShadow: isPlaying && isFullPower ? '0 0 5px rgba(var(--ark-primary-rgb), 0.3)' : 'none'
          }}
          title={isPlaying ? "暂停音乐" : "播放音乐"}
        />
      </div>

      <div className={styles.playerContent}>
        {/* --- 修改: 包裹歌曲信息和按钮 --- */}
        <div className={styles.trackInfoContainer}>
          <div className={styles.trackInfo}>
            <div className={styles.trackTitle}>{displayTitle}</div>
          </div>
          {/* --- 修改: 根据电量添加条件 className --- */}
          <button 
            className={`
              ${styles.playlistToggleButton} 
              ${!isFullPower ? styles.toggleButtonLowPower : ''} // 添加低电量样式
            `}
            onClick={togglePlaylist}
            title={isPlaylistVisible ? "收起列表" : "展开列表"}
          >
            <span className={styles.toggleButtonLine}></span>
            <span className={styles.toggleButtonLine}></span>
            <span className={styles.toggleButtonLine}></span>
          </button>
        </div>
        <div className={styles.progressBarContainer}>
          <div ref={progressBarRef} className={styles.progressBar}></div>
        </div>
      </div>
      {/* --- 修改: 根据状态添加 visible 类 --- */}
      <div className={`${styles.playlistContainer} ${isPlaylistVisible ? styles.visible : ''}`}>
        {playlist.map((track, index) => (
          <div 
            key={index} 
            className={`${styles.playlistItem} ${index === currentTrackIndex ? styles.activePlaylistItem : ''}`}
            onClick={() => selectTrack(index)} // 添加点击事件
          >
            <span className={styles.playlistItemTitle}>{track.title}</span>
            <span className={styles.playlistItemArtist}>{track.artist}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer; 