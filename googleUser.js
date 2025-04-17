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
