function get_json_from_env(name: string): any {
    const env = process.env[name];
    if (!env) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return JSON.parse(env);
}

const config = process.env.NODE_ENV === "test" ? {} : {
    AWS_AMPLIFY_CONFIG: get_json_from_env("REACT_APP_AWS_AMPLIFY_CONFIG"),
    AWS_SDK_CONFIG: get_json_from_env("REACT_APP_AWS_SDK_CONFIG"),
    DYNAMODB_CONFIG: get_json_from_env("REACT_APP_DYNAMODB_CONFIG"),
};

export default config;
