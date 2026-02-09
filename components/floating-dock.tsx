"use client";

import {
  HomeIcon,
  UserIcon,
  FolderOpenIcon,
  MailIcon,
  GithubIcon,
  LinkedinIcon,
} from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

const DOCK_ITEMS = [
  { icon: HomeIcon, label: "Home", href: "#" },
  { icon: UserIcon, label: "About", href: "#about" },
  { icon: FolderOpenIcon, label: "Projects", href: "#projects" },
  { icon: MailIcon, label: "Contact", href: "#contact" },
  { icon: GithubIcon, label: "GitHub", href: "https://github.com" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
];

export function FloatingDock() {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <Dock direction="middle" className="mt-0">
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.label}>
            <a
              href={item.href}
              aria-label={item.label}
              title={item.label}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <item.icon className="size-full" />
            </a>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}

