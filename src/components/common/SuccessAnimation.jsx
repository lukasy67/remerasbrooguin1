import React from 'react';
import { ANIMATION_THEMES } from '../../utils/constants';

const SuccessAnimation = React.memo(function SuccessAnimation({ themeIndex }) {
  const theme = ANIMATION_THEMES[themeIndex] || ANIMATION_THEMES[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}vw`,
            fontSize: `${1.5 + Math.random() * 2}rem`,
            animation: `${theme.a} ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 1.5}s forwards`,
            opacity: 0,
          }}
        >
          {theme.e[Math.floor(Math.random() * theme.e.length)]}
        </div>
      ))}
    </div>
  );
});

export default SuccessAnimation;
