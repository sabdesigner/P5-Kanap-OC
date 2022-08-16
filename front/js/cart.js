let productListFiltred = [];
let elementQuantity = document.getElementById("cart__items");

//  Cette fonction fait GetLocalStorage et retourne les données
function getCart(){

//Initialisation du local storage
    let LocalStorage = JSON.parse(localStorage.getItem("product")) || [];
    console.table(LocalStorage);

    if (LocalStorage === null || LocalStorage === 0 || LocalStorage === [] || LocalStorage.length === 0) {
        let element = document.createElement("div");
        element.innerHTML = "Votre panier est vide";
        elementQuantity.appendChild(element);
        
    console.log("Panier vide");
    return LocalStorage

    }
        else (LocalStorage !== null || LocalStorage !== 0); {   
        console.log("Des produits sont dans le panier");
        return LocalStorage
    }    
}
let productLocalStorage = getCart();

// Récupération des infos à afficher via l'api
fetch(`http://localhost:3000/api/products/`)
.then(function (res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function (produitsAPI) {
    console.log("produits du LS",productLocalStorage)
    // Tableau vide qui contiendra les données du LS (qty, color) et les données de l'api (id, name, price, color, imageUrl)
    let panierComplet = []
 
    // Pour chaque produit existant dans l'API
    produitsAPI.map(productAPI => {
        // Et pour chaque produit existant dans le LS
        productLocalStorage.map(itemLS => {
            // on regarde si l'ID correspond entre les deux
            if (productAPI._id === itemLS.id) {
                // Si oui, le produit est trouvé et ajouté dans le panierComplet (ou on pourra trouver toutes les infos nécéssaire à l'utilisateur)
                panierComplet.push({
                    id: productAPI._id,
                    name: productAPI.name,
                    price: productAPI.price,
                    color: itemLS.color,
                    quantity: itemLS.quantity,
                    imageUrl: productAPI.imageUrl
                })
            }
        }
        )
    })

    // le panierComplet est rempli
    console.log("panierComplet", panierComplet)
    
    // Créer les bloc HTML
    createProducts(panierComplet);
     
    }
)

function createProducts(productList) {
// Si le panier est vide
for (let product of productList) {
    
//creation de l'article
elementQuantity.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="Photographie d'un canapé ${product.name}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                            <h2>${product.name}</h2>
                            <p>${product.price} €</p>
                            <p>${product.color}</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem" id="[item_Id]">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`

}
}
// Modifier la quantité 
/*function changeQuantity(product, quantity){
    let panierComplet = getProducts ();
    let foundProduct = panierComplet.find(p => p.id == product.id);
    if (foundProduct !=undefined){  
    foundProduct.quantity += quantity;
    if (foundProduct.quantity <= 0){
        removeProducts(product);
      } else {
        saveProducts(panierComplet);
    }
    }
}
// calculer la quantité : à partir du panier recuperer la quantité 
function getNumberProducts() {
    let panierComplet = getProducts ();
    let number = 0;
    for (let product of panierComplet){
        number += product.quantity;   
    } 
    return number;
} 

// calculer le prix : à partir du panier recuperer le prix
function getNumberPrice() {
let panierComplet = getProducts ();
let total = 0;
for (let product of panierComplet){
    total += product.quantity * product.price;   
} 
return total;
} */

function changeQuantity() {
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    for (let q = 0; q < itemQuantity.length; q++) {
        itemQuantity[q].addEventListener('change', (event) => {
      event.preventDefault();
      //on ajoute la nouvelle quantité avec les autres éléments 
      let itemNewQuantity = itemQuantity[q].value;
      const newPannierComplet = {
      id: productAPI[q]._id,
      name: productAPI[q].name,
      price: productAPI[q].price,
      color: itemLS[q].color,
      quantity: itemNewQuantity,
      imageUrl: productAPI[q].imageUrl
    };
    // On actualise
    PannierComplet[q]= newPannierComplet;
    alert('Votre panier est à jour.');
    
    //idem principe pour delete avec id et la couleur séléctionnés par le bouton supprimer
})
}
changeQuantity();
} 

/*quantityTotal();
document.querySelectorAll(".itemQuantity").forEach(quantityButton => {
    quantityButton.addEventListener("change", (e) => {
        pannierComplet.changeQuantity({
            quantity: parseInt(e.target.value),
            color: e.target.closest(".cart__item").product.color,
            _id: e.target.closest(".cart__item").product.id
        });
        if (parseInt(e.target.value) == 0) {
            e.target.closest(".cart__item").remove();
    }  })
});
quantityTotal();*/


/* Pour chaque produit du LS, aller chercher les infos complémentaire 
via un fetch (/products/id) 
et recréer un produit complet avec les infos utilisateurs + les infos BDD
Puis pour chaque produit du panierComplet, créer le template HTML avec les bonnes variables
Créer une fonction de calcul du prix total
Créer une fonction de calcul de la quantité totale
Créer les évent pour supprimer un produit 
(guide des étapes clées - e.target.closest) */