import React from 'react';

const ShinyText = ({
  text,
  speed = 2,
  delay = 0,
  color = '#51370b',
  shineColor = '#fafffc',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
}) => {
  const animationName = direction === 'left' ? 'shiny-left' : 'shiny-right';

  const style = {
    '--shiny-color': color,
    '--shiny-shine-color': shineColor,
    '--shiny-spread': `${spread}px`,
    '--shiny-duration': `${speed}s`,
    '--shiny-delay': `${delay}s`,
    '--shiny-iteration': yoyo ? 'infinite' : '1',
    '--shiny-direction': yoyo ? 'alternate' : 'normal',
  };

  return (
    <span
      className={`shiny-text ${disabled ? 'is-disabled' : ''} ${pauseOnHover ? 'pause-on-hover' : ''}`}
      style={style}
      data-animation={animationName}
    >
      {text}
    </span>
  );
};

export default ShinyText;
