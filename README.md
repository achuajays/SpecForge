
# SpecForge: AI Specification & Blueprint Generator

<p align="center">
  <img src="image.png" alt="SpecForge Banner" width="800">
</p>

<p align="center">
  <strong>Turn your idea into a complete technical spec and blueprint in minutes.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-local-development">Local Development</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

---

**SpecForge** is an AI-powered tool that accelerates the product development lifecycle by transforming a simple idea into comprehensive technical documentation. It's designed for founders, product managers, and developers who want to move from concept to code faster than ever.

Provide a brief description of your product, and SpecForge generates:
1.  A structured **Specification Report**.
2.  A high-level **Architectural Blueprint**.
3.  A step-by-step **AI Builder Guide** to code the application using "Vibe Coding" prompts.

## ✨ Features

SpecForge provides three distinct, actionable reports in a clean, tabbed interface.

### 1. Specification Report
A professional product management document that outlines the *what* and *why* of your project.
- **Introduction & Vision:** A clear summary and long-term goal.
- **User Personas & Stories:** Defines the target audience and their needs.
- **Core Features:** A detailed breakdown of the application's functionality.
- **Non-Functional Requirements:** Covers performance, security, scalability, and usability.

### 2. Technical Blueprint
A high-level guide for engineers that outlines the *how*.
- **High-Level Architecture:** Recommends a suitable architectural pattern (e.g., Microservices, Serverless).
- **Recommended Tech Stack:** Suggests and justifies technologies for the frontend, backend, and database.
- **Data Schema:** Proposes a high-level database schema for core models.
- **Core Workflows:** Maps out key user flows like registration and primary actions.

### 3. AI Builder Guide
A practical, step-by-step guide to building your application using an AI coding assistant.
- **Vibe Coding Ready:** Each step is a self-contained prompt.
- **S.C.A.F.F. Framework:** Prompts are structured using the **S**ituation, **C**ontext, **A**ssignment, **F**ail-safe, **F**ormat framework for maximum clarity and effectiveness with AI assistants.
- **Action-Oriented:** Includes individual "Copy Prompt" buttons for a smooth workflow.

## 🛠️ Technology Stack

This project is built with a modern, secure, and performant tech stack.

- **Frontend:**
  - **React 19** with TypeScript
  - **TailwindCSS** (with Typography plugin) for styling
  - **Marked.js** for rendering Markdown
  - **No build step!** Leverages `esm.sh` for direct module loading via import maps.
- **Backend (Proxy):**
  - **Supabase Edge Functions:** To securely proxy requests to the Gemini API without exposing keys on the client-side.
- **AI Model:**
  - **Google Gemini API (`gemini-2.5-flash`):** For all text and structured JSON generation.

## ⚙️ How It Works

The application follows a simple, user-friendly flow:

1.  **Input Idea:** The user fills out a form with their core product idea and optional details.
2.  **Generate Reports:** On submission, the frontend calls a Supabase Edge Function.
3.  **Secure AI Call:** The Edge Function securely adds the `GEMINI_API_KEY` and forwards three parallel requests to the Google Gemini API (one for each report).
4.  **Display Results:** The responses are streamed back to the frontend and displayed in the corresponding tabs, with Markdown content rendered into styled HTML.

## 🚀 Local Development

To run SpecForge on your local machine, follow these steps.

### Prerequisites
- [Deno](https://deno.land/) for running the Supabase Edge Function locally.
- A Google Gemini API Key.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/specforge.git
cd specforge
```

### 2. Set Up Supabase Edge Function
The backend is a Supabase Edge Function. To run it locally, you need the Supabase CLI.

1.  **Install the Supabase CLI:**
    ```bash
    # macOS / Linux
    brew install supabase/tap/supabase

    # Windows
    scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    scoop install supabase
    ```

2.  **Link your project (optional) or start the server:**
    ```bash
    # Create a local secrets file for the API key
    touch supabase/functions/.env.local

    # Add your Gemini API key to this file
    echo "GEMINI_API_KEY=your_gemini_api_key_here" > supabase/functions/.env.local
    ```

3.  **Serve the function:**
    ```bash
    supabase functions serve --env-file ./supabase/functions/.env.local
    ```
    This will start the function, typically accessible at `http://localhost:54321/functions/v1/gemini`.

### 3. Run the Frontend
The frontend is a static HTML file that uses ES modules via a CDN. No build process is needed.

1.  You can use any simple HTTP server. If you have Python:
    ```bash
    python -m http.server 3000
    ```

2.  Open your browser and navigate to `http://localhost:3000`. The application should be running.

> **Note:** The `constants.ts` file points to a production Supabase URL. For local development, you might want to temporarily change `GEMINI_FUNCTION_URL` in `services/geminiService.ts` to your local function URL.

## 📁 Project Structure

```
/
├── README.md
├── index.html            # Main HTML entry point with import maps
├── index.tsx             # Root of the React application
├── App.tsx               # Main app component, manages state and layout
├── metadata.json         # App metadata
├── types.ts              # TypeScript type definitions
├── constants.ts          # App constants (Supabase URL/Key)
│
├── components/           # Reusable React components
│   ├── Header.tsx
│   ├── SpecInputForm.tsx
│   ├── ReportDisplay.tsx
│   ├── ...
│
├── services/             # Service layer for API calls
│   └── geminiService.ts    # Logic for calling the backend function
│
└── supabase/
    └── functions/
        └── gemini/
            ├── index.ts  # The Supabase Edge Function code
```
