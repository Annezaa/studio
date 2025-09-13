
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses pendaftaran
    setTimeout(() => {
      if (name && email && password) {
        toast({
          title: "Pendaftaran Berhasil",
          description: "Akun Anda telah dibuat. Silakan masuk.",
        });
        router.push('/login');
      } else {
        toast({
          variant: "destructive",
          title: "Pendaftaran Gagal",
          description: "Silakan isi semua kolom yang diperlukan.",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 font-body">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline text-primary">Buat Akun Baru</CardTitle>
          <CardDescription>Bergabunglah dengan BEAUTIVE hari ini!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus-visible:ring-primary"
              />
            </div>
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
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
