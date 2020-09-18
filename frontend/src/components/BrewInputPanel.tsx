import React, { FunctionComponent } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Formik, Field } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";

import { BrewBuilder } from "models/Brew";
import { RootState } from "store";
import { addBrewRequested } from "store/brewList/actions";

const mapState = (state: RootState) => ({
  addBrew: state.brewList.addBrew,
});

const mapDispatch = {
  addBrewRequested: addBrewRequested,
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const BrewInputPanel: FunctionComponent<Props> = ({
  addBrew,
  addBrewRequested,
}) => (
  <>
    <Formik
      initialValues={{
        bean: "",
        beanWeightInGrams: "",
        grinder: "",
        grindSetting: "",
        bloomTimeInSeconds: "",
        brewTimeInSeconds: "",
        waterWeightInGrams: "",
        comment: "",
      }}
      onSubmit={(values) => {
        const value = (name: keyof typeof values) => values[name] || null;
        addBrewRequested(
          new BrewBuilder()
            .withBean(value("bean"))
            .withBeanWeightInGrams(value("beanWeightInGrams"))
            .withComment(value("comment"))
            .withGrinder(value("grinder"))
            .withGrindSetting(value("grindSetting"))
            .withBloomTimeInSeconds(value("bloomTimeInSeconds"))
            .withBrewTimeInSeconds(value("brewTimeInSeconds"))
            .withWaterWeightInGrams(value("waterWeightInGrams"))
            .create()
        );
      }}
    >
      {(formik) => (
        <Form
          className="mx-auto"
          onReset={formik.handleReset}
          onSubmit={(event) => formik.handleSubmit()}
        >
          <FormGroup controlId="bean">
            <FormLabel>Bean</FormLabel>
            <FormControl
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="bean"
            />
          </FormGroup>
          <FormGroup controlId="beanWeightInGrams">
            <FormLabel>Bean Weight (g)</FormLabel>
            <Field as={FormControl} type="text" name="beanWeightInGrams" />
          </FormGroup>
          <FormGroup controlId="grinder">
            <FormLabel>Grinder</FormLabel>
            <Field as={FormControl} type="text" name="grinder" />
          </FormGroup>
          <FormGroup controlId="grindSetting">
            <FormLabel>Grind Setting</FormLabel>
            <Field as={FormControl} type="text" name="grindSetting" />
          </FormGroup>
          <FormGroup controlId="bloomTimeInSeconds">
            <FormLabel>Bloom Time (s)</FormLabel>
            <Field as={FormControl} type="text" name="bloomTimeInSeconds" />
          </FormGroup>
          <FormGroup controlId="brewTimeInSeconds">
            <FormLabel>Brew Time (s)</FormLabel>
            <Field as={FormControl} type="text" name="brewTimeInSeconds" />
          </FormGroup>
          <FormGroup controlId="waterWeightInGrams">
            <FormLabel>Water Weight (g)</FormLabel>
            <Field as={FormControl} type="text" name="waterWeightInGrams" />
          </FormGroup>
          <FormGroup controlId="comment">
            <FormLabel>Comment</FormLabel>
            <Field as={FormControl} type="text" name="comment" />
          </FormGroup>
          <Button type="submit">Add Brew</Button>
        </Form>
      )}
    </Formik>
    {addBrew.isRunning && <div>Adding ...</div>}
    {addBrew.error && <div>Error: {addBrew.error}</div>}
  </>
);

export default connector(BrewInputPanel);
