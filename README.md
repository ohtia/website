# Ohtia website

Static site for [www.ohtia.com](https://www.ohtia.com). Everything served lives in `public/`; there is no build step.

- `public/index.html` and `public/styles.css`: the page. Colors, type and shapes follow the app's [design system](https://github.com/ohtia/ohtia/blob/main/docs/design-system.md).
- `public/assets/`: the Ohtia glasses, agent avatars and app icon, copied from [ohtia/ohtia](https://github.com/ohtia/ohtia), and the self-hosted IBM Plex fonts (SIL Open Font License, see `assets/fonts/OFL.txt`).

Preview locally:

```sh
python3 -m http.server -d public 8000
```

When a new app version is released, update the version, download links and release date in `public/index.html`.
