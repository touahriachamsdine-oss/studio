
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (code: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [code, setCode] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(code);
  };

  return (
    <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-sm">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Admin Access</CardTitle>
                    <CardDescription>Enter the access code to manage the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="ps-10"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Unlock</Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
