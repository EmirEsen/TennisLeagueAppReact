// const SERVER_CLUSTER = 'http://deployment-tennisspring:9090'
const SERVER_LOADBALANCER = 'http://35.224.211.48:9090'
// const SERVER_LOCAL = 'http://localhost:9090'

const server = SERVER_LOADBALANCER;
const config = {
    BASE_URL: server
};

export default config;