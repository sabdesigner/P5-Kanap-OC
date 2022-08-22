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

//Evènements de suppression sur les boutons supprimer avec closest
function DeleteProduct(){
    let selectSupp = document.querySelectorAll(".deleteItem");
    console.log("selectSupp");
    selectSupprimer.forEach((selectSupp) => {
        selectSupp.addEventListener("click",(event)=>{
            event.preventDefault();
            //on pointe le parent hiéarchique <article>`du lien à supp
            let myProduct = selectSupp.closest(`article`);
            console.log("myProduct");
            //on filtre dans le LS
            productlocalStorage = productlocalStorage.filter
            (product => product.id != idDelete || product.color !== colorDelete) 
            //on met à jour le LS
            localStorage.setItem("product" , JSON.stringify(productlocalStorage.length == 0));
            console.log("localStorage")            
            //message alerte 
            alert("ce produit va être supprimé de votre panier")
           
            // on supp le bloc produit du panier
            if (myProduct.parentNode){
                myProduct.parentNode.removeChild(myProduct);
            }
            // si le panier est vide (le localStorage est vide)
            if (localStorage === null || localStorage == 0){
            console.log("Panier vide");
            } 
            else {
            //on calcule TotalProductPrice et TotalProductQty
             getNumberProducts();
             getNumberPrice();
         } 
         } );
    })
}

//Evènements sur les inputs quantité 
function changeQty() {
// On sélectionne l'élément html (input) dans lequel la quantité est modifiée
let changeQty = document.querySelectorAll(".itemQuantity");
changeQty.forEach((item) => {
//On écoute le changement sur itemQuantity
item.addEventListener("change", (event) => {
event.preventDefault();
     for (let i in productLocalStorage){
     choiceQty = Number(changeQty[i].value);
     console.log("MyQty",choiceQty);
//si la quantité est comprise entre 1 et 100 et que c'est un nombre entier
//on met à jour la quantité dans le localStorage et le DOM
    if(changeQty[i].value > 0 && changeQty[i].value <= 100 && Number.isInteger(choiceQty)){
    parseChangeQty = parseInt(changeQty[i].value);

    productLocalStorage[i].quantityProduct = parseChangeQty;
    localStorage.setItem("produit", JSON.stringify(productLocalStorage));
//on calcule TotalProductPrice et TotalProductQty
    getNumberProducts();
    getNumberPrice();
}
//sinon, on remet dans le DOM la quantité indiquée dans le localStorage et on indique un message d'erreur
else{
    changeQty[i].value = productLocalStorage[i].quantity;
    messageErrorQty = true;
    }
if(messageErrorQty){       
    alert("La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie.");
                    } 
                } 
        });
    });
}

//Fonction de calcul du total + fonction de calcul de la quantité (basé sur le panier complet) + affichage dans le HTML

/*function totalProductsPrice (){
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPricePanierComplet = quantityProductPanierComplet * priceProductPanierComplet;
    // Calcul du prix total du panier
    totalPrice += totalProductPricePanierComplet;
    document.getElementById("totalPrice").innerText = totalPrice; 
    }

function totalProductsQuantity(){
        totalQuantity += parseInt(quantityProductPanierComplet);
        console.log("Total quantité panier",totalQuantity);
        document.getElementById("totalQuantity").innerText = totalQuantity;
}

function totaux (){
    totalProductsQuantity();
    totalProductsPrice();
    
}*/

function getNumberProducts() {
    let panierComplet = getCart ();
    let number = 0;
    for (let product of panierComplet){
        number += product.quantity;   
    } 
    return number;
} 

// calculer le prix : à partir du panier recuperer le prix
function getNumberPrice() {
let panierComplet = getCart ();
let total = 0;
for (let product of panierComplet){
    total += product.quantity * product.price;   
} 
return total;
} 

function totalProductsPrice (){
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPricePanierComplet = getNumberProducts * getNumberPrice;
    // Calcul du prix total du panier
    getNumberPrice += totalProductPricePanierComplet;
    document.getElementById("totalPrice").innerText = totalPrice; 
    }

function total (){
    getNumberProducts();
    getNumberPrice();
 
}
