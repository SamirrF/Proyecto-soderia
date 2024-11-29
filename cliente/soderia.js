function animation(){
    let timerInterval;
Swal.fire({
  title: "Auto close alert!",
  html: "I will close in <b></b> milliseconds.",
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading();
    const timer = Swal.getPopup().querySelector("b");
    timerInterval = setInterval(() => {
      timer.textContent = `${Swal.getTimerLeft()}`;
    }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log("I was closed by the timer");
  }
});
}

//modalesss
// document.querySelectorAll('.btn-detalle').forEach(button => {
//   button.addEventListener('click', function() {
//       const pedidoId = this.getAttribute('data-id');
      
//       // Encuentra el modal correspondiente por su data-id
//       const modal = document.querySelector(`.pedido-modal[data-id="${pedidoId}"]`);
      
//       if (modal) {
//           // Inicializa el modal usando Bootstrap
//           const bootstrapModal = new bootstrap.Modal(modal);
//           bootstrapModal.show();
//       }
//   });
// });


