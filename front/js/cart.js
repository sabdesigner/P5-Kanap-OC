let productListFiltred = [];
let elementQuantity = document.getElementById("cart__items");

let panierComplet = [];

//  Cette fonction fait GetLocalStorage et retourne les données
function getCart() {
  //Initialisation du local storage
  let LocalStorage = JSON.parse(localStorage.getItem("product")) || [];
  console.table(LocalStorage);

  if (
    LocalStorage === null ||
    LocalStorage === 0 ||
    LocalStorage === [] ||
    LocalStorage.length === 0
  ) {
    let element = document.createElement("div");
    element.innerHTML = "Votre panier est vide";
    elementQuantity.appendChild(element);

    console.log("Panier vide");
    return LocalStorage;
  } else LocalStorage !== null || LocalStorage !== 0;
  {
    console.log("Des produits sont dans le panier");
    return LocalStorage;
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
    console.log("produits du LS", productLocalStorage);
    // Tableau vide qui contiendra les données du LS (qty, color) et les données de l'api (id, name, price, color, imageUrl)

    // Pour chaque produit existant dans l'API
    produitsAPI.map((productAPI) => {
      // Et pour chaque produit existant dans le LS
      productLocalStorage.map((itemLS) => {
        // on regarde si l'ID correspond entre les deux
        if (productAPI._id === itemLS.id) {
          // Si oui, le produit est trouvé et ajouté dans le panierComplet (ou on pourra trouver toutes les infos nécéssaire à l'utilisateur)
          panierComplet.push({
            id: productAPI._id,
            name: productAPI.name,
            price: productAPI.price,
            color: itemLS.color,
            quantity: itemLS.quantity,
            imageUrl: productAPI.imageUrl,
          });
        }
      });
    });

    // le panierComplet est rempli
    console.log("panierComplet", panierComplet);

    // Créer les bloc HTML
    createProducts(panierComplet);
    // Ajoute les events de delete et de changement de quantité

    calculQuantite();
    calculTotalPrice();
    eventDeleteProduct();
    eventupdateQuantity();
  });

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
                </article>`;
  }
}

//Evènements de suppression sur les boutons supprimer avec closest
function eventDeleteProduct() {
  let selectsSupp = document.querySelectorAll(".deleteItem");
  console.log("selectsSupp", selectsSupp);
  selectsSupp.forEach((select) => {
    select.addEventListener("click", (event) => {
      deleteProduct(event);
    });
  });
}

function deleteProduct(event) {
  event.preventDefault();
  console.log(event.target);
  //on pointe le parent hiéarchique <article>`du lien à supp
  let myProduct = event.target.closest(`article`);
  console.log("myProduct", myProduct);
  let id = myProduct.getAttribute("data-id");
  let color = myProduct.getAttribute("data-color");

  //console.log("LS", productLocalStorage)

  const resultIndex = productLocalStorage.findIndex(
    (e) => e.id === id && e.color === color
  );
  //ligne de l'index
  //console.log("resultIndex", resultIndex);

  // On supprime
  productLocalStorage.splice(resultIndex, 1);
  // On vérifie que le LS est correct après supression
  // console.log("productLocalStorage + supression", productLocalStorage);
  // On met à jour le LS du navigateur
  localStorage.setItem("product", JSON.stringify(productLocalStorage));
  // On demande à enlever l'article du DOM
  myProduct.parentNode.removeChild(myProduct);
  // On supprime le produit du panierComplet
  panierComplet.splice(resultIndex, 1);

  // On recalcule
  calculQuantite();
  calculTotalPrice();
}

//Evènements sur les inputs quantité
function eventupdateQuantity() {
  let changeQty = document.querySelectorAll(".itemQuantity");
  console.log("changeQty", changeQty);
  changeQty.forEach((item) => {
    item.addEventListener("change", (event) => {
      updateQuantity(event);
    });
  });
}

