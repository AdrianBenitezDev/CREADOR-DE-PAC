function iniciarLogin() {
  const clientId =
    "45594330364-68qsjfc7lo95iq95fvam08hb55oktu4c.apps.googleusercontent.com";
  const redirectUri =
    "https://creador-de-pac-backend.onrender.com/oauth2callback";
  const scope = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  window.open(authUrl, "_blank", "width=500,height=600");
}

//&prompt=consent

window.addEventListener("message", (event) => {
  if (event.origin !== "https://creador-de-pac-backend.onrender.com") return;

  const { token, profile } = event.data;

  console.log("Token recibido:", token);
  console.log("Perfil:", profile);

  // Guardar o usar los datos como desees
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(profile));

  obtenerIdUsuario();
});

function obtenerIdUsuario() {
  let user_google = localStorage.getItem("user");

  if (user_google) {
    let user_google_json = JSON.parse(user_google);
    console.log(user_google_json);
    const { name, picture, email, sub } = user_google_json;

    document.getElementById("profile-info").innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <img src="${picture}" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin-bottom: 10px;">
        <div style="font-size: 1.2rem; font-weight: bold;">${name}</div>
        <div style="font-size: 0.9rem; color:gray;">${email}</div>
         <button id="btnMostrarHeader">Editar Cabecera del PAC</button>
         <button onclick="salir()">Salir</button>
      </div>
    `;

    obtenerTokensGlobales(sub);
  } else {
    document.getElementById("profile-info").innerHTML = `
      <div class="column" id="google-signin-btn" style="text-align: center; padding: 20px;">
      <img src="user.jpeg" 
     alt="Usuario no identificado" 
     style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin-bottom: 10px; background-color: #f0f0f0; padding: 10px;">

        <button onclick="iniciarLogin()" style="padding: 10px 20px; font-size: 1rem;">Acceder</button>
      </div>
    `;
    setearContainerApp("none");
  }
}

function salir() {
  let respuesta = confirm("Deseas Eliminar todos los datos de la Sesion?");
  if (respuesta) {
    localStorage.removeItem("user");

    obtenerIdUsuario();
    alert("los datos de sesion fueron borrados correctamente");
  } else {
  }
}

obtenerIdUsuario();

setearContainerApp("flex");

function setearContainerApp(valor) {
  let arrayContainer = document.querySelectorAll("#containerApp");

  arrayContainer.forEach((element) => {
    element.style.display = valor;
  });
}

function obtenerTokensGlobales(sub) {
  const url = `https://creador-de-pac-backend.onrender.com/obtenerVariablesGlobales`; // Consulta con asunto "designación"

  //let user = JSON.parse(localStorage.getItem("user"));

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_google_id: sub,
    }), // Enviar el código de autorización al backend
  })
    .then((response) => response.json()) // Convierte la respuesta a JSON
    .then((data) => {
      console.log("Variables Globales Desplegadas para:", data.nombre); // Aquí tendrás los datos del servidor
      setearContainerApp("flex");
    })
    .catch((error) => {
      console.error("Error al obtener los correos:", error);
    });
}
