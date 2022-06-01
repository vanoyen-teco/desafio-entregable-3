/*
Declaracion inicial
*/
let totalIteration;
let inicio = 1;
let totalBill = 0;
let factura = false;
let tableContent = '';
let inputContent;
let producto;
const buttonEnviar = document.getElementById("btnEnviar");
const campoDatos = document.getElementById("campoDatos");
const productos = new Array();
/*
Funciones
*/
function setCantidad(){
    changeInnerHtml("formLabelDatos", `Ingrese cantidad de productos`);
    totalIteration = parseInt(returnInput());
    if(validateNumber(totalIteration) && totalIteration > 0){
        setProductos();
        buttonEnviar.onclick =  productosPasos;
    }else{
        inputError(false);
    }
}
function validateNumber(number){
    if(number === "" || number === undefined || number === null || isNaN(number)){
        return false;
    }else{
        return true;
    }
}
function validateFcType(){
    tipo = campoDatos.value;
    tipo = tipo.toLowerCase().trim();
    if(tipo == "a" || tipo == "b"){
        printFactura();
        return true;
    }else{
        inputError(false);
        return false;
    }
}
function ucfirst(cadena){
    let primera = cadena.charAt(0).toUpperCase();
    cadena = cadena.slice(1);
    return primera + cadena;
}
function returnInput(){
    inputContent = campoDatos.value;
    return inputContent;
}
function changeInnerHtml(id, datos){
    document.getElementById(`${id}`).innerHTML = datos;   
}
function inputError(estado){
    (estado) ? campoDatos.classList.remove("is-invalid") : campoDatos.classList.add("is-invalid");
}
function productosPasos(){
    eventProducto();
}
function setProductos(){
    inputError(true);
    campoDatos.value = '';
    if(inicio <= totalIteration){
        changeInnerHtml("formLabelDatos", `Ingrese nombre del producto Nº ${inicio}`);
        eventProducto();
    }else{
        finalProductos();
    }
}
function eventProductoPrecio(){
    number = returnInput();
    if(validateNumber(number)){
        productos.push({nombre: `${producto}`, cantidad: 1, precio: number});
        inicio++;
        buttonEnviar.onclick = productosPasos;
        setProductos();
    }else{
        if(number != ''){
            inputError(false);
        }
    }
}
function eventProducto(){
    producto = returnInput();
    producto = producto.toLowerCase();
    if(producto != ''){
        let itemIndex = productos.findIndex( item => item.nombre === producto);
        if(itemIndex == -1){
            // primer ingreso del item, solicito el precio.
            campoDatos.value = '';
            changeInnerHtml("formLabelDatos", `Ingrese precio del producto ${inicio}`);
            buttonEnviar.onclick = eventProductoPrecio;
        }else{
            // sumo uno ya que el item se encuentra en el "carro";
            productos[itemIndex].cantidad = productos[itemIndex].cantidad + 1;
            inicio++;
            setProductos();
        }
    }else{
        inputError(true);
    }    
}

function finalProductos(){
    // calculo final
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
        changeInnerHtml("tbody-container", tableContent);
    }
    changeInnerHtml("formLabelDatos", 'Tipo de factura: ingrese A o B');
    buttonEnviar.onclick = validateFcType;
}

function printFactura(){
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
            <td>Subtotal: $${(totalBill).toFixed(2)}</td>
            <td>IVA: $${(ivaDisc).toFixed(2)}</td>
            <td>El total es: $${(totalBill + ivaDisc).toFixed(2)}</td>
        </tr>    
        `;
    }

    // guardo la factura (temporalmente en local storage)
    almacenarFactura(totalBill, tableContent);

    // Adapto la vista.
    document.querySelector(".vista-previa").classList.add("d-none");
    let ocultar = document.querySelectorAll(".cart-title, .final, #table-container");
    ocultar.forEach(function(element) {
        element.classList.remove('d-none');
    });
}

function almacenarFactura(total, tabla){
    let datosFactura = {total: total, tabla: tabla};
    localStorage.setItem('datosFactura', JSON.stringify(datosFactura));
}

function reimprimirFactura(datos){
    totalBill = datos.total;
    tableContent = datos.tabla;
    changeInnerHtml("tbody-container", tableContent);
    printFactura();
}

function verificarStorageFactura(){
    if(localStorage.getItem('datosFactura')){
        let datos = JSON.parse(localStorage.getItem('datosFactura'));
        let myOffcanvasReimpresion = document.getElementById('offcanvasCarrito');
        let bsOffcanvasReimpresion = new bootstrap.Offcanvas(myOffcanvasReimpresion);

        bsOffcanvasReimpresion.show();
        document.getElementById('btnReimprimirFc').onclick = () => { reimprimirFactura(datos); bsOffcanvasReimpresion.hide() };
        document.getElementById('btnNoReimprimirFc').onclick = () => { bsOffcanvasReimpresion.hide() };
    }
}

/*Listeners*/
document.getElementById("form-datos").addEventListener('submit', (e) => {
    e.preventDefault();
});
campoDatos.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        buttonEnviar.click();
    }
})
/*Start app*/
buttonEnviar.onclick = setCantidad;
document.getElementById('btnRestart').onclick = () => {location.reload()};
verificarStorageFactura();