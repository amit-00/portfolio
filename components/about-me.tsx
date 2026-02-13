"use client";

export function AboutMe() {
  return (
    <section>
      <h2 className="text-2xl font-bold">About Me</h2>
      <p className="text-lg text-muted-foreground mt-8">
        I&apos;m a software engineer who likes building systems that actually
        hold up in the real world. I&apos;m drawn to tricky constraints and I
        enjoy finding clean, practical solutions. I&apos;ve worked in production
        environments at{" "}
        <button
          onClick={() =>
            document
              .getElementById("work-experience")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="underline cursor-pointer"
        >
          large Canadian companies.
        </button>{" "}
        Outside of work,{" "}
        <button
          onClick={() =>
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="underline cursor-pointer"
        >
          I&apos;m building projects
        </button>{" "}
        to learn scaling patterns.
      </p>
    </section>
  );
}

