//variable para mostrar la respuesta de los mails
let respuestaObtenida = [];
let containerMailsDecodificados = [];

//import { mostrarFormularioHeader } from "./headerPac";
//let arrayDatosParaPac = [];

function obtenerMails(maxFila) {
  habilitarSpiner();

  // Realizamos la solicitud a la API de Gmail con el token
  const url = `https://creador-de-pac-backend-yqxh.onrender.com/obtenerMails`; // Consulta con asunto "designación"

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maxFila: maxFila,
    }), // Enviar el código de autorización al backend
  })
    .then((response) => response.json()) // Convierte la respuesta a JSON
    .then((data) => {
      console.log("Datos recibidos:", data); // Aquí tendrás los datos del servidor
      procesarRespuesta(data);
      deshabilitarSpiner();
    })
    .catch((error) => {
      console.error("Error al obtener los correos:", error);
      deshabilitarSpiner();
    });
}

function obtenerMailsPersonalizado(maxFila) {
  const datosInput = document.getElementById("inputBuscar").value;

  let datosConsulta = "";

  if (datosInput && /^[a-zA-Z0-9\s]+$/.test(datosInput)) {
    datosConsulta = datosInput;
  } else {
    alert("Los parametros de busqueda no deben contener caracteres especiales");
    return;
  }

  habilitarSpiner();

  // Realizamos la solicitud a la API de Gmail con el token
  const url = `https://creador-de-pac-backend.onrender.com/obtenerMailsPersonalizado`; // Consulta con asunto "designación"

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maxFila: maxFila,
      datosConsulta: datosConsulta,
    }), // Enviar el código de autorización al backend
  })
    .then((response) => response.json()) // Convierte la respuesta a JSON
    .then((data) => {
      console.log("Datos recibidos:", data); // Aquí tendrás los datos del servidor
      procesarRespuesta(data);
      deshabilitarSpiner();
    })
    .catch((error) => {
      console.error("Error al obtener los correos:", error);
      deshabilitarSpiner();
    });
}

function procesarRespuesta(data) {
  respuestaObtenida = [];
  containerMailsDecodificados = [];
  respuestaObtenida = data;
  //renderizamos mails
  const containerMails = document.getElementById("containerMails");

  containerMails.innerHTML = "";

  data.forEach((element, index) => {
    let subject = element.payload.headers.filter(
      (array) => array.name == "Subject"
    );

    containerMails.innerHTML += `
    <div class="row borde mail-card" id="div_${index}">
      <h3 class="mail-index">${index + 1}</h3>
      
      <div class="checkbox-container">
        <input class="casilla" type="checkbox" checked=true id="input_${index}" name="index">
        <label for="input_${index}"></label>
      </div>
  
      <div class="mail-info">
        <p class="mail-subject">${subject[0].value}</p>
      </div>
  
      <div class="mail-actions">
        <button class="btn-dark" onclick="verMail(${index})">Ver</button>
        <button class="btn-dark" onclick="generarPacPuntual(${index})">Generar PAC</button>
      </div>
    </div>
  `;

    //procesamos la respuesta, creamos otra variable que contiene los dato decodigicados
    containerMailsDecodificados.push(obtenerCifrado(index));
  });

  console.log(containerMailsDecodificados);
  //decodificamos respuesta
}

function obtenerCifrado(mails) {
  let retornar = "";
  // Imprimir los objetos en formato JSON

  respuestaObtenida[mails].payload.parts.forEach((miMail) => {
    try {
      if (miMail.parts) {
        console.log("--parts: ");
        console.log(miMail);
        miMail.parts.forEach((miMailParts) => {
          console.log(miMailParts);
          let rr = devolver(
            miMailParts.body.data !== null || undefined
              ? miMailParts.body.data
              : Object.keys(miMailParts.body)[0]
          );
          // console.log("--", rr);
          retornar += rr;
        });
      } else {
        console.log("no entro en partes");
        let rr = devolver(
          miMail.body.data !== null || undefined
            ? miMail.body.data
            : Object.keys(miMail.body)[0]
        );
        // console.log("--", rr);
        retornar += rr;
      }
    } catch {}
  });
  return retornar;
}

