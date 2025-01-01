export interface Ingredient {
  type: string;
  name: string;
  description: string;
  quantity: string;
}

export interface IntermediateState extends Ingredient {
  type: 'IntermediateState';
  successIndicators: string[];
}

export interface Step {
  id: string;
  inputs: Ingredient[];
  action: {
    type: string;
    duration: string;
    temperature: string;
    description: string;
  };
  output: {
    type: string;
    name: string;
    description: string;
    successIndicators: string[];
  };
}

export interface RecipeJson {
  name: string;
  steps: Step[];
}

export interface Recipe {
  id: number;
  title: string;
  json: RecipeJson;
  created_at: string;
  url: string;
}