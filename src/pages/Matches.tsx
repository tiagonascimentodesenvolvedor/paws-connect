import { BottomNav } from '@/components/BottomNav';
import { mockMatches } from '@/data/mockData';
import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Matches() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            Seus Matches
          </h1>
          <p className="text-muted-foreground mt-1">
            {mockMatches.length} {mockMatches.length === 1 ? 'match' : 'matches'}
          </p>
        </header>

        {mockMatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum match ainda</h2>
            <p className="text-muted-foreground">
              Continue deslizando para encontrar novos amigos!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-4 cursor-pointer hover:border-primary transition-smooth"
                onClick={() => navigate(`/messages/${match.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={match.pet?.profilePhotoUrl}
                      alt={match.pet?.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {match.pet?.name}, {match.pet?.age}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {match.pet?.city} • {match.pet?.distanceKm}km
                    </p>
                    {match.lastMessage && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {match.lastMessage.content}
                      </p>
                    )}
                  </div>

                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
