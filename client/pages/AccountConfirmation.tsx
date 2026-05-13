import { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateMemberId } from "../lib/memberIdGenerator";
import { generateQRCodeImage } from "../lib/qrCodeGenerator";
import { PdfDocument } from "@/components/PdfDocument";
import Header from "@/components/Header";

interface RegistrationData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  userPhone?: string;
  birthDate?: string;
  gender?: string;
  patrol?: string;
  role?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  homePhone?: string;
}

export default function AccountConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);

  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  // Get registration data from location state
  const registrationData: RegistrationData = location.state?.data || {};
  const userId: string = location.state?.userId || "";
  const memberId: string = location.state?.memberId || generateMemberId(registrationData.gender || "male");

  // Redirect if no data provided
  if (!userId || !registrationData.firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">خطأ</h1>
          <p className="text-gray-600 mb-6">لم يتم العثور على بيانات التسجيل</p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-l from-red-600 to-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            العودة إلى التسجيل
          </Link>
        </div>
      </div>
    );
  }

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Step 1: Generate QR code first
      let qrCodeDataUrl = "";
      try {
        qrCodeDataUrl = await generateQRCodeImage({
          firstName: registrationData.firstName || "",
          lastName: registrationData.lastName || "",
          memberId,
          userId,
          userPhone: registrationData.userPhone,
          guardianFirstName: registrationData.guardianFirstName,
          guardianLastName: registrationData.guardianLastName,
          guardianPhone: registrationData.guardianPhone,
          homePhone: registrationData.homePhone,
          additionalPhones: ["+212 675-202336", "+212 646-610766"],
        });
        setQrCode(qrCodeDataUrl);
      } catch (qrError) {
        console.error("Erreur lors de la génération du code QR:", qrError);
        alert("Erreur lors de la génération du code QR");
        setGenerating(false);
        return;
      }

      // Step 2: Show PDF with QR code and wait for render
      if (pdfRef.current) {
        pdfRef.current.style.display = "block";
        pdfRef.current.style.position = "absolute";
        pdfRef.current.style.left = "-9999px";
        pdfRef.current.style.width = "794px";
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Capture and generate PDF
      if (pdfRef.current) {
        const canvas = await html2canvas(pdfRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: 794,
          windowHeight: 1123,
          imageTimeout: 0,
        });

        const doc = new jsPDF({
          format: "a4",
          orientation: "portrait",
        });

        const imgData = canvas.toDataURL("image/png");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        const pdfData = doc.output("dataurlstring");
        setPdfUrl(pdfData);

        // Step 4: Save to Supabase
        try {
          await fetch("/api/auth/save-documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              generated_id: memberId,
              pdf_url: pdfData,
              qr_code_url: qrCodeDataUrl,
            }),
          });
        } catch (saveError) {
          console.error("Erreur lors de l'enregistrement dans Supabase:", saveError);
        }

        // Hide PDF element
        if (pdfRef.current) {
          pdfRef.current.style.display = "none";
        }

        setPdfGenerated(true);
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copié!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50" dir="rtl">
      <Header />

      {/* Hidden PDF Document for capture */}
      <div style={{ display: "none" }}>
        <PdfDocument
          ref={pdfRef}
          firstName={registrationData.firstName || ""}
          lastName={registrationData.lastName || ""}
          memberId={memberId}
          userId={userId}
          phone={registrationData.userPhone || ""}
          birthDate={registrationData.birthDate}
          gender={registrationData.gender}
          patrol={registrationData.patrol}
          role={registrationData.role}
          guardianFirstName={registrationData.guardianFirstName}
          guardianLastName={registrationData.guardianLastName}
          guardianPhone={registrationData.guardianPhone}
          homePhone={registrationData.homePhone}
          guardianRelationship={registrationData.guardianRelationship}
          additionalPhones={["+212 675-202336", "+212 646-610766"]}
          qrCodeImageUrl={qrCode}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div
          className="rounded-lg p-8 text-white text-center mb-8 shadow-lg"
          style={{ background: "linear-gradient(to left, #4ade80, #3b82f6)" }}
        >
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-2">مبروك!</h1>
          <p className="text-lg">تم إنشاء حسابك بنجاح</p>
        </div>

        {/* Member Information Card */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
          style={{ borderRight: "4px solid #dc2626" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Informations de Compte / معلومات حسابك</h2>

          {/* Member ID - Prominent */}
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              background: "linear-gradient(135deg, #fee2e2 0%, #f3e8ff 100%)",
              borderRight: "4px solid #dc2626",
            }}
          >
            <p className="text-gray-600 text-sm mb-2">
              Votre Numéro Membre / رقم العضو الخاص بك
              <span className="block text-xs text-gray-500 mt-1">
                {memberId.startsWith("E") ? "(Masculin/ذكر)" : memberId.startsWith("F") ? "(Féminin/أنثى)" : ""}
              </span>
            </p>
            <div className="flex items-center justify-between">
              <p className="text-4xl font-bold" style={{ color: "#dc2626" }}>
                {memberId}
              </p>
              <button
                onClick={() => copyToClipboard(memberId)}
                className="font-bold py-2 px-4 rounded transition-colors"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991b1b")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
              >
                Copier
              </button>
            </div>
          </div>

          {/* User ID */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-600 text-sm mb-2">Identifiant Utilisateur / معرف المستخدم</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-800">{userId}</p>
              <button
                onClick={() => copyToClipboard(userId)}
                className="font-bold py-2 px-4 rounded transition-colors"
                style={{
                  backgroundColor: "#a855f7",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7e22ce")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a855f7")}
              >
                Copier
              </button>
            </div>
          </div>

          {/* Member Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Données Personnelles / البيانات الشخصية</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Nom / الاسم</p>
                <p className="font-semibold text-gray-800">
                  {registrationData.firstName} {registrationData.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Téléphone / الهاتف</p>
                <p className="font-semibold text-gray-800">{registrationData.userPhone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unité / الفريق</p>
                <p className="font-semibold text-gray-800">{registrationData.patrol}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Rôle / الدور</p>
                <p className="font-semibold text-gray-800">{registrationData.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PDF and QR Code Section */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
          style={{ borderRight: "4px solid #2563eb" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Télécharger le Certificat / تحميل شهادة التأكيد</h2>

          {!pdfGenerated ? (
            <button
              onClick={generatePDF}
              disabled={generating}
              className="w-full font-bold py-3 px-6 rounded-lg transition-shadow text-white"
              style={{
                background: generating
                  ? "#9ca3af"
                  : "linear-gradient(to left, #2563eb, #7c3aed)",
                opacity: generating ? 0.5 : 1,
              }}
            >
              {generating ? "Génération en cours..." : "Créer le PDF"}
            </button>
          ) : (
            <div className="space-y-6">
              {/* PDF Download Button */}
              <div className="text-center">
                <a
                  href={pdfUrl}
                  download={`SHM_Account_${memberId}.pdf`}
                  className="inline-block font-bold py-3 px-8 rounded-lg transition-colors text-white"
                  style={{
                    backgroundColor: "#2563eb",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                >
                  📥 Télécharger PDF
                </a>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
                <p className="text-gray-600 mb-4 text-center">
                  Scannez le code QR avec votre téléphone pour accéder aux données<br />
                  <span className="text-sm text-gray-500">امسح رمز الاستجابة السريعة بهاتفك للوصول إلى البيانات</span>
                </p>
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="QR Code for Account Data"
                    className="border-4 rounded-lg"
                    style={{ borderColor: "#d1d5db", width: "200px", height: "200px" }}
                  />
                ) : (
                  <div
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      width: "200px",
                      height: "200px",
                      backgroundColor: "#e5e7eb",
                    }}
                  >
                    <p className="text-gray-500">Génération en cours...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 font-bold py-3 px-6 rounded-lg transition-shadow text-white"
            style={{ background: "linear-gradient(to left, #dc2626, #7c3aed)" }}
          >
            Se connecter / تسجيل الدخول
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 font-bold py-3 px-6 rounded-lg transition-colors"
            style={{ backgroundColor: "#d1d5db", color: "#374151" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9ca3af")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d1d5db")}
          >
            Accueil / الرئيسية
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-white px-4 py-6 mt-12"
        style={{ background: "linear-gradient(to left, #dc2626, #7c3aed)" }}
      >
        <div className="max-w-4xl mx-auto text-center text-sm">
          <p>© 2026 الكشافة الحسنية صفي - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
