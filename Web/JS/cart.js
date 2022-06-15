/*
 * Total_price : variable used to know the final price to pay for the cart.
 * It's a global var because it will be used when an article is created
 * and also when the quantity of the article is updated.
 * grid_article_in_cart_deleted : use to delete the grid for an article in the cart
 * once the "Yes" button has been clicked to confirm the deletion.
 * line_deleted : same reasons as grid_article_in_cart_deleted
  * id_article_deleted : we need to have the id of the article that will be deleted
 * once the  "Yes" button has been clicked to confirm the deletion.
 */
let total_price = 0;
let id_article_deleted;
let grid_article_in_cart_deleted;
let line_deleted;
let myCart;//Used to avoid the calls to the sessionStorage
let myArticle;
let nb_article_in_cart;

$(document).ready(function() {
    'use strict';

    //The function to make the navigation works
    (function() {
        'use strict';
        // eslint-disable-next-line no-undef
        new hcOffcanvasNav('#main-nav', {
            disableAt       : false,
            customToggle    : '.menu_icon',
            levelSpacing    : 40,
            navTitle        : 'All',
            levelTitles     : true,
            levelTitleAsBack: true,
            pushContent     : '#container',
            labelClose      : false
        });
    })(jQuery);

    /*
     * We load the stuff saved in the sessionStorage and then we check if it's empty or not.
     * If this is empty : we create an image with a text saying that the cart is empty.
     * If not : we create all the articles to show them.
     */
    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    myCart = new Cart(old_data_saved);
    myCart.check_content();

});

/**
 * This function is used to create the cart. We create all the different html components that are needed.
 * @param article : the object we are working on. It has for now those properties: name, image, description, brand and price.
 */
function createCart2(article) {
    myArticle = new CartArticle(article);
    myArticle.create_the_article_in_the_cart();
}

/**
 * Function used when we change the quantity of an article to save the changes into the sessionStorage
 * @param {any} article : object that contains the article
 * @param {any} elem : the input that contains the value of the quantity chosen for an article
 */
function update_json_file(article, elem) {
    'use strict';
    let old_data_saved = myCart.dataStored;
    for (let i = 0;i < old_data_saved.length;i++) {
        if (old_data_saved[i].id == article.id) {
            old_data_saved[i].quantity = elem.value;
        }
    }
    sessionStorage.setItem('articleToCart2', JSON.stringify(old_data_saved));
}

class Cart {

    constructor(data) {
        this.dataStored = data;
    }

    check_content() {
        if (!this.dataStored || this.dataStored.length == 0) {
            let cart_div = document.getElementById('div_container_all_article_in_cart');
            this._draw_empty_cart(cart_div);
        } else {
            for (let i = 0;i < this.dataStored.length;i++) {
                createCart2(this.dataStored[i]);
                total_price += parseFloat(this.dataStored[i].price) * parseInt(this.dataStored[i].quantity);
            }
            document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
            document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + this.dataStored.length + ")";

            //Nb_article_in_cart.textContent = this.dataStored.length;
            nb_article_in_cart = document.getElementById("nb_article_in_cart").textContent = this.dataStored.length;
        }
    }

    _draw_empty_cart(cart_div) {
    /*
    * Img : the image that says there is nothing in the cart
    * img_cart_div: the div that contains the image
    * warning: the text for the warning_div 'Il n'y a aucun article dans le panier'
    * warning_div : the div that contain the text written in warning
    */
        let grid_article_in_cart = document.createElement('div');
        grid_article_in_cart.className = "grid-container";
        let img = document.createElement('img');
        img.src = "./nothing_in_cart.png";
        img.className = "img_cart_empty";
        let img_cart_div = document.createElement('div');
        img_cart_div.appendChild(img);
        img_cart_div.className = "img_cart_empty";
        let warning = document.createTextNode("Il n'y a aucun article dans le panier");
        let warning_div = document.createElement('div');
        warning_div.className = "name_cart";
        warning_div.appendChild(warning);
        cart_div.appendChild(img_cart_div);
        cart_div.appendChild(warning_div);
        document.getElementById("nb_object_in_cart").textContent = "Hum...";
        document.getElementById("total_to_pay").textContent = "";
        document.getElementById("nb_article_in_cart").textContent = 0;
    }
}
class CartArticle {
    /**
     * The constructor and the method is used to create all articles that need to be displayed in the cart.
     * @param {any} article : the object containing all the information we need to create an article in the cart
     */
    constructor(article) {
        this.name = article.name;
        this.price = article.price;
        this.image = article.preview;
        this.brand = article.brand;
        this.id = article.id;
        this.quantity = article.quantity;
    }

