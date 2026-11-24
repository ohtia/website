# Ohtia website

Static site for [www.ohtia.com](https://www.ohtia.com), served by a Cloudflare Worker. The `public` directory is the web root: its contents are deployed at `/` with no build step. Paths below are relative to that root.

- `index.html` and `styles.css`: the page. Colors, type and shapes follow the app's [design system](https://github.com/ohtia/ohtia/blob/main/docs/design-system.md).
- `assets/`: the Ohtia glasses, agent avatars and app icon, copied from [ohtia/ohtia](https://github.com/ohtia/ohtia), and the self-hosted IBM Plex fonts (SIL Open Font License, see `assets/fonts/OFL.txt`).
- `favicon.ico`, `robots.txt` and `sitemap.xml`: served from the root.

Preview locally from the repository root:

```sh
python3 -m http.server -d public 8000
```

When a new app version is released:

1. Replace every occurrence of the old version in `index.html` (`grep -n 0.2.0 index.html` from the web root): the hero chip and its link, the mockup caption, the Download heading, the eight package links and their labels, and the `release-digests.json` link.
2. Update the release date under the download table and the list of distributions if it changed.
3. Set `<lastmod>` in `sitemap.xml` to the date of the change.
