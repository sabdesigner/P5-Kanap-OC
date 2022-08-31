let productListFiltred = [];
let elementQuantity = document.getElementById("cart__items");

let panierComplet = []

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
    // Ajoute les events de delete et de changement de quantité
    
    calculQuantite()
    calculTotalPrice()    
    eventDeleteProduct()
    eventupdateQuantity()   

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
function eventDeleteProduct(){
    let selectsSupp = document.querySelectorAll(".deleteItem");
    console.log("selectsSupp",selectsSupp);
    selectsSupp.forEach((select) => {
        select.addEventListener("click",(event)=>{
            deleteProduct(event) 
         } );
    })
}

function deleteProduct(event){
    event.preventDefault();
    console.log(event.target)
    //on pointe le parent hiéarchique <article>`du lien à supp
            let myProduct = event.target.closest(`article`);
            console.log("myProduct", myProduct);
            let id = myProduct.getAttribute("data-id");
            let color = myProduct.getAttribute("data-color");

            //console.log("LS", productLocalStorage)

            const resultIndex = productLocalStorage.findIndex(
                (e) => e.id === id && e.color === color);

                console.log("resultIndex", resultIndex);

                // On supprime
            productLocalStorage.splice(resultIndex, 1);
                // On vérifie que le LS est correct après supression
            console.log("productLocalStorage + supression", productLocalStorage);
                // On met à jour le LS du navigateur
            localStorage.setItem("product", JSON.stringify(productLocalStorage));
                // On demande à enlever l'article du DOM
            myProduct.parentNode.removeChild(myProduct);
                // On supprime le produit du panierComplet
            panierComplet.splice(resultIndex, 1);

            // On recalcule
            calculQuantite()
            calculTotalPrice()    
            
}

// fonction pour modifier la quantité 
/*const changeQty = () => {
    let qtyChange = document.querySelectorAll(".itemQuantity");
        for (let l = 0; l < qtyChange.length; l++) {
            qtyChange[l].addEventListener("change", (e) => {
                    e.preventDefault();

                    let qtyInputValue = qtyChange[l].valueAsNumber; 
                    // on stock la quantité reçu par la boucle dans une variable

                    productLocalStorage[l].addQuantity = qtyInputValue; 
                    // on récupere la quantité du localstorage 

                    calculTotalPrice(); 
                    // on rappelle la fonction pour que le prix s'actualise en temps réel. 
                    console.log(calculTotalPrice());

                    localStorage.setItem("product", JSON.stringify(productLocalStorage)); 
                    // on modifie ou supprime la quantité dans le localStorage

                });
            }
        };
        changeQty();*/

//Evènements sur les inputs quantité 
/*function changeQty() {
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
    localStorage.setItem("product", JSON.stringify(productLocalStorage));
    
    // On recalcule
        calculQuantite()
        calculTotalPrice()  
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
}*/

//Evènements sur les inputs quantité 
function eventupdateQuantity(){
    let changeQty = document.querySelectorAll(".itemQuantity");
    console.log("changeQty",changeQty);
    changeQty.forEach((item) => {
        item.addEventListener("change",console.log, (event)=>{
            updateQuantity(event) 
         } );
    })
}

function updateQuantity(event){  
    event.preventDefault();
    //console.log(event.target)
    choiceQty = Number(item.value);

    // On pointe le parent hiérarchique <article> de l'input "itemQuantity"
    let myArticle = item.closest(`article`);

    // On récupère dans le localStorage l'élément (même id et même couleur) dont on veut modifier la quantité
    const resultIndex = productLocalStorage.findIndex(item => item.id === id === id && item.color === color);
    console.log("resultIndex", resultIndex);

    resultIndex.quantityProduct = item.valueAsNumber;


    // Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier,...
    //...on met à jour la quantité dans le localStorage et le DOM
    if(choiceQty > 0 && choiceQty <= 100 && Number.isInteger(choiceQty)){ 
        
        localStorage.setItem("product", JSON.stringify(productLocalStorage));
        // Maj du produit du panierComplet
         panierComplet.splice(resultIndex);

    // Et, on recalcule la quantité et le prix total du panier  
    // On recalcule
     calculQuantite()
     calculTotalPrice()  
    }
}

function calculQuantite(){
   //console.log("mon panier complet",panierComplet)
   let qty = 0;

   for (let product of panierComplet) {
    //console.log(product.quantity)
    qty += product.quantity;
   }

   //console.log("total qty", qty)
   document.getElementById("totalQuantity").innerHTML = qty; 
   
}

function calculTotalPrice(){
 //console.log("mon panier complet",panierComplet)
 let price = 0;

 for (let product of panierComplet) {
    price += product.price * product.quantity;
   }

   document.getElementById("totalPrice").innerHTML = price; 
}

// le formulaire (en cours)
fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    //??
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId //??
     // adress confirmation  + orderId
    })
    .catch((err) => console.error(err))

