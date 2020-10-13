import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import { User } from "models/user";
import BrewInput from "components/BrewInput";
import { BrewsStore } from "application/brewsStore";

function App() {
    const [loadingMessage, setLoadingMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [brewsStore, setBrewsStore] = useState<BrewsStore | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoadingMessage("finding out who you are");
                const user: User = await Auth.currentUserInfo();
                setLoadingMessage("fetching your brews");
                const brewsStore = new BrewsStore(user);
                await brewsStore.refresh();
                setBrewsStore(brewsStore);
            } catch (e) {
                setErrorMessage(String(e));
            } finally {
                setLoadingMessage("");
            }
        })();
    }, [setBrewsStore, setErrorMessage, setLoadingMessage]);

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
    } else if (!brewsStore) {
        return (
            <Alert variant="danger">
                Oops, something's gone wrong! I am quite confused.
            </Alert>
        );
    }
    return <BrewInput brewsStore={brewsStore} />;
}

export default withAuthenticator(App);
