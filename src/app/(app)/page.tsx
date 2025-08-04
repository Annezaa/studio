import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Camera, MessageCircle, HeartPulse, Dumbbell } from "lucide-react";
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'TIV-CHECK',
    description: 'Analisis postur yoga Anda secara real-time dengan AI.',
    href: '/tiv-check',
    icon: <Camera className="h-8 w-8 text-primary" />,
    img: "https://placehold.co/600x400.png",
    imgHint: "yoga posture",
    cta: 'Mulai Cek'
  },
  {
    title: 'TIV-TALKS',
    description: 'Dapatkan jawaban empatik untuk pertanyaan kesehatan Anda.',
    href: '/tiv-talks',
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    img: "https://placehold.co/600x400.png",
    imgHint: "friends talking",
    cta: 'Mulai Bicara'
  },
  {
    title: 'TIV-TRACK',
    description: 'Lacak aktivitas, nutrisi, dan siklus harian Anda.',
    href: '/tiv-track',
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    img: "https://placehold.co/600x400.png",
    imgHint: "activity tracking",
    cta: 'Lacak Aktivitas'
  },
  {
    title: 'TIV-COACH',
    description: 'Panduan yoga virtual dengan instruktur avatar.',
    href: '/tiv-coach',
    icon: <Dumbbell className="h-8 w-8 text-primary" />,
    img: "https://placehold.co/600x400.png",
    imgHint: "yoga instructor",
    cta: 'Mulai Latihan'
  }
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">Selamat Datang di BEAUTIVE</h1>
        <p className="text-lg text-muted-foreground">Pusat kebugaran dan kesehatan Anda, dirancang untuk memberdayakan.</p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/50">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={feature.img} alt={feature.title} layout="fill" objectFit="cover" data-ai-hint={feature.imgHint} />
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
