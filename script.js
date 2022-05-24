/*
Declaracion inicial
*/
let totalIteration;
let inicio;
let totalBill = 0;
let factura = false;
let tableContent = '';
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
function ucfirst(cadena){
    let primera = cadena.charAt(0).toUpperCase();
    cadena = cadena.slice(1);
    return primera + cadena;
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
console.log(productos);
productos.forEach(item => {
    totalBill += item.cantidad * item.precio;
    tableContent += `
    <tr>
        <td>${ucfirst(item.nombre)}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio * item.cantidad}</td>
    </tr>
    `;
});

// agrego filas a la tabla
if(tableContent != undefined){
    document.getElementById("tbody-container").innerHTML = tableContent;
}

do{
    factura = prompt('Tipo de factura: ingrese A o B');      
}while(!validateFcType(factura));

let ivaDisc = (totalBill * 21)/100;
if(factura == 'b'){
    let footer = document.querySelector("#tfoot-container");
    footer.innerHTML = `
    <tr>
        <td>El total es:</td>
        <td colspan="2">$${totalBill + ivaDisc}</td>
    </tr>    
    `;
}else{
    let footer = document.querySelector("#tfoot-container");
    footer.innerHTML = `
    <tr>
        <td>Subtotal: $${totalBill}</td>
        <td>IVA: $${ivaDisc}</td>
        <td>El total es: $${totalBill + ivaDisc}</td>
    </tr>    
    `;
}

// Adapto la vista.
document.querySelector(".vista-previa").classList.add("d-none");
document.getElementById("table-container").classList.remove('d-none');
document.querySelector(".cart-title").classList.remove('d-none');
