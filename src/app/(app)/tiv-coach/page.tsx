
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
import { ScrollArea } from '@/components/ui/scroll-area';

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
  },
  {
    name: "Triangle Pose (Trikonasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "triangle pose yoga",
    description: "Meregangkan kaki, pinggul, dan tulang belakang, serta meningkatkan keseimbangan.",
    levels: {
      pemula: {
        duration: "20-30 detik per sisi",
        steps: [
            "Berdiri dengan kaki terbuka lebar.",
            "Putar kaki kanan ke luar 90 derajat dan kaki kiri sedikit ke dalam.",
            "Rentangkan lengan sejajar dengan lantai, lalu tekuk ke samping kanan, letakkan tangan di tulang kering atau balok.",
            "Angkat lengan kiri ke atas."
        ]
      },
      menengah: {
        duration: "30-45 detik per sisi",
        steps: [
            "Letakkan tangan kanan di lantai di belakang kaki kanan Anda.",
            "Buka dada lebih lebar, tatap ujung jari tangan kiri di atas.",
            "Jaga kedua kaki tetap kuat dan lurus.",
            "Rasakan peregangan di sisi tubuh Anda."
        ]
      },
      mahir: {
        duration: "1 menit per sisi",
        steps: [
            "Pegang ibu jari kaki kanan Anda dengan jari telunjuk dan tengah tangan kanan.",
            "Tingkatkan putaran pada tulang belakang Anda, buka dada sepenuhnya ke langit-langit.",
            "Jaga agar inti tubuh tetap aktif untuk stabilitas.",
            "Pertahankan napas yang dalam dan teratur."
        ]
      }
    }
  },
  {
    name: "Bridge Pose (Setu Bandhasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "bridge pose yoga",
    description: "Memperkuat punggung, bokong, dan paha belakang, serta meregangkan dada.",
    levels: {
      pemula: {
        duration: "30-60 detik",
        steps: [
            "Berbaring telentang dengan lutut ditekuk, kaki rata di lantai selebar pinggul.",
            "Letakkan lengan di samping tubuh dengan telapak tangan menghadap ke bawah.",
            "Angkat pinggul dari lantai.",
            "Jaga agar paha tetap sejajar."
        ]
      },
      menengah: {
        duration: "1-2 menit",
        steps: [
            "Kaitkan jari-jari tangan di bawah panggul Anda yang terangkat.",
            "Tekan lengan dan bahu ke lantai untuk mengangkat dada lebih tinggi.",
            "Angkat pinggul lebih tinggi lagi, libatkan bokong.",
            "Bernapas dengan stabil."
        ]
      },
      mahir: {
        duration: "2 menit",
        steps: [
            "Dari posisi Bridge, angkat satu kaki lurus ke langit-langit.",
            "Jaga agar pinggul tetap sejajar dan terangkat.",
            "Tahan selama beberapa napas, lalu ganti kaki.",
            "Libatkan inti tubuh untuk menjaga keseimbangan."
        ]
      }
    }
  },
  {
    name: "Cat-Cow Pose (Marjaryasana-Bitilasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "cat cow pose yoga",
    description: "Meningkatkan fleksibilitas tulang belakang dan meredakan ketegangan punggung.",
    levels: {
      pemula: {
        duration: "1-2 menit",
        steps: [
            "Mulai dengan posisi merangkak.",
            "Tarik napas sambil melengkungkan punggung ke bawah (Cow).",
            "Hembuskan napas sambil membulatkan tulang belakang ke atas (Cat).",
            "Ulangi gerakan ini mengikuti irama napas Anda."
        ]
      },
      menengah: {
        duration: "2-3 menit",
        steps: [
            "Fokus pada koordinasi napas dan gerakan secara presisi.",
            "Saat dalam pose Cow, buka dada Anda ke depan.",
            "Saat dalam pose Cat, dorong lantai menjauh dari Anda.",
            "Rasakan setiap sendi tulang belakang bergerak."
        ]
      },
      mahir: {
        duration: "3-5 menit",
        steps: [
            "Tambahkan gerakan melingkar pada pinggul dan tulang rusuk.",
            "Gerakkan tubuh secara bebas dan intuitif dari pose Cat ke Cow.",
            "Coba tutup mata Anda untuk merasakan gerakan lebih dalam.",
            "Jadikan ini sebagai meditasi bergerak."
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Daftar Pose</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="flex flex-col space-y-2 pr-4">
                        {yogaPosesData.map((pose, index) => (
                            <Button
                            key={pose.name}
                            variant={index === current ? "default" : "outline"}
                            onClick={() => handlePoseSelect(index)}
                            className="w-full justify-start text-left h-auto py-2"
                            >
                            {pose.name.split('(')[0]}
                            </Button>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-3">
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
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
      </div>
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
