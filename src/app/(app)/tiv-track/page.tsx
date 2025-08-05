
"use client";

import useLocalStorage from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Dumbbell, GlassWater, Bed, CalendarHeart, Plus, Minus, Flame, Smile as SmileIcon, Frown, Laugh, Meh, Angry } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useMemo } from 'react';
import { ChartContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek } from 'date-fns';
import { id as indonesiaLocale } from 'date-fns/locale';

const isSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const getStreak = (exerciseHistory: string[]): number => {
  if (exerciseHistory.length === 0) {
    return 0;
  }

  let streak = 0;
  const today = new Date();
  const sortedDates = exerciseHistory.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

  const uniqueDates: Date[] = [];
  sortedDates.forEach(date => {
    if (!uniqueDates.some(uniqueDate => isSameDay(uniqueDate, date))) {
      uniqueDates.push(date);
    }
  });

  const lastDay = uniqueDates[0];
  const isTodayCompleted = isSameDay(today, lastDay);
  const isYesterdayCompleted = isSameDay(new Date(today.getTime() - 86400000), lastDay);

  if (!isTodayCompleted && !isYesterdayCompleted) {
    return 0;
  }

  streak = isTodayCompleted ? 1 : 0;
  let currentDate = isTodayCompleted ? lastDay : today;

  for (let i = isTodayCompleted ? 1 : 0; i < uniqueDates.length; i++) {
    const prevDate = new Date(currentDate.getTime() - 86400000);
    if (isSameDay(uniqueDates[i], prevDate)) {
      streak++;
      currentDate = uniqueDates[i];
    } else {
      break;
    }
  }

  return streak;
};

interface MoodEntry {
  date: string;
  mood: number; // 1 to 5
}

const moodOptions = [
  { mood: 5, icon: '😄', label: 'Sangat Senang' },
  { mood: 4, icon: '🙂', label: 'Senang' },
  { mood: 3, icon: '😐', label: 'Biasa' },
  { mood: 2, icon: '😔', label: 'Sedih' },
  { mood: 1, icon: '😢', label: 'Sangat Sedih' },
];

