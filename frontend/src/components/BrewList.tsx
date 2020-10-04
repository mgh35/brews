import React, { FunctionComponent } from "react";
import { connect, ConnectedProps } from "react-redux";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { RefreshCw } from "react-feather";

import Brew from "models/Brew";
import { RootState } from "store";
import { deleteBrewRequested, fetchBrewsRequested } from "store/brews/actions";

const mapState = (state: RootState) => state.brewList;

const mapDispatch = {
    fetchBrewsRequested: fetchBrewsRequested,
    deleteBrewRequested: deleteBrewRequested,
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const BrewList: FunctionComponent<Props> = ({
    isFetching,
    errorFetching,
    idToBrew,
    list_by_most_recent,
    fetchBrewsRequested,
    deleteBrewRequested,
}) => (
    <>
        <Container>
            <Row>
                <Col xs="1">
                    {isFetching ? (
                        <Spinner
                            animation="border"
                            role="status"
                            variant="primary"
                        />
                    ) : (
                        <RefreshCw color="blue" onClick={fetchBrewsRequested} />
                    )}
                </Col>
                <Col>
                    {errorFetching && (
                        <Alert variant="danger">
                            <strong>Error fetching brews:</strong>
                            {errorFetching}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
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
                {list_by_most_recent
                    .map((brewId) => idToBrew[brewId])
                    .map((brew: Brew) => (
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
                                <Button
                                    onClick={(e) => deleteBrewRequested(brew)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </Table>
    </>
);

export default connector(BrewList);
