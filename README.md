# Stratum

Stratum is a lightweight SLA breach-risk dashboard for support teams. It turns everyday case signals into a clear risk score, helping teams focus on the work most likely to miss its service target.

## Preview

![Stratum Dashboard](public/preview.jpeg)

## What it includes

- A live support-case queue, ordered visually by risk level
- At-a-glance counts for open, at-risk, and critical cases
- An interactive risk simulator for testing a case before it enters the queue
- A transparent client-side scoring model based on case age, priority, agent activity, and customer sentiment
- A responsive, minimal Inter-based interface

## Risk model

The current prototype calculates a breach likelihood from four simple signals:

| Signal | Why it matters |
| --- | --- |
| Case age | Older cases have less time to meet their SLA target. |
| Priority | Urgent or critical issues carry more breach risk. |
| Agent updates | Fewer updates indicate an unattended case. |
| Customer sentiment | Negative sentiment increases the risk signal. |

The score is displayed as one of four levels: **Low**, **Medium**, **High**, or **Critical**. The model runs entirely in the browser; it does not send or store case data.

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm

### Install and start

```bash
git clone https://github.com/luthandombanjwa/stratum.git
cd stratum
npm install
npm run dev
```

Open the local URL shown by Vite—normally `http://localhost:5173`.

## Production build

```bash
npm run build
```

The optimized site is written to `dist/`.

## Project structure

```text
src/
  main.jsx       App UI, example cases, and the risk model
  styles.css     Responsive visual system and component styles
DESIGN.md        Design-system reference
```

## Current scope

This is a front-end prototype with sample cases. The next natural step is connecting it to a real support platform or API, replacing sample data with live cases, and moving the scoring model to a backend service.
