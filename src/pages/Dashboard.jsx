import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Files,
  Database,
  MessageSquare,
  Upload,
  ArrowUpRight,
  Sparkles,
  Clock,
  FolderOpen,
} from "lucide-react";
import { getDocuments } from "../services/api";

function Dashboard() {
  // Store API data
  const [documents, setDocuments] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch documents when Dashboard loads
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocuments();

        setDocuments(response.data.documents);
        setTotalDocuments(response.data.total_documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Unable to load documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Calculate statistics
  const processedDocuments = documents.filter(
    (doc) => doc.total_chunks > 0,
  ).length;

  const totalChunks = documents.reduce(
    (total, doc) => total + doc.total_chunks,
    0,
  );

  // Statistics data
  const stats = [
    {
      title: "Total Documents",
      value: loading ? "..." : totalDocuments,
      icon: Files,
      description: "Uploaded PDF files",
    },
    {
      title: "Processed Documents",
      value: loading ? "..." : processedDocuments,
      icon: FileText,
      description: "Ready for AI chat",
    },
    {
      title: "Total Chunks",
      value: loading ? "..." : totalChunks,
      icon: Database,
      description: "Text segments created",
    },
    {
      title: "Conversations",
      value: "—",
      icon: MessageSquare,
      description: "Questions and answers",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-purple-400">
            <Sparkles size={16} />
            <span>AI POWERED PDF ASSISTANT</span>
          </div>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Your Knowledge, <span className="text-purple-400">Simplified.</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm text-gray-400 sm:text-base">
            Upload your PDF documents and let AI help you find answers from your
            files.
          </p>
        </div>

        <Link
          to="/documents"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          <Upload size={18} />
          Upload PDF
        </Link>
      </section>

      {/* API Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Overview</h2>

          <p className="text-sm text-gray-400">
            Your document activity at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-[#10172A] p-5 transition hover:border-purple-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                    <Icon size={21} />
                  </div>

                  <ArrowUpRight size={18} className="text-gray-500" />
                </div>

                <h3 className="mt-5 text-2xl font-bold text-white">
                  {stat.value}
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-300">
                  {stat.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upload Section */}
      <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-[#10172A] p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-purple-500/15 p-3 text-purple-400">
              <Upload size={25} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Start with your first PDF
              </h2>

              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Upload a document, process its content and start asking
                questions using AI.
              </p>
            </div>
          </div>

          <Link
            to="/documents"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/15 px-5 py-3 text-sm font-medium text-purple-300 transition hover:bg-purple-600/25"
          >
            Manage Documents
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Recent Documents */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Documents
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your recently uploaded PDF files.
            </p>
          </div>

          <Link
            to="/documents"
            className="flex items-center gap-1 text-sm font-medium text-purple-400 transition hover:text-purple-300"
          >
            View all
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#10172A] p-8 text-center text-gray-400">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#10172A]/60 px-5 py-12 text-center">
            <div className="mb-4 rounded-2xl bg-white/5 p-4 text-gray-400">
              <FolderOpen size={30} />
            </div>

            <h3 className="text-base font-semibold text-white">
              No documents yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Upload your first PDF to start chatting with your documents.
            </p>

            <Link
              to="/documents"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm text-white transition hover:bg-purple-500"
            >
              <Upload size={16} />
              Upload a document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 5).map((doc) => {
              const isProcessed = doc.total_chunks > 0;

              return (
                <div
                  key={doc.document_id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#10172A] p-4 transition hover:border-purple-500/30 sm:flex-row sm:items-center"
                >
                  {/* Document information */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="shrink-0 rounded-xl bg-purple-500/10 p-3 text-purple-400">
                      <FileText size={23} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {doc.filename}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString("en-GB")}
                        {" · "}
                        {doc.total_chunks} chunks
                      </p>
                    </div>
                  </div>

                  {/* Status and action */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isProcessed
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {isProcessed ? "Processed" : "Not Processed"}
                    </span>

                    {isProcessed && (
                      <Link
                        to={`/chat/${doc.document_id}`}
                        className="rounded-lg bg-purple-600/15 px-3 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-600/25"
                      >
                        Open Chat
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-5 text-xs text-gray-500 sm:flex-row">
        <p>DocuMind AI · Intelligent PDF Assistant</p>

        <p className="flex items-center gap-1">
          <Clock size={13} />
          Powered by AI
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
