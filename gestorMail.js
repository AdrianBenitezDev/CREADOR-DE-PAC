//variable para mostrar la respuesta de los mails
let respuestaObtenida = [];
let containerMailsDecodificados = [];
let arrayDatosParaPac = [];

function obtenerTokenYAlmacenar() {
  // Si no existe el token, obtenerlo de la URL (esto debe adaptarse a tu caso)
  const urlParams = new URLSearchParams(window.location.search);
  token = urlParams.get("tok");

  return token;
}

function obtenerMails() {
  const token = obtenerTokenYAlmacenar();
  console.log(token);

  if (!token) {
    console.log("No se pudo obtener un token.");
    return;
  }

  habilitarSpiner();

  // Realizamos la solicitud a la API de Gmail con el token
  const url = `https://creador-de-pac-backend.onrender.com/obtenerMails`; // Consulta con asunto "designación"

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }), // Enviar el código de autorización al backend
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
  respuestaObtenida = data;
  //renderizamos mails
  const containerMails = document.getElementById("containerMails");

  containerMails.innerHTML = "";

  data.forEach((element, index) => {
    let subject = element.payload.headers.filter(
      (array) => array.name == "Subject"
    );

    containerMails.innerHTML += `<div id="div_${index}" class="row"> <h3>${
      index + 1
    }</h3> <input class="casilla" type="checkbox" id="input_${index}" name="index"> <p>${
      subject[0].value
    }</p><button onclick="verMail(${index})">Ver</button><button onclick="obtenerDatosParaPAC(${index})">Generar Pac</button></div>`;

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

function obtenerDatosParaPAC(index) {
  containerMailsDecodificados[index];
}

function sendAllMails() {
  console.log("sendAllMails");
  //creamos un objeto que contiene todos los datos para el pac

  if (containerMailsDecodificados.length > 0) {
    containerMailsDecodificados.forEach((element, index) => {
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
    });
    console.log(arrayDatosParaPac);
    console.log("Listo para enviar al backend");
  }
}

//obtenerMails();
function dowload() {
  habilitarSpiner();
  const url = `https://creador-de-pac-backend.onrender.com/generarPac`;

  fetch(url, {
    method: "POST",
    body: arrayDatosParaPac,
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

function verPac() {
  const url = "https://creador-de-pac-backend.onrender.com/ver";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar vista previa");
      }
      return response.text(); // Es HTML, no JSON
    })
    .then((html) => {
      // Insertamos el HTML recibido dentro de algún contenedor de tu página
      //document.getElementById("vista-previa").innerHTML = html;

      const popup = window.open(
        "",
        "Planilla Adicional Contralor",
        "width=600, height=400"
      );
      popup.document.write(
        "<html><head><title>Planilla Adicional Contralor</title></head><body>"
      );
      //aderimos html
      popup.document.write("<pre>" + html + "</pre>");
      popup.document.write("</body></html>");
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

console.log("coent 6");
