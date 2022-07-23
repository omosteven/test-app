const dev = {
  apiGateway: {
    BASE_URL: process.env.REACT_APP_DEV_API_BASE_URL,
    CLIENT_KEY: process.env.REACT_APP_DEV_CLIENT_KEY,
    SOCKET_BASE_URL: process.env.REACT_APP_SOCKET_URL,
  },
};

const staging = {
  apiGateway: {
    BASE_URL: process.env.REACT_APP_STAGING_API_BASE_URL,
    CLIENT_KEY: process.env.REACT_APP_STAGING_CLIENT_KEY,
    SOCKET_BASE_URL: process.env.REACT_APP_SOCKET_URL,
  },
};

const config = process.env.REACT_APP_STAGE === "staging" ? staging : dev;

// eslint-disable-next-line import/no-anonymous-default-export
export default { ...config };
