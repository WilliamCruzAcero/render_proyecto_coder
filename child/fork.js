const os = require('os');

process.on('message', msg => {
  const numNucleos =nucleoProce();
  process.send(numNucleos)
})


function nucleoProce() {

  
  const numCpus = os.cpus().length;
  return numCpus;
}

process.on('message', msg => {
  const numNucleos =nucleoProce();
  process.send(numNucleos)
})


function funcionRandom(min, max) {
  min = Math.ceil(1);
  max = Math.floor(1000);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

process.on('message', msg => {

  const numRandom = funcionRandom();
  process.send(numRandom);

})

 