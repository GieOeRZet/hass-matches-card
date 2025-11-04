# 🏆 Matches Card (90minut)
**Version:** `v0.9.0-beta`  
**Author:** [@GieOeRZet](https://github.com/GieOeRZet)  
**Repository:** [GieOeRZet/matches-card](https://github.com/GieOeRZet/matches-card)

Nowoczesna karta Home Assistant prezentująca mecze, wyniki i terminarze z sensora **90minut.pl**, 
z lokalnym ładowaniem logotypów, kolorowym gradientem wyników i nowym edytorem SmartAccordion+Visual.

---

## ⚙️ **Najważniejsze funkcje**
- 🎨 **Tryby wypełnienia:** gradient / zebra / none  
- 🧩 **Lokalne logotypy lig i drużyn** (działają offline)  
- ⚽ **Kolory wyników:** wygrana / remis / porażka  
- 🧠 **Nowy edytor SmartAccordion+Visual:**  
  - sekcje zwijane z ikonami  
  - pola numeryczne zamiast suwaków  
  - automatyczne tłumaczenie (PL / EN)  
  - ciemny / jasny motyw interfejsu  
- 💾 **Zgodność z HACS** – pełna integracja i automatyczne aktualizacje  

---

## 🧩 **Instalacja przez HACS**
1. W HACS → **Ustawienia → Niestandardowe repozytoria → Dodaj repozytorium**
2. Adres repozytorium:
   ```
   https://github.com/GieOeRZet/matches-card
   ```
3. Typ: **Frontend**
4. Po instalacji uruchom ponownie interfejs (Ctrl + F5)

---

## 🧠 **Ręczna instalacja**
1. Pobierz paczkę ZIP:  
   [📦 matches-card_v0.9.0-beta_full.zip](https://github.com/GieOeRZet/matches-card/releases)
2. Wypakuj do folderu:
   ```
   /config/www/community/matches-card/
   ```
3. Dodaj do zasobów w `configuration.yaml` lub z poziomu interfejsu:
   ```yaml
   url: /local/community/matches-card/matches-card.js
   type: module
   ```

---

## ⚙️ **Przykład konfiguracji YAML**
```yaml
type: custom:matches-card
entity: sensor.90minut_gornik_zabrze_matches
show_logos: true
fill_mode: gradient
show_result_symbols: true
theme_mode: auto
```

---

## 📁 **Struktura katalogu**
```
matches-card/
 ├── matches-card.js
 ├── matches-card-editor.js
 ├── manifest.json
 ├── hacs.json
 ├── README.md
 ├── translations/
 │    ├── pl.json
 │    └── en.json
 └── logo/
      ├── ekstraklasa.png
      ├── puchar.png
      └── 1liga.png
```

📘 Jeśli karta nie znajdzie logotypu ligi – wyświetli tekstowy skrót (np. „PP”, „L”, „1L”).

---

## 🌍 **Tłumaczenia**
Edytor automatycznie wykrywa język Home Assistant i dopasowuje etykiety (PL / EN).

---

## 🧾 **Changelog**
### v0.9.0-beta
- Nowy edytor SmartAccordion+Visual  
- Dwujęzyczne tłumaczenia (PL/EN)  
- Logotypy offline (pobierane lokalnie z `/local/community/matches-card/logo/`)  
- Kwadratowe herby drużyn z białym tłem  
- Gradient w formacie RGBA (poprawione renderowanie)  
- Brak separatora pod ostatnim wierszem  
- Poprawione wartości domyślne YAML  

---

## ❤️ **Autor**
Projekt i wykonanie: **GieOeRZet**  
Repozytorium GitHub: [https://github.com/GieOeRZet/matches-card](https://github.com/GieOeRZet/matches-card)
