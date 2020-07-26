import React from 'react';

import {userBrews} from 'lib/query';

class Brews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      brews: []
    };
  }

  componentDidMount() {
    userBrews(this.props.user)
      .then(brews  => {
        this.setState({brews})
      })
      .catch(error => {
        if (typeof error !== Error) {
          error = Error(error);
        }
        console.error(error)
        this.setState({error});
      })
      .finally(() => this.setState({isLoaded: true}));
  }

  render() {
    const {error, isLoaded, brews} = this.state;
    if (error) {
      return <div style={{color: 'red'}}>{error.name}: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <table>
            <thead>
              <td>Time</td>
              <td>Comment</td>
            </thead>
            <tbody>
            {
              brews.map(brew =>
                <tr>
                  <td>{brew.timestamp}</td>
                  <td>{brew.comment}</td>
                </tr>
              )
            }
            </tbody>
          </table>
      );
    }
  }
}

export default Brews;
