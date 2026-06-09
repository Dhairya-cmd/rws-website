import { useEffect, useRef } from 'react';

export const useSecretCode = (secretCode, onCodeMatched) => {
  const bufferRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key.length !== 1) return;

      bufferRef.current += e.key.toLowerCase();
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => { bufferRef.current = ''; }, 2000);

      if (bufferRef.current.endsWith(secretCode.toLowerCase())) {
        onCodeMatched();
        bufferRef.current = '';
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); clearTimeout(timeoutRef.current); };
  }, [secretCode, onCodeMatched]);
};