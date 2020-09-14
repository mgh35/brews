import User from 'models/User';

export function createTestUser(): User {
    return {
        id: 'TestUser1',
        username: 'Test User 1',
        email: 'test-user-1@example.com',
        credentials: {
            accessKeyId: 'abc123',
            secretAccessKey: 'abc123',
            sessionToken: 'abc123',
            identityId: 'abc123',
            authenticated: true
        }
    }
};
