# Summer Player 🎵

Reproductor de audio sencillo (HTML + CSS + JS) para GitHub Pages.

## Estructura del proyecto

```
.
├── index.html
├── styles.css
├── script.js
├── retro.jpg      ← tu imagen (ya incluida)
└── summer.mp3     ← ¡añade tú el audio!
```

> **Importante:** coloca el archivo `summer.mp3` en la MISMA carpeta que el `index.html`.
> Respeta también mayúsculas/minúsculas en los nombres.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en [github.com](https://github.com) (p. ej. `summer-player`).
2. Sube estos archivos a la raíz del repositorio:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `retro.jpg`
   - `summer.mp3` (tu audio)
3. Ve a **Settings → Pages**.
4. En *Source* selecciona la rama **main** y la carpeta **/ (root)**.
5. Guarda. En unos segundos tendrás tu web en:
   `https://TU_USUARIO.github.io/summer-player/`

## Probarlo en local

Abre `index.html` en el navegador, o mejor usa un servidor local:
```
python3 -m http.server
```
y entra en http://localhost:8000
