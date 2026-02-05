// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Mady website initialized!');
    
    // Initialize all features
    initializeDarkMode();
    initializeBackToTop();
    initializeSearch();
    updateActiveNav();
    initializeRealCart(); // Hệ thống giỏ hàng mới
    initializeMobileOptimizations(); // Mobile optimizations
});

// ===== MOBILE OPTIMIZATIONS =====
function initializeMobileOptimizations() {
    // Prevent double-tap zoom on buttons
    document.addEventListener('touchend', function(event) {
        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
            event.preventDefault();
            event.target.click();
        }
    }, false);

    // Add active state feedback for touch
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
            e.target.closest('button, a')?.classList.add('touch-active');
        }
    }, false);

    document.addEventListener('touchend', function(e) {
        document.querySelectorAll('.touch-active').forEach(el => el.classList.remove('touch-active'));
    }, false);

    // Handle viewport changes
    window.addEventListener('orientationchange', function() {
        // Recalculate on orientation change
        updateMobileLayout();
    });

    updateMobileLayout();
}

function updateMobileLayout() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    
    if (isMobile) {
        document.documentElement.style.fontSize = '15px';
    } else if (isTablet) {
        document.documentElement.style.fontSize = '16px';
    } else {
        document.documentElement.style.fontSize = '16px';
    }
}

// ===== MOBILE MENU TOGGLE =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Close mobile menu when a link is clicked
const mobileLinks = mobileMenu?.querySelectorAll('a');
mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ===== UPDATE ACTIVE NAV LINK =====
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== REAL SHOPPING CART SYSTEM =====
let cart = [];

function initializeRealCart() {
    // 1. Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try { cart = JSON.parse(savedCart); } catch (e) { console.error(e); }
    }

    // 2. Inject Cart Sidebar HTML
    const cartSidebarHTML = `
        <div id="cart-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden transition-opacity duration-300 opacity-0"></div>
        <div id="cart-sidebar" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-50 flex flex-col">
            <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 class="text-lg sm:text-xl font-bold text-gray-800">🛒 Giỏ Hàng</h2>
                <button id="close-cart" class="text-gray-500 hover:text-red-500 text-2xl min-h-10 w-10 flex items-center justify-center">&times;</button>
            </div>
            <div id="cart-items" class="flex-1 overflow-y-auto p-4 space-y-4">
                <!-- Items will be injected here -->
                <div class="text-center text-gray-500 mt-10">Giỏ hàng đang trống</div>
            </div>
            <div class="p-4 border-t bg-gray-50">
                <div class="flex justify-between mb-4 text-base sm:text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span id="cart-total" class="text-blue-600">0₫</span>
                </div>
                <button id="checkout-btn" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition duration-300 min-h-12">
                    Thanh Toán Ngay
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartSidebarHTML);

    // 3. Event Listeners
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const overlay = document.getElementById('cart-overlay');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

    // 4. Attach Add to Cart events
    const addToCartBtns = document.querySelectorAll('button');
    addToCartBtns.forEach(btn => {
        if (btn.textContent.includes('Thêm vào Giỏ') || btn.textContent.includes('Liên Hệ Đặt')) {
            // Change text to "Thêm vào Giỏ" for consistency if needed, or just attach event
            btn.textContent = '🛒 Thêm vào Giỏ';
            btn.onclick = null; // Remove old handlers
            btn.addEventListener('click', handleAddToCart);
        }
    });

    updateCartUI();
}

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    renderCartItems();
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function handleAddToCart(e) {
    e.preventDefault();
    const card = this.closest('.bg-white'); // Find product card
    if (!card) return;

    const name = card.querySelector('h3')?.textContent.trim();
    const priceStr = card.querySelector('.text-2xl')?.textContent.trim();
    const price = parseInt(priceStr.replace(/\D/g, ''));
    const emoji = card.querySelector('.text-6xl')?.textContent.trim() || '📦';

    // Check if item exists
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, emoji, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification(`✅ Đã thêm "${name}" vào giỏ!`);
    
    // Animation effect on button
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = '👌 Đã thêm';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-600');
    }, 1000);
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    updateCartUI();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeItem(index);
    } else {
        saveCart();
        renderCartItems();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const countBadge = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (countBadge) {
        countBadge.textContent = totalCount;
        if (totalCount > 0) {
            countBadge.classList.remove('scale-0');
        } else {
            countBadge.classList.add('scale-0');
        }
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                <div class="text-6xl mb-4">🛒</div>
                <p>Giỏ hàng của bạn đang trống</p>
                <button onclick="closeCart()" class="mt-4 text-blue-500 hover:underline">Tiếp tục mua sắm</button>
            </div>`;
        totalEl.textContent = '0₫';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 animate-fadeIn">
                <div class="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-3xl">
                    ${item.emoji}
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 text-sm line-clamp-1">${item.name}</h4>
                    <p class="text-blue-600 font-semibold text-sm">${item.price.toLocaleString('vi-VN')}₫</p>
                    <div class="flex items-center mt-2 gap-2">
                        <button onclick="updateQuantity(${index}, -1)" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600">-</button>
                        <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600">+</button>
                    </div>
                </div>
                <button onclick="removeItem(${index})" class="text-gray-400 hover:text-red-500 p-2">
                    🗑️
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.textContent = total.toLocaleString('vi-VN') + '₫';
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('❌ Giỏ hàng trống!');
        return;
    }
    
    // Simulate checkout process
    const btn = document.getElementById('checkout-btn');
    btn.innerHTML = '⏳ Đang xử lý...';
    btn.disabled = true;
    
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
        
        // Show success modal
        const successModal = document.createElement('div');
        successModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4';
        successModal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-100 transition-transform">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-4xl">🎉</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h2>
                <p class="text-gray-600 mb-6">Cảm ơn bạn đã ủng hộ Mady. Chúng tôi sẽ liên hệ sớm để xác nhận đơn hàng.</p>
                <button onclick="this.closest('div.fixed').remove()" class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">Tuyệt vời</button>
            </div>
        `;
        document.body.appendChild(successModal);
        
        btn.innerHTML = 'Thanh Toán Ngay';
        btn.disabled = false;
    }, 1500);
}

// ===== DARK MODE TOGGLE =====
function initializeDarkMode() {
    setTimeout(() => {
        let darkModeToggle = document.getElementById('darkModeToggle');
        
        if (!darkModeToggle) {
            darkModeToggle = document.createElement('button');
            darkModeToggle.id = 'darkModeToggle';
            darkModeToggle.innerHTML = '🌙';
            darkModeToggle.title = 'Chế độ tối';
            darkModeToggle.style.cssText = `
                position: fixed;
                top: 70px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                z-index: 999;
            `;
            document.body.appendChild(darkModeToggle);
        }
        
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️';
        }
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isEnabled = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isEnabled);
            darkModeToggle.innerHTML = isEnabled ? '☀️' : '🌙';
        });
    }, 100);
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    setTimeout(() => {
        let backToTopBtn = document.getElementById('backToTop');
        
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'backToTop';
            backToTopBtn.innerHTML = '↑';
            backToTopBtn.title = 'Quay lại đầu trang';
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                z-index: 999;
            `;
            document.body.appendChild(backToTopBtn);
        }
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }, 100);
}

