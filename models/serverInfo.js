require('dotenv').config();
const {fork} = require('child_process');


function info() {

    const serverInfo = {
        path: process.cwd(),
        plataforma: process.platform,
        pid: process.pid,
        version: process.version,
        carpeta: process.title,
        memoria: process.memoryUsage.rss()
    }
    
    const dataNucleos = fork('../child/fork.js')
    dataNucleos.send('start');
    dataNucleos.on('message', msg => {
    
        let numNucleos = msg;
        
        
        return serverInfo, 
               numNucleos

    })
}

module.exports = info

