import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function AuthCard({ title, description, children, footerContent }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footerContent && (
          <CardFooter className="flex flex-col items-center text-sm">
            {footerContent}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
