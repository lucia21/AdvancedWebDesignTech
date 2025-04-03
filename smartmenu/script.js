document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuItemsContainer = document.getElementById('menuItems');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.querySelector('.cart-count');
    
    // Sample menu data (in a real app, this would come from an API)
    const menuData = {
        meals: [
            { id: 1, name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato, and special sauce', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
            { id: 2, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 12.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
            { id: 3, name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan', price: 7.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1' },
            { id: 4, name: 'Grilled Salmon', description: 'Fresh salmon fillet with lemon butter sauce and vegetables', price: 15.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2' }
        ],
        drinks: [
            { id: 5, name: 'Iced Coffee', description: 'Chilled coffee with milk and sugar', price: 3.99, image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0' },
            { id: 6, name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 4.49, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a' },
            { id: 7, name: 'Craft Beer', description: 'Local craft beer selection', price: 5.99, image: 'https://images.unsplash.com/photo-1513309914637-65c20a5962e1' }
        ],
        sweets: [
            { id: 8, name: 'Chocolate Cake', description: 'Rich chocolate cake with ganache', price: 6.99, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e' },
            { id: 9, name: 'Cheesecake', description: 'Classic New York style cheesecake', price: 5.99, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad' }
        ],
        extras: [
            { id: 10, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 3.49, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246' },
            { id: 11, name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 3.99, image: 'https://images.unsplash.com/photo-1541592104551-941585a0d5e8' }
        ]
    };
    
    // Cart state
    let cart = [];
    
    // Initialize the menu
    function initMenu() {
        loadCategory('meals');
        
        // Set up category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Load the selected category
                loadCategory(this.dataset.category);
            });
        });
    }
    
    // Load items for a specific category
    function loadCategory(category) {
        const items = menuData[category];
        menuItemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-info">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-footer">
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                        <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            menuItemsContainer.appendChild(itemElement);
        });
        
        // Set up add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                addToCart(itemId);
            });
        });
    }
    
    // Add item to cart
    function addToCart(itemId) {
        // Find the item in all categories
        let itemToAdd = null;
        for (const category in menuData) {
            const foundItem = menuData[category].find(item => item.id === itemId);
            if (foundItem) {
                itemToAdd = foundItem;
                break;
            }
        }
        
        if (!itemToAdd) return;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...itemToAdd,
                quantity: 1
            });
        }
        
        updateCart();
    }
    
    // Update cart display
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Update cart items list
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} × ${item.quantity}</div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">×</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update total
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        
        // Set up cart item buttons
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                decreaseQuantity(itemId);
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                increaseQuantity(itemId);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                removeFromCart(itemId);
            });
        });
    }
    
    // Decrease item quantity
    function decreaseQuantity(itemId) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
    }
    
    // Increase item quantity
    function increaseQuantity(itemId) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        cart[itemIndex].quantity += 1;
        updateCart();
    }
    
    // Remove item from cart
    function removeFromCart(itemId) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        cart.splice(itemIndex, 1);
        updateCart();
    }
    
    // Toggle cart visibility
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Event listeners
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Initialize the app
    initMenu();
});