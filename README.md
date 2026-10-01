# ORCA SOPs hub

The home page at <https://orcacoreotago.github.io/>, linking to every ORCA standard operating procedure. Each SOP lives in its own repository; this repository only holds the list.

## Add an SOP to the site

Edit `sops.yml` (the GitHub web editor is fine) and add an entry in the same layout as the others, then commit. GitHub rebuilds the site in a couple of minutes. The home page card and the navbar menu both come from this one file, and a new `categories` value creates a new navbar menu.

## How it works

- `sops.yml`: the list of SOPs.
- `index.qmd`: the home page; shows `sops.yml` as searchable cards.
- `_scripts/build-nav.ts`: runs before every render and writes the navbar (`_nav.yml`) from `sops.yml`. Uses Quarto's built-in Deno, so nothing extra to install.
- `.github/workflows/publish.yml`: renders and publishes on every push to `main`.

## First-time setup

This repository must be named exactly `orcaCoreOtago.github.io`. Then **Settings → Pages → Build and deployment → Source: GitHub Actions**, and push.

To preview locally: `quarto preview`.
