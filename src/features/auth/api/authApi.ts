export async function registerAccount(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Gagal mendaftar akun baru.");
  }
  return json.data;
}
