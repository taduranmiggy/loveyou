import { motion } from 'framer-motion';

interface ProgressCircleProps {
  percentage: number;
  label: string;
  color?: string;
  size?: number;
  emoji?: string;
}

const ProgressCircle = ({
  percentage,
  label,
  color = 'from-pink-400 to-rose-400',
  size = 120,
  emoji
}: ProgressCircleProps) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Extract gradient colors from Tailwind class string
  const getGradientColors = (colorClass: string) => {
    if (colorClass.includes('pink')) return ['#ec4899', '#f43f5e'];
    if (colorClass.includes('purple')) return ['#a855f7', '#9333ea'];
    if (colorClass.includes('blue')) return ['#3b82f6', '#2563eb'];
    if (colorClass.includes('green')) return ['#22c55e', '#16a34a'];
    return ['#ec4899', '#f43f5e']; // default pink
  };
  
  const [startColor, endColor] = getGradientColors(color);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {emoji && <span className="text-3xl mb-1">{emoji}</span>}
          <motion.span
            className="text-2xl font-bold text-pink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <p className="text-center text-gray-600 font-medium text-sm">{label}</p>
    </div>
  );
};

export default ProgressCircle;
