# MatchesCard (HACS)

Custom Lovelace card pokazująca mecze (layout jak u Ciebie), z logotypami lig wprost z repo.

## Instalacja (HACS)

1. Dodaj repo jako **Custom repository** → Category: **Lovelace**  
   `https://github.com/GieOeRZet/matches-card`
2. Zainstaluj **MatchesCard**.
3. Upewnij się, że w **Resources** jest wpis:
   ```yaml
   url: /hacsfiles/matches-card/matches-card.js
   type: module
   ```

## Użycie

```yaml
type: custom:matches-card
entity: sensor.twoj_sensor_z_meczami
name: Mecze
show_logos: true
fill: gradient   # gradient | zebra | none
show_result_symbol: true
```

### Atrybuty sensora
Oczekiwany atrybut `matches` to lista obiektów:
```json
{
  "matches": [
    {
      "date": "2025-11-03 18:00",
      "finished": false,
      "league": "L",
      "home": "Górnik",
      "away": "Ruch",
      "score": "2-1",
      "result": "win",
      "logo_home": "https://.../gornik.png",
      "logo_away": "https://.../ruch.png"
    }
  ]
}
```

### Logotypy lig
Domyślnie:
- `L` → `logo/ekstraklasa.png` z tego repo (raw.githubusercontent)
- `PP` → `logo/puchar.png`

Możesz nadpisać bazowy URL:
```yaml
type: custom:matches-card
entity: sensor.twoj_sensor_z_meczami
logos_base: https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo
```

## Development

```bash
npm install
npm run build
```

Wynik w `dist/matches-card.js`.

<!-- minor edit to trigger build -->
