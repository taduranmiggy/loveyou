import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  emoji?: string;
  title?: string;
}

const EnhancedCard = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  emoji,
  title
}: EnhancedCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.2)' } : {}}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-2xl border border-pink-200 overflow-hidden
        ${gradient 
          ? 'bg-gradient-to-br from-pink-50 to-purple-50' 
          : 'bg-white/80 backdrop-blur-sm'
        }
        ${hover ? 'hover:border-pink-400 cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Shimmer effect on hover - only visible on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
      />

      <div className="relative p-6">
        {/* Title with emoji */}
        {title && (
          <div className="flex items-center gap-2 mb-4">
            {emoji && <span className="text-2xl">{emoji}</span>}
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </motion.div>
  );
};

export default EnhancedCard;
