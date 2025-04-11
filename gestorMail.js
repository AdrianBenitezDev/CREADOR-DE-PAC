//variable para mostrar la respuesta de los mails
let respuestaObtenida = [];

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
    })
    .catch((error) => {
      console.error("Error al obtener los correos:", error);
    });
}

function procesarRespuesta(data) {
  respuestaObtenida = data;
  //renderizamos mails
  const containerMails = document.getElementById("containerMails");

  data.forEach((element, index) => {
    let snippet = element.snippet.payload.headers[25].value;
    containerMails.innerHTML += `<div><p>${snippet}</p><button onclick="obtenerCifrado(${index})">Ver</button></div>`;
  });
  //decodificamos respuesta
}

function obtenerCifrado(mails) {
  // Imprimir los objetos en formato JSON
  respuestaObtenida[mails].payload.parts.forEach((miMail) => {
    try {
      verMail(miMail.body.data);
    } catch {}
  });
}

function verMail(encodedMessage) {
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
    const decodedMessageCorrected = decodeURIComponent(escape(decodedMessage));

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
    popup.document.write("<pre>" + decodedMessageCorrected + "</pre>");
    popup.document.write("</body></html>");
    popup.document.close();
  } catch (e) {
    console.error("Error al decodificar el mensaje: ", e);
    alert("Hubo un error al decodificar el mensaje.");
  }
}

obtenerMails();
