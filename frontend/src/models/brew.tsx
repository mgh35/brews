import * as yup from "yup";

export const BeanSchema = yup
    .object({
        beanId: yup.string().ensure(),
        beanVersion: yup.string().ensure(),
        beanName: yup.string().ensure(),
        beanProducer: yup.string().ensure(),
        beanRegion: yup.string().ensure(),
        beanVariety: yup.string().ensure(),
        beanProcess: yup.string().ensure(),
        beanRoaster: yup.string().ensure(),
        beanRoastDate: yup.string().ensure(),
    })
    .required();

export type Bean = yup.InferType<typeof BeanSchema>;

export const GrindSchema = yup
    .object({
        grindGrinder: yup.string().ensure(),
        grindSetting: yup.number().integer().positive(),
    })
    .required();

export type Grind = yup.InferType<typeof GrindSchema>;

export enum BrewMethod {
    V60 = "V60",
}

export const BrewStageSchema = yup.object({
    name: yup.string().ensure(),
    time: yup.number(),
    waterMass: yup.number(),
});

export type BrewStage = yup.InferType<typeof BrewStageSchema>;

export const RecipeSchema = yup
    .object({
        recipeName: yup.string().ensure(),
        recipeMethod: yup.mixed().oneOf(["V60"]),
        recipeCoffeeMass: yup.number().positive(),
        recipeWaterMass: yup.number().positive(),
        recipeStages: yup.array(BrewStageSchema.required()),
    })
    .required();

export type Recipe = yup.InferType<typeof RecipeSchema>;

export const BrewTraceSchema = yup
    .object({
        brewCoffeeMass: yup.number().positive(),
        brewWaterMass: yup.number().positive(),
        brewTotalTime: yup.number().positive(),
        brewStages: yup.array(BrewStageSchema.required()),
    })
    .required();

export type BrewTrace = yup.InferType<typeof BrewTraceSchema>;

export const TasteSchema = yup
    .object({
        tasteOverall: yup
            .string()
            .ensure()
            .matches(/^(bad|ok|good|)$/),
        tasteSweetness: yup.boolean(),
        tasteSourness: yup.boolean(),
        tasteBitterness: yup.boolean(),
        tasteBody: yup
            .string()
            .ensure()
            .matches(/^(light|medium|heavy|)$/),
        tasteAromas: yup.array().of(yup.string().ensure().required()),
    })
    .required();

export type Taste = yup.InferType<typeof TasteSchema>;

export const BrewSchema = yup
    .object({
        id: yup.string().ensure().required(),
        version: yup.string().ensure().required(),
        timestamp: yup.string().ensure(),
    })
    .shape(BeanSchema.fields)
    .shape(GrindSchema.fields)
    .shape(RecipeSchema.fields)
    .shape(BrewTraceSchema.fields)
    .shape(TasteSchema.fields)
    .required();

export type Brew = yup.InferType<typeof BrewSchema>;
