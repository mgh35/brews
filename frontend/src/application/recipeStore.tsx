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
                { name: "Bloom", time: undefined, waterMass: 45 },
                { name: "60% Pour (start)", time: 45, waterMass: 45 },
                { name: "60% Pour (checkpoint)", time: 60, waterMass: 100 },
                { name: "Final Pour (start)", time: 75, waterMass: 150 },
                { name: "Final Pour (checkpoint)", time: 90, waterMass: 200 },
                { name: "Drain", time: 105, waterMass: 250 },
                { name: "Finished", time: undefined, waterMass: 250 },
            ],
        };
    }
}
