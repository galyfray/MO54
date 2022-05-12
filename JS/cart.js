
    let boxArticleDiv = document.createElement('div');
    boxArticleDiv.id = 'boxContainer';

    /*It is here to test the function. In the future, the function createCart will directly use a file*/
    /*createCart({"id": "1", "name": "Pneu Michelin 244", "preview": "https://mistervsp.fr/wp-content/uploads/2019/06/pneu-1456013-mistervsp.jpg", "description": "Un pneu", "brand": "Michelin", "price": 49.99 }, 2);
    createCart({"id": "4", "name": "Pneu d'été", "preview": "https://bcdn.1001pneus.fr/media/catalog/category/MICHELIN_ALPIN_5.jpg", "description": "Pneu Michelin", "brand": "Continental", "price": 12.50 }, 12);
    createCart({"id": "12", "name": "Chat", "preview": "https://voyage-onirique.com/wp-content/uploads/2020/02/647220.jpg", "description": "Un chat inconnu", "brand": "Unknown", "price": 15 }, 3);
    createCart({"id": "1", "name": "Chat mignon", "preview": "https://www.zooplus.fr/magazine/wp-content/uploads/2018/05/ragdoll1.jpg", "description": "Un chat de race", "brand": "RagDoll", "price": 122.50 }, 4);
    createCart({"id": "1", "name": "Chat mignon", "preview": "https://www.zooplus.fr/magazine/wp-content/uploads/2018/05/ragdoll1.jpg", "description": "Un chat de race", "brand": "RagDoll", "price": 122.50 }, 4);
    */
    /**
     * This function is used to create the cart. We create all the different html component that are needed.

     * @param ob : the object we are working on. It has for now those properties: name, image, description, brand and price.
     * @param nbArticle : the quantity asked by the user for an article.
     */
    function createCart(ob, nbArticle) {
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
        console.log(ob);
        alert(ob);
        alert('mia');
        let grid_article_in_cart = document.createElement('div');
        grid_article_in_cart.className = "grid-container";
        grid_article_in_cart.style = "background-color:rgb(230,230,230); ";

        let img = document.createElement('img')
        img.src = ob.preview;
        img.style = "width: 150px; height: 150px;";

        let img_cart_div = document.createElement('div');
        img_cart_div.className = "img_cart";
        img_cart_div.appendChild(img);

        let del = document.createElement('i');
        del.className = "fa fa-trash";
        del.style = "font-size: 20px;";

        let del_cart_div = document.createElement('div');
        del_cart_div.className = "del_cart";
        del_cart_div.appendChild(del);

        let name = document.createTextNode(ob.name);
        let name_cart_div = document.createElement('div');
        name_cart_div.className = "name_cart";
        name_cart_div.appendChild(name);

        let info_cart_div = document.createElement('div');
        info_cart_div.className = "info_cart";

        let brand = document.createTextNode(ob.brand);

        let brand_div = document.createElement('div');
        brand_div.style = "text-align: left;"


        let prix = document.createTextNode(ob.price * nbArticle + "€");
        let prix_div = document.createElement('div');
        prix_div.style = "text-align: left;";


        //Too much for cart I think
        /*   let text3_div = document.createElement('div');
           let description = document.createTextNode("Description : " + ob.description);
           text3_div.style = "text-align: left;";
           */

        let quantite_div = document.createElement('div');
        quantite_div.style = "content-align : left;";
        let quantite = document.createElement('input');
        quantite.type = "number";
        quantite.style = "text-align: center; width : 30px;"
        quantite.min = "1";
        quantite.value = nbArticle;

        let label_quantite = document.createElement('label');
        label_quantite.textContent = "Quantité : ";
        label_quantite.style = "display: inline-block; text-align: left;";
        quantite_div.appendChild(label_quantite);
        quantite_div.appendChild(quantite);
        quantite_div.style = "align-content: left;";
        boxArticleDiv.style = "padding-bottom: 3px;";

        grid_article_in_cart.appendChild(img_cart_div);
        brand_div.appendChild(brand);
        prix_div.appendChild(prix);
        info_cart_div.appendChild(brand_div);
        info_cart_div.appendChild(prix_div);
        info_cart_div.appendChild(quantite_div);
        grid_article_in_cart.appendChild(del_cart_div);
        grid_article_in_cart.appendChild(name_cart_div);
        grid_article_in_cart.appendChild(info_cart_div);
        boxArticleDiv.appendChild(grid_article_in_cart);
        cart_div.appendChild(boxArticleDiv);
        return cart_div


    }













