import * as yup from "yup";

export interface User {
    id: string;
    username: string;
}

export const BrewSchema = yup
    .object({
        id: yup.string().ensure().required(),
        version: yup.string().ensure().required(),
        timestamp: yup.string().ensure(),
        beanName: yup.string().ensure(),
        beanProducer: yup.string().ensure(),
        beanRegion: yup.string().ensure(),
        beanVariety: yup.string().ensure(),
        beanProcess: yup.string().ensure(),
        beanRoaster: yup.string().ensure(),
        beanRoastDate: yup.string().ensure(),
        grinderType: yup.string().ensure(),
        grinderSetting: yup.number().integer().positive(),
        brewCoffeeMass: yup.number().positive(),
        brewWaterMass: yup.number().positive(),
        brewTotalTime: yup.number().positive(),
        tasteOverall: yup
            .string()
            .ensure()
            .matches(/^(bad|ok|good|)$/),
    })
    .required();

export type Brew = yup.InferType<typeof BrewSchema>;
