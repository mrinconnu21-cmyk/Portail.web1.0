import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

interface DocumentStatus {
  memberId: string;
  name: string;
  hasPdf: boolean;
  hasQrCode: boolean;
  generatedAt: string | null;
}

interface DocumentStats {
  totalMembers: number;
  withDocuments: number;
  withoutDocuments: number;
  members: DocumentStatus[];
}

export default function AdminDocuments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDocumentStatus();
  }, []);

  const fetchDocumentStatus = async () => {
    try {
      const response = await fetch("/api/admin/document-status");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching document status:", error);
      setMessage("Erreur lors du chargement du statut des documents");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedMembers.size === stats?.members.length) {
      setSelectedMembers(new Set());
    } else {
      const allMemberIds = new Set(stats?.members.map((m) => m.memberId) || []);
      setSelectedMembers(allMemberIds);
    }
  };

  const regenerateSelected = async () => {
    if (selectedMembers.size === 0) {
      setMessage("Veuillez sélectionner au moins un membre");
      return;
    }

    setRegenerating(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/regenerate-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberIds: Array.from(selectedMembers),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.processed} document(s) régénéré(s) avec succès`);
        setSelectedMembers(new Set());
        setTimeout(() => fetchDocumentStatus(), 1000);
      } else {
        setMessage(`❌ Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error("Error regenerating documents:", error);
      setMessage("Erreur lors de la régénération des documents");
    } finally {
      setRegenerating(false);
    }
  };

  const regenerateAll = async () => {
    if (
      !window.confirm(
        `Êtes-vous sûr? Cela va régénérer les documents pour ${stats?.withoutDocuments || 0} membre(s) sans documents.`
      )
    ) {
      return;
    }

    setRegenerating(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/regenerate-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Régénération en cours pour ${data.processed} membre(s)`);
        setTimeout(() => fetchDocumentStatus(), 1000);
      } else {
        setMessage(`❌ Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error("Error regenerating all documents:", error);
      setMessage("Erreur lors de la régénération des documents");
    } finally {
      setRegenerating(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Layout currentPage="admin">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-scout-purple mb-2">
          Gestion des Documents
        </h1>
        <p className="text-gray-600">Régénérer les PDF et codes QR pour les membres</p>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 mb-6 ${
            message.includes("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full"></div>
          </div>
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-blue-600">
              <p className="text-gray-500 text-sm">Total des Membres</p>
              <p className="text-4xl font-bold text-blue-600">{stats.totalMembers}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-green-600">
              <p className="text-gray-500 text-sm">Avec Documents</p>
              <p className="text-4xl font-bold text-green-600">{stats.withDocuments}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-red-600">
              <p className="text-gray-500 text-sm">Sans Documents</p>
              <p className="text-4xl font-bold text-red-600">{stats.withoutDocuments}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex gap-3">
              <button
                onClick={regenerateAll}
                disabled={regenerating || stats.withoutDocuments === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {regenerating ? "Régénération en cours..." : `Régénérer ${stats.withoutDocuments} document(s)`}
              </button>

              {selectedMembers.size > 0 && (
                <button
                  onClick={regenerateSelected}
                  disabled={regenerating}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {regenerating ? "Régénération..." : `Régénérer ${selectedMembers.size} sélectionné(s)`}
                </button>
              )}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedMembers.size === stats.members.length && stats.members.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">Nom</th>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">ID Membre</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-700">PDF</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-700">QR Code</th>
                    <th className="px-6 py-3 text-left font-bold text-gray-700">Généré</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.members.map((member) => (
                    <tr
                      key={member.memberId}
                      className={`border-b ${
                        !member.hasPdf || !member.hasQrCode ? "bg-yellow-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.memberId)}
                          onChange={() => toggleSelectMember(member.memberId)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-800">{member.name}</td>
                      <td className="px-6 py-3 text-gray-600">{member.memberId}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${
                          member.hasPdf ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {member.hasPdf ? "✓" : "✗"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${
                          member.hasQrCode ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {member.hasQrCode ? "✓" : "✗"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600 text-sm">
                        {member.generatedAt
                          ? new Date(member.generatedAt).toLocaleString("fr-FR")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
