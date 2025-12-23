# Gemini Chatbot

A modern, ChatGPT-style conversational AI interface powered by Google's Gemini 2.5 Flash model. Built with React, Express, and a sleek dark theme for an exceptional user experience.

![Chatbot Interface](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## Features

- 💬 **Real-time Chat Interface** - Seamless conversation with AI maintaining context
- 🎨 **Premium Dark Theme** - Modern UI with smooth animations and transitions
- 📝 **Markdown Support** - Full markdown rendering with code syntax highlighting
- ⚡ **Fast & Responsive** - Powered by Gemini 2.5 Flash for quick responses
- 🔄 **Auto-expanding Input** - Textarea grows as you type for better UX
- 🤖 **Conversation History** - Maintains chat context within the session

## Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon set
- **React Markdown** - Markdown rendering
- **Prism.js** - Code syntax highlighting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Generative AI SDK** - Gemini API integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gemini-chatbot.git
   cd gemini-chatbot
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd server
   node index.js
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
gemini-chatbot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main chat interface component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── index.js           # Server & API routes
│   ├── .env               # Environment variables (not in repo)
│   └── package.json
└── README.md
```

## API Endpoints

### POST `/api/chat`
Send a message to the chatbot and receive a response.

**Request Body:**
```json
{
  "message": "Your message here",
  "history": []
}
```

**Response:**
```json
{
  "text": "AI response text"
}
```

## Configuration

The chatbot uses **Gemini 2.5 Flash** by default. You can change the model in `server/index.js`:

```javascript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

Available models:
- `gemini-2.5-flash` (recommended)
- `gemini-2.5-pro`
- `gemini-2.0-flash`

## Troubleshooting

### API Key Issues
- Ensure your Gemini API key is valid and properly set in `.env`
- Check that the Generative Language API is enabled in your Google Cloud Console

### Rate Limits
- Free tier has rate limits. Consider upgrading for production use
- gemini-2.5-flash has better rate limits than older models

### Port Conflicts
- Change the PORT in `server/.env` if 5000 is already in use
- Frontend port can be changed in `vite.config.js`

## License

MIT License - feel free to use this project for learning or building your own chatbot!

## Acknowledgments

- Built with [Google Gemini API](https://ai.google.dev/)
- UI inspired by ChatGPT's interface
- Icons by [Lucide](https://lucide.dev/)

---

**Note:** Remember to never commit your `.env` file with your API key to version control!
