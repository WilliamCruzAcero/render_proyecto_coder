require('dotenv').config({path: './env/.env'})
const Server = require('./sever');

const main = async () => {
    const port = process.env.PORT || 3000;
    const server = new Server(port);
    
    await server.listen();
    await server.start();
};

main();