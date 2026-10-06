'use client';

import { motion, useScroll, useSpring } from 'motion/react';

// Vertical progress spine for a .roadmap-list (position:relative). The fill
// follows scroll through the list; CSS hides it under reduced motion so only
// the static track shows. Row status dots sit on top (z-index:1).
export default function ScrollSpine({ targetRef }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start 70%', 'end 70%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <div className="spine" aria-hidden="true">
      <motion.div className="spine-fill" style={{ scaleY, originY: 0 }} />
    </div>
  );
}
