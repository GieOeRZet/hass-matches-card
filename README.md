# 🏟️ Matches Card (90minut)

![Matches Card preview](https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png)

## 📋 Opis

**Matches Card (90minut)** to niestandardowa karta Lovelace dla Home Assistanta, która wyświetla terminarz, wyniki i szczegóły meczów pobierane z integracji `90minut.pl`.

Karta została zaprojektowana z myślą o czystym, nowoczesnym wyglądzie oraz pełnej elastyczności konfiguracji.  
Wspiera zarówno tryb ciemny, jak i jasny, różne tryby wypełnienia (gradient, zebra, clear) i pełny edytor GUI.

---

## ✨ Funkcje

- ⚽ **Tryby wypełnienia:** gradient / zebra / clear  
- 🌓 **Tryb jasny / ciemny / auto**  
- 🧩 **Edytor GUI (ha-form)** – pełna konfiguracja bez YAML  
- 🏆 **Obsługa logo lig (Ekstraklasa, Puchar Polski, itp.)**  
- 🏟️ **Nazwy drużyn pełne lub skrócone**  
- 🎨 **Kolory wyników (wygrana/remis/porażka)**  
- 📐 **Regulacja czcionek, ikon i szerokości kolumn**  
- 🧰 **Zachowuje się dobrze w dashboardach typu Masonry i Sections**

---

## 📦 Instalacja przez HACS

1. Otwórz **HACS → Frontend → trzy kropki (⋮) → Custom repositories**  
2. Wpisz:  
   - **URL:** `https://github.com/GieOeRZet/matches-card`  
   - **Category:** `Frontend`
3. Kliknij **Dodaj → Zainstaluj** kartę **Matches Card (90minut)**  
4. Po instalacji HACS automatycznie doda zasoby:  
   - `/hacsfiles/matches-card/matches-card.js`  
   - `/hacsfiles/matches-card/matches-card-editor.js`
5. W pliku dashboardu (lub przez UI) dodaj kartę:
   ```yaml
   type: custom:matches-card
   entity: sensor.90minut_gornik_zabrze_matches
   ```

---

## 🧠 Konfiguracja (opcje YAML)

Przykładowa konfiguracja karty:

```yaml
type: custom:matches-card
entity: sensor.90minut_gornik_zabrze_matches
name: 90minut Matches
show_name: true
show_logos: true
full_team_names: true
show_result_symbols: true
fill_mode: gradient
theme_mode: auto
light_mode: false
font_size:
  date: 0.9
  status: 0.8
  teams: 1.0
  score: 1.0
icon_size:
  league: 26
  crest: 24
  result: 26
gradient:
  alpha: 0.5
  start: 35
  end: 100
columns_pct:
  date: 10
  league: 10
  crest: 10
  score: 10
  result: 8
colors:
  win: "#3ba55d"
  loss: "#e23b3b"
  draw: "#468cd2"
```

---

## 🧩 Struktura repozytorium

```
matches-card/
├── logo/
│   ├── ekstraklasa.png
│   ├── puchar.png
│   └── ...
├── matches-card.js
├── matches-card-editor.js
├── manifest.json
├── hacs.json
├── info.md
└── README.md
```

---

## 🧱 Licencja

Projekt udostępniany na licencji **MIT**.

Autor: **GieOeRZet**  
GitHub: [GieOeRZet/matches-card](https://github.com/GieOeRZet/matches-card)
