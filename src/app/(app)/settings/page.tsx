
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { User, HelpCircle, Send, Info, ChevronRight, MessageSquareQuote } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const faqData = [
  {
    question: "Bagaimana cara saya menggunakan fitur TIV-CHECK?",
    answer: "TIV-CHECK menggunakan kamera perangkat Anda untuk menganalisis pose yoga Anda secara real-time. Pastikan Anda berada di ruangan yang terang dan kamera Anda memiliki pandangan yang jelas tentang seluruh tubuh Anda. Ikuti instruksi di layar dan perbaiki pose Anda sesuai umpan balik dari AI."
  },
  {
    question: "Apakah TIV-TALKS memberikan diagnosis medis?",
    answer: "Tidak. TIV-TALKS adalah alat pendukung untuk memberikan saran yang empatik dan informatif. Ini tidak boleh digunakan sebagai pengganti nasihat medis profesional. Selalu konsultasikan dengan dokter atau profesional kesehatan untuk masalah kesehatan apa pun."
  },
  {
    question: "Bagaimana cara melacak tidur saya di TIV-TRACK?",
    answer: "TIV-TRACK memungkinkan Anda untuk mencatat jam tidur dan kualitas tidur secara manual. Buka TIV-TRACK dan pilih opsi 'Tidur' untuk memasukkan data Anda. Fitur ini membantu Anda melihat pola tidur dari waktu ke waktu."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Ya. Kami memprioritaskan privasi Anda. Semua data yang Anda masukkan ke dalam BEAUTIVE dienkripsi dan disimpan dengan aman. Anda bisa membaca lebih lanjut di Kebijakan Privasi kami."
  },
  {
    question: "Apakah ada biaya untuk menggunakan BEAUTIVE?",
    answer: "BEAUTIVE memiliki versi gratis dengan fitur dasar. Beberapa fitur premium, seperti panduan latihan yang lebih personal di TIV-COACH, mungkin memerlukan langganan."
  }
];

const settingsItems = [
  {
    title: "Pengaturan Akun",
    icon: <User className="h-5 w-5 text-primary" />,
    content: [
      { label: "Edit Profil", href: "/edit-profile", icon: <User className="mr-2 h-4 w-4"/> },
    ],
  },
  {
    title: "Bantuan & Dukungan",
    icon: <HelpCircle className="h-5 w-5 text-primary" />,
    content: [
      { label: "FAQ", isFaq: true, icon: <HelpCircle className="mr-2 h-4 w-4"/> },
      { label: "Kirim Umpan Balik", isFeedback: true, icon: <MessageSquareQuote className="mr-2 h-4 w-4"/> },
    ],
  },
  {
    title: "Tentang Aplikasi",
    icon: <Info className="h-5 w-5 text-primary" />,
    content: [
      { label: "Versi Aplikasi", text: "1.0.0", icon: <Info className="mr-2 h-4 w-4"/> },
      { label: "Hak Cipta", text: "© 2024 BEAUTIVE", icon: <Info className="mr-2 h-4 w-4"/> },
    ],
  },
];

function FeedbackDialog() {
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Umpan Balik:", { type: feedbackType, message: feedbackMessage });
    toast({
      title: "Terima Kasih!",
      description: "Umpan balik Anda telah berhasil kami terima.",
    });
    setFeedbackType("");
    setFeedbackMessage("");
  };

  return (
    <Dialog onOpenChange={() => {
      setFeedbackType("");
      setFeedbackMessage("");
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center">
            <MessageSquareQuote className="mr-2 h-4 w-4" />
            <span>Kirim Umpan Balik</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Kirim Umpan Balik</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Jenis Umpan Balik</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType} required>
                <SelectTrigger id="feedback-type">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saran">Saran Fitur Baru</SelectItem>
                  <SelectItem value="bug">Laporan Bug (Masalah Teknis)</SelectItem>
                  <SelectItem value="pertanyaan">Pertanyaan Umum</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Pesan Anda</Label>
              <Textarea
                id="feedback-message"
                placeholder="Ceritakan kepada kami saran atau masalah Anda..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="submit" disabled={!feedbackType || !feedbackMessage}>Kirim</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">Pengaturan</h1>
        <p className="text-lg text-muted-foreground">Kelola akun, preferensi, dan lainnya.</p>
      </header>

      <div className="space-y-6">
        {settingsItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                 {item.icon}
                 {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1">
                {item.content.map((subItem) => {
                    if (subItem.isFaq) {
                      return (
                        <Dialog key={subItem.label}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                              <div className="flex items-center">
                                {subItem.icon}
                                <span>{subItem.label}</span>
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="font-headline text-2xl">Pertanyaan yang Sering Diajukan</DialogTitle>
                            </DialogHeader>
                            <Accordion type="single" collapsible className="w-full max-h-[60vh] overflow-y-auto pr-4">
                              {faqData.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                                  <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </DialogContent>
                        </Dialog>
                      );
                    }
                    if (subItem.isFeedback) {
                      return <FeedbackDialog key={subItem.label} />;
                    }
                    if (subItem.href) {
                      return (
                        <Link href={subItem.href} key={subItem.label} passHref>
                          <Button variant="ghost" className="w-full justify-between">
                            <div className="flex items-center">
                                {subItem.icon}
                                <span>{subItem.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      );
                    }
                    return (
                      <div key={subItem.label} className="flex justify-between items-center p-3 rounded-md">
                        <div className="flex items-center">
                            {subItem.icon}
                            <span>{subItem.label}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">{subItem.text}</span>
                      </div>
                    );
                })}
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    