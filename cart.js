var shoppingCart = (function() {
    let cart = [];

    //Item Constructor
    function cartItem(name, price, count, category) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.category = category;
    }

    //Save cart
    const saveCart = () => {
        sessionStorage.setItem('productListCart', JSON.stringify(cart));
    }

    //Load cart
    const loadCart = () => {
        return cart = JSON.parse(sessionStorage.getItem('productListCart'));
    }

    if (sessionStorage.getItem("productListCart") != null) { loadCart(); }

    // =============================
    //  Public Methods & Properties
    // ============================= 
    var obj = {};

    // Add a new item
    obj.addItemToCart = function(name, price, count, category) {
        for(var item in cart) { // Check if we already have this item
            if(cart[item].name === name) {
                cart[item].count ++;
                saveCart();
                return;
            }
        }
        var item = new cartItem(name, price, count, category);
        cart.push(item);
        saveCart();
    };

    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
            if(cart[item].name === name) {
                cart[item].count --;
                if(cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart();
    };

    obj.removeItemFromCartAll = function(name) {
        for(var item in cart) {
            if(cart[item].name === name) {
              cart.splice(item, 1);
              break;
            }
          }
        saveCart();
    }

    // Sets count for an item
    obj.setCountForItem = function(name, count) {
      for(var item in cart) {
        if(cart[item].name === name) {
        cart[item].count = count;
            break;
        }
      }
    };

    // Gets count for an item
    obj.getCountForItem = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            return cart[item].count
          }
        }
        return 0;
      };

    // Clears cart of all items
    obj.clearCart = function() {
        cart = [];
        saveCart();
    }

    // Get a count of all the items in the cart
    obj.totalCount = function() {
        var totalCount = 0;
        for(var item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    obj.totalCart = function() {
        var totalCart = 0;
        for(var item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }

    obj.listCart = function() {
        var cartCopy = [];
        for(i in cart) {
            item = cart[i];
            itemCopy = {};
            for(p in item) {
                itemCopy[p] = item[p];
            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    }

    return obj;
})();


const cartAddItem = (event) => {
    var name = event.target.getAttribute('data-name');
    var price = Number(event.target.getAttribute('data-price'));
    var category = event.target.getAttribute('data-category');

    if(name != null) shoppingCart.addItemToCart(name, price, 1, category);
    
    displayCart();
    renderCartButtons();
}

const cartRemoveItem = (event) => {
    var name = event.target.getAttribute('data-name');
    shoppingCart.removeItemFromCart(name);

    displayCart();
    renderCartButtons();
}

const cartRemoveItemAll = (event) => {
    var name = event.target.getAttribute('data-name');
    shoppingCart.removeItemFromCartAll(name);

    displayCart();
    renderCartButtons();
}

function displayCart() {
    var cartArray = shoppingCart.listCart();
    var cartTemplate = "";
    for(var i in cartArray) {
        cartTemplate += "<div class='cart_item'>"
        + "<p class='item__name'>" + cartArray[i].name + "</p>"
        + "<p class='item__count'>x" + cartArray[i].count + "</p>"
        + "<p class='item__price'>@" + cartArray[i].price.toFixed(2) + "</p>"
        + "<p class='item__total'>" + (cartArray[i].price * cartArray[i].count).toFixed(2) + "</p>"
        + `<a href='#' class='item__delete' onClick="cartRemoveItemAll(event)" data-name="${cartArray[i].name}"><img src='./assets/images/icon-remove-item.svg' class='img__delete' data-name="${cartArray[i].name}" /></a>`
        + "</div>";
    }

    shoppingCart.totalCount() === 0 
    ? document.getElementById('cart__info').classList.add('hidden') 
        & document.getElementById('cart__confirm').classList.add('hidden')
        & document.getElementById('cart__total').classList.add('hidden')
        & document.getElementById('cart__empty').classList.remove('hidden')
    : document.getElementById('cart__info').classList.remove('hidden') 
        & document.getElementById('cart__confirm').classList.remove('hidden')
        & document.getElementById('cart__total').classList.remove('hidden')
        & document.getElementById('cart__empty').classList.add('hidden')

    document.getElementById('cart_items').innerHTML = cartTemplate;
    document.getElementById('cart__price').innerHTML = shoppingCart.totalCart().toFixed(2);
    document.getElementById('cart__quantity').innerHTML = shoppingCart.totalCount();

}

function displayOrder() {
    var cartArray = shoppingCart.listCart();
    var orderTemplate = "";

    window.scrollTo({top: 0});

    for(var i in cartArray) {
        orderTemplate += "<div class='order_item'>"
        + "<img src='" + cartArray[i].category + "' class='order__thumbnail' />"
        + "<p class='order__name'>" + cartArray[i].name + "</p>"
        + "<p class='order__count'>x" + cartArray[i].count + "</p>"
        + "<p class='order__price'>@" + cartArray[i].price.toFixed(2) + "</p>"
        + "<p class='order__total'>" + (cartArray[i].price * cartArray[i].count).toFixed(2) + "</p>"
        + "</div>";
    }

    orderTemplate += "<div class='order__cart'>"
    + "<div>Order Total</div>"
    + "<div class='order__cart__total'>" + shoppingCart.totalCart().toFixed(2) + "</div>"
    + "</div>";

    document.getElementsByTagName('body')[0].classList.add('no-scroll');
    document.getElementById('confirm__items').innerHTML = orderTemplate;
    document.getElementById('modal').classList.remove('hidden');
}

function hideModal(event) {
    if(event.target.id === 'modal') {
        document.getElementsByTagName('body')[0].classList.remove('no-scroll');
        document.getElementById('modal').classList.add('hidden');
    }
}

async function renderCartButtons() {
    var cartArray = await fetch('./data.json')
    .then(response => response.json())
    .then(data => { 
        return data
    });

    var cartTemplate;

    for(var i = 0; i < cartArray.length; i++) {
        if(shoppingCart.getCountForItem(cartArray[i].name) != 0) {
            cartTemplate = `<img src="./assets/images/icon-decrement-quantity.svg" width="15px" height="15px" onClick="cartRemoveItem(event)" data-name="${cartArray[i].name}" />` 
            + '<span>' + shoppingCart.getCountForItem(cartArray[i].name) + '</span>'
            + `<img src="./assets/images/icon-increment-quantity.svg" width="15px" height="15px" onClick="cartAddItem(event)" data-name="${cartArray[i].name}" />`
            document.getElementById(`div_${i}`).classList.add('red');
        } else {
            cartTemplate = `<a href="#" class="add-cart-link" onClick="cartAddItem(event)" id="${i}" data-name="${cartArray[i].name}" data-price="${cartArray[i].price}" data-category="${cartArray[i].image.thumbnail}">`
            + `<img src="./assets/images/icon-add-to-cart.svg" data-name="${cartArray[i].name}" width="20px" alt="" /> Add to Cart`
            + '</a>';
            if(document.getElementById(`div_${i}`) != null) { document.getElementById(`div_${i}`).classList.remove('red'); }
        }
        if(document.getElementById(`div_${i}`) != null) { document.getElementById(`div_${i}`).innerHTML = cartTemplate; }
    }
}

function clearCart() {
    shoppingCart.clearCart();
    document.getElementsByTagName('body')[0].classList.remove('no-scroll');
    document.getElementById('modal').classList.add('hidden');
    
    displayCart();
    renderCartButtons();
}

document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    renderCartButtons();
})
