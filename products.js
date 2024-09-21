const app = document.querySelector('#products');

// Function to create a product template
const createProductTemplate = (product, id) => `
<section name="product_info">
  <div class="picture">
    <picture>
      <source media="(min-width:725px)" srcset="${product.image.desktop}">
      <source media="(min-width:525px)" srcset="${product.image.tablet}">
      <img src="${product.image.mobile}" alt="${product.category}" />
      <div id="div_${id}" class="add-cart" data-name="${product.name}" data-price="${product.price}" data-category="${product.image.thumbnail}">
      </div>
    </picture>
  </div>
  <div class="card">
    <header class="card__header">${product.category}</header>
    <p class="card__description">${product.name}</p>
    <p class="card__price">${product.price.toFixed(2)}</p>
  </div>
</section>`;

// Function to append HTML content to the app
const appendTemplateToDOM = (template) => {
  const range = document.createRange();
  range.selectNode(app);
  const fragment = range.createContextualFragment(template);
  app.appendChild(fragment);
};

// Fetch and render product data
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const template = data.map(createProductTemplate).join('');
    appendTemplateToDOM(template);
  })
  .catch(error => console.error('Error fetching product data:', error));
