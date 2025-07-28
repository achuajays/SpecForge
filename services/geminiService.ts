
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import type { SpecForgeFormState, Report, AiBuilderStep } from '../types';
  
const GEMINI_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/gemini`;

function constructPrompt(
    basePrompt: string,
    formData: SpecForgeFormState
): string {
    let fullPrompt = `${basePrompt}\n\n## Core Idea\n${formData.idea}`;
    const details = [];
    if (formData.targetUsers) details.push(`- **Target Users:** ${formData.targetUsers}`);
    if (formData.goals) details.push(`- **Primary Goals:** ${formData.goals}`);
    if (formData.techStack) details.push(`- **Preferred Technologies:** ${formData.techStack}`);

    if (details.length > 0) {
        fullPrompt += `\n\n## Additional Details\n${details.join('\n')}`;
    }
    return fullPrompt;
}

const SPECIFICATION_PROMPT_TEMPLATE = `You are SpecForge, an expert product manager and system architect AI. Your task is to generate a detailed technical specification document based on a user's idea.

The output must be clean, well-structured Markdown. The tone should be professional and clear.

**Format:**
Follow this structure precisely:

### 1. Introduction & Vision
   - **Product Overview:** Briefly summarize the product.
   - **Vision Statement:** A clear, aspirational statement of the product's long-term goal.

### 2. User Personas & Stories
   - **Primary Persona(s):** Describe the key target users.
   - **User Stories:** List key user stories in the format: "As a [persona], I want to [action] so that [benefit]."

### 3. Core Features & Functionality
   - **Feature 1:** [Name] - Detailed description.
   - **Feature 2:** [Name] - Detailed description.
   - (and so on...)

### 4. Non-Functional Requirements
   - **Performance:** Expected response times, load capacity.
   - **Security:** Key security considerations (e.g., authentication, data encryption).
   - **Scalability:** How the system should grow with user load.
   - **Usability:** Key principles for user experience.

### 5. Assumptions & Dependencies
   - **Assumptions:** Things taken as true for this spec.
   - **Dependencies:** External systems, APIs, or services it relies on.
`;

const BLUEPRINT_PROMPT_TEMPLATE = `You are SpecForge, an expert solutions architect AI. Your task is to generate a high-level technical blueprint based on a user's idea.

The output must be clean, well-structured Markdown, suitable for a technical audience.

**Format:**
Follow this structure precisely:

### 1. High-Level Architecture
   - **Architectural Pattern:** Recommend a pattern (e.g., Monolithic, Microservices, Serverless) and justify the choice.
   - **System Components:** A diagram-like description of the main components (e.g., Web Client, API Gateway, Backend Services, Database) and their interactions.

### 2. Recommended Technology Stack
   - **Frontend:** e.g., React with TypeScript, Tailwind CSS. Justify the choice.
   - **Backend:** e.g., Node.js with Express, Python with Django. Justify the choice.
   - **Database:** e.g., PostgreSQL (Relational), MongoDB (NoSQL). Justify the choice.
   - **Cloud & DevOps:** Recommended cloud provider (e.g., AWS, GCP, Vercel) and key services (e.g., S3, Lambda, CI/CD pipeline).

### 3. Data Schema (High-Level)
   - Define key database tables/collections with their essential fields and relationships. Use a simple, clear format.
   - Example:
     - **Users (table)**
       - \`id\` (PK)
       - \`email\` (string, unique)
       - \`hashed_password\` (string)
       - \`created_at\` (timestamp)

### 4. Core System Workflows
   - **User Registration & Login:** Step-by-step flow.
   - **Core Action Workflow (e.g., Creating a Post):** Step-by-step flow from user action to data persistence.
`;

const AI_BUILDER_PROMPT_TEMPLATE = `You are an expert prompt engineer specializing in "Vibe Coding" for AI assistants. Your task is to generate a series of actionable, step-by-step prompts to build a web application based on the user's idea. The application should use React with TypeScript and TailwindCSS.

For each step, create a complete, self-contained prompt that follows the S.C.A.F.F. framework:
- **SITUATION:** Set the persona and context for the AI assistant.
- **CONTEXT:** Describe the tech stack, existing file structure, and project state.
- **ASSIGNMENT:** Give a clear, specific task for the AI to perform.
- **FAIL-SAFE:** Provide constraints, boundaries, and things to avoid.
- **FORMAT:** Specify the desired output format (e.g., code only, code with explanation).

**CRITICAL:** Each prompt must be a single block of text, clearly formatted with the S.C.A.F.F. headings (SITUATION, CONTEXT, etc.) as shown in the example below.

---
**EXAMPLE PROMPT STRUCTURE:**

SITUATION:
You are a senior frontend engineer specializing in React with TypeScript and TailwindCSS.

CONTEXT:
I am building a web application. The project is set up with Vite, React, TypeScript, and TailwindCSS. The main application component is in \`src/App.tsx\`.

ASSIGNMENT:
Create a reusable button component named \`Button.tsx\` in a new \`src/components\` directory. The button should accept standard props like \`onClick\` and \`children\`. It should have default styling using TailwindCSS for a primary action button.

FAIL-SAFE:
- Do not install any new libraries.
- The component must be a function component using TypeScript.
- Ensure the button is accessible.

FORMAT:
Provide only the code for the \`Button.tsx\` file. Do not include any explanations.
---

Now, generate the step-by-step prompts for the following user request:`;

const AI_BUILDER_SCHEMA = {
  type: 'ARRAY',
  description: "A list of steps to build the application.",
  items: {
    type: 'OBJECT',
    properties: {
      title: {
        type: 'STRING',
        description: 'A short, descriptive title for this build step (e.g., "Project Setup & Foundation").',
      },
      prompt: {
        type: 'STRING',
        description: 'The specific, actionable prompt for the AI code assistant to execute this step, formatted using the S.C.A.F.F. framework.',
      },
    },
    required: ['title', 'prompt'],
  },
};

async function callGeminiProxyForText(prompt: string): Promise<string> {
  const response = await fetch(GEMINI_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      contents: prompt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody.error}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data.text.replace(/^```(markdown)?\s*|```$/g, '').trim();
}

async function callGeminiProxyForJson<T>(prompt: string, schema: object): Promise<T> {
  const response = await fetch(GEMINI_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody.error}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  const jsonText = data.text.replace(/^```(json)?\s*|```$/g, '').trim();
  try {
    return JSON.parse(jsonText) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("The AI returned an invalid JSON format for the AI Builder Guide.");
  }
}

export async function generateReports(formData: SpecForgeFormState): Promise<Report> {
  const specPrompt = constructPrompt(SPECIFICATION_PROMPT_TEMPLATE, formData);
  const blueprintPrompt = constructPrompt(BLUEPRINT_PROMPT_TEMPLATE, formData);
  const aiBuilderPrompt = constructPrompt(AI_BUILDER_PROMPT_TEMPLATE, formData);

  const [specification, blueprint, aiBuilderGuide] = await Promise.all([
    callGeminiProxyForText(specPrompt),
    callGeminiProxyForText(blueprintPrompt),
    callGeminiProxyForJson<AiBuilderStep[]>(aiBuilderPrompt, AI_BUILDER_SCHEMA),
  ]);

  return { specification, blueprint, aiBuilderGuide };
}
