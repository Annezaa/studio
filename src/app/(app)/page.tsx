
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Camera, MessageCircle, HeartPulse, Dumbbell, User, Edit, Palette, BarChart2, Droplet, Smile, Moon } from "lucide-react";
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
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1820&auto=format&fit=crop",
    imgHint: "yoga posture",
    cta: 'Mulai Cek'
  },
  {
    title: 'TIV-TALKS',
    description: 'Dapatkan jawaban empatik untuk pertanyaan kesehatan Anda.',
    href: '/tiv-talks',
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    img: "https://images.unsplash.com/photo-1529156069898-fac51a63c232?q=80&w=2070&auto=format&fit=crop",
    imgHint: "friends talking",
    cta: 'Mulai Bicara'
  },
  {
    title: 'TIV-TRACK',
    description: 'Lacak aktivitas, nutrisi, dan siklus harian Anda.',
    href: '/tiv-track',
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    img: "https://images.unsplash.com/photo-1511382432889-1241f97c4133?q=80&w=2070&auto=format&fit=crop",
    imgHint: "activity tracking",
    cta: 'Lacak Aktivitas'
  },
  {
    title: 'TIV-COACH',
    description: 'Panduan yoga virtual dengan instruktur avatar.',
    href: '/tiv-coach',
    icon: <Dumbbell className="h-8 w-8 text-primary" />,
    img: "https://images.unsplash.com/photo-1599447514193-14b533423234?q=80&w=1887&auto=format&fit=crop",
    imgHint: "yoga instructor",
    cta: 'Mulai Latihan'
  }
];

function UserProfileCard() {
  const [exerciseDuration] = useLocalStorage('exerciseDuration', 0);
  const [waterIntake] = useLocalStorage('waterIntake', 0);
  const [sleepQuality] = useLocalStorage<number[]>('sleepQuality', [7]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" alt="User Avatar" data-ai-hint="profile avatar" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-headline">Mitha (Anda)</h2>
            <p className="text-muted-foreground">17 tahun · Mahasiswa</p>
            <div className="flex gap-2 mt-2 justify-center md:justify-start">
              <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Edit Profil</Button>
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
            <Card key={feature.title} className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/50">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={feature.img} alt={feature.title} fill objectFit="cover" data-ai-hint={feature.imgHint} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-2">
                    {feature.icon}
                    <h2 className="text-2xl font-headline text-foreground">{feature.title}</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <Link href={feature.href}>
                      {feature.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
