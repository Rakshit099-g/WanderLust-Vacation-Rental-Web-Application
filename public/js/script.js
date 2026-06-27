// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


setTimeout(() => {
    const alert = document.querySelector(".auto-dismiss");

    if (alert) {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
        bsAlert.close();
    }
}, 1000);

//for future if we have multiple alerts
// setTimeout(() => {
//     const alerts = document.querySelectorAll(".auto-dismiss");

//     alerts.forEach((alert) => {
//         const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
//         bsAlert.close();
//     });
// }, 3000); // 3 seconds