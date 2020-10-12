import * as yup from "yup";

export const BeanSchema = yup
    .object({
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

export const BrewTraceSchema = yup
    .object({
        brewCoffeeMass: yup.number().positive(),
        brewWaterMass: yup.number().positive(),
        brewTotalTime: yup.number().positive(),
    })
    .required();

export const RecipeSchema = yup
    .object({
        recipeName: yup.string().ensure(),
        recipeMethod: yup
            .string()
            .ensure()
            .matches(/^(V60|)$/),
        recipeCoffeeMass: yup.number().positive(),
        recipeWaterMass: yup.number().positive(),
        recipeStages: yup.array(),
    })
    .required();

export type Recipe = yup.InferType<typeof RecipeSchema>;

export type BrewTrace = yup.InferType<typeof BrewTraceSchema>;

export const TasteSchema = yup
    .object({
        tasteOverall: yup
            .string()
            .ensure()
            .matches(/^(bad|ok|good|)$/),
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
    .shape(BrewTraceSchema.fields)
    .shape(TasteSchema.fields)
    .required();

export type Brew = yup.InferType<typeof BrewSchema>;
