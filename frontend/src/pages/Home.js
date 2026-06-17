import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { getAllProducts, getTopProducts } from "../services/productService";
import { resolveImageUrl, formatTRY } from "../config";
import "../styles/home-v2.css";

const levels = ["A1", "A2", "B1", "B2", "B2-C1", "C1", "C2"];
const categories = ["Ders Kitabı", "Çalışma Kitabı", "Grammatik", "Sınav Hazırlık", "Lektüre", "Wortschatz"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { items: cartItems, add: addToCart } = useCart();

  // Lade Produkte beim Mount
  useEffect(() => {
    let mounted = true;
    Promise.all([
      getAllProducts(),
      getTopProducts()
    ])
      .then(([allData, topData]) => {
        if (mounted) {
          setProducts(allData || []);
          setFeaturedProducts(topData || (allData || []).slice(0, 4));
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Auto-Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const text = [p.name, p.description, p.details, p.publisher, p.author, p.category, p.level]
        .filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !q || text.includes(q);
      const matchesLevel = !level || p.level === level;
      const matchesCategory = !category || p.category === category;
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [products, query, level, category]);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartOpen(true);
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
  };

  const handleSetLevel = (lv) => {
    setLevel(lv);
    setTimeout(() => {
      document.getElementById("books")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleSetCategory = (cat) => {
    setCategory(cat);
    setTimeout(() => {
      document.getElementById("books")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="home-v2">
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <span>info@deutschbuch.com</span>
          <div className="topbar-links">
            <a href="#contact">İletişim</a>
            <a href="#cartSection" onClick={() => setCartOpen(true)}>Sepetim</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="header">
        <div className="container header-inner">
          <a href="#home" className="logo">DeutschBuch</a>

          <nav className="main-nav">
            <ul className="menu">
              <li><a href="#home">Anasayfa</a></li>

              <li className="has-dropdown">
                <a href="#books">Kategoriler</a>
                <div className="dropdown mega-menu">
                  <div className="mega-column">
                    <h4>Seviyeler</h4>
                    {levels.map(lv => (
                      <a key={lv} href="#" onClick={(e) => { e.preventDefault(); handleSetLevel(lv); }} className="menu-filter-link">
                        {lv} Kitapları
                      </a>
                    ))}
                  </div>
                  <div className="mega-column">
                    <h4>Kategoriler</h4>
                    {categories.map(cat => (
                      <a key={cat} href="#" onClick={(e) => { e.preventDefault(); handleSetCategory(cat); }} className="menu-category-link">
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              <li><a href="#featured">Öne Çıkanlar</a></li>
              <li><a href="#levels">Seviyeler</a></li>
              <li><a href="#contact">İletişim</a></li>
            </ul>
          </nav>

          <button className="cart-button" onClick={() => setCartOpen(true)}>
            🛒 <span>{totalCartItems}</span>
          </button>
        </div>
      </header>

      <main id="home">
        {/* Slider Section */}
        <section className="slider-section">
          <div className={`slide ${currentSlide === 0 ? "active" : ""}`}>
            <div className="container slide-inner">
              <div className="slide-text">
                <span className="eyebrow">DeutschBuch</span>
                <h1>Almanca öğrenmeye doğru seviyeden başla</h1>
                <p>A1'den C2'ye kadar seviyene uygun Almanca kitaplarını keşfet. Ders kitabı, gramer, kelime ve sınav hazırlık kaynakları tek yerde.</p>
                <div className="hero-actions">
                  <a href="#books" className="btn primary">Kitapları İncele</a>
                  <a href="#levels" className="btn secondary">Seviye Seç</a>
                </div>
              </div>
              <div className="slide-image">
                <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop" alt="Kitaplar" />
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
            <div className="container slide-inner">
              <div className="slide-text">
                <span className="eyebrow">Sınav Hazırlık</span>
                <h1>TestDaF ve Telc için doğru kaynaklar</h1>
                <p>Orta ve ileri seviyedeki öğrenciler için sınav odaklı kitaplar, deneme içerikleri ve strateji kaynakları.</p>
                <div className="hero-actions">
                  <a href="#books" className="btn primary">Sınav Kitapları</a>
                  <a href="#featured" className="btn secondary">Öne Çıkanlar</a>
                </div>
              </div>
              <div className="slide-image">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop" alt="Sınav kitapları" />
              </div>
            </div>
          </div>

          <div className="slider-controls">
            <button onClick={() => setCurrentSlide((prev) => (prev - 1 + 2) % 2)}>‹</button>
            <button onClick={() => setCurrentSlide((prev) => (prev + 1) % 2)}>›</button>
          </div>
        </section>

        {/* Service Strip */}
        <section className="service-strip">
          <div className="container service-grid">
            <div className="service-card">
              <h3>Ücretsiz Kargo</h3>
              <p>750 TL üzeri siparişlerde</p>
            </div>
            <div className="service-card">
              <h3>Online Destek</h3>
              <p>09:00 - 18:30 arası</p>
            </div>
            <div className="service-card">
              <h3>Kolay Seviye Filtreleme</h3>
              <p>A1'den C2'ye hızlı erişim</p>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="section" id="featured">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-tag">ÖNE ÇIKANLAR</span>
                <h2>Popüler Kitaplar</h2>
              </div>
              <a href="#books" className="text-link">Tümünü Gör</a>
            </div>
            <div className="book-grid">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="book-card">
                  <div className="book-image-wrap">
                    <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
                    <div className="hover-actions">
                      <button className="card-btn gold add-to-cart" onClick={() => handleAddToCart(product)}>Sepete Ekle</button>
                      <button className="card-btn view-detail" onClick={() => handleOpenDetail(product)}>Detay</button>
                    </div>
                  </div>
                  <div className="book-content">
                    <div className="badges">
                      <span className="badge">{product.level}</span>
                      <span className="badge outline">{product.category}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.publisher}</p>
                    <div className="price-row">
                      <span className="price">{formatTRY(product.price)}</span>
                      <button className="card-btn view-detail" onClick={() => handleOpenDetail(product)}>İncele</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section className="section light" id="levels">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-tag">SEVİYELER</span>
                <h2>Seviyene göre kitap seç</h2>
              </div>
            </div>

            <div className="levels-grid">
              {levels.map((lv) => (
                <button key={lv} className="level-box" onClick={() => handleSetLevel(lv)}>
                  {lv}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Books Section */}
        <section className="section" id="books">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-tag">KİTAPLAR</span>
                <h2>Tüm Kitaplar</h2>
              </div>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Kitap ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Tüm Seviyeler</option>
                {levels.map((lv) => (
                  <option key={lv} value={lv}>{lv}</option>
                ))}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="btn ghost" onClick={() => { setQuery(""); setLevel(""); setCategory(""); }}>
                Filtreyi Temizle
              </button>
            </div>

            <div className="book-grid">
              {loading ? (
                <p>Yükleniyor...</p>
              ) : filtered.length > 0 ? (
                filtered.map((product) => (
                  <div key={product.id} className="book-card">
                    <div className="book-image-wrap">
                      <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
                      <div className="hover-actions">
                        <button className="card-btn gold add-to-cart" onClick={() => handleAddToCart(product)}>Sepete Ekle</button>
                        <button className="card-btn view-detail" onClick={() => handleOpenDetail(product)}>Detay</button>
                      </div>
                    </div>
                    <div className="book-content">
                      <div className="badges">
                        <span className="badge">{product.level}</span>
                        <span className="badge outline">{product.category}</span>
                      </div>
                      <h3>{product.name}</h3>
                      <p>{product.publisher}</p>
                      <div className="price-row">
                        <span className="price">{formatTRY(product.price)}</span>
                        <button className="card-btn view-detail" onClick={() => handleOpenDetail(product)}>İncele</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aradığınız filtrelere uygun ürün bulunamadı.</p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section light" id="contact">
          <div className="container contact-box">
            <span className="section-tag">İLETİŞİM</span>
            <h2>Bizimle İletişime Geçin</h2>
            <p>DeutschBuch, Almanca öğrenen kullanıcıların seviyelerine göre doğru kitapları bulmasını kolaylaştıran Websitesidir.</p>
            <p><strong>E-posta:</strong> info@deutschbuch.com</p>
            <p><strong>Telefon:</strong> +90 530 520 87 28</p>
            <p><strong>Adres:</strong> İstanbul / Türkiye</p>
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Sepetim</h3>
          <button onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{formatTRY(item.price)} x {item.quantity}</p>
                </div>
                <strong>{formatTRY(item.price * item.quantity)}</strong>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer" id="cartSection">
          <div className="summary-row">
            <span>Toplam Ürün</span>
            <strong>{totalCartItems}</strong>
          </div>
          <div className="summary-row">
            <span>Toplam Tutar</span>
            <strong>{formatTRY(totalCartPrice)}</strong>
          </div>
          <a href="/checkout" className="btn primary full">Siparişi Tamamla</a>
        </div>
      </aside>

      {/* Cart Overlay */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}></div>
      )}

      {/* Detail Modal */}
      {detailOpen && selectedProduct && (
        <div className="modal show" onClick={handleCloseDetail}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseDetail}>✕</button>
            <div className="modal-detail">
              <div>
                <img src={resolveImageUrl(selectedProduct.imageUrl)} alt={selectedProduct.name} />
              </div>
              <div>
                <div className="badges">
                  <span className="badge">{selectedProduct.level}</span>
                  <span className="badge outline">{selectedProduct.category}</span>
                </div>
                <h2>{selectedProduct.name}</h2>
                <p><strong>Yazar:</strong> {selectedProduct.author}</p>
                <p><strong>Yayınevi:</strong> {selectedProduct.publisher}</p>
                <p><strong>Fiyat:</strong> {formatTRY(selectedProduct.price)}</p>
                <p>{selectedProduct.description}</p>
                {selectedProduct.details && (
                  <>
                    <h3>Öğrenme Kazanımları</h3>
                    <ul className="feature-list">
                      {selectedProduct.details.split(",").map((item, idx) => (
                        <li key={idx}>{item.trim()}</li>
                      ))}
                    </ul>
                  </>
                )}
                <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button className="btn primary" onClick={() => { handleAddToCart(selectedProduct); handleCloseDetail(); }}>
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}