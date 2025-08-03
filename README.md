# exchange-api-frontend

`exchange-api-frontend` is a frontend application built with Vue.js (TypeScript) and styled with TailwindCSS.  
It connects directly to a Supabase database for fetching currency exchange data.

You can also point it to a custom backend exchange API (already available), but currently it defaults to Supabase since the backend is not deployed.

---

## Features

- Built with Vue 3 + TypeScript.
- TailwindCSS for styling.
- Supabase as the primary data source.
- Currency ticker with smooth infinite scrolling.
- Simple currency converter form with dropdowns for base and target currencies.
- Number formatting support for multiple locales (`en-US`).

---

## Tech Stack

- Framework: Vue 3 + TypeScript
- Styling: TailwindCSS
- Database: Supabase
- Build Tool: Vite

---

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/exchange-api-frontend.git
   cd exchange-api-frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Copy `.env.example` into a `.env.local` file and fill in your Supabase project details.

   ```env
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```
