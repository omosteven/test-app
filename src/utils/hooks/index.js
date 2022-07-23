import React from "react";

export const useRenderCounter = (thing) => {
  const renderCount = React.useRef(1);
  React.useEffect(() => {
    renderCount.current += 1;
  });
  return `Render count for ${thing} ${renderCount.current}`;
};
