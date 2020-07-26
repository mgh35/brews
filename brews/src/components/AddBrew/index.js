import React from 'react';

import {addBrew} from 'lib/query';

class AddBrew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        brew: {
            comment: "yum"
        }
    };
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
            <div style={{color: "red", display: (this.state.lastError ? "block" : "none")}}>
                {this.state.lastError}
            </div>
            <hr />
        </div>
    );
  }
}

export default AddBrew;
