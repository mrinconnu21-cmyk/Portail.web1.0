import { RequestHandler } from "express";
import { supabase } from "../lib/supabase";

interface MemberData {
  id: string;
  first_name: string;
  last_name: string;
  generated_id: string;
  user_id: string;
  user_phone: string;
  birth_date: string;
  gender: string;
  patrol_name: string;
  role_name: string;
  guardian_first_name: string;
  guardian_last_name: string;
  guardian_phone: string;
  home_phone: string;
  guardian_relationship: string;
}

export const handleRegenerateDocuments: RequestHandler = async (req, res) => {
  try {
    const { memberId } = req.body;

    // Fetch member data
    let query = supabase
      .from("members")
      .select(
        "id, first_name, last_name, generated_id, user_id, user_phone, birth_date, gender, patrol_name, role_name, guardian_first_name, guardian_last_name, guardian_phone, home_phone, guardian_relationship"
      );

    if (memberId) {
      query = query.eq("generated_id", memberId);
    }

    const { data: members, error: fetchError } = await query;

    if (fetchError) {
      return res.status(500).json({
        error: "Failed to fetch members",
        details: fetchError.message,
      });
    }

    if (!members || members.length === 0) {
      return res.status(404).json({
        error: memberId
          ? "Member not found"
          : "No members found",
      });
    }

    const results = [];

    for (const member of members as MemberData[]) {
      try {
        // Update documents_generated_at timestamp
        const { error: updateError } = await supabase
          .from("members")
          .update({
            documents_generated_at: new Date().toISOString(),
          })
          .eq("id", member.id);

        if (updateError) {
          console.error(`Error updating member ${member.id}:`, updateError);
          results.push({
            memberId: member.generated_id,
            status: "error",
            message: updateError.message,
          });
          continue;
        }

        results.push({
          memberId: member.generated_id,
          name: `${member.first_name} ${member.last_name}`,
          status: "success",
          message: "Documents regeneration triggered",
        });
      } catch (memberError) {
        console.error(`Error processing member ${member.id}:`, memberError);
        results.push({
          memberId: member.generated_id,
          status: "error",
          message: String(memberError),
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
      .from("members")
      .select("generated_id, first_name, last_name, pdf_url, qr_code_url, documents_generated_at");

    if (memberId) {
      query = query.eq("generated_id", memberId as string);
    } else {
      // Get all members and their document status
      query = query.select("generated_id, first_name, last_name, pdf_url, qr_code_url, documents_generated_at");
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch document status",
        details: error.message,
      });
    }

    const status = data?.map((member) => ({
      memberId: member.generated_id,
      name: `${member.first_name} ${member.last_name}`,
      hasPdf: !!member.pdf_url,
      hasQrCode: !!member.qr_code_url,
      generatedAt: member.documents_generated_at,
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
