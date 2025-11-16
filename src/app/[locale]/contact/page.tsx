
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Image from 'next/image';

export default async function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);

  return (
    <div className="container py-10 animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold">{dictionary.contact}</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground">
            {dictionary.contactPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-12 pt-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">{dictionary.contactPage.sendMessageTitle}</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">{dictionary.form.fullName}</Label>
                  <Input id="name" placeholder={dictionary.form.fullName} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">{dictionary.form.email}</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject">{dictionary.form.subject}</Label>
                <Input id="subject" placeholder={dictionary.form.subject} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message">{dictionary.form.message}</Label>
                <Textarea id="message" placeholder={`${dictionary.form.message}...`} rows={5} />
              </div>
              <Button type="submit" className="w-full md:w-auto" disabled>
                <Send className="mr-2 h-4 w-4" /> {dictionary.form.sendMessageButton}
              </Button>
            </form>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">{dictionary.contactPage.contactInformationTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>{dictionary.contactPage.addressPlaceholder}</span>
                </p>
                <p className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{dictionary.contactPage.phonePlaceholder}</span>
                </p>
                <p className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <span>{dictionary.contactPage.emailPlaceholder}</span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">{dictionary.contactPage.locationTitle}</h2>
              <Image
                src="https://placehold.co/600x400.png"
                alt={dictionary.contactPage.locationTitle}
                width={600}
                height={400}
                className="rounded-lg shadow-md w-full object-cover"
                data-ai-hint="city map location"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {dictionary.contactPage.mapPlaceholderText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
