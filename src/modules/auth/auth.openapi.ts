export const authOpenApiPaths = {
  "/api/v1/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Registrasi akun baru dengan email & password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", example: "Budi Santoso" },
                email: { type: "string", format: "email", example: "budi@example.com" },
                password: { type: "string", minLength: 8, example: "Rahasia123!" },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Akun berhasil dibuat" },
        "400": { description: "Payload tidak valid" },
        "409": { description: "Email sudah terdaftar" },
      },
    },
  },
  "/api/v1/auth/guest": {
    post: {
      tags: ["Auth"],
      summary: "Provisioning akun Guest Demo terisolasi",
      responses: {
        "201": { description: "Akun Guest Demo siap digunakan" },
      },
    },
  },
} as const;
