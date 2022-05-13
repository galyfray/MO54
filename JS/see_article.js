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

                                    
var tab_contain_sessionStorage = [];

function create_see_article(article) {
    /*
     * We create all the html component needed:
     * - box_article : 
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
    detailsDiv.id = 'details';
    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let image = document.createElement('img');
    image.id = 'imgDetails';
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

    let box_selectdiv = document.createElement('div');
    box_selectdiv.className = "number-input";

    let box_select_minus = document.createElement('button');
    box_select_minus.onclick = function () {
        this.parentNode.querySelector('input[type=number]').stepDown();
    }
    let box_select_plus = document.createElement('button');
    box_select_plus.onclick = function () {
        this.parentNode.querySelector('input[type=number]').stepUp();
    }
    box_select_plus.className = "plus";
    let box_select_value = document.createElement('input');
    box_select_value.min = "1";
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



    container_product_div.appendChild(box_article);
    imagediv.appendChild(image)
    name.appendChild(nameContent)
    brand.appendChild(brandContent);
    price.appendChild(priceContent);
    

    descriptionP.appendChild(descriptionPContent);


    add_btnContent = document.createTextNode('Ajouter au pannier');
    
    add_btn.onclick = function () {
        /*
         This code add to the cart the article by taking the following informations:
         - what is the article
         - what quantity is the item purchased
         → Since our cart is saved in the sessionStorage, in order to have all the stuff put in there, we need to read the sessionStorage and then add the new element.

        old_data_saved : the var that contains all the informations stored in the sessionStorage
        quantite : the quantity of the item purchased
        tab : the array that contains all the json array to save into the sessionStorage.
        */
        var quantite = document.getElementById('quantity').value;
        var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        var tab = [];
        //on doit vérifier avant de placer dans le tableau que l'item que l'on a a pas le même id qu'un item déjà saved

        var article_already_in_cart = false;
        if (old_data_saved != null) {
            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (old_data_saved[i].id == article.id) {
                    old_data_saved[i].quantity = parseInt(old_data_saved[i].quantity) + parseInt(quantite);
                    article_already_in_cart = true;
                }
                tab.push(old_data_saved[i]);
            }
        }
        
        if (article_already_in_cart == false) {
            tab.push({ 'id': article.id, 'name': article.name, 'price': article.price, 'brand': article.brand, 'description': article.description, 'preview': article.preview, 'quantity': quantite });
        }
       
        
        sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
        var retrievedPerson2 = JSON.parse(sessionStorage.getItem('articleToCart2'));
        console.log(retrievedPerson2);
    }

    box_article.appendChild(imagediv)
    box_article.appendChild(infoDiv)
    buttonDiv.appendChild(box_selectdiv);
    infoDiv.appendChild(name)
    infoDiv.appendChild(brand)
    infoDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(price)
    detailsDiv.appendChild(descriptionP)
    infoDiv.appendChild(buttonDiv)

    let emptydiv = document.createElement('div');
    emptydiv.style = "height: 12px; ";

    add_btn.appendChild(add_btnContent);
    buttonDiv.appendChild(emptydiv);
    buttonDiv.appendChild(add_btn);

    return box_article
}