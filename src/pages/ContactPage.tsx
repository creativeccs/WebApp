import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/contexts/I18nContext';
import { useAnonymousNostr } from '@/hooks/useAnonymousNostr';
import { useSendEncryptedMessage } from '@/hooks/useSendEncryptedMessage';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Admin pubkey from environment variable
  const ADMIN_PUBKEY = import.meta.env.VITE_ADMIN_PUBKEY || 'dee2a5672a29eac19f816225f0dcd23a56770fd4be263a951bc24f6a1714c6a5';

  const { account, isLoading: isLoadingAccount, secretKey } = useAnonymousNostr();
  const sendMessageMutation = useSendEncryptedMessage();

  // Set page title
  useEffect(() => {
    document.title = `${t.contact} - ${t.companyName}`;
  }, [t.contact, t.companyName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !secretKey) {
      return;
    }

    sendMessageMutation.mutate({
      recipientPubkey: ADMIN_PUBKEY,
      senderSecretKey: secretKey,
      senderPubkey: account.publicKey,
      message: formData.message,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const openInMaps = () => {
    // Coordinates: 23°38'11.9"N 58°12'26.7"E
    // Converted to decimal: 23.636639, 58.207417
    const url = `https://www.openstreetmap.org/?mlat=23.636639&mlon=58.207417#map=18/23.636639/58.207417`;
    window.open(url, '_blank');
  };

  if (sendMessageMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.contactUs}</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              {t.contactPageSubtitle}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.messageSentSuccess}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.messageReceivedResponse}
                </p>
                <Button onClick={() => window.location.reload()}>
                  {t.sendAnotherMessage}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.contactUs}</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            {t.contactPageSubtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t.getInTouch}</h2>
              <p className="text-muted-foreground text-lg mb-8">
                {t.getInTouchDesc}
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{t.callUs}</h3>
                      <p className="text-muted-foreground" dir="ltr">+968 99823023</p>
                      <p className="text-muted-foreground" dir="ltr">+968 24188398</p>
                      <p className="text-sm text-muted-foreground mt-1">{t.availableForEmergencies}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{t.emailUs}</h3>
                      <p className="text-muted-foreground" dir="ltr">ahmed@creativeccs.com</p>
                      <p className="text-sm text-muted-foreground mt-1">{t.respondWithin24Hours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{t.address}</h3>
                      <p className="text-muted-foreground">Al Barakat St, Sib</p>
                      <p className="text-muted-foreground">Muscat, Oman</p>
                      <p className="text-sm text-muted-foreground mt-2" dir="ltr">23°38'11.9"N 58°12'26.7"E</p>
                      <Button 
                        variant="link" 
                        className="px-0 mt-2 h-auto" 
                        onClick={openInMaps}
                      >
                        <ExternalLink className="h-4 w-4 me-1" />
                        {t.openMapLocation}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{t.businessHours}</h3>
                      <div className="space-y-1 text-muted-foreground" dir="ltr">
                        <p>Sunday - Thursday: 8:00 AM - 6:00 PM</p>
                        <p>Friday: 2:00 PM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t.sendMessage}</CardTitle>
                <p className="text-muted-foreground">
                  {t.fillFormBelow}
                </p>
              </CardHeader>
              <CardContent>
                {sendMessageMutation.error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {sendMessageMutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}

                {isLoadingAccount && (
                  <Alert className="mb-6">
                    <AlertDescription>
                      {t.loading}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.yourName} *</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.enterFullName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.yourEmail} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.enterEmailPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.phone}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.enterPhonePlaceholder}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t.subject} *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t.subjectPlaceholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.message} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.messagePlaceholder}
                      rows={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={sendMessageMutation.isPending || isLoadingAccount}
                  >
                    {sendMessageMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2" />
                        {t.sendingMessage}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 me-2" />
                        {t.sendMessage}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.frequentlyAskedQuestions}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.quickAnswers}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.scheduleViewing}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.scheduleViewingDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.areasServed}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.areasServedDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.constructionServicesQuestion}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.constructionServicesAnswer}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.propertyRegistration}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.propertyRegistrationDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;