function createCart2(ob) {
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
    img.src = ob.preview;
    img.className = "img_cart";

    let img_cart_div = document.createElement('div');
    img_cart_div.className = "img_cart";
    img_cart_div.appendChild(img);


    let name = document.createTextNode(ob.name);
    let name_cart_div = document.createElement('div');
    name_cart_div.className = "name_cart";
    name_cart_div.appendChild(name);


    let info_cart_div = document.createElement('div');
    info_cart_div.className = "info_cart";  

    let brand = document.createTextNode(ob.brand);
    let brand_div = document.createElement('div');
    brand_div.style = "text-align: left;"
    brand_div.className = "brand_div_cart";


    let prix = document.createTextNode((ob.price * ob.quantity).toFixed(2) + "€");


    let prix_div = document.createElement('div');
    prix_div.style = "text-align: left;";
    prix_div.className = "prix_cart";
    prix.id = "price_id" + ob.id;



    let box_selectdiv = document.createElement('div');
    box_selectdiv.className = "number-input";

    let box_select_minus = document.createElement('button');
    /*box_select_minus.onclick = function () {
        this.parentNode.querySelector('input[type=number]').stepDown();
        //mettre à jour la sessionstorage derrière
    }*/
    let box_select_plus = document.createElement('button');
    /*box_select_plus.onclick = function () {
        this.parentNode.querySelector('input[type=number]').stepUp();
        //mettre à jour la sessionstorage derrière
    }*/
    box_select_plus.className = "plus";
    let box_select_value = document.createElement('input');
    box_select_value.className = "quantity";
    box_select_value.min = "1";
    box_select_value.name = "quantity";
    box_select_value.type = "number";
    box_select_value.id = "quantite_id_v2" + ob.id;
    box_select_value.value = ob.quantity;
    box_selectdiv.appendChild(box_select_minus);
    box_selectdiv.appendChild(box_select_value);
    box_selectdiv.appendChild(box_select_plus);


    box_select_plus.onclick = function () {
        var intermediaire = document.getElementById('quantite_id_v2' + ob.id).value;
        document.getElementById('quantite_id_v2' + ob.id).value = parseInt(intermediaire) + 1;
        prix_div.removeChild(prix);
        prix = document.createTextNode((ob.price * (parseInt(intermediaire) + 1)).toFixed(2) + "€");
        prix_div.appendChild(prix);
        //mettre à jour la sessionstorage derrière = lire tout et mettre à jour la quantité seulemnt

        var quantite = document.getElementById('quantite_id_v2' + ob.id).value;
        var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
        var tab = [];

        var article_found = false;
        for (i = 0; i < Object.keys(old_data_saved).length; i++) {
            if (old_data_saved[i].id == ob.id) {
                old_data_saved[i].quantity = parseInt(quantite);
                article_found = true;
            }
            tab.push(old_data_saved[i]);
        }
        sessionStorage.setItem('articleToCart2', JSON.stringify(tab));
    };

    box_select_minus.onclick = function () {
        var intermediaire = document.getElementById('quantite_id_v2' + ob.id).value;
        if (!(parseInt(intermediaire) - 1 == 0)) {
            document.getElementById('quantite_id_v2' + ob.id).value = parseInt(intermediaire) - 1;
            prix_div.removeChild(prix);
            prix = document.createTextNode((ob.price * (parseInt(intermediaire) - 1)).toFixed(2) + "€");
            prix_div.appendChild(prix);
            //mettre à jour la sessionstorage derrière
            var quantite = document.getElementById('quantite_id_v2' + ob.id).value;
            var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
            var tab = [];

            var article_found = false;
            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (old_data_saved[i].id == ob.id) {
                    old_data_saved[i].quantity = parseInt(quantite);
                    article_found = true;
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
        if (confirm('Etes vous sûr de vouloir retirer cet article du pannier? ')) {
            cart_div.removeChild(grid_article_in_cart);
            cart_div.removeChild(line);
            nb_article_by_createCart = nb_article_by_createCart - 1;
            document.getElementById("nb_object_in_cart").textContent = "Votre panier (" + nb_article_by_createCart + ")";
            nb_article_in_cart.textContent = nb_article_by_createCart;

            //mettre à jour la sessionstorage derrière
            var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
            var tab = [];

            for (i = 0; i < Object.keys(old_data_saved).length; i++) {
                if (!(old_data_saved[i].id == ob.id)) {
                    tab.push(old_data_saved[i]);
                }
                
                
            }
            sessionStorage.setItem('articleToCart2', JSON.stringify(tab));


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