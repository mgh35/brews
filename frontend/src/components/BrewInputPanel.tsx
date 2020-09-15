import React, { FunctionComponent, FormEvent } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Formik, Form, Field } from "formik";

import { createBrew } from "models/Brew";
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
      initialValues={{ comment: "" }}
      onSubmit={(values) => {
        addBrewRequested(createBrew(values["comment"]));
      }}
    >
      {() => (
        <Form>
          <Field type="text" name="comment" />
          <button type="submit">Add Brew</button>
        </Form>
      )}
    </Formik>
    {addBrew.isRunning && <div>Adding ...</div>}
    {addBrew.error && <div>Error: {addBrew.error}</div>}
  </>
);

export default connector(BrewInputPanel);
