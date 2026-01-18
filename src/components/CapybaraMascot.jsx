import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CapybaraMascot = () => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    
    // Reset click count if more than 3 seconds passed
    if (timeSinceLastClick > 3000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);

    // Different responses based on click count and timing
    let messages = [];
    let icon = '🦫';
    let duration = 3000;

    if (clickCount === 0 || timeSinceLastClick > 3000) {
      // First click or after long pause
      messages = [
        "Hi there! I'm your capybara companion! 🦫💕",
        "Need some encouragement? I'm here for you! ✨",
        "You're doing amazing with your pill tracking! 🌸",
        "Remember: consistency is key! You've got this! 💪",
        "I believe in you! Keep up the great work! 🌟"
      ];
    } else if (clickCount === 1) {
      // Second click quickly
      messages = [
        "Oh, you clicked me again! I love the attention! 🥰",
        "Double click = double the encouragement! 💕💕",
        "Aww, you're so sweet! 🦫😊",
        "I'm getting excited! What's up? 🎉",
        "Two clicks means you really need me! I'm here! 🤗"
      ];
    } else if (clickCount === 2) {
      // Third click - getting playful
      messages = [
        "Three times! You must really like me! 🦫❤️",
        "I'm blushing! This is so nice! 😊💖",
        "Triple click! Are we playing a game? 🎮",
        "You're making me so happy! 🌈✨",
        "Three's the charm! I'm your lucky capybara! 🍀"
      ];
      icon = '💖';
    } else if (clickCount >= 3 && clickCount < 7) {
      // Multiple clicks - very excited
      messages = [
        "WOW! You really love clicking me! 🦫🎉",
        "I'm so excited! This is the best day ever! 🌟",
        "You're making me do happy dances! 💃",
        "So many clicks! I feel so loved! 🥰❤️",
        "I'm your biggest fan too! Keep clicking! 🎊"
      ];
      icon = '🎉';
      duration = 2500;
    } else {
      // Lots of clicks - special responses
      messages = [
        "OKAY OKAY! You win! I'm officially your best friend! 🦫👑",
        "You've unlocked the secret capybara level! 🔓✨",
        "I'm running out of cute things to say! You're amazing! 😂",
        "Achievement unlocked: Capybara Whisperer! 🏆",
        "You must REALLY need a pill reminder! Check your calendar! 📅💊"
      ];
      icon = '👑';
      duration = 4000;
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    toast.success(randomMessage, {
      duration: duration,
      style: {
        background: '#fce7f3',
        color: '#831843',
        border: '2px solid #f9a8d4',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '300px'
      },
      icon: icon
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-gradient-to-br from-capybara-200 to-capybara-300 rounded-full p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        <span className="text-4xl block">
          <img 
            src="/src/assets/cutesycapybara.png" 
            alt="Cutesy Capybara" 
            className="w-12 h-12 object-contain"
          />
        </span>
      </motion.div>
      
      {/* Speech bubble that appears occasionally */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          delay: 10,
          repeat: Infinity,
          repeatDelay: 20
        }}
        className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl p-3 shadow-lg border border-pink-200 min-w-max"
      >
        <div className="text-pink-600 text-sm font-medium">
          Don't forget your pill! 💊✨
        </div>
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
      </motion.div>
    </motion.div>
  );
};

export default CapybaraMascot;
