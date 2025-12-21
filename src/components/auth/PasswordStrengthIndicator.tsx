"use client";

import { CheckCircle, XCircle } from "lucide-react";
import {
  validatePassword,
  PASSWORD_REQUIREMENTS,
  getStrengthLabel,
  getStrengthColor,
} from "@/lib/security/password-policy";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const validation = validatePassword(password);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Barre de force */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Force du mot de passe</span>
          <span
            className={`font-medium ${
              validation.strength === "weak"
                ? "text-red-600"
                : validation.strength === "medium"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {getStrengthLabel(validation.strength)}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor(
              validation.strength
            )}`}
            style={{ width: `${validation.score}%` }}
          />
        </div>
      </div>

      {/* Liste des exigences */}
      {showRequirements && (
        <div className="space-y-1.5 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Exigences de sécurité :
          </p>
          {PASSWORD_REQUIREMENTS.map((req) => {
            const passed = req.test(password);
            return (
              <div
                key={req.id}
                className={`flex items-center gap-2 text-xs ${
                  passed ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

