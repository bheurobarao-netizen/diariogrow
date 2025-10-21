import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lightbulb, 
  Power, 
  RefreshCw, 
  Thermometer, 
  Droplets,
  Wind,
  Zap,
  Loader2
} from 'lucide-react';

interface SmartDevice {
  id: string;
  name: string;
  online: boolean;
  category: string;
  product_name: string;
  status: Array<{
    code: string;
    value: any;
  }>;
}

const SmartHome = () => {
  const [devices, setDevices] = useState<SmartDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchDevices = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase.functions.invoke('smart-home-devices', {
        body: { action: 'list_devices' }
      });

      if (error) throw error;

      if (data.success) {
        setDevices(data.data.list || []);
        toast({
          title: 'Dispositivos atualizados',
          description: `${data.data.list?.length || 0} dispositivo(s) encontrado(s)`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Erro ao buscar dispositivos',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const sendCommand = async (deviceId: string, code: string, value: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('smart-home-devices', {
        body: {
          action: 'send_command',
          deviceId,
          commands: [{ code, value }]
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Comando enviado',
          description: 'Dispositivo atualizado com sucesso',
        });
        // Refresh device status after command
        setTimeout(() => fetchDevices(), 1000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error sending command:', error);
      toast({
        title: 'Erro ao enviar comando',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const toggleDevice = async (device: SmartDevice) => {
    const switchStatus = device.status.find(s => s.code === 'switch_1' || s.code === 'switch');
    if (switchStatus) {
      await sendCommand(device.id, switchStatus.code, !switchStatus.value);
    }
  };

  const updateBrightness = async (device: SmartDevice, brightness: number) => {
    await sendCommand(device.id, 'bright_value_v2', brightness);
  };

  const getDeviceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dj': // Smart plug
      case 'cz': // Socket
        return <Zap className="w-6 h-6" />;
      case 'dj': // Dimmer
      case 'dc': // Light
        return <Lightbulb className="w-6 h-6" />;
      case 'wk': // Temperature/Humidity
        return <Thermometer className="w-6 h-6" />;
      case 'fs': // Fan
        return <Wind className="w-6 h-6" />;
      default:
        return <Power className="w-6 h-6" />;
    }
  };

  const getDeviceStatus = (device: SmartDevice) => {
    const switchStatus = device.status.find(s => s.code === 'switch_1' || s.code === 'switch');
    return switchStatus?.value ? 'ON' : 'OFF';
  };

  const getBrightness = (device: SmartDevice) => {
    const brightness = device.status.find(s => s.code === 'bright_value_v2' || s.code === 'bright_value');
    return brightness?.value || 0;
  };

  const hasBrightnessControl = (device: SmartDevice) => {
    return device.status.some(s => s.code === 'bright_value_v2' || s.code === 'bright_value');
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart GrowRoom</h1>
          <p className="text-muted-foreground">
            Gerencie seus dispositivos Smart Life conectados
          </p>
        </div>
        <Button 
          onClick={() => fetchDevices()} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {devices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">
              Nenhum dispositivo encontrado
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Certifique-se de que seus dispositivos estão configurados no app Smart Life
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Card key={device.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      device.online 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getDeviceIcon(device.category)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{device.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {device.product_name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={device.online ? 'default' : 'secondary'}>
                    {device.online ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={getDeviceStatus(device) === 'ON' ? 'default' : 'outline'}>
                    {getDeviceStatus(device)}
                  </Badge>
                </div>

                <Button
                  onClick={() => toggleDevice(device)}
                  disabled={!device.online}
                  className="w-full"
                  variant={getDeviceStatus(device) === 'ON' ? 'default' : 'outline'}
                >
                  <Power className="w-4 h-4 mr-2" />
                  {getDeviceStatus(device) === 'ON' ? 'Desligar' : 'Ligar'}
                </Button>

                {hasBrightnessControl(device) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Intensidade</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((getBrightness(device) / 1000) * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[getBrightness(device)]}
                      onValueChange={([value]) => updateBrightness(device, value)}
                      max={1000}
                      step={10}
                      disabled={!device.online || getDeviceStatus(device) === 'OFF'}
                    />
                  </div>
                )}

                {/* Display additional sensor data if available */}
                {device.status.map((status) => {
                  if (status.code === 'cur_current') {
                    return (
                      <div key={status.code} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Corrente:</span>
                        <span className="font-medium">{(status.value / 1000).toFixed(2)} A</span>
                      </div>
                    );
                  }
                  if (status.code === 'cur_power') {
                    return (
                      <div key={status.code} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Potência:</span>
                        <span className="font-medium">{(status.value / 10).toFixed(1)} W</span>
                      </div>
                    );
                  }
                  if (status.code === 'cur_voltage') {
                    return (
                      <div key={status.code} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Voltagem:</span>
                        <span className="font-medium">{(status.value / 10).toFixed(1)} V</span>
                      </div>
                    );
                  }
                  if (status.code === 'temp_current') {
                    return (
                      <div key={status.code} className="flex items-center justify-between text-sm">
                        <Thermometer className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{(status.value / 10).toFixed(1)} °C</span>
                      </div>
                    );
                  }
                  if (status.code === 'humidity_value') {
                    return (
                      <div key={status.code} className="flex items-center justify-between text-sm">
                        <Droplets className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{status.value}%</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartHome;
