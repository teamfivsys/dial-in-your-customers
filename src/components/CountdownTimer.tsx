import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  compact?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const CountdownTimer = ({
  targetDate,
  compact = false,
  showIcon = true,
  className = ""
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const getUrgencyColor = () => {
    if (timeLeft.days >= 7) return "text-green-500";
    if (timeLeft.days >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getUrgencyBg = () => {
    if (timeLeft.days >= 7) return "bg-green-500/10 border-green-500/30";
    if (timeLeft.days >= 3) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  if (isExpired) {
    return null;
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 rounded-full glass ${getUrgencyBg()} backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 border shadow-sm ${className}`}
      >
        {showIcon && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Clock className={`h-3 w-3 md:h-4 md:w-4 ${getUrgencyColor()}`} />
          </motion.div>
        )}
        <span className={`text-xs md:text-sm font-bold ${getUrgencyColor()}`}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2"
        >
          <Clock className={`h-5 w-5 ${getUrgencyColor()}`} />
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Offer Ends In:
          </h3>
        </motion.div>

        <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-md">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`glass rounded-lg ${getUrgencyBg()} backdrop-blur-sm p-3 md:p-4 border shadow-lg`}
            >
              <motion.div
                key={item.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`text-2xl md:text-4xl font-bold ${getUrgencyColor()} text-center`}
              >
                {String(item.value).padStart(2, "0")}
              </motion.div>
              <div className="text-xs md:text-sm text-muted-foreground text-center mt-1">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm md:text-base text-center font-medium text-muted-foreground"
        >
          {timeLeft.days < 1 ? (
            <span className="text-red-500 font-bold">
              Final hours! Register now before prices increase
            </span>
          ) : timeLeft.days < 3 ? (
            <span className="text-yellow-500 font-semibold">
              Only {timeLeft.days} days left to save ₹2,000
            </span>
          ) : (
            `Launch price ends March 15th - Save ₹2,000`
          )}
        </motion.p>
      </div>
    </motion.div>
  );
};
