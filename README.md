
# WhereToRetire 🇮🇳

An interactive web application helping users find their ideal retirement location in India based on key criteria like Climate and Healthcare.

## Features

- **Interactive Map**: Visual exploration of **85+** cities covering all regions of India.
- **Personalized Scoring System**: 
  - **Importance Sliders**: Rank what matters to you (Healthcare, Clean Air, Warmth, Budget).
  - **Smart Matching**: Cities are dynamically scored (0-100%) and sorted based on your unique preferences.
- **Comprehensive Data**: Each city includes detailed metrics:
  - Temperature Range & Rainfall
  - Air Quality Index (AQI)
  - Healthcare Quality & Hospital Access
  - Nearest Airport (Type & Distance)
  - Cost of Living Estimates
- **Responsive Design**: Works seamlessly on desktop and mobile.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Mapping**: Leaflet.js / React-Leaflet
- **Styling**: Native CSS Modules (Clean & Lightweight)
- **Deployment**: Vercel Ready

## Getting Started

### Prerequisites

- Node.js 18+ installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kingkong9128/WheretoRetire.git
   cd WheretoRetire
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment on Vercel

1. Push this repository to your GitHub.
2. Go to [Vercel](https://vercel.com) and "Add New Project".
3. Import the `WheretoRetire` repository.
4. **Important**: The **Root Directory** should be the project root (`./`), which is the default.
5. Click **Deploy**.

## Project Structure

- `app/api`: API Routes for serving and filtering data.
- `components`: React components (`Map`, `MapController`).
- `data`: JSON datasets (`cities.json`).
- `types`: TypeScript definitions.

## Future Roadmap

- [ ] Add Cost of Living Index.
- [ ] Incorporate Air Quality Index (AQI) real-time data.
- [ ] Expand dataset to Tier-2 and Tier-3 cities.
