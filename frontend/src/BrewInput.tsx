import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Formik, Field, FieldProps } from "formik";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

import { BrewsStore } from "core";
import { BrewSchema, Brew } from "models";
import BrewTimer from "BrewTimer";

interface Props {
    brewsStore: BrewsStore;
}

const BrewInput = ({ brewsStore }: Props) => {
    const createInitialValues = () =>
        _createNewBrew(brewsStore.getLatestBrew());

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
        <>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    try {
                        setIsSubmitting(true);
                        await brewsStore.addBrew(BrewSchema.cast(values));
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
                    interface BrewFieldProps {
                        id: keyof Brew;
                        label: string;
                    }

                    const BrewField = ({ id, label }: BrewFieldProps) => {
                        return (
                            <FormGroup controlId={id}>
                                <FormLabel>{label}</FormLabel>
                                <Field
                                    as={FormControl}
                                    type="text"
                                    name={id}
                                    value={
                                        formik.values[id] === undefined
                                            ? ""
                                            : formik.values[id]
                                    }
                                    className={
                                        formik.errors[id] ? "is-invalid" : ""
                                    }
                                />
                                {formik.errors[id] && (
                                    <FormControl.Feedback type="invalid">
                                        {formik.errors[id]}
                                    </FormControl.Feedback>
                                )}
                            </FormGroup>
                        );
                    };

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
                                    <BrewField id="beanName" label="Name" />
                                    <BrewField
                                        id="beanProducer"
                                        label="Producer"
                                    />
                                    <BrewField id="beanRegion" label="Region" />
                                    <BrewField
                                        id="beanVariety"
                                        label="Variety"
                                    />
                                    <BrewField
                                        id="beanProcess"
                                        label="Process"
                                    />
                                    <BrewField
                                        id="beanRoaster"
                                        label="Roaster"
                                    />
                                    <BrewField
                                        id="beanRoastDate"
                                        label="Roast Date"
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Grinder</legend>
                                    <BrewField id="grinderType" label="Type" />
                                    <BrewField
                                        id="grinderSetting"
                                        label="Setting"
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Brew</legend>
                                    <BrewField
                                        id="brewCoffeeMass"
                                        label="Coffee Mass (g)"
                                    />
                                    <BrewField
                                        id="brewWaterMass"
                                        label="Water Mass (g)"
                                    />
                                    <BrewField
                                        id="brewTotalTime"
                                        label="Total Time (s)"
                                    />
                                    <BrewTimer
                                        key={`brewTimer_${versionKey}`}
                                        onRecord={(trace) => {
                                            formik.setFieldValue(
                                                "brewTotalTime",
                                                trace.brewTotalTime
                                            );
                                        }}
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Taste</legend>
                                    <FormGroup controlId="tasteOverall">
                                        <FormLabel>Overall</FormLabel>
                                        <Field name="tasteOverall">
                                            {({ field }: FieldProps) => (
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={(_, event) => {
                                                        field.onChange(event);
                                                    }}
                                                    style={{ width: "100%" }}
                                                >
                                                    <ToggleButton
                                                        value="bad"
                                                        variant="secondary"
                                                    >
                                                        Bad
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="ok"
                                                        variant="secondary"
                                                    >
                                                        OK
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="good"
                                                        variant="secondary"
                                                    >
                                                        Good
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            )}
                                        </Field>
                                    </FormGroup>
                                </fieldset>
                                <Button type="submit">Add Brew</Button>
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
        </>
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
              grinderType: modelBrew.grinderType,
              grinderSetting: modelBrew.grinderSetting,
          }
        : {};

    return BrewSchema.cast({
        ...prototypeBrew,
        id: uuidv4(),
        version: "0.0.1",
        timestamp: new Date().toISOString(),
    });
};

export default BrewInput;
