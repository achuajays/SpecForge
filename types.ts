
export interface SpecForgeFormState {
  idea: string;
  targetUsers: string;
  goals: string;
  techStack: string;
}

export interface AiBuilderStep {
  title: string;
  prompt: string;
}

export interface Report {
  specification: string;
  blueprint: string;
  aiBuilderGuide: AiBuilderStep[];
}

export type ActiveTab = 'specification' | 'blueprint' | 'aiBuilderGuide';