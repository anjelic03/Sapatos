// CONFIGURATION OF CATALOG THING ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
const catalogData = [
  {
    id: "sapatos-01",
    type: "sneaker",
    name: "Adasdas Sneaker",
    price: 3290,
    image: "images/adasdas.png",
    description: "Lightweight knit upper with responsive cushioning for everyday adventures."
  },
  {
    id: "sapatos-02",
    type: "sneaker",
    name: "Mike Sneakers",
    price: 3890,
    image: "images/mike.png",
    description: "Breathable runner with energy return midsole made for long city strides."
  },
  {
    id: "sapatos-03",
    type: "sneaker",
    name: "PMUA Sneakers",
    price: 4490,
    image: "images/pmua.png",
    description: "Weather-ready leather boot with plush lining to keep you cozy and dry."
  }
];

// Creational Pattern: Product Factory ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
class ProductFactory {
  createProduct(type, config) {
    return new Product({ ...config, type });
  }
}

class Product {
  constructor({ id, type, name, price, image, description }) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
  }

  getLabel() {
    return this.name;
  }

  getTotal() {
    return this.price;
  }

  getBaseTotal() {
    return this.price;
  }

  getDecorations() {
    return [];
  }

  getImage() {
    return this.image;
  }
}

// Structural Pattern: Decorators ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
class BaseDecorator {
  constructor(product) {
    this.wrapped = product;
  }

  getLabel() {
    return this.wrapped.getLabel();
  }

  getTotal() {
    return this.wrapped.getTotal();
  }

  getBaseTotal() {
    return this.wrapped.getBaseTotal();
  }

  getDecorations() {
    return this.wrapped.getDecorations();
  }

  getImage() {
    return this.wrapped.getImage();
  }
}

class GiftWrapDecorator extends BaseDecorator {
  constructor(product, fee = 120) {
    super(product);
    this.wrapFee = fee;
  }

  getLabel() {
    return `${this.wrapped.getLabel()} + Gift Wrap`;
  }

  getTotal() {
    return this.wrapped.getTotal() + this.wrapFee;
  }

  getDecorations() {
    return [...this.wrapped.getDecorations(), `Gift Wrap (+₱${this.wrapFee})`];
  }
}

class DiscountDecorator extends BaseDecorator {
  constructor(product, percentage = 0.1) {
    super(product);
    this.percentage = percentage;
  }

  getLabel() {
    return `${this.wrapped.getLabel()} (Discount applied)`;
  }

  getTotal() {
    const discountValue = this.wrapped.getBaseTotal() * this.percentage;
    return Math.max(0, this.wrapped.getTotal() - discountValue);
  }

  getDecorations() {
    const pct = Math.round(this.percentage * 100);
    return [...this.wrapped.getDecorations(), `Discount (${pct}% off)`];
  }
}

class FreeShippingDecorator extends BaseDecorator {
  constructor(product, shippingValue = 150) {
    super(product);
    this.shippingValue = shippingValue;
  }

  getLabel() {
    return `${this.wrapped.getLabel()} + Free Shipping`;
  }

  getTotal() {
    return Math.max(0, this.wrapped.getTotal() - this.shippingValue);
  }

  getDecorations() {
    return [...this.wrapped.getDecorations(), `Free Shipping (-₱${this.shippingValue})`];
  }
}

function applyDecorators(product, addons) {
  let decorated = product;
  if (addons?.discount) {
    decorated = new DiscountDecorator(decorated);
  }
  if (addons?.giftWrap) {
    decorated = new GiftWrapDecorator(decorated);
  }
  if (addons?.freeShipping) {
    decorated = new FreeShippingDecorator(decorated);
  }
  return decorated;
}

// Behavioral Pattern: Observer ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
class Cart {
  constructor() {
    this.items = new Map();
    this.observers = new Set();
  }

  subscribe(observer) {
    this.observers.add(observer);
    observer.update(this.snapshot());
    return () => this.observers.delete(observer);
  }

