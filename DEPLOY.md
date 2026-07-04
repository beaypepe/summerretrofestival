# Despliegue en GitHub Pages 🚀

Instrucciones técnicas para poner en marcha el reproductor.

## Estructura del proyecto

```
.
├── index.html
├── styles.css
├── script.js
├── retro.jpg      ← carátula (incluida)
└── summer.mp3     ← ¡añade tú el audio!
```

> **Importante:** coloca `summer.mp3` en la MISMA carpeta que `index.html` y
> respeta mayúsculas/minúsculas en los nombres de los archivos.

## Publicar en GitHub Pages

1. Sube los archivos a la raíz de tu repositorio
   (`beaypepe.github.io/summerretrofestival` o similar).
2. Ve a **Settings → Pages**.
3. En *Source* selecciona la rama **main** y la carpeta **/ (root)**.
4. Guarda. En unos segundos tendrás tu web en:
   `https://TU_USUARIO.github.io/summerretrofestival/`

## Probarlo en local

```bash
python3 -m http.server
```
y entra en http://localhost:8000
