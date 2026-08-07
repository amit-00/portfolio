import type { ReactNode } from "react";
import { workExperience, education, skills, projects } from "@/lib/data";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { SectionLabel } from "@/components/relay/section-label";
import { IndexList, type IndexItem } from "@/components/relay/index-list";

const NOW: [string, string][] = [
  ["Role", "Software Engineer, CIBC"],
  ["Focus", "Backend systems, retail banking platform"],
  ["Building", "Huddl — real-time party games on Durable Objects"],
  ["Open to", "Collaboration on distributed and real-time work"],
];

function RuledRows({ rows }: { rows: [string, string][] }): ReactNode {
  return (
    <div className="mt-4 flex flex-col border-t border-rule">
      {rows.map(([key, value]) => (
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
  );
}

const projectItems: IndexItem[] = projects.map((project) => {
  // "||" not "??": link/repo use empty string for "absent"
  const external = project.link || project.repo;
  return {
    meta: project.tags[0],
    title: project.name,
    description: project.description,
    tag: project.docs ? "Case study" : "Site",
    href: project.docs ? `/projects/${project.docs}` : external || undefined,
    external: !project.docs,
  };
});

export default function Home(): ReactNode {
  return (
    <div>
      <TopBar />

      <header className="border-b border-rule px-gutter pt-16 pb-11">
        <div className="font-mono text-label uppercase text-ink-5">
          Amit Verma — software engineer
        </div>
        <h1 className="mt-4 max-w-[22ch] font-mono text-display font-bold text-ink-1">
          I build systems that hold up under load
        </h1>
        <p className="mt-4 max-w-[62ch] text-lead text-ink-3">
          Backend engineering at CIBC on the retail banking platform. Outside
          that, distributed and real-time projects — a party-game engine on
          Durable Objects, an AI radio station that generates its own playlist.
          The interesting part is always the constraint.
        </p>
      </header>

      <section className="grid border-b border-rule md:grid-cols-2">
        <div className="border-b border-rule px-gutter py-section md:border-r md:border-b-0 md:pr-9">
          <SectionLabel index="01">How I work</SectionLabel>
          <div className="prose mt-4">
            <p>
              I read the code before the tickets. Most production problems are
              not the bug in the report — they are the assumption two callers
              upstream that nobody wrote down.
            </p>
            <p>
              I like tricky constraints: ordering guarantees, state that has to
              survive a reconnect, a budget that says this has to run on one
              container. Those are the problems where a clean answer actually
              pays for itself.
            </p>
          </div>
        </div>
        <div className="bg-sunken px-gutter py-section">
          <SectionLabel index="02">Now</SectionLabel>
          <RuledRows rows={NOW} />
        </div>
      </section>

      <section className="border-b border-rule px-gutter py-section">
        <SectionLabel index="03">Selected work</SectionLabel>
        <div className="mt-4">
          <IndexList items={projectItems} />
        </div>
      </section>

      <section className="border-b border-rule px-gutter py-section">
        <SectionLabel index="04">Record</SectionLabel>
        <RuledRows
          rows={workExperience.map((job) => [
            job.date,
            `${job.company} — ${job.title}`,
          ])}
        />
        <div className="mt-9">
          <SectionLabel index="05">Education</SectionLabel>
          <RuledRows
            rows={education.map((entry) => [
              entry.date,
              `${entry.school} — ${entry.degree}`,
            ])}
          />
        </div>
      </section>

      <section className="border-b border-rule px-gutter py-section">
        <SectionLabel index="06">Tools</SectionLabel>
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
