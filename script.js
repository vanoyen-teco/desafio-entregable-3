/*
Declaracion inicial
*/
let totalIteration;
let inicio;
let totalBill = 0;
let factura = false;
const productos = new Array();
/*
Funciones
*/
function setCantidad(){
    totalIteration = prompt('Ingrese cantidad de productos')
    return validateNumber(totalIteration);
}
function validateNumber(number){
    if(number === "" || number === undefined || number === null || isNaN(number)){
        return false;
    }else{
        return true;
    }
}
function validateFcType(tipo){
    tipo = tipo.toLowerCase().trim();
    if(tipo == "a" || tipo == "b"){
        return true;
    }else{
        return false;
    }
}

do{
    inicio = setCantidad();
}while(!inicio);

for(let i = 1; i <= parseInt(totalIteration); i++){
    let number;
    let producto = prompt(`Ingrese nombre del producto Nº ${i}`);
    producto = producto.toLowerCase();
    let itemIndex = productos.findIndex( item => item.nombre === producto); 
    if(itemIndex == -1){
        // primer ingreso del item, solicito el precio.
        do{
            number = prompt(`Ingrese precio del producto ${i}`);        
        }while(!validateNumber(number));
        // agrego el producto.
        productos.push({nombre: `${producto}`, cantidad: 1, precio: number});
    }else{
        // sumo uno ya que el item se encuentra en el "carro";
        productos[itemIndex].cantidad = productos[itemIndex].cantidad + 1;
    }
};

// calculo final
productos.forEach(item => {
    totalBill += item.cantidad * item.precio;
});

do{
    factura = prompt('Tipo de factura: ingrese A o B');      
}while(!validateFcType(factura));

let ivaDisc = (totalBill * 21)/100;
if(factura == 'b'){
    console.log(`El total es: ${totalBill + ivaDisc}`);
}else{
    console.log(`Subtotal: ${totalBill}`);
    console.log(`IVA: ${ivaDisc}`);
    console.log(`El total es: ${totalBill + ivaDisc}`);
}
