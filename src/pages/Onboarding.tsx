import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { Species, Gender, Size, Interest } from '@/types/pet';

const countries = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'United States' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'España' },
  { code: 'AR', name: 'Argentina' },
  { code: 'MX', name: 'México' },
];

const speciesOptions: { value: Species; label: string }[] = [
  { value: 'dog', label: 'Cachorro' },
  { value: 'cat', label: 'Gato' },
  { value: 'bird', label: 'Pássaro' },
  { value: 'rabbit', label: 'Coelho' },
  { value: 'other', label: 'Outro' },
];

const sizeOptions: { value: Size; label: string }[] = [
  { value: 'small', label: 'Pequeno' },
  { value: 'medium', label: 'Médio' },
  { value: 'large', label: 'Grande' },
  { value: 'extra_large', label: 'Extra Grande' },
];

const interestOptions: { value: Interest; label: string; emoji: string }[] = [
  { value: 'playdate', label: 'Encontros para brincar', emoji: '🎾' },
  { value: 'walking', label: 'Caminhadas em grupo', emoji: '🚶' },
  { value: 'park', label: 'Passeios no parque', emoji: '🌳' },
  { value: 'training', label: 'Treinamento conjunto', emoji: '🎓' },
  { value: 'daycare', label: 'Creche/Day care', emoji: '🏠' },
  { value: 'friendship', label: 'Amizade', emoji: '❤️' },
  { value: 'breeding', label: 'Reprodução', emoji: '👶' },
];

const step1Schema = z.object({
  country: z.string().min(1, 'Selecione um país'),
  city: z.string().min(2, 'Digite sua cidade').max(100),
});

