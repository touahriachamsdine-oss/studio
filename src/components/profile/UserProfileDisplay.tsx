
'use client';

import type { Dictionary, Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, Mail, ShieldCheck, Edit3, KeyRound, Briefcase, Camera, Save, X, Edit, ChevronDown, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UserProfileDisplayProps {
  dictionary: Dictionary;
  locale: Locale;
}

const professionalSpecializationsKeys = [
  "notary", "lawyerGeneral", "corporateLawyer", "familyLawyer", 
  "realEstateLawyer", "criminalLawyer", "mediator", "legalConsultant", "other"
] as const;
type SpecializationKey = typeof professionalSpecializationsKeys[number];


export default function UserProfileDisplay({ dictionary, locale }: UserProfileDisplayProps) {
  const { user, isLoading, updateUserData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [currentEditableName, setCurrentEditableName] = useState('');

  const [isEditingSpecializations, setIsEditingSpecializations] = useState(false);
  const [currentEditableSpecializations, setCurrentEditableSpecializations] = useState<SpecializationKey[]>([]);

  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [currentEditableAvailability, setCurrentEditableAvailability] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`);
    } else if (user) {
      setCurrentEditableName(user.name || '');
      setCurrentEditableSpecializations(user.specializations || []);
      setCurrentEditableAvailability(user.availability || '');
    }
  }, [isLoading, user, router, locale]);

  if (isLoading || !user) {
    return (
      <div className="container py-10 max-w-3xl mx-auto text-center animate-fade-in-up">
        <p>Loading profile...</p>
      </div>
    );
  }

  const userName = user.name || 'User';
  const userEmail = user.email || 'No email provided';
  const userSpecializations = user.specializations || [];
  const userAvailability = user.availability || dictionary.profilePage.availabilityPlaceholder.split(':')[0]; // Show placeholder if empty
  const profileDescription = dictionary.profilePage.description.replace('{name}', userName);

  const handlePfpButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateUserData({ avatarUrl: e.target.result as string });
          toast({
            title: dictionary.profilePage.pfpUpdateSuccessTitle,
            description: dictionary.profilePage.pfpUpdateSuccessDescription,
          });
        } else {
          toast({
            variant: "destructive",
            title: dictionary.profilePage.pfpUpdateErrorTitle,
            description: dictionary.profilePage.pfpUpdateErrorDescription,
          });
        }
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: dictionary.profilePage.pfpUpdateErrorTitle,
          description: dictionary.profilePage.pfpUpdateErrorDescription,
        });
      };
      reader.readAsDataURL(file);
    }
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditName = () => {
    setCurrentEditableName(user.name || '');
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (!currentEditableName.trim()) {
      toast({
        variant: "destructive",
        title: dictionary.profilePage.editNameErrorTitle,
        description: dictionary.profilePage.editNameErrorDescription,
      });
      return;
    }
    updateUserData({ name: currentEditableName.trim() });
    setIsEditingName(false);
    toast({
      title: dictionary.profilePage.editNameSuccessTitle,
      description: dictionary.profilePage.editNameSuccessDescription,
    });
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
  };

  const handleEditSpecializations = () => {
    setCurrentEditableSpecializations(user.specializations || []);
    setIsEditingSpecializations(true);
  };
  
  const handleSpecializationChange = (specializationKey: SpecializationKey) => {
    setCurrentEditableSpecializations(prev =>
      prev.includes(specializationKey)
        ? prev.filter(s => s !== specializationKey)
        : [...prev, specializationKey]
    );
  };

  const handleSaveSpecializations = () => {
    if (currentEditableSpecializations.length === 0) {
      toast({
        variant: "destructive",
        title: dictionary.profilePage.editSpecializationErrorTitle,
        description: dictionary.profilePage.editSpecializationErrorDescription,
      });
      return;
    }
    updateUserData({ specializations: currentEditableSpecializations });
    setIsEditingSpecializations(false);
    toast({
      title: dictionary.profilePage.editSpecializationSuccessTitle,
      description: dictionary.profilePage.editSpecializationSuccessDescription,
    });
  };

  const handleCancelEditSpecializations = () => {
    setIsEditingSpecializations(false);
  };
  
  const handleEditAvailability = () => {
    setCurrentEditableAvailability(user.availability || '');
    setIsEditingAvailability(true);
  };

  const handleSaveAvailability = () => {
    if (!currentEditableAvailability.trim()) {
      toast({
        variant: "destructive",
        title: dictionary.profilePage.editAvailabilityErrorTitle,
        description: dictionary.profilePage.editAvailabilityErrorDescription,
      });
      return;
    }
    updateUserData({ availability: currentEditableAvailability.trim() });
    setIsEditingAvailability(false);
    toast({
      title: dictionary.profilePage.editAvailabilitySuccessTitle,
      description: dictionary.profilePage.editAvailabilitySuccessDescription,
    });
  };

  const handleCancelEditAvailability = () => {
    setIsEditingAvailability(false);
  };

  const getSelectedSpecializationsText = (specs: SpecializationKey[], forDisplay?: boolean) => {
    if (specs.length === 0) {
      return forDisplay ? dictionary.profilePage.noSpecializationsSelected : dictionary.profilePage.selectSpecializationsPlaceholder;
    }
    const names = specs.map(key => dictionary.form.professionalSpecializations[key]);
    if (specs.length <= 2 || forDisplay) {
      return names.join(', ');
    }
    return `${specs.length} ${dictionary.professionalRegistration.specializations.toLowerCase()} selected`;
  };

  return (
    <div className="container py-10 max-w-3xl mx-auto animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-2 ring-2 ring-primary ring-offset-2">
              <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} data-ai-hint="user avatar" alt={userName} />
              <AvatarFallback>{userName ? userName.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 active:scale-95"
              title={dictionary.profilePage.changeProfilePictureButton}
              onClick={handlePfpButtonClick}
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">{dictionary.profilePage.changeProfilePictureButton}</span>
            </Button>
            <Input
              type="file"
              id="profile-picture-input"
              name="profile-picture-input"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileSelected}
            />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold mt-2">{dictionary.profile}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {profileDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-md sm:text-lg font-semibold mb-3 text-muted-foreground">{dictionary.profilePage.personalInformationTitle}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md min-h-[60px]">
                <div className="flex items-center">
                  <UserCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{dictionary.profilePage.fullNameLabel}</span>
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={currentEditableName} 
                      onChange={(e) => setCurrentEditableName(e.target.value)} 
                      className="h-8"
                      aria-label={dictionary.profilePage.editNameInputLabel}
                    />
                    <Button variant="ghost" size="icon" onClick={handleSaveName} title={dictionary.profilePage.saveNameButton}>
                      <Save className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancelEditName} title={dictionary.profilePage.cancelEditNameButton}>
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{userName}</span>
                    <Button variant="ghost" size="icon" onClick={handleEditName} title={dictionary.profilePage.editNameButton}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">{dictionary.profilePage.emailLabel}</span>
                </div>
                <span className="text-muted-foreground">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">{dictionary.profilePage.accountRoleLabel}</span>
                </div>
                <span className="text-muted-foreground capitalize">{user.role}</span>
              </div>
              {user.role === 'professional' && (
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                        <AlertCircle className={`mr-3 h-5 w-5 ${user.isApproved ? 'text-green-500' : 'text-yellow-500'}`} />
                        <span className="font-medium">{dictionary.profilePage.accountStatusLabel}</span>
                    </div>
                    <span className={`text-sm font-semibold ${user.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.isApproved ? dictionary.profilePage.statusApproved : dictionary.profilePage.statusPendingApproval}
                    </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-md sm:text-lg font-semibold mb-3 text-muted-foreground">{dictionary.profilePage.accountActionsTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" disabled className="w-full">
                <Edit3 className="mr-2 h-4 w-4" /> {dictionary.profilePage.editProfileButton}
              </Button>
              <Button variant="outline" disabled className="w-full">
                <KeyRound className="mr-2 h-4 w-4" /> {dictionary.profilePage.changePasswordButton}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {dictionary.profilePage.moreFeaturesText}
            </p>
          </div>

          {user.role === 'professional' && (
            <>
              <Separator />
              <div>
                <h3 className="text-md sm:text-lg font-semibold mb-3 text-muted-foreground flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  {dictionary.profilePage.professionalDetailsTitle}
                </h3>
                <Card className="bg-muted/50 p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {dictionary.profilePage.professionalDetailsText}
                  </p>
                  
                  {/* Specializations */}
                  <div className="flex items-center justify-between p-3 border rounded-md bg-background min-h-[60px]">
                    <div className="flex items-center">
                        <span className="font-medium">{dictionary.profilePage.specializationsLabel}</span>
                    </div>
                    {isEditingSpecializations ? (
                      <div className="flex items-center gap-2 w-2/3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="h-8 flex-grow justify-between text-xs active:scale-100"
                            >
                              <span className="truncate">{getSelectedSpecializationsText(currentEditableSpecializations)}</span>
                              <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <ScrollArea className="h-48">
                              <div className="p-2 space-y-1">
                                {professionalSpecializationsKeys.map(specKey => (
                                  <div key={specKey} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`prof-edit-spec-${specKey}`}
                                      checked={currentEditableSpecializations.includes(specKey)}
                                      onCheckedChange={() => handleSpecializationChange(specKey)}
                                    />
                                    <Label htmlFor={`prof-edit-spec-${specKey}`} className="font-normal text-xs">
                                      {dictionary.form.professionalSpecializations[specKey]}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                        <Button variant="ghost" size="icon" onClick={handleSaveSpecializations} title={dictionary.profilePage.saveSpecializationButton}>
                          <Save className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEditSpecializations} title={dictionary.profilePage.cancelEditSpecializationButton}>
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground truncate max-w-[150px] sm:max-w-xs text-sm">
                          {userSpecializations.length > 0 ? getSelectedSpecializationsText(userSpecializations, true) : dictionary.profilePage.noSpecializationsSelected}
                        </span>
                        <Button variant="ghost" size="icon" onClick={handleEditSpecializations} title={dictionary.profilePage.editSpecializationButton}>
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex items-start justify-between p-3 border rounded-md bg-background min-h-[60px]">
                    <div className="flex items-start pt-1">
                        <span className="font-medium">{dictionary.profilePage.availabilityLabel}</span>
                    </div>
                    {isEditingAvailability ? (
                        <div className="flex flex-col items-end gap-2 w-2/3">
                            <Textarea 
                                value={currentEditableAvailability} 
                                onChange={(e) => setCurrentEditableAvailability(e.target.value)} 
                                className="min-h-[60px]"
                                placeholder={dictionary.profilePage.availabilityPlaceholder}
                                aria-label={dictionary.profilePage.availabilityLabel}
                            />
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={handleSaveAvailability} title={dictionary.profilePage.saveAvailabilityButton}>
                                    <Save className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleCancelEditAvailability} title={dictionary.profilePage.cancelEditAvailabilityButton}>
                                    <X className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground whitespace-pre-line text-right truncate max-w-[150px] sm:max-w-xs text-sm">{userAvailability}</span>
                            <Button variant="ghost" size="icon" onClick={handleEditAvailability} title={dictionary.profilePage.editAvailabilityButton}>
                                <Edit className="h-4 w-4 text-primary" />
                            </Button>
                        </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <Button variant="outline" size="sm" disabled>{dictionary.profilePage.managePublicProfileButton}</Button>
                  </div>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
