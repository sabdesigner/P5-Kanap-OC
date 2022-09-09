// Variable pour stocker les Id de chaque article présent dans le panier (utilisés pour créer la commande)
let products = [];

// Fonction d'initialisation qui se lancera à chaque ouverture de la page 
// Asynchrone, pour aller chercher dans l'API + mot clef await
async function init() {
  // Attend le retour de user avant de buildHTML
  products = await getProducts();
  if (products.length > 0) {
    buildHTML(products);
  } else if (products.length <= 0) {
   document.createElement("div");
   document.innerHTML = "Désolé il n'y a plus de produits";}
}
// Création de la fonction getProduct et récupération des infos à afficher via l'api
function getProducts() {
  return (
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((products) => {
        return products;
      })
      // Gestion d'erreur IMPORTANT
      .catch((error) => {
        // Si erreur dans URL, retourne l'erreur pour pas bloquer la création de la page
        alert(
          "Nous n'avons pas réussi à afficher nos canapés. Avez vous bien lancé le serveur local (Port 3000) ? Si le problème persiste prenons contact"
        );
        return error;
      })
  );
}
// Création du contenu  
function buildHTML() {
  const items = document.getElementById("items");

  for (let product of products) {
    let link = document.createElement("a");
    link.href = `./product.html?id=${product._id}`;

    items.appendChild(link);

    let article = document.createElement("article");
    link.appendChild(article);

    let image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = product.altTxt;

    article.appendChild(image);

    let name = document.createElement("h3");
    name.textContent = product.name;
    article.appendChild(name);

    let description = document.createElement("p");
    description.textContent = product.description;
    article.appendChild(description);
  }
}

//Lancement du site
init();