const step2Schema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome não pode conter números ou caracteres especiais'),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other'], { required_error: 'Selecione uma espécie' }),
  breed: z.string().max(100).optional(),
  age: z.number().min(0, 'Idade deve ser positiva').max(30, 'Idade máxima é 30 anos'),
  gender: z.enum(['male', 'female'], { required_error: 'Selecione o gênero' }),
  size: z.enum(['small', 'medium', 'large', 'extra_large']).optional(),
  weightKg: z.number().min(0).optional(),
  bio: z.string()
    .min(10, 'Bio muito curta (mínimo 10 caracteres)')
    .max(500, 'Máximo 500 caracteres')
    .refine(val => !val.match(/https?:\/\//), 'Bio não pode conter links'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

interface OnboardingData {
  country: string;
  city: string;
  name: string;
  species: Species;
  breed?: string;
  age: number;
  gender: Gender;
  size?: Size;
  weightKg?: number;
  bio: string;
  profilePhoto?: string;
  photos: string[];
  interests: Interest[];
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    photos: [],
    interests: [],
  });

  const handleComplete = () => {
    // Salvar pet no localStorage
    const newPet = {
      id: 'current-user-pet',
      ownerId: 'current-user',
      ...onboardingData,
      profilePhotoUrl: onboardingData.profilePhoto || '',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('currentUserPet', JSON.stringify(newPet));
    localStorage.setItem('hasCompletedOnboarding', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header com progresso */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-foreground">Cadastro do Pet</h1>
            <span className="text-sm text-muted-foreground">Passo {currentStep} de 4</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-all ${
                  step <= currentStep
                    ? 'bg-gradient-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo dos passos */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1
                key="step1"
                data={onboardingData}
                onNext={(data) => {
                  setOnboardingData({ ...onboardingData, ...data });
                  setCurrentStep(2);
                }}
              />
            )}
            {currentStep === 2 && (
              <Step2
                key="step2"
                data={onboardingData}
                onNext={(data) => {
                  setOnboardingData({ ...onboardingData, ...data });
                  setCurrentStep(3);
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <Step3
                key="step3"
                data={onboardingData}
                onNext={(data) => {
                  setOnboardingData({ ...onboardingData, ...data });
                  setCurrentStep(4);
                }}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <Step4
                key="step4"
                data={onboardingData}
                onNext={(data) => {
                  setOnboardingData({ ...onboardingData, ...data });
                  handleComplete();
                }}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Step 1: Seleção de País
function Step1({ data, onNext }: { data: Partial<OnboardingData>; onNext: (data: Step1Data) => void }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      country: data.country || '',
      city: data.city || '',
    },
  });

  const selectedCountry = watch('country');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Onde você está?</h2>
        <p className="text-muted-foreground">Vamos encontrar pets perto de você</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Select value={selectedCountry} onValueChange={(value) => setValue('country', value)}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Selecione seu país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Ex: São Paulo"
            className="bg-card border-border"
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg">
          Continuar <ArrowRight className="ml-2" />
        </Button>
      </form>
    </motion.div>
  );
}

// Step 2: Informações do Pet
function Step2({ 
  data, 
  onNext, 
  onBack 
}: { 
  data: Partial<OnboardingData>; 
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      name: data.name || '',
      species: data.species,
      breed: data.breed || '',
      age: data.age || 1,
      gender: data.gender,
      size: data.size,
      weightKg: data.weightKg,
      bio: data.bio || '',
    },
  });

  const species = watch('species');
  const gender = watch('gender');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Conte sobre seu pet</h2>
        <p className="text-muted-foreground">Informações básicas para o perfil</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Ex: Max"
            className="bg-card border-border"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Espécie *</Label>
            <Select value={species} onValueChange={(value) => setValue('species', value as Species)}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {speciesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.species && <p className="text-sm text-destructive">{errors.species.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Raça</Label>
            <Input
              id="breed"
              {...register('breed')}
              placeholder="Ex: Labrador"
              className="bg-card border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Idade (anos) *</Label>
            <Input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              placeholder="Ex: 3"
              className="bg-card border-border"
            />
            {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Gênero *</Label>
            <RadioGroup value={gender} onValueChange={(value) => setValue('gender', value as Gender)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Macho</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Fêmea</Label>
                </div>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
          </div>
        </div>

        {(species === 'dog' || species === 'cat') && (
          <div className="space-y-2">
            <Label>Porte</Label>
            <Select value={watch('size')} onValueChange={(value) => setValue('size', value as Size)}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="weightKg">Peso (kg)</Label>
          <Input
            id="weightKg"
            type="number"
            step="0.1"
            {...register('weightKg', { valueAsNumber: true })}
            placeholder="Ex: 25.5"
            className="bg-card border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            {...register('bio')}
            placeholder="Conte um pouco sobre a personalidade do seu pet..."
            className="bg-card border-border min-h-[120px]"
            maxLength={500}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {errors.bio ? errors.bio.message : 'Mínimo 10 caracteres'}
            </span>
            <span className="text-muted-foreground">{watch('bio')?.length || 0}/500</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2" /> Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Continuar <ArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// Step 3: Fotos
function Step3({ 
  data, 
  onNext, 
  onBack 
}: { 
  data: Partial<OnboardingData>; 
  onNext: (data: { profilePhoto: string; photos: string[] }) => void;
  onBack: () => void;
}) {
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(data.profilePhoto);
  const [photos, setPhotos] = useState<string[]>(data.photos || []);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 5MB');
      return;
    }

    // Validar formato
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP');
      return;
    }

    setError('');

    // Criar URL de preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (isProfile) {
        setProfilePhoto(result);
      } else {
        if (photos.length < 8) {
          setPhotos([...photos, result]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!profilePhoto) {
      setError('Foto de perfil é obrigatória');
      return;
    }
    onNext({ profilePhoto, photos });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Adicione fotos</h2>
        <p className="text-muted-foreground">Mostre o melhor do seu pet</p>
      </div>

      <div className="space-y-6">
        {/* Foto de perfil */}
        <div className="space-y-2">
          <Label>Foto de Perfil *</Label>
          <div className="flex items-center gap-4">
            {profilePhoto ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                <button
                  onClick={() => setProfilePhoto(undefined)}
                  className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-card hover:bg-muted cursor-pointer flex flex-col items-center justify-center transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Upload</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Galeria de fotos */}
        <div className="space-y-2">
          <Label>Galeria (até 8 fotos)</Label>
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {photos.length < 8 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-card hover:bg-muted cursor-pointer flex flex-col items-center justify-center transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Adicionar</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2" /> Voltar
          </Button>
          <Button onClick={handleNext} className="flex-1">
            Continuar <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Step 4: Interesses
function Step4({ 
  data, 
  onNext, 
  onBack 
}: { 
  data: Partial<OnboardingData>; 
  onNext: (data: { interests: Interest[] }) => void;
  onBack: () => void;
}) {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(data.interests || []);
  const [error, setError] = useState('');

  const toggleInterest = (interest: Interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        setError('Máximo 5 interesses');
      }
    }
    setError('');
  };

  const handleNext = () => {
    if (selectedInterests.length === 0) {
      setError('Selecione pelo menos 1 interesse');
      return;
    }
    onNext({ interests: selectedInterests });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">O que vocês procuram?</h2>
        <p className="text-muted-foreground">Selecione de 1 a 5 interesses</p>
      </div>

      <div className="space-y-4">
        {interestOptions.map((option) => {
          const isSelected = selectedInterests.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggleInterest(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-foreground font-medium">{option.label}</span>
                {isSelected && (
                  <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {selectedInterests.length} de 5 selecionados
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2" /> Voltar
        </Button>
        <Button onClick={handleNext} className="flex-1" disabled={selectedInterests.length === 0}>
          Concluir
        </Button>
      </div>
    </motion.div>
  );
}
