// On récupere l'id dans l'url
const queryString = window.location.search;    
    const urlParams = new URLSearchParams(queryString);
let productId = urlParams.get('id')
console.log("product Id")
console.log(productId)

let product = [];
// Fonction d'initialisation qui se lancera à chaque ouverture de la page (voir ligne 38)
// Asynchrone, pour aller chercher dans l'API + mot clef await
async function init() {
  
// Attend le retour de user avant de buildProduct
  product = await getProduct();
  console.log(product);
 
  buildProduct(product);

  if (product.length > 0) {
    console.log(product);
  }

  else if (product.length <= 0) {   
      // document.createElement("div").innerHTML = "Désolé il n'y a plus de produits";
  }
}

function getProduct() {
    return (
      fetch(`http://localhost:3000/api/products/${productId}`)
        .then((res) => res.json())
  
        .then((product) => {
          return product;    
      })
        // Gestion d'erreur IMPORTANT
        .catch((error) => {
          // Si erreur dans URL, retourne l'erreur pour pas bloquer la création de la page
              alert("Nous n'avons pas réussi à afficher nos canapés. Avez vous bien lancé le serveur local (Port 3000) ? Si le problème persiste prenons contact");
              return error;
      })    
    ); 
  }

function buildProduct(product) {
// Image
let productImg = document.createElement("img");
document.querySelector(".item__img").appendChild(productImg);
productImg.src = product.imageUrl;
productImg.alt = product.altTxt;

// Nom
let productName = document.getElementById('title');
productName.innerHTML = product.name;

// Description
let productDescription = document.getElementById("description");
productDescription.innerHTML = product.description;

// Prix
let productPrice = document.getElementById("price");
productPrice.innerHTML = `${product.price}€`;

// Colors
let select = document.getElementById("colors");
// Pour chaque couleur, crée une option et met la dans le select
product.colors.forEach((color) => {
  let option = document.createElement("option");
  option.value = color;
  option.innerHTML = color;
  select.appendChild(option);
});

}
//Lancement du site, on fait tout
init();