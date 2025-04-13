function buscarHeader() {
  let headerLocalPac = localStorage.getItem("headerPac");

  if (headerLocalPac) {
    window.headerPac = JSON.parse(headerLocalPac);
    console.log("Datos cargados:", window.headerPac);
  } else {
    mostrarFormularioHeader();
  }
}

function editarCabeceraPac() {
  mostrarFormularioHeader();
}

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

  panel.innerHTML = `
      <h3>Datos de la escuela</h3>
      <label>Domicilio:<input id="domicilio" /></label><br>
      <label>Teléfono:<input id="telefono" /></label><br>
      <label>Email:<input id="email" /></label><br>
      <label>Categoría:
        <select id="categoria">
          <option>1ra</option><option>2da</option><option>3ra</option>
        </select>
      </label><br>
      <label>Turno:
        <select id="turno">
          <option>M</option><option>T</option><option>V</option>
        </select>
      </label><br>
      <label>Desfavorabilidad:
        <select id="desfavorabilidad">
          <option>1°</option><option>2°</option><option>3°</option><option>4°</option><option>5°</option>
        </select>
      </label><br>
      <label>Distrito:<input id="distrito" /></label><br>
      <label>Tipo de organización:<input id="tipoOrganizacion" /></label><br><br>
      <button id="guardarHeader" style="background:green;color:white;padding:6px 12px;border:none;border-radius:5px;">Guardar</button>
      <button id="cancelarHeader" style="background:red;color:white;padding:6px 12px;border:none;border-radius:5px;margin-left:10px;">Cancelar</button>
    `;

  document.body.appendChild(panel);

  try {
    let datosInicio = localStorage.getItem("headerPac");

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
  } catch {}

  // Eventos
  document.getElementById("guardarHeader").onclick = () => {
    const datos = {
      domicilio: document.getElementById("domicilio").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value,
      categoria: document.getElementById("categoria").value,
      turno: document.getElementById("turno").value,
      desfavorabilidad: document.getElementById("desfavorabilidad").value,
      distrito: document.getElementById("distrito").value,
      tipoOrganizacion: document.getElementById("tipoOrganizacion").value,
    };

    localStorage.setItem("headerPac", JSON.stringify(datos));
    window.headerPac = datos;

    panel.remove();
    fondo.remove();
    console.log("Guardado en localStorage:", datos);
  };

  document.getElementById("cancelarHeader").onclick = () => {
    window.location.href = "https://ejemplo.com"; // Cambiá esto por la URL que quieras
  };
}

// Llamar a la función principal
buscarHeader();
