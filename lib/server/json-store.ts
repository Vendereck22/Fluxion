import fs from "fs/promises";
import os from "os";
import path from "path";



const TMP_ROOT = path.join(os.tmpdir(), "fluxion-data");

function isReadOnlyFsError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: unknown }).code;
  return code === "EROFS" || code === "EPERM" || code === "EACCES";
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readJsonWithFallback<T>(
  primaryPath: string,
  fallbackPath: string,
  fallbackValue: T
): Promise<T> {
  const primary = await readJsonFile<T | null>(primaryPath, null);
  if (primary !== null) return primary;
  return readJsonFile<T>(fallbackPath, fallbackValue);
}


export async function readJsonPreferFallback<T>(
  primaryPath: string,
  fallbackPath: string,
  fallbackValue: T
): Promise<T> {
  const fromFallback = await readJsonFile<T | null>(fallbackPath, null);
  if (fromFallback !== null) return fromFallback;
  return readJsonFile<T>(primaryPath, fallbackValue);
}

export async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  const tmpPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpPath, filePath);
}

export async function writeJsonWithFallback(
  primaryPath: string,
  fallbackPath: string,
  data: unknown
): Promise<{ used: "primary" | "fallback" }> {
  try {
    await writeJsonAtomic(primaryPath, data);
    return { used: "primary" };
  } catch (error) {
    if (!isReadOnlyFsError(error)) throw error;
  }

  await writeJsonAtomic(fallbackPath, data);
  return { used: "fallback" };
}


export function tmpDataPath(...segments: string[]) {
  return path.join(TMP_ROOT, ...segments);
}