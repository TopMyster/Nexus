# Nexus
### An AI-Powered Startpage and Search Engine

https://github.com/user-attachments/assets/67e1b7cf-bb60-42f2-a076-b9acfc2ee266

Sometimes we want to rely on AI, and at other times we don't and Nexus understands that. Nexus uses AI to decide whether you're asking a question or typing in a search term.

## Features
- A blend of AI and Google
- Beautiful design
- Cross-platform
- Efficient

## Setup
1. Set Nexus as your home page using https://nexusstart.vercel.app
2. Set it as your search engine using https://nexusstart.vercel.app/search/%s
3. Enter your OpenRouter API key in settings
4. Now you're all set!

## Tech Stack
 
| Category | Technology |
|---|---|
| Frontend | React 19 + TypeScript, built with Vite |
| Animation | Motion (Framer Motion) |
| Markdown Rendering | react-markdown, remark-gfm, rehype-raw |
| Icons | react-icons |
| AI | OpenRouter API |
| Hosting | Vercel |

## Local Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/TopMyster/Nexus.git
cd Nexus
npm install
```

Run the development server:

```bash
npm run dev
```

## How It Works

When you enter a query, Nexus uses AI to classify whether it looks like a **question** or a **search term**. Based on that classification, it routes you to the appropriate experience, an AI-generated answer or a Google results page.

## Contributing

Contributions are welcome!

## Acknowledgments

- Built with the [OpenRouter](https://openrouter.ai) API
