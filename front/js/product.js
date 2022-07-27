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
  
// Attend le retour de user avant de buildHTML
  product = await getProduct();
  console.log(product);

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


//Lancement du site, on fait tout
init();




