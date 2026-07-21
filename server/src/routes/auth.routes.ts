import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // 1. Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  // 2. Hash the password — never store it as plain text
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Create the User AND their Patient profile together
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "PATIENT",
      patient: {
        create: { firstName, lastName },
      },
    },
    include: { patient: true },
  });

  // 4. Never send the password hash back to the client
  const { passwordHash: _, ...safeUser } = user;

  res.status(201).json(safeUser);
});

export default router;
