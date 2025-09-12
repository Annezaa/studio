
"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Camera as CameraIcon, Zap, CheckCircle, XCircle, Video, VideoOff, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { correctYogaPosture, type CorrectYogaPostureOutput } from '@/ai/flows/correct-yoga-posture';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const yogaPoses = [
  { name: "Downward-Facing Dog", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1887&auto=format&fit=crop", hint: "downward dog yoga" },
  { name: "Warrior II", image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1887&auto=format&fit=crop", hint: "warrior two yoga" },
  { name: "Tree Pose", image: "https://images.unsplash.com/photo-1575052814086-c7592e152d1c?q=80&w=1887&auto=format&fit=crop", hint: "tree pose yoga" },
  { name: "Triangle Pose", image: "https://images.unsplash.com/photo-1603988363607-93a33599595a?q=80&w=1887&auto=format&fit=crop", hint: "triangle pose yoga" },
  { name: "Bridge Pose", image: "https://images.unsplash.com/photo-1572449043442-c5c79a493325?q=80&w=1964&auto=format&fit=crop", hint: "bridge pose yoga" },
  { name: "Cat-Cow Pose", image: "https://images.unsplash.com/photo-1614713495470-3abc7373f7c4?q=80&w=1887&auto=format&fit=crop", hint: "cat cow yoga" }
];

function TivCheckContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedPose, setSelectedPose] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorrectYogaPostureOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);

  useEffect(() => {
    const poseFromUrl = searchParams.get('pose');
    if (poseFromUrl && yogaPoses.some(p => p.name === poseFromUrl)) {
      setSelectedPose(poseFromUrl);
    }
  }, [searchParams]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setHasCameraPermission(true);
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error saat mengakses kamera:", err);
      setHasCameraPermission(false);
      setIsCameraOn(false);
      toast({
        variant: "destructive",
        title: "Akses Kamera Ditolak",
        description: "Harap izinkan akses kamera di pengaturan browser Anda untuk menggunakan fitur ini.",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    streamRef.current = null;
    setIsCameraOn(false);
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  const handleCheckPosture = async () => {
    if (!selectedPose) {
      setError("Silakan pilih pose yoga terlebih dahulu.");
      return;
    }
    if (!videoRef.current || !isCameraOn) {
        setError("Kamera tidak aktif. Harap nyalakan kamera terlebih dahulu.");
        return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setAnalyzedImage(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) {
          throw new Error("Tidak bisa mendapatkan konteks canvas");
      }
      
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const cameraFeedDataUri = canvas.toDataURL('image/jpeg');
      setAnalyzedImage(cameraFeedDataUri);
      
      const response = await correctYogaPosture({
          cameraFeedDataUri,
          poseDescription: selectedPose,
      });

      setResult(response);
    } catch (err) {
      console.error("Pemeriksaan postur gagal:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal menganalisis postur.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analisis Gagal",
        description: "Terjadi kesalahan saat menganalisis postur Anda. Coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const poseImage = yogaPoses.find(p => p.name === selectedPose)?.image;
  const poseHint = yogaPoses.find(p => p.name === selectedPose)?.hint;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">TIV-CHECK</h1>
        <p className="text-lg text-muted-foreground">Dapatkan umpan balik instan tentang postur yoga Anda dengan kekuatan AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <CameraIcon className="h-6 w-6" />
              Kamera Anda
            </CardTitle>
            <CardDescription>Arahkan kamera ke tubuh Anda untuk analisis postur yang akurat.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-[640px] aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center relative">
              <video 
                ref={videoRef} 
                className={cn(
                  "w-full h-full object-cover transform scale-x-[-1]",
                  !isCameraOn && "hidden"
                )} 
                autoPlay 
                muted 
                playsInline 
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary gap-2 text-muted-foreground">
                    <CameraIcon className="h-16 w-16" />
                    <p>Kamera tidak aktif.</p>
                </div>
              )}
            </div>
             <div className="flex gap-2">
                <Button onClick={startCamera} disabled={isCameraOn}>
                    <Video className="mr-2 h-4 w-4"/> Nyalakan Kamera
                </Button>
                <Button onClick={stopCamera} disabled={!isCameraOn} variant="outline">
                    <VideoOff className="mr-2 h-4 w-4"/> Matikan Kamera
                </Button>
             </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <AlertTitle>Memerlukan Izin Kamera</AlertTitle>
                    <AlertDescription>
                        Harap izinkan akses kamera di browser Anda untuk melanjutkan.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">1. Pilih Pose</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedPose} value={selectedPose}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pose yoga..." />
                </SelectTrigger>
                <SelectContent>
                  {yogaPoses.map(pose => (
                    <SelectItem key={pose.name} value={pose.name}>{pose.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">2. Analisis Postur</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={handleCheckPosture} disabled={!selectedPose || isLoading || !isCameraOn} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                {isLoading ? "Menganalisis..." : "Periksa Postur Saya"}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="bg-gradient-to-br from-primary/10 to-background">
              <CardHeader>
                <CardTitle className="font-headline">Hasil Analisis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyzedImage && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={analyzedImage}
                      alt={`Postur Anda saat dianalisis`}
                      layout="fill"
                      objectFit="cover"
                      className="transform scale-x-[-1]"
                    />
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold">Skor Akurasi</p>
                    <p className="font-bold text-lg text-primary">{result.accuracyScore}%</p>
                  </div>
                  <Progress value={result.accuracyScore} className="h-3" />
                </div>
                <div>
                  <p className="font-semibold mb-2">Umpan Balik:</p>
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-foreground">{result.feedback}</AlertDescription>
                  </Alert>
                </div>
                 <Button asChild className="w-full mt-4">
                    <Link href={`/tiv-coach?pose=${encodeURIComponent(selectedPose)}`}>
                        <Dumbbell className="mr-2 h-4 w-4" />
                        Latih Pose Ini di TIV-COACH
                    </Link>
                 </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


export default function TivCheckPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TivCheckContent />
        </Suspense>
    )
}
    

    

    
