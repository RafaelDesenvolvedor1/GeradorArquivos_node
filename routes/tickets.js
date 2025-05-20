const express = require("express");
const router = express.Router();
const db = require("../db/conect");

router.get("/", (req, res) => {
  db.query("SELECT * FROM tickets", (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { id_ticket, id_user, message } = req.body;
  const sql =
    "INSERT INTO tickets (id_ticket, id_user, message) VALUES (?, ?, ?)";
  db.query(sql, [id_ticket, id_user, message], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res
      .status(201)
      .json({
        mensagem: "Ticket criado com sucesso!",
        id_ticket,
        id_user,
        message,
      });
  });
});

module.exports = router;
