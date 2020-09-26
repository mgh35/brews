import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { Formik, Field } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";

import Brew, { BrewBuilder } from "models/Brew";
import { RootState } from "store";
import { PossibleUser } from "store/auth/types";
import { BrewsFromDynamoDb } from "apis/brewsFromDynamoDb";
import { BrewsApi } from "apis";

type Props = {
    user: PossibleUser;
    brewsApi: BrewsApi;
};

const initialValues = Object.freeze({
    bean: "",
    beanWeightInGrams: "",
    grinder: "",
    grindSetting: "",
    bloomTimeInSeconds: "",
    brewTimeInSeconds: "",
    waterWeightInGrams: "",
    comment: "",
});

export const BrewInputPanel: FunctionComponent<Props> = ({
    user,
    brewsApi,
}) => {
    const [errorMessage, setErrorMessage] = useState(null);

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        const success = await brewsApi.addBrewForUser(
                            user!,
                            makeBrewFromFormValues(values)
                        );
                        resetForm();
                    } catch (err) {
                        const message =
                            err instanceof Error ? err.message : err;
                        setErrorMessage(message);
                    }
                }}
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
                        <FormGroup controlId="bean">
                            <FormLabel>Bean</FormLabel>
                            <Field as={FormControl} type="text" name="bean" />
                        </FormGroup>
                        <FormGroup controlId="beanWeightInGrams">
                            <FormLabel>Bean Weight (g)</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="beanWeightInGrams"
                            />
                        </FormGroup>
                        <FormGroup controlId="grinder">
                            <FormLabel>Grinder</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="grinder"
                            />
                        </FormGroup>
                        <FormGroup controlId="grindSetting">
                            <FormLabel>Grind Setting</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="grindSetting"
                            />
                        </FormGroup>
                        <FormGroup controlId="bloomTimeInSeconds">
                            <FormLabel>Bloom Time (s)</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="bloomTimeInSeconds"
                            />
                        </FormGroup>
                        <FormGroup controlId="brewTimeInSeconds">
                            <FormLabel>Brew Time (s)</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="brewTimeInSeconds"
                            />
                        </FormGroup>
                        <FormGroup controlId="waterWeightInGrams">
                            <FormLabel>Water Weight (g)</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="waterWeightInGrams"
                            />
                        </FormGroup>
                        <FormGroup controlId="comment">
                            <FormLabel>Comment</FormLabel>
                            <Field
                                as={FormControl}
                                type="text"
                                name="comment"
                            />
                        </FormGroup>
                        <Button type="submit">Add Brew</Button>
                        {errorMessage && (
                            <div
                                className="alert alert-warning alert-dismissible fade show"
                                role="alert"
                            >
                                <strong>Error adding brew:</strong>
                                {errorMessage}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </>
    );
};

const makeBrewFromFormValues = (values: typeof initialValues): Brew => {
    const value = (name: keyof typeof values) => values[name] || null;
    return new BrewBuilder()
        .withBean(value("bean"))
        .withBeanWeightInGrams(value("beanWeightInGrams"))
        .withComment(value("comment"))
        .withGrinder(value("grinder"))
        .withGrindSetting(value("grindSetting"))
        .withBloomTimeInSeconds(value("bloomTimeInSeconds"))
        .withBrewTimeInSeconds(value("brewTimeInSeconds"))
        .withWaterWeightInGrams(value("waterWeightInGrams"))
        .build();
};

const defaultBrewsApi: BrewsApi = new BrewsFromDynamoDb();

const mapState = (state: RootState) => ({
    user: state.auth.user,
    brewsApi: defaultBrewsApi,
});

export default connect(mapState)(BrewInputPanel);
