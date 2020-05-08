const HOST = window.location.hostname;
const connectTo = (HOST === 'localhost')? `${HOST}:${PORT}`: HOST;
let socket = io(connectTo + '/index');

