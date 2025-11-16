
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/dictionary";
import type React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";

interface ProfessionalRegistrationFormProps {
  dictionary: Dictionary['professionalRegistration'] & Dictionary['form'];
  locale: string;
}

export function ProfessionalRegistrationForm({ dictionary }: ProfessionalRegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email || !password || !fullName || !specialization || files.length === 0) {
      setError("All fields, including document upload, are required.");
      return;
    }

    // Simulate form submission
    console.log('Submitting professional application:', { fullName, email, specialization, files });
    
    // Display success toast
    toast({
      title: dictionary.registrationSuccess.split('!')[0], // "Registration successful"
      description: dictionary.registrationSuccess.split('!')[1]?.trim(), // "Your application is under review."
      variant: "default",
    });

    // Reset form (optional)
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSpecialization('');
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName-prof">{dictionary.fullName}</Label>
          <Input id="fullName-prof" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-prof">{dictionary.email}</Label>
          <Input id="email-prof" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password-prof">{dictionary.password}</Label>
          <Input id="password-prof" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword-prof">{dictionary.confirmPassword}</Label>
          <Input id="confirmPassword-prof" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialization-prof">{dictionary.specialization}</Label>
        <Input id="specialization-prof" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g., Notary, Lawyer" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="documents-prof">{dictionary.uploadDocuments}</Label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="documents-prof-input" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">{dictionary.documentPlaceholder.split(' or ')[0]}</span> or {dictionary.documentPlaceholder.split(' or ')[1]}
                    </p>
                    {files.length > 0 && (
                      <p className="text-xs text-foreground/80 mt-1">
                        {files.length} file(s) selected: {files.map(f => f.name).join(', ')}
                      </p>
                    )}
                </div>
                <Input id="documents-prof-input" type="file" className="hidden" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />
            </label>
        </div>
      </div>
      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {dictionary.submitApplication}
      </Button>
    </form>
  );
}
