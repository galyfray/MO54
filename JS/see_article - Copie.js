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
        console.log("add to cart " + document.getElementById('quantity').value);
        var quantite = document.getElementById('quantity').value;
        //var articleToCart = { 'name': article.brand, 'description': article.description, 'preview': article.preview, 'quantity' : quantite };
        //sessionStorage.setItem('articleToCart', JSON.stringify(articleToCart));
        var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        var tab = [];
 //       var count = Object.keys(old_data_saved).length;
   //     console.log(count);
        for (i = 0; i < Object.keys(old_data_saved).length; i++) {
            tab.push(old_data_saved[i]);
        }
        
        tab.push({ 'name': article.name, 'price': article.price, 'brand' : article.brand, 'description': article.description, 'preview': article.preview, 'quantity': quantite });

       // tab_contain_sessionStorage.push(old_data_saved);
       // tab_contain_sessionStorage.push({ 'name': article.brand, 'description': article.description, 'preview': article.preview, 'quantity': quantite });
        sessionStorage.setItem('articleToCart2', JSON.stringify(tab));

       // sessionStorage.setItem('articleToCart2', JSON.stringify(tab_contain_sessionStorage));
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
