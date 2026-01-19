import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Confetto {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

interface CelebrationProps {
  isActive: boolean;
  emojis?: string[];
  onComplete?: () => void;
}

const Celebration = ({ 
  isActive, 
  emojis = ['🎉', '✨', '💕', '🦫', '🌸', '💖', '🎊', '⭐'],
  onComplete 
}: CelebrationProps) => {
  const [confetti, setConfetti] = useState<Confetto[]>([]);

  useEffect(() => {
    if (!isActive) {
      setConfetti([]);
      return;
    }

    // Generate random confetti pieces
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random() * 1,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));

    setConfetti(newConfetti);

    // Clear after animation completes
    const timer = setTimeout(() => {
      setConfetti([]);
      onComplete?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, [isActive, emojis, onComplete]);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute text-4xl"
          initial={{
            left: `${piece.left}%`,
            top: '-50px',
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          animate={{
            top: '100vh',
            opacity: 0,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn'
          }}
        >
          {piece.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default Celebration;
