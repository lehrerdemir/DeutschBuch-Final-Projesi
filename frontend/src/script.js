const books = [
  {
    id: 1,
    title: "Menschen A1 Kursbuch",
    author: "Hueber",
    publisher: "Hueber Verlag",
    price: 420,
    level: "A1",
    category: "Ders Kitabı",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=900&auto=format&fit=crop",
    description: "Almancaya yeni başlayanlar için hazırlanmış temel seviye ders kitabıdır. Günlük iletişim, temel kelime bilgisi ve basit dil yapıları içerir.",
    features: ["Temel diyaloglar", "Günlük yaşam temaları", "Dinleme ve okuma etkinlikleri", "Yeni başlayanlar için uygun"]
  },
  {
    id: 2,
    title: "Schritte International Neu A1.1",
    author: "Daniela Niebisch",
    publisher: "Hueber Verlag",
    price: 390,
    level: "A1",
    category: "Çalışma Kitabı",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=900&auto=format&fit=crop",
    description: "Başlangıç seviyesindeki öğrenciler için alıştırmalar ve konu tekrarları içeren yardımcı kaynak.",
    features: ["Bol alıştırma", "Konu pekiştirme", "Sınıf içi ve bireysel kullanım", "Temel seviye uyumlu"]
  },
  {
    id: 3,
    title: "Grammatik Aktiv A1-B1",
    author: "Cornelsen",
    publisher: "Cornelsen",
    price: 510,
    level: "B1",
    category: "Grammatik",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=900&auto=format&fit=crop",
    description: "A1-B1 seviyeleri arasında Almanca dilbilgisini sistemli şekilde öğrenmek için hazırlanmış kapsamlı gramer kitabı.",
    features: ["A1-B1 kapsamı", "Açıklamalı konu anlatımı", "Uygulama soruları", "Kendi kendine çalışmaya uygun"]
  },
  {
    id: 4,
    title: "Sicher! B2 Kursbuch",
    author: "Hueber",
    publisher: "Hueber Verlag",
    price: 560,
    level: "B2",
    category: "Ders Kitabı",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=900&auto=format&fit=crop",
    description: "Orta-üst seviyedeki öğrenciler için iletişim, akademik dil ve ileri düzey kelime yapıları sunar.",
    features: ["B2 seviyesi", "Akademik ve günlük içerik", "İleri kelime bilgisi", "Sınav hazırlığına destek"]
  },
  {
    id: 5,
    title: "Aspekte Neu C1",
    author: "Klett",
    publisher: "Klett",
    price: 610,
    level: "C1",
    category: "Ders Kitabı",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=900&auto=format&fit=crop",
    description: "İleri düzey Almanca kullanıcıları için hazırlanmış, akademik ve profesyonel dil kullanımına odaklanan kaynak.",
    features: ["C1 seviyesi", "Akademik içerikler", "Metin analizi", "Profesyonel kullanım odaklı"]
  },
  {
    id: 6,
    title: "Deutsch Prüfungsbuch TestDaF",
    author: "Lang Akademie",
    publisher: "Lang Akademie",
    price: 480,
    level: "B2-C1",
    category: "Sınav Hazırlık",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=900&auto=format&fit=crop",
    description: "TestDaF sınavına hazırlanan öğrenciler için örnek sorular, stratejiler ve uygulamalar içerir.",
    features: ["TestDaF odaklı", "Deneme sınavları", "Sınav stratejileri", "B2-C1 kullanıcıları için"]
  },
  {
    id: 7,
    title: "Lektüre für Deutsch B1",
    author: "Cornelsen",
    publisher: "Cornelsen",
    price: 350,
    level: "B1",
    category: "Lektüre",
    image: "https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=900&auto=format&fit=crop",
    description: "Okuma becerisini geliştirmek isteyen öğrenciler için seviyelendirilmiş hikaye ve metin çalışmaları.",
    features: ["B1 okuma metinleri", "Kelime geliştirme", "Anlama çalışmaları", "Bağımsız çalışma için uygun"]
  },
  {
    id: 8,
    title: "Wortschatz Trainer B2",
    author: "Hueber",
    publisher: "Hueber Verlag",
    price: 430,
    level: "B2",
    category: "Wortschatz",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=900&auto=format&fit=crop",
    description: "B2 seviyesindeki öğrenciler için tematik kelime çalışmaları ve tekrar odaklı kaynak.",
    features: ["Tematik kelime alanları", "Tekrar testleri", "İleri kelime çalışması", "Sınav desteği"]
  }
];

let filteredBooks = [...books];
let cart = JSON.parse(localStorage.getItem("deutschbuch_cart")) || [];

const booksContainer = document.getElementById("booksContainer");
const featuredBooks = document.getElementById("featuredBooks");
const searchInput = document.getElementById("searchInput");
const levelFilter = document.getElementById("levelFilter");
const categoryFilter = document.getElementById("categoryFilter");
const resetFilters = document.getElementById("resetFilters");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const totalItems = document.getElementById("totalItems");
const totalPrice = document.getElementById("totalPrice");

