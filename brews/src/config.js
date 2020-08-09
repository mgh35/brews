const config = {
    AWS_AMPLIFY_CONFIG: JSON.parse(process.env.REACT_APP_AWS_AMPLIFY_CONFIG),
    AWS_SDK_CONFIG: JSON.parse(process.env.REACT_APP_AWS_SDK_CONFIG),
    DYNAMODB_CONFIG: JSON.parse(process.env.REACT_APP_DYNAMODB_CONFIG),
};

export default config;
