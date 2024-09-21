const app = document.querySelector('#products');
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    // convert the data to html template
    const template = data.map((prdct, id) => 
`<section name="product_info">
    <div class="picture">
        <picture>
            <source media="(min-width:725px)" srcset="${prdct.image.desktop}">
            <source media="(min-width:525px)" srcset="${prdct.image.tablet}">
            <img src="${prdct.image.mobile}" alt="${prdct.category}" />

            <div id="div_${id}" class="add-cart" data-name="${prdct.name}" data-price="${prdct.price}" data-category="${prdct.image.thumbnail}">
                
            </div>
        </picture>
    </div>

    <div class="card">
        <header class="card__header">${prdct.category}</header>
        <p class="card__description">${prdct.name}</p>
        <p class="card__price">${(prdct.price).toFixed(2)}</p>
    </div>
</section>`
    ).join('');
    // create a virtual container
    const range = document.createRange();
    // give it a context
    range.selectNode(app);
    // add the html, this converts the html into a collection of elements
    const fragment = range.createContextualFragment(template);
    // append the elements to the document
    app.appendChild(fragment);
  });



  