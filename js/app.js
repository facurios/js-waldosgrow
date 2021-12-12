function mostrarProductos(filtro) {
  let array = [];
  $(".card").remove();
  $.get("./json/productos.json", (response) => {
    if (filtro === "all") {
        $("#tituloProductos").text(`Nuestros Productos`)
      array = response;
    } else {
      $("#tituloProductos").text(`${filtro}`)
      array = response.filter((prod) => prod.tipo === filtro);
    }
    array.forEach((dato) => {
      $("#areaProductos").append(
        `
            <div class="card tarjetas productos" style="width:12rem; display:none">
                <img src=${dato.img} alt="" style="">
                <h4 class="productos__text--chico" style="">${dato.nombre}</h4>
                <div class="detalle2">
                    <p class="detalle" style="background-color: black; higth:50px">${dato.desc}</p>
                </div>
                <div class="productos__texto--grande" style="margin-top: 15px">
                  <p class="precioProducto">Precio: $${dato.precio} </p>
                </div>
                
                <div>
                <button onclick="agregarAlCarrito(${dato.id})" class="btn btn-success productos__text--button">Agregar <i class="fas fa-shopping-cart"></i></button>
                <button onclick="modalProd(${dato.id})" class="btn btn-primary productos__text--button">Detalle <i class="fas fa-shopping-cart"></i></button>
                </div>  
                
            </div>`
      );
      $("#areaProductos div").fadeIn("slow");
    });
  });
}

//===Modifica el DOM del carrito cuando el mismo esta vacio
function carritoVacio(){
  let carrito = JSON.parse(localStorage.getItem("carrito"))
  if(carrito.length>0){
    $('#mensaje').text ('')
    btncomprar.classList.remove('disabled')
  }else{
    btncomprar.classList.add('disabled')
    $('#mensaje').text ('')
  }
} 

//===DOM de Filtros de productos===
const categorias = document.getElementById("categorias");
categorias.innerHTML = `
        <h4 class="categorias__text--titulo">Categorias</h4>
        <ul>
            <li>
                <button onclick="mostrarProductos('all')" class="btn btn-light" style="margin-bottom: 7px">Todos</button>
            </li>
            <li>
                <button onclick="mostrarProductos('Parafernalia')" class="btn btn-light" style="margin-bottom: 7px">Parafernalia</button>
            </li>
            <li>
            <button onclick="mostrarProductos('Aditivos')" class="btn btn-light" style="margin-bottom: 7px">Aditivos</button>
            </li>
            <li>
                <button onclick="mostrarProductos('Iluminacion')" class="btn btn-light" style="margin-bottom: 7px">Iluminación</button> 
            </li>
            <li>
                <button onclick="mostrarProductos('Combos')" class="btn btn-light" style="margin-bottom: 7px">Combos</button>
            </li>
            <li>
                <button onclick="mostrarProductos('Sustratos')"class="btn btn-light" style="margin-bottom: 7px">Sustratos</button>
            </li>
        </ul>
        `
//======================Carrito=================
const contenedorCarrito = document.getElementById("carrito-contenedor");
const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotal = document.getElementById("precioTotal");
const botonVaciar = document.getElementById("vaciar-carrito");
const btncomprar = document.getElementById('comprar')
const cerrarModalCarrito = document.getElementById('btn-close-modal')

//===Actualiza el carrito en el DOM===
const actualizarCarrito = () => {
  carritoVacio()
  contenedorCarrito.innerHTML = "";
  let carrito = JSON.parse(localStorage.getItem("carrito"))
  carrito.forEach((prod) => {
          const div = document.createElement("tr");
          div.innerHTML = `
                                  <td scope="row" ><img style="width: 40%"src="${prod.img}"</img></td>
                                  <td>${prod.nombre}</td>
                                  <td>${prod.cantidad}</td>
                                  <td>
                                      <button onclick="cantidadProductos(${prod.id},-1)" class="btn btn-danger btn-sm">-</button>
                                      <button onclick="cantidadProductos(${prod.id},1)" class="btn btn-primary btn-sm">+</button>
                                  </td>    
                                  <td>${prod.precio*prod.cantidad}</td>
                                  <td><button onclick="eliminarCarrito(${prod.id})" class="btn btn-danger btn-sm">x</button></td>
                              `

          contenedorCarrito.appendChild(div);
  });

  contadorCarrito.innerText = carrito.length;
  precioTotal.innerText = carrito.reduce(
          (acc, prod) => acc + prod.precio * prod.cantidad,
          0
  );
};

