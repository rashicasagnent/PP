// Shop functionality for PamPowers
var cartOpen = false;
var numberOfProducts = 0;
var cart = [];

// Cart functionality
function toggleCart() {
    if(cartOpen) {
        closeCart();
        return;
    }
    openCart();
}

function openCart() {
    cartOpen = true;
    document.body.classList.add('open');
    updateCartDisplay();
}

function closeCart() {
    cartOpen = false;
    document.body.classList.remove('open');
}

function addProduct(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    numberOfProducts++;
    updateCartDisplay();
    openCart();
}

function removeProduct(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex > -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1);
        }
        numberOfProducts--;
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartProducts = document.querySelector('.js-cart-products');
    const cartEmpty = document.querySelector('.js-cart-empty');
    const cartTotal = document.querySelector('.cart-total');
    const cartCountBadge = document.getElementById('cart-count');
    
    // Update cart count badge
    if (cartCountBadge) {
        if (numberOfProducts > 0) {
            cartCountBadge.textContent = numberOfProducts;
            cartCountBadge.style.opacity = '1';
        } else {
            cartCountBadge.style.opacity = '0';
        }
    }
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.classList.remove('hide');
        if (cartProducts) cartProducts.innerHTML = '';
        if (cartTotal) cartTotal.textContent = '$0.00';
    } else {
        if (cartEmpty) cartEmpty.classList.add('hide');
        if (cartProducts) {
            cartProducts.innerHTML = cart.map(item => `
                <article class="js-cart-product bg-gray-800 p-4 rounded-md shadow-sm mb-4 border-b border-gray-700">
                    <h1 class="text-lg font-semibold text-gray-200">${item.name}</h1>
                    <p class="text-gray-300">$${parseFloat(item.price).toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                    <p>
                        <a class="js-remove-product text-red-500 hover:underline cursor-pointer" onclick="removeProduct('${item.name}')" title="Delete product">
                            Delete product
                        </a>
                    </p>
                </article>
            `).join('');
        }
        
        const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Payment functionality
let selectedPaymentMethod = '';
let currentProduct = '';
let currentPrice = '';

function openPaymentPopup(product, price) {
    currentProduct = product;
    currentPrice = price;
    document.getElementById('payment-popup').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePaymentPopup() {
    document.getElementById('payment-popup').style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedPaymentMethod = '';
    currentProduct = '';
    currentPrice = '';
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.payment-option').classList.add('selected');
}

function processPayment() {
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    // Simulate payment processing
    alert(`Payment processed for ${currentProduct} ($${currentPrice}) using ${selectedPaymentMethod}`);
    closePaymentPopup();
}

// Checkout functionality - Make it globally accessible
window.checkout = function() {
    console.log('Checkout function called, cart:', cart);
    
    if (!cart || cart.length === 0) {
        alert('Your cart is empty. Add some products first!');
        if (typeof closeCart === 'function') closeCart();
        return false;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    
    // Build cart items string for URL
    const cartItems = cart.map(item => `${encodeURIComponent(item.name)}:${item.quantity}`).join('|');
    
    const checkoutUrl = `pay.html?cart=1&total=${total.toFixed(2)}&items=${encodeURIComponent(cartItems)}`;
    console.log('Redirecting to:', checkoutUrl);
    
    // Redirect to payment page with cart data
    window.location.href = checkoutUrl;
    return false;
};

// Also create a global alias
if (typeof checkout === 'undefined') {
    window.checkout = window.checkout;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cart toggle
    const cartToggles = document.querySelectorAll('.js-toggle-cart');
    cartToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    });
    
    // Add product buttons
    document.querySelectorAll('.js-add-product').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            addProduct(productName, price);
        });
    });
    
    // Buy products button (checkout) - Multiple selectors for reliability
    function attachCheckoutListener() {
        const buyProductsBtn = document.querySelector('.js-checkout-btn') || 
                              document.querySelector('.cart__footer a[title="Buy products"]') ||
                              document.querySelector('a[title="Buy products"]');
        
        if (buyProductsBtn) {
            // Remove existing listeners by cloning
            const newBtn = buyProductsBtn.cloneNode(true);
            buyProductsBtn.parentNode.replaceChild(newBtn, buyProductsBtn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked, calling checkout');
                
                if (typeof window.checkout === 'function') {
                    window.checkout();
                } else if (typeof checkout === 'function') {
                    checkout();
                } else {
                    console.error('Checkout function not found');
                    alert('Checkout function not available. Please refresh the page.');
                }
                return false;
            });
            
            console.log('Checkout button listener attached');
        } else {
            console.warn('Checkout button not found, retrying...');
            setTimeout(attachCheckoutListener, 500);
        }
    }
    
    attachCheckoutListener();
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartOpen && !e.target.closest('.cart') && !e.target.closest('.js-toggle-cart')) {
            closeCart();
        }
    });
    
    // Close payment popup when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.id === 'payment-popup') {
            closePaymentPopup();
        }
    });
    
    // Initialize cart display
    updateCartDisplay();
});