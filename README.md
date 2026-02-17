# App Runner + Ciclisti

Piccola app web locale con tre strumenti:

1. Runner: conversione passo `min/km` <-> velocità `km/h`
2. Runner: calcolo parametro mancante tra passo, distanza e tempo totale
3. Ciclisti: calcolo pendenza media della salita (%)

## Avvio

Nel terminale:

```bash
cd "/Users/parletti/chagpt codex progetti/Running_e_Cycling KPI"
./run.sh
```

Poi apri nel browser:

- http://localhost:8080

Per fermare l'app: `Ctrl + C` nel terminale.

## Versione corrente

- `v11`: interfaccia a tab con sezioni sovrapposte e prima linguetta "Passo, Distanza, Tempo".

## Struttura codice

- `index.html`: struttura UI (runner, ciclisti, reset).
- `styles.css`: stile grafico (inclusi bottoni liquid verdi).
- `app.js`: logica calcoli e gestione eventi pulsanti.

### Note tecniche (JavaScript)

- `formatPace(minutesFloat)`: converte minuti decimali in stringa `m:ss min/km`.
- `toMinuteSecondParts(minutesFloat)`: converte minuti decimali in `{minutes, seconds}`.
- Eventi click:
  - `aboutBtn`: apre il popup About con descrizione e casi d'uso.
  - `tab-btn`: cambia sezione attiva tra le 3 linguette.
  - `paceToSpeedBtn`: calcola km/h dal passo e azzera il risultato di `speedToPaceBtn`.
  - `speedToPaceBtn`: calcola passo dalla velocita e azzera il risultato di `paceToSpeedBtn`.
  - `tripCalcBtn`: con 2 parametri su 3 calcola il terzo (passo, distanza, tempo totale).
  - `slopeBtn`: calcola pendenza media `%`.
  - `resetAllBtn` e `reset-all-btn`: azzerano tutti i campi e risultati da inizio o fine pagina.

## Deploy online

L'app e pubblicata con GitHub Pages su:

- https://parletti.github.io/Running_e_Cycling_KPI/

## Versioning

La cronologia versioni e nel file `CHANGELOG.md`.
