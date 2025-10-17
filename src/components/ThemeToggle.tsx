import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/contexts/I18nContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={isDark ? 'outline' : 'default'}
        size="default"
        onClick={toggleTheme}
        className="flex items-center gap-2 min-w-[120px]"
      >
        <Sun className="h-4 w-4" />
        {t.lightMode}
      </Button>
      <Button
        variant={isDark ? 'default' : 'outline'}
        size="default"
        onClick={toggleTheme}
        className="flex items-center gap-2 min-w-[120px]"
      >
        <Moon className="h-4 w-4" />
        {t.darkMode}
      </Button>
    </div>
  );
}
