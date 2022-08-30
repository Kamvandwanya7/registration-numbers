// document.addEventListener('DOMContentLoaded', function () {
//     let errorMessageElem = document.querySelector('.error');
//     let successMessage = document.querySelector('.success');
    
//     if (errorMessageElem.innerHTML !== '' || successMessage.innerHTML !== '')  {

//         setTimeout(function () {
            
//             errorMessageElem.innerHTML = '';
//             successMessage.innerHTML = '';

//         }, 2000);
//     }
// });

setTimeout(function () {
    document.querySelector(".error").innerHTML = ''
    document.querySelector(".success").innerHTML = ''
},
3000);