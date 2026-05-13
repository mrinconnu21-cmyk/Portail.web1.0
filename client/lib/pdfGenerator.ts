import jsPDF from "jspdf";

export interface PDFData {
  firstName: string;
  lastName: string;
  memberId: string;
  userId: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  patrol?: string;
  role?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhone?: string;
  homePhone?: string;
  guardianRelationship?: string;
  qrCodeImageUrl?: string;
  additionalPhones?: string[];
}

const translateGender = (gender?: string): string => {
  if (!gender) return "";
  return gender === "male" ? "Masculin / ذكر" : "Féminin / أنثى";
};

const getFormattedDate = (): string => {
  return new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generatePDFDirect = async (data: PDFData): Promise<string> => {
  const doc = new jsPDF({
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set default font
  doc.setFont("arial");

  // Header
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38); // Red
  doc.text("Scouts Hassania Safi", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("الكشافة الحسنية صفي", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 6;
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55);
  doc.text("Certificat de Confirmation de Compte", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 6;
  doc.setFontSize(10);
  doc.setTextColor(153, 153, 153);
  doc.text("شهادة تأكيد الحساب", pageWidth / 2, yPosition, { align: "center" });

  // Separator line
  yPosition += 8;
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;

  // Member Information Section
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text("Informations Membres / معلومات العضو", margin, yPosition);

  yPosition += 7;
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, yPosition - 3, contentWidth, 80, "F");

  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);

  // Full Name
  doc.text("Nom complet / الاسم الكامل:", margin + 3, yPosition + 2);
  doc.setTextColor(31, 41, 55);
  doc.setFont("arial", "bold");
  doc.text(`${data.firstName} ${data.lastName}`, margin + 3, yPosition + 6);

  // Member ID
  doc.setTextColor(102, 102, 102);
  doc.setFont("arial");
  doc.text("Numéro Membre / رقم العضو:", pageWidth / 2, yPosition + 2);
  doc.setTextColor(220, 38, 38);
  doc.setFont("arial", "bold");
  doc.setFontSize(11);
  doc.text(data.memberId, pageWidth / 2, yPosition + 6);

  // User ID
  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);
  doc.setFont("arial");
  doc.text("Identifiant Utilisateur / معرف المستخدم:", margin + 3, yPosition + 12);
  doc.setTextColor(31, 41, 55);
  doc.setFont("arial", "bold");
  doc.text(data.userId, margin + 3, yPosition + 16);

  // Phone
  doc.setTextColor(102, 102, 102);
  doc.setFont("arial");
  doc.text("Téléphone / الهاتف:", pageWidth / 2, yPosition + 12);
  doc.setTextColor(31, 41, 55);
  doc.setFont("arial", "bold");
  doc.text(data.phone || "-", pageWidth / 2, yPosition + 16);

  // Birth Date
  if (data.birthDate) {
    doc.setTextColor(102, 102, 102);
    doc.setFont("arial");
    doc.text("Date de Naissance / تاريخ الميلاد:", margin + 3, yPosition + 22);
    doc.setTextColor(31, 41, 55);
    doc.setFont("arial", "bold");
    doc.text(data.birthDate, margin + 3, yPosition + 26);
  }

  // Gender
  if (data.gender) {
    doc.setTextColor(102, 102, 102);
    doc.setFont("arial");
    doc.text("Genre / الجنس:", pageWidth / 2, yPosition + 22);
    doc.setTextColor(31, 41, 55);
    doc.setFont("arial", "bold");
    doc.text(translateGender(data.gender), pageWidth / 2, yPosition + 26);
  }

  // Patrol
  if (data.patrol) {
    doc.setTextColor(102, 102, 102);
    doc.setFont("arial");
    doc.text("Unité / الفريق:", margin + 3, yPosition + 32);
    doc.setTextColor(31, 41, 55);
    doc.setFont("arial", "bold");
    doc.text(data.patrol, margin + 3, yPosition + 36);
  }

  // Role
  if (data.role) {
    doc.setTextColor(102, 102, 102);
    doc.setFont("arial");
    doc.text("Rôle / الدور:", pageWidth / 2, yPosition + 32);
    doc.setTextColor(31, 41, 55);
    doc.setFont("arial", "bold");
    doc.text(data.role, pageWidth / 2, yPosition + 36);
  }

  yPosition += 90;

  // Guardian Information Section
  if (data.guardianFirstName || data.guardianLastName) {
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text("Informations Tuteur / معلومات الولي", margin, yPosition);

    yPosition += 7;
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, yPosition - 3, contentWidth, 50, "F");

    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);

    // Guardian Name
    doc.text("Nom du Tuteur / اسم الولي:", margin + 3, yPosition + 2);
    doc.setTextColor(31, 41, 55);
    doc.setFont("arial", "bold");
    doc.text(`${data.guardianFirstName || ""} ${data.guardianLastName || ""}`, margin + 3, yPosition + 6);

    // Relationship
    if (data.guardianRelationship) {
      doc.setFont("arial");
      doc.setTextColor(102, 102, 102);
      doc.text("Relation / الصفة:", pageWidth / 2, yPosition + 2);
      doc.setTextColor(31, 41, 55);
      doc.setFont("arial", "bold");
      doc.text(data.guardianRelationship, pageWidth / 2, yPosition + 6);
    }

    // Guardian Phone
    if (data.guardianPhone) {
      doc.setFont("arial");
      doc.setTextColor(102, 102, 102);
      doc.text("Téléphone Tuteur / هاتف الولي:", margin + 3, yPosition + 12);
      doc.setTextColor(31, 41, 55);
      doc.setFont("arial", "bold");
      doc.text(data.guardianPhone, margin + 3, yPosition + 16);
    }

    // Home Phone
    if (data.homePhone) {
      doc.setFont("arial");
      doc.setTextColor(102, 102, 102);
      doc.text("Téléphone Domicile / الهاتف الثابت:", pageWidth / 2, yPosition + 12);
      doc.setTextColor(31, 41, 55);
      doc.setFont("arial", "bold");
      doc.text(data.homePhone, pageWidth / 2, yPosition + 16);
    }

    yPosition += 60;
  }

  // QR Code Section
  if (data.qrCodeImageUrl) {
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text("Code QR / رمز الاستجابة السريعة", margin, yPosition);

    yPosition += 8;
    const qrSize = 50;
    const qrX = pageWidth / 2 - qrSize / 2;

    try {
      doc.addImage(data.qrCodeImageUrl, "PNG", qrX, yPosition, qrSize, qrSize);
    } catch (err) {
      console.warn("QR code image not added:", err);
    }

    yPosition += qrSize + 5;

    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102);
    doc.text("Scannez pour accéder aux données / امسح للوصول إلى البيانات", pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 5;
  }

  // Additional Phones
  if (data.additionalPhones && data.additionalPhones.length > 0) {
    yPosition += 5;
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text("Contacts Additionnels / جهات الاتصال الإضافية:", margin, yPosition);

    doc.setFontSize(8);
    doc.setTextColor(31, 41, 55);
    yPosition += 4;
    doc.text(data.additionalPhones.join(" | "), margin, yPosition, { maxWidth: contentWidth });
  }

  // Footer
  yPosition = pageHeight - 20;
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 5;
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.text(`Créé le / تاريخ الإنشاء: ${getFormattedDate()}`, pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 4;
  doc.text("© 2026 Scouts Hassania Safi / الكشافة الحسنية صفي", pageWidth / 2, yPosition, {
    align: "center",
  });

  // Return as data URL
  return doc.output("dataurlstring");
};
