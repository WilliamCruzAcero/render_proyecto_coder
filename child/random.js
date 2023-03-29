function funcionRandom(min, max) {
  min = Math.ceil(1);
  max = Math.floor(1000);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

process.on('message', msg => {

  const numRandom = funcionRandom();
  process.send(numRandom);

})