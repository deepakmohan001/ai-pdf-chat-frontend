# DocuMind AI – Frontend

DocuMind AI is an AI-powered PDF Chat Application that allows users to upload PDF documents, process their content, and ask questions using an AI-powered chat interface.

This frontend is built using React and Vite, with Tailwind CSS for styling.

## Technologies Used

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router
- Lucide React
- Framer Motion
- React Hot Toast
- React Markdown

## Features

- Interactive dashboard.
- Upload PDF documents.
- View uploaded documents.
- Process PDF documents.
- Ask questions about PDF content.
- Display AI-generated answers.
- View chat history.
- Clear chat history.
- Delete uploaded documents.
- Responsive user interface.

## Project Structure

```text
ai-pdf-chat-frontend/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── package.json
├── index.html
└── README.md
```

## Frontend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/deepakmohan001/ai-pdf-chat-frontend.git
```

### 2. Navigate to the Project Directory

```bash
cd ai-pdf-chat-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

Add your backend API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Make sure the FastAPI backend is running before using the frontend.

### 5. Start the Development Server

```bash
npm run dev
```

The frontend will run at:

http://localhost:5173

## Backend Integration

The frontend communicates with the FastAPI backend using Axios.

Backend repository:

https://github.com/deepakmohan001/ai-pdf-chat-backend

## Project Repositories

- **Frontend:** https://github.com/deepakmohan001/ai-pdf-chat-frontend
- **Backend:** https://github.com/deepakmohan001/ai-pdf-chat-backend

## Project Status

- Frontend development completed.
- Integrated with FastAPI backend.
- PDF upload and document management implemented.
- AI chat interface implemented.
- Tested locally.

**Deployment:** Not yet deployed.
