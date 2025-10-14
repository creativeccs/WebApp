import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/contexts/I18nContext';
import { useContactForm } from '@/hooks/useContactForm';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle
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

  const contactMutation = useContactForm();

  // Set page title
  document.title = `${t.contact} - ${t.companyName}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (contactMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.contactUs}</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Thank you for your message. We'll get back to you soon.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.messagesSentSuccess}</h2>
                <p className="text-muted-foreground mb-6">
                  We appreciate you reaching out to us. Our team will review your message and respond within 24 hours.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Send Another Message
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
            Get in touch with Creative Construction Solution. We're here to help with all your real estate and construction needs.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Ready to start your next project? Contact our expert team for professional consultation and support.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t.phone}</h3>
                      <p className="text-muted-foreground">+968 1234 5678</p>
                      <p className="text-muted-foreground">+968 9876 5432</p>
                      <p className="text-sm text-muted-foreground mt-1">Available 24/7 for emergencies</p>
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
                    <div>
                      <h3 className="font-semibold mb-2">{t.email}</h3>
                      <p className="text-muted-foreground">info@creativeccs.om</p>
                      <p className="text-muted-foreground">projects@creativeccs.om</p>
                      <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
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
                    <div>
                      <h3 className="font-semibold mb-2">{t.address}</h3>
                      <p className="text-muted-foreground">Muscat, Sultanate of Oman</p>
                      <p className="text-muted-foreground">Building 123, Street 456</p>
                      <p className="text-muted-foreground">Al Khuwair District</p>
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
                    <div>
                      <h3 className="font-semibold mb-2">Business Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
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
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                {contactMutation.error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to send message. Please try again or contact us directly.
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
                        placeholder="Enter your full name"
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
                        placeholder="your.email@example.com"
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
                      placeholder="+968 1234 5678"
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
                      placeholder="What's this regarding?"
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
                      placeholder="Tell us about your project, inquiry, or how we can help..."
                      rows={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
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
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quick answers to common questions about our services and processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I schedule a property viewing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can schedule a viewing by calling us, sending an email, or filling out the contact form above. 
                  We offer flexible scheduling including evenings and weekends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What areas do you serve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We primarily serve the Greater Muscat area including Al Khuwair, Qurum, Al Ghubra, 
                  and surrounding districts. Contact us for projects in other locations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer construction services?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we provide comprehensive construction services including residential, commercial, 
                  and renovation projects. Our team handles everything from design to completion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does property registration take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Property registration typically takes 2-4 weeks depending on the property type and documentation. 
                  We guide you through the entire process to ensure smooth completion.
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