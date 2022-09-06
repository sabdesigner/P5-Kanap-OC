//Creation
let element = document.createElement("div");
element.innerHTML = "";
let elementQuantity = document.getElementById("quantity");
elementQuantity.after(element);
let elt = document.createElement("div");
let eltColor = document.getElementById("colors");
eltColor.after(elt);

// On récupere l'id dans l'url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let productId = urlParams.get("id");
console.log("product Id");
console.log(productId);

let product = [];
// Fonction d'initialisation qui se lancera à chaque ouverture de la page (voir ligne 38)
// Asynchrone, pour aller chercher dans l'API + mot clef await
async function init() {
  // Attend le retour de user avant de buildProduct
  product = await getProduct();
  console.log(product);

  buildProduct(product);

  // Fonction de type Callback
  document.getElementById("addToCart").addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Click");
    checkProduct();
  });

  if (product.length > 0) {
    console.log(product);
  } else if (product.length <= 0) {
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
        alert(
          "Nous n'avons pas réussi à afficher nos canapés. Avez vous bien lancé le serveur local (Port 3000) ? Si le problème persiste prenons contact"
        );

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
  let productName = document.getElementById("title");
  productName.innerHTML = product.name;

  // Description
  let productDescription = document.getElementById("description");
  productDescription.innerHTML = product.description;

  // Prix
  let productPrice = document.getElementById("price");
  productPrice.innerHTML = `${product.price}`;

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

let productLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];

function checkProduct() {
  console.log(product);
  element.innerHTML = "";
  elt.innerHTML = "";
  let quantity = document.getElementById("quantity").value;
  let color = document.getElementById("colors").value;

  //conditions de validation du bouton ajouter au panier
  if (quantity < 1 || quantity > 100) {
    console.log("pas bon qty");
    element.innerHTML = "Veuillez sélectionner le nombre d'articles souhaités";
    /*confirm("Veuillez sélectionner le nombre d'articles souhaités");*/
  }

  if (color === "") {
    console.log("pas de couleur selectionnée");
    elt.innerHTML = "Veuillez sélectionner une couleur";

    /*confirm("Veuillez sélectionner une couleur");*/
  }

  if (quantity < 100 && quantity >= 1 && color != "") {
    console.log("ok");
    alert("Votre article a bien été ajouté au panier");

    // Récupération des informations du produit sélectionné
    let optionsProduct = {
      id: productId,
      color: color,
      quantity: parseInt(quantity),
    };

    console.log(optionsProduct);

    //Initialisation du local storage
    let productLocalStorage = JSON.parse(localStorage.getItem("product"));

    //Fenetre de confirmation
    /*const popupConf =() =>{ 
if (confirm(`Votre commande de ${quantity} ${name} ${color} est ajoutée au panier
Pour consulter votre panier, cliquez sur OK`)){
            window.location.href ="cart.html";

  }   
}*/
    //Si le panier comporte déjà au moins 1 article
    if (productLocalStorage) {
      const resultFind = productLocalStorage.find(
        (e) => e.id === productId && e.color === color
      );

      //Si le produit est déjà dans le panier
      if (resultFind) {
        let newQuantity =
          parseInt(optionsProduct.quantity) + parseInt(resultFind.quantity);
        resultFind.quantity = newQuantity;
        localStorage.setItem("product", JSON.stringify(productLocalStorage));
        console.table(productLocalStorage);

        //Si le produit n'est pas dans le panier
      } else {
        productLocalStorage.push(optionsProduct);
        localStorage.setItem("product", JSON.stringify(productLocalStorage));
        console.table(productLocalStorage);
      }
      //Si le panier est vide
    } else {
      productLocalStorage = [];
      productLocalStorage.push(optionsProduct);
      localStorage.setItem("product", JSON.stringify(productLocalStorage));
      console.table(productLocalStorage);
    }
  }
}
//Lancement du site, on fait tout
init();
