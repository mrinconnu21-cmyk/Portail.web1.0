import { RequestHandler } from "express";
import { supabase } from "../lib/supabase";

interface MemberData {
  id: string;
  first_name: string;
  last_name: string;
  generated_id: string;
  user_phone: string;
  birth_date: string;
  gender: string;
  pdf_url?: string;
  qr_code_url?: string;
}

export const handleRegenerateDocuments: RequestHandler = async (req, res) => {
  try {
    const { memberId } = req.body;

    // Fetch user data
    let query = supabase
      .from("users")
      .select(
        "id, first_name, last_name, generated_id, user_phone, birth_date, gender, pdf_url, qr_code_url"
      );

    if (memberId) {
      query = query.eq("generated_id", memberId);
    }

    const { data: users, error: fetchError } = await query;

    if (fetchError) {
      return res.status(500).json({
        error: "Failed to fetch users",
        details: fetchError.message,
      });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({
        error: memberId
          ? "User not found"
          : "No users found",
      });
    }

    const results = [];

    for (const user of users as MemberData[]) {
      try {
        results.push({
          memberId: user.generated_id,
          name: `${user.first_name} ${user.last_name}`,
          status: "success",
          message: "Documents regeneration triggered",
        });
      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError);
        results.push({
          memberId: user.generated_id,
          status: "error",
          message: String(userError),
        });
      }
    }

    res.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Error regenerating documents:", error);
    res.status(500).json({
      error: "Failed to regenerate documents",
      details: String(error),
    });
  }
};

export const handleGetDocumentStatus: RequestHandler = async (req, res) => {
  try {
    const { memberId } = req.query;

    let query = supabase
      .from("users")
      .select("generated_id, first_name, last_name, pdf_url, qr_code_url, updated_at");

    if (memberId) {
      query = query.eq("generated_id", memberId as string);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch document status",
        details: error.message,
      });
    }

    const status = data?.map((user) => ({
      memberId: user.generated_id,
      name: `${user.first_name} ${user.last_name}`,
      hasPdf: !!user.pdf_url,
      hasQrCode: !!user.qr_code_url,
      generatedAt: user.updated_at,
    })) || [];

    res.json({
      success: true,
      totalMembers: status.length,
      withDocuments: status.filter((m) => m.hasPdf && m.hasQrCode).length,
      withoutDocuments: status.filter((m) => !m.hasPdf || !m.hasQrCode).length,
      members: status,
    });
  } catch (error) {
    console.error("Error getting document status:", error);
    res.status(500).json({
      error: "Failed to get document status",
      details: String(error),
    });
  }
};
