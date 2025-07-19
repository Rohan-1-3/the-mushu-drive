import React, { useRef, useState, useEffect } from 'react';
import FiveStars from '../ui/FiveStars';

function ReviewCard({
  name,
  text,
  value
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (container && textEl) {
      const containerHeight = container.offsetHeight;
      const textHeight = textEl.scrollHeight;

      const extra = textHeight - containerHeight;

      if (extra > 0) {
        setScrollY(extra);
        const pixelsPerSecond = 30;
        const newDuration = (extra / pixelsPerSecond) * 1000;
        setDuration(newDuration);
      } else {
        setScrollY(0);
        setDuration(0);
      }
    }
  }, [text]);

  return (
    <div
      className="flex flex-col flex-shrink-0 w-full sm:w-1/4 max-w-full 
      rounded-2xl shadow-md p-6 mx-2 hover:shadow-lg duration-300 border border-secondary group
      transform transition-transform 
                hover:-translate-y-2 "
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <FiveStars value={value} />
      <p className="font-semibold mt-2">{name}</p>

      {/* Review container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden mt-2 h-[2rem] sm:h-[5.5em]"
      >
        <div
          ref={textRef}
          className="italic text-white"
          style={{
            transform: `translateY(${hovering ? -scrollY : 0}px)`,
            transition: hovering ? `transform ${duration}ms linear` : 'none',
          }}
        >
          "{text}"
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
