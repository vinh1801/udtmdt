// ===============================
// TL-FASTFOOD SCRIPT (main.js)
// ===============================

// --- GIỎ HÀNG DÙNG CHUNG ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
  const countEl = document.querySelector("#cartCount, #cart-count");
  if (!countEl) return;
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = total;
}

// Thêm sản phẩm vào giỏ
function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Hiệu ứng nhấp nháy icon giỏ
  const cartIcon = document.querySelector(".cart-btn, .cart");
  if (cartIcon) {
    cartIcon.classList.add("bump");
    setTimeout(() => cartIcon.classList.remove("bump"), 300);
  }
}

// ===============================
// MENU PAGE (menu.html)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#menuGrid");
  const filterBtns = document.querySelectorAll(".chip");
  let currentFilter = "all";

  if (grid && typeof menuItems !== "undefined") {
    // --- Render Menu ---
    function renderMenu() {
      grid.innerHTML = "";
      const filtered =
        currentFilter === "all"
          ? menuItems
          : menuItems.filter(i => i.category === currentFilter);

      filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="menu-img">
          <div class="menu-info">
            <h4>${item.name}</h4>
            <p>${item.price.toLocaleString()}đ</p>
            <button class="btn small add-btn" data-id="${item.id}">Thêm</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    // --- Lọc món ăn ---
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderMenu();
      });
    });

    // --- Thêm vào giỏ ---
    grid.addEventListener("click", e => {
      if (e.target.classList.contains("add-btn")) {
        const id = +e.target.dataset.id;
        const item = menuItems.find(i => i.id === id);
        if (item) addToCart(item);
      }
    });

    renderMenu();
  }

  // ===============================
  // CART PAGE (cart.html)
  // ===============================
 
const cartContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector("#cartTotal");

if (cartContainer) {
  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống!</p>";
      cartTotal.textContent = "0₫";
      return;
    }

    cartContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${item.price.toLocaleString()}₫</p>
          <div class="qty-control">
            <button class="btn small qty-btn" data-id="${item.id}" data-action="minus">−</button>
            <span class="qty">${item.qty}</span>
            <button class="btn small qty-btn" data-id="${item.id}" data-action="plus">+</button>
            <button class="btn small remove-btn" data-id="${item.id}">🗑</button>
          </div>
        </div>
      </div>
    `).join("");

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartTotal.textContent = total.toLocaleString() + "₫";
  }

  cartContainer.addEventListener("click", e => {
    const id = +e.target.dataset.id;
    const action = e.target.dataset.action;

    if (e.target.classList.contains("qty-btn")) {
      const item = cart.find(i => i.id === id);
      if (!item) return;

      if (action === "plus") item.qty++;
      else if (action === "minus" && item.qty > 1) item.qty--;
      else if (action === "minus" && item.qty === 1)
        cart = cart.filter(i => i.id !== id);

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    }

    if (e.target.classList.contains("remove-btn")) {
      cart = cart.filter(i => i.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    }
  });

  renderCart();
    updateCartCount(); 
}

  // Cập nhật số lượng giỏ hàng lúc đầu
  updateCartCount();
});

