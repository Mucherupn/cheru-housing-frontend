export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({
      token: "demo-jwt-token",
      user: {
        id: "admin_1",
        name: "Cheru Admin",
        role: "super_admin",
      },
    });
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
