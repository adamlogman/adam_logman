# Adam Logman — Personal Portfolio

A static personal portfolio website for **Adam Logman**, Data Scientist & Machine Learning Engineer. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step, no backend.

## Quick Start

Open `index.html` in any browser, or serve the folder with any static server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx, no install needed)
npx serve .
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose the **main** branch and **/ (root)** folder.
5. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a few minutes.

## Personalize

### Add your photo

Replace the placeholder initials with a real headshot:

1. Add a **square** photo (ideally 500×500 px or larger) to `assets/images/profile.jpg`.
2. That's it — the CSS is already set up to display it. No code changes needed.

### Add your CV

1. Export your CV/résumé as a PDF.
2. Save it as `assets/Adam_Logman_CV.pdf`.
3. The "Download CV" button in the hero already links to this path.

### Update contact info

All contact details (email, LinkedIn, GitHub) are in `index.html`. Search for `adamlogman` to find every instance.

## File Structure

```
.
├── index.html              ← Main page (all content)
├── css/
│   └── style.css           ← Design system + all styles
├── js/
│   └── script.js           ← Theme toggle, GitHub API, menu, scroll reveals
├── assets/
│   └── images/
│       └── profile.jpg     ← YOUR PHOTO HERE (square, ≥500px)
│       └── .gitkeep
└── README.md               ← This file
```

## Design Notes

- **Palette**: "Sensor Network" — inspired by AQI data visualization and satellite imagery color scales. Teal/cyan primary (representing clean air quality readings), amber warm accent (AQI caution range), deep navy dark mode (nighttime satellite imagery).
- **Typography**: Space Grotesk (display), Inter (body), JetBrains Mono (data labels/stats).
- **Signature element**: Concentric pulse rings around the profile photo, evoking the signal pings of sensor nodes in an air-quality monitoring network.
- **Theme**: Light/dark toggle persisted in `localStorage`, defaulting to OS preference.
- **Projects**: Fetched live from the GitHub API — no auth needed. Falls back gracefully to placeholder cards if rate-limited or offline.

## Re-theming

All colors, typography, spacing, and border radii are defined as CSS custom properties in `:root` at the top of `css/style.css`. To re-theme the entire site, change those values — the rest cascades automatically.

## License

This portfolio is for personal use by Adam Logman. Feel free to fork the structure for your own portfolio.
