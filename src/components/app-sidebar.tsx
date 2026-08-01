"use client";

import { useEffect, useState } from "react";
import { Home, Briefcase, GraduationCap, Heart, Settings, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const items = [
  {
    title: "Mission",
    url: "/",
    icon: Home,
  },
  {
    title: "Career",
    url: "/career",
    icon: Briefcase,
  },
  {
    title: "Learning",
    url: "/learning",
    icon: GraduationCap,
  },
  {
    title: "Life",
    url: "/life",
    icon: Heart,
  },
  {
    title: "System",
    url: "/system",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      } else if (typeof document !== "undefined" && (document.cookie.includes("vos_founder_code=2005") || document.cookie.includes("vansh_founder_auth=2005"))) {
        setUserEmail("vanshbansal0210@gmail.com");
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? (document.cookie.includes("vos_founder_code=2005") ? "vanshbansal0210@gmail.com" : null));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    document.cookie = "vos_founder_code=; path=/; max-age=0";
    document.cookie = "vansh_founder_auth=; path=/; max-age=0";
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Don't render sidebar navigation on login page
  if (pathname.startsWith("/login")) {
    return null;
  }

  const initialLetter = userEmail ? userEmail[0].toUpperCase() : "V";
  const displayRole = userEmail ? userEmail.split("@")[0] : "Founder";

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <span className="font-bold text-lg">V</span>
        </div>
        <span className="font-bold text-lg tracking-tight">Vansh OS</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initialLetter}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium leading-none truncate">{displayRole}</span>
              <span className="text-[10px] text-muted-foreground mt-1 truncate">v.1.0-stable</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            title="Sign Out"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
