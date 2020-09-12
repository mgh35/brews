import React, { FunctionComponent } from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';

const AddBrewForm: FunctionComponent<InjectedFormProps> = ({handleSubmit}) => {
    return <form onSubmit={handleSubmit}>
        <Field name="comment" type="text" component="input" placeholder="Comment" />
        <button>Add</button>
    </form>;
};

export default reduxForm({
    form: 'AddBrewForm'
})(AddBrewForm);
