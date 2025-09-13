
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses login
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang kembali!",
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Silakan periksa kembali email dan sandi Anda.",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 font-body">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline text-primary">BEAUTIVE</CardTitle>
          <CardDescription>Selamat Datang Kembali!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@anda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
