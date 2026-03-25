# HabiTribe AI Architecture & Features (Dev Team Guide)

Welcome to the Intelligence Layer of HabiTribe! This document explains how our Gen-Z focused, Social AI features operate and how to demo them perfectly.

## 1. Onboarding & Psychological Archetyping
**What it does:** 
Instead of typical onboarding ("What is your goal?"), we map users to one of 12 Psychological Archetypes (e.g., The Visionary, The Architect, The Spark). 
**How it works:**
- React captures 5 answers from the user in `Onboarding.tsx`.
- Calls a `POST /onboarding/archetype` microservice utilizing Google Gemini.
- Gemini returns the precise Archetype and a modern, Gen-Z motivational quote.
- **Where to demo:** Sign up flow. Look at the Dashboard greeting and footer!

## 2. Elastic Recovery (The "Restore Flow")
**What it does:**
When you fail a tracking app, it makes you feel bad. HabiTribe forgives you. When a user misses a habit, they can "Restore" their streak by explaining *why* they missed it.
**How it works:**
- User taps the "Missed Yesterday? 🩹" button on the Dashboard.
- **Voice First:** Users can use the **Microphone** button to speak their excuse! The frontend records 5 seconds of audio, sends it to `POST /ai/transcribe`, and Whisper handles the STT.
- The excuse is analyzed by `POST /ai/restore-analysis` to re-frame the failure positively.

## 3. TribeSpirit Gamification
**What it does:**
Our competitive/social differentiator. Tribes aren't just leaderboards; they are living tamagotchi-like entities.
**How it works:** 
- `Team Health` drives the Tribe Spirit avatar (🐉 Dragon for >80%, 🦅 Eagle for >40%, 🦇 Bat for <40%).
- Real-time CSS drop-shadows pulse based on the team's combined streak energy.
- **Where to demo:** Click the "Tribe" tab to see the avatar dynamically react to the health score.

## 4. The Commons Feed
**What it does:**
A live social ticket feed. Actions performed by individuals alert the rest of their Tribe.
**Where to demo:** Bottom of the Tribe tab. You will see XP rewards explicitly granted for completing habits using features like `Proof of Voice`.

## 5. Voice Journaling & Weekly Friction Insights
**What it does:**
- Inside the Profile tab, users can view **Weekly AI Insights** (`POST /ai/friction-report`) diagnosing why they missed certain habits.
- Users have a Voice Journal to physically record their daily reflections using the same Whisper STT endpoint (`POST /ai/transcribe`). 

## 6. Long-Term AI Evaluation
**What it does:**
A placeholder inside the Profile representing the monetization/deep-retention aspect of the PRD: analyzing 30 consecutive days of data to provide a Deep Identity Evaluation.

All APIs are configured via FastAPI on `http://localhost:8000`. The frontend seamlessly intercepts and uses them via React Context.