    create_the_article_in_the_cart() {
        /*
     * Grid_article_in_cart: the grid that contains all the information for an article
     * img_cart_div : the div that contains the image of the article
     * name_cart_div : the div that contains the name of the article
     * info_cart_div : the div that contains the other informations about an article (brand, price, quantity)
     * brand_div : the div that contains the brand of the article
     * price : the price of the article
     * price_div : the div that contains the price of the article
     */

        let myArticleTemp = myArticle; // Won't work without it for the input
        let cart_div = document.getElementById('div_container_all_article_in_cart');
        let grid_article_in_cart = document.createElement('div');
        grid_article_in_cart.className = "grid-container";
        let img_cart_div = myArticleTemp._create_image();
        let name_cart_div = myArticleTemp._create_name();
        let brand_div = myArticleTemp._create_brand();
        let {price_div, price} = myArticleTemp._create_price();
        let {
            box_selectdiv, box_select_minus, box_select_value, box_select_plus
        } = myArticleTemp._create_the_input_component();
        let del_text_div = myArticleTemp._create_del_option();
        let info_cart_div = document.createElement('div');
        info_cart_div.className = "info_cart";

        //We update the SessionStorage (deletion) and update the number of article in the cart.
        del_text_div.addEventListener('click', function() {
            document.getElementById("overlay_alert").classList.remove("hidden");
            document.getElementById("popupAlert").classList.remove("hidden");
            id_article_deleted = myArticle.id;
            grid_article_in_cart_deleted = grid_article_in_cart;
            line_deleted = line;
        });
        document.getElementById("overlay_alert_btn_yes").addEventListener('click', function() {
            cart_div.removeChild(grid_article_in_cart_deleted);
            cart_div.removeChild(line_deleted);

            let old_data_saved = myCart.dataStored;
            old_data_saved = old_data_saved.filter(del => del.id != id_article_deleted);
            sessionStorage.setItem('articleToCart2', JSON.stringify(old_data_saved));
            document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + old_data_saved.length + ")";
            nb_article_in_cart.textContent = old_data_saved.length;
            document.getElementById("overlay_alert").classList.add("hidden");
            document.getElementById("popupAlert").classList.add("hidden");

            //If the cart is empty, we show the image for it.
            if (old_data_saved.length == 0) {
                empty_cart_displayed(cart_div);
            }
        });
        document.getElementById("overlay_alert_btn_no").addEventListener('click', function() {
            document.getElementById("overlay_alert").classList.add("hidden");
        });

        //We update the sessionStorage and re-calculate the price of the article with the new quantity.
        box_select_plus.addEventListener('click', function() {
            let elem = document.getElementById('quantity_id' + myArticleTemp.id);
            elem.value = parseInt(elem.value) + 1;
            total_price = total_price - parseFloat(price.textContent) + myArticleTemp.price * elem.value;
            price.nodeValue = (myArticleTemp.price * elem.value).toFixed(2) + "€";
            document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
            update_json_file(myArticleTemp, elem);
        });

        //We ensure that the quantity is still > 0 & update sessionStorage with the new quantity & calculate the price of the article.
        box_select_minus.addEventListener('click', function() {
            let elem = document.getElementById('quantity_id' + myArticleTemp.id);
            elem.value = parseInt(elem.value);
            if (elem.value - 1 != 0) {
                elem.value = elem.value - 1;
                total_price = total_price - parseFloat(price.textContent) + myArticleTemp.price * elem.value;
                price.nodeValue = (myArticleTemp.price * elem.value).toFixed(2) + "€";
                document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
                update_json_file(myArticleTemp, elem);
            }
        });

        //We update the sessionStorage and re-calculate the price of the article with the new quantity.
        box_select_value.addEventListener('input', function() {
            total_price = total_price - parseFloat(price.textContent) + myArticleTemp.price * this.value;
            price.nodeValue = (myArticleTemp.price * this.value).toFixed(2) + "€";
            document.getElementById("total_to_pay").textContent = "Total : " + total_price.toFixed(2) + " €";
            update_json_file(myArticleTemp, this);
        });
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

    /*Method used to create the component linked to the image of an article*/
    _create_image() {
        let img = document.createElement('img');
        img.src = this.image;
        img.className = "img_cart";

        let img_cart_div = document.createElement('div');
        img_cart_div.className = "img_cart";
        img_cart_div.appendChild(img);
        return img_cart_div;
    }


    /*Method used to create the component linked to the name of an article*/
    _create_name() {
        let name = document.createTextNode(this.name);
        let name_cart_div = document.createElement('div');
        name_cart_div.className = "name_cart";
        name_cart_div.appendChild(name);
        return name_cart_div;
    }


    /*Method used to create the component linked to the deletion of an article*/
    _create_del_option() {
        let delt_text = document.createElement('h4');
        delt_text.textContent = "Supprimer du pannier";
        let del_text_div = document.createElement('div');
        del_text_div.appendChild(delt_text);
        del_text_div.className = "del_text_div";
        return del_text_div;
    }


    /*Method used to create the component linked to the brand of an article*/
    _create_brand() {
        let brand = document.createTextNode(this.brand);
        let brand_div = document.createElement('div');
        brand_div.className = "brand_div_cart";
        brand_div.appendChild(brand);
        return brand_div;
    }


    /*Method used to create the component linked to the price of an article*/
    _create_price() {
        let price = document.createTextNode((this.price * this.quantity).toFixed(2) + "€");
        let price_div = document.createElement('div');
        price_div.className = "prix_cart";
        price_div.appendChild(price);
        return {price_div, price};
    }


    /*Method used to create the components linked to the input for the quantity of an article*/
    _create_the_input_component() {
        let box_select_value = document.createElement('input');
        box_select_value.className = "quantity";
        box_select_value.type = "number";
        box_select_value.min = "1";
        box_select_value.id = "quantity_id" + this.id;
        box_select_value.value = this.quantity;
        let box_selectdiv = document.createElement('div');
        box_selectdiv.className = "number-input";
        let box_select_minus = document.createElement('button');
        let box_select_plus = document.createElement('button');
        box_select_plus.className = "plus";
        box_selectdiv.appendChild(box_select_minus);
        box_selectdiv.appendChild(box_select_value);
        box_selectdiv.appendChild(box_select_plus);
        return {
            box_selectdiv, box_select_minus, box_select_value, box_select_plus
        };
    }
}

/**
 * Create the component to show to the user that the cart is empty
 * @param {any} cart_div : the div that will contain the html component for the empty cart
 */
function empty_cart_displayed(cart_div) {
/*
    * Img : the image that says there is nothing in the cart
    * img_cart_div: the div that contains the image
    * warning: the text for the warning_div 'Il n'y a aucun article dans le panier'
    * warning_div : the div that contain the text written in warning
*/
    let grid_article_in_cart = document.createElement('div');
    grid_article_in_cart.className = "grid-container";
    let img = document.createElement('img');
    img.src = ".nothing_in_cart.png";
    img.className = "img_cart_empty";
    let img_cart_div = document.createElement('div');
    img_cart_div.appendChild(img);
    img_cart_div.className = "img_cart_empty";
    let warning = document.createTextNode("Il n'y a aucun article dans le panier");
    let warning_div = document.createElement('div');
    warning_div.className = "name_cart";
    warning_div.appendChild(warning);
    cart_div.appendChild(img_cart_div);
    cart_div.appendChild(warning_div);
    document.getElementById("nb_object_in_cart").textContent = "Hum...";
    document.getElementById("total_to_pay").textContent = "";
    document.getElementById("nb_article_in_cart").textContent = 0;
}