require('dotenv').config({path: './env/.env'})
const cluster = require('cluster');
const {cpus} = require('os');
const Server = require('./sever');


const main = async () => {
    // const port = process.env.PORT || 3000;
    const port = process.argv[2] || 8080;
    const server = new Server(port);
    
    await server.start();
    await server.listen();
};

const modoCluster = process.argv[3]==='CLUSTER'
const cpuNum = cpus().length;

if ( modoCluster && cluster.isPrimary) {
        console.log(`Cluster iniciando. CPUS: ${cpuNum}`);
        console.log(`PID: ${process.pid}`);
        for(let i = 0; i<cpuNum -1; i++) {
            cluster.fork();
        }

        cluster.on('exit', worker => {
            console.log(`${new Date().toLocaleString()}: Worker ${worker.process.pid}`);
            cluster.fork();
        })
    }else{

    main();

}