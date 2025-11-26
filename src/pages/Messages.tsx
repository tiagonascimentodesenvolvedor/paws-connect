import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMatches } from '@/hooks/useMatches';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { useCurrentPet } from '@/hooks/usePets';

export default function Messages() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const currentPet = useCurrentPet();
  const { data: matches } = useMatches();
  const { data: messages } = useMessages(matchId);
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState('');

  if (!matchId) {
    return (
      <div className="min-h-screen px-4 pt-6 pb-24">
        <div className="max-w-lg mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">Mensagens</h1>
            <p className="text-muted-foreground mt-1">Suas conversas</p>
          </header>

          <div className="space-y-4">
            {matches?.map((match) => (
              <div
                key={match.id}
                className="glass-card rounded-2xl p-4 cursor-pointer hover:border-primary transition-smooth"
                onClick={() => navigate(`/messages/${match.id}`)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={match.pet?.profilePhotoUrl}
                    alt={match.pet?.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{match.pet?.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      Clique para conversar
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const match = matches?.find((m) => m.id === matchId);
  if (!match) {
    navigate('/messages');
    return null;
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !currentPet) return;

    try {
      await sendMessage.mutateAsync({
        matchId,
        senderPetId: currentPet.id,
        content: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-card border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate('/messages')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <img
            src={match.pet?.profilePhotoUrl}
            alt={match.pet?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <h2 className="font-semibold">{match.pet?.name}</h2>
            <p className="text-xs text-muted-foreground">
              {match.pet?.city} • {match.pet?.distanceKm}km
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto space-y-4">
          {messages?.map((msg, index) => {
              const isOwn = currentPet && msg.senderPetId === currentPet.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isOwn
                        ? 'gradient-primary text-white'
                        : 'glass-card'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {new Date(msg.sentAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 glass-card border-t border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex gap-2">
          <Input
            placeholder="Digite uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            size="icon"
            className="gradient-primary shadow-glow"
            onClick={handleSend}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
