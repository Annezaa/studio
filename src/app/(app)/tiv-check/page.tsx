"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, Zap, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { correctYogaPosture, type CorrectYogaPostureOutput } from '@/ai/flows/correct-yoga-posture';
import { useToast } from "@/hooks/use-toast";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedPose, setSelectedPose] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorrectYogaPostureOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Turn off camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  async function toggleCamera() {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        setError(null);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin.");
        toast({
          title: "Error Kamera",
          description: "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin.",
          variant: "destructive",
        });
      }
    }
  }

  async function handleCheckPosture() {
    if (!videoRef.current || !canvasRef.current || !selectedPose) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Silakan aktifkan kamera dan pilih pose yoga.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUri = canvas.toDataURL('image/jpeg');

    try {
      const response = await correctYogaPosture({
        cameraFeedDataUri: dataUri,
        poseDescription: selectedPose,
      });
      setResult(response);
    } catch (err) {
      console.error("Error correcting posture:", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
      setError(`Gagal menganalisis postur: ${errorMessage}`);
      toast({
        title: "Analisis Gagal",
        description: `Gagal menganalisis postur: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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
              <Camera className="h-6 w-6" />
              Kamera Anda
            </CardTitle>
            <CardDescription>Arahkan kamera ke diri Anda saat melakukan pose yoga.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
            <div className="w-full aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${!isCameraOn && 'hidden'}`}></video>
              {!isCameraOn && <Camera className="h-16 w-16 text-muted-foreground" />}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <Button onClick={toggleCamera} variant={isCameraOn ? 'destructive' : 'default'} className="w-full">
              {isCameraOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">1. Pilih Pose</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedPose} value={selectedPose} disabled={!isCameraOn || isLoading}>
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
                <Button onClick={handleCheckPosture} disabled={!isCameraOn || !selectedPose || isLoading} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                {isLoading ? 'Menganalisis...' : 'Periksa Postur Saya'}
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
                    <CheckCircle className="h-4 w-4 text-accent" />
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
