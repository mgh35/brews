import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Formik, Field, FormikProps, FieldProps } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import FormCheck from "react-bootstrap/FormCheck";

import { BrewsFromDynamoDb } from "api";
import { User, BrewSchema, Brew } from "models";

const brewsApi = new BrewsFromDynamoDb();

interface BrewFieldProps {
    id: keyof Brew;
    label: string;
    formik: FormikProps<Brew>;
}

const BrewField = ({ id, label, formik }: BrewFieldProps) => {
    return (
        <FormGroup controlId={id}>
            <FormLabel>{label}</FormLabel>
            <Field
                as={FormControl}
                type="text"
                name={id}
                value={formik.values[id] === undefined ? "" : formik.values[id]}
                className={formik.errors[id] ? "is-invalid" : ""}
            />
            {formik.errors[id] && (
                <FormControl.Feedback type="invalid">
                    {formik.errors[id]}
                </FormControl.Feedback>
            )}
        </FormGroup>
    );
};

interface Props {
    user: User;
}

const BrewInput = ({ user }: Props) => {
    const [initialValues, setInitialValues] = useState<Brew>(_createNewBrew());
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetBrewInput = () => {
        setInitialValues(_createNewBrew());
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    try {
                        setIsSubmitting(true);
                        console.log(JSON.stringify(user));
                        console.log(JSON.stringify(values));
                        // await brewsApi.addBrewForUser(user!, values);
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
                {(formik) => (
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
                                <BrewField
                                    id="beanName"
                                    label="Name"
                                    formik={formik}
                                />
                                <BrewField
                                    id="beanProducer"
                                    label="Producer"
                                    formik={formik}
                                />
                                <BrewField
                                    id="beanRegion"
                                    label="Region"
                                    formik={formik}
                                />
                                <BrewField
                                    id="beanVariety"
                                    label="Variety"
                                    formik={formik}
                                />
                                <BrewField
                                    id="beanProcess"
                                    label="Process"
                                    formik={formik}
                                />
                                <BrewField
                                    id="beanRoaster"
                                    label="Roaster"
                                    formik={formik}
                                />
                                <BrewField
                                    id="beanRoastDate"
                                    label="Roast Date"
                                    formik={formik}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Grinder</legend>
                                <BrewField
                                    id="grinderType"
                                    label="Type"
                                    formik={formik}
                                />
                                <BrewField
                                    id="grinderSetting"
                                    label="Setting"
                                    formik={formik}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Brew</legend>
                                <BrewField
                                    id="brewCoffeeMass"
                                    label="Coffee Mass (g)"
                                    formik={formik}
                                />
                                <BrewField
                                    id="brewWaterMass"
                                    label="Water Mass (g)"
                                    formik={formik}
                                />
                                <BrewField
                                    id="brewTotalTime"
                                    label="Total Time (s)"
                                    formik={formik}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Taste</legend>
                                <FormGroup controlId="tasteOverall">
                                    <FormLabel>Overall</FormLabel>
                                    <Field name="tasteOverall">
                                        {({ field }: FieldProps) => (
                                            <div
                                                className={
                                                    formik.errors.tasteOverall
                                                        ? "is-invalid"
                                                        : ""
                                                }
                                            >
                                                <FormCheck
                                                    inline
                                                    type="radio"
                                                    label="Bad"
                                                    name="tasteOverall"
                                                    value="bad"
                                                    checked={
                                                        field.value === "bad"
                                                    }
                                                    onChange={field.onChange}
                                                />
                                                <FormCheck
                                                    inline
                                                    type="radio"
                                                    label="OK"
                                                    name="tasteOverall"
                                                    value="ok"
                                                    checked={
                                                        field.value === "ok"
                                                    }
                                                    onChange={field.onChange}
                                                />
                                            </div>
                                        )}
                                    </Field>
                                    {formik.errors.tasteOverall && (
                                        <FormControl.Feedback type="invalid">
                                            You must select a value.
                                        </FormControl.Feedback>
                                    )}
                                </FormGroup>
                            </fieldset>
                            <Button type="submit">Add Brew</Button>
                        </fieldset>
                    </Form>
                )}
            </Formik>
        </>
    );
};

const _createNewBrew = (): Brew => {
    return BrewSchema.cast({
        id: uuidv4(),
        version: "0.0.1",
        timestamp: new Date().toISOString(),
    });
};

export default BrewInput;
