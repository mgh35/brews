
import React, {FunctionComponent} from 'react';
import { connect, ConnectedProps} from 'react-redux';

import { createBrew } from 'models/Brew';
import { RootState } from 'store';
import { addBrewRequested } from 'store/brewList/actions';
import AddBrewForm from 'components/AddBrewForm';

const mapState = (state: RootState) => ({
    addBrew: state.brewList.addBrew
});

const mapDispatch = {
    addBrewRequested: addBrewRequested
}

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const AddBrew: FunctionComponent<Props> = ({addBrew, addBrewRequested}) => {
    const onSubmit = (addBrewForm: any) => {
        addBrewRequested(createBrew(addBrewForm.comment))
    };
    return <>
        <AddBrewForm onSubmit={onSubmit} />
        {
            addBrew.isRunning && <div>Adding ...</div>
        }
        {
            addBrew.error && <div>Error: {addBrew.error}</div>
        }
    </>;
};

export default connector(AddBrew);
