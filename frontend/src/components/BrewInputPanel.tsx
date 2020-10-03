import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { Formik, Field } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import * as yup from "yup";

import Brew, { BrewBuilder } from "models/Brew";
import { RootState } from "store";
import { PossibleUser } from "store/auth/types";
import { BrewsFromDynamoDb } from "apis/brewsFromDynamoDb";
import { BrewsApi } from "apis";
import { BrewsState } from "store/brews/types";

type Props = {
    user: PossibleUser;
    brewsApi: BrewsApi;
    modelBrew?: Brew | null;
};

export const BrewInputPanel: FunctionComponent<Props> = ({
    user,
    brewsApi,
    modelBrew = null,
}) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <>
            <Formik
                initialValues={makeInitialValuesFromModelBrew(modelBrew)}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        setIsSubmitting(true);
                        await brewsApi.addBrewForUser(
                            user!,
                            makeBrewFromFormValues(values)
                        );
                        resetForm();
                    } catch (err) {
                        const message =
                            err instanceof Error ? err.message : err;
                        setErrorMessage(message);
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
                validationSchema={yup.object().shape({
                    beanWeightInGrams: yup.number().min(0),
                    grindSetting: yup.number().min(0).integer(),
                    bloomTimeInSeconds: yup.number().min(0),
                    brewTimeInSeconds: yup.number().min(0),
                    waterWeightInGrams: yup.number().min(0),
                })}
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
                            <FormGroup controlId="bean">
                                <FormLabel>Bean</FormLabel>
                                <Field
                                    as={FormControl}
                                    type="text"
                                    name="bean"
                                />
                            </FormGroup>
                            <FormGroup controlId="beanWeightInGrams">
                                <FormLabel>Bean Weight (g)</FormLabel>
                                <Field
                                    as={FormControl}
                                    type="text"
                                    name="beanWeightInGrams"
                                    className={
                                        formik.errors.beanWeightInGrams
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {formik.errors.beanWeightInGrams && (
                                    <div className="invalid-feedback">
                                        {formik.errors.beanWeightInGrams}
                                    </div>
                                )}
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
                                    className={
                                        formik.errors.grindSetting
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {formik.errors.grindSetting && (
                                    <div className="invalid-feedback">
                                        {formik.errors.grindSetting}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup controlId="bloomTimeInSeconds">
                                <FormLabel>Bloom Time (s)</FormLabel>
                                <Field
                                    as={FormControl}
                                    type="text"
                                    name="bloomTimeInSeconds"
                                    className={
                                        formik.errors.bloomTimeInSeconds
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {formik.errors.bloomTimeInSeconds && (
                                    <div className="invalid-feedback">
                                        {formik.errors.bloomTimeInSeconds}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup controlId="brewTimeInSeconds">
                                <FormLabel>Brew Time (s)</FormLabel>
                                <Field
                                    as={FormControl}
                                    type="text"
                                    name="brewTimeInSeconds"
                                    className={
                                        formik.errors.brewTimeInSeconds
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {formik.errors.brewTimeInSeconds && (
                                    <div className="invalid-feedback">
                                        {formik.errors.brewTimeInSeconds}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup controlId="waterWeightInGrams">
                                <FormLabel>Water Weight (g)</FormLabel>
                                <Field
                                    as={FormControl}
                                    type="text"
                                    name="waterWeightInGrams"
                                    className={
                                        formik.errors.waterWeightInGrams
                                            ? "is-invalid"
                                            : ""
                                    }
                                />
                                {formik.errors.waterWeightInGrams && (
                                    <div className="invalid-feedback">
                                        {formik.errors.waterWeightInGrams}
                                    </div>
                                )}
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
                        </fieldset>
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

const emptyInitialValues = Object.freeze({
    bean: "",
    beanWeightInGrams: "",
    grinder: "",
    grindSetting: "",
    bloomTimeInSeconds: "",
    brewTimeInSeconds: "",
    waterWeightInGrams: "",
    comment: "",
});

type ValuesType = typeof emptyInitialValues;

const makeInitialValuesFromModelBrew = (modelBrew: Brew | null): ValuesType => {
    const overlay = modelBrew
        ? {
              bean: modelBrew.bean,
              grinder: modelBrew.grinder,
              grindSetting: modelBrew.grindSetting,
          }
        : {};
    return Object.assign({}, emptyInitialValues, overlay);
};

const makeBrewFromFormValues = (values: typeof emptyInitialValues): Brew => {
    const value = (name: keyof typeof values) => values[name] || null;
    return new BrewBuilder()
        .withCurrentTimestamp()
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
    modelBrew: getLatestBrew(state.brewList),
});

const getLatestBrew = (brewsState: BrewsState): Brew | null => {
    return brewsState.list_by_most_recent
        ? brewsState.idToBrew[brewsState.list_by_most_recent[0]]
        : null;
};

export default connect(mapState)(BrewInputPanel);
