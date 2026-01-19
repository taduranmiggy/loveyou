import { motion } from 'framer-motion';

interface StreakCounterProps {
  count: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const StreakCounter = ({
  count,
  label = 'Day Streak',
  size = 'md',
  animated = true
}: StreakCounterProps) => {
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl'
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`
          relative rounded-full bg-gradient-to-br from-pink-400 to-rose-500 
          flex items-center justify-center text-white font-bold shadow-lg
          ${sizes[size]}
        `}
        animate={animated ? {
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Flame emoji */}
        <motion.span
          className="absolute -top-2 -right-2 text-2xl"
          animate={animated ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🔥
        </motion.span>

        {/* Counter */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {count}
        </motion.span>
      </motion.div>

      {/* Label */}
      <p className={`text-gray-700 font-semibold text-center ${labelSizes[size]}`}>
        {label}
      </p>

      {/* Motivational message */}
      {count > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-pink-600 font-medium"
        >
          {count >= 7 ? '🌟 Amazing!' : count >= 3 ? '💪 Keep going!' : '🎯 Great start!'}
        </motion.p>
      )}
    </div>
  );
};

export default StreakCounter;
