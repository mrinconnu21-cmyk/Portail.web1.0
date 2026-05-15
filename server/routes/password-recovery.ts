import { RequestHandler } from "express";
import { supabase } from "../lib/supabase";

export const handleVerifyIdentity: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, userPhone, birthDate, memberId } = req.body;

    // Validate input
    if (!firstName || !lastName || !userPhone || !birthDate || !memberId) {
      return res.status(400).json({
        error: "جميع الحقول مطلوبة",
      });
    }

    // Query Supabase for matching member
    const { data: member, error } = await supabase
      .from("members")
      .select("id, first_name, last_name, user_phone, birth_date, generated_id, user_id")
      .eq("first_name", firstName)
      .eq("last_name", lastName)
      .eq("user_phone", userPhone)
      .eq("birth_date", birthDate)
      .eq("generated_id", memberId)
      .single();

    if (error || !member) {
      return res.status(401).json({
        error: "المعلومات المدخلة غير صحيحة أو لا تتطابق مع سجلاتنا",
      });
    }

    // Get password from auth table
    const { data: authData, error: authError } = await supabase
      .from("auth")
      .select("password")
      .eq("user_id", member.user_id)
      .single();

    if (authError || !authData) {
      return res.status(500).json({
        error: "فشل الوصول إلى بيانات الحساب",
      });
    }

    // Return member info and password
    res.json({
      success: true,
      firstName: member.first_name,
      lastName: member.last_name,
      memberId: member.generated_id,
      password: authData.password,
    });
  } catch (error) {
    console.error("Error verifying identity:", error);
    res.status(500).json({
      error: "خطأ في الخادم",
      details: String(error),
    });
  }
};

export const handleResetPassword: RequestHandler = async (req, res) => {
  try {
    const { memberId, newPassword } = req.body;

    // Validate input
    if (!memberId || !newPassword) {
      return res.status(400).json({
        error: "جميع الحقول مطلوبة",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      });
    }

    // Find member by ID
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("id, user_id")
      .eq("generated_id", memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({
        error: "العضو غير موجود",
      });
    }

    // Update password in auth table
    const { error: updateError } = await supabase
      .from("auth")
      .update({
        password: newPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", member.user_id);

    if (updateError) {
      return res.status(500).json({
        error: "فشل تحديث كلمة المرور",
        details: updateError.message,
      });
    }

    res.json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      error: "خطأ في الخادم",
      details: String(error),
    });
  }
};
