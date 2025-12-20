"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  MessageSquare, 
  Calendar,
  HelpCircle,
  ExternalLink
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/dossier", label: "Mon dossier", icon: FileText },
  { href: "/dashboard/pieces", label: "Mes pièces", icon: Upload },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badge: 2 },
  { href: "/dashboard/rendez-vous", label: "Rendez-vous", icon: Calendar },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border">
      {/* Navigation principale */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-accent text-primary"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section aide */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-xl p-4">
          <h4 className="font-semibold text-foreground mb-2">
            Besoin d&apos;aide ?
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Notre équipe est disponible pour répondre à vos questions.
          </p>
          <div className="space-y-2">
            <Link
              href="/dashboard/aide"
              className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Centre d&apos;aide
            </Link>
            <a
              href="mailto:contact@defense-epargnants.fr"
              className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}




