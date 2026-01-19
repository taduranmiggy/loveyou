import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

interface FABAction {
  id: string;
  label: string;
  emoji: string;
  color: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  mainEmoji?: string;
}

const FloatingActionButton = ({
  actions,
  mainEmoji = '💝'
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30"
            />

            {/* Action items */}
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: -(index + 1) * 70,
                  x: 0
                }}
                exit={{ opacity: 0, scale: 0, y: 0, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`
                  absolute bottom-0 right-0 w-14 h-14 rounded-full
                  flex items-center justify-center text-xl
                  shadow-lg hover:shadow-xl transition-all
                  ${action.color}
                `}
                title={action.label}
              >
                {action.emoji}
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all
          flex items-center justify-center text-2xl
          bg-gradient-to-br from-pink-500 to-rose-500 text-white
        `}
      >
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={28} /> : mainEmoji}
        </motion.span>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
