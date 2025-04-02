import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);
  const routeChangeCompleted = useRef(false);
  const minLoadingTime = 2500; // 最小加载时间，确保动画有足够时间完成一轮
  const loadingStartTime = useRef(0);
  
  // 监听路由变化，显示加载动画
  useEffect(() => {
    const handleRouteChangeStart = () => {
      routeChangeCompleted.current = false;
      loadingStartTime.current = Date.now();
      setIsRouteChanging(true);
      setLoadingKey(prevKey => prevKey + 1);
    };
    
    const handleRouteChangeComplete = () => {
      routeChangeCompleted.current = true;
      
      // 计算已经过去的时间
      const elapsedTime = Date.now() - loadingStartTime.current;
      
      // 如果时间不够，继续等待直到满足最小加载时间
      if (elapsedTime < minLoadingTime) {
        const remainingTime = minLoadingTime - elapsedTime;
        setTimeout(() => {
          setIsRouteChanging(false);
        }, remainingTime);
      } else {
        setIsRouteChanging(false);
      }
    };
    
    const handleRouteChangeError = () => {
      routeChangeCompleted.current = true;
      
      // 计算已经过去的时间
      const elapsedTime = Date.now() - loadingStartTime.current;
      
      // 如果时间不够，继续等待直到满足最小加载时间
      if (elapsedTime < minLoadingTime) {
        const remainingTime = minLoadingTime - elapsedTime;
        setTimeout(() => {
          setIsRouteChanging(false);
        }, remainingTime);
      } else {
        setIsRouteChanging(false);
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events]);
  
  return (
    <>
      <LoadingSpinner 
        key={`loading-${loadingKey}`} 
        fullScreen={true} 
        size="large"
        isVisible={isRouteChanging}
      />
      
      <AnimatePresence mode="wait" initial={false}>
        <Component 
          {...pageProps} 
          key={router.route} 
        />
      </AnimatePresence>
    </>
  );
}

export default MyApp; 