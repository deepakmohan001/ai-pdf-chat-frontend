import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  MessageSquare,
  RefreshCw,
  FolderOpen,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getDocuments,
  uploadDocument,
  processDocument,
  deleteDocument,
} from "../services/api";

function Documents() {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setError("");

      const response = await getDocuments();

      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);

      setError("Unable to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // File selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate PDF extension
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    // Validate PDF MIME type
    if (file.type && file.type !== "application/pdf") {
      toast.error("Invalid PDF file.");
      event.target.value = "";
      return;
    }

    // Validate 50 MB size limit
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must not exceed 50 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload PDF
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file first.");
      return;
    }

    try {
      setUploading(true);

      await uploadDocument(selectedFile);

      toast.success("PDF uploaded successfully!");

      setSelectedFile(null);
      setIsUploadOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        toast.error(detail.map((item) => item.msg).join(", "));
      } else {
        toast.error(
          typeof detail === "string"
            ? detail
            : "PDF upload failed. Please try again.",
        );
      }
    }
  };

  // Search documents
  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Format file size
  const formatFileSize = (size) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcess = async (documentId) => {
    try {
      setProcessingId(documentId);

      const response = await processDocument(documentId);

      toast.success(response.data.message || "PDF processed successfully!");

      await fetchDocuments();
    } catch (error) {
      console.error("Processing error:", error);

      const detail = error.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Failed to process PDF. Please try again.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this PDF? This will also delete its chat history.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(documentId);

      const response = await deleteDocument(documentId);

      toast.success(response.data.message || "Document deleted successfully!");

      await fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);

      const detail = error.response?.data?.detail;

      toast.error(
        typeof detail === "string" ? detail : "Failed to delete document.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            My Documents
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Upload, manage and chat with your PDF documents.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          <Upload size={18} />
          Upload PDF
        </button>
      </section>

      {/* Document Summary */}
      <section className="rounded-2xl border border-white/10 bg-[#10172A] p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
            <FolderOpen size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Documents</p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {loading ? "..." : documents.length}
            </h2>
          </div>
        </div>
      </section>

      {/* Search */}
      <section>
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#10172A] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500"
          />
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Documents List */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">All Documents</h2>

          <p className="mt-1 text-sm text-gray-400">
            Manage your uploaded PDF files.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#10172A] p-10 text-center text-gray-400">
            <RefreshCw size={22} className="mx-auto mb-3 animate-spin" />
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#10172A]/60 px-5 py-12 text-center">
            <FolderOpen size={32} className="mb-4 text-gray-500" />

            <h3 className="font-semibold text-white">
              {searchTerm ? "No matching documents" : "No documents yet"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {searchTerm
                ? "Try searching with another filename."
                : "Upload a PDF to get started."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
              const isProcessed = doc.total_chunks > 0;

              return (
                <div
                  key={doc.document_id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#10172A] p-4 transition hover:border-purple-500/30 sm:flex-row sm:items-center"
                >
                  {/* Document Details */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="shrink-0 rounded-xl bg-purple-500/10 p-3 text-purple-400">
                      <FileText size={24} />
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

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isProcessed
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {isProcessed ? "Processed" : "Not Processed"}
                    </span>

                    {!isProcessed && (
                      <button
                        onClick={() => handleProcess(doc.document_id)}
                        disabled={
                          processingId === doc.document_id ||
                          doc.total_chunks > 0
                        }
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          processingId === doc.document_id
                            ? "cursor-wait bg-violet-500/20 text-violet-300"
                            : doc.total_chunks > 0
                              ? "cursor-not-allowed bg-emerald-500/10 text-emerald-400"
                              : "bg-violet-600 text-white shadow-lg shadow-violet-900/20 hover:bg-violet-500 active:scale-95"
                        }`}
                      >
                        {processingId === doc.document_id ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Processing...
                          </>
                        ) : doc.total_chunks > 0 ? (
                          <>
                            <CheckCircle size={16} />
                            Processed
                          </>
                        ) : (
                          <>
                            <RefreshCw size={16} />
                            Process
                          </>
                        )}
                      </button>
                    )}

                    {isProcessed && (
                      <Link
                        to={`/chat/${doc.document_id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600/15 px-3 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-600/25"
                      >
                        <MessageSquare size={14} />
                        Chat
                      </Link>
                    )}

                    <button
                      onClick={() => handleDelete(doc.document_id)}
                      disabled={deletingId === doc.document_id}
                      title="Delete document"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === doc.document_id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#10172A] p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Upload PDF</h2>

                <p className="mt-1 text-sm text-gray-400">
                  Add a new document to your library.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={uploading}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* File Selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] px-5 py-12 text-center transition hover:border-purple-500/50 hover:bg-purple-500/5"
              >
                <div className="mb-4 rounded-xl bg-purple-500/10 p-4 text-purple-400">
                  <Upload size={28} />
                </div>

                <p className="text-sm font-semibold text-white">
                  Click to select your PDF
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  PDF files only · Maximum size 50 MB
                </p>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-purple-500/10 p-3 text-purple-400">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Upload Information */}
            <div className="mt-5 flex items-start gap-2 text-xs text-gray-500">
              <CheckCircle size={15} className="shrink-0 text-green-400" />
              Your PDF will be stored securely and can be processed for
              AI-powered conversations.
            </div>

            {/* Modal Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={uploading}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;
