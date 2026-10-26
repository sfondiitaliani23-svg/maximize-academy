import React, { useEffect, useRef } from 'react';

// Cerchio dorato «Novità» (storie stile Instagram). Il codice delle storie si carica solo quando serve.
export default function StoriesBar() {
  const ref = useRef(null);
  useEffect(() => {
    let alive = true;
    import('../lib/storie.js').then((m) => { if (alive) m.default(ref.current); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return <div ref={ref} className="story-bar" hidden />;
}
