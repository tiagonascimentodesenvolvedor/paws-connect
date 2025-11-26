import { useState, useRef } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { currentUserPet } from '@/data/mockData';
import { MapPin, Edit, Heart, Users, X, Check, Camera, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Pet, Interest } from '@/types/pet';

const availableInterests: { value: Interest; label: string }[] = [
  { value: 'playdate', label: 'Playdate' },
  { value: 'walking', label: 'Caminhada' },
  { value: 'park', label: 'Parque' },
  { value: 'training', label: 'Treinamento' },
  { value: 'daycare', label: 'Creche' },
  { value: 'friendship', label: 'Amizade' },
  { value: 'breeding', label: 'Reprodução' },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState<Pet>(currentUserPet);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await handleFileRead(file);
      setEditedPet({ ...editedPet, profilePhotoUrl: dataUrl });
    }
  };

  const handleGalleryPhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = await Promise.all(files.map(handleFileRead));
    setEditedPet({ ...editedPet, photos: [...editedPet.photos, ...newPhotos] });
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setEditedPet({
      ...editedPet,
      photos: editedPet.photos.filter((_, i) => i !== index),
    });
  };

  const toggleInterest = (interest: Interest) => {
    const interests = editedPet.interests.includes(interest)
      ? editedPet.interests.filter((i) => i !== interest)
      : [...editedPet.interests, interest];
    setEditedPet({ ...editedPet, interests });
  };

  const handleSave = () => {
    localStorage.setItem('userPet', JSON.stringify(editedPet));
    Object.assign(currentUserPet, editedPet);
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleCancel = () => {
    setEditedPet(currentUserPet);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="max-w-lg mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Perfil</h1>
          {!isEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="w-5 h-5" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleCancel}>
                <X className="w-5 h-5" />
              </Button>
              <Button size="icon" onClick={handleSave}>
                <Check className="w-5 h-5" />
              </Button>
            </div>
          )}
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
                src={editedPet.profilePhotoUrl}
                alt={editedPet.name}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <>
                  <input
                    ref={profilePhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                  <Button
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => profilePhotoInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={editedPet.name}
                        onChange={(e) => setEditedPet({ ...editedPet, name: e.target.value })}
                        className="text-2xl font-bold bg-black/50 border-white/20 text-white"
                        placeholder="Nome"
                      />
                      <Input
                        type="number"
                        value={editedPet.age}
                        onChange={(e) => setEditedPet({ ...editedPet, age: parseInt(e.target.value) })}
                        className="w-20 text-2xl font-bold bg-black/50 border-white/20 text-white"
                        placeholder="Idade"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={editedPet.city}
                        onChange={(e) => setEditedPet({ ...editedPet, city: e.target.value })}
                        className="bg-black/50 border-white/20 text-white"
                        placeholder="Cidade"
                      />
                      <Input
                        value={editedPet.country}
                        onChange={(e) => setEditedPet({ ...editedPet, country: e.target.value })}
                        className="bg-black/50 border-white/20 text-white"
                        placeholder="País"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold mb-2">
                      {editedPet.name}, {editedPet.age}
                    </h2>
                    <p className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      {editedPet.city}, {editedPet.country}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Sobre</h3>
                {isEditing ? (
                  <Textarea
                    value={editedPet.bio}
                    onChange={(e) => setEditedPet({ ...editedPet, bio: e.target.value })}
                    className="min-h-[100px]"
                    placeholder="Conte sobre seu pet..."
                  />
                ) : (
                  <p className="text-muted-foreground">{editedPet.bio}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Interesses</h3>
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    availableInterests.map(({ value, label }) => (
                      <Badge
                        key={value}
                        variant={editedPet.interests.includes(value) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleInterest(value)}
                      >
                        {label}
                      </Badge>
                    ))
                  ) : (
                    editedPet.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {availableInterests.find((i) => i.value === interest)?.label || interest}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <Label className="text-sm text-muted-foreground">Espécie</Label>
                  {isEditing ? (
                    <Input
                      value={editedPet.species}
                      onChange={(e) => setEditedPet({ ...editedPet, species: e.target.value as any })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold capitalize">{editedPet.species}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Raça</Label>
                  {isEditing ? (
                    <Input
                      value={editedPet.breed}
                      onChange={(e) => setEditedPet({ ...editedPet, breed: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold">{editedPet.breed}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Gênero</Label>
                  {isEditing ? (
                    <select
                      value={editedPet.gender}
                      onChange={(e) => setEditedPet({ ...editedPet, gender: e.target.value as any })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="male">Macho</option>
                      <option value="female">Fêmea</option>
                    </select>
                  ) : (
                    <p className="font-semibold capitalize">
                      {editedPet.gender === 'male' ? 'Macho' : 'Fêmea'}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Porte</Label>
                  {isEditing ? (
                    <Input
                      value={editedPet.size}
                      onChange={(e) => setEditedPet({ ...editedPet, size: e.target.value as any })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold capitalize">{editedPet.size}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Galeria de fotos */}
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Galeria</h3>
              {isEditing && (
                <>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryPhotosChange}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {editedPet.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden relative group">
                  <img
                    src={photo}
                    alt={`${editedPet.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveGalleryPhoto(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
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
