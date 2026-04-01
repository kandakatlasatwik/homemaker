import React from "react";

const StarBorder = ({
  as: Component = "div",
  className = "",
  color = "#ff4dd2",
  secondaryColor = "#ffb92d",
  speed = "5s",
  children,
  style,
  ...props
}) => {
  return (
    <Component
      className={`star-border ${className}`.trim()}
      style={{
        "--star-border-color": color,
        "--star-border-color-2": secondaryColor,
        "--star-border-speed": speed,
        ...style,
      }}
      {...props}
    >
      <span className="star-border__glow" aria-hidden="true" />
      <span className="star-border__content">{children}</span>
    </Component>
  );
};

export default StarBorder;