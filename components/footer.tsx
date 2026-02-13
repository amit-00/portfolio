"use client";

import { ShineBorder } from "@/components/ui/shine-border";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="mt-32 mb-32 text-center border border-border rounded-2xl p-8 relative">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <div className="max-w-lg mx-auto">
        <h2 className="text-5xl">Get in touch</h2>
        <p className="text-muted-foreground mt-4 text-lg">
          I&apos;m always looking for new opportunities and collaborations. Feel
          free to reach out to me via{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText("amit.v@hotmail.com");
              toast("Email copied to clipboard!");
            }}
          >
            email
          </span>
          .
        </p>
      </div>
    </footer>
  );
}

