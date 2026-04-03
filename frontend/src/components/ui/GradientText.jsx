import React from 'react';

const GradientText = ({
  colors = ['#ffd129', '#B19EEF', '#ffffff'],
  animationSpeed = 2,
  showBorder = false,
  className = '',
  children,
}) => {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')}, ${colors[0]})`;

  return (
    <span
      className={`gradient-text ${showBorder ? 'gradient-text--border' : ''} ${className}`.trim()}
      style={{
        '--gradient-bg': gradient,
        '--gradient-speed': `${animationSpeed}s`,
      }}
    >
      {children}
    </span>
  );
};

export default GradientText;
