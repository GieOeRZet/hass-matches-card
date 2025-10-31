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

Parametr	Typ	Opis
Encja	picker	Wybierz sensor 90minut_XXXX
Tytuł karty	tekst	Dowolna nazwa nagłówka
Pokaż herby drużyn	przełącznik	Włącza / wyłącza loga klubów
Efekt hover	przełącznik	Podświetlenie wiersza po najechaniu
Kolor cienia hovera	kolor (rgba)	Kolor podświetlenia
Wyrównanie nazw drużyn	lista	Lewo / środek / prawo
Rozmiar czcionki	liczba	Domyślnie 14px
Szerokości kolumn (%)	pola liczbowe	Data / Liga / Herb / Wynik / Ikona WPR
🧾 Przykład YAML

Jeśli chcesz dodać kartę ręcznie w YAML:

type: custom:matches-card
entity: sensor.90minut_gornik_zabrze_matches
name: Górnik Zabrze – Mecze
show_logos: true
hover_enabled: true
hover_shadow_color: rgba(0, 0, 0, 0.25)
alignment: left
font_size: 14
column_widths:
  date: 12
  league: 8
  logo: 12
  score: 10
  result: 8

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