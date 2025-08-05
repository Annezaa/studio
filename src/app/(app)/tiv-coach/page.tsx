
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Volume2, Loader, AlertCircle } from 'lucide-react';
import { audioNarrator } from '@/ai/flows/audio-narrator-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const yogaPosesData = [
  {
    name: "Downward-Facing Dog (Adho Mukha Svanasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "downward dog yoga",
    description: "Pose ini meregangkan seluruh tubuh, membangun kekuatan di lengan dan kaki, serta menenangkan pikiran.",
    levels: {
      pemula: {
        duration: "30-60 detik",
        steps: [
          "Mulai dengan posisi merangkak. Lutut di bawah pinggul, tangan sedikit di depan bahu.",
          "Hembuskan napas dan angkat lutut dari lantai. Jaga agar lutut sedikit ditekuk.",
          "Panjangkan tulang ekor Anda menjauhi panggul.",
          "Tahan dengan nyaman."
        ]
      },
      menengah: {
        duration: "1-2 menit",
        steps: [
          "Mulai dengan posisi merangkak.",
          "Angkat lutut dan coba luruskan kaki sambil menekan tumit ke lantai.",
          "Jaga agar punggung tetap lurus, membentuk huruf V terbalik.",
          "Libatkan otot inti dan lengan Anda."
        ]
      },
      mahir: {
        duration: "2-3 menit",
        steps: [
          "Dari posisi V terbalik, coba angkat satu kaki lurus ke atas.",
          "Pastikan pinggul tetap sejajar.",
          "Tahan selama beberapa napas, lalu ganti kaki.",
          "Fokus pada pernapasan dalam dan peregangan yang lebih dalam."
        ]
      }
    }
  },
  {
    name: "Warrior II (Virabhadrasana II)",
    image: "https://placehold.co/800x600.png",
    imgHint: "warrior two yoga",
    description: "Meningkatkan stamina, meregangkan pinggul dan bahu, serta membangun konsentrasi.",
    levels: {
      pemula: {
        duration: "20-30 detik per sisi",
        steps: [
          "Berdiri dengan kaki terbuka lebar. Putar kaki kanan 90 derajat ke luar.",
          "Tekuk lutut kanan hingga di atas pergelangan kaki. Jaga kaki kiri lurus.",
          "Angkat lengan sejajar lantai.",
          "Tahan posisi dengan stabil."
        ]
      },
      menengah: {
        duration: "45-60 detik per sisi",
        steps: [
          "Pastikan lutut kanan tertekuk dalam hingga paha sejajar lantai.",
          "Rentangkan lengan dengan kuat, sejajar dengan bahu.",
          "Tatap ujung jari tangan kanan.",
          "Jaga tubuh tetap tegak dan pinggul terbuka."
        ]
      },
      mahir: {
        duration: "1-2 menit per sisi",
        steps: [
          "Dalam posisi Warrior II, coba turunkan pinggul lebih rendah lagi.",
          "Rasakan peregangan yang dalam di paha bagian dalam.",
          "Pastikan energi mengalir dari ujung jari ke ujung jari.",
          "Pertahankan napas yang stabil dan kuat."
        ]
      }
    }
  },
  {
    name: "Tree Pose (Vrksasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "tree pose yoga",
    description: "Meningkatkan keseimbangan, memperkuat paha dan betis, serta menenangkan pikiran.",
    levels: {
      pemula: {
        duration: "15-30 detik per sisi",
        steps: [
          "Berdiri tegak. Pindahkan berat badan ke kaki kiri.",
          "Letakkan telapak kaki kanan di pergelangan kaki atau betis kiri (hindari lutut).",
          "Fokus pada satu titik di depan Anda untuk keseimbangan.",
          "Letakkan tangan di dada atau di samping."
        ]
      },
      menengah: {
        duration: "30-60 detik per sisi",
        steps: [
          "Letakkan telapak kaki kanan di bagian dalam paha kiri.",
          "Satukan kedua telapak tangan di depan dada (posisi Anjali Mudra).",
          "Jaga pinggul tetap sejajar dan buka lutut kanan ke samping.",
          "Rasakan kekuatan dari kaki yang menopang."
        ]
      },
      mahir: {
        duration: "1-2 menit per sisi",
        steps: [
          "Dari posisi Tree Pose, angkat tangan lurus ke atas kepala.",
          "Anda bisa mencoba menutup mata untuk tantangan keseimbangan ekstra.",
          "Jaga napas tetap tenang dan teratur.",
          "Rasakan tubuh Anda tumbuh tinggi seperti pohon."
        ]
      }
    }
  }
];

