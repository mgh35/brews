export interface User {
    id: string;
    username: string;
}

export interface Bean {
    name?: string;
    producer?: string;
    region?: string;
    variety?: string;
    process?: string;
    roaster?: string;
    roastDate?: Date;
}

export interface Grind {
    grinder?: string;
    grindSetting?: number;
}

export interface BrewStage {
    name?: string;
    time?: number;
    waterMass?: number;
}

export enum BrewMethod {
    V60 = "V60",
}

export interface Recipe {
    id: string;
    name: string;
    method: BrewMethod;
    coffeeMass: number;
    waterMass: number;
    stages: BrewStage[];
}

export interface Trace {
    coffeeMass?: number;
    waterMass?: number;
    totalTime?: number;
    stages?: BrewStage[];
}

export interface Brew {
    id: string;
    timestamp?: Date;
    bean?: Bean;
    grind?: Grind;
    recipe?: Recipe;
    trace?: Trace;
}
