import React from "react";

interface PdfDocumentProps {
  firstName: string;
  lastName: string;
  memberId: string;
  userId: string;
  phone: string;
  birthDate?: string;
  gender?: string;
  patrol?: string;
  role?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhone?: string;
  homePhone?: string;
  guardianRelationship?: string;
  additionalPhones?: string[];
  qrCodeImageUrl?: string;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
  (
    {
      firstName,
      lastName,
      memberId,
      userId,
      phone,
      birthDate,
      gender,
      patrol,
      role,
      guardianFirstName,
      guardianLastName,
      guardianPhone,
      homePhone,
      guardianRelationship,
      additionalPhones = [],
      qrCodeImageUrl,
    },
    ref
  ) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // QR code data - compact but complete
    const qrData = [
      `${firstName} ${lastName}`,
      `ID: ${memberId}`,
      `UID: ${userId}`,
      guardianFirstName && guardianLastName ? `${guardianFirstName} ${guardianLastName}` : "",
      guardianPhone ? `T: ${guardianPhone}` : "",
      homePhone ? `H: ${homePhone}` : "",
      phone ? `P: ${phone}` : "",
      ...additionalPhones,
    ]
      .filter(Boolean)
      .join(" | ");

    return (
      <div
        ref={ref}
        dir="rtl"
        style={{
          fontFamily: "'Arial', sans-serif",
          lineHeight: "1.6",
          color: "#000000",
          backgroundColor: "#ffffff",
          width: "794px",
          padding: "32px",
          margin: "0",
          boxSizing: "border-box",
          pageBreakAfter: "always",
        }}
      >
        {/* Header */}
        <div
          className="text-center mb-6 pb-4 border-b-2"
          style={{ borderColor: "#dc2626" }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#dc2626",
              margin: "0 0 4px 0",
              fontFamily: "'Times New Roman', serif",
            }}
          >
            Scouts Hassania Safi
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 8px 0",
            }}
          >
            الكشافة الحسنية صفي
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              margin: "0",
              fontWeight: "500",
            }}
          >
            Certificat de Confirmation de Compte
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#999999",
              margin: "4px 0 0 0",
            }}
          >
            شهادة تأكيد الحساب
          </p>
        </div>

        {/* Member Info Section */}
        <div
          className="mb-6 p-4 rounded"
          style={{
            backgroundColor: "#f3f4f6",
            borderRight: "4px solid #dc2626",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "12px",
            }}
          >
            Informations Membres / معلومات العضو
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "13px",
            }}
          >
            {/* Full Name */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "10px",
                  margin: "0 0 3px 0",
                  fontWeight: "500",
                }}
              >
                Nom complet / الاسم الكامل
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {firstName} {lastName}
              </p>
            </div>

            {/* Member ID */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "10px",
                  margin: "0 0 3px 0",
                  fontWeight: "500",
                }}
              >
                Numéro Membre / رقم العضو
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#dc2626",
                  margin: "0",
                  fontSize: "14px",
                }}
              >
                {memberId}
              </p>
            </div>

            {/* User ID */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "10px",
                  margin: "0 0 3px 0",
                  fontWeight: "500",
                }}
              >
                Identifiant Utilisateur / معرف المستخدم
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {userId}
              </p>
            </div>

            {/* Phone */}
            <div style={{ direction: "rtl" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "10px",
                  margin: "0 0 3px 0",
                  fontWeight: "500",
                }}
              >
                Téléphone Personnel / الهاتف الشخصي
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0",
                }}
              >
                {phone}
              </p>
            </div>

            {/* Birth Date */}
            {birthDate && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "10px",
                    margin: "0 0 3px 0",
                    fontWeight: "500",
                  }}
                >
                  Date de Naissance / تاريخ الميلاد
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {birthDate}
                </p>
              </div>
            )}

            {/* Gender */}
            {gender && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "10px",
                    margin: "0 0 3px 0",
                    fontWeight: "500",
                  }}
                >
                  Genre / الجنس
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {gender === "male" ? "Masculin / ذكر" : "Féminin / أنثى"}
                </p>
              </div>
            )}

            {/* Patrol */}
            {patrol && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "10px",
                    margin: "0 0 3px 0",
                    fontWeight: "500",
                  }}
                >
                  Unité / الفريق
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {patrol}
                </p>
              </div>
            )}

            {/* Role */}
            {role && (
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "10px",
                    margin: "0 0 3px 0",
                    fontWeight: "500",
                  }}
                >
                  Rôle / الدور
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guardian Info Section */}
        {(guardianFirstName || guardianLastName) && (
          <div
            className="mb-6 p-4 rounded"
            style={{
              backgroundColor: "#f3f4f6",
              borderRight: "4px solid #7c3aed",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Informations Tuteur / معلومات الولي
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "13px",
              }}
            >
              {/* Guardian Name */}
              <div style={{ direction: "rtl" }}>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "10px",
                    margin: "0 0 3px 0",
                    fontWeight: "500",
                  }}
                >
                  Nom du Tuteur / اسم الولي
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {guardianFirstName} {guardianLastName}
                </p>
              </div>

              {/* Guardian Relationship */}
              {guardianRelationship && (
                <div style={{ direction: "rtl" }}>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "10px",
                      margin: "0 0 3px 0",
                      fontWeight: "500",
                    }}
                  >
                    Relation / الصفة
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0",
                    }}
                  >
                    {guardianRelationship}
                  </p>
                </div>
              )}

              {/* Guardian Phone */}
              {guardianPhone && (
                <div style={{ direction: "rtl" }}>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "10px",
                      margin: "0 0 3px 0",
                      fontWeight: "500",
                    }}
                  >
                    Téléphone Tuteur / هاتف الولي
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0",
                    }}
                  >
                    {guardianPhone}
                  </p>
                </div>
              )}

              {/* Home Phone */}
              {homePhone && (
                <div style={{ direction: "rtl" }}>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "10px",
                      margin: "0 0 3px 0",
                      fontWeight: "500",
                    }}
                  >
                    Téléphone Domicile / الهاتف الثابت
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0",
                    }}
                  >
                    {homePhone}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Contacts */}
        {additionalPhones.length > 0 && (
          <div
            className="mb-6 p-4 rounded"
            style={{
              backgroundColor: "#f3f4f6",
              borderRight: "4px solid #2563eb",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Contacts Additionnels / جهات الاتصال الإضافية
            </h2>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#1f2937",
                wordBreak: "break-word",
              }}
            >
              {additionalPhones.join(" | ")}
            </p>
          </div>
        )}

        {/* QR Code Section */}
        {qrCodeImageUrl && (
          <div
            className="mb-6 p-4 rounded text-center"
            style={{
              backgroundColor: "#f3f4f6",
              borderRight: "4px solid #059669",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Code QR / رمز الاستجابة السريعة
            </h2>
            <img
              src={qrCodeImageUrl}
              alt="QR Code"
              style={{
                width: "120px",
                height: "120px",
                border: "2px solid #1f2937",
              }}
            />
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "10px",
                color: "#666666",
              }}
            >
              Scannez pour accéder aux données / امسح للوصول إلى البيانات
            </p>
          </div>
        )}

        {/* QR Code Data Info */}
        <div
          className="mb-6 p-3 rounded"
          style={{
            backgroundColor: "#fff3cd",
            borderRight: "4px solid #ffc107",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "10px",
              color: "#666666",
              wordBreak: "break-word",
              fontFamily: "monospace",
              lineHeight: "1.4",
            }}
          >
            {qrData}
          </p>
        </div>

        {/* Footer */}
        <div
          className="border-t-2 pt-3 text-center"
          style={{
            borderColor: "#dc2626",
            fontSize: "10px",
            color: "#666666",
          }}
        >
          <p style={{ margin: "3px 0" }}>
            Créé le / تاريخ الإنشاء: {formattedDate}
          </p>
          <p style={{ margin: "3px 0" }}>
            © 2026 Scouts Hassania Safi / الكشافة الحسنية صفي
          </p>
        </div>
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
