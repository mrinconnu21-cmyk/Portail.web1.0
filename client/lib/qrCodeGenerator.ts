import QRCode from "qrcode";

export interface QRCodeData {
  firstName: string;
  lastName: string;
  memberId: string;
  userId: string;
  userPhone?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhone?: string;
  homePhone?: string;
  additionalPhones?: string[];
}

export const generateQRCodeData = (data: QRCodeData): string => {
  const parts = [
    `${data.firstName} ${data.lastName}`,
    `ID: ${data.memberId}`,
    `UID: ${data.userId}`,
    data.guardianFirstName && data.guardianLastName
      ? `${data.guardianFirstName} ${data.guardianLastName}`
      : "",
    data.guardianPhone ? `T: ${data.guardianPhone}` : "",
    data.homePhone ? `H: ${data.homePhone}` : "",
    data.userPhone ? `P: ${data.userPhone}` : "",
    ...(data.additionalPhones || []),
  ];

  return parts.filter(Boolean).join(" | ");
};

export const generateQRCodeImage = async (
  data: QRCodeData
): Promise<string> => {
  const qrValue = generateQRCodeData(data);

  return await QRCode.toDataURL(qrValue, {
    errorCorrectionLevel: "H",
    type: "image/png",
    width: 250,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
};
