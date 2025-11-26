import { Variant } from "./ai";

export type StackKey = "beginner" | "mvp" | "enterprise" | "budget";
export type StackMap = Record<StackKey, Variant>;

export interface Feature {
    name: string;
    description: string;
    complexity: "Low" | "Medium" | "High";
}

export interface BuildStep {
    step: number;
    title: string;
    description: string;
    tasks: string[];
}

export interface ApiEndpoint {
    method: string;
    endpoint: string;
    description: string;
    requestBody?: any;
    responseBody?: any;
}

export interface Resource {
    title: string;
    url: string;
}

export interface Diagrams {
    highLevel: string;
    requestFlow: string;
    deployment: string;
    apiGateway: string;
    databaseErd: string;
}

export interface Step3Data {
    featureList: Feature[];
    buildBreakdown: BuildStep[];
    apiEndpoints: ApiEndpoint[];
    resources: {
        youtube: Resource[];
        docs: Resource[];
    };
    diagrams: Diagrams;
}
