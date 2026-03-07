export interface Recipe {
  recipeName: string;
  cuisine: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: number | string;
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  proTip: string;
}
