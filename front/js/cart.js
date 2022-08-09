//Initialisation du local storage
let productLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
console.table(productLocalStorage);
console.log('ok');
const positionEmptyCart = document.querySelector("cart__items");
//
function getCart(){
    if (productLocalStorage === null || productLocalStorage === 0) {
    positionEmptyCart.innerHTML = emptyCart;
    positionEmptyCart.textContent = "Votre panier est vide";
}
    else {
    console.log("Des produits sont dans le panier");
    
    for (let product in productLocalStorage){

    // creation de l'élément "article"
    let productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute('data-id', productLocalStorage[product].id);

    // creation de l'élément "div"
    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    // insertion de l'image
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = productLocalStorage[product].img;
    productImg.alt = productLocalStorage[product].altTxt;
    console.log('image canap ok')

    // creation de l'élément "div"
    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    // creation de l'élément "div"
    let productItemContentTitlePrice = document.createElement("div");
    productItemContent.appendChild(productItemContentTitlePrice);
    productItemContentTitlePrice.className = "cart__item__content__titlePrice";
    
    // insertion du titre h2
     let productName = document.createElement("h2");
    productItemContentTitlePrice.appendChild(productName);
    productName.innerHTML = productLocalStorage[product].name;
    console.log(productName);

    // insertion de la couleur
    let productColor = document.createElement("p");
    productItemContentTitlePrice.appendChild(productColor);
    productColor.innerHTML = productLocalStorage[product].color;
    console.log(productColor);

    // insertion du prix
    let productPrice = document.createElement("p");
    productItemContentTitlePrice.appendChild(productPrice);
    productPrice.innerHTML = productLocalStorage[product].price + " €";
    console.log(productPrice);

    // creation de l'élément "div"
    let productItemContentSettings = document.createElement("div");
    productItemContent.appendChild(productItemContentSettings);
    productItemContentSettings.className = "cart__item__content__settings";

    // creation de l'élément "div"
    let productItemContentSettingsQuantity = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
    
    // insertion de "Qté : "
    let productQty = document.createElement("p");
    productItemContentSettingsQuantity.appendChild(productQty);
    productQty.innerHTML = "Qté : ";
    console.log(productQty);

    // creation de la quantité
    let productQuantity = document.createElement("input");
    productItemContentSettingsQuantity.appendChild(productQuantity);
    productQuantity.value = productLocalStorage[product].quantity;
    // mettre les attributs number min="1" max="100"//
    productQuantity.className = "itemQuantity";
    
    // creation de l'élément "div"
    let productItemContentSettingsDelete = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsDelete);
    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

    // creation de "p" supprimer
    let productSupp = document.createElement("p");
    productItemContentSettingsDelete.appendChild(productSupp);
    productSupp.className = "deleteItem";
    productSupp.innerHTML = "Supprimer";
} 
}  
}  
getCart();
// création fontion "overallPrice"
