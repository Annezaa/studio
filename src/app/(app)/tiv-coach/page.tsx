import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const yogaPoses = [
  {
    name: "Downward-Facing Dog (Adho Mukha Svanasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "downward dog yoga",
    description: "Pose ini meregangkan seluruh tubuh, membangun kekuatan di lengan dan kaki, serta menenangkan pikiran.",
    steps: [
      "Mulai dengan posisi merangkak. Lutut di bawah pinggul, tangan sedikit di depan bahu.",
      "Hembuskan napas dan angkat lutut dari lantai. Jaga agar lutut sedikit ditekuk dan tumit terangkat.",
      "Panjangkan tulang ekor Anda menjauhi panggul dan dorong paha atas ke belakang.",
      "Tahan selama 1 hingga 3 menit, lalu tekuk lutut ke lantai untuk beristirahat."
    ]
  },
  {
    name: "Warrior II (Virabhadrasana II)",
    image: "https://placehold.co/800x600.png",
    imgHint: "warrior two yoga",
    description: "Meningkatkan stamina, meregangkan pinggul dan bahu, serta membangun konsentrasi.",
    steps: [
      "Berdiri dengan kaki terbuka lebar. Putar kaki kanan 90 derajat ke luar dan kaki kiri sedikit ke dalam.",
      "Tekuk lutut kanan hingga sejajar dengan pergelangan kaki. Jaga agar kaki kiri tetap lurus.",
      "Angkat lengan sejajar dengan lantai, rentangkan ke samping.",
      "Tatap ke arah tangan kanan. Tahan selama 30 detik hingga 1 menit."
    ]
  },
  {
    name: "Tree Pose (Vrksasana)",
    image: "https://placehold.co/800x600.png",
    imgHint: "tree pose yoga",
    description: "Meningkatkan keseimbangan, memperkuat paha dan betis, serta menenangkan pikiran.",
    steps: [
      "Berdiri tegak. Pindahkan berat badan ke kaki kiri.",
      "Letakkan telapak kaki kanan di bagian dalam paha kiri. Hindari meletakkannya di lutut.",
      "Satukan kedua telapak tangan di depan dada (posisi Anjali Mudra).",
      "Fokus pada satu titik di depan Anda untuk menjaga keseimbangan. Tahan selama 30 detik."
    ]
  }
];

export default function TivCoachPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">TIV-COACH</h1>
        <p className="text-lg text-muted-foreground">Biarkan avatar virtual kami memandu Anda melalui setiap pose yoga.</p>
      </header>

      <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
        <CarouselContent>
          {yogaPoses.map((pose) => (
            <CarouselItem key={pose.name}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col lg:flex-row gap-6 p-6 items-center">
                    <div className="w-full lg:w-1/2 flex-shrink-0">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <Image src={pose.image} alt={pose.name} layout="fill" objectFit="cover" className="object-cover" data-ai-hint={pose.imgHint}/>
                      </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-4">
                      <CardTitle className="text-2xl font-headline">{pose.name}</CardTitle>
                      <CardDescription>{pose.description}</CardDescription>
                      <div>
                        <h3 className="font-semibold mb-2">Langkah-langkah:</h3>
                        <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {pose.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-12" />
        <CarouselNext className="hidden sm:flex -right-12" />
      </Carousel>
    </div>
  );
}
