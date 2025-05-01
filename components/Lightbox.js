import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/Lightbox.module.scss'; // We'll create this SCSS file next

const Lightbox = ({ image, onClose, onPrev, onNext }) => {
  // Handle keyboard navigation and prevent scrolling
  useEffect(() => {
    // Get all scrollable elements and disable them
    const disableScroll = () => {
      // Disable scrolling on both html and body
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    };

    // Re-enable scrolling on all elements
    const enableScroll = () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
      if (event.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };

    // --- ADDED: Handle mouse wheel scroll for navigation ---
    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Directly trigger navigation based on scroll direction
      if (event.deltaY > 0 && onNext) { // Scroll down
        onNext();
      } else if (event.deltaY < 0 && onPrev) { // Scroll up
        onPrev();
      }
    };
    // --- END ADDED ---

    // Global event to prevent all wheel events anywhere (keep this for background scroll prevention)
    const preventWheel = (e) => {
      // Only prevent default if the event target is NOT inside the lightbox image/controls
      // This allows potential future scrollable content *within* the lightbox if needed.
      // For now, we are letting handleWheel manage the default prevention for the overlay.
      // e.preventDefault();
      // e.stopPropagation();
      return false;
    };

    // Apply all scroll prevention methods
    disableScroll();
    window.addEventListener('keydown', handleKeyDown);
    // Add the wheel listener specifically for navigation within the lightbox
    const lightboxElement = document.querySelector(`.${styles.lightboxOverlay}`);
    if (lightboxElement) {
        lightboxElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    // We might still need the global listener for touch/other edge cases, but let's test without it first
    // window.addEventListener('wheel', preventWheel, { passive: false });
    // window.addEventListener('touchmove', preventWheel, { passive: false });
    
    // Cleanup listeners and restore scrolling on component unmount
    return () => {
      enableScroll();
      window.removeEventListener('keydown', handleKeyDown);
      if (lightboxElement) {
          lightboxElement.removeEventListener('wheel', handleWheel);
      }
      // No timeout to clear anymore
      // window.removeEventListener('wheel', preventWheel);
      // window.removeEventListener('touchmove', preventWheel);
    };
    // Ensure styles.lightboxOverlay is available in the DOM for the querySelector
  }, [onClose, onPrev, onNext, styles.lightboxOverlay]);

  // Render the lightbox directly in the document body using a portal
  // This ensures it's outside any stacking contexts that might affect z-index
  return ReactDOM.createPortal(
    <div className={styles.lightboxOverlay} onClick={onClose}> 
      <div className={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}> 
        <button className={`${styles.lightboxButton} ${styles.closeButton}`} onClick={onClose}>
          &times; {/* Close Icon */} 
        </button>

        {onPrev && (
          <button 
            className={`${styles.lightboxButton} ${styles.prevButton}`} 
            onClick={onPrev}
          >
            &lt; {/* Prev Icon */} 
          </button>
        )}

        <img 
          src={image.src} 
          alt={image.caption || 'Lightbox image'} 
          className={styles.lightboxImage} 
        />
        {image.caption && (
          <p className={styles.lightboxCaption}>{image.caption}</p>
        )}

        {onNext && (
          <button 
            className={`${styles.lightboxButton} ${styles.nextButton}`} 
            onClick={onNext}
          >
            &gt; {/* Next Icon */} 
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Lightbox; 