
"use client";

import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { User, Lock, Shield, HelpCircle, Send, Info, FileText, ChevronRight } from 'lucide-react';

const settingsItems = [
  {
    title: "Pengaturan Akun",
    icon: <User className="h-5 w-5 text-primary" />,
    content: [
      { label: "Edit Profil", href: "/edit-profile", icon: <User className="mr-2 h-4 w-4"/> },
      { label: "Ubah Kata Sandi", href: "#", icon: <Lock className="mr-2 h-4 w-4" /> },
      { label: "Pengaturan Privasi", href: "#", icon: <Shield className="mr-2 h-4 w-4"/> },
    ],
  },
  {
    title: "Bantuan & Dukungan",
    icon: <HelpCircle className="h-5 w-5 text-primary" />,
    content: [
      { label: "FAQ", href: "#", icon: <HelpCircle className="mr-2 h-4 w-4"/> },
      { label: "Hubungi Kami", href: "#", icon: <Send className="mr-2 h-4 w-4"/> },
    ],
  },
  {
    title: "Tentang Aplikasi",
    icon: <Info className="h-5 w-5 text-primary" />,
    content: [
      { label: "Versi Aplikasi", text: "1.0.0", icon: <Info className="mr-2 h-4 w-4"/> },
      { label: "Hak Cipta", text: "© 2024 BEAUTIVE", icon: <Info className="mr-2 h-4 w-4"/> },
      { label: "Kebijakan Privasi", href: "#", icon: <FileText className="mr-2 h-4 w-4"/> },
      { label: "Syarat dan Ketentuan", href: "#", icon: <FileText className="mr-2 h-4 w-4"/> },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline text-foreground">Pengaturan</h1>
        <p className="text-lg text-muted-foreground">Kelola akun, preferensi, dan lainnya.</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {settingsItems.map((item) => (
              <AccordionItem value={item.title} key={item.title}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pl-4">
                  <div className="flex flex-col space-y-1">
                    {item.content.map((subItem) => (
                      subItem.href ? (
                         <Link href={subItem.href} key={subItem.label} passHref>
                            <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                    {subItem.icon}
                                    <span>{subItem.label}</span>
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                      ) : (
                        <div key={subItem.label} className="flex justify-between items-center p-3 rounded-md">
                           <div className="flex items-center">
                                {subItem.icon}
                                <span>{subItem.label}</span>
                            </div>
                           <span className="text-muted-foreground text-sm">{subItem.text}</span>
                        </div>
                      )
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
