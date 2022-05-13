
let boxArticleDiv = document.createElement('div');
boxArticleDiv.id = 'boxContainer';

$(document).ready(function () {


    (function ($) {
        'use strict';
        var Nav = new hcOffcanvasNav('#main-nav', {
            disableAt: false,
            customToggle: '.menu_icon',
            levelSpacing: 40,
            navTitle: 'All',
            levelTitles: true,
            levelTitleAsBack: true,
            pushContent: '#container',
            labelClose: false
        });
    })(jQuery);


    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    if ( Object.keys(old_data_saved).length == 0) {

        //Prévoir une version si rien dans le pannier.
        let grid_article_in_cart = document.createElement('div');
        grid_article_in_cart.className = "grid-container";
        grid_article_in_cart.style = "border: 2px solid rgb(230,230,230);  border-radius : 20px; ";

        let img = document.createElement('img')
        img.src = "../Ressource/nothing_in_cart.png";
        img.className = "img_cart_empty";
        
        let img_cart_div = document.createElement('div');
        img_cart_div.appendChild(img);
        img_cart_div.className = "img_cart_empty";

        let name = document.createTextNode("Il n'y a aucun article dans le panier");
        let name_cart_div = document.createElement('div');
        name_cart_div.className = "name_cart";
        name_cart_div.appendChild(name);
        name_cart_div.style = "margin: 0 auto; text-align : center;";
        cart_div.appendChild(img_cart_div);
        cart_div.appendChild(name_cart_div);
        document.getElementById("nb_object_in_cart").textContent = "Hum...";
        document.getElementById("total_to_pay").textContent = "";
        return cart_div
    }
    else {
        for (i = 0; i < Object.keys(old_data_saved).length; i++) {
            
            createCart2(old_data_saved[i]);
        }
    }    
});



let nb_article_by_createCart = 0;


/**
 * This function is used to create the cart. We create all the different html component that are needed.
 * @param article : the object we are working on. It has for now those properties: name, image, description, brand and price.
 */
