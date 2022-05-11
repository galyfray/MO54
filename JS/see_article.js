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

                                    


        function create_see_article(ob) {
            let mainContainer = document.createElement('div')
            mainContainer.id = 'containerD'
           // container_product_div.appendChild(mainContainer);
//            let container_product_div = $("div[id='containerProduct']");
            //let container_product_div = $('containerProduct');
           // let container_product_div = $("#containerProduct");

            //console.log(container_product_div);
            container_product_div.appendChild(mainContainer);
          //  document.getElementById('containerProduct').appendChild(mainContainer);

            let imageSectionDiv = document.createElement('div')
            imageSectionDiv.id = 'imageSection'

            let imgTag = document.createElement('img')
            imgTag.id = 'imgDetails'
            imgTag.src = ob.preview

            imageSectionDiv.appendChild(imgTag)

            let productDetailsDiv = document.createElement('div')
            productDetailsDiv.id = 'productDetails'

            let h1 = document.createElement('h1')
            let h1Text = document.createTextNode(ob.name)
            h1.appendChild(h1Text)

            let h4 = document.createElement('h4')
            let h4Text = document.createTextNode(ob.brand)
            h4.appendChild(h4Text)
            console.log(h4);

            let detailsDiv = document.createElement('div')
            detailsDiv.id = 'details'

            let h3DetailsDiv = document.createElement('h3')
            let h3DetailsText = document.createTextNode(ob.price + "€");
            h3DetailsDiv.appendChild(h3DetailsText)

            let h3 = document.createElement('h3')
            let h3Text = document.createTextNode('Description')
            h3.appendChild(h3Text)

            let para = document.createElement('p')
            let paraText = document.createTextNode(ob.description)
            para.appendChild(paraText)


            let buttonDiv = document.createElement('div')
            buttonDiv.id = 'button'

            let buttonTag = document.createElement('button')
            buttonDiv.appendChild(buttonTag)

            buttonText = document.createTextNode('Add to Cart')
            buttonTag.onclick = function () {
                                        console.log("add to cart");
            }
            buttonTag.appendChild(buttonText)


            console.log(mainContainer.appendChild(imageSectionDiv));
            mainContainer.appendChild(imageSectionDiv)
            mainContainer.appendChild(productDetailsDiv)
            productDetailsDiv.appendChild(h1)
            productDetailsDiv.appendChild(h4)
            productDetailsDiv.appendChild(detailsDiv)
            detailsDiv.appendChild(h3DetailsDiv)
            detailsDiv.appendChild(h3)
            detailsDiv.appendChild(para)
            productDetailsDiv.appendChild(buttonDiv)


            return mainContainer
        }
