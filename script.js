function autenticar() {
  const clientId =
    "45594330364-68qsjfc7lo95iq95fvam08hb55oktu4c.apps.googleusercontent.com";
  const redirectUri = "http://localhost:3000/oauth2callback"; // Asegúrate de que esta URI esté configurada correctamente en la consola de Google Cloud

  // Codificar la redirectUri para asegurar que no haya caracteres especiales
  const encodedRedirectUri = encodeURIComponent(redirectUri);

  // Generar la URL de autorización con el scope correcto para acceder a los correos de Gmail
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&` + // Scope de Gmail codificado
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodedRedirectUri}&` + // URI codificada
    `access_type=offline`; // Si necesitas el refresh_token, usa "offline"

  // Redirigir al usuario a Google para autorización
  window.location.href = authUrl;
}
