import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { withAuthenticator } from "@aws-amplify/ui-react";

import Header from "components/Header";
import BrewList from "components/BrewList";
import BrewInputPanel from "components/BrewInputPanel";

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

function BrewInputPage() {
    const history = useHistory();
    return (
        <>
            <BrewInputPanel
                onSuccess={() => {
                    history.replace("/");
                }}
            />
        </>
    );
}

export function UnauthedApp() {
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
}

export default withAuthenticator(UnauthedApp);
