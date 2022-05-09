let contentTitle;

function create_list_article(article) {
    //Create all component needed for an article
  let html_component_div_container = document.createElement("div");
  html_component_div_container.id = "box";
  let html_component_article_image = document.createElement("img");
  let html_component_article_info_div = document.createElement("div");
  html_component_article_info_div.id = "details";
  let html_component_article_name = document.createElement("h3");
  let html_component_article_brand = document.createElement("h4");
  let html_component_article_price = document.createElement("h2");
  let boxLink = document.createElement("a");
  
  // put in the right place the component
  html_component_div_container.appendChild(boxLink);
  boxLink.appendChild(html_component_article_image);
  boxLink.appendChild(html_component_article_info_div);
  html_component_article_info_div.appendChild(html_component_article_name);
  html_component_article_info_div.appendChild(html_component_article_brand);
  html_component_article_info_div.appendChild(html_component_article_price);

  //Add value inside the box/title/image
  let article_price = document.createTextNode(article.price + "€");
  html_component_article_price.appendChild(article_price);

  let article_name = document.createTextNode(article.name);
  html_component_article_name.appendChild(article_name);

  let article_brand = document.createTextNode(article.brand);
  html_component_article_brand.appendChild(article_brand);

//  boxLink.href = "/contentDetails.html?" + article.id;
  html_component_article_image.src = article.preview;
  


  
  return html_component_div_container;
}

let mainContainer = document.getElementById("mainContainer");
let div_container_all_article = document.getElementById("div_container_all_article");

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);
      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }
      for (let i = 0; i < contentTitle.length; i++) {
        console.log(contentTitle[i]);
        div_container_all_article.appendChild(
            create_list_article(contentTitle[i])
        );
        
      }
    } else {
      console.log("fail");
    }
  }
};
httpRequest.open(
  "GET",
  "https://raw.githubusercontent.com/Yasmarila/Site_web_test/main/test?token=GHSAT0AAAAAABUG3RZ54HFADMTOOR3BR7LSYTT3VOQ",
 true
);
httpRequest.send();