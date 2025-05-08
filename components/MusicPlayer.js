import React, { useState, useRef, useEffect } from 'react';
import styles from './MusicPlayer.module.scss';

// 播放器控制图标 (SVG)
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

// 播放列表数据
const playlist = [
  {
    title: "Going home",
    artist: "Kenny G",
    src: "https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/music/Kenny G - Going home.mp3"
  },
  {
    title: "Mice on Venus",
    artist: "C418",
    src: "https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/music/C418 - Mice on Venus.flac"
  },
  {
    title: "Sweden",
    artist: "C418",
    src: "https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/music/C418 - Sweden.flac"
  },
  {
    title: "Old Memory",
    artist: "市川淳",
    src: "https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/music/市川淳 - Old Memory.flac"
  },
  {
    title: "ヨスガノソラ メインテーマ -記憶-",
    artist: "市川淳",
    src: "https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/music/市川淳 - ヨスガノソラ メインテーマ -記憶-.flac"
  },
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    src: "https://rainmorime-1315830626.cos.ap-beijing.myqcloud.com/music/Pink Floyd - The Dark Side of the Moon.flac"
  }
];

const DRAG_THRESHOLD = 50; // 拖动切换唱片的最小像素阈值

const MusicPlayer = ({ powerLevel }) => {
  const [isOpen, setIsOpen] = useState(true); // 抽屉是否展开
  const [isPlaying, setIsPlaying] = useState(false); // 是否正在播放
  const audioRef = useRef(null); // Audio 元素引用
  const [currentTime, setCurrentTime] = useState(0); // 当前播放时间
  const [duration, setDuration] = useState(0); // 音频总时长
  const progressBarRef = useRef(null); // 进度条填充元素引用
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // 当前播放歌曲在列表中的索引
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false); // 播放列表是否可见

  const isFullPower = powerLevel === 100; // 是否为满电状态 (影响唱臂样式)

  // 唱片拖动相关状态
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖动唱片
  const [dragStartX, setDragStartX] = useState(0); // 拖动起始 X 坐标
  // const [dragCurrentX, setDragCurrentX] = useState(0); // 当前拖动 X 坐标 (已由 dragCurrentXRef 替代主要功能)
  const [dragOffsetX, setDragOffsetX] = useState(0); // 当前唱片的水平偏移量 (用于视觉效果)
  const [incomingTrackIndex, setIncomingTrackIndex] = useState(-1); // 即将通过拖动切换到的歌曲索引 (-1 表示无)
  const [incomingTrackOffsetX, setIncomingTrackOffsetX] = useState(0); // 即将进入唱片的水平偏移量
  const vinylContainerRef = useRef(null); // 唱片机制容器引用
  const dragCurrentXRef = useRef(0); // 实时存储拖动过程中的 X 坐标 (用于 mouseup/leave 事件)
  const handleRef = useRef(null); // 播放器抽屉把手元素引用 (用于播放状态指示动画)
  const animationTimeouts = useRef([]); // 存储把手动画的 setTimeout ID (用于随机化动画)

  // 组件挂载时设置默认音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7; // 默认音量 70%
    }
  }, []);

  const currentTrack = playlist[currentTrackIndex]; // 当前歌曲对象
  // 下一首和上一首的歌曲信息 (用于拖动时预览)
  const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
  const prevTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  const incomingTrack = playlist[incomingTrackIndex] ?? null; // 即将播放的歌曲对象

  // 显示的歌曲标题和艺术家
  const displayTitle = currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : "";

  // 切换抽屉展开/收起状态
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (isOpen) setIsPlaylistVisible(false); // 关闭抽屉时同时隐藏播放列表
  };

  // 切换播放/暂停状态 (主要通过 audio 事件更新 isPlaying)
  const togglePlay = (e) => {
    e.stopPropagation(); // 防止事件冒泡 (例如点击唱臂区域时)
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("播放音频时出错:", error);
          setIsPlaying(false); // 确保播放失败时状态同步
        });
      }
    }
  };

  // 切换到上一首 (由拖动逻辑调用)
  const handlePrev = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  // 切换到下一首 (由拖动逻辑调用)
  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };
  
  // 从播放列表选择歌曲
  const selectTrack = (index) => {
    if (index !== currentTrackIndex) {
      setCurrentTrackIndex(index);
    } else {
      togglePlay(new Event('synthetic')); // 点击当前歌曲则切换播放/暂停
    }
  };

  // 切换播放列表的可见性
  const togglePlaylist = () => {
    setIsPlaylistVisible(!isPlaylistVisible);
  };

  // 唱片拖动开始 (鼠标按下)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // 仅左键
    setIsDragging(true);
    setDragStartX(e.clientX);
    dragCurrentXRef.current = e.clientX; // 初始化实时 X 坐标
    // 拖动时移除唱片过渡动画，以实现实时跟踪
    if (vinylContainerRef.current) {
      vinylContainerRef.current.querySelectorAll(`.${styles.vinylRecord}`).forEach(el => {
        el.style.transition = 'none';
      });
    }
    e.preventDefault(); // 阻止默认拖动行为 (如图片拖动)
  };

  // 唱片拖动中 (鼠标移动)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    dragCurrentXRef.current = e.clientX; // 更新实时 X 坐标
    const offsetX = dragCurrentXRef.current - dragStartX;
    setDragOffsetX(offsetX); // 更新当前唱片的视觉偏移

    // 根据拖动方向和距离，判断是否预显示上一首/下一首唱片
    if (offsetX > DRAG_THRESHOLD / 2) { // 向右拖 (上一首)
      setIncomingTrackIndex(prevTrackIndex);
      setIncomingTrackOffsetX(offsetX - (vinylContainerRef.current?.offsetWidth || 200)); 
    } else if (offsetX < -DRAG_THRESHOLD / 2) { // 向左拖 (下一首)
      setIncomingTrackIndex(nextTrackIndex);
      setIncomingTrackOffsetX(offsetX + (vinylContainerRef.current?.offsetWidth || 200)); 
    } else { // 未达到预显示阈值
      setIncomingTrackIndex(-1);
      setIncomingTrackOffsetX(0);
    }
  };

  // 唱片拖动结束 (鼠标松开或移出窗口)
  const handleMouseUpOrLeave = (e) => {
    if (!isDragging) return;
    const finalOffsetX = dragCurrentXRef.current - dragStartX;
    setIsDragging(false);

    if (Math.abs(finalOffsetX) > DRAG_THRESHOLD) { // 拖动超过阈值，执行切换
      if (finalOffsetX > 0) { // 向右，切换到上一首
        handlePrev();
        setDragOffsetX(vinylContainerRef.current?.offsetWidth || 200); // 当前唱片滑出右侧
      } else { // 向左，切换到下一首
        handleNext();
        setDragOffsetX(-(vinylContainerRef.current?.offsetWidth || 200)); // 当前唱片滑出左侧
      }
      setIncomingTrackOffsetX(0); // 即将进入的唱片滑到中间
      // 动画结束后重置偏移和预备轨道索引
      setTimeout(() => {
        setDragOffsetX(0);
        setIncomingTrackIndex(-1);
      }, 300); // 延迟时间应匹配 CSS 过渡时间
    } else { // 未超过阈值，弹回原位
      setDragOffsetX(0);
      setIncomingTrackIndex(-1);
    }
    // 重置拖动起始点
    setDragStartX(0);
    // dragCurrentXRef.current 在下一次 mousedown 时会被重置
  };

  // 监听拖动状态，绑定/解绑全局 mousemove 和 mouseup 事件
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUpOrLeave);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    }
    return () => { // 清理全局事件监听器
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    };
  }, [isDragging, dragStartX]); // 依赖 isDragging 和 dragStartX (确保 dragStartX 更新时能正确计算偏移)

  // 监听当前歌曲索引变化，自动加载新歌曲并根据当前播放状态决定是否播放
  useEffect(() => {
    if (audioRef.current && playlist[currentTrackIndex]) {
      const newSrc = playlist[currentTrackIndex].src;
      const currentFullSrcPath = audioRef.current.src ? new URL(audioRef.current.src).pathname : null;
      const newFullSrcPath = new URL(newSrc, window.location.origin).pathname;

      if (currentFullSrcPath !== newFullSrcPath) { // 仅当歌曲源不同时才加载
          audioRef.current.src = newSrc;
          audioRef.current.load();
          if (isPlaying) { // 如果之前是播放状态，则尝试自动播放新加载的歌曲
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                  playPromise.catch(error => {
                    console.error("[歌曲切换] 自动播放错误:", error);
                    setIsPlaying(false); // 自动播放失败，更新状态
                  });
              }
          }
      }
    }
  }, [currentTrackIndex]); // 依赖 currentTrackIndex

  // Audio 元素事件监听 (播放进度、元数据加载、播放/暂停状态、播放结束)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => { // 更新播放时间和进度条
      setCurrentTime(audio.currentTime);
      if (progressBarRef.current && duration > 0) {
        const progress = (audio.currentTime / duration) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    };
    const setAudioData = () => { // 音频元数据加载完成时设置总时长和当前时间
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const setAudioPlaying = () => setIsPlaying(true); // 音频开始播放
    const setAudioPaused = () => setIsPlaying(false);  // 音频暂停
    const handleEnded = () => { // 音频播放结束，自动播放下一首
        handleNext(); // 更新歌曲索引
        // handleNext 会触发上面的 useEffect 来加载并可能播放新歌，这里可选择是否强制播放
        // 此处增加短暂延时尝试播放，确保 useEffect 中的 src 加载完成
        setTimeout(() => {
            if (audioRef.current && audioRef.current.paused) { // 确认是否真的需要播放
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => setIsPlaying(true))
                               .catch(error => {
                                   console.error("[播放结束] 播放下一首错误:", error);
                                   setIsPlaying(false);
                                });
                }
            }
        }, 50);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('play', setAudioPlaying);
    audio.addEventListener('pause', setAudioPaused);
    audio.addEventListener('ended', handleEnded);

    return () => { // 清理所有 Audio 事件监听器
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('play', setAudioPlaying);
      audio.removeEventListener('pause', setAudioPaused);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration]); // 依赖 duration (当 duration 变化时，可能需要重新计算进度)

  // 处理抽屉把手上指示播放状态的动画条的随机延迟效果
  useEffect(() => {
    const handleElement = handleRef.current;
    if (!handleElement) return;
    const bars = handleElement.querySelectorAll(`.${styles.handleBar}`);

    const handleAnimationIteration = (event) => {
        const bar = event.target;
        bar.style.animationPlayState = 'paused'; // 暂停当前动画
        // 清除该 bar 可能存在的旧 timeout
        const existingTimeoutIndex = animationTimeouts.current.findIndex(t => t.element === bar);
        if (existingTimeoutIndex > -1) {
            clearTimeout(animationTimeouts.current[existingTimeoutIndex].id);
            animationTimeouts.current.splice(existingTimeoutIndex, 1);
        }
        const randomDelay = Math.random() * 900 + 300; // 随机延迟 300ms - 1200ms
        const timeoutId = setTimeout(() => { // 延迟后恢复动画
            bar.style.animationPlayState = 'running';
            const indexToRemove = animationTimeouts.current.findIndex(t => t.element === bar);
            if (indexToRemove > -1) animationTimeouts.current.splice(indexToRemove, 1);
        }, randomDelay);
        animationTimeouts.current.push({ id: timeoutId, element: bar }); // 存储新的 timeout
    };

    if (isPlaying) { // 播放时，为每个 bar 添加迭代监听并启动动画
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
            bar.addEventListener('animationiteration', handleAnimationIteration);
        });
    } else { // 暂停时，清除所有 timeout 和监听，并重置动画状态
        animationTimeouts.current.forEach(t => clearTimeout(t.id));
        animationTimeouts.current = [];
        bars.forEach(bar => {
            bar.removeEventListener('animationiteration', handleAnimationIteration);
            bar.style.animationPlayState = ''; 
        });
    }

    return () => { // 清理
        animationTimeouts.current.forEach(t => clearTimeout(t.id));
        animationTimeouts.current = [];
        if (handleElement) {
             const currentBars = handleElement.querySelectorAll(`.${styles.handleBar}`);
             currentBars.forEach(bar => {
                 bar.removeEventListener('animationiteration', handleAnimationIteration);
                 bar.style.animationPlayState = '';
             });
        }
    };
  }, [isPlaying]);

  return (
    <div className={`${styles.playerContainer} ${isOpen ? styles.open : ''}`}>
      {/* 抽屉把手：点击切换抽屉，播放时显示动画条和当前歌曲名 (若收起) */}
      <div 
        ref={handleRef} 
        className={`
          ${styles.handle} 
          ${!isOpen && isPlaying ? styles.expanded : ''} 
          ${isPlaying ? styles.playing : ''}
        `}
        onClick={toggleDrawer}
      >
        {/* 动画线条容器 */}
        <div className={styles.handleBarsContainer}>
          {[...Array(7)].map((_, i) => <div key={i} className={styles.handleBar}></div>)}
        </div>

        {/* 收起且播放时，在把手上显示当前歌曲名 (竖排) */}
        {!isOpen && isPlaying && currentTrack && (
          <div className={styles.handleTrackInfo}>
            <div className={styles.handleTrackTitle}>
              {(currentTrack.title || '').split('').map((char, index) => (
                <span key={`title-${index}`} className={styles.charItem}>{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <audio ref={audioRef} preload="metadata"></audio> {/* 音频播放核心元素 */}

      {/* 唱片拖动切换机制容器 */}
      <div 
        ref={vinylContainerRef}
        className={styles.vinylMechanismContainer}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.vinylPlatter}> {/* 唱盘 (固定部分) */}
          {/* 当前播放的唱片 */}
          <div 
            className={`${styles.vinylRecord} ${isPlaying ? styles.recordSpinning : ''}`}
            style={{ transform: `translateX(${dragOffsetX}px)`}}
          >
            <div className={styles.vinylLabel}></div> {/* 唱片中心标签 */} 
          </div>
          {/* 即将进入的唱片 (拖动时预览) */}
          {incomingTrackIndex !== -1 && incomingTrack && (
             <div 
                className={`${styles.vinylRecord} ${styles.incomingVinylRecord}`}
                style={{ 
                  transform: `translateX(${incomingTrackOffsetX}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out', // 拖动时无过渡，松开时有过渡
                  opacity: 1 // 始终可见，通过位置控制显示
                }}
             >
               <div className={styles.vinylLabel}></div> 
             </div>
          )}
        </div>

        {/* 唱臂组件：点击区域控制播放/暂停，播放时有动画 */}
        <div className={`${styles.tonearmAssembly} ${isPlaying ? styles.tonearmPlaying : ''}`}>
          <div 
            className={styles.tonearmHitbox} // 唱臂的点击热区
            onClick={togglePlay}
            title={isPlaying ? "暂停" : "播放"}
          ></div>
          <div 
            className={`${styles.tonearm} ${!isFullPower ? styles.tonearmLowPower : ''}`}
            style={{ boxShadow: isPlaying && isFullPower ? '0 0 5px rgba(var(--ark-primary-rgb), 0.3)' : 'none'}}
          />
        </div>
      </div>

      {/* 播放器主要内容区域 (抽屉内) */}
      <div className={styles.playerContent}>
        <div className={styles.trackInfoContainer}> {/* 歌曲信息与播放列表切换按钮容器 */}
          <div className={styles.trackInfo}>
            <div className={styles.trackTitle}>{displayTitle}</div>
          </div>
          <button 
            className={`${styles.playlistToggleButton} ${!isFullPower ? styles.toggleButtonLowPower : ''}`}
            onClick={togglePlaylist}
            title={isPlaylistVisible ? "收起列表" : "展开列表"}
          >
            {[...Array(3)].map((_, i) => <span key={i} className={styles.toggleButtonLine}></span>)}
          </button>
        </div>
        <div className={styles.progressBarContainer}> {/* 播放进度条 */}
          <div ref={progressBarRef} className={styles.progressBar}></div>
        </div>
      </div>
      
      {/* 播放列表 */}
      <div className={`${styles.playlistContainer} ${isPlaylistVisible ? styles.visible : ''}`}>
        {playlist.map((track, index) => (
          <div 
            key={index} 
            className={`${styles.playlistItem} ${index === currentTrackIndex ? styles.activePlaylistItem : ''}`}
            onClick={() => selectTrack(index)}
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