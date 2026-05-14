import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  onPasswordChange: (password: string) => void;
  showLabel?: boolean;
}

type StrengthLevel = "none" | "weak" | "fair" | "good" | "strong" | "very-strong";

interface StrengthInfo {
  level: StrengthLevel;
  score: number;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export default function PasswordStrengthIndicator({
  password,
  onPasswordChange,
  showLabel = true,
}: PasswordStrengthIndicatorProps) {
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (pwd: string): StrengthInfo => {
    let score = 0;

    if (!pwd) {
      return {
        level: "none",
        score: 0,
        label: "Aucun mot de passe",
        color: "text-gray-400",
        bgColor: "bg-gray-100",
        icon: "⚪",
      };
    }

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    // Determine level
    let level: StrengthLevel = "weak";
    let label = "Très faible";
    let color = "text-red-600";
    let bgColor = "bg-red-100";
    let icon = "🔴";

    if (score >= 7) {
      level = "very-strong";
      label = "Très fort";
      color = "text-blue-600";
      bgColor = "bg-blue-100";
      icon = "🔵";
    } else if (score >= 6) {
      level = "strong";
      label = "Fort";
      color = "text-green-600";
      bgColor = "bg-green-100";
      icon = "🟢";
    } else if (score >= 5) {
      level = "good";
      label = "Bon";
      color = "text-yellow-600";
      bgColor = "bg-yellow-100";
      icon = "🟡";
    } else if (score >= 3) {
      level = "fair";
      label = "Passable";
      color = "text-orange-600";
      bgColor = "bg-orange-100";
      icon = "🟠";
    } else {
      level = "weak";
      label = "Très faible";
      color = "text-red-600";
      bgColor = "bg-red-100";
      icon = "🔴";
    }

    return {
      level,
      score,
      label,
      color,
      bgColor,
      icon,
    };
  };

  const strength = calculateStrength(password);
  const strengthPercentage = (strength.score / 7) * 100;

  return (
    <div className="w-full">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Entrez un mot de passe fort"
              className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
              title={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Strength Icon */}
        <div className={`text-3xl ${strength.color}`}>
          {strength.icon}
        </div>
      </div>

      {/* Strength Bar */}
      {password && (
        <>
          <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.bgColor.replace("bg-", "bg-")}`}
              style={{
                width: `${strengthPercentage}%`,
                backgroundColor:
                  strength.level === "very-strong"
                    ? "#2563eb"
                    : strength.level === "strong"
                      ? "#16a34a"
                      : strength.level === "good"
                        ? "#eab308"
                        : strength.level === "fair"
                          ? "#ea580c"
                          : "#dc2626",
              }}
            />
          </div>

          {/* Strength Label and Requirements */}
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${strength.color}`}>
                Force: {strength.label}
              </span>
              <span className="text-xs text-gray-500">
                {strength.score}/7 critères
              </span>
            </div>

            {/* Requirements Checklist */}
            {showLabel && (
              <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                <div className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-600" : "text-gray-400"}`}>
                  <span>{password.length >= 8 ? "✓" : "○"}</span>
                  <span>Au moins 8 caractères</span>
                </div>
                <div className={`flex items-center gap-2 ${password.length >= 12 ? "text-green-600" : "text-gray-400"}`}>
                  <span>{password.length >= 12 ? "✓" : "○"}</span>
                  <span>Au moins 12 caractères (bonus)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600" : "text-gray-400"}`}>
                  <span>{/[a-z]/.test(password) ? "✓" : "○"}</span>
                  <span>Minuscules (a-z)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"}`}>
                  <span>{/[A-Z]/.test(password) ? "✓" : "○"}</span>
                  <span>Majuscules (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-600" : "text-gray-400"}`}>
                  <span>{/[0-9]/.test(password) ? "✓" : "○"}</span>
                  <span>Chiffres (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[^a-zA-Z0-9]/.test(password) ? "text-green-600" : "text-gray-400"}`}>
                  <span>{/[^a-zA-Z0-9]/.test(password) ? "✓" : "○"}</span>
                  <span>Caractères spéciaux (!@#$...)</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