function devolver(encodedMessage) {
  try {
    // Reemplazar caracteres no válidos para base64 URL-safe
    encodedMessage = encodedMessage.replace(/-/g, "+").replace(/_/g, "/");

    // Asegúrate de que la longitud de la cadena sea múltiplo de 4 (si no, agrega el relleno necesario '=')
    while (encodedMessage.length % 4 !== 0) {
      encodedMessage += "=";
    }

    // Decodificar la cadena base64
    const decodedMessage = atob(encodedMessage);

    // Decodificar el texto UTF-8 correctamente
    return decodeURIComponent(escape(decodedMessage));
  } catch (e) {
    console.error("Error al decodificar el mensaje: ", e);
    //alert("Hubo un error al decodificar el mensaje.");
  }
}

function verMail(indice) {
  // Crear una ventana emergente con el contenido decodificado
  const popup = window.open(
    "",
    "Mensaje Decodificado",
    "width=600, height=400"
  );
  popup.document.write(
    "<html><head><title>Mensaje Decodificado</title></head><body>"
  );
  popup.document.write("<h2>Mensaje Decodificado:</h2>");
  popup.document.write(
    "<pre>" + containerMailsDecodificados[indice] + "</pre>"
  );
  popup.document.write("</body></html>");
  popup.document.close();
}

function habilitarSpiner() {
  document.getElementById("spiner").style.display = "flex";
}

function deshabilitarSpiner() {
  document.getElementById("spiner").style.display = "none";
}

function generarPacPuntual(index) {
  let headerLocalPac = localStorage.getItem("headerPac");

  if (headerLocalPac) {
    sendMailsPuntual(index);
  } else {
    window.mostrarFormularioHeader();
  }
}

function generarPac() {
  let headerLocalPac = localStorage.getItem("headerPac");

  if (headerLocalPac) {
    sendMails();
  } else {
    window.mostrarFormularioHeader();
  }
}

function sendMailsPuntual(index) {
  let arrayDatosParaPac = [];
  //creamos un objeto que contiene todos los datos para el pac

  let element = containerMailsDecodificados[index];

  let jsonPac = {
    cupof: "",
    dni: "",
    name: "",
    revista: "",
    pid: "",
    mod: "",
    year: "",
    seccion: "",
    turno: "",
    desde: "",
    hasta: "",
  };

  jsonPac.cupof = extraerDeMensaje(element, "CUPOF:");
  let dni = extraerDeMensaje(element, "CUIL/DNI:");
  console.log("---dni: ", dni);
  jsonPac.dni = dni !== null ? (dni.length > 8 ? dni.slice(2, -1) : dni) : null;
  jsonPac.name = extraerDeMensaje(element, "Nombre y Apellido:");
  jsonPac.revista = extraerDeMensaje(element, "Situacion de revista:");
  jsonPac.pid = extraerDeMensaje(element, "PID:");
  jsonPac.mod = extraerDeMensaje(element, "Módulos:");
  let cursoSeccion = extraerDeMensaje(element, "Curso y Sección:");
  jsonPac.year = cursoSeccion !== null ? cursoSeccion[0] : null;
  jsonPac.seccion =
    cursoSeccion !== null
      ? cursoSeccion.length == 3
        ? cursoSeccion[2]
        : cursoSeccion[1]
      : null;
  jsonPac.turno = extraerDeMensaje(element, "Turno:");
  jsonPac.desde = extraerDeMensaje(element, "Desde:");
  jsonPac.hasta = extraerDeMensaje(element, "Hasta:");

  arrayDatosParaPac.push(jsonPac);

  console.log(arrayDatosParaPac);

  mostrarPopupOpciones(arrayDatosParaPac);
}

function sendMails() {
  let arrayDatosParaPac = [];
  //creamos un objeto que contiene todos los datos para el pac

  if (containerMailsDecodificados.length > 0) {
    containerMailsDecodificados.forEach((element, index) => {
      let valueCheckBox = document.getElementById("input_" + index).checked;
      if (valueCheckBox) {
        let jsonPac = {
          cupof: "",
          dni: "",
          name: "",
          revista: "",
          pid: "",
          mod: "",
          year: "",
          seccion: "",
          turno: "",
          desde: "",
          hasta: "",
        };

        jsonPac.cupof = extraerDeMensaje(element, "CUPOF:");
        let dni = extraerDeMensaje(element, "CUIL/DNI:");
        jsonPac.dni = dni.slice(2, -1);
        jsonPac.name = extraerDeMensaje(element, "Nombre y Apellido:");
        jsonPac.revista = extraerDeMensaje(element, "Situacion de revista:");
        jsonPac.pid = extraerDeMensaje(element, "PID:");
        jsonPac.mod = extraerDeMensaje(element, "Módulos:");
        let cursoSeccion = extraerDeMensaje(element, "Curso y Sección:");
        jsonPac.year = cursoSeccion[0];
        jsonPac.seccion =
          cursoSeccion.length == 3 ? cursoSeccion[2] : cursoSeccion[1];
        jsonPac.turno = extraerDeMensaje(element, "Turno:");
        jsonPac.desde = extraerDeMensaje(element, "Desde:");
        jsonPac.hasta = extraerDeMensaje(element, "Hasta:");

        arrayDatosParaPac.push(jsonPac);
      }
    });
    console.log(arrayDatosParaPac);

    mostrarPopupOpciones(arrayDatosParaPac);

    console.log("Listo para enviar al backend");
  } else {
    alert("Debe traer los datos para comenzar");
  }
}

