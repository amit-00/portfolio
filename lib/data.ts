export const workExperience = [
  {
    company: "CIBC",
    title: "Software Engineer",
    date: "March 2026 - Present",
    description: "Building backend systems for CIBC's retail banking platform",
    logo: "/cibc.png",
  },
  {
    company: "CIBC (contract)",
    title: "Software Engineer",
    date: "March 2024 - March 2026",
    description: "",
    logo: "/cibc.png",
  },
  {
    company: "Geotab",
    title: "Software Engineer Intern",
    date: "June 2021 - August 2022",
    description: "Building backend systems for Geotab's fleet management platform",
    logo: "/geotab.png",
  }
]

export const education = [
  {
    school: "Amazon Web Services",
    degree: "AWS certified practitioner",
    date: "September 2023",
    logo: "/aws.png",
  },
  {
    school: "University of Western Ontario",
    degree: "Bachelor of Engineering",
    date: "September 2018 - April 2023",
    logo: "/uwo.png",
  }
]

import {
  siPython,
  siDjango,
  siFastapi,
  siReact,
  siNextdotjs,
  siTypescript,
  siNodedotjs,
  siDocker,
  siPostgresql,
  siGithub,
  siGooglecloud,
  siModal,
  siTerraform,
} from "simple-icons";

export const skills = [
  { name: "Python", icon: siPython },
  { name: "Django", icon: siDjango },
  { name: "FastAPI", icon: siFastapi },
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "Typescript", icon: siTypescript },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Docker", icon: siDocker },
  { name: "Postgres", icon: siPostgresql },
  { name: "GitHub", icon: siGithub },
  { name: "Google Cloud", icon: siGooglecloud },
  { name: "Modal", icon: siModal },
  { name: "Terraform", icon: siTerraform },
]

export interface Project {
  name: string;
  img: string;
  description: string;
  link: string;
  repo: string;
  /** Slug under content/projects/; when set, the card links to /projects/<docs> */
  docs?: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    name: "Huddl - Live Party Games",
    img: "huddl/home.png",
    description: "Huddl is a web app for sports-themed party games — gather your group, share a room code, and play social deduction and guessing games together from your phones.",
    link: "https://huddl.gg",
    repo: "",
    docs: "huddl",
    tags: ["Next.js", "Cloudflare Workers", "Durable Objects", "TypeScript", "WebSockets", "Tailwind CSS"]
  },
  {
    name: "PulseFM - AI Lofi Radio",
    img: "pulsefm.jpg",
    description: "PulseFM is a 24/7 AI-powered radio platform where listeners vote on curated music styles, and the winning option is generated and streamed live.",
    link: "https://www.pulsefm.app",
    repo: "https://github.com/amit-00/pulseFM",
    docs: "pulsefm",
    tags: ["FastAPI", "Next.js", "Redis", "Docker", "GCP", "Modal", "Terraform"]
  },
  {
    name: "Flower City Run Club",
    img: "fcrc.jpg",
    description: "A running club I cofounded with my family to help people get into running and empower them to improve their health and confidence. Not technically advanced, but a proud accomplishment.",
    link: "https://www.flowercityrunclub.ca",
    repo: "",
    tags: ["Next.js", "Tailwind CSS", "Vercel"]
  },
  
]