function borrar() {
  const input = document.getElementById("inputBuscar");
  input.value = ""; // Borra el contenido del input
  input.focus(); // Opcional: vuelve a enfocar el input
}

function pegar() {
  navigator.clipboard
    .readText()
    .then((texto) => {
      const input = document.getElementById("inputBuscar");
      input.value = texto;
      input.focus(); // Opcional: enfoca después de pegar
    })
    .catch((err) => {
      console.error("Error al pegar desde el portapapeles:", err);
    });
}

function redicInfo() {
  window.location.href =
    "https://adrianbenitezdev.github.io/CREADOR-DE-PAC/error.html"; // Cambiá esto por la URL que quieras
}
