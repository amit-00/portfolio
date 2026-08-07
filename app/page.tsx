import Image from "next/image";
import type { ReactNode } from "react";
import { workExperience, education, skills, projects } from "@/lib/data";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { SectionLabel } from "@/components/relay/section-label";
import { IndexList, type IndexItem } from "@/components/relay/index-list";

interface RecordEntry {
  date: string;
  logo: string;
  title: string;
  subtitle: string;
}

function RecordRows({ entries }: { entries: RecordEntry[] }): ReactNode {
  return (
    <div className="mt-4 flex flex-col border-t border-rule">
      {entries.map((entry) => (
        <div
          key={`${entry.title}-${entry.date}`}
          className="grid grid-cols-1 items-center gap-2 border-b border-rule py-4 sm:grid-cols-[1fr_auto] sm:gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 border border-rule bg-sunken p-1">
              <Image
                src={entry.logo}
                alt=""
                width={32}
                height={32}
                className="size-8 object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-h3 font-medium text-ink-1">
                {entry.title}
              </div>
              <div className="text-small text-ink-4">{entry.subtitle}</div>
            </div>
          </div>
          <div className="font-mono text-label uppercase text-ink-6 sm:text-right">
            {entry.date}
          </div>
        </div>
      ))}
    </div>
  );
}

const projectItems: IndexItem[] = projects.map((project) => {
  // "||" not "??": link/repo use empty string for "absent"
  const external = project.link || project.repo;
  return {
    meta: project.tags.slice(0, 3).join(" · "),
    title: project.name,
    description: project.description,
    tag: project.docs ? "Case study" : "Site",
    image: `/${project.img}`,
    href: project.docs ? `/projects/${project.docs}` : external || undefined,
    external: !project.docs,
  };
});

export default function Home(): ReactNode {
  return (
    <div>
      <TopBar />

      <header className="flex flex-col items-start gap-9 border-b border-rule px-gutter pt-16 pb-11 md:flex-row md:items-center">
        <div className="shrink-0 border border-rule bg-sunken">
          <Image
            src="/profile.jpeg"
            alt="Amit Verma"
            width={160}
            height={160}
            className="size-40 object-cover"
          />
        </div>
        <div>
          <div className="font-mono text-label uppercase text-ink-5">
            Amit Verma — software engineer
          </div>
          <h1 className="mt-4 font-mono text-display font-bold text-ink-1">
            Hi, I&apos;m Amit
          </h1>
          <p className="mt-4 max-w-[52ch] text-lead text-ink-3">
            Software Engineer who loves building things. Currently building at
            CIBC.
          </p>
        </div>
      </header>

      <section className="grid border-b border-rule md:grid-cols-2">
        <div className="border-b border-rule px-gutter py-section md:border-r md:border-b-0 md:pr-9">
          <SectionLabel index="01">About me</SectionLabel>
          <div className="prose mt-4">
            <p>
              I&apos;m a software engineer who likes building systems that
              actually hold up in the real world. I&apos;m drawn to tricky
              constraints and I enjoy finding clean, practical solutions.
              I&apos;ve worked in production environments at large Canadian
              companies.
            </p>
            <p>
              Outside of work, I&apos;m building projects to learn scaling
              patterns — a party-game engine on Durable Objects, an AI radio
              station that generates its own playlist.
            </p>
          </div>
        </div>
        <div className="bg-sunken px-gutter py-section">
          <SectionLabel index="02">Now</SectionLabel>
          <div className="mt-4 flex flex-col border-t border-rule">
            {(
              [
                ["Role", "Software Engineer, CIBC"],
                ["Focus", "Backend systems, retail banking platform"],
                ["Building", "Huddl — live party games on Durable Objects"],
                ["Open to", "New opportunities and collaborations"],
              ] as [string, string][]
            ).map(([key, value]) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-1 border-b border-rule py-[10px] sm:grid-cols-[110px_1fr] sm:gap-5"
              >
                <span className="font-mono text-label-sm uppercase text-ink-6">
                  {key}
                </span>
                <span className="text-small text-ink-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule px-gutter py-section">
        <SectionLabel index="03">Projects</SectionLabel>
        <p className="mt-3 max-w-[62ch] text-small text-ink-4">
          I&apos;ve been working on a variety of projects to learn new
          technologies and improve my skills. Here are some of my favorites.
        </p>
        <div className="mt-5">
          <IndexList items={projectItems} />
        </div>
      </section>

      <section className="border-b border-rule px-gutter py-section">
        <SectionLabel index="04">Work experience</SectionLabel>
        <RecordRows
          entries={workExperience.map((job) => ({
            date: job.date,
            logo: job.logo,
            title: job.company,
            subtitle: job.title,
          }))}
        />
        <div className="mt-9">
          <SectionLabel index="05">Education</SectionLabel>
          <RecordRows
            entries={education.map((entry) => ({
              date: entry.date,
              logo: entry.logo,
              title: entry.school,
              subtitle: entry.degree,
            }))}
          />
        </div>
      </section>

      <section className="border-b border-rule px-gutter py-section">
        <SectionLabel index="06">Skills</SectionLabel>
        <div className="mt-4 max-w-measure font-mono text-small leading-[2] text-ink-3">
          {skills.map((skill, i) => (
            <span key={skill}>
              {i > 0 && <span className="mx-3 text-ink-6">·</span>}
              {skill}
            </span>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
