# Empty Fridge Chef 🎉

An AI-powered recipe generator that helps you turn leftover ingredients into delicious meals.

## Project Architecture

This project uses a modern serverless architecture:
- **Frontend**: React (Vite) hosted on Vercel.
- **Backend**: Supabase Edge Functions (Deno) for secure AI processing.
- **AI Engine**: Groq API (Llama-3.3-70b) for lightning-fast recipe generation.

## How to Run Locally

### 1. Clone & Install
```sh
npm install
```

### 2. Set up Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Set up Supabase Edge Function
Ensure you have the Supabase CLI installed and your Groq API key set:
```sh
supabase secrets set GROQ_API_KEY=your_groq_api_key
```

### 4. Start Development Server
```sh
npm run dev
```

## Technologies Used

- **Frontend**: Vite, React, TypeScript, shadcn/ui, Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **AI**: Groq API (llama-3.3-70b-versatile)

## Deployment

1. **Frontend**: Connect your GitHub repo to Vercel.
2. **Backend**: Deploy your edge functions using `supabase functions deploy generate-recipe`.
3. **Secrets**: Ensure `GROQ_API_KEY` is set in Supabase Secrets.
