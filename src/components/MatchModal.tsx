import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pet } from '@/types/pet';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
}

export function MatchModal({ isOpen, onClose, pet }: MatchModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Confetti explosion
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    onClose();
    navigate('/messages');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateZ: -10 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateZ: 10 }}
              transition={{ 
                type: "spring", 
                duration: 0.5,
                bounce: 0.4
              }}
              className="glass-card rounded-3xl p-8 max-w-md w-full pointer-events-auto relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Animated hearts background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-primary/20"
                    initial={{ y: "100%", x: `${Math.random() * 100}%`, scale: 0 }}
                    animate={{ 
                      y: "-100%", 
                      scale: [0, 1.5, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="w-8 h-8" fill="currentColor" />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-24 h-24 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow"
                >
                  <Heart className="w-12 h-12 text-white" fill="white" />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent"
                >
                  It's a Match! 💕
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  Você e {pet.name} se curtiram mutuamente!
                </motion.p>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <img
                    src={pet.profilePhotoUrl}
                    alt={pet.name}
                    className="w-32 h-32 rounded-2xl object-cover mx-auto shadow-card border-4 border-primary/20"
                  />
                  <p className="mt-3 font-semibold text-lg">
                    {pet.name}, {pet.age}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pet.city} • {pet.distanceKm}km
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <Button
                    className="w-full gradient-primary shadow-glow text-lg py-6"
                    onClick={handleSendMessage}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    Continuar Navegando
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
