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
 *The code show the number of article in the cart
 */
$(document).ready(function () {
    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    document.getElementById("nb_article_in_cart").textContent = Object.keys(old_data_saved).length;
});
                                   
function create_see_article(article) {
    /*
     * We create all the html components needed:
     * - imagediv : the div that will contains image (img)
     * - image : the preview of the article
     * - detailsDiv :
     * - buttonDiv : a div that contains
     * - infoDiv : a div that contains
     * - name = a <h1> that contains the name of the article (nameContent)
     * - price : a <h3> that contains the price of the article (priceContent)
     * - brand : a <h3> that contains the brand of the article (brandContent)
     * - descriptionP : a <p> that contains the Description of the article (descriptionPContent)
     * - add_btn : a <button> to add the article to the cart
     * - box_selectdiv: a div  that contains the input of type number with the button minus and plus
     * - box_select_minus : a <button> to reduce the quantity wanted for an article of 1
     * - box_select_plus : a <button> to increase the quantity wanted for an article of 1
     */
    let box_article = document.createElement('div');
    box_article.id = 'box';
    let imagediv = document.createElement('div');
    imagediv.id = 'imageSection';
    let infoDiv = document.createElement('div');
    infoDiv.id = 'productDetails';
    let detailsDiv = document.createElement('div');
    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';
    let box_selectdiv = document.createElement('div');
    box_selectdiv.className = "number-input";
    let emptydiv = document.createElement('div');
    emptydiv.style = "height: 12px; ";

    let image = document.createElement('img');
    image.src = article.preview;

    let name = document.createElement('h1');
    let nameContent = document.createTextNode(article.name);
    let price = document.createElement('h3');
    let priceContent = document.createTextNode("Prix unitaire : " + article.price + "€");
    let brand = document.createElement('h3');
    let brandContent = document.createTextNode(article.brand);

    let descriptionP = document.createElement('p');
    let descriptionPContent = document.createTextNode("Description : " + article.description);

    let add_btn = document.createElement('button');
    add_btn.id = "btn_add_article_to_cart";
    let box_select_minus = document.createElement('button');
    let box_select_plus = document.createElement('button');
    box_select_plus.className = "plus";

    let box_select_value = document.createElement('input');
    box_select_value.type = "number";
    box_select_value.id = "quantity";
    box_select_value.value = 1;
    box_selectdiv.appendChild(box_select_minus);
    box_selectdiv.appendChild(box_select_value);
    box_selectdiv.appendChild(box_select_plus);

    box_select_plus.onclick = function () {
        document.getElementById('quantity').value = parseInt(document.getElementById('quantity').value) + 1;
    };

    box_select_minus.onclick = function () {
        if (!(parseInt(document.getElementById('quantity').value) - 1 == 0)) {
            document.getElementById('quantity').value = parseInt(document.getElementById('quantity').value) - 1;
        }
    };

    add_btnContent = document.createTextNode('Ajouter au pannier');

    container_product_div.appendChild(box_article);
    imagediv.appendChild(image);
    name.appendChild(nameContent);
    brand.appendChild(brandContent);
    price.appendChild(priceContent);
    descriptionP.appendChild(descriptionPContent);
    box_article.appendChild(imagediv);
    box_article.appendChild(infoDiv);
    infoDiv.appendChild(name);
    infoDiv.appendChild(brand);
    infoDiv.appendChild(detailsDiv);
    infoDiv.appendChild(buttonDiv);
    detailsDiv.appendChild(price);
    detailsDiv.appendChild(descriptionP);
    add_btn.appendChild(add_btnContent);
    buttonDiv.appendChild(box_selectdiv);
    buttonDiv.appendChild(emptydiv);
    buttonDiv.appendChild(add_btn);

/*
     This function add to the cart the article by taking the following informations:
     - what is the article
     - in what quantity is the item purchased
     → Since our cart is saved in the sessionStorage, in order to have all the stuff put in there, we need to read the sessionStorage and then add the new element after verifying if it alreay exist in the cart or not

    * old_data_saved : the var that contains all the informations stored in the sessionStorage
    * quantity_article : the quantity of the item purchased
    * tab : the array that contains all the json array to save into the sessionStorage.
    * article_already_in_cart : has the value true if the article already exist in the cart of false in the other way around.
    */

    add_btn.onclick = function () {
        var quantity_article = document.getElementById('quantity').value;
        var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        var tab = [];
        var article_already_in_cart = false;
        if (old_data_saved != null || Object.keys(old_data_saved).length != 0) {
            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (old_data_saved[i].id == article.id) {
                    old_data_saved[i].quantity = parseInt(old_data_saved[i].quantity) + parseInt(quantity_article);
                    article_already_in_cart = true;
                }
                tab.push(old_data_saved[i]);
            }
        }

        if (article_already_in_cart == false) {
            tab.push({ 'id': article.id, 'name': article.name, 'price': article.price, 'brand': article.brand, 'description': article.description, 'preview': article.preview, 'quantity': quantity_article });
        }
        sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
    }
    return box_article
}