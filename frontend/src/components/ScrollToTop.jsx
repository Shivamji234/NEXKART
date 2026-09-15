import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that whenever the URL route or query changes,
 * the window scrolls directly to the top (0, 0), avoiding being stuck
 * at the bottom when clicking footer links like Client Care, Policies, Contact, etc.
 */
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
