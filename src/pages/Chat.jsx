import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  MessageSquare,
  Send,
  RefreshCw,
  Bot,
  Trash2,
} from "lucide-react";
import {
  getDocuments,
  getChatHistory,
  askQuestion,
  clearChatHistory,
} from "../services/api";
import { toast } from "react-hot-toast";

function Chat() {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const messagesEndRef = useRef(null);
  const [isClearing, setIsClearing] = useState(false);

  // Load document and previous chat history
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [documentsResponse, historyResponse] = await Promise.all([
          getDocuments(),
          getChatHistory(documentId),
        ]);

        const docs = documentsResponse.data.documents || [];

        const selectedDocument = docs.find(
          (doc) => doc.document_id === documentId,
        );

        setDocument(selectedDocument || null);

        setMessages(historyResponse.data.chat_history || []);
      } catch (error) {
        console.error("Failed to load chat:", error);
        setLoadError(
          error.response?.data?.detail || "Failed to load document chat.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchChatData();
    }
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isSending]);

  // Send question to backend
  const handleSendQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim() || isSending) return;

    const currentQuestion = question.trim();

    try {
      setIsSending(true);
      setQuestion("");

      const response = await askQuestion(currentQuestion, documentId);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          _id: `${Date.now()}`,
          question: response.data.question,
          answer: response.data.answer,
        },
      ]);
    } catch (error) {
      console.error("Question error:", error);

      // Display actual backend error
      const detail = error.response?.data?.detail;

      console.log("Backend error details:", detail);

      const errorMessage =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((item) => item.msg).join(", ")
            : "Failed to get an answer. Please try again.";

      toast.error(errorMessage);

      // Restore question so the user can retry
      setQuestion(currentQuestion);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (messages.length === 0 || isClearing) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear all chat history for this PDF?",
    );

    if (!confirmed) return;

    try {
      setIsClearing(true);

      const response = await clearChatHistory(documentId);

      setMessages([]);

      toast.success(
        response.data.message || "Chat history cleared successfully!",
      );
    } catch (error) {
      console.error("Clear chat error:", error);

      const detail = error.response?.data?.detail;

      toast.error(
        typeof detail === "string" ? detail : "Failed to clear chat history.",
      );
    } finally {
      setIsClearing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-400">
        <RefreshCw size={20} className="animate-spin" />
        Loading chat...
      </div>
    );
  }

  // Loading error
  if (loadError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <MessageSquare size={40} className="text-red-400" />

        <h2 className="text-xl font-semibold text-white">
          Unable to load chat
        </h2>

        <p className="text-sm text-red-400">{loadError}</p>
      </div>
    );
  }

  // Document not found
  if (!document) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <FileText size={40} className="text-slate-500" />

        <h2 className="text-xl font-semibold text-white">Document not found</h2>

        <p className="text-sm text-slate-400">
          This document may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chat Header */}

      {/* Chat Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
            <MessageSquare size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">AI Document Chat</h1>

            <p className="text-sm text-slate-400">
              Ask questions about your PDF document.
            </p>
          </div>
        </div>

        {/* Clear Chat Button */}
        <button
          onClick={handleClearChat}
          disabled={messages.length === 0 || isClearing || isSending}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isClearing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Clearing...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Clear Chat
            </>
          )}
        </button>
      </div>

      {/* Selected Document */}
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
        <div className="flex items-center gap-3">
          <FileText className="text-violet-400" size={24} />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {document.filename}
            </p>

            <p className="text-xs text-emerald-400">
              {document.total_chunks} chunks processed
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="min-h-[400px] rounded-2xl border border-white/10 bg-[#111827] p-5">
        {messages.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <Bot size={42} className="mb-4 text-violet-400" />

            <h2 className="text-lg font-semibold text-white">
              Start a conversation
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Ask anything about this PDF document.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message._id} className="space-y-3">
                {/* User Question */}
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-violet-600 p-4 text-sm text-white">
                  {message.question}
                </div>

                {/* AI Answer */}
                <div className="flex max-w-[90%] gap-3">
                  <div className="h-fit shrink-0 rounded-lg bg-violet-500/10 p-2 text-violet-400">
                    <Bot size={18} />
                  </div>

                  <div className="min-w-0 rounded-2xl rounded-bl-sm bg-[#1E293B] p-4 text-sm leading-7 text-slate-200">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="mb-3 mt-4 text-xl font-bold text-white first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="mb-2 mt-4 text-lg font-semibold text-white first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="mb-2 mt-3 text-base font-semibold text-violet-300">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="pl-1">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-violet-300">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="my-3 overflow-x-auto rounded-xl bg-[#0B1020] p-4 text-xs leading-6">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {message.answer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isSending && (
              <div className="flex items-center gap-3 text-sm text-violet-300">
                <RefreshCw size={17} className="animate-spin" />
                AI is thinking...
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSendQuestion}
        className="rounded-2xl border border-white/10 bg-[#111827] p-3"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your PDF..."
            disabled={isSending}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!question.trim() || isSending}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send size={17} />
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
