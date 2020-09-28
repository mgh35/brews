import React, { FunctionComponent } from "react";
import { connect, ConnectedProps } from "react-redux";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import Brew from "models/Brew";
import { RootState } from "store";
import {
    deleteBrewRequested,
    fetchBrewsRequested,
} from "store/brewList/actions";

const mapState = (state: RootState) => ({
    brews: state.brewList.all,
    fetchBrews: state.brewList.fetchBrews,
});

const mapDispatch = {
    fetchBrewsRequested: fetchBrewsRequested,
    deleteBrewRequested: deleteBrewRequested,
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const BrewList: FunctionComponent<Props> = ({
    brews,
    fetchBrews,
    fetchBrewsRequested,
    deleteBrewRequested,
}) => (
    <>
        <Button onClick={fetchBrewsRequested}>Refresh</Button>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Bean</th>
                    <th>Bean Weight (g)</th>
                    <th>Grinder</th>
                    <th>Grind Setting</th>
                    <th>Bloom Time (s)</th>
                    <th>Brew Time (s)</th>
                    <th>Water Weight (g)</th>
                    <th>Comment</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {brews.map((brew: Brew) => (
                    <tr key={brew.id}>
                        <td>{brew.timestamp}</td>
                        <td>{brew.bean}</td>
                        <td>{brew.beanWeightInGrams}</td>
                        <td>{brew.grinder}</td>
                        <td>{brew.grindSetting}</td>
                        <td>{brew.bloomTimeInSeconds}</td>
                        <td>{brew.brewTimeInSeconds}</td>
                        <td>{brew.waterWeightInGrams}</td>
                        <td>{brew.comment}</td>
                        <td>
                            <Button onClick={(e) => deleteBrewRequested(brew)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        {fetchBrews.isRunning && <div>Fetching ...</div>}
        {fetchBrews.error && <div>Error: {fetchBrews.error}</div>}
    </>
);

export default connector(BrewList);
