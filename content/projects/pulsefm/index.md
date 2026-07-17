---
title: PulseFM
---

# PulseFM — AI Lofi Radio

PulseFM is a 24/7 AI-generated lofi radio station: listeners vote on the
genre, mood, and energy of the next track, a music-generation model renders
a new song from the winning combination, and every connected listener hears
it change in sync — no page refresh, no polling, no pre-rendered library.

![PulseFM](/pulsefm.jpg)

> No feature screenshots or a walkthrough video yet — these docs are text/diagram-only for now.

**Live:** [pulsefm.app](https://www.pulsefm.app) · **Source:** [github.com/amit-00/pulseFM](https://github.com/amit-00/pulseFM)

## Role

Solo project — designed and built end-to-end over ~215 commits (Jan–Mar
2026): the Next.js frontend, five Python backend services, four Cloud
Functions, the GPU generation worker, and all Terraform infrastructure.

## Tech stack

**Frontend** Next.js 16 · React 19 · Auth.js · Server-Sent Events
**Backend** FastAPI on Cloud Run · Python Cloud Functions (Gen2)
**AI/ML** ACE-Step music diffusion model on Modal · GPU memory snapshotting
**Data** Firestore · Redis (Memorystore)
**Messaging** Pub/Sub · Eventarc · Cloud Tasks
**Infra** Terraform · GCP · Cloud Build · Docker

## What's documented here

- [Problem & Motivation](/projects/pulsefm/problem) — what this is solving and for whom
- [Solution & Features](/projects/pulsefm/solution) — what it does
- [Technical Architecture](/projects/pulsefm/architecture) — how it's built, and why
- [Challenges & Solutions](/projects/pulsefm/challenges) — the hardest problems and how I solved them
- [Results & Impact](/projects/pulsefm/results) — what shipped, what I learned, what's next
