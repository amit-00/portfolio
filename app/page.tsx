import { workExperience, education, skills, projects } from "@/lib/data";
import Image from "next/image";
import { Globe, Github } from "lucide-react";
import { AboutMe } from "@/components/about-me";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative pt-24">
      <div className="max-w-2xl mx-auto px-4 relative">
        <header className="flex flex-col-reverse md:flex-row items-center justify-between mb-24">
          <div className="">
            <h1 className="text-4xl font-bold">
              Hi, I&apos;m <span className="text-primary">Amit</span>
            </h1>
            <p className="text-2xl text-muted-foreground mt-8">
              Software Engineer who loves building things. Currently building at CIBC
            </p>
          </div>
          <div className="mb-8 md:mb-0">
            <div className="rounded-full overflow-hidden w-40 h-40 border border-border">
              <Image src="/profile.jpeg" alt="Amit" className="object-cover w-full h-full" width={160} height={160} />
            </div>
          </div>
        </header>

        <AboutMe />

        <section id="work-experience" className="mt-16 scroll-mt-24">
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
                <div className="flex items-center gap-2 border border-border rounded-full px-2 py-1">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={skill.icon.path} />
                  </svg>
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

        <section id="projects" className="mt-16 text-center scroll-mt-24">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-bold">Check out my latest work</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              I&apos;ve been working on a variety of projects to learn new technologies and improve my skills. Here are some of my favorites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
            {projects.map((project) => {
              const cardHref = project.link || project.repo;
              return (
                <div key={project.name} className="flex flex-col">
                  <div className="relative overflow-hidden rounded-xl border border-border hover:border-muted-foreground/50 transition-colors">
                    {cardHref ? (
                      <a href={cardHref} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={`/${project.img}`}
                          alt={project.name}
                          className="object-cover w-full aspect-video"
                          width={600}
                          height={340}
                        />
                      </a>
                    ) : (
                      <Image
                        src={`/${project.img}`}
                        alt={project.name}
                        className="object-cover w-full aspect-video"
                        width={600}
                        height={340}
                      />
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white rounded-full px-2 py-1 text-xs hover:bg-black/90 transition-colors"
                        >
                          <Globe className="size-3" />
                          Website
                        </a>
                      )}
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white rounded-full px-2 py-1 text-xs hover:bg-black/90 transition-colors"
                        >
                          <Github className="size-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mt-3">{project.name}</h3>
                  <p className="text-md text-muted-foreground mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border rounded-full px-2 py-1 text-sm text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        <Footer />
      </div>
    </div>

  );
}
