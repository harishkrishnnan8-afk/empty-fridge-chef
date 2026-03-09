# Empty Fridge Chef

An AI-powered recipe generator that helps you turn leftover ingredients into delicious meals.

## Project info

This project uses a React frontend (Vite) and an Express backend to securely generate recipes using the Groq AI API.

## How to Run Locally

Follow these steps to get the project running on your machine:

1. **Clone the repository**
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_key_here
   ```
4. **Start the development server**:
   ```sh
   npm run dev:full
   ```

> **Note:** Running `npm run dev:full` starts both the Vite frontend (port 8080) and the Express backend (port 3001).

## Technologies Used

- **Frontend**: Vite, React, TypeScript, shadcn-ui, Tailwind CSS
- **Backend**: Node.js, Express, Groq AI SDK
- **Database**: Supabase (optional for future features)

## Deployment

The project can be deployed to platforms like Vercel or Netlify. Ensure you set the `GROQ_API_KEY` in your deployment platform's environment variables.