type Difficulty = 'pemula' | 'menengah' | 'mahir';

export default function TivCoachPage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [difficulty, setDifficulty] = useState<Difficulty>('pemula');
  const [audioStates, setAudioStates] = useState<Record<number, { loading: boolean, error: string | null, data: string | null }>>({});
  const { toast } = useToast();
  
  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    const handleSelect = (api: CarouselApi) => {
        setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  const handlePoseSelect = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  const handleNarration = async (poseIndex: number) => {
    const pose = yogaPosesData[poseIndex];
    if (!pose) return;

    const currentLevelData = pose.levels[difficulty];
    const textToNarrate = `Pose: ${pose.name}. Tingkat: ${difficulty}. Durasi yang disarankan: ${currentLevelData.duration}. Langkah-langkah: ${currentLevelData.steps.join('. ')}`;

    setAudioStates(prev => ({ ...prev, [poseIndex]: { loading: true, error: null, data: null } }));

    try {
      const result = await audioNarrator(textToNarrate);
      setAudioStates(prev => ({ ...prev, [poseIndex]: { loading: false, error: null, data: result.media } }));
    } catch (err) {
      console.error("Audio generation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal menghasilkan audio.";
      setAudioStates(prev => ({ ...prev, [poseIndex]: { loading: false, error: errorMessage, data: null } }));
      toast({
        title: "Narasi Gagal",
        description: "Gagal membuat narasi audio. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">TIV-COACH</h1>
        <p className="text-lg text-muted-foreground">Biarkan avatar virtual kami memandu Anda melalui setiap pose yoga.</p>
      </header>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-2 p-2">
          {yogaPosesData.map((pose, index) => (
            <Button
              key={pose.name}
              variant={index === current ? "default" : "outline"}
              onClick={() => handlePoseSelect(index)}
              className="whitespace-normal h-auto"
            >
              {pose.name.split('(')[0]}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Carousel setApi={setApi} className="w-full max-w-5xl mx-auto" opts={{ loop: true }}>
        <CarouselContent>
          {yogaPosesData.map((pose, index) => {
            const levelData = pose.levels[difficulty];
            const audioState = audioStates[index] || { loading: false, error: null, data: null };

            return (
              <CarouselItem key={pose.name}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col lg:flex-row gap-6 p-6 items-center">
                      <div className="w-full lg:w-2/3 flex-shrink-0 flex gap-4">
                        <div className="relative w-2/3 aspect-[4/3] rounded-lg overflow-hidden border-2 border-primary">
                          <Image src={pose.image} alt={pose.name} layout="fill" objectFit="cover" data-ai-hint={pose.imgHint}/>
                        </div>
                        <div className="relative w-1/3 aspect-[2/3] rounded-lg overflow-hidden">
                          <Image src="https://placehold.co/400x600.png" alt="Yoga Instructor Avatar" layout="fill" objectFit="cover" data-ai-hint="yoga instructor avatar" />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/3 space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor={`difficulty-${index}`}>Tingkat Kesulitan</Label>
                           <Select onValueChange={(value) => setDifficulty(value as Difficulty)} defaultValue={difficulty}>
                            <SelectTrigger id={`difficulty-${index}`}>
                                <SelectValue placeholder="Pilih tingkat..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pemula">Pemula</SelectItem>
                                <SelectItem value="menengah">Menengah</SelectItem>
                                <SelectItem value="mahir">Mahir</SelectItem>
                            </SelectContent>
                           </Select>
                        </div>
                        <CardTitle className="text-2xl font-headline">{pose.name}</CardTitle>
                        <CardDescription>{pose.description}</CardDescription>
                         <p className="text-sm font-semibold">Durasi: <span className="font-normal text-muted-foreground">{levelData.duration}</span></p>
                        <div>
                          <h3 className="font-semibold mb-2">Langkah-langkah:</h3>
                          <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            {levelData.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <Button onClick={() => handleNarration(index)} disabled={audioState.loading}>
                            {audioState.loading ? (
                              <><Loader className="mr-2 animate-spin" /> Memuat...</>
                            ) : (
                              <><Volume2 className="mr-2" /> Dengarkan Instruksi</>
                            )}
                          </Button>
                           {audioState.error && <p className="text-destructive text-xs mt-2 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {audioState.error}</p>}
                          {audioState.data && (
                            <div className="mt-4">
                              <audio controls src={audioState.data} className="w-full">
                                Browser Anda tidak mendukung elemen audio.
                              </audio>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </div>
  );
}

// Add Label to prevent breaking changes from shadcn
const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 " + className}
    {...props}
  />
);
