import { getApiBase } from "../../../config/apiBase";

export async function runCppCode(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${getApiBase()}/challenges/run-cpp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: source }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        payload.message || payload.error || "C++ compiler API failed",
      );
    }
    return { result: payload, runtime: "server" };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("C++ compile timed out. Try shorter code.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function formatCppOutput(result = {}) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

export function getCppRuntimeError(runResult) {
  return (
    runResult?.error ||
    (runResult?.exitCode != null && runResult.exitCode !== 0
      ? runResult.stderr || "Compilation or run failed"
      : "")
  );
}
