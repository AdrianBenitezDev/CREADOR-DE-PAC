function buscarHeader() {
  let headerLocalPac = localStorage.getItem("headerPac");

  if (headerLocalPac) {
    window.headerPac = JSON.parse(headerLocalPac);
    console.log("Datos cargados:", window.headerPac);
  } else {
    mostrarFormularioHeader();
  }
}

document
  .getElementById("btnMostrarHeader")
  .addEventListener("click", mostrarFormularioHeader);

function mostrarFormularioHeader() {
  // Crear fondo oscuro
  const fondo = document.createElement("div");
  fondo.style.position = "fixed";
  fondo.style.top = 0;
  fondo.style.left = 0;
  fondo.style.width = "100%";
  fondo.style.height = "100%";
  fondo.style.background = "rgba(0,0,0,0.7)";
  fondo.style.zIndex = 999;
  document.body.appendChild(fondo);

  // Crear panel
  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.top = "50%";
  panel.style.left = "50%";
  panel.style.transform = "translate(-50%, -50%)";
  panel.style.background = "white";
  panel.style.padding = "20px";
  panel.style.borderRadius = "10px";
  panel.style.zIndex = 1000;
  panel.style.maxWidth = "400px";
  panel.style.width = "90%";
  panel.style.maxHeight = "80vh"; // Altura máxima del panel
  panel.style.overflowY = "auto"; // Habilita el scroll vertical

  panel.innerHTML = `
  <h2 style="margin-top:0; color:#333;">Datos de Cabecera PAC</h2>

  <div style="display: flex; flex-direction: column; gap: 12px;">

    <label>
      <span style="display:block; margin-bottom:4px;">Domicilio de la Escuela:</span>
      <input id="domicilio" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" />
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Teléfono Institucional:</span>
      <input id="telefono" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" />
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Email Institucional:</span>
      <input id="email" type="email" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" />
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Categoría:</span>
      <select id="categoria" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
        <option>1ra</option><option>2da</option><option>3ra</option>
      </select>
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Turno:</span>
      <select id="turno" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
        <option>M</option><option>T</option><option>V</option><option>M,T</option><option>M,T,V</option>
      </select>
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Desfavorabilidad:</span>
      <select id="desfavorabilidad" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
        <option>0</option><option>1°</option><option>2°</option><option>3°</option><option>4°</option><option>5°</option>
      </select>
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Distrito:</span>
      <input id="distrito" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" />
    </label>

    <label>
      <span style="display:block; margin-bottom:4px;">Tipo de organización:</span>
      <input id="tipoOrganizacion" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" />
    </label>

    <label>
    <span style="display:block; margin-bottom:4px;">Escuela:</span>
    <input id="escuela" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" />
  </label>

  </div>

  <div style="text-align:right; margin-top:20px;">
    <button id="guardarHeader" style="background:green;color:white;padding:10px 18px;border:none;border-radius:5px;cursor:pointer;">Guardar</button>
    <button id="cancelarHeader" style="background:#aaa;color:white;padding:10px 18px;border:none;border-radius:5px;margin-left:10px;cursor:pointer;">Cancelar</button>
    <button id="eliminarHeader" style="background:red;color:white;padding:10px 18px;border:none;border-radius:5px;margin-left:10px;cursor:pointer;">Eliminar</button>
  </div>
`;

  document.body.appendChild(panel);

  try {
    let datosInicio2 = localStorage.getItem("headerPac");

    let datosInicio = JSON.parse(datosInicio2);

    document.getElementById("domicilio").value = datosInicio.domicilio;
    document.getElementById("telefono").value = datosInicio.telefono;
    document.getElementById("email").value = datosInicio.email;
    document.getElementById("categoria").value = datosInicio.categoria;
    document.getElementById("turno").value = datosInicio.turno;
    document.getElementById("desfavorabilidad").value =
      datosInicio.desfavorabilidad;
    document.getElementById("distrito").value = datosInicio.distrito;
    document.getElementById("tipoOrganizacion").value =
      datosInicio.tipoOrganizacion;
    document.getElementById("escuela").value = datosInicio.escuela;
  } catch {}

  document.getElementById("guardarHeader").onclick = () => {
    const campos = [
      "domicilio",
      "telefono",
      "email",
      "categoria",
      "turno",
      "desfavorabilidad",
      "distrito",
      "tipoOrganizacion",
      "escuela",
    ];

    let hayErrores = false;

    // Validar campos vacíos
    campos.forEach((id) => {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        input.style.border = "2px solid red";
        hayErrores = true;
      } else {
        input.style.border = "1px solid #ccc"; // Restaurar si estaba bien
      }
    });

    if (hayErrores) {
      alert("Por favor, complete todos los campos antes de guardar.");
      return;
    }

    // Si está todo bien, guardar
    const datos = {
      domicilio: document.getElementById("domicilio").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value,
      categoria: document.getElementById("categoria").value,
      turno: document.getElementById("turno").value,
      desfavorabilidad: document.getElementById("desfavorabilidad").value,
      distrito: document.getElementById("distrito").value,
      tipoOrganizacion: document.getElementById("tipoOrganizacion").value,
      escuela: document.getElementById("escuela").value,
    };

    localStorage.setItem("headerPac", JSON.stringify(datos));
    window.headerPac = datos;

    panel.remove();
    fondo.remove();
    console.log("Guardado en localStorage:", datos);
  };

  document.getElementById("cancelarHeader").onclick = () => {
    if (!window.headerPac) {
      window.location.href =
        "https://adrianbenitezdev.github.io/CREADOR-DE-PAC/error.html"; // Cambiá esto por la URL que quieras
    } else {
      panel.remove();
      fondo.remove();
    }
  };

  document.getElementById("eliminarHeader").onclick = () => {
    try {
      if (window.headerPac) {
        localStorage.removeItem("headerPac");
        panel.remove();
        fondo.remove();
        alert("Se eliminaron los datos de cabecera");
      } else {
        alert("No hay datos para eliminar");
      }
    } catch (error) {
      alert("No se pudo eliminar los datos de cabecera");
      console.error(error);
    }
  };
}

// Llamar a la función principal
buscarHeader();
