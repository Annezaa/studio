"use client";

import useLocalStorage from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Dumbbell, GlassWater, Bed, CalendarHeart, Plus, Minus } from 'lucide-react';

export default function TivTrackPage() {
  const [exerciseDuration, setExerciseDuration] = useLocalStorage('exerciseDuration', 0);
  const exerciseGoal = 60;

  const [waterIntake, setWaterIntake] = useLocalStorage('waterIntake', 0);
  const waterGoal = 8;

  const [sleepQuality, setSleepQuality] = useLocalStorage<number[]>('sleepQuality', [7]);

  const [cycleDays, setCycleDays] = useLocalStorage<string[]>('cycleDays', []);
  
  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    const dayStr = day.toISOString().split('T')[0];
    const newCycleDays = cycleDays.includes(dayStr)
      ? cycleDays.filter((d) => d !== dayStr)
      : [...cycleDays, dayStr];
    setCycleDays(newCycleDays);
  };

  const selectedDates = cycleDays.map(dayStr => new Date(dayStr));

  const modifiersStyles = {
    selected: {
      color: 'hsl(var(--primary-foreground))',
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '100%',
    },
     today: {
      color: 'hsl(var(--accent))',
      fontWeight: 'bold',
    },
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">TIV-TRACK</h1>
        <p className="text-lg text-muted-foreground">Lacak kemajuan harian Anda dan bangun kebiasaan sehat.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Dumbbell className="text-primary"/>Durasi Olahraga (menit)</CardTitle>
            <CardDescription>Target harian: {exerciseGoal} menit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={exerciseDuration} 
                onChange={(e) => setExerciseDuration(Math.max(0, Number(e.target.value)))}
                className="text-center text-lg font-bold"
              />
            </div>
            <Progress value={(exerciseDuration / exerciseGoal) * 100} className="h-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><GlassWater className="text-primary"/>Asupan Air (gelas)</CardTitle>
            <CardDescription>Target harian: {waterGoal} gelas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
                <Button size="icon" variant="outline" onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}>
                    <Minus className="h-4 w-4"/>
                </Button>
                <p className="text-3xl font-bold text-primary w-20 text-center">{waterIntake}</p>
                <Button size="icon" variant="outline" onClick={() => setWaterIntake(waterIntake + 1)}>
                    <Plus className="h-4 w-4"/>
                </Button>
            </div>
            <Progress value={(waterIntake / waterGoal) * 100} className="h-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Bed className="text-primary"/>Kualitas Tidur</CardTitle>
            <CardDescription>Geser untuk menilai kualitas tidur Anda semalam.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Slider
                value={sleepQuality}
                max={10}
                step={1}
                onValueChange={setSleepQuality}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Buruk</span>
                <span className="text-center">Cukup Baik <br/>({sleepQuality[0]})</span>
                <span>Sangat Baik</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><CalendarHeart className="text-primary"/>Siklus Menstruasi</CardTitle>
            <CardDescription>Pilih tanggal mulai siklus menstruasi Anda.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
                mode="multiple"
                selected={selectedDates}
                onDayClick={handleDayClick}
                modifiersStyles={modifiersStyles}
                className="rounded-md"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
