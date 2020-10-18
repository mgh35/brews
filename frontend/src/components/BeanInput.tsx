import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Formik, Field, useFormikContext, FormikProps } from "formik";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";

import { BeanStore } from "application/beanStore";
import { Bean, BeanSchema } from "models/brew";

interface Props {
    beanStore: BeanStore;
    onClose: (beanId: string | undefined) => void;
}

const BeanInput = ({ beanStore, onClose }: Props) => {
    const [initialValues] = useState(_createNewBean());

    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    try {
                        const bean = BeanSchema.cast(values);
                        await beanStore.addBean(bean);
                        onClose(bean.beanId);
                    } catch (err) {
                        const message =
                            err instanceof Error ? err.message : err;
                        setErrorMessage(message);
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
                validationSchema={BeanSchema}
            >
                {(formik) => {
                    return (
                        <Form
                            id="BeanInputForm"
                            className="mx-auto"
                            onReset={formik.handleReset}
                            onSubmit={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <fieldset disabled={isSubmitting}>
                                <legend>Bean</legend>
                                <BeanField id="beanName" label="Name" />
                                <BeanField id="beanProducer" label="Producer" />
                                <BeanField id="beanRegion" label="Region" />
                                <BeanField id="beanVariety" label="Variety" />
                                <BeanField id="beanProcess" label="Process" />
                                <BeanField id="beanRoaster" label="Roaster" />
                                <BeanField
                                    id="beanRoastDate"
                                    label="Roast Date"
                                />
                                <Button
                                    variant="outline-primary"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onClose(undefined);
                                    }}
                                >
                                    Discard
                                </Button>
                                <Button
                                    form="BeanInputForm"
                                    variant="primary"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        formik.handleSubmit();
                                    }}
                                >
                                    Add Bean
                                </Button>
                            </fieldset>
                            {errorMessage && (
                                <Alert variant="danger" role="alert">
                                    <strong>Error adding bean: </strong>
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

interface BeanFieldProps {
    id: keyof Bean;
    label: string;
}

const BeanField = ({ id, label }: BeanFieldProps) => {
    const { values, errors }: FormikProps<Bean> = useFormikContext();
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

const _createNewBean = () => {
    return BeanSchema.cast({
        beanId: uuidv4(),
        beanVersion: "0.0.1",
    });
};

export default BeanInput;