  notify() {
    const state = this.snapshot();
    this.observers.forEach((observer) => observer.update(state));
  }

  addItem(product) {
    const existing = this.items.get(product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.set(product.id, {
        product,
        quantity: 1,
        addons: {
          discount: false,
          giftWrap: false,
          freeShipping: false
        }
      });
    }
    this.notify();
  }

  removeItem(productId) {
    if (this.items.delete(productId)) {
      this.notify();
    }
  }

  changeQuantity(productId, delta) {
    const entry = this.items.get(productId);
    if (!entry) return;
    entry.quantity += delta;
    if (entry.quantity <= 0) {
      this.items.delete(productId);
    }
    this.notify();
  }

  setQuantity(productId, quantity) {
    const entry = this.items.get(productId);
    if (!entry) return;
    entry.quantity = Math.max(1, quantity);
    this.notify();
  }

  toggleAddon(productId, addonKey) {
    const entry = this.items.get(productId);
    if (!entry || !(addonKey in entry.addons)) return;
    entry.addons[addonKey] = !entry.addons[addonKey];
    this.notify();
  }

  clear() {
    this.items.clear();
    this.notify();
  }

  snapshot() {
    const items = [];
    let baseTotal = 0;
    let decoratedTotal = 0;

    this.items.forEach((entry) => {
      const decorated = applyDecorators(entry.product, entry.addons);
      const baseUnit = entry.product.getTotal();
      const decoratedUnit = decorated.getTotal();
      const lineBaseTotal = baseUnit * entry.quantity;
      const lineTotal = decoratedUnit * entry.quantity;

      baseTotal += lineBaseTotal;
      decoratedTotal += lineTotal;

      items.push({
        id: entry.product.id,
        name: entry.product.name,
        label: decorated.getLabel(),
        image: decorated.getImage(),
        quantity: entry.quantity,
        pricePerUnit: decoratedUnit,
        basePerUnit: baseUnit,
        lineTotal,
        decorations: decorated.getDecorations(),
        addons: { ...entry.addons }
      });
    });

    const adjustment = decoratedTotal - baseTotal;

    return {
      items,
      totals: {
        base: baseTotal,
        adjustments: adjustment,
        grandTotal: decoratedTotal
      }
    };
  }
}

// UI helpers ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0
});

function formatPeso(value) {
  return currency.format(Math.round(value));
}

// Observer implementations ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
class CartListView {
  constructor(container, cart) {
    this.container = container;
    this.cart = cart;
    this.bindEvents();
  }

  bindEvents() {
    this.container.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const productId = target.closest("[data-product-id]")?.dataset.productId;
      if (!productId) return;

      if (target.matches("[data-action=increment]")) {
        this.cart.changeQuantity(productId, 1);
      } else if (target.matches("[data-action=decrement]")) {
        this.cart.changeQuantity(productId, -1);
      } else if (target.matches("[data-action=remove]")) {
        this.cart.removeItem(productId);
      } else if (target.matches("[data-addon]")) {
        const addon = target.dataset.addon;
        this.cart.toggleAddon(productId, addon);
      }
    });
  }

  update(state) {
    if (!state.items.length) {
      this.container.innerHTML = `<p class="cart__empty">Your cart is empty. Add a pair you love!</p>`;
      return;
    }

    this.container.innerHTML = state.items
      .map((item) => {
        const { id, name, label, image, quantity, pricePerUnit, decorations, addons } = item;
        const toggleButton = (key, labelText) => `
          <button class="addon-toggle" data-addon="${key}" data-active="${addons[key]}">
            ${labelText}
          </button>`;

        return `
          <article class="cart-item" data-product-id="${id}" role="listitem">
            <img src="${image}" alt="${name}" />
            <div class="cart-item__details">
              <div class="cart-item__header">
                <h3 class="cart-item__name">${label}</h3>
                <span class="cart-item__price">${formatPeso(pricePerUnit)}</span>
              </div>
              <p class="cart-item__decorations">${decorations.join(" · ") || "No add-ons"}</p>
              <div class="cart-item__controls">
                <div class="quantity-control" aria-label="Adjust quantity">
                  <button type="button" data-action="decrement" aria-label="Reduce quantity">−</button>
                  <span>${quantity}</span>
                  <button type="button" data-action="increment" aria-label="Increase quantity">+</button>
                </div>
                ${toggleButton("giftWrap", "Gift Wrap")}
                ${toggleButton("discount", "Discount")}
                ${toggleButton("freeShipping", "Free Ship")}
                <button class="cart-item__remove" type="button" data-action="remove">Remove</button>
              </div>
            </div>
          </article>`;
      })
      .join("");
  }
}

