import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  emoji?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'pink' | 'purple' | 'green' | 'blue';
  subtitle?: string;
}

const StatCard = ({
  title,
  value,
  emoji,
  icon: Icon,
  trend = 'neutral',
  color = 'pink',
  subtitle
}: StatCardProps) => {
  const colorClasses = {
    pink: 'from-pink-100 to-rose-100 border-pink-200',
    purple: 'from-purple-100 to-pink-100 border-purple-200',
    green: 'from-green-100 to-emerald-100 border-green-200',
    blue: 'from-blue-100 to-cyan-100 border-blue-200'
  };

  const textColors = {
    pink: 'text-pink-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-xl p-5 border overflow-hidden bg-gradient-to-br ${colorClasses[color]}`}
    >
      {/* Background shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100"
        animate={{ x: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            {emoji && <span className="text-xl">{emoji}</span>}
            {Icon && <Icon className="w-5 h-5 text-gray-600" />}
          </div>
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
        </motion.div>

        {/* Trend indicator */}
        {trend !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-xs font-semibold"
          >
            {trend === 'up' ? (
              <span className="text-green-600 flex items-center gap-1">
                ↑ Going great!
              </span>
            ) : (
              <span className="text-orange-600 flex items-center gap-1">
                ↓ Keep it up!
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
