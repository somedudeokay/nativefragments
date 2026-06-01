export const clickCountCookieName = "nf_demo_clicks";

const toCount = (value) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export const readClickCountCookie = (request) => {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${clickCountCookieName}=`));

  if (!match) return 0;
  return toCount(decodeURIComponent(match.split("=").slice(1).join("=")));
};

export const clickCounterMeta = ({ request }) => ({
  clickCount: readClickCountCookie(request),
});
