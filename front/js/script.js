
let products = [];

// Fonction d'initialisation qui se lancera à chaque ouverture de la page (voir ligne 38)
// Asynchrone, pour aller chercher dans l'API + mot clef await
async function init() {
  
// Attend le retour de user avant de buildHTML
  products = await getProducts();
  console.log(products);

  if (products.length > 0) {
    console.log(products);
    // deepcode ignore WrongNumberOfArguments: <please specify a reason of ignoring this>
    buildHTML(products);
  }

  else if (products.length <= 0) {   
      // document.createElement("div").innerHTML = "Désolé il n'y a plus de produits";
  }
}

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
            alert("Nous n'avons pas réussi à afficher nos canapés. Avez vous bien lancé le serveur local (Port 3000) ? Si le problème persiste prenons contact");
            return error;
    })    
  );
}

function buildHTML() {

  const items = document.getElementById("items");
    
  for (let product of products) {
    
      let link = document.createElement("a");
      link.href = `./product.html?id=${product._id}`

      items.appendChild(link)

      let article = document.createElement("article");
      link.appendChild(article);

      let image = document.createElement("img");
      image.src = product.imageUrl;
      image.alt = product.altTxt;

      article.appendChild(image);

      let name = document.createElement ("h3");
      name.textContent = product.name;
      article.appendChild(name);

      let description = document.createElement ("p");
      description.textContent= product.description;
      article.appendChild(description);


    }
    
  }
//Lancement du site, on fait tout
init();