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
import SimpleImageCard from '../components/SimpleImageCard';
import LifeDetailView from '../components/LifeDetailView';

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

const gameData = [
  {
    id: 'mc',
    title: 'Minecraft',
    description: '我的启蒙，也愿成为我的始终。',
    tech: ['沙盒', '生存', '建造'],
    link: '#', // Optional: Add links if relevant
    imageUrl: '/pictures/Minecraft/MC2025.png' // Updated image path
  },
  {
    id: 'mh',
    title: 'Monster Hunter',
    description: '我动作游戏的引路人。',
    tech: ['动作', '狩猎', '多人'],
    link: '#',
    imageUrl: '/pictures/Minecraft/MC2025.png'
  },
  {
    id: 'stray',
    title: 'Stray',
    description: '在赛博朋克城市中扮演一只猫。',
    tech: ['冒险', '解谜', '猫'],
    link: '#',
    imageUrl: '/pictures/Stray/stray15.jpg'
  },
   {
    id: 'titanfall',
    title: 'Titanfall',
    description: '第一次酣畅淋漓的体验。',
    tech: ['FPS', '机甲', '多人'],
    link: '#',
    imageUrl: '/pictures/Titalfall/titan13.jpg' // Updated image path
  },
  {
    id: 'wa',
    title: 'WHITE ALBUM',
    description: '广场协议后的泡沫与追忆，让我写了第一份长评',
    tech: ['视觉小说', '恋爱', '音乐'],
    link: '#',
    imageUrl: '/pictures/WHITE_ALBUM/w10.jpg'
  },
  {
    id: 'thif',
    title: 'Touhou',
    description: '东方的同人总是令人惊叹。',
    tech: ['东方Project', '动作', '粉丝创作'],
    link: '#',
    imageUrl: '/pictures/Touhou/TH3.png'
  },
  {
    id: 'bmwk',
    title: 'BLACK MYTH: WU KONG',
    description: '备受期待的国产3A。',
    tech: ['ARPG', '神话', '动作'],
    link: '#',
    imageUrl: '/pictures/Minecraft/MC2025.png'
  },
];

const leftPanelCardData = {
  id: 'left-showcase',
  title: 'Showcase',
  imageUrl: '/pictures/showcase_placeholder.png'
};

