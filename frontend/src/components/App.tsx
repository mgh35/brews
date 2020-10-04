import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import Header from "components/Header";
import BrewList from "components/BrewList";
import BrewInputPanel from "components/BrewInputPanel";
import { fetchBrewsRequested } from "store/brews/actions";
import { RootState } from "store";

function MainPage() {
    const history = useHistory();
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Card
                            onClick={() => {
                                history.replace("/add");
                            }}
                            style={{ width: "50%" }}
                        >
                            <Card.Body>
                                <Card.Title>Add Brew</Card.Title>
                                <Card.Text>Record your next brew!</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card
                            onClick={() => {
                                history.replace("/list");
                            }}
                            style={{ width: "50%" }}
                        >
                            <Card.Body>
                                <Card.Title>List Brews</Card.Title>
                                <Card.Text>
                                    See all of your previous brews.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

const brewInputPageConnector = connect(null, {
    fetchBrews: fetchBrewsRequested,
});

type BrewInputPageProps = ConnectedProps<typeof brewInputPageConnector>;

const BrewInputPage = brewInputPageConnector(
    ({ fetchBrews }: BrewInputPageProps) => {
        const history = useHistory();
        return (
            <>
                <BrewInputPanel
                    onSuccess={() => {
                        fetchBrews();
                        history.replace("/");
                    }}
                />
            </>
        );
    }
);

const mapState = (state: RootState) => ({
    auth: state.auth,
});

const mapDispatch = {
    fetchBrews: fetchBrewsRequested,
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

const App = ({ auth, fetchBrews }: Props) => {
    useEffect(() => {
        if (auth.user) {
            fetchBrews();
        }
    }, [auth, fetchBrews]);

    return (
        <>
            <BrowserRouter>
                <Header />
                <Container>
                    <Switch>
                        <Route exact path="/">
                            <MainPage />
                        </Route>
                        <Route exact path="/add">
                            <BrewInputPage />
                        </Route>
                        <Route exact path="/list">
                            <BrewList />
                        </Route>
                    </Switch>
                </Container>
            </BrowserRouter>
        </>
    );
};

export default connector(App);
