import prisma from '../lib/prisma.js';

// Contoh 1: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contoh 2: Create user
export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email }
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Contoh 3: Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contoh 4: Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Contoh 5: Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};