function mostrarPopupOpciones(arrayDatosParaPac) {
  // Fondo oscuro
  const fondo = document.createElement("div");
  fondo.style.position = "fixed";
  fondo.style.top = "0";
  fondo.style.left = "0";
  fondo.style.width = "100vw";
  fondo.style.height = "100vh";
  fondo.style.backgroundColor = "rgba(0,0,0,0.5)";
  fondo.style.zIndex = 999;
  document.body.appendChild(fondo);

  // Ventana emergente
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "#fff";
  popup.style.padding = "20px";
  popup.style.borderRadius = "10px";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  popup.style.zIndex = 1000;
  popup.style.textAlign = "center";
  popup.style.minWidth = "280px";

  popup.innerHTML = `
    <h3>¿Qué desea hacer?</h3>
    <button id="btnDescargar" style="margin: 10px; padding: 8px 16px;">Descargar</button>
    <button id="btnVer" style="margin: 10px; padding: 8px 16px;">Ver</button>
    <button id="btnVolver" style="margin: 10px; padding: 8px 16px;">Volver</button>
    
  `;

  document.body.appendChild(popup);

  // Eventos
  document.getElementById("btnDescargar").onclick = () => {
    dowload(arrayDatosParaPac);
    cerrarPopup();
  };

  document.getElementById("btnVer").onclick = () => {
    verPac(arrayDatosParaPac);
    cerrarPopup();
  };

  document.getElementById("btnVolver").onclick = () => {
    cerrarPopup();
  };

  function cerrarPopup() {
    popup.remove();
    fondo.remove();
  }
}

function dowload(arrayDatosParaPac) {
  let headerPacEnviar = localStorage.getItem("headerPac");
  habilitarSpiner();
  const url = `https://creador-de-pac-backend.onrender.com/generarPac`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      objeto: arrayDatosParaPac,
      headerPac: headerPacEnviar,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }
      return response.blob(); // Convertimos a blob porque es un archivo binario
    })
    .then((blob) => {
      // Crear un link temporal para descargar el archivo
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "plantilla-modificada.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      deshabilitarSpiner();
    })
    .catch((error) => {
      console.error("Hubo un problema con la descarga:", error);
      deshabilitarSpiner();
      alert("Hubo un error al descargar el archivo");
    });
}
function verPac(arrayDatosParaPac) {
  const url = "https://creador-de-pac-backend.onrender.com/ver";

  let headerPacEnviar = localStorage.getItem("headerPac");

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      objeto: arrayDatosParaPac,
      headerPac: headerPacEnviar,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar vista previa");
      }
      return response.text(); // HTML desde el backend
    })
    .then((html) => {
      const popup = window.open(
        "",
        "Planilla Adicional Contralor",
        "width=900,height=700"
      );
      popup.document.open(); // importante en algunos navegadores
      popup.document.write(html); // 💡 insertamos el HTML completo directamente
      popup.document.close();
    })
    .catch((error) => {
      console.error("Error mostrando la vista previa:", error);
      alert("No se pudo mostrar la vista previa");
    });
}

function extraerDeMensaje(mensaje, despuesDe) {
  try {
    console.log(despuesDe);
    const index = mensaje.indexOf(despuesDe);
    if (index === -1) return null;

    const inicio = index + despuesDe.length;
    const resto = mensaje.slice(inicio);
    const finDeLinea = resto.indexOf("\n");

    if (finDeLinea === -1) return resto.trim(); // Si no hay salto, devuelve todo
    return resto.slice(0, finDeLinea).trim(); // Hasta el primer salto de línea
  } catch (error) {
    console.log("Error al extraer: ", despuesDe);
  }
}

console.log("versión 37");

function reiniciar() {
  document.getElementById("containerMails").innerHTML = "";

  containerMailsDecodificados = [];
  respuestaObtenida = [];
  arrayDatosParaPac = [];
}
