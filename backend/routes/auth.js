import { Router } from 'express';

const router = Router();

// Demo in-memory users for quick testing
const DEMO_USERS = [
  {
    id: "citizen_demo_1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    role: "citizen"
  },
  {
    id: "admin_1",
    name: "Officer Rajesh Varma",
    email: "admin@civicresolve.gov",
    department: "Public Works & Urban Administration",
    role: "admin"
  }
];

// Citizen Registration
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const user = {
    id: `citizen_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    role: 'citizen'
  };

  res.status(201).json({
    message: 'Citizen registered successfully',
    user,
    token: `jwt_sim_${user.id}`
  });
});

// Citizen / Admin Login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (role === 'admin' || email.includes('admin@')) {
    return res.json({
      message: 'Admin login successful',
      user: {
        id: "admin_1",
        name: "Officer Rajesh Varma",
        email: email || "admin@civicresolve.gov",
        department: "Central Urban Administration",
        role: "admin"
      },
      token: "jwt_sim_admin_token"
    });
  }

  const matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
    id: `citizen_${Date.now()}`,
    name: email.split('@')[0],
    email,
    phone: "+91 98765 43210",
    role: "citizen"
  };

  res.json({
    message: 'Citizen login successful',
    user: matchedUser,
    token: `jwt_sim_${matchedUser.id}`
  });
});

export default router;
