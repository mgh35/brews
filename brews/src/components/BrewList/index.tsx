import React, {Component} from 'react';

import {userBrews} from 'libs/query';
import Brew from 'models/brew';
import {User} from 'models/user';


type Props = {
  user: User
}

type State = {
  error: Error | null,
  isLoaded: boolean,
  brews: Brew[]
}

class BrewList extends Component<Props, State> {
  state = {
    error: null,
    isLoaded: false,
    brews: []
  };

  componentDidMount() {
    userBrews(this.props.user)
      .then(brews  => {
        this.setState({brews})
      })
      .catch(error => {
        console.error(error)
        this.setState({error});
      })
      .finally(() => this.setState({isLoaded: true}));
  }

  render() {
    if (this.state.error) {
      return <div style={{color: 'red'}}>Some error</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <table>
            <thead>
              <tr>
                <td>Time</td>
                <td>Comment</td>
              </tr>
            </thead>
            <tbody>
            {
              this.state.brews.map((brew: Brew) =>
                <tr key={brew.timestamp} className="brew">
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

export default BrewList;
