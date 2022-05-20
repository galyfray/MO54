/*
 * total_price : variable used to know the final price to pay for the cart.
 * It's a global var because it will be used when an article is created
 * and also when the quantity of the article is updated.
 * 
 * cart_div : use to access the div 'div_container_all_article_in_cart'
 * → contains all the future article from the cart.html
 */
var total_price = 0;
let cart_div;
let id_article_deleted;
let grid_article_in_cart_deleted;
let line_deleted;

$(document).ready(function () {
    'use strict';
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

    cart_div = document.getElementById('div_container_all_article_in_cart');

    /*
     * We load the stuff saved in the sessionStorage and then we check if it's empty or not.
     * If this is empty : we create an image with a text saying that the cart is empty.
     * If not : we create all the articles to show them.
     */
    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    if (!old_data_saved || old_data_saved.length == 0) {
        /*
         * img : the image that says there is nothing in the cart
         * img_cart_div: the div that contains the image
         * warning: the text for the warning_div 'Il n'y a aucun article dans le panier'
         * warning_div : the div that contain the text written in warning
         */
        let grid_article_in_cart = document.createElement('div');
        grid_article_in_cart.className = "grid-container";
        grid_article_in_cart.style = "border: 2px solid rgb(230,230,230);  border-radius : 20px; ";

        let img = document.createElement('img');
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
        document.getElementById("nb_article_in_cart").textContent = 0;
        return cart_div;
    }
    
    else {
        for (let i = 0; i < old_data_saved.length; i++) {
            createCart2(old_data_saved[i]);
            total_price = total_price + parseFloat(old_data_saved[i].price) * parseInt(old_data_saved[i].quantity);
        }
        document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
        document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + old_data_saved.length + ")";
        nb_article_in_cart.textContent = old_data_saved.length;
    }    
});

/**
 * This function is used to create the cart. We create all the different html components that are needed.
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

    let img = document.createElement('img');
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
        document.getElementById("overlay_alert").style.display = "block";
        document.getElementById("popupAlert").style.display = "block";
        id_article_deleted = article.id;
        grid_article_in_cart_deleted = grid_article_in_cart;
        line_deleted = line;
    }

    document.getElementById("overlay_alert_btn_yes").onclick = function () {
        cart_div.removeChild(grid_article_in_cart_deleted);
        cart_div.removeChild(line_deleted);
        let old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        old_data_saved = old_data_saved.filter(del => del.id != id_article_deleted);
        sessionStorage.setItem('articleToCart2', JSON.stringify(old_data_saved));
        document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + old_data_saved.length + ")";
        nb_article_in_cart.textContent = old_data_saved.length; 
        document.getElementById("overlay_alert").style.display = "none";



        //If the cart is empty, we show the image for it.
        if (old_data_saved.length == 0) {
            let grid_article_in_cart = document.createElement('div');
            grid_article_in_cart.className = "grid-container";
            grid_article_in_cart.style = "border: 2px solid rgb(230,230,230);  border-radius : 20px; ";

            let img = document.createElement('img');
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
            document.getElementById("nb_article_in_cart").textContent = 0;
            return cart_div;
        }
    }

    document.getElementById("overlay_alert_btn_no").onclick = function () {
        document.getElementById("overlay_alert").style.display = "none";
    }

    /*
    * We update the sessionStorage with the new quantity.
    * We re-calculate the price of the article according to the new quantity
    */
    box_select_plus.onclick = function () {
        let elem = document.getElementById('quantity_id' + article.id);
        elem.value = parseInt(elem.value) + 1;        
        total_price = total_price - parseFloat(price.textContent) + article.price * elem.value;
        price.nodeValue = (article.price * elem.value).toFixed(2) + "€";
        document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
        update_json_file(article, elem);
    };

 /*
there is a lot of call to JSON.parse and JSON.stringify, without counting the numberof parseInt|Float. 
The cart should get a class with an internal storage dumped when necessary this will remove many excessive call to those functions. 
This will also reduce memory movement making the job of the GC easier. keeping additional instances of the DOM object's could reduce the amount of lookup done in it and will enable you to create generic handler that will be instantiated only once.
You may also want to check but JSON.parse should automatically parse integer and floats.
*/
    /*
    * We make sure that the quantity of the article after the action is still superior to 0.
    * We update the sessionStorage with the new quantity.
    * We re-calculate the price of the article according to the new quantity
    */
    box_select_minus.onclick = function () {
        let elem = document.getElementById('quantity_id' + article.id);
        elem.value = parseInt(elem.value);
        if (elem.value - 1 != 0) {
            elem.value = elem.value - 1;
            total_price = total_price - parseFloat(price.textContent) + article.price * elem.value;
            price.nodeValue = (article.price * elem.value).toFixed(2) + "€";
            document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";   
            update_json_file(article, elem);
        }
    };

    /*
   * We update the sessionStorage with the new quantity.
   * We re-calculate the price of the article according to the new quantity
   */
    box_select_value.oninput = function () {      
        total_price = total_price - parseFloat(price.textContent) + article.price * this.value;
        price.nodeValue = (article.price * this.value).toFixed(2) + "€";
        document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
        update_json_file(article, this);
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
    line.className = "line_in_cart";
    cart_div.appendChild(line);
}
/**
 * Function used when we change the quantity of an article to save the changes into the sessionStorage
 * @param {any} article : object that contains the article
 * @param {any} elem : the input that contains the value of the quantity chosen for an article
 */
function update_json_file(article, elem) {
    let old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    var tab = [];
    for (let i = 0; i < old_data_saved.length; i++) {
        if (old_data_saved[i].id == article.id) {
            old_data_saved[i].quantity = elem.value;
        }
        tab.push(old_data_saved[i]);
    }
    sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
}
