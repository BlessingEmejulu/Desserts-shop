const shoppingCart = (() => {
    let cart = [];

    class CartItem {
        constructor(name, price, count, category) {
            this.name = name;
            this.price = price;
            this.count = count;
            this.category = category;
        }
    }

    const saveCart = () => sessionStorage.setItem('productListCart', JSON.stringify(cart));

    const loadCart = () => cart = JSON.parse(sessionStorage.getItem('productListCart')) || [];

    if (sessionStorage.getItem("productListCart")) loadCart();

    const obj = {
        addItemToCart(name, price, count, category) {
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.count++;
            } else {
                cart.push(new CartItem(name, price, count, category));
            }
            saveCart();
        },
        removeItemFromCart(name) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.count--;
                if (item.count === 0) cart = cart.filter(i => i.name !== name);
                saveCart();
            }
        },
        removeItemFromCartAll(name) {
            cart = cart.filter(item => item.name !== name);
            saveCart();
        },
        setCountForItem(name, count) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.count = count;
                saveCart();
            }
        },
        getCountForItem(name) {
            const item = cart.find(item => item.name === name);
            return item ? item.count : 0;
        },
        clearCart() {
            cart = [];
            saveCart();
        },
        totalCount() {
            return cart.reduce((sum, item) => sum + item.count, 0);
        },
        totalCart() {
            return cart.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2);
        },
        listCart() {
            return cart.map(item => ({
                ...item,
                total: (item.price * item.count).toFixed(2)
            }));
        }
    };

    return obj;
})();

const cartAddItem = event => {
    const name = event.target.getAttribute('data-name');
    const price = Number(event.target.getAttribute('data-price'));
    const category = event.target.getAttribute('data-category');

    if (name) shoppingCart.addItemToCart(name, price, 1, category);
    displayCart();
    renderCartButtons();
};

const cartRemoveItem = event => {
    const name = event.target.getAttribute('data-name');
    shoppingCart.removeItemFromCart(name);
    displayCart();
    renderCartButtons();
};

const cartRemoveItemAll = event => {
    const name = event.target.getAttribute('data-name');
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
    renderCartButtons();
};

function displayCart() {
    const cartArray = shoppingCart.listCart();
    let cartTemplate = cartArray.map(item => `
        <div class='cart_item'>
            <p class='item__name'>${item.name}</p>
            <p class='item__count'>x${item.count}</p>
            <p class='item__price'>@${item.price.toFixed(2)}</p>
            <p class='item__total'>${item.total}</p>
            <a href='#' class='item__delete' onClick="cartRemoveItemAll(event)" data-name="${item.name}">
                <img src='./assets/images/icon-remove-item.svg' class='img__delete' data-name="${item.name}" />
            </a>
        </div>`).join("");

    document.getElementById('cart__info').classList.toggle('hidden', shoppingCart.totalCount() === 0);
    document.getElementById('cart__confirm').classList.toggle('hidden', shoppingCart.totalCount() === 0);
    document.getElementById('cart__total').classList.toggle('hidden', shoppingCart.totalCount() === 0);
    document.getElementById('cart__empty').classList.toggle('hidden', shoppingCart.totalCount() !== 0);

    document.getElementById('cart_items').innerHTML = cartTemplate;
    document.getElementById('cart__price').innerHTML = shoppingCart.totalCart();
    document.getElementById('cart__quantity').innerHTML = shoppingCart.totalCount();
}

function displayOrder() {
    const cartArray = shoppingCart.listCart();
    let orderTemplate = cartArray.map(item => `
        <div class='order_item'>
            <img src='${item.category}' class='order__thumbnail' />
            <p class='order__name'>${item.name}</p>
            <p class='order__count'>x${item.count}</p>
            <p class='order__price'>@${item.price.toFixed(2)}</p>
            <p class='order__total'>${item.total}</p>
        </div>`).join("");

    orderTemplate += `
        <div class='order__cart'>
            <div>Order Total</div>
            <div class='order__cart__total'>${shoppingCart.totalCart()}</div>
        </div>`;

    document.body.classList.add('no-scroll');
    document.getElementById('confirm__items').innerHTML = orderTemplate;
    document.getElementById('modal').classList.remove('hidden');
}

function hideModal(event) {
    if (event.target.id === 'modal') {
        document.body.classList.remove('no-scroll');
        document.getElementById('modal').classList.add('hidden');
    }
}

async function renderCartButtons() {
    const cartArray = await fetch('./data.json').then(response => response.json());
    
    cartArray.forEach((item, i) => {
        const cartCount = shoppingCart.getCountForItem(item.name);
        const cartTemplate = cartCount !== 0
            ? `<img src="./assets/images/icon-decrement-quantity.svg" width="15px" height="15px" onClick="cartRemoveItem(event)" data-name="${item.name}" />
               <span>${cartCount}</span>
               <img src="./assets/images/icon-increment-quantity.svg" width="15px" height="15px" onClick="cartAddItem(event)" data-name="${item.name}" />`
            : `<a href="#" class="add-cart-link" onClick="cartAddItem(event)" data-name="${item.name}" data-price="${item.price}" data-category="${item.image.thumbnail}">
                <img src="./assets/images/icon-add-to-cart.svg" width="20px" alt="" /> Add to Cart
               </a>`;

        const itemDiv = document.getElementById(`div_${i}`);
        if (itemDiv) {
            itemDiv.innerHTML = cartTemplate;
            itemDiv.classList.toggle('red', cartCount !== 0);
        }
    });
}

function clearCart() {
    shoppingCart.clearCart();
    document.body.classList.remove('no-scroll');
    document.getElementById('modal').classList.add('hidden');
    displayCart();
    renderCartButtons();
}

document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    renderCartButtons();
});
