import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLoginActions } from '@/hooks/useLoginActions';
import { cn } from '@/lib/utils';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const validateNsec = (nsec: string) => {
  return /^nsec1[a-zA-Z0-9]{58}$/.test(nsec);
};

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nsec, setNsec] = useState('');
  const [errors, setErrors] = useState<{
    nsec?: string;
    extension?: string;
  }>({});
  const login = useLoginActions();

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setNsec('');
      setErrors({});
    }
  }, [isOpen]);

  const executeLogin = async (secretKey: string) => {
    setIsLoading(true);
    setErrors({});

    try {
      await login.nsec(secretKey);
      onLogin();
      onClose();
      setNsec('');
    } catch {
      setErrors({ nsec: 'Failed to login. Please check your secret key.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtensionLogin = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await login.extension();
      onLogin();
      onClose();
    } catch {
      setErrors({ extension: 'Extension login failed. Please make sure you have a Nostr extension installed and enabled.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyLogin = () => {
    if (!nsec.trim()) {
      setErrors(prev => ({ ...prev, nsec: 'Please enter your secret key' }));
      return;
    }

    if (!validateNsec(nsec)) {
      setErrors(prev => ({ ...prev, nsec: 'Invalid secret key format. Must be a valid nsec starting with nsec1.' }));
      return;
    }
    executeLogin(nsec);
  };

  const defaultTab = 'nostr' in window ? 'extension' : 'key';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-sm max-h-[80vh] p-0 overflow-hidden rounded-lg flex flex-col")}>
        <DialogHeader className="px-4 pt-4 pb-3 border-b flex-shrink-0">
          <DialogDescription className="text-center text-sm">
            Admin Login
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-md mb-3">
              <TabsTrigger value="extension" className="text-sm">
                Extension
              </TabsTrigger>
              <TabsTrigger value="key" className="text-sm">
                Secret Key
              </TabsTrigger>
            </TabsList>

            <TabsContent value="extension" className="space-y-3">
              {errors.extension && (
                <Alert variant="destructive" className="text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{errors.extension}</AlertDescription>
                </Alert>
              )}
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-sm text-muted-foreground mb-3">
                  Login with browser extension
                </p>
                <Button
                  className="w-full"
                  onClick={handleExtensionLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login with Extension'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="key" className="space-y-3">
              <div className="space-y-3">
                <Input
                  type="password"
                  value={nsec}
                  onChange={(e) => {
                    setNsec(e.target.value);
                    if (errors.nsec) setErrors(prev => ({ ...prev, nsec: undefined }));
                  }}
                  className={errors.nsec ? 'border-destructive' : ''}
                  placeholder="Enter secret key (nsec1...)"
                  autoComplete="off"
                />
                {errors.nsec && (
                  <Alert variant="destructive" className="text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{errors.nsec}</AlertDescription>
                  </Alert>
                )}
                <Button
                  className="w-full"
                  onClick={handleKeyLogin}
                  disabled={isLoading || !nsec.trim()}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;