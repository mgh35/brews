import { BrewMethod, Recipe } from "models/brew";

export class RecipeStore {
    getV60Recipe(): Recipe {
        return {
            recipeName: "James Hoffmann Ultimate V60 Technique",
            recipeMethod: BrewMethod.V60,
            recipeCoffeeMass: 15,
            recipeWaterMass: 250,
            recipeStages: [
                { name: "Wet the grounds", time: 0, waterMass: 0 },
                { name: "Bloom", time: 5, waterMass: 45 },
                { name: "60% Pour", time: 45, waterMass: 45 },
                { name: "Final Pour", time: 75, waterMass: 150 },
                { name: "Drain", time: 105, waterMass: 250 },
            ],
        };
    }
}
