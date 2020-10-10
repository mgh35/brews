import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { BrewsFromDynamoDb } from "api";
import { User, Brew } from "models";

interface Props {
    user: User;
}

export default ({ user }: Props) => {
    const [brew, setBrew] = useState(_createNewBrew());
    const [error, setError] = useState("");

    const addBrew = async () => {
        try {
            setError("");
            new BrewsFromDynamoDb().addBrewForUser(user, brew);
            setBrew(_createNewBrew());
        } catch (e) {
            setError(String(e));
        }
    };

    return (
        <>
            <div>User: {JSON.stringify(user)}</div>
            <div>ID: {brew.id}</div>
            <div>Timestamp: {brew.timestamp?.toISOString()}</div>
            <button onClick={addBrew}>Add Brew</button>
            {error && <div>Error: {error}</div>}
        </>
    );
};

const _createNewBrew = (): Brew => {
    return {
        id: uuidv4(),
        timestamp: new Date(),
    };
};
