// /types/ai.ts
export interface Variant {
  frontend: string[];
  backend: string[];
  database: string[];
  why: string[];
  pros?: string[];
  cons?: string[];
}

export interface RoadmapResource {
  title: string;
  url: string;
  duration?: string;
}

export type RoadmapPhase = {
  phase: string;
  title: string;
  duration: string;
  tasks: string[];
  deliverables: string;
};
export type ResourceYT = {
  title: string;
  url: string;
  duration: string;
};

export type ResourceDoc = {
  title: string;
  url: string;
};

export type ArchitectureComponent = {
  name: string;
  purpose: string;
  technology: string;
};

export type Architecture = {
  description: string;
  components: ArchitectureComponent[];
  dataFlow: string;
  databaseSchema: {
    tables: {
      name: string;
      columns: string[];
      primaryKey: string;
      relationships: string[];
    }[];
  };
  apiDesign: {
    endpoints: {
      route: string;
      method: string;
      request: string;
      response: string;
    }[];
  };
  deployment: {
    strategy: string;
    services: string[];
    environmentVariables: string[];
  };
};

export type StackDetail = {
  roadmap: RoadmapPhase[];
  resources: {
    youtube: ResourceYT[];
    docs: ResourceDoc[];
  };
  costBreakdown: {
    category: string;
    service: string;
    monthlyEstimate: string;
    description: string;
  }[];
  architecture: Architecture;
  architectureDiagram?: string;
};


export interface RoadmapWeek {
  week?: number;
  month?: number;
  items: string[];
  difficulty?: "easy" | "medium" | "hard";
  estimated_hours?: number;
  project_tutorial?: string;
  youtube?: RoadmapResource;
  docs?: RoadmapResource;
}

export interface Roadmap {
  ["1_month"]?: RoadmapWeek[];
  ["3_month"]?: RoadmapWeek[];
  skill_gap_analysis?: string[];
  resources?: {
    youtube?: RoadmapResource[];
    docs?: RoadmapResource[];
  };
}

export interface CostEstimate {
  hosting_monthly_usd: number;
  storage_monthly_usd: number;
  apis_monthly_usd: number;
  third_party_monthly_usd: number;
  notes: string;
}

export interface StackDetaill {
  variantKey: "budget" | "beginner" | "enterprise" | "mvp";
  overview: string;
  architecture_mermaid?: string;
  db_design?: string; // mermaid or textual ER
  api_spec?: string; // openapi/json sample
  sample_code?: { path: string; content: string }[];
  roadmap?: Roadmap;
  resources?: { youtube?: RoadmapResource[]; docs?: RoadmapResource[] };
  cost_estimate?: CostEstimate;
  readme?: string;
  file_structure?: string[];
}

export interface AIResponse {
  variants: {
    budget?: Variant;
    beginner?: Variant;
    enterprise?: Variant;
    mvp?: Variant;
  };
  architecture_mermaid?: string;
  roadmap?: Roadmap;
  cost_estimate?: CostEstimate;
  file_structure?: string[];
  roadmap_notes?: string;
}
