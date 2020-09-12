import React, {FunctionComponent} from 'react';
import { connect, ConnectedProps} from 'react-redux';

import Brew from 'models/Brew';
import { RootState } from 'store';

const mapState = (state: RootState) => ({
    brews: state.brewList.all,
    fetchBrews: state.brewList.fetchBrews
});

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>;

const BrewList: FunctionComponent<Props> = ({brews, fetchBrews}) => <>
    <table>
        <tbody>
        {
            brews.map((brew: Brew) =>
            <tr key={brew.timestamp}>
                <td>{brew.timestamp}</td>
                <td>{brew.comment}</td>
            </tr>
            )
        }
        {
            fetchBrews.isRunning && <div>Fetching ...</div>
        }
        </tbody>
    </table>
</>;

export default connector(BrewList);