export default function TivTrackPage() {
  const [exerciseDuration, setExerciseDuration] = useLocalStorage('exerciseDuration', 0);
  const exerciseGoal = 60;

  const [waterIntake, setWaterIntake] = useLocalStorage('waterIntake', 0);
  const waterGoal = 8;

  const [sleepQuality, setSleepQuality] = useLocalStorage<number[]>('sleepQuality', [7]);

  const [cycleDays, setCycleDays] = useLocalStorage<string[]>('cycleDays', []);
  
  const [exerciseHistory, setExerciseHistory] = useLocalStorage<string[]>('exerciseHistory', []);
  const [streak, setStreak] = useState(0);

  const [moodHistory, setMoodHistory] = useLocalStorage<MoodEntry[]>('moodHistory', []);

  useEffect(() => {
    setStreak(getStreak(exerciseHistory));
  }, [exerciseHistory]);
  
  const handleMoodSelect = (mood: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newMoodHistory = moodHistory.filter(entry => entry.date !== todayStr);
    setMoodHistory([...newMoodHistory, { date: todayStr, mood }]);
  };

  const getTodayMood = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === todayStr)?.mood;
  };
  
  const moodChartData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = format(date, "EEEEEE", { locale: indonesiaLocale });
        const moodEntry = moodHistory.find(entry => entry.date === dateStr);
        data.push({
            name: dayName,
            mood: moodEntry ? moodEntry.mood : 0,
            label: moodEntry ? moodOptions.find(m => m.mood === moodEntry.mood)?.icon : '❔'
        });
    }
    return data;
  }, [moodHistory]);

  const getMoodSummary = () => {
    const recentMoods = moodChartData.filter(d => d.mood > 0).map(d => d.mood);
    if (recentMoods.length < 2) return "Lacak mood kamu untuk melihat ringkasan mingguan.";

    const avgMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    const moodVariation = Math.max(...recentMoods) - Math.min(...recentMoods);
    
    let summary = "";
    if (moodVariation <= 1) {
      summary = "Mood kamu lebih stabil minggu ini. ";
    } else if (moodVariation >= 3) {
      summary = "Mood kamu cukup bervariasi minggu ini. ";
    }

    const bestDayIndex = recentMoods.indexOf(Math.max(...recentMoods));
    const bestDay = moodChartData.filter(d => d.mood > 0)[bestDayIndex];
    if(bestDay) {
        const fullDayName = format(subDays(new Date(), 6 - moodChartData.indexOf(bestDay)), "EEEE", { locale: indonesiaLocale });
        summary += `Hari terbaikmu: ${fullDayName}!`;
    }
    
    return summary;
  };

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    const dayStr = day.toISOString().split('T')[0];
    const newCycleDays = cycleDays.includes(dayStr)
      ? cycleDays.filter((d) => d !== dayStr)
      : [...cycleDays, dayStr];
    setCycleDays(newCycleDays);
  };
  
  const handleExerciseChange = (value: number) => {
    const newDuration = Math.max(0, value);
    setExerciseDuration(newDuration);

    const todayStr = new Date().toISOString();
    const historyExists = exerciseHistory.some(d => isSameDay(new Date(d), new Date()));

    if(newDuration > 0 && !historyExists) {
        setExerciseHistory([...exerciseHistory, todayStr]);
    } else if (newDuration === 0 && historyExists) {
        setExerciseHistory(exerciseHistory.filter(d => !isSameDay(new Date(d), new Date())));
    }
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

  const getStreakBadge = () => {
    if (streak >= 7) {
      return <Badge variant="destructive" className="flex items-center gap-1"><Flame className="h-4 w-4" /> Unstoppable Soul</Badge>;
    }
    if (streak >= 3) {
      return <Badge variant="secondary" className="flex items-center gap-1"><Flame className="h-4 w-4" /> Strong Streaker</Badge>;
    }
    return null;
  }

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">TIV-TRACK</h1>
        <p className="text-lg text-muted-foreground">Lacak kemajuan harian Anda dan bangun kebiasaan sehat.</p>
      </header>
      
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between font-headline">
              <div className="flex items-center gap-2">
                <Flame className="text-primary"/> Konsistensi Latihan
              </div>
              {getStreakBadge()}
            </CardTitle>
            <CardDescription>
                {streak > 0 ? `Anda telah berlatih selama ${streak} hari berturut-turut! Pertahankan!` : "Mulai lacak latihanmu untuk membangun konsistensi."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
              {Array.from({length: 7}).map((_, i) => {
                  const dayStreak = streak >= (i+1);
                  return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dayStreak ? 'bg-primary' : 'bg-muted'}`}>
                              <Flame className={`h-6 w-6 ${dayStreak ? 'text-primary-foreground' : 'text-muted-foreground'}`}/>
                          </div>
                          <span className="text-xs text-muted-foreground">Hari {i+1}</span>
                      </div>
                  )
              })}
          </CardContent>
        </Card>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Dumbbell className="text-primary"/>Durasi Olahraga (menit)</CardTitle>
            <CardDescription>Target harian: {exerciseGoal} menit. Ini akan memulai streak Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={exerciseDuration} 
                onChange={(e) => handleExerciseChange(Number(e.target.value))}
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

        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><SmileIcon className="text-primary"/>Pelacak Mood</CardTitle>
                <CardDescription>Bagaimana perasaanmu hari ini? Pilihanmu akan disimpan untuk hari ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-around">
                {moodOptions.map(({ mood, icon, label }) => (
                    <Button
                    key={mood}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-16 w-16 rounded-full text-4xl transition-all duration-300 transform hover:scale-110",
                        getTodayMood() === mood && "bg-primary/20 scale-110 border-2 border-primary"
                    )}
                    onClick={() => handleMoodSelect(mood)}
                    aria-label={label}
                    >
                    {icon}
                    </Button>
                ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">Tren Mood Mingguan</h3>
                   <ChartContainer config={chartConfig} className="h-64 w-full">
                        <BarChart data={moodChartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis domain={[0, 5]} tickLine={false} axisLine={false} hide/>
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent
                                  formatter={(value, name, item) => (
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">{item.payload.label}</span>
                                      <span>{moodOptions.find(m => m.mood === value)?.label}</span>
                                    </div>
                                  )}
                                  labelFormatter={(label) => format(new Date(), 'eeee, d MMMM', { locale: indonesiaLocale})}
                                />}
                            />
                            <Bar dataKey="mood" radius={8} />
                        </BarChart>
                    </ChartContainer>
                    <p className="text-sm text-center text-muted-foreground mt-2">{getMoodSummary()}</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

