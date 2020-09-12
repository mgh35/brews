interface Credentials {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration?: string;
    identityId: string;
    authenticated: boolean;
}

interface User {
    id: string;
    username: string;
    email: string;
    credentials: Credentials;
}

export default User;
