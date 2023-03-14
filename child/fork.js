 

 function calcular() {
     let suma = 0;

     for (let i = 0; i < 6e9; i++){
        suma += i;
     }
     return suma;
 }
 process.on('message', msg => {
    console.log('Mensaje del padre', msg)
    const suma = calcular();
    process.send(suma); 

 }) 