//===Agregar Productos al carrito===
const agregarAlCarrito = (prodId) => {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  $.get("./json/productos.json", (response) => {
    let contador = 1;
    const item = response.find((prod) => prod.id === prodId);
    const consulta = carrito.find((prod) => prod.id === prodId);
    if (consulta === undefined) {
      carrito.push(
        {
        id: item.id,
        cantidad: contador,
        nombre: item.nombre,
        precio: item.precio,
        img: item.img,
        desc:item.desc
      });
      alertaCompra.click()
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      alertaCompra.click()
      let index = carrito.findIndex((prod) => prod.id === prodId);
      cantidadProductos(prodId, 1);
    }
    actualizarCarrito();
  });
};
//===Elimina productos del carrito===
const eliminarCarrito = (prodId) => {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  const item = carrito.find((prod) => prod.id === prodId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarCarrito();
};

//===Aumentar o restar cantidad de productos en carrito===
const cantidadProductos = (prodId, valor) => {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  let index = carrito.findIndex((prod) => prod.id === prodId);
  if (valor < 0 && carrito[index].cantidad == 1) {
  } else {
    carrito[index].cantidad = carrito[index].cantidad + valor;
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
};
//===Vaciar todo el Carrito===
botonVaciar.addEventListener("click", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
});

//===Finalizar compra===
const finalizarCompra = async () =>{
  const carrito = JSON.parse(localStorage.getItem("carrito"))
  const carritoPago = carrito.map((prod)=> {
    return{
          title: prod.nombre,
          description: prod.desc,
          picture_url: prod.img,
          category_id:"",
          quantity: prod.cantidad,
          currency_id: "ARS",
          unit_price: prod.precio
        }
     
  })
 
 const respuesta = await fetch('https://api.mercadopago.com/checkout/preferences',{
      method: 'POST',
      headers:{
        Authorization: 'Bearer TEST-5093905085536895-120414-3c89ac5fedbc637840554e99cb93ca80-140979411'
      },
      body:JSON.stringify({
        items: carritoPago,
        back_urls:{
          success: window.location.href,
          failure: window.location.href
        }
      })
    })

    const data = await respuesta.json()

      window.location.replace(data.init_point)
}

//===Logueo antes de comprar===
btncomprar.addEventListener('click', ()=>{
  let usuarioActual = JSON.parse(localStorage.getItem("usuario"))
  let carrito = JSON.parse(localStorage.getItem("carrito"))
  if (usuarioActual == null) {
  cerrarModalCarrito.click()
  btnAcceder.click()
  }else{
    finalizarCompra()
  }
  
})

//===Ejecucion global

// Crea el array Carrito en el local storage
if (localStorage.getItem("carrito") == null) {
  localStorage.setItem("carrito", JSON.stringify([]));
} else {
  actualizarCarrito();
}
saludar()// funcion en users.js
let filtro = "all";

//===Ejecucion funcion mostrar productos en DOM===

mostrarProductos(filtro);


//====Modal Producto=====
const btnProd = document.getElementById('btnModalProductos')
const prod = document.getElementById('detalleProd')
const footer =document.getElementById('detalleProdFooter')
const modalProd = (prodId)=>{
  $.get("./json/productos.json", (response) => {
  const producto = response.find((prod) => prod.id === prodId)
  detalleProd.innerHTML = `
        <div class="modal-header">
        <h5 class="modal-title">Detalle del Producto</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row" >
              <div class="col-md-5" style="text-align: center; border: solid 1px" ><img src="${producto.img}" style="width:200px" alt=""></div>
              <div class="col-md-7" style="border:solid,black" >
                  <div class="row" style="text-align: center;" ><h2>${producto.nombre}</h2>  </div>
                  <div class="row" style=" text-align: left;margin-top: 15px"><p><strong>Descripción:</strong></p> </div>
                  <div class="row" style=" text-align: justify;margin-top: 1px"><p>${producto.desc}</p> </div>
                  <div class="row display-6" style="text-align: center; margin-top: 30px;"><p>Precio: $${producto.precio}</p> </div>
              </div>
          </div>
        </div>
        <div class="modal-footer" id="detalleProdFooter">
            <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-success productos__text--button">Agregar <i class="fas fa-shopping-cart"></i></button>
        </div>
                          
         `
btnProd.click()
  })
}
const alertaCompra = document.getElementById('alertAgregado')
alertaCompra.addEventListener('click', ()=>{
  alertCompra()
})


