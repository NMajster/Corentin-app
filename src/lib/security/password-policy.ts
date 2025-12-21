/**
 * Politique de mot de passe forte pour application juridique
 * - Minimum 12 caractères
 * - Au moins 1 majuscule
 * - Au moins 1 minuscule
 * - Au moins 1 chiffre
 * - Au moins 1 caractère spécial
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong" | "very_strong";
  score: number; // 0-100
}

export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  weight: number;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "Au moins 12 caractères",
    test: (p) => p.length >= 12,
    weight: 25,
  },
  {
    id: "uppercase",
    label: "Au moins une majuscule (A-Z)",
    test: (p) => /[A-Z]/.test(p),
    weight: 20,
  },
  {
    id: "lowercase",
    label: "Au moins une minuscule (a-z)",
    test: (p) => /[a-z]/.test(p),
    weight: 20,
  },
  {
    id: "number",
    label: "Au moins un chiffre (0-9)",
    test: (p) => /[0-9]/.test(p),
    weight: 20,
  },
  {
    id: "special",
    label: "Au moins un caractère spécial (!@#$%...)",
    test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p),
    weight: 15,
  },
];

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  for (const req of PASSWORD_REQUIREMENTS) {
    if (req.test(password)) {
      score += req.weight;
    } else {
      errors.push(req.label);
    }
  }

  // Bonus pour longueur supplémentaire
  if (password.length >= 16) score = Math.min(100, score + 10);
  if (password.length >= 20) score = Math.min(100, score + 5);

  // Déterminer la force
  let strength: "weak" | "medium" | "strong" | "very_strong";
  if (score < 40) {
    strength = "weak";
  } else if (score < 70) {
    strength = "medium";
  } else if (score < 90) {
    strength = "strong";
  } else {
    strength = "very_strong";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score,
  };
}

export function getStrengthLabel(strength: PasswordValidationResult["strength"]): string {
  const labels: Record<typeof strength, string> = {
    weak: "Faible",
    medium: "Moyen",
    strong: "Fort",
    very_strong: "Très fort",
  };
  return labels[strength];
}

export function getStrengthColor(strength: PasswordValidationResult["strength"]): string {
  const colors: Record<typeof strength, string> = {
    weak: "bg-red-500",
    medium: "bg-amber-500",
    strong: "bg-emerald-500",
    very_strong: "bg-green-600",
  };
  return colors[strength];
}

