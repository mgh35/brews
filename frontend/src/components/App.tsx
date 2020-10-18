import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import { User } from "models/user";
import BrewInput from "components/BrewInput";
import { BeanStore } from "application/beanStore";
import { BrewStore } from "application/brewStore";

function App() {
    const [loadingMessage, setLoadingMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [brewStore, setBrewStore] = useState<BrewStore | undefined>(
        undefined
    );
    const [beanStore, setBeanStore] = useState<BeanStore | undefined>(
        undefined
    );

    useEffect(() => {
        (async () => {
            try {
                setLoadingMessage("finding out who you are");
                const user: User = await Auth.currentUserInfo();
                setLoadingMessage("fetching your brews");
                const brewStore = new BrewStore(user);
                const beanStore = new BeanStore(user);
                await Promise.all([brewStore.refresh(), beanStore.refresh()]);
                setBrewStore(brewStore);
                setBeanStore(beanStore);
            } catch (e) {
                setErrorMessage(String(e));
            } finally {
                setLoadingMessage("");
            }
        })();
    }, [setBrewStore, setErrorMessage, setLoadingMessage]);

    if (errorMessage) {
        return (
            <Alert variant="danger">
                Failed to load Brews!
                <hr />
                {errorMessage}
            </Alert>
        );
    } else if (loadingMessage) {
        return (
            <Alert variant="primary">
                <Spinner animation="grow" variant="primary" /> Loading app ...{" "}
                {loadingMessage}
            </Alert>
        );
    } else if (!brewStore || !beanStore) {
        return (
            <Alert variant="danger">
                Oops, something's gone wrong! I am quite confused.
            </Alert>
        );
    }
    return <BrewInput brewStore={brewStore} beanStore={beanStore} />;
}

export default withAuthenticator(App);