const travelData = [
  {
    id: 'jilin',
    title: '吉林',
    description: '长白山脉与松花江畔的风景。', // Example description
    tech: ['自然', '冬季', '边境'], // Example tags
    link: '#', // Optional link
    imageUrl: '/travel_placeholders/jilin.png' // Placeholder image path
  },
  {
    id: 'shaanxi',
    title: '陕西',
    description: '古都西安与秦岭风光。',
    tech: ['历史', '文化', '美食'],
    link: '#',
    imageUrl: '/travel_placeholders/shaanxi.png'
  },
  {
    id: 'guizhou',
    title: '贵州',
    description: '喀斯特地貌与少数民族风情。',
    tech: ['自然', '民族', '山水'],
    link: '#',
    imageUrl: '/images/travel/guizhou/GZ20.jpg'
  },
  {
    id: 'qinghai',
    title: '青海',
    description: '高原湖泊与广袤草原。',
    tech: ['高原', '湖泊', '自然'],
    link: '#',
    imageUrl: '/travel_placeholders/qinghai.png'
  },
  {
    id: 'korea',
    title: '韩国',
    description: '现代都市与传统文化的交融。',
    tech: ['都市', '文化', '美食'],
    link: '#',
    imageUrl: '/images/travel/hanguo/HG2.jpg'
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
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [activeLifeTab, setActiveLifeTab] = useState('game');
  const [selectedLifeItem, setSelectedLifeItem] = useState(null);
  const [contentScrollPosition, setContentScrollPosition] = useState(0);
  const [previousActiveLifeTab, setPreviousActiveLifeTab] = useState(null);

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
      setSelectedLifeItem(null);
      setActiveSection('content');

      requestAnimationFrame(() => {
        const targetElement = document.getElementById(sectionId);
        const containerElement = contentWrapperRef.current;
        if (targetElement && containerElement) {
          if (sectionId === 'life-section') {
             setActiveLifeTab('game');
          }
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
    setSelectedLifeItem(null);
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

  const handleCopyEmail = () => {
    const email = 'rainmorime@qq.com';
    navigator.clipboard.writeText(email).then(() => {
      console.log('Email copied to clipboard!');
      setIsEmailCopied(true);
      setTimeout(() => {
        setIsEmailCopied(false);
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  };

  const handleLifeItemClick = (item) => {
    console.log("Life item clicked, switching to detail view:", item);
    
    // --- RECORD STATE BEFORE SWITCHING ---
    if (contentWrapperRef.current) {
      setContentScrollPosition(contentWrapperRef.current.scrollTop); // Record scroll position
    }
    setPreviousActiveLifeTab(activeLifeTab); // Record current tab
    // --- END RECORD ---

    setSelectedLifeItem(item);
    setActiveSection('lifeDetail'); 
  };

  const handleGlobalBackClick = () => {
    if (activeSection === 'lifeDetail') {
      // --- RESTORE STATE WHEN GOING BACK ---
      setActiveSection('content'); // Switch view first

      // Restore the previously active tab
      if (previousActiveLifeTab) {
          setActiveLifeTab(previousActiveLifeTab);
      } else {
          setActiveLifeTab('game'); // Fallback to default if none was stored
      }
      
      // Restore scroll position AFTER state update allows content to render
      requestAnimationFrame(() => {
          if (contentWrapperRef.current) {
              contentWrapperRef.current.scrollTop = contentScrollPosition;
          }
      });
      
      // Clear the selected item and stored states after a delay
      setTimeout(() => {
        setSelectedLifeItem(null);
        setPreviousActiveLifeTab(null); 
        setContentScrollPosition(0); // Reset scroll position state
      }, 500); // Match animation duration

    } else if (activeSection === 'content') {
      handleGoHome(); 
    }
  };

  return (
    <div className={`${styles.container} ${isInverted ? styles.inverted : ''}`}>
      <Head>
        <title>森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的个人网站" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.leftDotMatrix}></div>
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
            <div className={styles.topRightDecoration}></div>
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
            <button
              className={`${styles.globalBackButton} ${activeSection === 'content' || activeSection === 'lifeDetail' ? styles.visible : ''}`}
              onClick={handleGlobalBackClick}
            >
              {/* ← */}
            </button>
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
            <div className={styles.leftPanelCardWrapper}>
              <SimpleImageCard
                title={leftPanelCardData.title}
                imageUrl={leftPanelCardData.imageUrl}
              />
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
            <div className={styles.brailleText}>⠝⠊⠕⠍⠡⠸⠬⠉⠄⠅⠢⠛⠳⠟⠧⠃⠥⠓⠳</div>
                        {/* Add the gradient line element here */}
              <div
              className={`${styles.gradientLine} ${isInverted ? styles.gradientLineInverted : styles.gradientLineDefault}`}
            ></div>
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
              <h2>WORKS</h2>
              <div className={styles.projectGrid}>
                {sampleProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            <div id="experience-section" className={`${styles.contentSection} ${styles.experienceSection}`}> 
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
              <h2>LIFE</h2>
              {activeSection === 'content' && (
                <div className={styles.lifeTabButtons}>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'game' ? styles.activeTab : ''}`}
                    onClick={() => setActiveLifeTab('game')}
                  >
                    Game
                  </button>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'travel' ? styles.activeTab : ''}`}
                    onClick={() => setActiveLifeTab('travel')}
                  >
                    Travel
                  </button>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'art' ? styles.activeTab : ''}`}
                    onClick={() => setActiveLifeTab('art')}
                  >
                    Art
                  </button>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'other' ? styles.activeTab : ''}`}
                    onClick={() => setActiveLifeTab('other')}
                  >
                    Other
                  </button>
                </div>
              )}

              <div className={styles.lifeContentArea}>
                <div className={`${styles.lifeTabContent} ${activeLifeTab === 'game' ? styles.activeContent : ''}`}>
                  <div className={styles.gameGrid}>
                    {gameData.map(game => (
                      <ProjectCard 
                        key={game.id} 
                        project={game} 
                        onClick={() => handleLifeItemClick(game)}
                      />
                    ))}
                  </div>
                </div>
                <div className={`${styles.lifeTabContent} ${activeLifeTab === 'travel' ? styles.activeContent : ''}`}>
                  <div className={styles.travelGrid}>
                    {travelData.map(place => (
                      <ProjectCard 
                        key={place.id} 
                        project={place} 
                        onClick={() => handleLifeItemClick(place)}
                      />
                    ))}
                  </div>
                </div>
                <div className={`${styles.lifeTabContent} ${activeLifeTab === 'art' ? styles.activeContent : ''}`}>
                  <p>这是艺术部分的内容...</p>
                </div>
                <div className={`${styles.lifeTabContent} ${activeLifeTab === 'other' ? styles.activeContent : ''}`}>
                  <p>这是其他部分的内容...</p>
                </div>
              </div>
            </div>

            <div id="contact-section" className={`${styles.contentSection} ${styles.contactSection}`}> 
              <h2>CONTACT</h2>
              <div className={styles.radarDisplay}>
                <div className={styles.scanner}></div>
                <div className={`${styles.radarRipple} ${styles.ripple1}`}></div>
                <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple1}`}></div>
                <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple2}`}></div>
                <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple3}`}></div>
              </div>

              <button
                type="button"
                className={`${styles.logItem} ${styles.radarContact1}`}
                onClick={handleCopyEmail}
              >
                <div className={styles.logIconContainer}>
                  <svg className={styles.logIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.00977 5.83789C3 5.28561 3.44772 4.83789 4 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 17.7144 20.5523 18.1621 20 18.1621H4C3.44772 18.1621 3 17.7144 3 17.1621V5.83789H3.00977ZM5.01817 6.83789L11.0535 11.4847C11.6463 11.9223 12.4249 11.9223 13.0177 11.4847L19.053 6.83789H5.01817Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactIconRipple}></div>
                <span className={styles.emailText}>rainmorime@qq.com</span>
                {isEmailCopied && <span className={styles.copyFeedback}>Copied!</span>}
              </button>
              <div className={`${styles.logItem} ${styles.radarContact2}`}>
                  <a href="https://github.com/RainMorime" target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                    <div className={styles.logIconContainer}>
                      <svg className={styles.logIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <div className={styles.contactIconRipple}></div>
                  </a>
              </div>
              <div className={`${styles.logItem} ${styles.radarContact3}`}>
                  <a href="https://space.bilibili.com/28913719" target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                    <div className={styles.logIconContainer}>
                      <svg className={styles.logIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <path fill="none" d="M0 0h24v24H0z"/>
                          <path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/>
                        </g>
                      </svg>
                    </div>
                    <div className={styles.contactIconRipple}></div>
                  </a>
              </div>
            </div>

            <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}> 
              <Noise />
              <div ref={aboutContentRef}>
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

      <div 
        className={`${styles.detailViewWrapper} ${activeSection === 'lifeDetail' ? styles.visible : styles.hidden}`}
      >
        {selectedLifeItem && (
          <LifeDetailView 
            item={selectedLifeItem}
          />
        )}
      </div>
    </div>
  );
}