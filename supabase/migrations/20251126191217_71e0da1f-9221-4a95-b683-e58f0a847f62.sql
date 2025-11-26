-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed TEXT,
  age INTEGER NOT NULL CHECK (age > 0),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'extra_large')),
  weight_kg NUMERIC CHECK (weight_kg > 0),
  bio TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  profile_photo_url TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create swipes table
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  swiped_pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'superlike')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(swiper_pet_id, swiped_pet_id)
);

ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet1_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  pet2_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(pet1_id, pet2_id),
  CHECK (pet1_id < pet2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for pets
CREATE POLICY "Anyone can view active pets"
  ON public.pets FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert their own pets"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own pets"
  ON public.pets FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own pets"
  ON public.pets FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for swipes
CREATE POLICY "Users can view swipes from their pets"
  ON public.swipes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = swipes.swiper_pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert swipes for their pets"
  ON public.swipes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = swipes.swiper_pet_id
      AND pets.owner_id = auth.uid()
    )
  );

-- RLS Policies for matches
CREATE POLICY "Users can view their pet's matches"
  ON public.matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id IN (matches.pet1_id, matches.pet2_id)
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "System can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their matches"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.matches
      JOIN public.pets ON pets.id IN (matches.pet1_id, matches.pet2_id)
      WHERE matches.id = messages.match_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches
      JOIN public.pets ON pets.id IN (matches.pet1_id, matches.pet2_id)
      WHERE matches.id = messages.match_id
      AND pets.owner_id = auth.uid()
      AND pets.id = messages.sender_pet_id
    )
  );

-- Create index for better performance
CREATE INDEX idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX idx_swipes_swiper_pet_id ON public.swipes(swiper_pet_id);
CREATE INDEX idx_swipes_swiped_pet_id ON public.swipes(swiped_pet_id);
CREATE INDEX idx_matches_pet1_id ON public.matches(pet1_id);
CREATE INDEX idx_matches_pet2_id ON public.matches(pet2_id);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_messages_sender_pet_id ON public.messages(sender_pet_id);