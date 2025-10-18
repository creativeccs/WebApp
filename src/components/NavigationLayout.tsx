import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTheme } from '@/hooks/useTheme';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { 
  Menu, 
  Home, 
  Building, 
  Info, 
  MessageCircle, 
  Settings,
  Sun,
  Moon,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const { t, isRTL } = useI18n();
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
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <Link to="/" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-border/10">
                  <img 
                    src="/logo.png" 
                    alt="CCS Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="block">
                  <div className="font-bold text-base sm:text-lg whitespace-nowrap">{t.companyName}</div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{t.companyTagline}</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}
            >
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <Link to={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={isActive(item.path) ? "default" : "ghost"}
                          className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Medium Screen Navigation - Icons Only */}
            <nav className={`hidden md:flex lg:hidden items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
              {navigationItems.slice(0, 3).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="px-3"
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  </Link>
                );
              })}
              
              {/* More Menu for remaining items */}
              {navigationItems.length > 3 && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-3">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={isRTL ? "left" : "right"} className="w-64">
                    <div className="flex flex-col space-y-2 py-6">
                      {navigationItems.slice(3).map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link key={item.path} to={item.path}>
                            <Button 
                              variant={isActive(item.path) ? "default" : "ghost"}
                              className={`w-full justify-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <IconComponent className="h-4 w-4" />
                              {item.label}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
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

              {/* Admin Link - Always visible */}
              <Link to="/admin" className="hidden sm:block">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  {t.admin}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? "left" : "right"} className="w-72">
                  <motion.div
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    {/* Mobile Logo */}
                    <div className={`flex items-center pb-4 border-b ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-border/10">
                        <img 
                          src="/logo.png" 
                          alt="CCS Logo" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{t.companyName}</div>
                        <div className="text-xs text-muted-foreground">{t.companyTagline}</div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <motion.nav
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex flex-col space-y-2 py-6 flex-1"
                    >
                      {navigationItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                          >
                            <Link
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02, x: isRTL ? 5 : -5 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  variant={isActive(item.path) ? "default" : "ghost"}
                                  className={`w-full gap-3 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}
                                >
                                  <IconComponent className="h-5 w-5" />
                                  {item.label}
                                </Button>
                              </motion.div>
                            </Link>
                          </motion.div>
                        );
                      })}

                      {user && (
                        <motion.div
                          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          <Link
                            to="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02, x: isRTL ? 5 : -5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button variant="outline" className="w-full justify-start gap-3">
                                <Settings className="h-5 w-5" />
                                {t.admin}
                              </Button>
                            </motion.div>
                          </Link>
                        </motion.div>
                      )}
                    </motion.nav>

                    {/* Mobile Footer Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="border-t pt-4 space-y-4"
                    >
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

                      {/* Admin Link */}
                      <Link to="/admin" className="w-full">
                        <Button variant="outline" className="w-full justify-start gap-3">
                          <Settings className="h-5 w-5" />
                          {t.admin}
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
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
              <div className={`flex items-center mb-4 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-border/10">
                  <img 
                    src="/logo.png" 
                    alt="CCS Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">{t.companyName}</div>
                  <div className="text-sm text-muted-foreground">{t.companyTagline}</div>
                </div>
              </div>
              <p className={`text-muted-foreground mb-4 max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.companyDescription}
              </p>
              <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Al Barakat St, Sib, Muscat, Oman
                </p>
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span dir="ltr">+968 99823023</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span dir="ltr">+968 97990098</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span dir="ltr">ahmed@creativeccs.com</span>
                  </p>
                </div>
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
              <h3 className="font-semibold mb-4">{t.services}</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>{t.realEstateDevelopment}</p>
                <p>{t.constructionServices}</p>
                <p>{t.propertyManagementService}</p>
                <p>{t.investmentConsulting}</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 {t.companyName}. {t.allRightsReserved}.
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