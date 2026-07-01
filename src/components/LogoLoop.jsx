import { useEffect, useRef } from 'react';
import './LogoLoop.css';

/**
 * LogoLoop — infinite horizontal logo marquee
 * Props:
 *   logos       — array of { src, alt } objects
 *   speed       — px per second (default 60)
 *   gap         — gap between logos in px (default 64)
 *   logoHeight  — logo height in px (default 52)
 *   fadeOut     — show fade edges (default true)
 *   fadeColor   — CSS color for fade (default '#ffffff')
 *   scaleOnHover— scale logo on hover (default true)
 *   pauseOnHover— pause scroll on hover (default true)
 */
export default function LogoLoop({
  logos = [],
  speed = 60,
  gap = 64,
  logoHeight = 52,
  fadeOut = true,
  fadeColor = '#ffffff',
  scaleOnHover = true,
  pauseOnHover = true,
}) {
  const trackRef = useRef(null);
  const animRef  = useRef(null);
  const posRef   = useRef(0);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait for layout to measure
    const singleWidth = track.scrollWidth / 2;

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (!pausedRef.current) {
        posRef.current += speed * delta;
        if (posRef.current >= singleWidth) {
          posRef.current -= singleWidth;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, logos]);

  const handleMouseEnter = () => { if (pauseOnHover) pausedRef.current = true; };
  const handleMouseLeave = () => { if (pauseOnHover) pausedRef.current = false; };

  return (
    <div
      className={`logoloop${fadeOut ? ' logoloop--fade' : ''}${scaleOnHover ? ' logoloop--scale-hover' : ''}`}
      style={{ '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px`, '--logoloop-fadeColor': fadeColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="logoloop__track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <ul className="logoloop__list" key={copy} aria-hidden={copy === 1}>
            {logos.map(({ src, alt }, i) => (
              <li className="logoloop__item" key={`${copy}-${i}`}>
                <span className="logoloop__node">
                  <img src={src} alt={alt} draggable={false} />
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
