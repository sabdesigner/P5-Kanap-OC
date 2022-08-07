//import { panier } from "./basket.js";

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

  /*Fonction de type Callback*/
  document.getElementById("addToCart").addEventListener ('click', function(e){
    e.preventDefault();
    console.log("Click");
    checkProduct()      
  });

/*   if (product.length > 0) {
    console.log(product);
  }

  else if (product.length <= 0) {   
      // document.createElement("div").innerHTML = "Désolé il n'y a plus de produits";
  } */
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

function checkProduct(){
  console.log(product)
  let quantity = document.getElementById("quantity").value;
  let color = document.getElementById("colors").value;
  
  //conditions de validation du bouton ajouter au panier
  if (        
    quantity < 1 || quantity > 100) {    
    console.log("pas bon qty")
  } 
  
  if (color === ""){
    console.log("pas de couleur selectionnée");
  }
  
  if(quantity < 100 && quantity >= 1 && color != "") {
      console.log("ok")
      //panier()
  }

}


/* function panier(){
  si LS vide => 
  productLS.push{
    id: id,
    color: color;
    qty: qty  
  }
} */

//Lancement du site, on fait tout
init();


