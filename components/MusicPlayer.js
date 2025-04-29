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
  },
  {
    title: "Old Memory",
    artist: "市川淳",
    src: "/music/市川淳 - Old Memory.flac"
  },
  {
    title: "ヨスガノソラ メインテーマ -記憶-",
    artist: "市川淳",
    src: "/music/市川淳 - ヨスガノソラ メインテーマ -記憶-.flac"
  },
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    src: "/music/Pink Floyd - The Dark Side of the Moon.flac"
  }
];

const DRAG_THRESHOLD = 50; // 拖动多少像素触发切换

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

  // --- 新增: 拖动状态 ---
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0); // 当前唱片的偏移
  const [incomingTrackIndex, setIncomingTrackIndex] = useState(-1); // 即将播放的歌曲索引，-1表示无
  const [incomingTrackOffsetX, setIncomingTrackOffsetX] = useState(0); // 即将进入唱片的偏移
  const vinylContainerRef = useRef(null);
  const dragCurrentXRef = useRef(0); // 新增 Ref 存储实时 X 坐标
  const handleRef = useRef(null); // 新增 Ref 引用 handle 元素
  const animationTimeouts = useRef([]); // 新增 Ref 存储 setTimeout ID

  const currentTrack = playlist[currentTrackIndex]; // 获取当前歌曲信息
  // --- 新增: 获取下一个和上一个歌曲的信息 (用于拖动显示) ---
  const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
  const prevTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  const incomingTrack = playlist[incomingTrackIndex] ?? null;

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

  // --- 修改: 上一首 (现在由 handleDragEnd 触发) --- 
  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + playlist.length) % playlist.length;
      return newIndex;
    });
  };

  // --- 修改: 下一首 (现在由 handleDragEnd 触发) --- 
  const handleNext = () => {
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

  // --- 新增: 拖动处理函数 ---
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // 只响应左键
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    // 移除平滑过渡，以便实时跟踪鼠标
    if (vinylContainerRef.current) {
      vinylContainerRef.current.querySelectorAll(`.${styles.vinylRecord}`).forEach(el => {
        el.style.transition = 'none';
      });
    }
    // 阻止默认的拖动行为，如图片拖动
    e.preventDefault(); 
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    // setDragCurrentX(currentX); // 仍然更新状态以便其他地方可能需要
    dragCurrentXRef.current = currentX; // 实时更新 Ref

    const offsetX = currentX - dragStartX;
    setDragOffsetX(offsetX);

    // 计算即将进入的唱片
    if (offsetX > DRAG_THRESHOLD / 2) { // 向右拖动 (显示上一首)
      setIncomingTrackIndex(prevTrackIndex);
      // 让即将进入的唱片从左侧滑入，偏移量与当前唱片相反但稍小
      setIncomingTrackOffsetX(offsetX - (vinylContainerRef.current?.offsetWidth || 200)); 
    } else if (offsetX < -DRAG_THRESHOLD / 2) { // 向左拖动 (显示下一首)
      setIncomingTrackIndex(nextTrackIndex);
      // 让即将进入的唱片从右侧滑入
      setIncomingTrackOffsetX(offsetX + (vinylContainerRef.current?.offsetWidth || 200)); 
    } else {
      setIncomingTrackIndex(-1);
      setIncomingTrackOffsetX(0);
    }
  };

  const handleMouseUpOrLeave = (e) => {
    if (!isDragging) return;

    // 使用 Ref 计算最终偏移量
    const finalOffsetX = dragCurrentXRef.current - dragStartX;

    setIsDragging(false);

    if (Math.abs(finalOffsetX) > DRAG_THRESHOLD) {
      if (finalOffsetX > 0) {
        // 向右拖动超过阈值，切换到上一首
        handlePrev();
        // 让当前唱片完全滑出右侧，即将进入的唱片滑到中间
        setDragOffsetX(vinylContainerRef.current?.offsetWidth || 200);
        setIncomingTrackOffsetX(0);
      } else {
        // 向左拖动超过阈值，切换到下一首
        handleNext();
        // 让当前唱片完全滑出左侧，即将进入的唱片滑到中间
        setDragOffsetX(-(vinylContainerRef.current?.offsetWidth || 200));
        setIncomingTrackOffsetX(0);
      }
      // 切换后短暂延迟重置偏移量，等待动画结束
      setTimeout(() => {
        setDragOffsetX(0);
        setIncomingTrackIndex(-1);
      }, 300); // 匹配过渡时间
    } else {
      // 未超过阈值，弹回原位
      setDragOffsetX(0);
      setIncomingTrackIndex(-1);
    }

    // 重置起始点和 Ref
    setDragStartX(0);
    setDragCurrentX(0); // 保持状态重置
    dragCurrentXRef.current = 0; // 重置 Ref
  };

  // --- 新增: 绑定全局事件监听器以处理鼠标移出容器的情况 ---
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUpOrLeave);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    };
  }, [isDragging, dragStartX]); // 添加依赖

  // --- 修改: 监听歌曲索引变化，自动加载并播放 --- 
  useEffect(() => {
    if (audioRef.current && playlist[currentTrackIndex]) { // Check if index is valid
      const newSrc = playlist[currentTrackIndex].src;

      // Only change source if it's different
      // Compare full URL pathnames to be safe
      const currentFullSrc = audioRef.current.src ? new URL(audioRef.current.src).pathname : null;
      const newFullSrcPath = new URL(newSrc, window.location.origin).pathname; // Resolve relative path

      if (currentFullSrc !== newFullSrcPath) { 
          audioRef.current.src = newSrc;
          audioRef.current.load(); // Explicitly load the new source

          // Determine if playback should start automatically
          const shouldPlay = isPlaying; // Capture isPlaying state *before* potential async ops

          if (shouldPlay) {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                  playPromise.then(() => {
                  }).catch(error => {
                    console.error("[TrackChange] Error auto-playing track:", error);
                    // If autoplay fails, ensure the state reflects paused
                    setIsPlaying(false);
                  });
              }
          }
      }

    } else {
        console.warn(`[TrackChange] Audio ref or track index ${currentTrackIndex} invalid.`);
    }
  }, [currentTrackIndex]); // Keep only currentTrackIndex dependency

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
        // Playback finished, go to the next song index first
        // We call handleNext to update the index state correctly
        handleNext(); 

        // Then, directly try to play. This might be more reliable after 'ended'.
        // Note: handleNext already updated currentTrackIndex, so useEffect will also run
        // to load the correct source, but we attempt play here just in case.
        // A short delay might help ensure the source is loaded by the useEffect before playing
        setTimeout(() => {
            if (audioRef.current && !audioRef.current.paused) {
            } else if (audioRef.current) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setIsPlaying(true); // Ensure state is correct
                    }).catch(error => {
                        console.error("[handleEnded] Error directly playing next track after ended:", error);
                        // If direct play fails, ensure state is paused
                        setIsPlaying(false); 
                    });
                }
            }
        }, 50); // Small delay
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
  }, [duration]); // Keep duration dependency for now

  // --- 新增: 处理动画迭代和随机延迟 --- 
  useEffect(() => {
    const handleElement = handleRef.current;
    if (!handleElement) return;

    const bars = handleElement.querySelectorAll(`.${styles.handleBar}`);

    const handleAnimationIteration = (event) => {
        const bar = event.target;
        // 暂停动画
        bar.style.animationPlayState = 'paused';
        // 清除可能存在的旧 timeout
        const existingTimeoutIndex = animationTimeouts.current.findIndex(t => t.element === bar);
        if (existingTimeoutIndex > -1) {
            clearTimeout(animationTimeouts.current[existingTimeoutIndex].id);
            animationTimeouts.current.splice(existingTimeoutIndex, 1);
        }
        // 计算随机延迟 (300ms - 1200ms)
        const randomDelay = Math.random() * 900 + 300;
        // 设置 timeout 恢复动画
        const timeoutId = setTimeout(() => {
            bar.style.animationPlayState = 'running';
            // 从 timeouts ref 中移除
            const indexToRemove = animationTimeouts.current.findIndex(t => t.element === bar);
            if (indexToRemove > -1) {
                animationTimeouts.current.splice(indexToRemove, 1);
            }
        }, randomDelay);
        // 存储 timeout ID 和对应的元素
        animationTimeouts.current.push({ id: timeoutId, element: bar });
    };

    if (isPlaying) {
        bars.forEach(bar => {
            // 确保初始状态是 running
            bar.style.animationPlayState = 'running';
            bar.addEventListener('animationiteration', handleAnimationIteration);
        });
    } else {
        // 清除所有 timeouts
        animationTimeouts.current.forEach(t => clearTimeout(t.id));
        animationTimeouts.current = [];
        // 移除监听器并重置状态
        bars.forEach(bar => {
            bar.removeEventListener('animationiteration', handleAnimationIteration);
            // 重置样式，避免下次播放时状态不对
            bar.style.animationPlayState = ''; 
        });
    }

    // 清理函数
    return () => {
        // 清除所有 timeouts
        animationTimeouts.current.forEach(t => clearTimeout(t.id));
        animationTimeouts.current = [];
        // 移除所有监听器
        if (handleElement) {
             const currentBars = handleElement.querySelectorAll(`.${styles.handleBar}`);
             currentBars.forEach(bar => {
                 bar.removeEventListener('animationiteration', handleAnimationIteration);
                 bar.style.animationPlayState = ''; // 确保清理
             });
        }
    };
  }, [isPlaying]); // 依赖 isPlaying 状态

  return (
    <div className={`${styles.playerContainer} ${isOpen ? styles.open : ''}`}>
      {/* 修改: 调整类名逻辑，添加 Bars 容器 */}
      <div 
        ref={handleRef} 
        className={`
          ${styles.handle} 
          ${!isOpen && isPlaying ? styles.expanded : ''} 
          ${isPlaying ? styles.playing : ''} // 只要播放就应用 playing
        `}
        onClick={toggleDrawer}
      >
        {/* 线条容器 */}
        <div className={styles.handleBarsContainer}>
          <div className={styles.handleBar}></div>
          <div className={styles.handleBar}></div>
          <div className={styles.handleBar}></div>
          <div className={styles.handleBar}></div>
          <div className={styles.handleBar}></div>
          <div className={styles.handleBar}></div>
          <div className={styles.handleBar}></div>
        </div>

        {/* 条件渲染: 仅在收起且播放时显示歌曲信息 */}
        {!isOpen && isPlaying && (
          <div className={styles.handleTrackInfo}>
            <div className={styles.handleTrackTitle}>
              {(currentTrack?.title || '').split('').map((char, index) => (
                <span key={`title-${index}`} className={styles.charItem}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* --- 修改: 将 audio 元素移到外面，避免 playerContent 隐藏时无法访问 --- */}
      <audio ref={audioRef} preload="metadata"></audio> 

      {/* --- 修改: 黑胶唱片机制容器，添加拖动事件监听 --- */}
      <div 
        ref={vinylContainerRef}
        className={styles.vinylMechanismContainer}
        onMouseDown={handleMouseDown}
        // onMouseLeave={handleMouseUpOrLeave} // 改用全局监听 mouseup
      >
        <div className={styles.vinylPlatter}>
          {/* 当前播放的唱片 */}
          <div 
            className={`
              ${styles.vinylRecord} 
              ${isPlaying ? styles.recordSpinning : ''}
            `}
            style={{ 
              transform: `translateX(${dragOffsetX}px)`,
              opacity: 1 // 始终保持不透明
            }}
          >
            <div className={styles.vinylLabel}></div>
          </div>
          {/* 即将进入的唱片 */}
          {incomingTrackIndex !== -1 && incomingTrack && (
             <div 
                className={`
                  ${styles.vinylRecord} 
                  ${styles.incomingVinylRecord}
                `}
                style={{ 
                  transform: `translateX(${incomingTrackOffsetX}px)`,
                  // 过渡由 isDragging 控制，拖动时无过渡，松开时有过渡
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out', // 移除 opacity 过渡
                  opacity: 1 // 始终保持不透明
                }}
             >
               {/* 可以选择是否为 incoming 唱片也添加旋转和标签 */}
               <div className={styles.vinylLabel}></div> 
             </div>
          )}
        </div>

        {/* 修改: 添加包裹容器并应用旋转类 */}
        <div className={`${styles.tonearmAssembly} ${isPlaying ? styles.tonearmPlaying : ''}`}>
          {/* 唱臂点击区域 */}  
          <div 
            className={styles.tonearmHitbox}
            onClick={togglePlay}
            title={isPlaying ? "暂停音乐" : "播放音乐"}
          ></div>
          {/* 唱臂: 移除旋转类 */}
          <div 
            className={`
              ${styles.tonearm} 
              ${!isFullPower ? styles.tonearmLowPower : ''} // 保留低电量样式
            `}
            style={{ 
              // 保留阴影样式
              boxShadow: isPlaying && isFullPower ? '0 0 5px rgba(var(--ark-primary-rgb), 0.3)' : 'none'
            }}
          />
        </div>
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