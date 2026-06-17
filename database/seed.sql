-- Idempotent initial demo data based on the midterm DeutschBuch frontend project.
-- Product titles, levels and categories are preserved from the vize project.

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Menschen A1 Kursbuch', 'Hueber', 'Hueber Verlag', 'A1', 'Ders Kitabı', 'Almancaya yeni başlayanlar için hazırlanmış temel seviye ders kitabıdır.', 420.00, '/images/book-a1.png', true, 'Günlük iletişim, temel kelime bilgisi, alfabe, tanışma ve basit dil yapıları içerir. Vize projesindeki A1 ürün kartı finalde veritabanına taşınmıştır.', 18
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Menschen A1 Kursbuch');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Schritte International Neu A1.1', 'Daniela Niebisch', 'Hueber Verlag', 'A1', 'Çalışma Kitabı', 'Başlangıç seviyesindeki öğrenciler için alıştırmalar ve konu tekrarları içeren yardımcı kaynak.', 390.00, '/images/book-a2.png', true, 'Bol alıştırma, konu pekiştirme, sınıf içi ve bireysel kullanım özellikleriyle temel seviye uyumludur.', 15
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Schritte International Neu A1.1');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Grammatik Aktiv A1-B1', 'Cornelsen', 'Cornelsen', 'B1', 'Grammatik', 'A1-B1 seviyeleri arasında Almanca dilbilgisini sistemli şekilde öğrenmek için hazırlanmış gramer kitabı.', 510.00, '/images/book-grammar.png', true, 'Artikel, Kasus, Präpositionen, Nebensätze ve zamanlar için açıklamalı konu anlatımı ve uygulama soruları içerir.', 22
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Grammatik Aktiv A1-B1');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Sicher! B2 Kursbuch', 'Hueber', 'Hueber Verlag', 'B2', 'Ders Kitabı', 'Orta-üst seviyedeki öğrenciler için iletişim, akademik dil ve ileri düzey kelime yapıları sunar.', 560.00, '/images/book-b2.png', true, 'B2 seviyesi akademik ve günlük içerikler, ileri kelime bilgisi ve sınav hazırlığına destek sağlar.', 9
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Sicher! B2 Kursbuch');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Aspekte Neu C1', 'Klett', 'Klett', 'C1', 'Ders Kitabı', 'İleri düzey Almanca kullanıcıları için akademik ve profesyonel dil kullanımına odaklanan kaynak.', 610.00, '/images/book-c1.png', false, 'Metin analizi, akademik içerikler ve profesyonel kullanım odaklı ileri düzey çalışma kitabıdır.', 7
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Aspekte Neu C1');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Deutsch Prüfungsbuch TestDaF', 'Lang Akademie', 'Lang Akademie', 'B2-C1', 'Sınav Hazırlık', 'TestDaF sınavına hazırlanan öğrenciler için örnek sorular, stratejiler ve uygulamalar içerir.', 480.00, '/images/book-speaking.png', false, 'Deneme sınavları, sınav stratejileri ve B2-C1 kullanıcıları için uygulama bölümleri içerir.', 11
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Deutsch Prüfungsbuch TestDaF');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Lektüre für Deutsch B1', 'Cornelsen', 'Cornelsen', 'B1', 'Lektüre', 'Okuma becerisini geliştirmek isteyen öğrenciler için seviyelendirilmiş hikaye ve metin çalışmaları.', 350.00, '/images/book-b1.png', false, 'B1 okuma metinleri, kelime geliştirme ve anlama çalışmaları bağımsız çalışma için uygundur.', 14
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Lektüre für Deutsch B1');

INSERT INTO products (name, author, publisher, level, category, description, price, image_url, featured, details, stock_quantity)
SELECT 'Wortschatz Trainer B2', 'Hueber', 'Hueber Verlag', 'B2', 'Wortschatz', 'B2 seviyesindeki öğrenciler için tematik kelime çalışmaları ve tekrar odaklı kaynak.', 430.00, '/images/book-vocab.png', false, 'Tematik kelime alanları, tekrar testleri ve sınav desteği içerir.', 20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Wortschatz Trainer B2');