class TotalsPanel {
  constructor(container) {
    this.container = container;
  }

  update(state) {
    const { base, adjustments, grandTotal } = state.totals;
    if (!state.items.length) {
      this.container.innerHTML = "";
      return;
    }

    const adjustmentLabel = adjustments >= 0 ? "+" : "−";
    const adjustmentValue = formatPeso(Math.abs(adjustments));

    this.container.innerHTML = `
      <div class="cart__summary-row">
        <span>Subtotal</span>
        <span>${formatPeso(base)}</span>
      </div>
      <div class="cart__summary-row">
        <span>Add-ons</span>
        <span>${adjustments === 0 ? formatPeso(0) : `${adjustmentLabel}${adjustmentValue}`}</span>
      </div>
      <div class="cart__summary-row cart__summary-total">
        <span>Total</span>
        <span>${formatPeso(grandTotal)}</span>
      </div>
    `;
  }
}

class BadgeView {
  constructor(element) {
    this.element = element;
  }

  update(state) {
    const count = state.items.reduce((sum, item) => sum + item.quantity, 0);
    this.element.textContent = count.toString();
  }
}

// Toast helper ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
class Toast {
  constructor(element) {
    this.element = element;
    this.timeoutId = null;
  }

  show(message) {
    this.element.textContent = message;
    this.element.setAttribute("data-visible", "true");
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.element.removeAttribute("data-visible");
    }, 1800);
  }
}

// Bootstrap ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩ ✮ ⋆ ˚｡𖦹 ⋆｡°✩
document.addEventListener("DOMContentLoaded", () => {
  const factory = new ProductFactory();
  const cart = new Cart();
  const toast = new Toast(document.getElementById("toast"));
  const cartItemsEl = document.getElementById("cart-items");
  const cartSummaryEl = document.getElementById("cart-summary");
  const cartBadgeEl = document.querySelector("[data-cart-count]");
  const checkoutBtn = document.getElementById("checkout-btn");

  const cartListView = new CartListView(cartItemsEl, cart);
  const totalsPanel = new TotalsPanel(cartSummaryEl);
  const badgeView = new BadgeView(cartBadgeEl);

  cart.subscribe(cartListView);
  cart.subscribe(totalsPanel);
  cart.subscribe(badgeView);

  // Render catalog
  const catalogEl = document.getElementById("catalog");
  catalogEl.innerHTML = catalogData
    .map((item) => {
      const product = factory.createProduct(item.type, item);
      return `
        <article class="product-card" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <span class="product-card__price">${formatPeso(product.price)}</span>
          <button type="button" data-action="add">Add to Cart</button>
        </article>
      `;
    })
    .join("");

  catalogEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("[data-action=add]")) return;

    const productCard = target.closest(".product-card");
    if (!productCard) return;
    const id = productCard.dataset.productId;
    const data = catalogData.find((item) => item.id === id);
    if (!data) return;

    const product = factory.createProduct(data.type, data);
    cart.addItem(product);
    toast.show(`${data.name} added to cart`);
  });

  checkoutBtn.addEventListener("click", () => {
    if (!cart.snapshot().items.length) {
      toast.show("Your cart is empty.");
      return;
    }
    cart.clear();
    toast.show("Thanks for shopping! We'll pack your order.");
  });

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
