

$(document).ready(function() {
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

    /*The code show the number of article in the cart*/
    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    if (old_data_saved) {
        document.getElementById("nb_article_in_cart").textContent = old_data_saved.length;
    }

    /*We read from the localStorage the properties of the article selected and then we create it*/
    let my_article = {
        "name"       : localStorage.getItem('name_article'),
        "description": localStorage.getItem('description_article'),
        "price"      : localStorage.getItem('price_article'),
        "brand"      : localStorage.getItem('brand_article'),
        "id"         : localStorage.getItem('id_article'),
        "preview"    : localStorage.getItem("image_article")
    };
    create_see_article(my_article);
});

/**
 * @param {any} description : the component that contains the text that will be cut
 * @param {any} text : the description on an article.
 * The function reads the description on an article in order to cut it with line break.
 */
function addText(description, text) {
    var t = text.split(/\n/), i;
    if (t[0].length > 0) {
        description.appendChild(document.createTextNode(t[0]));
    }
    for (i = 1;i < t.length;i++) {
        description.appendChild(document.createElement('BR'));
        if (t[i].length > 0) {
            description.appendChild(document.createTextNode(t[i]));
        }
    }
}
let articleToCreate;

/**
 * @param {any} article
 * The function is used to display a particular article.
 */
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
    articleToCreate = new seeArticle(article);
    articleToCreate.display_article();


}

function alertClosed() {
    document.getElementById("overlay_alert").classList.add('hidden');
    document.getElementById("popupAlert").classList.add('hidden');
}

class seeArticle {
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
        this.description = article.description;
    }

    display_article() {
        let myArticleTemp = articleToCreate;
        let imagediv = myArticleTemp._createImg();
        let name = myArticleTemp._createName();
        let brand = myArticleTemp._createBrand();
        let box_selectdiv = myArticleTemp._create_the_input_component();
        let price = myArticleTemp._createPrice();
        let descriptionP = myArticleTemp._createDescription();


        let container_product_div = document.getElementById("containerProduct");
        let box_article = document.createElement('div');
        box_article.id = 'box';
        let infoDiv = document.createElement('div');
        infoDiv.id = 'productDetails';
        let detailsDiv = document.createElement('div');
        detailsDiv.id = "detailDivId";
        let buttonDiv = document.createElement('div');
        buttonDiv.id = 'button';
        let emptydiv = document.createElement('div');
        emptydiv.id = "emptydiv";
        let add_btn = document.createElement('button');
        add_btn.id = "btn_add_article_to_cart";
        let add_btnContent = document.createTextNode('Ajouter au pannier');
        container_product_div.appendChild(box_article);
        box_article.appendChild(imagediv);
        box_article.appendChild(infoDiv);
        infoDiv.appendChild(name);
        infoDiv.appendChild(brand);
        infoDiv.appendChild(detailsDiv);
        detailsDiv.appendChild(price);
        detailsDiv.appendChild(buttonDiv);
        detailsDiv.appendChild(descriptionP);
        add_btn.appendChild(add_btnContent);
        buttonDiv.appendChild(box_selectdiv);
        buttonDiv.appendChild(emptydiv);
        buttonDiv.appendChild(add_btn);

        /*
             This function add to the cart the article by taking the following informations:
             - what is the article
             - in what quantity is the item purchased
             → Since our cart is saved in the sessionStorage, in order to have all the stuff put in there,
             we need to read the sessionStorage and then add the new element after verifying if it alreay exist
             in the cart or not

            * old_data_saved : the var that contains all the informations stored in the sessionStorage
            * quantity_article : the quantity of the item purchased
            * article_already_in_cart : has the value true if the article already exist in the cart of false in the other
            *  way around.
            */

        add_btn.onclick = function() {
            let quantity_article = document.getElementById('quantity').value;
            let old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
            let article_already_in_cart = false;
            if (old_data_saved != null) {
                for (let i = 0;i < old_data_saved.length;i++) {
                    if (old_data_saved[i].id == myArticleTemp.id) {
                        old_data_saved[i].quantity = parseInt(old_data_saved[i].quantity) + parseInt(quantity_article);
                        article_already_in_cart = true;
                        console.log(old_data_saved[i]);
                    }
                }
            } else {
                old_data_saved = [];
            }

            if (!article_already_in_cart) {
                old_data_saved.push({
                    'id': myArticleTemp.id, 'name': myArticleTemp.name, 'price': myArticleTemp.price, 'brand': myArticleTemp.brand, 'description': myArticleTemp.description, 'preview': myArticleTemp.image, 'quantity': quantity_article
                });
                document.getElementById("nb_article_in_cart").textContent = old_data_saved.length;
            }
            sessionStorage.setItem('articleToCart2', JSON.stringify(old_data_saved));
            document.getElementById("overlay_alert").classList.remove('hidden');
            document.getElementById("popupAlert").classList.remove('hidden');
            setTimeout(alertClosed, 1500);
        };
        return box_article;


    }

    _createDescription() {
        let descriptionP = document.createElement('p');
        let descriptionPContent = document.createTextNode("Description : " + this.description);
        addText(descriptionP, this.description);
        descriptionP.id = 'descriptionP';
        descriptionP.appendChild(descriptionPContent);
        return descriptionP;
    }

    _createPrice() {
        let price = document.createElement('h3');
        price.id = 'price';
        let priceContent = document.createTextNode(parseFloat(this.price).toFixed(2) + "€");
        price.appendChild(priceContent);
        return price;
    }

    _createImg() {
        let imagediv = document.createElement('div');
        imagediv.id = 'imageSection';
        let image = document.createElement('img');
        image.src = this.image;
        imagediv.appendChild(image);
        return imagediv;
    }

    _createName() {
        let name = document.createElement('h1');
        name.id = "nameId";
        let nameContent = document.createTextNode(this.name);
        name.appendChild(nameContent);
        return name;

    }

    _createBrand() {
        let brand = document.createElement('h3');
        brand.id = "brandId";
        let brandContent = document.createTextNode(this.brand);
        brand.appendChild(brandContent);
        return brand;
    }

    _create_the_input_component() {
        let box_selectdiv = document.createElement('div');
        box_selectdiv.className = "number-input";
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

        /*
        * When we click on the plus button, the quantity of the article is updated in the view.
        */
        box_select_plus.onclick = function() {
            document.getElementById('quantity').value = parseInt(document.getElementById('quantity').value) + 1;
        };

        /*
         * When we click on the minus button, the quantity of the article is updated in the view as long as the value is superior to 0.
         */
        box_select_minus.onclick = function() {
            if (!(parseInt(document.getElementById('quantity').value) - 1 == 0)) {
                document.getElementById('quantity').value = parseInt(document.getElementById('quantity').value) - 1;
            }
        };
        return box_selectdiv;
    }


}