function createCart2(article) {
    /* 
     * grid_article_in_cart: the grid that contains all the information for an article
     * img : the image of the article
     * img_cart_div : the div that contains the image of the article
     * del : the icon of a trash can
     * del_cart_div : the div that contains the icon of the trash can
     * name : the name of the article
     * name_cart_div : the div that contains the name of the article
     * info_cart_div : the div that contains the other informations about an article (brand, price, quantity)
     * brand : the brand of the article
     * brand_div : the div that contains the brand of the article
     * prix : the price of the article
     * prix_div : the div that contains the price of the article
     * quantite_div : the div that contains the component for the quantity of the article
     * quantite : the input that contains the quantity of the article
     * label_quantite : the label that print "Quantité : "   
     */




    nb_article_by_createCart = nb_article_by_createCart + 1;
    document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + nb_article_by_createCart + ")";
    nb_article_in_cart.textContent = nb_article_by_createCart;

    let grid_article_in_cart = document.createElement('div');
    grid_article_in_cart.className = "grid-container";
    grid_article_in_cart.style = "border: 2px solid rgb(230,230,230);  border-radius : 20px; ";

    let img = document.createElement('img')
    img.src = article.preview;
    img.className = "img_cart";

    let img_cart_div = document.createElement('div');
    img_cart_div.className = "img_cart";
    img_cart_div.appendChild(img);

    let name = document.createTextNode(article.name);
    let name_cart_div = document.createElement('div');
    name_cart_div.className = "name_cart";
    name_cart_div.appendChild(name);

    let info_cart_div = document.createElement('div');
    info_cart_div.className = "info_cart";  

    let brand = document.createTextNode(article.brand);
    let brand_div = document.createElement('div');
    brand_div.style = "text-align: left;"
    brand_div.className = "brand_div_cart";

    let prix = document.createTextNode((article.price * article.quantity).toFixed(2) + "€");
    let prix_div = document.createElement('div');
    prix_div.style = "text-align: left;";
    prix_div.className = "prix_cart";
    prix.id = "price_id" + article.id;

    let box_selectdiv = document.createElement('div');
    box_selectdiv.className = "number-input";

    let box_select_minus = document.createElement('button');
    let box_select_plus = document.createElement('button');
    box_select_plus.className = "plus";

    let box_select_value = document.createElement('input');
    box_select_value.className = "quantity";
    box_select_value.min = "1";
    box_select_value.name = "quantity";
    box_select_value.type = "number";
    box_select_value.id = "quantite_id_v2" + article.id;
    box_select_value.value = article.quantity;

    box_selectdiv.appendChild(box_select_minus);
    box_selectdiv.appendChild(box_select_value);
    box_selectdiv.appendChild(box_select_plus);

    box_select_plus.onclick = function () {
        var intermediaire = document.getElementById('quantite_id_v2' + article.id).value;
        document.getElementById('quantite_id_v2' + article.id).value = parseInt(intermediaire) + 1;
        prix_div.removeChild(prix);
        prix = document.createTextNode((article.price * (parseInt(intermediaire) + 1)).toFixed(2) + "€");
        prix_div.appendChild(prix);
        //mettre à jour la sessionstorage derrière = lire tout et mettre à jour la quantité seulemnt

        var quantite = document.getElementById('quantite_id_v2' + article.id).value;
        var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        var tab = [];

        for (i = 0; i < Object.keys(old_data_saved).length; i++) {
            if (old_data_saved[i].id == article.id) {
                old_data_saved[i].quantity = parseInt(quantite);
            }
            tab.push(old_data_saved[i]);
        }
        sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
    };

    box_select_minus.onclick = function () {
        var intermediaire = document.getElementById('quantite_id_v2' + article.id).value;
        if (!(parseInt(intermediaire) - 1 == 0)) {
            document.getElementById('quantite_id_v2' + article.id).value = parseInt(intermediaire) - 1;
            prix_div.removeChild(prix);
            prix = document.createTextNode((article.price * (parseInt(intermediaire) - 1)).toFixed(2) + "€");
            prix_div.appendChild(prix);
            //mettre à jour la sessionstorage derrière
            var quantite = document.getElementById('quantite_id_v2' + article.id).value;
            var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
            var tab = [];

            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (old_data_saved[i].id == article.id) {
                    old_data_saved[i].quantity = parseInt(quantite);
                }
                tab.push(old_data_saved[i]);
            }
            sessionStorage.setItem('articleToCart2', JSON.stringify(tab));

        }
    };

    let delt_text = document.createElement('h4');
    delt_text.textContent = "Supprimer du pannier";

    let del_text_div = document.createElement('div');
    del_text_div.appendChild(delt_text);
    del_text_div.style = "font-style: italic; color: rgb(220,220,220); ";
    del_text_div.onclick = function () {
        //To be redone with css
        if (confirm('Etes vous sûr de vouloir retirer cet article du panier? ')) {
            cart_div.removeChild(grid_article_in_cart);
            cart_div.removeChild(line);
           // nb_article_by_createCart = nb_article_by_createCart - 1;
           // document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + nb_article_by_createCart + ")";
           // nb_article_in_cart.textContent = nb_article_by_createCart;

            //mettre à jour la sessionstorage derrière
            var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
            var tab = [];

            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (!(old_data_saved[i].id == article.id)) {
                    tab.push(old_data_saved[i]);
                }
            }
            sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
            //longueur du sessionStorage au lieu d'une variable, ce sera mieux
            document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + (Object.keys(old_data_saved).length - 1) + ")";
            nb_article_in_cart.textContent = Object.keys(old_data_saved).length - 1;
            

        }
    }

    brand_div.appendChild(brand);
    prix_div.appendChild(prix);
    grid_article_in_cart.appendChild(img_cart_div);
    info_cart_div.appendChild(brand_div);
    info_cart_div.appendChild(prix_div);
    info_cart_div.appendChild(box_selectdiv);
    info_cart_div.appendChild(del_text_div);
    grid_article_in_cart.appendChild(name_cart_div);
    grid_article_in_cart.appendChild(info_cart_div);
    cart_div.appendChild(grid_article_in_cart);

    let line = document.createElement('div');
    line.style = "padding : 10px;";
    cart_div.appendChild(line);
    return cart_div
}