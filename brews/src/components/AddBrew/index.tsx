import React, {Component} from 'react';

import {addBrew} from 'libs/query';
import {Brew} from 'models/brew';
import {User} from 'models/user';


type Props = {
    user: User
}

type State = {
    brew: Brew,
    lastError: string | null
}

class AddBrew extends Component<Props, State>{
    state = {
        brew: {
            timestamp: new Date().toISOString(),
            comment: 'Yum'
        },
        lastError: null
    }

    submit() {
        this.setState({lastError: null});
        addBrew(this.props.user, this.state.brew)
        .catch((e) => {
            console.error(e)
            this.setState({
                lastError: e
            });
        });
    }

    render() {
        return (
            <div>
                <button type="button" onClick={() => this.submit()}>Add Brew</button>
                <div style={{color: 'red', display: this.state.lastError ? 'block' : 'none'}}>
                    {this.state.lastError}
                </div>
                <hr />
            </div>
        );
    }
}

export default AddBrew;
