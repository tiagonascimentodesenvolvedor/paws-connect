import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, Star, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { MatchModal } from '@/components/MatchModal';
import { mockPets } from '@/data/mockData';
import { Pet, SwipeAction } from '@/types/pet';
import { toast } from 'sonner';

export default function Swipe() {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentPet = pets[currentIndex];

  const handleSwipe = (action: SwipeAction) => {
    if (action === 'like' || action === 'superlike') {
      // Simula 30% de chance de match
      if (Math.random() > 0.7) {
        setMatchedPet(currentPet);
        setShowMatchModal(true);
      }
    }

    setCurrentIndex((prev) => prev + 1);
    x.set(0);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        handleSwipe('like');
      } else {
        handleSwipe('pass');
      }
    } else {
      x.set(0);
    }
  };

  if (currentIndex >= pets.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pb-24">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sem mais pets por enquanto</h2>
          <p className="text-muted-foreground mb-6">
            Volte mais tarde para conhecer novos amigos!
          </p>
          <Button onClick={() => { setPets(mockPets); setCurrentIndex(0); }}>
            Reiniciar
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="relative h-[600px] mb-6">
          <motion.div
            className="absolute inset-0 glass-card rounded-3xl overflow-hidden shadow-card"
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing' }}
          >
            <img
              src={currentPet.profilePhotoUrl}
              alt={currentPet.name}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    {currentPet.name}, {currentPet.age}
                  </h2>
                  <p className="text-white/80 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {currentPet.city} • {currentPet.distanceKm}km
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white bg-white/20 backdrop-blur-sm"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="w-5 h-5" />
                </Button>
              </div>

              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-white/90">{currentPet.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentPet.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="bg-white/20 backdrop-blur-sm border-0">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-white/70">
                    {currentPet.breed} • {currentPet.gender === 'male' ? 'Macho' : 'Fêmea'}
                    {currentPet.weightKg && ` • ${currentPet.weightKg}kg`}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Indicadores de swipe */}
          <motion.div
            className="absolute top-20 left-8 px-6 py-3 bg-destructive rounded-2xl font-bold text-2xl rotate-[-20deg] opacity-0"
            style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
          >
            NOPE
          </motion.div>
          <motion.div
            className="absolute top-20 right-8 px-6 py-3 bg-primary rounded-2xl font-bold text-2xl rotate-[20deg] opacity-0"
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
          >
            LIKE
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-smooth"
            onClick={() => handleSwipe('pass')}
          >
            <X className="w-8 h-8" />
          </Button>
          
          <Button
            size="icon"
            className="w-20 h-20 rounded-full gradient-primary shadow-glow transition-smooth hover:scale-110"
            onClick={() => handleSwipe('like')}
          >
            <Heart className="w-10 h-10" />
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-white transition-smooth"
            onClick={() => handleSwipe('superlike')}
          >
            <Star className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {matchedPet && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          pet={matchedPet}
        />
      )}

      <BottomNav />
    </div>
  );
}
