
"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const yogaPosesData = [
  {
    name: "Downward-Facing Dog",
    image: "https://youtu.be/Y0GDgQqt-bA",
    imgHint: "downward dog yoga",
    description: "Pose ini meregangkan seluruh tubuh, membangun kekuatan di lengan dan kaki, serta menenangkan pikiran.",
    duration: "30-60 detik",
    steps: [
      "Mulai dengan posisi merangkak. Lutut di bawah pinggul, tangan sedikit di depan bahu.",
      "Hembuskan napas dan angkat lutut dari lantai. Jaga agar lutut sedikit ditekuk.",
      "Panjangkan tulang ekor Anda menjauhi panggul.",
      "Tahan dengan nyaman."
    ]
  },
  {
    name: "Warrior II",
    image: "https://youtu.be/pJhevMZfOHA",
    imgHint: "warrior two yoga",
    description: "Meningkatkan stamina, meregangkan pinggul dan bahu, serta membangun konsentrasi.",
    duration: "20-30 detik per sisi",
    steps: [
      "Berdiri dengan kaki terbuka lebar. Putar kaki kanan 90 derajat ke luar.",
      "Tekuk lutut kanan hingga di atas pergelangan kaki. Jaga kaki kiri lurus.",
      "Angkat lengan sejajar lantai.",
      "Tahan posisi dengan stabil."
    ]
  },
  {
    name: "Tree Pose",
    image: "https://youtu.be/uELr6MPi7pI",
    imgHint: "tree pose yoga",
    description: "Meningkatkan keseimbangan, memperkuat paha dan betis, serta menenangkan pikiran.",
    duration: "15-30 detik per sisi",
    steps: [
      "Berdiri tegak. Pindahkan berat badan ke kaki kiri.",
      "Letakkan telapak kaki kanan di pergelangan kaki atau betis kiri (hindari lutut).",
      "Fokus pada satu titik di depan Anda untuk keseimbangan.",
      "Letakkan tangan di dada atau di samping."
    ]
  },
  {
    name: "Triangle Pose",
    image: "https://youtu.be/S6gB0QHbWFE",
    imgHint: "triangle pose yoga",
    description: "Meregangkan kaki, pinggul, dan tulang belakang, serta meningkatkan keseimbangan.",
    duration: "20-30 detik per sisi",
    steps: [
        "Berdiri dengan kaki terbuka lebar.",
        "Putar kaki kanan ke luar 90 derajat dan kaki kiri sedikit ke dalam.",
        "Rentangkan lengan sejajar dengan lantai, lalu tekuk ke samping kanan, letakkan tangan di tulang kering atau balok.",
        "Angkat lengan kiri ke atas."
    ]
  },
  {
    name: "Bridge Pose",
    image: "https://youtu.be/XUcAuYd7VU0",
    imgHint: "bridge pose yoga",
    description: "Memperkuat punggung, bokong, dan paha belakang, serta meregangkan dada.",
    duration: "30-60 detik",
    steps: [
        "Berbaring telentang dengan lutut ditekuk, kaki rata di lantai selebar pinggul.",
        "Letakkan lengan di samping tubuh dengan telapak tangan menghadap ke bawah.",
        "Angkat pinggul dari lantai.",
        "Jaga agar paha tetap sejajar."
    ]
  },
  {
    name: "Cat-Cow Pose",
    image: "https://youtu.be/y_cKHKi9UaM",
    imgHint: "cat cow pose yoga",
    description: "Meningkatkan fleksibilitas tulang belakang dan meredakan ketegangan punggung.",
    duration: "1-2 menit",
    steps: [
        "Mulai dengan posisi merangkak.",
        "Tarik napas sambil melengkungkan punggung ke bawah (Cow).",
        "Hembuskan napas sambil membulatkan tulang belakang ke atas (Cat).",
        "Ulangi gerakan ini mengikuti irama napas Anda."
    ]
  }
];

function getYouTubeEmbedUrl(url: string) {
    let videoId = null;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w-]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
        videoId = match[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function TivCoachContent() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (!api) {
      return
    }

    const poseFromUrl = searchParams.get('pose');
    if (poseFromUrl) {
      const poseIndex = yogaPosesData.findIndex(p => p.name === poseFromUrl);
      if (poseIndex !== -1) {
        api.scrollTo(poseIndex, true);
        setCurrent(poseIndex);
      }
    } else {
        setCurrent(api.selectedScrollSnap());
    }

    const handleSelect = (api: CarouselApi) => {
        setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api, searchParams])

  const handlePoseSelect = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);


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
                            {pose.name}
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
              {yogaPosesData.map((pose) => {
                  const embedUrl = getYouTubeEmbedUrl(pose.image);
                  return (
                      <CarouselItem key={pose.name}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex flex-col lg:flex-row gap-6 p-6 items-start">
                              <div className="w-full lg:w-1/2 flex-shrink-0">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary">
                                  {embedUrl ? (
                                    <iframe
                                      src={embedUrl}
                                      title={pose.name}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      className="absolute top-0 left-0 w-full h-full"
                                    ></iframe>
                                  ) : (
                                    <Image src={pose.image} alt={pose.name} layout="fill" objectFit="cover" data-ai-hint={pose.imgHint}/>
                                  )}
                                </div>
                              </div>
                              <div className="w-full lg:w-1/2 space-y-4">
                                <CardTitle className="text-2xl font-headline">{pose.name}</CardTitle>
                                <CardDescription>{pose.description}</CardDescription>
                                <p className="text-sm font-semibold">Durasi: <span className="font-normal text-muted-foreground">{pose.duration}</span></p>
                                <div>
                                  <h3 className="font-semibold mb-2">Langkah-langkah:</h3>
                                  <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                    {pose.steps.map((step, i) => (
                                      <li key={i}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                  )
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

export default function TivCoachPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TivCoachContent />
        </Suspense>
    )
}

    