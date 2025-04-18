function iniciarLogin() {
  const clientId =
    "45594330364-68qsjfc7lo95iq95fvam08hb55oktu4c.apps.googleusercontent.com";
  const redirectUri =
    "https://creador-de-pac-backend.onrender.com/oauth2callback";
  const scope = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  window.open(authUrl, "_blank", "width=500,height=600");
}

window.addEventListener("message", (event) => {
  if (event.origin !== "https://creador-de-pac-backend.onrender.com") return;

  const { token, profile } = event.data;

  console.log("Token recibido:", token);
  console.log("Perfil:", profile);

  // Guardar o usar los datos como desees
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(profile));
});

function obtenerIdUsuario() {
  let user_google = localStorage.getItem("user");

  if (user_google) {
    let user_google_json = JSON.parse(user_google);
    console.log(user_google_json);
    const { name, picture } = user_google_json;

    document.getElementById("profile-info").innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
        <img src="${picture}" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin-bottom: 10px;">
        <div style="font-size: 1.2rem; font-weight: bold;">${name}</div>
      </div>
    `;
    document.getElementById("containerApp").style.display = "flex";
  } else {
    document.getElementById("profile-info").innerHTML = `
      <div id="google-signin-btn" style="text-align: center; padding: 20px;">
      <img src="https://www.svgrepo.com/show/382106/user-circle.svg" 
     alt="Usuario no identificado" 
     style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin-bottom: 10px; background-color: #f0f0f0; padding: 10px;">

        <button onclick="iniciarLogin()" style="padding: 10px 20px; font-size: 1rem;">Acceder</button>
      </div>
    `;
    document.getElementById("containerApp").style.display = "hiden";
  }
}

function salir() {
  let respuesta = confirm("Deseas Eliminar todos los datos de la Sesion?");
  if (respuesta) {
    localStorage.removeItem("user");
    document.getElementById("containerApp").style.display = "hiden";
    obtenerIdUsuario();
    alert("los datos de sesion fueron borrados correctamente");
  } else {
  }
}

obtenerIdUsuario();
