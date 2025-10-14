// NOTE: This file is stable and usually should not be modified.
// It is important that all functionality in this file is preserved, and should only be modified if explicitly requested.

import { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import LoginDialog from './LoginDialog';
import { useLoggedInAccounts } from '@/hooks/useLoggedInAccounts';
import { AccountSwitcher } from './AccountSwitcher';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

export interface LoginAreaProps {
  className?: string;
}

export function LoginArea({ className }: LoginAreaProps) {
  const { currentUser } = useLoggedInAccounts();
  const { t } = useI18n();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleLogin = () => {
    setLoginDialogOpen(false);
  };

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      {currentUser ? (
        <AccountSwitcher onAddAccountClick={() => setLoginDialogOpen(true)} />
      ) : (
        <Button
          onClick={() => setLoginDialogOpen(true)}
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 text-sm"
        >
          <User className="w-4 h-4" />
          <span>{t.login}</span>
        </Button>
      )}

      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}