function updateQuantity(event) {
  event.preventDefault();

  choiceQty = Number(event.target.value);
  
  //console.log(event.target)

  // On pointe le parent hiérarchique <article> de l'input "itemQuantity"
  let myArticle = event.target.closest(`article`);
  
  //console.log(myArticle);
  
  let colorMyArticle = myArticle.getAttribute("data-color");
  
  //console.log(colorMyArticle);
  
  let idMyArticle = myArticle.getAttribute("data-id");
  
  //console.log(idMyArticle);

  // On récupère dans le localStorage l'élément (même id et même couleur) dont on veut modifier la quantité
  const resultIndex = productLocalStorage.findIndex(
    (item) => item.id === idMyArticle && item.color === colorMyArticle
  );
  
  //console.log("resultIndex", resultIndex);

  // Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier on met à jour la quantité dans le localStorage et le DOM
  if (choiceQty > 0 && choiceQty <= 100) {
    let LS = JSON.parse(localStorage.getItem("product"));
    
    //console.log(LS[resultIndex])
   
    LS[resultIndex].quantity = choiceQty;

    localStorage.setItem("product", JSON.stringify(LS));
    
    // Maj du produit du panierComplet
    panierComplet[resultIndex].quantity = choiceQty;
    console.log(panierComplet);

    // Et, on recalcule la quantité et le prix total du panier
    // On recalcule
    calculQuantite();
    calculTotalPrice();
  }
}

function calculQuantite() {
  
  //console.log("mon panier complet",panierComplet)
  
  let qty = 0;

  for (let product of panierComplet) {
   
    //console.log(product.quantity)
    
    qty += product.quantity;
  }

  //console.log("total qty", qty)
  
  document.getElementById("totalQuantity").innerHTML = qty;
}

function calculTotalPrice() {
 
  //console.log("mon panier complet",panierComplet)
  
  let price = 0;

  for (let product of panierComplet) {
    price += product.price * product.quantity;
  }

  document.getElementById("totalPrice").innerHTML = price;
}

// le formulaire

let firstName = document.getElementById("firstName");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let noNumbers = new RegExp(
  "^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);

let lastName = document.getElementById("lastName");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");

let address = document.getElementById("address");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let addressReg = new RegExp("^[a-zA-Z0-9s,'-]*$");

let city = document.getElementById("city");
let cityErrorMsg = document.getElementById("cityErrorMsg");

let email = document.getElementById("email");
let emailErrorMsg = document.getElementById("emailErrorMsg");
let emailReg = new RegExp(
  "^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$"
);

let btnOrder = document.getElementById("order");

// évènements en input pour mettre le message d'erreur si un mauvais caractère est utilisé Regex
firstName.addEventListener("input", (e) => {
  e.preventDefault();
  if (noNumbers.test(firstName.value) == false) {
    firstNameErrorMsg.innerHTML = "Prénom est incorrect";
    btnOrder.disabled = true;
  } else {
    firstNameErrorMsg.innerHTML = "";
    btnOrder.disabled = false;
  }
});

lastName.addEventListener("input", (e) => {
  e.preventDefault();
  if (noNumbers.test(lastName.value) == false) {
    lastNameErrorMsg.innerHTML = "Nom est incorrect";
    btnOrder.disabled = true;
  } else {
    lastNameErrorMsg.innerHTML = "";
    btnOrder.disabled = false;
  }
});

address.addEventListener("input", (e) => {
  e.preventDefault();
  if (addressReg.test(address.value) == false) {
    addressErrorMsg.innerHTML = "Addresse est incorrect";
    btnOrder.disabled = true;
  } else {
    addressErrorMsg.innerHTML = "";
    btnOrder.disabled = false;
  }
});

city.addEventListener("input", (e) => {
  e.preventDefault();
  if (noNumbers.test(city.value) == false) {
    cityErrorMsg.innerHTML = "Ville incorrect";
    btnOrder.disabled = true;
  } else {
    cityErrorMsg.innerHTML = "";
    btnOrder.disabled = false;
  }
});

email.addEventListener("input", (e) => {
  e.preventDefault();
  if (emailReg.test(email.value) == false) {
    emailErrorMsg.innerHTML = "Email incorrect";
    btnOrder.disabled = true;
  } else {
    emailErrorMsg.innerHTML = "";
    btnOrder.disabled = false;
  }
});

// Récupération des valeurs du formulaire + PanierComplet

btnOrder.addEventListener("click", (e) => {
  e.preventDefault();

  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };
  // si tout l'ensemble des données ne sont pas validés

  if (
    firstName.value === "" ||
    lastName.value === "" ||
    address.value === "" ||
    city.value === "" ||
    email.value === ""
  ) {
    alert("Veuillez remplir le formulaire contact");

    // si validé on creer un tableau on envoi les données
  } else {
    let products = [];
    for (let product of panierComplet) {
      products.push(product.id);
    }

    let envoyer = {
      contact,
      products,
    };

    //console.log(products, contact)

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envoyer),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        window.location.href = `confirmation.html?orderId=${data.orderId}`;
      });
  }
});
