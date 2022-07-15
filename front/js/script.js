
let product = [];

// Fonction d'initialisation qui se lancera à chaque ouverture de la page (voir ligne 38)
// Asynchrone, pour aller chercher dans l'API + mot clef await
async function init() {
// Attend le retour de user avant de buildHTML
  product = await getProduct();
  console.log(product);
  buildHTML(product);
}

function getProduct() {
  return (
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())

      .then((products) => {
//creation d'une boucle pour afficher les produits
        for (let product of products) {
//changer pour une autre methode
//Injection des données des produits dans la page HTML
    items.innerHTML += `<a href="./product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
    </a>`;
    }
    
    })
      .then((objetProduits) => {
        console.table(objetProduits);
      })
         // Gestion d'erreur IMPORTANT
      .catch((error) => {
        // Si erreur dans URL, retourne l'erreur pour pas bloquer la création de la page
            alert("Le serveur ne répond pas")
            return error;
    })    
  );
}

function buildHTML(product) {
    // On récupère l'élément items pour y injecter les produits
    const items = document.getElementById("items");
    }
    

//Lancement du site, on fait tout
init();
