# 🏆 90minut Matches Card

Nowoczesna karta Home Assistant inspirowana stylem **SofaScore**, wyświetlająca mecze z integracji `90minut.pl`.  
Pokazuje datę, rozgrywki, herby drużyn, wynik oraz wynik meczu (W/P/R) w estetycznym układzie tabelowym.

---

## 🖼️ Podgląd

![Matches Card Preview](https://raw.githubusercontent.com/GieOeRZet/matches-card/main/preview.png)

---

## ⚙️ Instalacja

### 🔹 Opcja 1 – przez HACS (zalecane)
1. W HACS → *Ustawienia → Repozytoria → Dodaj repozytorium*  
2. Wpisz:

https://github.com/GieOeRZet/matches-card
3. Wybierz kategorię: **Frontend**  
4. Po dodaniu znajdź kartę `90minut Matches Card` i zainstaluj.
5. Odśwież interfejs Home Assistant (Ctrl + F5).

### 🔹 Opcja 2 – ręcznie
1. Skopiuj cały folder `matches-card` do:

/config/www/community/matches-card/
2. Dodaj zasoby do `configuration.yaml` lub przez **Ustawienia → Zasoby → Dodaj zasób**:

```yaml
url: /local/community/matches-card/matches-card.js
type: module


🧩 Konfiguracja karty
Karta automatycznie wykrywa mecze z integracji 90minut.pl (np. sensor.90minut_gornik_zabrze_matches).
🔹 Edytor graficzny (GUI)
Po dodaniu nowej karty wybierz „90minut Matches Card” z listy.
Z poziomu interfejsu możesz ustawić:
ParametrTypOpisEncjapickerWybierz sensor 90minut_XXXXTytuł kartytekstDowolna nazwa nagłówkaPokaż herby drużynprzełącznikWłącza / wyłącza loga klubówEfekt hoverprzełącznikPodświetlenie wiersza po najechaniuKolor cienia hoverakolor (rgba)Kolor podświetleniaWyrównanie nazw drużynlistaLewo / środek / prawoRozmiar czcionkiliczbaDomyślnie 14pxSzerokości kolumn (%)pola liczboweData / Liga / Herb / Wynik / Ikona WPR

🧾 Przykład YAML
Jeśli chcesz dodać kartę ręcznie w YAML:



type: custom:matches-card
entity: sensor.90minut_gornik_zabrze_matches   # 🟢 Sensor z atrybutem "matches" (np. z integracji 90minut.pl)

# === PODSTAWOWE USTAWIENIA ===
name: Górnik Zabrze – mecze                    # Nazwa widoczna w nagłówku karty
show_name: true                                # Pokazuj nagłówek karty (true/false)
show_logos: true                               # Pokazuj herby drużyn (true/false)
full_team_names: true                          # Pełne nazwy drużyn zamiast skrótów (true/false)

# === TRYB WYPEŁNIENIA WIERSZY ===
fill: gradient                                 # Typ tła dla wierszy:
                                               #   gradient → kolorowy gradient zależny od wyniku
                                               #   zebra    → naprzemienne szare wiersze
                                               #   system   → neutralny, czysty wygląd

# === W/P/R – WYGRANA/REMIS/PORAŻKA ===
show_symbols: true                             # Pokazuj kółko z literą W / P / R po prawej stronie (true/false)

# === GRADIENT (aktywne tylko przy fill: gradient) ===
gradient_start: 35                             # Początek gradientu (procent szerokości wiersza)
gradient_alpha: 0.5                             # Przezroczystość koloru gradientu (0.0–1.0)

# === CZCIONKI ===
font_size_date: 0.9                            # Wielkość daty (em)
font_size_status: 0.8                          # Wielkość napisu statusu (np. KONIEC)
font_size_teams: 1.0                           # Wielkość nazw drużyn
font_size_score: 1.0                           # Wielkość wyniku

# === ROZMIARY IKON ===
icon_size_league: 26                           # Wysokość ikony ligi (px)
icon_size_crest: 24                            # Wysokość herbu drużyny (px)
icon_size_result: 26                           # Średnica kółka W/P/R (px)

# === KOLORY WYNIKÓW ===
colors:
  win: "#3ba55d"                               # Zielony – wygrana
  loss: "#e23b3b"                              # Czerwony – porażka
  draw: "#468cd2"                              # Niebieski – remis

# === SZEROKOŚCI KOLUMN (w %) ===
columns_pct:
  date: 10                                     # Kolumna z datą i godziną
  league: 10                                   # Kolumna z ligą / pucharem
  crest: 10                                    # Kolumna z herbami
  score: 10                                    # Kolumna z wynikiem
  result: 8                                    # Kolumna z symbolem W/P/R

# === STYL TABELI ===
table:
  zebra: true                                  # Efekt zebry (tylko przy fill=zebra)
  separator: true                              # Cienka linia między wierszami (zawsze aktywna)
  system_colors: true                          # Pozostawia systemowe kolory tła (nie zmienia globalnych stylów)


🌗 Tryb ciemny i jasny
Karta automatycznie dopasowuje się do motywu Home Assistant (dark / light).
Kolory są pobierane z bieżących zmiennych motywu (--primary-color, --card-background-color, --text-color itp.)

🧠 Dodatkowe funkcje (planowane)


⚽ Tryb „compact” – mniejsze odstępy i mniejsze loga


🏅 Grupowanie meczów wg rozgrywek


📆 Filtrowanie tylko najbliższych meczów


🎨 Własne kolory dla W/P/R



🧑‍💻 Autor
Roman (GieOeRZet)
GitHub: github.com/GieOeRZet

🪪 Licencja
Projekt na licencji MIT

📦 Folder struktury
matches-card/
│
├── matches-card.js
├── matches-card-editor.js
├── manifest.json
├── translations/
│   └── pl.json
└── README.md


💡 Po publikacji repozytorium możesz dodać preview.png,
żeby karta ładnie prezentowała się w HACS.

---

✅ **Po tym etapie** masz kompletny zestaw plików:
- działająca karta (`matches-card.js`)
- edytor GUI (`matches-card-editor.js`)
- manifest dla HACS (`manifest.json`)
- tłumaczenia (`translations/pl.json`)
- opis (`README.md`)

---

Jeśli chcesz — mogę teraz pokazać Ci **jak dokładnie przygotować release (wersję)**,  
żeby HACS automatycznie widział Twoją kartę jako aktualizowalną z repozytorium.  
Czy chcesz, żebym Ci to rozpisał krok po kroku (wersjonowanie + tagi GitHub)?


