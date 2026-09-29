const cookieName = "nf_workspace";
const lifetime = 7 * 24 * 60 * 60;
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
export const token = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};
export const digest = async value => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
};
export const sessionCookie = (value, request, age = lifetime) =>
  `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
export const readToken = request => {
  const value = (request.headers.get("cookie") ?? "").split(";").map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  return tokenPattern.test(value ?? "") ? value : null;
};
export const prepare = async ({ request, env }) => {
  const value = readToken(request);
  if (!value) return { workspace: null, sessionHash: null };
  const sessionHash = await digest(value);
  const session = await env.DB.prepare("SELECT workspace_id FROM sessions WHERE token_hash = ? AND expires_at > ?").bind(sessionHash, Date.now()).first();
  return { workspace: session?.workspace_id ?? null, sessionHash };
};
export const newSession = async (env, workspace, request) => {
  const value = token();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(Date.now()),
    env.DB.prepare("INSERT INTO sessions(token_hash, workspace_id, expires_at) VALUES (?, ?, ?)").bind(await digest(value), workspace, Date.now() + lifetime * 1000),
  ]);
  return sessionCookie(value, request);
};
export const requireWorkspace = ({ locals }) => {
  if (!locals.workspace) throw new Response("Sign in to continue.", { status: 401 });
  return locals.workspace;
};
export const readForm = async ({ request }) => {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new Response("Origin not allowed", { status: 403 });
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("application/x-www-form-urlencoded")) throw new Response("Use a URL-encoded form", { status: 415 });
  const reader = request.body?.getReader();
  let text = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 4096) { await reader.cancel(); throw new Response("Form too large", { status: 413 }); }
      text += decoder.decode(value, { stream: true });
    }
    return new URLSearchParams(text + decoder.decode());
  } finally { reader?.releaseLock(); }
};
export const validRecoveryKey = value => tokenPattern.test(value ?? "");
