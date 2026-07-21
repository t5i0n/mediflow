import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 2. Compare the submitted password against the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 3. Issue a JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});
