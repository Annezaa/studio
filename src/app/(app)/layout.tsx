
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Dumbbell,
  Menu,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tiv-check", label: "TIV-CHECK", icon: Camera },
  { href: "/tiv-talks", label: "TIV-TALKS", icon: MessageCircle },
  { href: "/tiv-track", label: "TIV-TRACK", icon: HeartPulse },
  { href: "/tiv-coach", label: "TIV-COACH", icon: Dumbbell },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar for edit-profile page
  if (pathname === '/edit-profile') {
    return <main>{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/" className="text-2xl font-headline text-primary">
              BEAUTIVE
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
            <header className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                <Link href="/" className="text-xl font-headline text-primary">BEAUTIVE</Link>
                <SidebarTrigger/>
            </header>
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
