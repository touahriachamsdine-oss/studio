
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth-store";
import type { Dictionary } from "@/lib/dictionary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormProps {
  dictionary: Dictionary['form'] & Pick<Dictionary, 'login' | 'adminDashboard' >;
  locale: string;
}

export function LoginForm({ dictionary, locale }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required."); // Consider adding to dictionary if this message needs translation
      return;
    }

    // Simulate login
    if (email === 'admin@example.com' && password === 'adminpass') {
      login('admin', { id:'admin-user', name: 'Admin User', email: 'admin@example.com', role: 'admin'});
      router.push(`/${locale}/admin`);
    } else if (email === 'admin@test.com' && password === 'admin@test.com') {
      login('admin', { id:'admin-test-user', name: 'Admin Test User', email: 'admin@test.com', role: 'admin'});
      router.push(`/${locale}/admin`);
    } else if (email === 'user@example.com' && password === 'userpass') {
      login('user', { id:'demo-user', name: 'Demo User', email: 'user@example.com', role: 'user'});
      router.push(`/${locale}/dashboard`);
    } else if (email === 'prof@example.com' && password === 'profpass') {
      login('professional', {
        id:'prof-user',
        name: 'Professional User',
        email: 'prof@example.com',
        role: 'professional',
        specializations: ['corporateLawyer', 'mediator'],
        availability: 'Flexible, contact for details (Edit Me!)',
        isApproved: false // Simulate as unapproved initially
      });
      router.push(`/${locale}/professional-dashboard`);
    }
    else {
      setError('Invalid credentials. Try admin@example.com / adminpass, admin@test.com / admin@test.com, user@example.com / userpass, or prof@example.com / profpass');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">{dictionary.email}</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{dictionary.password}</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox id="remember-me" />
          <Label htmlFor="remember-me" className="text-sm font-normal">{dictionary.rememberMe}</Label>
        </div>
        <Link href={`/${locale}/forgot-password`} className="text-sm text-primary hover:underline" tabIndex={-1}>
          {dictionary.forgotPassword}
        </Link>
      </div>

      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95">
        {dictionary.login}
      </Button>
    </form>
  );
}