// ===== SCROLL PROGRESS BAR =====
window.addEventListener('load', function() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #6366f1, #ec4899);
        width: 0%;
        transition: width 0.1s ease;
        z-index: 1000;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
});

// ===== SEARCH/FILTER =====
function initializeSearch() {
    setTimeout(() => {
        const gridContainer = document.querySelector('.grid');
        if (!gridContainer) return;
        
        const parent = gridContainer.parentElement;
        let searchContainer = parent.querySelector('.search-container');
        
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <input type="text" class="search-input" placeholder="🔍 Tìm kiếm sản phẩm...">
                <button class="search-btn">Tìm</button>
            `;
            parent.insertBefore(searchContainer, gridContainer);
        }
        
        const searchInput = parent.querySelector('.search-input');
        const searchBtn = parent.querySelector('.search-btn');
        
        if (searchInput && searchBtn) {
            function performSearch() {
                const query = searchInput.value.toLowerCase();
                const cards = gridContainer.querySelectorAll('.bg-white.rounded-lg');
                
                cards.forEach(card => {
                    const productName = card.querySelector('.text-xl.font-bold')?.textContent.toLowerCase();
                    const productDesc = card.querySelector('.text-gray-600')?.textContent.toLowerCase();
                    
                    if ((productName?.includes(query) || productDesc?.includes(query) || query === '')) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keyup', performSearch);
        }
    }, 200);
}

console.log('✅ Script loaded successfully!');

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        console.log('Form submitted:', data);
        
        // Show success message
        contactForm.style.display = 'none';
        formMessage.classList.remove('hidden');
        
        // Reset form after 3 seconds
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            formMessage.classList.add('hidden');
        }, 3000);
    });
}

// Notification Function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    notification.style.animation = 'slideInRight 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Load cart from localStorage on page load
window.addEventListener('load', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }
});

// Social Links
const socialLinks = document.querySelectorAll('footer a[href="#"]');
socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('🚀 Tính năng này sẽ được cập nhật sớm!');
    });
});

// Dynamic year in footer
const footerYear = document.querySelectorAll('footer p');
footerYear.forEach(para => {
    const currentYear = new Date().getFullYear();
    para.textContent = para.textContent.replace(/\d{4}/, currentYear);
});

// Welcome message
window.addEventListener('load', () => {
    console.log('✅ Mady website loaded successfully!');
    console.log('🎴 Welcome to Mady - Card Collection 3D!');
});

// Export cart data
function exportCart() {
    const cartData = JSON.stringify(cart, null, 2);
    console.log('Cart data:', cartData);
    return cartData;
}

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop') || createBackToTopButton();

function createBackToTopButton() {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '↑';
    btn.title = 'Quay lại đầu trang';
    document.body.appendChild(btn);
    return btn;
}

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('scrollProgress') || createProgressBar();

function createProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'scrollProgress';
    document.body.appendChild(bar);
    return bar;
}

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle') || createDarkModeToggle();

function createDarkModeToggle() {
    const btn = document.createElement('button');
    btn.id = 'darkModeToggle';
    btn.innerHTML = '🌙';
    btn.title = 'Chế độ tối';
    document.body.appendChild(btn);
    return btn;
}

const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '☀️';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isEnabled = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isEnabled);
    darkModeToggle.innerHTML = isEnabled ? '☀️' : '🌙';
    darkModeToggle.style.animation = 'spin 0.5s ease-out';
    setTimeout(() => {
        darkModeToggle.style.animation = 'none';
    }, 500);
});

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

// ===== WISHLIST/FAVORITES =====
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productName) {
    if (wishlist.includes(productName)) {
        wishlist = wishlist.filter(item => item !== productName);
        showNotification(`❌ Xóa "${productName}" khỏi yêu thích`);
    } else {
        wishlist.push(productName);
        showNotification(`❤️ Thêm "${productName}" vào yêu thích`);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function initializeWishlistButtons() {
    const productCards = document.querySelectorAll('.bg-white');
    productCards.forEach(card => {
        const productName = card.querySelector('.text-xl.font-bold')?.textContent || 'Sản phẩm';
        
        if (!card.querySelector('.favorite-btn')) {
            const favBtn = document.createElement('button');
            favBtn.className = 'favorite-btn';
            favBtn.innerHTML = '🤍';
            favBtn.style.position = 'absolute';
            favBtn.style.top = '10px';
            favBtn.style.right = '10px';
            
            if (wishlist.includes(productName)) {
                favBtn.classList.add('favorited');
                favBtn.innerHTML = '❤️';
            }
            
            favBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWishlist(productName);
                favBtn.classList.toggle('favorited');
                favBtn.innerHTML = favBtn.classList.contains('favorited') ? '❤️' : '🤍';
            });
            
            card.style.position = 'relative';
            card.insertBefore(favBtn, card.firstChild);
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeWishlistButtons);

// ===== ANIMATED COUNTERS =====
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const increment = target / 30;
    let current = 0;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 50);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                if (!counter.dataset.animated) {
                    animateCounter(counter);
                    counter.dataset.animated = 'true';
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => {
    counterObserver.observe(section);
});

// ===== SEARCH/FILTER FUNCTIONALITY =====
function initializeSearch() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer && document.querySelector('.grid')) {
        const container = document.querySelector('.grid').parentElement;
        const search = document.createElement('div');
        search.className = 'search-container';
        search.innerHTML = `
            <input type="text" class="search-input" placeholder="🔍 Tìm kiếm sản phẩm...">
            <button class="search-btn">Tìm</button>
        `;
        container.insertBefore(search, container.querySelector('.grid'));
    }
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        function performSearch() {
            const query = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll('.bg-white.rounded-lg');
            
            cards.forEach(card => {
                const productName = card.querySelector('.text-xl.font-bold')?.textContent.toLowerCase();
                const productDesc = card.querySelector('.text-gray-600')?.textContent.toLowerCase();
                
                if (productName?.includes(query) || productDesc?.includes(query) || query === '') {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.3s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', performSearch);
    }
}

document.addEventListener('DOMContentLoaded', initializeSearch);

// ===== STICKY HEADER ON SCROLL =====
let lastScrollTop = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.classList.add('sticky-scroll');
    } else {
        navbar.classList.remove('sticky-scroll');
    }
    
    lastScrollTop = scrollTop;
});

// ===== PRODUCT COUNTER =====
function updateProductCount() {
    const productCards = document.querySelectorAll('.bg-white.rounded-lg');
    const productCount = productCards.length;
    
    let counterElement = document.querySelector('.product-count');
    if (!counterElement && document.querySelector('.grid')) {
        counterElement = document.createElement('p');
        counterElement.className = 'product-count text-gray-600 mb-4 font-semibold';
        const gridParent = document.querySelector('.grid').parentElement;
        gridParent.insertBefore(counterElement, document.querySelector('.grid'));
    }
    
    if (counterElement) {
        counterElement.textContent = `📦 Hiển thị ${productCount} sản phẩm`;
    }
}

document.addEventListener('DOMContentLoaded', updateProductCount);

console.log('✅ Mady website loaded with advanced features!');
