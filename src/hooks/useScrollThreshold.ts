import { useEffect, useState } from 'react';

export function useScrollThreshold(threshold: number = 200) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsPastThreshold(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isPastThreshold;
}
