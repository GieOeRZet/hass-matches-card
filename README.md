# 🏟️ MatchesCard – Karta meczów 90minut.pl

**MatchesCard** to niestandardowa karta Lovelace dla Home Assistant, która prezentuje nadchodzące i zakończone mecze z serwisu [90minut.pl](https://90minut.pl),  
na podstawie danych z sensora (`sensor.*`) dostarczającego listę meczów w atrybucie `matches`.

---

## 📦 Funkcje

✅ Gradientowe tło RGBA dla wyników  
✅ Obsługa kolorów: wygrana, remis, porażka  
✅ Wyświetlanie logotypów drużyn i lig  
✅ Dynamiczny edytor GUI w Home Assistant  
✅ Kompatybilność z HACS (Home Assistant Community Store)  
✅ Styl i layout zgodny z wersją JS `v0.3.009`

---

## 🖼️ Przykład karty

<p align="center">
  <img src="https://raw.githubusercontent.com/GieOeRZet/matches-card/main/docs/example.png" width="800"/>
</p>

---

## ⚙️ Instalacja

### 🔹 1. Przez HACS (zalecane)
1. Otwórz **HACS → Frontend → Custom repositories**
2. Dodaj adres repozytorium:
https://github.com/GieOeRZet/matches-card

yaml
Skopiuj kod
3. Typ: `Lovelace`
4. Po zainstalowaniu karty **uruchom ponownie Home Assistant**

---

### 🔹 2. Ręczna instalacja
1. Pobierz najnowsze wydanie z [Releases](https://github.com/GieOeRZet/matches-card/releases/latest)
2. Skopiuj plik:
dist/matches-card.js

arduino
Skopiuj kod
do katalogu:
/config/www/matches-card.js

arduino
Skopiuj kod
3. Dodaj do zasobów (Ustawienia → Pulpity → Zasoby):
/local/matches-card.js

yaml
Skopiuj kod
typ: `JavaScript Module`

---

## 🧩 Użycie w Lovelace (YAML)

```yaml
type: custom:matches-card
entity: sensor.gornik_matches   # sensor z atrybutem matches
name: Górnik Zabrze – Wyniki
show_name: true
show_logos: true
fill: gradient    # gradient | zebra | none
show_result_symbol: true
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
colors:
win: "#3ba55d"
loss: "#e23b3b"
draw: "#468cd2"
🧱 Dane sensora
Karta oczekuje, że Twój sensor (sensor.gornik_matches) posiada w atrybutach listę matches, np.:

yaml
Skopiuj kod
matches:
  - date: "2025-11-09 18:00"
    home: "Górnik Zabrze"
    away: "Legia Warszawa"
    logo_home: "https://example.com/gornik.png"
    logo_away: "https://example.com/legia.png"
    score: "3-1"
    result: "win"
    finished: true
    league: "L"
  - date: "2025-11-15 17:30"
    home: "Śląsk Wrocław"
    away: "Górnik Zabrze"
    logo_home: "https://example.com/slask.png"
    logo_away: "https://example.com/gornik.png"
    score: "-"
    result: ""
    finished: false
    league: "PP"
🏆 Kolory i style
Wynik	Kolor	Domyślnie
🟢 Wygrana	colors.win	#3ba55d
🔵 Remis	colors.draw	#468cd2
🔴 Porażka	colors.loss	#e23b3b

🖼️ Logotypy lig
Karta automatycznie ładuje logotypy lig z repozytorium:

bash
Skopiuj kod
https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/
Domyślnie obsługuje:

Skrót	Plik	Podgląd
L	ekstraklasa.png	
PP	puchar.png	

🧠 Konfiguracja GUI (Edytor)
Karta zawiera natywny edytor konfiguracji z polami:

Sensor (entity picker)

Nazwa karty

Tryb wypełnienia: gradient / zebra / none

Przełączniki: Pokaż nazwę, Pokaż loga, Pokaż symbole wyników

Nie wymaga MWC ani zewnętrznych bibliotek – wszystko oparte o natywne ha-* komponenty HA.

💻 Build lokalny (dla deweloperów)
Zainstaluj zależności:

bash
Skopiuj kod
npm install
Uruchom build:

bash
Skopiuj kod
npm run build
lub tryb developerski:

bash
Skopiuj kod
npm start
Wynikowy plik:

bash
Skopiuj kod
dist/matches-card.js
🧩 Struktura repozytorium
pgsql
Skopiuj kod
matches-card/
├─ dist/
│   └─ matches-card.js
├─ logo/
│   ├─ ekstraklasa.png
│   └─ puchar.png
├─ src/
│   ├─ matches-card.ts
│   ├─ matches-card-editor.ts
│   ├─ const.ts
│   ├─ types.ts
│   └─ fire-event.ts
├─ package.json
├─ rollup.config.mjs
├─ tsconfig.json
├─ hacs.json
├─ manifest.json
├─ README.md
└─ .gitignore
📦 Plik manifest.json
json
Skopiuj kod
{
  "domain": "matches-card",
  "name": "Matches Card",
  "documentation": "https://github.com/GieOeRZet/matches-card",
  "issue_tracker": "https://github.com/GieOeRZet/matches-card/issues",
  "version": "0.3.010",
  "codeowners": ["@GieOeRZet"],
  "requirements": [],
  "iot_class": "local_push",
  "render_readme": true,
  "filename": "matches-card.js",
  "homeassistant": "2024.8.0"
}
📜 Licencja
MIT © 2025 Roman (GieOeRZet)

yaml
Skopiuj kod

---

✅ **Wklej to do:**  
`matches-card/README.md`

✅ **Efekt:**  
Będzie idealnie wyświetlany na GitHub i automatycznie w HACS (z tytułem, grafiką, kodami YAML i tabelami).

Chcesz, żebym dorzucił Ci gotowy `docs/example.png` (wizualny podgląd karty w Twoim stylu)?
