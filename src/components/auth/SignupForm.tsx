'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth-store";
import type { Dictionary } from "@/lib/dictionary";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import type { UserRole } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link"; // Import Link

interface SignupFormProps {
  dictionary: Dictionary; 
  locale: string;
}

const algerianStatesKeys = [
  "adrar", "chlef", "laghouat", "oumElBouaghi", "batna", "bejaia", "biskra", "bechar", "blida", "bouira",
  "tamanrasset", "tebessa", "tlemcen", "tiaret", "tiziOuzou", "algiers", "djelfa", "jijel", "setif", "saida",
  "skikda", "sidiBelAbbes", "annaba", "guelma", "constantine", "medea", "mostaganem", "msila", "mascara",
  "ouargla", "oran", "elBayadh", "illizi", "bordjBouArreridj", "boumerdes", "elTarf", "tindouf", "tissemsilt",
  "elOued", "khenchela", "soukAhras", "tipaza", "mila", "ainDefla", "naama", "ainTemouchent", "ghardaia",
  "relizane", "timimoun", "bordjBadjiMokhtar", "ouledDjellal", "beniAbbes", "inSalah", "inGuezzam",
  "touggourt", "djanet", "elMghair", "elMeniaa"
] as const;


const professionalSpecializationsKeys = [
  "notary", "lawyerGeneral", "corporateLawyer", "familyLawyer", 
  "realEstateLawyer", "criminalLawyer", "mediator", "legalConsultant", "other"
] as const;
type SpecializationKey = typeof professionalSpecializationsKeys[number];

export function SignupForm({ dictionary, locale }: SignupFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<'user' | 'professional' | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<SpecializationKey[]>([]);
  const [error, setError] = useState('');

  const handleSpecializationChange = (specializationKey: SpecializationKey) => {
    setSelectedSpecializations(prev =>
      prev.includes(specializationKey)
        ? prev.filter(s => s !== specializationKey)
        : [...prev, specializationKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !roleSelection) {
      setError("Full name, email, password, and role are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (roleSelection === 'professional' && selectedSpecializations.length === 0) {
      setError("At least one specialization is required for professionals.");
      return;
    }

    const actualRole: UserRole = roleSelection === 'professional' ? 'professional' : 'user';
    
    login(actualRole, { 
      id: `new-user-${Date.now()}`,
      name: fullName, 
      email: email, 
      role: actualRole,
      phoneNumber: phoneNumber,
      state: selectedState,
      specializations: roleSelection === 'professional' ? selectedSpecializations : undefined,
      isApproved: actualRole === 'professional' ? false : undefined, // Professionals start as unapproved
    });
    
    if (actualRole === 'professional') {
      router.push(`/${locale}/professional-dashboard`);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };
  
  const getSelectedSpecializationsText = () => {
    if (selectedSpecializations.length === 0) {
      return dictionary.form.selectSpecializations;
    }
    if (selectedSpecializations.length <= 2) {
      return selectedSpecializations.map(key => dictionary.form.professionalSpecializations[key]).join(', ');
    }
    return `${selectedSpecializations.length} ${dictionary.professionalRegistration.specializations.toLowerCase()} selected`;
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-destructive">{error}</p>}
      
      <div className="space-y-2">
        <Label htmlFor="fullName">{dictionary.form.fullName}</Label>
        <Input 
          id="fullName" 
          type="text" 
          placeholder={dictionary.form.fullName} 
          required 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dictionary.form.email}</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="m@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">{dictionary.form.password}</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{dictionary.form.confirmPassword}</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{dictionary.form.role}</Label>
        <RadioGroup 
          value={roleSelection} 
          onValueChange={(value) => setRoleSelection(value as 'user' | 'professional')}
          className="flex space-x-4 rtl:space-x-reverse"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="user" id="role-customer" />
            <Label htmlFor="role-customer" className="font-normal">{dictionary.form.customer}</Label>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="professional" id="role-professional" />
            <Label htmlFor="role-professional" className="font-normal">{dictionary.form.professional}</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">{dictionary.form.phoneNumber}</Label>
        <Input 
          id="phoneNumber" 
          type="tel" 
          placeholder="+213 XXX XX XX XX" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">{dictionary.form.stateProvince}</Label>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger id="state">
            <SelectValue placeholder={dictionary.form.selectState} />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              {algerianStatesKeys.map(stateKey => (
                <SelectItem key={stateKey} value={stateKey}>
                  {dictionary.form.algerianStates[stateKey as keyof typeof dictionary.form.algerianStates]}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {roleSelection === 'professional' && (
        <div className="space-y-2">
          <Label htmlFor="specializations">{dictionary.professionalRegistration.specializations}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between active:scale-100"
              >
                <span className="truncate">{getSelectedSpecializationsText()}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <ScrollArea className="h-60">
                <div className="p-4 space-y-2">
                  {professionalSpecializationsKeys.map(specKey => (
                    <div key={specKey} className="flex items-center space-x-2">
                      <Checkbox
                        id={`spec-${specKey}`}
                        checked={selectedSpecializations.includes(specKey)}
                        onCheckedChange={() => handleSpecializationChange(specKey)}
                      />
                      <Label htmlFor={`spec-${specKey}`} className="font-normal">
                        {dictionary.form.professionalSpecializations[specKey]}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95">
        {dictionary.signup}
      </Button>
    </form>
  );
}
