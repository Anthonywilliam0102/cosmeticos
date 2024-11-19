document.addEventListener('DOMContentLoaded', () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

// Verifica se os valores carregados são válidos
if (!Array.isArray(cartItems)) {
    cartItems = [];
}
if (isNaN(totalPrice)) {
    totalPrice = 0;
}

    // Seletores principais
    const cartCounter = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const confirmationModal = document.createElement('div');

    // Inicialização
    updateCartModal();
    updateCartCounter();

    // Adicionar produto ao carrinho
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const product = e.target.closest('.product');
            const productName = product.querySelector('h3').textContent;
            const productPrice = parseFloat(
                product.querySelector('.price').textContent.replace('R$', '').trim()
            );

            const existingProduct = cartItems.find((item) => item.name === productName);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cartItems.push({ name: productName, price: productPrice, quantity: 1 });
            }

            totalPrice += productPrice;
            animateAddToCart(product);
            saveCartState();
            updateCartModal();
            updateCartCounter();
            showToast(`${productName} adicionado ao carrinho!`);
        });
    });

    // Exibir modal do carrinho
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('show');
    });

    // Fechar modal do carrinho
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    // Finalizar compra
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showToast('Seu carrinho está vazio!', 'error');
            return;
        }

        // Modal de confirmação
        showConfirmationModal();
    });

    // Atualizar modal do carrinho
    function updateCartModal() {
        cartItemsList.innerHTML = '';
        cartItems.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)} x ${item.quantity}</span>
                <div class="cart-actions">
                    <button class="increase">+</button>
                    <button class="decrease">-</button>
                    <button class="remove">Remover</button>
                </div>
            `;

            li.querySelector('.increase').addEventListener('click', () => {
                item.quantity++;
                totalPrice += item.price;
                saveCartState();
                updateCartModal();
                updateCartCounter();
            });

            li.querySelector('.decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    totalPrice -= item.price;
                    saveCartState();
                    updateCartModal();
                    updateCartCounter();
                } else {
                    removeItemFromCart(item.name);
                }
            });

            li.querySelector('.remove').addEventListener('click', () => {
                removeItemFromCart(item.name);
            });

            cartItemsList.appendChild(li);
        });

        totalPriceDisplay.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    // Atualizar contador do carrinho
    function updateCartCounter() {
        const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
        cartCounter.textContent = totalItems;

        // Animação de badge
        cartCounter.classList.add('bounce');
        setTimeout(() => cartCounter.classList.remove('bounce'), 300);
    }

    // Remover item do carrinho
    function removeItemFromCart(itemName) {
        const item = cartItems.find((item) => item.name === itemName);
        totalPrice -= item.price * item.quantity;

        cartItems = cartItems.filter((item) => item.name !== itemName);
        saveCartState();
        updateCartModal();
        updateCartCounter();
    }

    // Salvar estado do carrinho no localStorage
    function saveCartState() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('totalPrice', totalPrice.toString());
    }

    // Animação ao adicionar ao carrinho
    function animateAddToCart(product) {
        const img = product.querySelector('img');
        const clone = img.cloneNode();
        const cartPosition = cartIcon.getBoundingClientRect();
        const imgPosition = img.getBoundingClientRect();

        clone.style.position = 'absolute';
        clone.style.zIndex = 1000;
        clone.style.width = img.width + 'px';
        clone.style.height = img.height + 'px';
        clone.style.top = imgPosition.top + 'px';
        clone.style.left = imgPosition.left + 'px';
        document.body.appendChild(clone);

        setTimeout(() => {
            clone.style.transition = 'all 0.5s ease';
            clone.style.transform = `translate(${cartPosition.left - imgPosition.left}px, ${
                cartPosition.top - imgPosition.top
            }px) scale(0.3)`;
        }, 10);

        setTimeout(() => clone.remove(), 600);
    }

    // Mostrar toast
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // Modal de confirmação
    function showConfirmationModal() {
        confirmationModal.className = 'confirmation-modal';
        confirmationModal.innerHTML = `
            <h2>Compra Finalizada!</h2>
            <p>Obrigado por comprar conosco.</p>
            <button id="close-confirmation">Fechar</button>
        `;

        document.body.appendChild(confirmationModal);
        document.getElementById('close-confirmation').addEventListener('click', () => {
            confirmationModal.remove();
            cartItems = [];
            totalPrice = 0;
            saveCartState();
            updateCartModal();
            updateCartCounter();
        });
    }
});

