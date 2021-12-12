class usuario {
    constructor(id, nickname, contrasenia, nombre, apellido, email, direccion){
        this.id = id;
        this.nickname = nickname;
        this.contrasenia = contrasenia;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.direccion = direccion;
    }
}

const users =[
    {
        "id": 1,
        "nickname": "juancito",
        "contrasenia": "abc123",
        "nombre": "Juan",
        "apellido": "Lopez",
        "email": "juan@lopez.com",
    },
    {
        "id": 2,
        "nickname": "facu",
        "contrasenia": "abc456",
        "nombre": "Facu",
        "apellido": "rios",
        "email": "facu@rios.com",
    },
    {
        "id": 3,
        "nickname": "pedrito",
        "contrasenia": "abc123",
        "nombre": "Pedro",
        "apellido": "Perez",
        "email": "pedro@perez.com",
    }
]
//===login y registro===
const btnAcceder = document.getElementById("btn-acceder");
const saludo = document.getElementById("saludo");
const btnlogout = document.getElementById('logout')
function saludar(){
  let usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  if (usuarioActual !== null) {
    btnlogout.classList.toggle("visually-hidden")
    btnAcceder.classList.toggle("visually-hidden") 
    saludo.innerHTML = `<h4>Hola ${usuarioActual.nombre}</h4>`;
  }else{
    
  }
}


//Modal de Login-Acceder
const userName = document.getElementById("userName");
const userPass = document.getElementById("userPass");
const formLogin = document.getElementById("formLogin");
const closeLogin = document.getElementById("btn-close-acceder");
const loginError = document.getElementById("login-error");

//===Eventos de Login===
userName.addEventListener("change", () => {
});
userPass.addEventListener("change", () => {
});

//===Login de Usuario registrado===
formLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  
    const valor = users.find(
      (elemento) => elemento.nickname === userName.value)
    if (valor == undefined) {
        loginError.innerHTML = `<p>Usuario y/o contraseña incorrecta</p>`
        formLogin.reset();
    } else if (valor.contrasenia === userPass.value) {
        localStorage.setItem("usuario", JSON.stringify(valor));
        saludar()
        closeLogin.click();
    } else {
        loginError.innerHTML = `<p>Usuario y/o contraseña incorrecta</p>`;
        formLogin.reset();
    }
  });

//===Logout===

btnlogout.addEventListener('click', ()=>{
  localStorage.removeItem('usuario')
  botonVaciar.click()
  btnlogout.classList.toggle("visually-hidden")
  btnAcceder.classList.toggle("visually-hidden")
  saludo.innerHTML = ``;
  saludar()
})
// Registro usuario
const btnRegistro = document.getElementById('btnRegistrarse')//boton en modal acceder
const btnReg =document.getElementById('btnModalEegistro') //boton Abrir Modal de registro
const formReg = document.getElementById('formRegistro')
const nombreUser = document.getElementById('nombreUser')
const nombre = document.getElementById('nombre')
const apellido = document.getElementById('apellido')
const correo = document.getElementById('email')
const pass = document.getElementById('pass')
const btnCloseReg =document.getElementById('btn-close-registro')//Boton cerrar Modal Registro
function invalido (element){
  element.classList.add ("is-invalid")
  element.value = ""
  element.placeholder = "Ya exsiste";
}
function valido (element){
  element.classList.remove ("is-invalid")
}

btnRegistro.addEventListener('click', () =>{
  closeLogin.click()
  btnReg.click()
})
nombreUser.addEventListener('change', ()=>{
  const consulta = users.find((prod) => prod.nickname === nombreUser.value);
  if(consulta != undefined){
    invalido(nombreUser)
  }else{
    valido(nombreUser)
  }
})

nombre.addEventListener('change', ()=>{})
apellido.addEventListener('change', ()=>{})
correo.addEventListener('change', () =>{
  const consulta = users.find((prod) => prod.email === correo.value);
  if(consulta != undefined){
    invalido(correo)
  }else{
    valido(correo)
  }
})
pass.addEventListener('change', ()=>{
  if(pass.value.length < 8){
    pass.classList.add ("is-invalid")
    pass.value = ""
    pass.placeholder = "La contraseña debe tener 8 caracteres como minimo";
  }else{
    pass.classList.remove ("is-invalid")
  }
})

formReg.addEventListener('submit', (e)=>{
  e.preventDefault()
  users.push(new usuario ((users.length + 1),nombreUser.value,pass.value,nombre.value,apellido.value , correo.value))
  btnCloseReg.click()
  loginError.innerHTML = `<p>Gracias por registrarte.<hr> Ingresa tu usuario y contraseña</p>`;
  btnAcceder.click()
})
