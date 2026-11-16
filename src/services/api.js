
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Get all documents
export const getDocuments = () => {
  return api.get("/documents");
};

// Upload PDF document
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData);
};

export default api;


// Process PDF document
export const processDocument = (documentId) => {
  return api.get(`/extract-text/${documentId}`);
};

// Delete PDF document
export const deleteDocument = (documentId) => {
  return api.delete(`/documents/${documentId}`);
};


// Ask a question about a PDF
export const askQuestion = (question, documentId) => {
  return api.post("/ask", {
    question,
    document_id: documentId,
  });
};

// Get chat history for a PDF
export const getChatHistory = (documentId) => {
  return api.get(`/chat-history/${documentId}`);
};

// Clear chat history for a PDF
export const clearChatHistory = (documentId) => {
  return api.delete(`/chat-history/${documentId}`);
};