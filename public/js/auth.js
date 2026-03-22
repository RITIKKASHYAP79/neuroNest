

/**** Registration ***/
let resetRegistrationForm = document.getElementById("reset");

let submitRegistrationForm = document.getElementById("submit");

resetRegistrationForm.addEventListener("click",()=>{
    document.querySelectorAll('#registerForm input').forEach(input => input.value = '');

})



