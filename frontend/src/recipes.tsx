import { Recipe, BrewMethod } from "models";

export const hoffmanV60Recipe: Recipe = {
    id: "20ac081d-8005-49e6-be97-cb7c314695ca",
    name: "James Hoffmann Ultimate V60 Technique",
    method: BrewMethod.V60,
    coffeeMass: 15,
    waterMass: 250,
    stages: [
        { name: "Wet the grounds", time: 0, waterMass: 0 },
        { name: "Bloom", waterMass: 45 },
        { name: "60% Pour (start)", time: 45, waterMass: 45 },
        { name: "60% Pour (checkpoint)", time: 60, waterMass: 100 },
        { name: "Final Pour (start)", time: 75, waterMass: 150 },
        { name: "Final Pour (checkpoint)", time: 90, waterMass: 200 },
        { name: "Drain", time: 105, waterMass: 250 },
        { name: "Finished", waterMass: 250 },
    ],
};
