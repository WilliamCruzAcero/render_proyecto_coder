const os = require('os');

function nucleoProce() {
  const numCpus = os.cpus().length;
  return numCpus;
}

process.on('message', msg => {
  const numNucleos =nucleoProce();
  process.send(numNucleos)
})