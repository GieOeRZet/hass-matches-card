# 🏟️ Matches Card (90minut)

Karta Lovelace dla integracji [90minut.pl](https://90minut.pl).

**Funkcje:**
- gradient / zebra / clear fill modes  
- automatyczny tryb jasny / ciemny  
- logo ligowe (Ekstraklasa, Puchar Polski)  
- wynik, symbole, pełne nazwy drużyn  
- pełna konfiguracja przez edytor GUI  

**Instalacja przez HACS:**
1. W HACS → Frontend → trzy kropki → *Custom repositories*  
   URL: `https://github.com/GieOeRZet/matches-card`  
   Category: `Frontend`
2. Zainstaluj **Matches Card (90minut)**
3. HACS automatycznie doda zasoby:
   - `/hacsfiles/matches-card/matches-card.js`
   - `/hacsfiles/matches-card/matches-card-editor.js`
4. W Lovelace użyj:
   ```yaml
   type: custom:matches-card
   entity: sensor.90minut_gornik_zabrze_matches
   ```
