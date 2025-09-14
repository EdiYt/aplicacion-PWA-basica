const db = new Dexie("AgendaApp");
db.version(1).stores({
  contacts: "++id,nombre,telefono,correo"
});

const form = document.querySelector("#contact-form");
const inputNombre = document.querySelector("#nombre");
const inputTelefono = document.querySelector("#telefono");
const inputCorreo = document.querySelector("#correo");
const listEl = document.querySelector("#contact-list");
const modal = document.querySelector("#modal");
const addBtn = document.querySelector("#addBtn");
const closeBtn = document.querySelector("#close");
const searchInput = document.querySelector("#search");

addBtn.onclick = () => {
  modal.classList.remove("hidden");
  inputNombre.focus();
}

closeBtn.onclick = () => {
  modal.classList.add("hidden");
  form.reset();
}

form.onsubmit = async (event) => {
  event.preventDefault();
  const nombre = inputNombre.value.trim();
  const telefono = inputTelefono.value.trim();
  const correo = inputCorreo.value.trim();

  if (nombre === "" || telefono === "" || correo === "") {
    alert("Todos los campos son obligatorios.");
    return;
  }

  await db.contacts.add({ nombre, telefono, correo });
  form.reset();
  modal.classList.add("hidden");
  getContacts();
}

const getContacts = async () => {
  const q = searchInput.value.trim().toLowerCase();
  let contacts = await db.contacts.toArray();
  if (q) {
    contacts = contacts.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.correo.toLowerCase().includes(q));
  }
  listEl.innerHTML = contacts.map(c =>
    `<tr>
      <td>${c.nombre}</td>
      <td>${c.telefono}</td>
      <td>${c.correo}</td>
     </tr>`).join("");
};

searchInput.oninput = getContacts;

window.onload = getContacts;
