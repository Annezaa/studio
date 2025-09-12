"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerTeenQuestions } from '@/ai/flows/answer-teen-questions';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

export default function TivTalksPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', text: "Halo! Saya TIVA, asisten AI Anda. Tanyakan apa saja tentang olahraga, nutrisi, atau kesehatan. Saya di sini untuk membantu!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerTeenQuestions({ query: input });
      const botMessage: Message = { id: Date.now() + 1, role: 'bot', text: response.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Gagal mendapatkan jawaban:", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan.";
      toast({
        title: "Oops!",
        description: `Gagal mendapatkan jawaban: ${errorMessage}`,
        variant: "destructive",
      });
      const errorBotMessage: Message = { id: Date.now() + 1, role: 'bot', text: "Maaf, saya sedang mengalami sedikit masalah. Coba lagi nanti ya." };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-card rounded-xl border shadow-sm">
        <header className="p-4 border-b">
            <h1 className="text-2xl font-headline text-foreground">TIV-TALKS</h1>
            <p className="text-sm text-muted-foreground">Asisten AI empatik Anda</p>
        </header>
        
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {messages.map((message) => (
                <div key={message.id} className={cn("flex items-start gap-4", message.role === 'user' && 'justify-end')}>
                {message.role === 'bot' && (
                    <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("max-w-md p-3 rounded-2xl", 
                    message.role === 'bot' ? 'bg-muted rounded-tl-none' : 'bg-primary text-primary-foreground rounded-br-none')}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                {message.role === 'user' && (
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User />
                        </AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-4">
                     <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-md p-3 rounded-2xl bg-muted rounded-tl-none flex items-center space-x-2">
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                    </div>
                 </div>
            )}
            </div>
        </ScrollArea>

        <footer className="p-4 border-t">
            <form onSubmit={handleSubmit} className="relative">
                <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaanmu di sini..."
                className="pr-12 h-12 rounded-full"
                disabled={isLoading}
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </footer>
    </div>
  );
}
