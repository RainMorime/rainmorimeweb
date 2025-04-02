import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoverLink, setHoverLink] = useState(null);
  const linkRefs = useRef({});
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (currentPath === '/') {
      const sections = document.querySelectorAll('section[id]');
      
      const handleScroll = () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // 只在首页的锚点处理
            // 不再设置activeLink
          }
        });
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [currentPath]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (path === currentPath) return;
    
    // 关闭菜单（如果打开）
    if (isOpen) {
      toggleMenu();
    }
    
    // 直接导航到新页面
    router.push(path);
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    }
  };
  
  const linkVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      clipPath: 'circle(0% at calc(100% - 30px) 30px)',
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      clipPath: 'circle(150% at calc(100% - 30px) 30px)',
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const menuItemVariants = {
    closed: {
      y: 50,
      opacity: 0
    },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  // 检查当前路径是否活跃
  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  // 获取链接位置信息，用于悬停动画
  const getLinkDimensions = (path) => {
    if (linkRefs.current[path]) {
      const rect = linkRefs.current[path].getBoundingClientRect();
      return {
        width: rect.width,
        left: rect.left
      };
    }
    return { width: 0, left: 0 };
  };

  const navLinks = [
    { path: '/', label: '主页' },
    { path: '/work', label: '作品' },
    { path: '/experience', label: '经历' },
    { path: '/life', label: '生活' },
    { path: '/contact', label: '联系' }
  ];

  return (
    <>
      <motion.nav 
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        <div className={styles.container}>
          <Link href="/">
            <motion.div 
              className={styles.logo}
              variants={linkVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => handleNavigation(e, '/')}
            >
              <span className={styles.logo_text}>RAIN<sup>®</sup></span>
            </motion.div>
          </Link>

          <div className={styles.nav_links}>
            {navLinks.map(({ path, label }) => (
              <Link key={path} href={path} passHref prefetch={false} onClick={(e) => handleNavigation(e, path)}>
                <motion.span 
                  className={`${styles.nav_link} ${isActive(path) ? styles.active : ''}`}
                  variants={linkVariants}
                  ref={el => linkRefs.current[path] = el}
                  onHoverStart={() => setHoverLink(path)}
                  onHoverEnd={() => setHoverLink(null)}
                >
                  {label}
                </motion.span>
              </Link>
            ))}

            <AnimatePresence>
              {hoverLink && !isActive(hoverLink) && (
                <motion.div 
                  className={styles.hover_indicator}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ 
                    opacity: 1, 
                    width: getLinkDimensions(hoverLink).width,
                    x: getLinkDimensions(hoverLink).left - linkRefs.current[navLinks[0].path].getBoundingClientRect().left
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            className={styles.right_nav_elements}
            variants={linkVariants}
          >
            <motion.div 
              className={styles.theme_toggle}
              whileTap={{ scale: 0.9 }}
            >
              <div className={styles.toggle_circle}></div>
            </motion.div>

            <motion.button 
              className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} 
              onClick={toggleMenu}
              aria-label="打开菜单"
              whileTap={{ scale: 0.95 }}
            >
              <span></span>
              <span></span>
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.mobile_menu}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className={styles.menu_container}>
              <div className={styles.menu_header}>
                <motion.div 
                  className={styles.menu_logo}
                  variants={menuItemVariants}
                >
                  <span className={styles.logo_text}>RAIN<sup>®</sup></span>
                </motion.div>
                <motion.button 
                  className={`${styles.close_btn}`}
                  onClick={toggleMenu}
                  variants={menuItemVariants}
                  aria-label="关闭菜单"
                  whileTap={{ scale: 0.9 }}
                >
                  <span></span>
                  <span></span>
                </motion.button>
              </div>

              <div className={styles.menu_links}>
                {navLinks.map(({ path, label }, index) => (
                  <Link key={path} href={path} prefetch={false} onClick={(e) => handleNavigation(e, path)}>
                    <motion.div 
                      className={`${styles.menu_link} ${isActive(path) ? styles.active : ''}`}
                      variants={menuItemVariants}
                      custom={index}
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={styles.menu_link_number}>0{index + 1}</span>
                      <span className={styles.menu_link_text}>{label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              <motion.div 
                className={styles.menu_footer}
                variants={menuItemVariants}
              >
                <div className={styles.menu_social}>
                  <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="#" target="_blank" rel="noopener noreferrer">Behance</a>
                  <a href="#" target="_blank" rel="noopener noreferrer">Dribbble</a>
                </div>
                <div className={styles.menu_email}>
                  <a href="mailto:hello@rainmorime.com">hello@rainmorime.com</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 