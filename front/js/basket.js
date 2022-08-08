// export { panier } from "./product.js";
// on creer une page annexe qui permet de recuperer l'ensemble  des fonctions 
// Permet d'enregistrer le panier dans le localStorage et on conserve les variable (API qui conserve les données, valeur associé à la cléfs)  
function saveBasket(basket){
    localStorage.setItem (`basket`, JSON.stringify(basket));
    // JSON transforme en chaine de caractere
    }
    // On recupere l'Item avec la clef Basket
    function getBasket(){
    let basket = localStorage = getItem(`basket`);
    // Si le panier est non existant 
    if (basket == null){
        return[];
    }else{
    return JSON.parset(basket);
    }
}

    /* On recupere / on ajoute le produit et on enregiste le panier basket*/ 
    function addBasket(product){
    let basket = getBasket();
    /* On regarde si il y a deja si le produit est dans le panier on augmente la quantité sinon on l'ajoute find fonction qui recherche dans  un tabl suivant une condition*/  
    let foundProduct = basket.find( p => p.id == product.id);
    if (foundProduct != undefined){
    foundProduct.quantity++;
    } else{
        product.quantity = 1;
        basket.push(product);

    }
    // Par default le basket.push est null quand on arrive sur la page donc on creer gere dans le get basket
    basket.push(product);
    saveBasket(basket);  
    }

    // enlever un produit utilisation de filtrer pour  filtrer en fonction d'une condition
    function removeFromBasket (product){
        let basket = getBasket ();
    // on filtre en inversant la condition on garde tout les produits et on supprime celui que l'on defini 
        basket = basket.filter (p => p.id != product.id);
        saveBasket(basket);  
    }

// Modifier la quantité 
    function changeQuantity(product, quantity){
        let basket = getBasket ();
        let foundProduct = basket.find(p => p.id == product.id);
        if (foundProduct !=undefined){  
        foundProduct.quantity += quantity;
        if (foundProduct.quantity <= 0){
            removeformBasket(product);
          } else {
            saveBasket(basket);
        }
        }
    }
// calculer la quantité : à partir du panier recuperer la quantité 
    function getNumberProduct() {
        let basket = getBasket ();
        let number = 0;
        for (let product of basket){
            number += product.quantity;   
        } 
        return number;
} 

/* calculer le prix : à partir du panier recuperer le prix */
function getNumberPrice() {
    let basket = getBasket ();
    let total = 0;
    for (let product of basket){
        total += product.quantity * product.price;   
    } 
    return total;
} 
