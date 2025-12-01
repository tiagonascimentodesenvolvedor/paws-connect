import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUserPet } from '@/data/mockData';
import { MapPin, Edit, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="max-w-lg mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <Button variant="outline" size="icon">
            <Edit className="w-5 h-5" />
          </Button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Foto de perfil e info básica */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-card">
            <div className="relative h-80">
              <img
                src={currentUserPet.profilePhotoUrl}
                alt={currentUserPet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {currentUserPet.name}, {currentUserPet.age}
                </h2>
                <p className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  {currentUserPet.city}, {currentUserPet.country}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Sobre</h3>
                <p className="text-muted-foreground">{currentUserPet.bio}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Interesses</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUserPet.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Espécie</p>
                  <p className="font-semibold capitalize">{currentUserPet.species}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Raça</p>
                  <p className="font-semibold">{currentUserPet.breed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gênero</p>
                  <p className="font-semibold capitalize">
                    {currentUserPet.gender === 'male' ? 'Macho' : 'Fêmea'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Porte</p>
                  <p className="font-semibold capitalize">{currentUserPet.size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Galeria de fotos */}
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Galeria</h3>
            <div className="grid grid-cols-3 gap-2">
              {currentUserPet.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={photo}
                    alt={`${currentUserPet.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 text-center shadow-card">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2 fill-primary" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Likes recebidos</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center shadow-card">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Matches</p>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
