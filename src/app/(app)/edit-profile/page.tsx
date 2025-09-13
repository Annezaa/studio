
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Camera, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import useLocalStorage from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useLocalStorage('userProfile', {
    name: 'Mitha (Anda)',
    age: 17,
    status: 'Mahasiswa',
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
  });

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    status: '',
    avatar: ''
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFormData({
      name: profile.name,
      age: String(profile.age),
      status: profile.status,
      avatar: profile.avatar,
    });
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: formData.name,
      age: Number(formData.age),
      status: formData.status,
      avatar: formData.avatar,
    });
    toast({
      title: "Profil Diperbarui",
      description: "Perubahan profil Anda telah berhasil disimpan.",
    });
    router.push('/');
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-muted/40">
      <Card className="w-full max-w-md relative shadow-2xl">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Tutup</span>
          </Button>
        </Link>
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold font-headline mb-8 text-center">Edit Profil</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary">
                  <AvatarImage src={formData.avatar} alt="User Avatar" />
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full border-2 border-background"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Ubah foto profil</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Usia</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

