const http = require('http');
const cluster = require('cluster');
const argv = process.argv.slice(2);
const PORT = argv.length > 0 ? argv(0) : 8080;

if (cluster.isMaster){
    const numCPUs = require('os').cpus().length;
    console.log(`Worker maestro ejecutandose en el puerto: ${PORT}, PID: ${process.pid}`)

    for ( let i = 0; i < numCPUs -1 ; i++ ) {
        cluster.fork();
    }

    cluster.on('exit', () => {
        console.log(`Worker died: ${process.pid}`);
        cluster.fork();
    })

} else { 
    const pid = process.pid;
    const fecha = new Date(Date.now());  
    const server = http.createServer();

    server.on('request', (req, res) => {
       
        res.end(`Servidor con pid (${pid}) - puerto (${PORT}) - fecha: (${fecha})`);
    });

    

    server.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto: ${PORT}. PID: ${process.pid}`);
    });
}

