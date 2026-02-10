import { workExperience, education, skills, projects } from "@/lib/data";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 relative">
      <header className="flex flex-col-reverse md:flex-row items-center justify-between my-24">
        <div className="">
          <h1 className="text-4xl font-bold">
            Hi, I&apos;m <span className="text-primary">Amit</span>
          </h1>
          <p className="text-2xl text-muted-foreground mt-8">
            Software Engineer who loves building things. Currently building at CIBC
          </p>
        </div>
        <div className="mb-8 md:mb-0">
          <div className="w-40 h-40 rounded-full bg-zinc-400"></div>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold">About Me</h2>
        <p className="text-lg text-muted-foreground mt-8">
          I&apos;m a backend engineer who likes building systems that actually hold up in the real world. I&apos;m drawn to tricky constraints and I enjoy finding clean, practical solutions. I've worked in production environments at Canadian companies. Outside of work, I&apos;m building projects to learn scaling patterns.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <div className="mt-12 flex flex-col gap-8">
          {workExperience.map((experience) => (
            <div key={experience.company} className="flex items-center justify-between">
              <div className="flex items-center gap-4 w-full">
                <Image src={experience.logo} alt={experience.company} className="object-cover rounded-full" width={40} height={40} />
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">{experience.company}</h3>
                  <p className="text-sm text-muted-foreground">{experience.title}</p>
                  <p className="text-sm text-muted-foreground block md:hidden">{experience.date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground hidden md:block">{experience.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Education</h2>
        <div className="mt-12 flex flex-col gap-8">
          {education.map((education) => (
            <div key={education.school} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={education.logo} alt={education.school} className="object-cover rounded-full" width={40} height={40} />
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">{education.school}</h3>
                  <p className="text-sm text-muted-foreground">{education.degree}</p>
                  <p className="text-sm text-muted-foreground block md:hidden">{education.date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground hidden md:block">{education.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Skills</h2>
        <div className="mt-12 flex flex-wrap gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2 border border-zinc-800 rounded-full px-2 py-1">
                {/* <Image src={skill.logo} alt={skill.name} className="object-cover rounded-full" width={40} height={40} /> */}
                <div className="rounded-full bg-zinc-400 w-6 h-6"></div>
                <p className="text-sm text-muted-foreground">{skill.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 my-16">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
          My Projects
        </span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <section className="mt-16 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold">Check out my latest work</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            I&apos;ve been working on a variety of projects to learn new technologies and improve my skills. Here are some of my favorites.
          </p>
        </div>

        {projects.length > 0 ? projects.map((project) => (
          <div key={project.name} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src={project.logo} alt={project.name} className="object-cover rounded-full" width={40} height={40} />
            </div>
          </div>
        )) : <h2 className="text-muted-foreground mt-4 text-lg">It&apos;s kinda empty here...</h2>}

      </section>

      <footer className="mt-16 mb-32 text-center border border-zinc-800 rounded-2xl p-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-5xl">Get in touch</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            I&apos;m always looking for new opportunities and collaborations. Feel free to reach out to me via email or social media.
          </p>
        </div>
      </footer>
    </div>
  );
}
