import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import VerticalShinyText from '../components/VerticalShinyText';
import RainMorimeEffect from '../components/RainMorimeEffect';
import styles from '../styles/Home.module.scss';
import React from 'react';
import ProjectCard from '../components/ProjectCard';
import Noise from '../components/Noise';
import TesseractExperience from '../components/TesseractExperience';
import ActivationLever from '../components/ActivationLever';
import MusicPlayer from '../components/MusicPlayer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sampleProjects = [
  {
    id: 1,
    title: 'Project Cyberscape',
    description: 'A procedural city generator visualizing network data streams.',
    tech: ['React', 'Three.js', 'Node.js', 'WebSockets'],
    link: '#',
    imageUrl: '/placeholders/cyberscape.png'
  },
  {
    id: 2,
    title: 'Aether Analytics',
    description: 'Real-time data analysis platform with a retro terminal interface.',
    tech: ['Next.js', 'Chart.js', 'Python (Flask)', 'PostgreSQL'],
    link: '#',
    imageUrl: '/placeholders/aether.png' 
  },
  {
    id: 3,
    title: 'Chrono Courier',
    description: 'Secure messaging system simulation with quantum encryption concepts.',
    tech: ['Vue.js', 'Web Crypto API', 'Firebase'],
    link: '#',
    imageUrl: '/placeholders/chrono.png'
  },
    {
    id: 4,
    title: 'Bio-Synth Composer',
    description: 'Generative music tool based on simulated biological growth patterns.',
    tech: ['Tone.js', 'P5.js', 'JavaScript'],
    link: '#',
    imageUrl: '/placeholders/biosynth.png'
  },
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [linesAnimated, setLinesAnimated] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const [leftPanelAnimated, setLeftPanelAnimated] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [displayedFateText, setDisplayedFateText] = useState('');
  const [isFateTypingActive, setIsFateTypingActive] = useState(false);
  const [displayedEnvParams, setDisplayedEnvParams] = useState('');
  const [isEnvParamsTyping, setIsEnvParamsTyping] = useState(false);
  const currentTempRef = useRef(55.0);
  const currentPowerRef = useRef(53);
  const lastGeneratedParamsRef = useRef('');
  const timeRef = useRef(new Date());
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const initialRandomTexts = [
    'DATA-Ø05',
    ...Array(5).fill('DATA-Ø??')
  ]; 
  const [randomHudTexts, setRandomHudTexts] = useState(initialRandomTexts);
  const [branchText1, setBranchText1] = useState('');
  const [branchText2, setBranchText2] = useState('');
  const [branchText3, setBranchText3] = useState('');
  const [branchText4, setBranchText4] = useState('');
  const intervalRef = useRef(null);
  const branchIntervalRef = useRef(null);
  const branchUpdateCounterRef = useRef(0);
  const [pulsingNormalIndices, setPulsingNormalIndices] = useState(null);
  const [pulsingReverseIndices, setPulsingReverseIndices] = useState(null);
  const pulseAnimationDuration = 2000; 
  const [activeSection, setActiveSection] = useState('home');
  const contentWrapperRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const aboutContentRef = useRef(null);
  const [powerLevel, setPowerLevel] = useState(67);
  const [isInverted, setIsInverted] = useState(false);
  const [isTesseractActivated, setIsTesseractActivated] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const dischargeIntervalRef = useRef(null);
  const [leversVisible, setLeversVisible] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setMainVisible(true);
      setTimeout(() => {
        setLeftPanelAnimated(true);
        setTimeout(() => {
          setLeversVisible(true);
        }, 800);
      }, 200);
      setTimeout(() => {
        setLinesAnimated(true);
      }, 1000);
      setTimeout(() => {
        setHudVisible(true);
      }, 2200);
      setTimeout(() => {
        setTextVisible(true);
      }, 2500);
      setTimeout(() => {
        setAnimationsComplete(true);
      }, 4200);
    }, 100);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let pulseIntervalId = null;
    let pulseTimeoutIds = [];

    if (animationsComplete) {
      const staggerDelay = 200;
      const animationDuration = 2000;

      pulseIntervalId = setInterval(() => {
        pulseTimeoutIds.forEach(clearTimeout);
        pulseTimeoutIds = [];
        setPulsingNormalIndices(null);
        setPulsingReverseIndices(null);

        const indices = [];
        while (indices.length < 3) {
          const randomIndex = Math.floor(Math.random() * 6);
          if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
          }
        }
        
        const timeoutId1 = setTimeout(() => {
          setPulsingNormalIndices([indices[0]]);
          setPulsingReverseIndices(null);
        }, 0);
        pulseTimeoutIds.push(timeoutId1);

        const timeoutId2 = setTimeout(() => {
          setPulsingNormalIndices(prev => (prev ? [...prev, indices[1]] : [indices[1]]));
        }, staggerDelay);
        pulseTimeoutIds.push(timeoutId2);
        
        const timeoutId3 = setTimeout(() => {
          setPulsingReverseIndices([indices[2]]);
        }, staggerDelay * 2);
        pulseTimeoutIds.push(timeoutId3);

        const resetTimeoutId = setTimeout(() => {
          setPulsingNormalIndices(null);
          setPulsingReverseIndices(null);
          pulseTimeoutIds = [];
        }, staggerDelay * 2 + animationDuration);
        pulseTimeoutIds.push(resetTimeoutId);

      }, 2000 + staggerDelay * 2);
    }

    return () => {
      if (pulseIntervalId) clearInterval(pulseIntervalId);
      pulseTimeoutIds.forEach(clearTimeout);
    };
  }, [animationsComplete]); 

  useEffect(() => {
    if (textVisible) {
      const englishText = "You and me, fate is entangled in this moment.";
      const chineseText = "你我命运于此刻纠缠不休，守林人。";
      const typingDelay = 80;
      const deleteDelay = 50;
      const chineseTypingDelay = 150;
      const chineseDeleteDelay = 100;
      const pauseAfterType = 1500;
      const pauseAfterDelete = 500;

      let timeouts = [];
      setIsFateTypingActive(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedFateText(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedFateText(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const sequence = () => {
        typeString(englishText, 0, typingDelay, () => {
          const timeoutId1 = setTimeout(() => {
            deleteString(englishText, deleteDelay, () => {
              const timeoutId2 = setTimeout(() => {
                typeString(chineseText, 0, chineseTypingDelay, () => {
                  const timeoutId3 = setTimeout(() => {
                    deleteString(chineseText, chineseDeleteDelay, () => {
                      const timeoutId4 = setTimeout(() => {
                        sequence();
                      }, pauseAfterDelete);
                      timeouts.push(timeoutId4);
                    });
                  }, pauseAfterType);
                  timeouts.push(timeoutId3);
                });
              }, pauseAfterDelete);
              timeouts.push(timeoutId2);
            });
          }, pauseAfterType);
          timeouts.push(timeoutId1);
        });
      };

      sequence();

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedFateText(''); 
        setIsFateTypingActive(false);
        timeouts = [];
      };
    }
  }, [textVisible]);

  useEffect(() => {
    if (textVisible) {
      const typingDelay = 35;
      const envDeleteDelay = 20;
      
      let timeouts = [];
      setIsEnvParamsTyping(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedEnvParams(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteEnvParamsString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedEnvParams(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteEnvParamsString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0); 
          timeouts.push(timeoutId);
        }
      };

      const generateNewParams = () => {
        const tempChange = (Math.random() * 3) - 1.5; 
        let newTemp = currentTempRef.current + tempChange;
        newTemp = Math.max(44, Math.min(66, newTemp)); 
        currentTempRef.current = newTemp; 
        const tempStr = newTemp.toFixed(1);
        
        const rad = Math.floor(200 + Math.random() * 300);
        const o2 = (8 + Math.random() * 2).toFixed(1); 
        
        const pollutionLevels = ["SEVERE", "CRITICAL", "UNSTABLE", "HAZARDOUS"];
        const pollution = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];
        
        const rainStatus = ["IMMINENT", "LIKELY", "UNLIKELY", "CERTAIN"];
        const rain = rainStatus[Math.floor(Math.random() * rainStatus.length)];
                
        const warnings = [
          "ALERT: TOXIC EXPOSURE RISK",
          "CAUTION: RADIATION STORM",
          "DANGER: ACID ZONES EXPANDING",
          "URGENT: OXYGEN DEPLETION"
        ];
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        const warningLine = Math.random() > 0.5 ? `\n${randomWarning}` : '';
        
        return `TEMP: ${tempStr}°C\nRAD: ${rad}mSv/h\nO2: ${o2}%\nPOLLUTION: ${pollution}\nACID RAIN: ${rain}${warningLine}`;
      };

      const generateAndType = () => {
        const newParams = generateNewParams();
        lastGeneratedParamsRef.current = newParams;
        typeString(newParams, 0, typingDelay, () => {
          const updateTime = 8000 + Math.floor(Math.random() * 7000);
          const restartTimeout = setTimeout(() => {
            startTyping();
          }, updateTime);
          timeouts.push(restartTimeout);
        });
      };

      const startTyping = () => {
        const textToDelete = lastGeneratedParamsRef.current;

        if (textToDelete.length > 0) {
          deleteEnvParamsString(textToDelete, envDeleteDelay, () => {
            generateAndType(); 
          });
        } else {
          generateAndType();
        }
      };

      const initialDelay = setTimeout(() => {
        startTyping();
      }, 1000);
      timeouts.push(initialDelay);

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedEnvParams('');
        setIsEnvParamsTyping(false);
        lastGeneratedParamsRef.current = '';
      };
    }
  }, [textVisible]);

  useEffect(() => {
    if (!mainVisible) return;

    const intervalId = setInterval(() => {
      setPowerLevel(prevLevel => {
        if (!isDischarging && prevLevel < 100) {
          const decrease = Math.floor(Math.random() * 3) + 1;
          return Math.max(0, prevLevel - decrease);
        }
        return prevLevel;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [mainVisible, isDischarging]);

  const chargeBattery = () => {
    setPowerLevel(prevLevel => {
      if (prevLevel >= 100) return 100;
      const newLevel = Math.min(100, prevLevel + 5);
      console.log("Charging... New Power Level:", newLevel);
      return newLevel;
    });
  };

  const handleDischargeLeverPull = () => {
    if (powerLevel === 100 && !isDischarging) {
      console.log("Discharge Lever Pulled! Starting discharge...");
      setIsDischarging(true);
    } else if (isDischarging) {
        console.log("Already discharging.");
    } else {
        console.log("Cannot discharge, power level is not 100%.");
    }
  };

  useEffect(() => {
    if (isDischarging) {
      if (dischargeIntervalRef.current) {
        clearInterval(dischargeIntervalRef.current);
      }
      dischargeIntervalRef.current = setInterval(() => {
        setPowerLevel(prevLevel => {
          if (prevLevel > 0) {
            const decreaseAmount = 1;
            return Math.max(0, prevLevel - decreaseAmount);
          } else {
            console.log("Discharge complete.");
            clearInterval(dischargeIntervalRef.current);
            dischargeIntervalRef.current = null;
            setIsDischarging(false);
            return 0;
          }
        });
      }, 80);

      return () => {
        if (dischargeIntervalRef.current) {
          console.log("Cleaning up discharge interval.");
          clearInterval(dischargeIntervalRef.current);
          dischargeIntervalRef.current = null;
        }
      };
    } else {
        if (dischargeIntervalRef.current) {
             console.log("Clearing discharge interval because isDischarging is false.");
             clearInterval(dischargeIntervalRef.current);
             dischargeIntervalRef.current = null;
        }
    }
  }, [isDischarging]);

  useEffect(() => {
    if (powerLevel === 100 && !isDischarging && !isInverted) {
      console.log("Power at 100% and not discharging! Activating inverted mode.");
      setIsInverted(true);
    }
    else if ((powerLevel < 100 || isDischarging) && isInverted) {
      console.log("Power below 100 or discharging! Deactivating inverted mode.");
      setIsInverted(false);
    }
  }, [powerLevel, isInverted, isDischarging]);

  const numberOfColumns = 6;

  const sectionNames = [
    "WORKS",
    "EXPERIENCE",
    "LIFE",
    "CONTACT",
    "ABOUT"
  ];

  const updateRandomHudTexts = () => {
    const newTexts = [];
    for (let i = 0; i < 6; i++) { 
      const randomNum = Math.floor(Math.random() * 99) + 1;
      const numStr = String(randomNum).padStart(2, '0');
      newTexts.push(`DATA-Ø${numStr}`);
    }
    setRandomHudTexts(newTexts);
  };

  const generateRandomChars = (length) => { 
    let targetLength = length;
    if (typeof length === 'undefined' || length === null) {
      targetLength = Math.floor(Math.random() * 4) + 3;
    }
    
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:'\",.<>/?~`§±¥₩£¢€©®™×÷≠≤≥∞∑∫√≈≠≡";
    let result = '';
    targetLength = Math.max(0, targetLength); 
    
    for (let i = 0; i < targetLength; i++) { 
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < targetLength - 1) { 
        result += '\n';
      }
    }
    return result;
  };

  const handleColumnMouseEnter = (index) => {
    if (index === 4) {
      updateRandomHudTexts();
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateRandomHudTexts, 50);
    } else if (index === 1) {
      branchUpdateCounterRef.current = 0; 
      if (branchIntervalRef.current) clearInterval(branchIntervalRef.current);
      
      const getTargetLength = (effectiveCount) => {
        if (effectiveCount <= 15) {      
          return 1;
        } else if (effectiveCount <= 24) { 
          return 2;
        } else if (effectiveCount <= 36) { 
          return 3;
        } else if (effectiveCount <= 48) { 
          return 4;
        } else {                 
          return Math.floor(Math.random() * 3) + 4;
        }
      };

      const initialMainCount = 1;
      const initialLength1 = getTargetLength(initialMainCount + 45);
      const initialLength2 = getTargetLength(initialMainCount + 30);
      const initialLength3 = getTargetLength(initialMainCount + 15);
      const initialLength4 = getTargetLength(initialMainCount + 0);

      setBranchText1(generateRandomChars(initialLength1));
      setBranchText2(generateRandomChars(initialLength2));
      setBranchText3(generateRandomChars(initialLength3));
      setBranchText4(generateRandomChars(initialLength4));
      branchUpdateCounterRef.current = initialMainCount;

      branchIntervalRef.current = setInterval(() => {
        branchUpdateCounterRef.current += 1;
        const mainCount = branchUpdateCounterRef.current;
        
        const length1 = getTargetLength(mainCount + 45);
        const length2 = getTargetLength(mainCount + 30);
        const length3 = getTargetLength(mainCount + 15);
        const length4 = getTargetLength(mainCount + 0);
        
        setBranchText1(generateRandomChars(length1));
        setBranchText2(generateRandomChars(length2));
        setBranchText3(generateRandomChars(length3));
        setBranchText4(generateRandomChars(length4));

      }, 100); 
    }
  };

  const handleColumnMouseLeave = (index) => {
    if (index === 4) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (index === 1) {
      if (branchIntervalRef.current) {
        clearInterval(branchIntervalRef.current);
        branchIntervalRef.current = null;
      }
      setBranchText1('');
      setBranchText2('');
      setBranchText3('');
      setBranchText4('');
      branchUpdateCounterRef.current = 0; 
    }
  };

  const handleColumnClick = (columnIndex) => {
    console.log(`Column ${columnIndex + 1} clicked`);
    const sectionIds = [
      'works-section',
      'experience-section',
      'life-section',
      'contact-section',
      'about-section'
    ];
    
    if (columnIndex < sectionIds.length) {
      const sectionId = sectionIds[columnIndex];
      setActiveSection('content');

      requestAnimationFrame(() => {
        const targetElement = document.getElementById(sectionId);
        const containerElement = contentWrapperRef.current;
        if (targetElement && containerElement) {
          const offsetTop = targetElement.offsetTop;
          containerElement.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  const handleGoHome = () => {
    setActiveSection('home');
  };

  useEffect(() => {
    if (activeSection === 'content' && aboutSectionRef.current && aboutContentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          scroller: contentWrapperRef.current, 
          start: 'top bottom', 
          end: 'bottom top', 
          toggleActions: 'play none none reverse', 
          markers: false, 
        }
      });

      tl.from(aboutSectionRef.current, {
        x: '100%', 
        opacity: 0,
        immediateRender: false, 
        duration: 0.8, 
        ease: 'power3.out' 
      });

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    } 
    else {
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === aboutSectionRef.current) {
                st.kill();
            }
        });
    }
  }, [activeSection]); 

  const handleActivateTesseract = () => {
    if (!isTesseractActivated) {
      console.log('Activation Lever Pulled! Activating Tesseract...');
      setIsTesseractActivated(true);
    };
  };

  return (
    <div className={`${styles.container} ${isInverted ? styles.inverted : ''}`}>
      <Head>
        <title>森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的个人网站" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MusicPlayer powerLevel={powerLevel} />
      <CustomCursor />
      <RainMorimeEffect />
      <HomeLoadingScreen onComplete={handleLoadingComplete} />
      {isTesseractActivated && (
        <TesseractExperience 
          chargeBattery={chargeBattery} 
          isActivated={isTesseractActivated}
          isInverted={isInverted}
        />
      )}
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect}></div>
      {mainVisible && (
        <>
          <div className={`${styles.hudElement} ${styles.topLeft} ${hudVisible ? styles.visible : ''}`}>
            <div>TIME: {currentTime}</div>
            <div>SYSTEM_ONLINE</div>
          </div>
          <div className={`${styles.hudElement} ${styles.topRight} ${hudVisible ? styles.visible : ''}`}>
            <div>NEURAL_NETWORK_ACTIVE</div>
            <div>SIGNAL: STABLE</div>
          </div>
          <div className={`${styles.hudElement} ${styles.bottomLeft} ${hudVisible ? styles.visible : ''}`}>
            <div>RAINMORIME</div>
            <div>NAV_SYSTEM_v2.4</div>
          </div>
          <div className={`${styles.hudElement} ${styles.bottomRight} ${hudVisible ? styles.visible : ''}`}>
            <div>TACTICAL_MODE</div>
            <div>SECURE_CONNECTION</div>
          </div>
          <div className={`${styles.leftPanel} ${leftPanelAnimated ? styles.animated : ''}`}> 
            <div className={styles.leverGroup}>
              {mainVisible && (
                <ActivationLever
                  onActivate={handleActivateTesseract}
                  isActive={isTesseractActivated}
                  iconType="discharge"
                  isAnimated={leversVisible}
                />
              )}
              {mainVisible && (
                <ActivationLever
                  onActivate={handleDischargeLeverPull}
                  isActive={isDischarging}
                  iconType="drain"
                  isAnimated={leversVisible}
                />
              )}
            </div>
            <div className={styles.powerDisplay}>
              <div className={styles.batteryIcon}>
                {[...Array(5)].map((_, i) => {
                  const shouldBeFilled = powerLevel >= (i + 1) * 20;
                  const isFilled = (i === 4 && powerLevel === 100) || shouldBeFilled;
                  return (
                    <span 
                      key={i} 
                      className={`${styles.batteryLevelSegment} ${isFilled ? styles.filled : ''}`}>
                    </span>
                  );
                })}
              </div>
              <span className={styles.powerText}>{powerLevel}%</span>
            </div>
            <div className={styles.logoContainer}>
            </div>
            <div className={`${styles.fateTextContainer} ${isFateTypingActive ? styles.typingActive : ''}`}>
              <span className={styles.fateText}>{displayedFateText}</span>
              <div className={styles.fateLine}></div>
            </div>
            <div className={`${styles.envParamsContainer} ${isEnvParamsTyping ? styles.typingActive : ''} ${leftPanelAnimated ? styles.animated : ''}`}>
                <pre className={styles.envParamsText}>
                  {displayedEnvParams}
                </pre>
            </div>
          </div>

          <main className={`${styles.mainLayout} ${activeSection === 'home' ? styles.visible : styles.hidden}`}>
            <div
              className={styles.rightPanel}
            >
              {[...Array(6)].map((_, index) => { 
                const lineLeftPercentage = index * 16;
                const isPulsingNormal = pulsingNormalIndices?.includes(index);
                const isPulsingReverse = pulsingReverseIndices?.includes(index);
                return (
                  <div 
                    key={`line-${index}`}
                    className={`
                      ${styles.verticalLine} 
                      ${linesAnimated ? styles.animated : ''} 
                      ${isPulsingNormal ? styles.pulsing : ''} 
                      ${isPulsingReverse ? styles.pulsingReverse : ''}
                    `}
                    style={{ left: `${lineLeftPercentage}%` }}
                  ></div>
                );
              })}
              
              {sectionNames.map((name, index) => {
                const columnPercentage = index * 16;
                const hudText = randomHudTexts[index + 1] || `DATA-Ø0${index + 1}`;
                
                const tasks = Array.from({ length: 30 }, (_, i) => {
                  const taskNumber = String(i + 1).padStart(3, '0');
                  return `TASK-${taskNumber}: Done`;
                });

                return (
                  <div 
                    key={name}
                    className={`${styles.column} ${styles['column' + index]} ${!animationsComplete ? styles.nonInteractive : ''}`} 
                    style={{ left: `${columnPercentage}%`, width: '16%' }} 
                    onClick={animationsComplete ? () => handleColumnClick(index) : null}
                    onMouseEnter={() => handleColumnMouseEnter(index)}
                    onMouseLeave={() => handleColumnMouseLeave(index)}
                  >
                    <div className={styles.verticalText}>
                      {name.split('').map((char, charIdx) => {
                        const delay = `${charIdx * 0.005}s`;
                        return (
                          <div key={charIdx} className={styles.charItem}>
                            <VerticalShinyText
                              text={char}
                              textVisible={textVisible}
                              animationDelay={delay}
                              speed={0.8}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.hudOverlay}>
                      {index === 0 && (
                        <div className={styles.taskContainer}>
                          {tasks.flatMap((task, taskIdx) => [
                            <div key={`task-${taskIdx}`} className={styles.taskItem}>
                              <span className={styles.taskSquare}></span>
                              <div className={styles.taskTextWrapper}>
                                <span className={styles.taskText}>{task}</span>
                              </div>
                            </div>,
                            taskIdx < tasks.length - 1 && <div key={`line-${taskIdx}`} className={styles.taskLine}></div>
                          ])}
                        </div>
                      )}
                      {index === 1 && (
                        <>
                          <div className={`${styles.branchContainer} ${styles.branch1} ${styles.rightBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText1}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch2} ${styles.leftBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText2}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch3} ${styles.rightBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText3}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch4} ${styles.leftBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText4}</pre>
                          </div>
                        </>
                      )}
                      {index === 2 && <span className={`${styles.lifeScanlines} ${isInverted ? styles.invertedScanlines : ''}`}></span>}

                      {index === 3 && (
                          <>
                            <div className={`${styles.radarRipple} ${styles.ripple1}`}></div>
                            <div className={`${styles.radarRipple} ${styles.ripple2}`}></div>
                            <div className={`${styles.radarRipple} ${styles.ripple3}`}></div>
                          </>
                      )}
                    </div>
                    <div className={styles.cornerHudTopLeft}></div>
                    <div className={styles.cornerHudBottomRight}></div>
                    <div className={styles.imageHud}>
                      <span className={styles.imageHudSquare}></span>
                      <span className={styles.imageHudText}>
                        {index === 4 ? randomHudTexts[0] : hudText} 
                      </span>
                    </div>
                    {index === 4 && (
                      <>
                        {randomHudTexts.slice(1).map((text, randomIdx) => (
                          <div 
                            key={`random-hud-${randomIdx}`} 
                            className={`${styles.imageHud} ${styles.randomHud} ${styles[`randomHud${randomIdx + 1}`]}`}
                          >
                            <span className={styles.imageHudSquare}></span>
                            <span className={styles.imageHudText}>{text}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </main>

          <div 
            ref={contentWrapperRef} 
            className={`${styles.contentWrapper} ${activeSection === 'content' ? styles.visible : styles.hidden}`}
          >
            <div id="works-section" className={`${styles.contentSection} ${styles.worksSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>WORKS</h2>
              <div className={styles.projectGrid}>
                {sampleProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            <div id="experience-section" className={`${styles.contentSection} ${styles.experienceSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>EXPERIENCE</h2>
              <div className={styles.experienceTimeline}>
                <div className={`${styles.timelineItem} ${styles.timelineItemRight} ${styles.educationItem}`}>
                  <div className={styles.timelinePoint}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineYear}><span className={styles.timelineNumber}>2016</span> - <span className={styles.timelineNumber}>2022</span></div>
                    <h3>初中 / 高中</h3>
                    <p>吉林师范大学附属中学</p>
                    <p>四平市第一高级中学</p>
                  </div>
                </div>
                <div className={`${styles.timelineItem} ${styles.timelineItemLeft} ${styles.educationItem}`}>
                  <div className={styles.timelinePoint}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineYear}><span className={styles.timelineNumber}>2022</span> - 至今</div>
                    <h3>大学</h3>
                    <p>西安外国语大学</p>
                    <p>英语系</p>
                  </div>
                </div>
                <div className={`${styles.timelineItem} ${styles.timelineItemLeft}`}>
                  <div className={styles.timelinePoint}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineYear}>
                      <span className={styles.timelineNumber}>2024.07.15</span> - <span className={styles.timelineNumber}>08.16</span>
                    </div>
                    <h3>实习</h3>
                    <p>吉林泰斯特生物电子工程有限公司</p>
                    <p>国内销售部 | 产品翻译、校对；市场调研</p>
                  </div>
                </div>
                <div className={`${styles.timelineItem} ${styles.timelineItemLeft}`}>
                  <div className={styles.timelinePoint}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineYear}>
                      <span className={styles.timelineNumber}>2024.11.11</span> - <span className={styles.timelineNumber}>11.17</span>
                    </div>
                    <h3>志愿者</h3>
                    <p><span className={styles.timelineNumber}>2024</span> 中国整合肿瘤学大会 | 试片区小组长</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="life-section" className={`${styles.contentSection} ${styles.lifeSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>LIFE</h2>
              <p>这里是 Life 部分的内容...</p>
            </div>

            <div id="contact-section" className={`${styles.contentSection} ${styles.contactSection}`}> 
              <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
              <h2>CONTACT</h2>
              <p>这里是 Contact 部分的内容...</p>
            </div>

            <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}> 
              <Noise />
              <div ref={aboutContentRef}>
                <button className={styles.backButton} onClick={handleGoHome}>← BACK</button>
                <h2>ABOUT</h2>
                <div className={styles.footerInfo}>
                  <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                    ICP备案: 陕ICP备2023011267号-1
                  </a>
                </div>
                <div className={styles.footerInfo}> 
                  © 2025 朴相霖 / RainMorime 版权所有
                </div>
              </div>
              <div className={styles.aboutImageContainer}>
                <img 
                  src="/pictures/www.rainmorime.com.png" 
                  alt="Website QR Code" 
                  className={styles.aboutImage} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}