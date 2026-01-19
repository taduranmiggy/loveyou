import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  emoji?: string;
}

const Tooltip = ({ text, children, position = 'top', emoji }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${positionClasses[position]} left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none`}
          >
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
              {emoji && <span>{emoji}</span>}
              {text}
              <div className={`absolute w-2 h-2 bg-gray-900 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2' : 
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2' : ''
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
