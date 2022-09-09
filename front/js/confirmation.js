//Recuperation du lien dans la barre d'adresse 
let url = new URL(window.location.href); 
// et de l'oderID de l'url
let orderId = url.searchParams.get("orderId"); 
// intégration de l'oderId dans l'html
let confirmOrderId = document.getElementById('orderId');
confirmOrderId.innerHTML = orderId; 
