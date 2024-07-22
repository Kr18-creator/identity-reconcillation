const express = require("express");
const mysql = require("mysql2/promise");
const identifyContact = require("./services/identifyContact");

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bitespeed",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/api/identify", async (req, res) => {
  const { phoneNumber, email } = req.body;

  if (!phoneNumber && !email) {
    return res.status(400).json({ error: "phoneNumber or email is required" });
  }

  try {
    const result = await identifyContact(pool, email, phoneNumber);

    const response = {
      primaryContactId: result.primaryContact.id,
      emails: Array.from(result.emails),
      phoneNumbers: Array.from(result.phoneNumbers),
      secondaryContactIds: result.secondaryContacts.map((c) => c.id),
    };

    res.status(201).json({ contact: response });
  } catch (err) {
    console.error("Error identifying or creating contact:", err);
    res.status(500).json({ error: "Error identifying or creating contact" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