// quand on clic sur le btn "commander"
const boutonCommander = document.getElementsByClassName(".cart__order");
// verif des erreurs
let errorFormulaireFirstName = true;
let errorFormulaireLastName = true;
let errorFormulaireAddress = true;
let errorFormulaireCity = true;
let errorFormulaireEmail = true;

// les regles 
let txtRegex = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
let addressRegex = new RegExp("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
let emailRegex = new RegExp("^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$");

// infos à recup du formulaire
let inputfirstName = document.getElementById("firstName");
let inputname = document.getElementById("lastName");
let inputaddress = document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");

// Ecoute du contenu du champ "prénom", Vérification du prénom et affichage d'un message si celui-ci n'est pas correct
   inputFirstName.addEventListener('change', function() {
    let checkValueFirstName;
    let firstNameErrorMsg = inputFirstName.nextElementSibling;
    checkValueFirstName = txtRegex.test(inputFirstName.value);
    if (checkValueFirstName) {
        firstNameErrorMsg.innerText = '';
        errorFormulaireFirstName = false;
    } 
    else {
        firstNameErrorMsg.innerText = 'Veuillez indiquer un prénom.';
        errorFormulaireFirstName = true;
    }
});

// Ecoute du contenu du champ "nom", Vérification du nom et affichage d'un message si celui-ci n'est pas correct
inputLastName.addEventListener('change', function() {
    let checkValueLastName;
    let lastNameErrorMsg = inputLastName.nextElementSibling;
    checkValueLastName = txtRegex.test(inputLastName.value);
    if (checkValueLastName) {
        lastNameErrorMsg.innerText = '';
        errorFormulaireLastName = false;
    }
    else {
        lastNameErrorMsg.innerText = 'Veuillez indiquer un nom de famille.';
        errorFormulaireLastName = true;
    }
});

// Ecoute du contenu du champ "adresse", Vérification de l'adresse et affichage d'un message si celle-ci n'est pas correcte
inputAddress.addEventListener('change', function() {
    let checkValueAddress;
    let addressErrorMsg = inputAddress.nextElementSibling;
    checkValueAddress = addressRegex.test(inputAddress.value);
    if (checkValueAddress) {
        addressErrorMsg.innerText = '';
        errorFormulaireAddress = false;
    }
    else {
        addressErrorMsg.innerText = 'Veuillez indiquer une adresse.';
        errorFormulaireAddress = true;
    }
});

// Ecoute du contenu du champ "ville", Vérification de la ville et affichage d'un message si celle-ci n'est pas correcte
inputCity.addEventListener('change', function() {
    let checkValueCity;

    let cityErrorMsg = inputCity.nextElementSibling;
    checkValueCity = txtRegex.test(inputCity.value);
    if (checkValueCity) {
        cityErrorMsg.innerText = '';
        errorFormulaireCity = false;
    } else {
        cityErrorMsg.innerText = 'Veuillez indiquer le nom d\'une ville.';
        errorFormulaireCity = true;
    }
});

// Ecoute du contenu du champ "email", Vérification de l'email et affichage d'un message si celui-ci n'est pas correct
inputEmail.addEventListener('change', function() {
    let checkValueEmail;
    let emailErrorMsg = inputEmail.nextElementSibling;
    checkValueEmail = emailRegex.test(inputEmail.value);
    if (checkValueEmail) {
        emailErrorMsg.innerText = '';
        errorFormulaireEmail = false;
    }
    else {
        emailErrorMsg.innerText = 'Veuillez renseigner un email.';
        errorFormulaireEmail = true;
    }
});

// création d'un tableau avec les entrées prénom nom adresse ville email
/*[firstName,lastName, address, city, email ].forEach(element) => {
element.addEventListener("change", () => {
    const (regex, errorMessage)= MyRegex(element)
    const errorMsg = function getError(element)
    checkInput (element, regex, errorMessage)
} 
)}*/

/*function getError (element)
if (element === firstName) return document.getElementById ("firstNameErrorMsg")
if (element === lastName) return document.getElementById ("LastNameErrorMsg")
if (element === address) return document.getElementById ("addressErrorMsg")
if (element === city) return document.getElementById ("cityErrorMsg")



// On cree une fonction de regles
function MyRegex (element){
    const emailReg = document.getElementById("email")
    const specialCharacters = new RegExp("/^[A-Za-z0-9+_.-]+@(.+)$/")

    const emailMessage = "Merci de mettre une adresse mail juste"
    const specialCharactersMessage = "Vos infos ne peuvent contenir des caractères spéciaux"
}

document.getElementById(".order").addEventListener ("click", (event) =>{

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
const addressErrorMsg = document.getElementById("addressErrorMsg")
const cityErrorMsg = document.getElementById("cityErrorMsg")
const emailErrorMsg = document.getElementById("emailErrorMsg")

})

//verification des entrées du formulaire
function checkInput (element, errorMessage, regex){
        if (regex.test(element.value){ 
            errorMessage.innerHTML = errorMessage
        });
    }*/