
"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, Zap, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { correctYogaPosture, type CorrectYogaPostureOutput } from '@/ai/flows/correct-yoga-posture';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const yogaPoses = [
  "Downward-Facing Dog",
  "Warrior II",
  "Tree Pose",
  "Triangle Pose",
  "Bridge Pose",
  "Cat-Cow Pose"
];

export default function TivCheckPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedPose, setSelectedPose] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorrectYogaPostureOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.error("Error saat mengakses kamera:", err);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Akses Kamera Ditolak",
          description: "Harap izinkan akses kamera di pengaturan browser Anda untuk menggunakan fitur ini.",
        });
      }
    };

    enableCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCheckPosture = async () => {
    if (!selectedPose) {
      setError("Silakan pilih pose yoga terlebih dahulu.");
      return;
    }
    if (!videoRef.current || !hasCameraPermission) {
        setError("Kamera tidak aktif. Harap nyalakan kamera terlebih dahulu.");
        return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error("Tidak bisa mendapatkan konteks canvas");
        }
        
        // Flip the canvas context horizontally to match the video feed
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const cameraFeedDataUri = canvas.toDataURL('image/jpeg');
        
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
              <video ref={videoRef} className={cn("w-full h-full object-cover transform scale-x-[-1]", !hasCameraPermission && "hidden")} autoPlay muted playsInline />
              {!hasCameraPermission && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <CameraIcon className="h-16 w-16" />
                    <p>Mengaktifkan kamera...</p>
                </div>
              )}
            </div>
             {hasCameraPermission && !isLoading && (
                 <Alert>
                    <AlertDescription>Posisikan diri Anda di depan kamera dan klik "Periksa Postur Saya".</AlertDescription>
                </Alert>
            )}
             {!hasCameraPermission && (
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
                    <SelectItem key={pose} value={pose}>{pose}</SelectItem>
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
                <Button onClick={handleCheckPosture} disabled={!selectedPose || isLoading || !hasCameraPermission} className="w-full">
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
