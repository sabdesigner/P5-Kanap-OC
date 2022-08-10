//Initialisation du local storage
let productLocalStorage = JSON.parse(localStorage.getItem("product")) || [];
console.table(productLocalStorage);
const positionEmptyCart = document.querySelector("cart__items");

let productListFiltred = [];

//
function getCart(){
    if (productLocalStorage === null || productLocalStorage === 0) {
    positionEmptyCart.innerHTML = emptyCart;
    positionEmptyCart.textContent = "Votre panier est vide";
    console.log("Panier vide");

}
    else (productLocalStorage !== null || productLocalStorage !== 0); {   
    console.log("Des produits sont dans le panier");
}    

// Récupération des infos à afficher via l'api
fetch(`http://localhost:3000/api/products/`)
.then(function (res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function (listProduct) {

  let list = listProduct;
  if (productLocalStorage && productLocalStorage.length) {
    let itemCart = productLocalStorage.map(product => product.id);
    // Recupérartion des ID du local Storage

    productListFiltred = list.filter(e => itemCart.includes(e._id));
    
    //Filtrer les produit de l'api en fonction de ceux present dans le LS
    getProducts(productListFiltred);
}
} 
)} 
getCart();
function getProducts(productList) {
// Si le panier est vide
// On crée les éléments manquants dans le LS
for (let product in productLocalStorage) {
    const currentProduct = productList.find(p => p._id === productLocalStorage[product].id);

   //creation de l'article
   let article =+`<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
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



/* Pour chaque produit du LS, aller chercher les infos complémentaire 
via un fetch (/products/id) 
et recréer un produit complet avec les infos utilisateurs + les infos BDD
Puis pour chaque produit du panierComplet, créer le template HTML avec les bonnes variables
Créer une fonction de calcul du prix total
Créer une fonction de calcul de la quantité totale
Créer les évent pour supprimer un produit 
(guide des étapes clées - e.target.closest) */