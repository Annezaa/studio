
"use client";

import { useState } from 'react';
import { Camera as CameraIcon, Zap, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CorrectYogaPostureOutput } from '@/ai/flows/correct-yoga-posture';
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
  
  const [selectedPose, setSelectedPose] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CorrectYogaPostureOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckPosture = async () => {
    toast({
        title: "Fitur Dalam Perbaikan",
        description: "Fungsionalitas deteksi postur sedang dalam perbaikan dan akan segera kembali.",
      });
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
            <CardDescription>Detektor postur sedang dalam perbaikan. Fitur ini akan segera kembali.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-[640px] aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center relative">
              <CameraIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button variant="default" className="w-full max-w-[640px]" disabled>
              Nyalakan Kamera
            </Button>
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
                <Button onClick={handleCheckPosture} disabled={!selectedPose || isLoading} className="w-full">
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
