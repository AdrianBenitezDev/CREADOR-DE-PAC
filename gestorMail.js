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
    //containerMailsDecodificados.push(obtenerCifrado(index));
  });

  console.log(containerMailsDecodificados);
  //decodificamos respuesta
}

function obtenerCifrado(mails) {
  let retornar = "";
  // Imprimir los objetos en formato JSON
  respuestaObtenida[mails].payload.parts.forEach((miMail) => {
    try {
      let rr = devolver(miMail.body.data);
      console.log("--", rr);
      retornar += rr;
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
    alert("Hubo un error al decodificar el mensaje.");
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

function obtenerDatosParaPAC(index) {}

function sendAllMails() {
  if (containerMailsDecodificados.length > 0) {
    containerMailsDecodificados.forEach((element) => {});
  }
}

//obtenerMails();