const detailModal = document.getElementById("detailModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

function formatPrice(value){
  return `₺${value}`;
}

function cardTemplate(book){
  return `
    <div class="book-card">
      <div class="book-image-wrap">
        <img src="${book.image}" alt="${book.title}">
        <div class="hover-actions">
          <button class="card-btn gold add-to-cart" data-id="${book.id}">Sepete Ekle</button>
          <button class="card-btn view-detail" data-id="${book.id}">Detay</button>
        </div>
      </div>
      <div class="book-content">
        <div class="badges">
          <span class="badge">${book.level}</span>
          <span class="badge outline">${book.category}</span>
        </div>
        <h3>${book.title}</h3>
        <p>${book.publisher}</p>
        <div class="price-row">
          <span class="price">${formatPrice(book.price)}</span>
          <button class="card-btn view-detail" data-id="${book.id}">İncele</button>
        </div>
      </div>
    </div>
  `;
}

function renderFeatured(){
  featuredBooks.innerHTML = books.slice(0,4).map(cardTemplate).join("");
}

function renderBooks(){
  booksContainer.innerHTML = filteredBooks.map(cardTemplate).join("");
  bindCardEvents();
}

function bindCardEvents(){
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.onclick = () => addToCart(Number(btn.dataset.id));
  });

  document.querySelectorAll(".view-detail").forEach(btn => {
    btn.onclick = () => openDetail(Number(btn.dataset.id));
  });
}

function applyFilters(){
  const searchValue = searchInput.value.trim().toLowerCase();
  const levelValue = levelFilter.value;
  const categoryValue = categoryFilter.value;

  filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchValue) ||
      book.publisher.toLowerCase().includes(searchValue);
    const matchesLevel = levelValue ? book.level === levelValue : true;
    const matchesCategory = categoryValue ? book.category === categoryValue : true;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  renderBooks();
}

function setLevelAndJump(level){
  levelFilter.value = level;
  applyFilters();
  document.getElementById("books").scrollIntoView({behavior:"smooth"});
}

function setCategoryAndJump(category){
  categoryFilter.value = category;
  applyFilters();
  document.getElementById("books").scrollIntoView({behavior:"smooth"});
}

function openDetail(id){
  const book = books.find(b => b.id === id);
  if(!book) return;

  modalContent.innerHTML = `
    <div class="modal-detail">
      <div>
        <img src="${book.image}" alt="${book.title}">
      </div>
      <div>
        <div class="badges">
          <span class="badge">${book.level}</span>
          <span class="badge outline">${book.category}</span>
        </div>
        <h2>${book.title}</h2>
        <p><strong>Yazar:</strong> ${book.author}</p>
        <p><strong>Yayınevi:</strong> ${book.publisher}</p>
        <p><strong>Fiyat:</strong> ${formatPrice(book.price)}</p>
        <p>${book.description}</p>
        <h3>Öğrenme Kazanımları</h3>
        <ul class="feature-list">
          ${book.features.map(item => `<li>${item}</li>`).join("")}
        </ul>
        <div style="margin-top:20px; display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn primary" id="modalAddToCart">Sepete Ekle</button>
        </div>
      </div>
    </div>
  `;

  detailModal.classList.add("show");
  document.getElementById("modalAddToCart").onclick = () => addToCart(book.id);
}

function closeDetail(){
  detailModal.classList.remove("show");
}

function saveCart(){
  localStorage.setItem("deutschbuch_cart", JSON.stringify(cart));
}

function addToCart(id){
  const existing = cart.find(item => item.id === id);
  if(existing){
    existing.qty += 1;
  } else {
    const product = books.find(b => b.id === id);
    cart.push({...product, qty:1});
  }
  saveCart();
  renderCart();
  openCart();
}

function increaseQty(id){
  const item = cart.find(i => i.id === id);
  if(item){
    item.qty += 1;
    saveCart();
    renderCart();
  }
}

function decreaseQty(id){
  const item = cart.find(i => i.id === id);
  if(!item) return;

  item.qty -= 1;
  if(item.qty <= 0){
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function renderCart(){
  if(cart.length === 0){
    cartItems.innerHTML = `<p>Sepetiniz boş.</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <h4>${item.title}</h4>
          <p>${formatPrice(item.price)} x ${item.qty}</p>
          <div class="qty-box">
            <button class="qty-btn" data-decrease="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-increase="${item.id}">+</button>
          </div>
        </div>
        <strong>${formatPrice(item.price * item.qty)}</strong>
      </div>
    `).join("");
  }

  const totalQty = cart.reduce((sum,item)=>sum + item.qty, 0);
  const totalAmount = cart.reduce((sum,item)=>sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;
  totalItems.textContent = totalQty;
  totalPrice.textContent = formatPrice(totalAmount);

  document.querySelectorAll("[data-increase]").forEach(btn => {
    btn.onclick = () => increaseQty(Number(btn.dataset.increase));
  });

  document.querySelectorAll("[data-decrease]").forEach(btn => {
    btn.onclick = () => decreaseQty(Number(btn.dataset.decrease));
  });
}

function openCart(){
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCartDrawer(){
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartToggle.onclick = openCart;
closeCart.onclick = closeCartDrawer;
cartOverlay.onclick = closeCartDrawer;
closeModal.onclick = closeDetail;
detailModal.addEventListener("click", (e) => {
  if(e.target === detailModal) closeDetail();
});

searchInput.addEventListener("input", applyFilters);
levelFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  levelFilter.value = "";
  categoryFilter.value = "";
  applyFilters();
});

document.querySelectorAll("[data-level-jump]").forEach(btn => {
  btn.addEventListener("click", () => setLevelAndJump(btn.dataset.levelJump));
});

document.querySelectorAll(".menu-filter-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    setLevelAndJump(link.dataset.level);
  });
});

document.querySelectorAll(".menu-category-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    setCategoryAndJump(link.dataset.category);
  });
});

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index){
  slides.forEach(slide => slide.classList.remove("active"));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

document.getElementById("nextSlide").onclick = () => showSlide(currentSlide + 1);
document.getElementById("prevSlide").onclick = () => showSlide(currentSlide - 1);
setInterval(() => showSlide(currentSlide + 1), 5000);

renderFeatured();
renderBooks();
renderCart();
bindCardEvents();
