// ===== ELEMENTOS =====
const botones = document.querySelectorAll(".producto button");
const listaCarrito = document.getElementById("lista-carrito");
const totalTexto = document.getElementById("total");
const vaciarBtn = document.getElementById("vaciar-carrito");
const contador = document.getElementById("contador-carrito");
const toggleCarrito = document.getElementById("toggle-carrito");
const dropdownCarrito = document.getElementById("dropdown-carrito");

let carrito = [];

// ===== FUNCIONES CARRITO =====
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - €${item.precio}`;

    const eliminar = document.createElement("button");
    eliminar.textContent = "❌";
    eliminar.style.marginLeft = "8px";

    eliminar.onclick = () => {
      carrito.splice(index, 1);
      guardar();
      actualizarCarrito();
    };

    li.appendChild(eliminar);
    listaCarrito.appendChild(li);
    total += item.precio;
  });

  totalTexto.textContent = `Total: €${total}`;
  contador.textContent = carrito.length;
  vaciarBtn.disabled = carrito.length === 0;
}

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargar() {
  const data = localStorage.getItem("carrito");
  if (data) {
    carrito = JSON.parse(data);
    actualizarCarrito();
  }
}

// ===== AÑADIR PRODUCTOS =====
botones.forEach(btn => {
  btn.addEventListener("click", () => {
    carrito.push({
      nombre: btn.dataset.nombre,
      precio: Number(btn.dataset.precio)
    });
    guardar();
    actualizarCarrito();
  });
});

// ===== VACIAR CARRITO =====
vaciarBtn.onclick = () => {
  carrito = [];
  guardar();
  actualizarCarrito();
};

// ===== TOGGLE CARRITO =====
toggleCarrito.onclick = () => {
  dropdownCarrito.classList.toggle("show");
};

cargar();

// ===== FILTRO CATEGORÍAS =====
const filtros = document.querySelectorAll(".categoria-link");
const productos = document.querySelectorAll(".producto");

filtros.forEach(filtro => {
  filtro.addEventListener("click", e => {
    e.preventDefault();
    const cat = filtro.dataset.filtro;

    productos.forEach(prod => {
      prod.classList.toggle(
        "hide",
        cat !== "all" && prod.dataset.categoria !== cat
      );
    });
  });
});

// ===== CHECKOUT =====
const formCheckout = document.getElementById("form-checkout");
const modal = document.getElementById("modal-confirmacion");
const cerrarModal = document.getElementById("cerrar-modal");
const mensajeModal = document.getElementById("mensaje-modal");

formCheckout.addEventListener("submit", e => {
  e.preventDefault();

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  mensajeModal.textContent = `Gracias por tu compra 🕯️ Total: €${total}`;
  modal.classList.add("show");

  carrito = [];
  guardar();
  actualizarCarrito();
  formCheckout.reset();

  setTimeout(() => {
    modal.classList.remove("show");
  }, 3000);
});

cerrarModal.onclick = () => modal.classList.remove("show");

// ===== OPINIONES =====
const formOpinion = document.getElementById("form-opinion");
const listaOpiniones = document.getElementById("lista-opiniones");

formOpinion.addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("opinion-nombre").value;
  const texto = document.getElementById("opinion-texto").value;

  const li = document.createElement("li");
  li.innerHTML = `<strong>${nombre}:</strong> ${texto}`;

  listaOpiniones.appendChild(li);
  formOpinion.reset();
});

// ===== BOTÓN SUBIR ARRIBA =====
const btnUp = document.getElementById("btn-up");

window.onscroll = () => {
  btnUp.style.display = window.scrollY > 300 ? "block" : "none";
};

btnUp.onclick = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

// ===== SLIDER SOBRE NOSOTROS =====
let slides = document.querySelectorAll(".slider-velas .slide");
let indexSlide = 0;

function mostrarSlide() {
  slides.forEach(s => s.classList.remove("activo"));
  slides[indexSlide].classList.add("activo");
  indexSlide = (indexSlide + 1) % slides.length;
}

// ===== BÚSQUEDA DE PRODUCTOS =====
const busquedaInput = document.getElementById("busqueda-productos");

busquedaInput.addEventListener("input", () => {
  const termino = busquedaInput.value.toLowerCase();

  // Usa la misma variable "productos" que ya existe
  productos.forEach(producto => {
    const nombre = producto.querySelector("h2").textContent.toLowerCase();
    const descripcion = producto.querySelector(".descripcion-corta").textContent.toLowerCase();

    if (nombre.includes(termino) || descripcion.includes(termino)) {
      producto.classList.remove("hide");
    } else {
      producto.classList.add("hide");
    }
  });
});
setInterval(mostrarSlide, 3000);
