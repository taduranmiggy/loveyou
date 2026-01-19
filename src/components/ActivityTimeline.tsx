import { motion } from 'framer-motion';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  emoji: string;
  color?: 'pink' | 'purple' | 'green' | 'blue';
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const ActivityTimeline = ({ events, title = 'Recent Activity' }: ActivityTimelineProps) => {
  const colorClasses = {
    pink: 'bg-pink-100 text-pink-700 border-pink-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  const dotColors = {
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>📝</span>
          {title}
        </h3>
      )}

      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  colorClasses[event.color || 'pink']
                } border-2`}
                whileHover={{ scale: 1.1 }}
              >
                {event.emoji}
              </motion.div>

              {/* Timeline line */}
              {index < events.length - 1 && (
                <div className={`w-1 h-12 ${dotColors[event.color || 'pink']} mt-2 opacity-30`} />
              )}
            </div>

            {/* Event content */}
            <motion.div
              className="flex-1 pt-1"
              whileHover={{ x: 4 }}
            >
              <h4 className="font-semibold text-gray-900">{event.title}</h4>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">{event.timestamp}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
