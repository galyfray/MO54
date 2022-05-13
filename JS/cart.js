let nb_article_by_createCart = 0;
var total_price = 0;
$(document).ready(function () {

    /*
     The function to make the navigation works
     */
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


    /*
     * We load the stuff saved in the sessionStorage and then we check if it's empty or not.
     * If this is empty : we create an image with a text saying that the cart is empty.
     * If not : we create all the articles to show them.
     */
    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    if (Object.keys(old_data_saved).length == 0) {
        /*
         * img : the image that says there is nothing in the cart
         * img_cart_div: the div that contains the image
         * warning: the text for the warning_div 'Il n'y a aucun article dans le panier'
         * warning_div : the div that contain the text written in warning
         */
        let grid_article_in_cart = document.createElement('div');
        grid_article_in_cart.className = "grid-container";
        grid_article_in_cart.style = "border: 2px solid rgb(230,230,230);  border-radius : 20px; ";

        let img = document.createElement('img')
        img.src = "../Ressource/nothing_in_cart.png";
        img.className = "img_cart_empty";
        
        let img_cart_div = document.createElement('div');
        img_cart_div.appendChild(img);
        img_cart_div.className = "img_cart_empty";

        let warning = document.createTextNode("Il n'y a aucun article dans le panier");
        let warning_div = document.createElement('div');
        warning_div.className = "name_cart";
        warning_div.appendChild(warning);
        warning_div.style = "margin: 0 auto; text-align : center;";

        cart_div.appendChild(img_cart_div);
        cart_div.appendChild(warning_div);
        document.getElementById("nb_object_in_cart").textContent = "Hum...";
        document.getElementById("total_to_pay").textContent = "";
        return cart_div;
    }
    else {
        for (i = 0; i < Object.keys(old_data_saved).length; i++) {
            createCart2(old_data_saved[i]);
            total_price = parseFloat(total_price) + parseFloat((parseFloat(old_data_saved[i].price) * parseInt(old_data_saved[i].quantity)).toFixed(2));
        }
        
        document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
        document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + Object.keys(old_data_saved).length + ")";
        nb_article_in_cart.textContent = Object.keys(old_data_saved).length;

    }    
});

/**
 * This function is used to create the cart. We create all the different html component that are needed.
 * @param article : the object we are working on. It has for now those properties: name, image, description, brand and price.
 */
function createCart2(article) {
    /* 
     * grid_article_in_cart: the grid that contains all the information for an article
     * img : the image of the article
     * img_cart_div : the div that contains the image of the article
     * del_cart_div : the div that contains the icon of the trash can
     * name : the name of the article
     * name_cart_div : the div that contains the name of the article
     * info_cart_div : the div that contains the other informations about an article (brand, price, quantity)
     * brand : the brand of the article
     * brand_div : the div that contains the brand of the article
     * price : the price of the article
     * price_div : the div that contains the price of the article
     * quantite : the input that contains the quantity of the article
     */

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
    brand_div.className = "brand_div_cart";

    let price = document.createTextNode((article.price * article.quantity).toFixed(2) + "€");
    let price_div = document.createElement('div');
    price_div.className = "prix_cart";

    let box_selectdiv = document.createElement('div');
    box_selectdiv.className = "number-input";

    let box_select_minus = document.createElement('button');
    let box_select_plus = document.createElement('button');
    box_select_plus.className = "plus";

    let box_select_value = document.createElement('input');
    box_select_value.className = "quantity";
    box_select_value.type = "number";
    box_select_value.min = "1";
    box_select_value.id = "quantity_id" + article.id;
    box_select_value.value = article.quantity;

    box_selectdiv.appendChild(box_select_minus);
    box_selectdiv.appendChild(box_select_value);
    box_selectdiv.appendChild(box_select_plus);

    let delt_text = document.createElement('h4');
    delt_text.textContent = "Supprimer du pannier";

    let del_text_div = document.createElement('div');
    del_text_div.appendChild(delt_text);
    del_text_div.className = "del_text_div";

    /*
     * Must be redone with css to have a friendly interface.
     * We update the SessionStorage by deleting an entry .
     * We also update the component that show the number of article in the cart.
    */
    del_text_div.onclick = function () {
        if (confirm('Etes vous sûr de vouloir retirer cet article du panier? ')) {
            cart_div.removeChild(grid_article_in_cart);
            cart_div.removeChild(line);            
            var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
            var tab = [];
            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (!(old_data_saved[i].id == article.id)) {
                    tab.push(old_data_saved[i]);
                }
            }
            sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
            document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + (Object.keys(old_data_saved).length - 1) + ")";
            nb_article_in_cart.textContent = Object.keys(old_data_saved).length - 1;            
        }
    }

    /*
    * We update the sessionStorage with the new quantity.
    * We re-calculate the price of the article according to the new quantity
    */
    box_select_plus.onclick = function () {
        var intermediaire = document.getElementById('quantity_id' + article.id).value;
        document.getElementById('quantity_id' + article.id).value = parseInt(intermediaire) + 1;
        price_div.removeChild(price);
        total_price = total_price - parseFloat(price.textContent);



        price = document.createTextNode((article.price * (parseInt(intermediaire) + 1)).toFixed(2) + "€");
        price_div.appendChild(price);

        total_price = total_price + parseFloat(price.textContent);
        document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
        var quantite = document.getElementById('quantity_id' + article.id).value;
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

    /*
    * We make sure that the quantity of the article after the action is still superior to 0.
    * We update the sessionStorage with the new quantity.
    * We re-calculate the price of the article according to the new quantity
    */
    box_select_minus.onclick = function () {
        var intermediaire = document.getElementById('quantity_id' + article.id).value;
        if (!(parseInt(intermediaire) - 1 == 0)) {
            document.getElementById('quantity_id' + article.id).value = parseInt(intermediaire) - 1;
            price_div.removeChild(price);
            total_price = total_price - parseFloat(price.textContent);
            price = document.createTextNode((article.price * (parseInt(intermediaire) - 1)).toFixed(2) + "€");
            price_div.appendChild(price);
            total_price = total_price + parseFloat(price.textContent);
            document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
            
            var quantite = document.getElementById('quantity_id' + article.id).value;
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




    /*
   * We make sure that the quantity of the article after the action is still superior to 0.
   * We update the sessionStorage with the new quantity.
   * We re-calculate the price of the article according to the new quantity
   */
    box_select_value.oninput = function () {      
        price_div.removeChild(price);
        total_price = total_price - parseFloat(price.textContent);
        price = document.createTextNode((article.price * box_select_value.value).toFixed(2) + "€");
        price_div.appendChild(price);
        total_price = total_price + parseFloat(price.textContent);
        document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
        var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        var tab = [];
        for (i = 0; i < Object.keys(old_data_saved).length; i++) {
            if (old_data_saved[i].id == article.id) {
                old_data_saved[i].quantity = parseInt(box_select_value.value);
            }
            tab.push(old_data_saved[i]);
        }
        sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
    };


    brand_div.appendChild(brand);
    price_div.appendChild(price);
    grid_article_in_cart.appendChild(img_cart_div);
    info_cart_div.appendChild(brand_div);
    info_cart_div.appendChild(price_div);
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