import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

import { User } from "models";
import BrewInput from "BrewInput";

function App() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => setUser(userInfo));
    }, [setUser]);

    return <>{user ? <BrewInput user={user} /> : <div>No User</div>}</>;
}

export default withAuthenticator(App);
