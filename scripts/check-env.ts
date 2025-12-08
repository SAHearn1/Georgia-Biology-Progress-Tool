import fs from "fs";
import path from "path";

type Requirement = {
  keys: string[];
  label: string;
  mode?: "all" | "any";
  optional?: boolean;
  note?: string;
};

type EnvMap = Record<string, string>;

const envFiles = [".env.local", ".env"];

const requirements: Requirement[] = [
  {
    keys: ["POSTGRES_PRISMA_URL", "POSTGRES_URL_NON_POOLING", "DATABASE_URL"],
    label: "Database URLs (Prisma/Vercel Postgres)",
  },
  {
    keys: ["NEXTAUTH_URL"],
    label: "NextAuth base URL",
  },
  {
    keys: ["AUTH_SECRET", "NEXTAUTH_SECRET"],
    label: "NextAuth secret (AUTH_SECRET or NEXTAUTH_SECRET)",
    mode: "any",
  },
  {
    keys: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    label: "Google OAuth client ID/secret",
  },
  {
    keys: ["ANTHROPIC_API_KEY"],
    label: "Anthropic API key (optional, enables item generation)",
    optional: true,
  },
  {
    keys: ["NEXT_PUBLIC_ENABLE_CAT_ALGORITHM"],
    label: "Feature toggle for CAT flow",
  },
  {
    keys: ["NEXT_PUBLIC_SCHOOL_YEAR"],
    label: "School year label",
  },
];

function stripQuotes(value: string) {
  const match = value.match(/^"(.*)"$/);
  return match ? match[1] : value;
}

function loadEnvFile(filePath: string, target: EnvMap) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...rest] = trimmed.split("=");
    if (!key) continue;
    const value = stripQuotes(rest.join("=").trim());
    if (value) {
      target[key] = value;
    }
  }
}

function collectEnv(): EnvMap {
  const env: EnvMap = { ...process.env } as EnvMap;
  const repoRoot = process.cwd();

  for (const file of envFiles) {
    const filePath = path.join(repoRoot, file);
    loadEnvFile(filePath, env);
  }

  return env;
}

function checkRequirements(env: EnvMap) {
  const results = [] as { requirement: Requirement; missing: string[] }[];

  for (const requirement of requirements) {
    const mode = requirement.mode ?? "all";
    const missing = requirement.keys.filter((key) => !env[key]);

    const satisfied =
      mode === "all"
        ? missing.length === 0
        : requirement.keys.some((key) => env[key]);

    if (!satisfied) {
      results.push({ requirement, missing });
    }
  }

  return results;
}

function main() {
  const env = collectEnv();
  const results = checkRequirements(env);

  if (results.length === 0) {
    console.log("✅ All required environment variables are set.");
    console.log(
      "ℹ️  Optional: Set ANTHROPIC_API_KEY to enable AI item generation if you plan to use it."
    );
    return;
  }

  console.error("❌ Missing or incomplete environment configuration detected:\n");
  for (const { requirement, missing } of results) {
    const optionalLabel = requirement.optional ? " (optional)" : "";
    const missingList = missing.length ? `Missing: ${missing.join(", ")}` : "";
    const modeLabel = requirement.mode === "any" ? "(need any one)" : "(need all)";
    console.error(`- ${requirement.label}${optionalLabel} ${modeLabel}`);
    if (missingList) {
      console.error(`  ${missingList}`);
    }
    if (requirement.note) {
      console.error(`  Note: ${requirement.note}`);
    }
    console.error("");
  }

  process.exit(1);
}

main();
