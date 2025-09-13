
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Camera, MessageCircle, HeartPulse, Dumbbell, User, Edit, Palette, BarChart2, Droplet, Moon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useLocalStorage from '@/hooks/use-local-storage';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

const features = [
  {
    title: 'TIV-CHECK',
    description: 'Analisis postur yoga Anda secara real-time dengan AI.',
    href: '/tiv-check',
    icon: <Camera className="h-8 w-8 text-primary" />,
    cta: 'Mulai Cek'
  },
  {
    title: 'TIV-TALKS',
    description: 'Dapatkan jawaban empatik untuk pertanyaan kesehatan Anda.',
    href: '/tiv-talks',
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    cta: 'Mulai Bicara'
  },
  {
    title: 'TIV-TRACK',
    description: 'Lacak aktivitas, nutrisi, dan siklus harian Anda.',
    href: '/tiv-track',
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    cta: 'Lacak Aktivitas'
  },
  {
    title: 'TIV-COACH',
    description: 'Panduan yoga virtual dengan instruktur avatar.',
    href: '/tiv-coach',
    icon: <Dumbbell className="h-8 w-8 text-primary" />,
    cta: 'Mulai Latihan'
  }
];

function UserProfileCard() {
  const [exerciseDuration] = useLocalStorage('exerciseDuration', 0);
  const [waterIntake] = useLocalStorage('waterIntake', 0);
  const [sleepQuality] = useLocalStorage<number[]>('sleepQuality', [7]);
  const [profile, setProfile] = useLocalStorage('userProfile', {
    name: 'Mitha (Anda)',
    age: 17,
    status: 'Mahasiswa',
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={isClient ? profile.avatar : ''} alt="User Avatar" data-ai-hint="profile avatar" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-headline">{isClient ? profile.name : 'Memuat...'}</h2>
            <p className="text-muted-foreground">{isClient ? `${profile.age} tahun · ${profile.status}` : '...'}</p>
            <div className="flex gap-2 mt-2 justify-center md:justify-start">
              <Button variant="outline" size="sm" asChild>
                <Link href="/edit-profile">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profil
                </Link>
              </Button>
              <Button variant="outline" size="sm"><Palette className="mr-2 h-4 w-4" /> Ganti Tema</Button>
            </div>
          </div>
          <div className="w-full md:w-auto flex-shrink-0 md:border-l md:pl-6 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 justify-center md:justify-start"><BarChart2 /> Ringkasan Mingguan</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                <span>Yoga: {isClient ? exerciseDuration : 0} / 300 menit</span>
                <Progress value={isClient ? (exerciseDuration / 300) * 100 : 0} className="w-24 h-2" />
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                <span>Air: {isClient ? waterIntake : 0} / 56 gelas</span>
                 <Progress value={isClient ? (waterIntake / 56) * 100 : 0} className="w-24 h-2" />
              </div>
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-primary" />
                <span>Tidur: {isClient ? sleepQuality[0] : 7}/10 Kualitas</span>
                 <Progress value={isClient ? (sleepQuality[0] / 10) * 70 : 70} className="w-24 h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">Selamat Datang di BEAUTIVE</h1>
        <p className="text-lg text-muted-foreground">Pusat kebugaran dan kesehatan Anda, dirancang untuk memberdayakan.</p>
      </header>

      <main className="space-y-8">
        <UserProfileCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group transition-all duration-300 hover:shadow-xl hover:border-primary/50 flex flex-col">
              <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 mb-2">
                    {feature.icon}
                    <h2 className="text-2xl font-headline text-foreground">{feature.title}</h2>
                  </div>
                  <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary self-start">
                    <Link href={feature.href}>
                      {feature.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
