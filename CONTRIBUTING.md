# Contributing

Thanks for your interest in improving this project. By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Contributions are released under the [MIT License](LICENSE).

## Getting Started

1. Fork the repository and clone your fork.
2. Serve the project locally (ES modules do not load from `file://`):
   ```bash
   python -m http.server
   ```
3. Create a branch:
   ```bash
   git checkout -b feature/your-feature
   ```

## Project Layout

- `index.html`, `styles.css`, `tailwind.css` – markup and styling. `tailwind.css` is a precompiled subset, so classes not already present will not work; add plain CSS to `styles.css` instead.
- `app.js` – entry point.
- `js/*_algorithms.js` – frame generators, one file per category.
- `js/*_render.js` – renderers for each visualization mode.
- `js/algorithm_catalog.js` – algorithm metadata and sidebar structure.
- `js/python_sources.js` – Python reference implementations.

## Adding an Algorithm

1. Write a `frames…` function in the matching `js/*_algorithms.js` file and export it. Each frame is an object with a `note` message and a `pyLine` number that points to the matching line in the Python source.
2. Add the Python reference to `PY` in `js/python_sources.js`, using the same key as the catalog entry.
3. Add a `CATALOG` entry in `js/algorithm_catalog.js` with `name`, `cat`, `frames`, `explain`, `pseudo`, and `complexity`, and add its key to `SIDEBAR_STRUCTURE`.
4. Update the algorithm table and count in `README.md`.
5. Check the animation, the Iteration tab, and the View Iteration modal for the new algorithm.

## Code Style

- Vanilla JavaScript with ES modules, no build step, no frameworks.
- Match the surrounding formatting, naming, and quote style.
- Icons come from Font Awesome (loaded from cdnjs in `index.html`); use `<i class="fa-solid fa-…">` instead of inline SVG.
- Add `data-tip` (or `dataset.tip`) to any new visual element so the hover tooltip in `js/tooltip.js` can show its index and value.
- Keep changes focused; do not reformat unrelated code.

## Pull Requests

- One logical change per pull request.
- Describe what changed and why, and include a screenshot or GIF for UI changes.
- Make sure the app loads with no console errors in a current browser.

## Reporting Bugs and Requesting Features

Use the issue templates. For security problems, follow [SECURITY.md](SECURITY.md) instead.
