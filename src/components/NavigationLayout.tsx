import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTheme } from '@/hooks/useTheme';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginArea } from '@/components/auth/LoginArea';
import { 
  Menu, 
  Home, 
  Building, 
  Info, 
  MessageCircle, 
  Settings,
  Sun,
  Moon,
  LogIn
} from 'lucide-react';

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: t.home, icon: Home },
    { path: '/properties', label: t.properties, icon: Building },
    { path: '/about', label: t.about, icon: Info },
    { path: '/contact', label: t.contact, icon: MessageCircle }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary text-primary-foreground rounded-lg p-2">
                  <Building className="h-6 w-6" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-lg">CCS</div>
                  <div className="text-xs text-muted-foreground">Creative Construction</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hidden sm:flex"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Login Area */}
              <div className="hidden sm:block">
                <LoginArea />
              </div>

              {/* Admin Link */}
              {user && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    {t.admin}
                  </Button>
                </Link>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center space-x-2 pb-4 border-b">
                      <div className="bg-primary text-primary-foreground rounded-lg p-2">
                        <Building className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{t.companyName}</div>
                        <div className="text-xs text-muted-foreground">Real Estate & Construction</div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-2 py-6 flex-1">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link 
                            key={item.path} 
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button 
                              variant={isActive(item.path) ? "default" : "ghost"}
                              className="w-full justify-start gap-3"
                            >
                              <IconComponent className="h-5 w-5" />
                              {item.label}
                            </Button>
                          </Link>
                        );
                      })}
                      
                      {user && (
                        <Link 
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="outline" className="w-full justify-start gap-3">
                            <Settings className="h-5 w-5" />
                            {t.admin}
                          </Button>
                        </Link>
                      )}
                    </nav>

                    {/* Mobile Footer Actions */}
                    <div className="border-t pt-4 space-y-4">
                      {/* Theme Toggle */}
                      <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        className="w-full justify-start gap-3"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="h-5 w-5" />
                            {t.lightMode}
                          </>
                        ) : (
                          <>
                            <Moon className="h-5 w-5" />
                            {t.darkMode}
                          </>
                        )}
                      </Button>

                      {/* Language Switcher */}
                      <div className="px-2">
                        <LanguageSwitcher />
                      </div>

                      {/* Login/User Info */}
                      {user ? (
                        <div className="px-2">
                          <div className="text-sm text-muted-foreground mb-2">Logged in as:</div>
                          <div className="font-medium">{user.pubkey.slice(0, 8)}...</div>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full justify-start gap-3">
                          <LogIn className="h-5 w-5" />
                          {t.login}
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary text-primary-foreground rounded-lg p-2">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-lg">{t.companyName}</div>
                  <div className="text-sm text-muted-foreground">Real Estate & Construction</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                {t.companyDescription}
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Muscat, Sultanate of Oman</p>
                <p>Phone: +968 1234 5678</p>
                <p>Email: info@creativeccs.om</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Real Estate Development</p>
                <p>Construction Services</p>
                <p>Property Management</p>
                <p>Investment Consulting</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Creative Construction Solution. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4" />
                    {t.lightMode}
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    {t.darkMode}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NavigationLayout;