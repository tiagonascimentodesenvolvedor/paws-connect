import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { MapPin, Bell, Shield, LogOut, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { signOut } = useAuth();
  const [searchRadius, setSearchRadius] = useState([10]);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Configurações</h1>
        </header>

        <div className="space-y-4">
          {/* Raio de busca */}
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold">Raio de Busca</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Encontre pets em até {searchRadius[0]}km de distância
                </p>
              </div>
            </div>
            <Slider
              value={searchRadius}
              onValueChange={setSearchRadius}
              min={5}
              max={100}
              step={5}
              className="mt-4"
            />
          </div>

          {/* Notificações */}
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-1" />
                <div>
                  <Label className="text-base font-semibold">Notificações</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receba notificações de matches e mensagens
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>

          {/* Privacidade */}
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-1" />
              <div>
                <Label className="text-base font-semibold">Privacidade</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie quem pode ver seu perfil
                </p>
              </div>
            </div>
          </div>

          {/* Sobre */}
          <div className="glass-card rounded-2xl p-6 shadow-card">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1" />
              <div className="space-y-2">
                <Label className="text-base font-semibold">Sobre o PetMatch</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Versão 1.0.0 (Protótipo)</p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Termos de Uso
                  </Button>
                  <br />
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Política de Privacidade
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
