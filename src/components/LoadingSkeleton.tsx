import { motion } from 'framer-motion';

interface SkeletonProps {
  type?: 'card' | 'text' | 'circle' | 'line' | 'avatar';
  count?: number;
  className?: string;
}

const Skeleton = ({ type = 'card', count = 1, className = '' }: SkeletonProps) => {
  const shimmer = {
    initial: { backgroundPosition: '1000px 0' },
    animate: {
      backgroundPosition: '-1000px 0'
    }
  };

  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:1000px_100%]';

  const skeletons = {
    card: (
      <motion.div
        {...shimmer}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${baseClasses} rounded-2xl h-40 ${className}`}
      />
    ),
    text: (
      <motion.div
        {...shimmer}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${baseClasses} rounded h-4 mb-2 ${className}`}
      />
    ),
    line: (
      <motion.div
        {...shimmer}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${baseClasses} rounded h-2 ${className}`}
      />
    ),
    circle: (
      <motion.div
        {...shimmer}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${baseClasses} rounded-full w-12 h-12 ${className}`}
      />
    ),
    avatar: (
      <motion.div
        {...shimmer}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${baseClasses} rounded-full w-20 h-20 ${className}`}
      />
    )
  };

  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-4">
          {skeletons[type]}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
