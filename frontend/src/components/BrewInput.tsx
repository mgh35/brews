import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Formik,
    Field,
    FieldProps,
    useFormikContext,
    FormikProps,
} from "formik";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import { BeanStore } from "application/beanStore";
import { BrewStore } from "application/brewStore";
import { RecipeStore } from "application/recipeStore";
import BeanChooser from "components/BeanChooser";
import BrewTimer from "components/BrewTimer";
import { BrewSchema, Brew } from "models/brew";
import styles from "./BrewInput.module.css";
import FlavourAccordion from "./FlavourAccordion";

interface Props {
    brewStore: BrewStore;
    beanStore: BeanStore;
}

const BrewInput = ({ brewStore, beanStore }: Props) => {
    const createInitialValues = () => _createNewBrew(brewStore.getLatestBrew());

    const [initialValues, setInitialValues] = useState<Brew>(
        createInitialValues()
    );
    const [versionKey, setVersionKey] = useState(Date.now());
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetBrewInput = () => {
        setInitialValues(createInitialValues());
        setVersionKey(Date.now());
    };

    return (
        <div className={styles.BrewInput}>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    try {
                        setIsSubmitting(true);
                        await brewStore.addBrew(BrewSchema.cast(values));
                        resetBrewInput();
                    } catch (err) {
                        const message =
                            err instanceof Error ? err.message : err;
                        setErrorMessage(message);
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
                validationSchema={BrewSchema}
            >
                {(formik) => {
                    return (
                        <Form
                            className="mx-auto"
                            onReset={formik.handleReset}
                            onSubmit={(event) => {
                                event.preventDefault();
                                formik.handleSubmit();
                            }}
                        >
                            <fieldset disabled={isSubmitting}>
                                <fieldset>
                                    <legend>Bean</legend>
                                    <BeanChooser
                                        value={formik.values.beanId}
                                        beanStore={beanStore}
                                        onSelect={(beanId) => {
                                            const bean = beanStore.getById(
                                                beanId
                                            );
                                            formik.setValues({
                                                ...formik.values,
                                                ...bean,
                                            });
                                        }}
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Grind</legend>
                                    <BrewField
                                        id="grindGrinder"
                                        label="Grinder"
                                    />
                                    <BrewField
                                        id="grindSetting"
                                        label="Setting"
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Brew</legend>
                                    <BrewField
                                        id="brewCoffeeMass"
                                        label="Coffee Mass (g)"
                                    />
                                    <BrewTimer
                                        key={`brewTimer_${versionKey}`}
                                        recipe={formik.values}
                                        onRecord={(trace) => {
                                            formik.setFieldValue(
                                                "brewTotalTime",
                                                trace.brewTotalTime
                                            );
                                            formik.setFieldValue(
                                                "brewStages",
                                                trace.brewStages
                                            );
                                        }}
                                    />
                                    <BrewField
                                        id="brewWaterMass"
                                        label="Water Mass (g)"
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Taste</legend>
                                    <FormGroup controlId="tasteOverall">
                                        <Field name="tasteOverall">
                                            {({ field }: FieldProps) => (
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name={field.name}
                                                    className={
                                                        styles.toggleGroup
                                                    }
                                                    value={field.value}
                                                    onChange={(_, event) => {
                                                        field.onChange(event);
                                                    }}
                                                >
                                                    <ToggleButton
                                                        value="bad"
                                                        variant="outline-secondary"
                                                    >
                                                        Bad
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="ok"
                                                        variant="outline-secondary"
                                                    >
                                                        OK
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="good"
                                                        variant="outline-secondary"
                                                    >
                                                        Good
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            )}
                                        </Field>
                                    </FormGroup>
                                    <FormGroup>
                                        <BrewToggleButton
                                            id="tasteSweetness"
                                            label="Sweet"
                                        />
                                        <BrewToggleButton
                                            id="tasteSourness"
                                            label="Sour"
                                        />
                                        <BrewToggleButton
                                            id="tasteBitterness"
                                            label="Bitter"
                                        />
                                    </FormGroup>
                                    <Accordion>{}</Accordion>
                                    <FormGroup>
                                        <FlavourAccordion
                                            value={formik.values.tasteAromas}
                                            onChange={(aromas) =>
                                                formik.setFieldValue(
                                                    "tasteAromas",
                                                    aromas
                                                )
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup controlId="tasteBody">
                                        <FormLabel>Body</FormLabel>
                                        <Field name="tasteBody">
                                            {({ field }: FieldProps) => (
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name={field.name}
                                                    className={
                                                        styles.toggleGroup
                                                    }
                                                    value={field.value}
                                                    onChange={(_, event) => {
                                                        field.onChange(event);
                                                    }}
                                                >
                                                    <ToggleButton
                                                        value="light"
                                                        variant="outline-secondary"
                                                    >
                                                        Light
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="medium"
                                                        variant="outline-secondary"
                                                    >
                                                        Medium
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="heavy"
                                                        variant="outline-secondary"
                                                    >
                                                        Heavy
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            )}
                                        </Field>
                                    </FormGroup>
                                </fieldset>
                                <Button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={
                                        Object.keys(formik.errors).length > 0
                                    }
                                >
                                    Add Brew
                                </Button>
                                {Object.keys(formik.errors).length > 0 && (
                                    <Alert variant="warning">
                                        <strong>Validation Errors: </strong>
                                        {JSON.stringify(formik.errors)}
                                    </Alert>
                                )}
                            </fieldset>
                            {errorMessage && (
                                <Alert variant="danger" role="alert">
                                    <strong>Error adding brew: </strong>
                                    {String(errorMessage)}
                                </Alert>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

interface BrewFieldProps {
    id: keyof Brew;
    label: string;
}

const BrewField = ({ id, label }: BrewFieldProps) => {
    const { values, errors }: FormikProps<Brew> = useFormikContext();
    return (
        <FormGroup controlId={id}>
            <FormLabel>{label}</FormLabel>
            <Field
                as={FormControl}
                type="text"
                name={id}
                value={values[id] === undefined ? "" : values[id]}
                className={errors[id] ? "is-invalid" : ""}
            />
            {errors[id] && (
                <FormControl.Feedback type="invalid">
                    {errors[id]}
                </FormControl.Feedback>
            )}
        </FormGroup>
    );
};

interface BrewToggleButtonProps {
    id: keyof Brew;
    label: string;
}

const BrewToggleButton = ({ id, label }: BrewToggleButtonProps) => {
    const { values, setFieldValue }: FormikProps<Brew> = useFormikContext();
    return (
        <Button
            className={styles.toggleButton}
            variant="outline-secondary"
            active={values[id]}
            onClick={() => setFieldValue(id, !values[id])}
        >
            {label}
        </Button>
    );
};

const _createNewBrew = (modelBrew: Brew | null): Brew => {
    const prototypeBrew = modelBrew
        ? {
              beanName: modelBrew.beanName,
              beanProducer: modelBrew.beanProducer,
              beanRegion: modelBrew.beanRegion,
              beanVariety: modelBrew.beanVariety,
              beanProcess: modelBrew.beanProcess,
              beanRoaster: modelBrew.beanRoaster,
              beanRoastDate: modelBrew.beanRoastDate,
              grindGrinder: modelBrew.grindGrinder,
              grindSetting: modelBrew.grindSetting,
          }
        : {};

    const recipe = new RecipeStore().getV60Recipe();

    return BrewSchema.cast({
        id: uuidv4(),
        version: "0.0.1",
        timestamp: new Date().toISOString(),
        ...recipe,
        ...prototypeBrew,
    });
};

export default BrewInput;
