const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Hozzáférés megtagadva" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Beletesszük a req objektumba (pl. req.user.id = 5)
        next();
    } catch (err) {
        res.status(400).json({ error: "Érvénytelen token" });
    }
};

// Routes.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // az adatbázis kapcsolatod
const auth = require('./authMiddleware'); // a fenti middleware


router.post('/checkout', auth, async (req, res) => {
    try {
        const userId = req.user.id; // A tokenből automatikusan megvan, ki ő!
        const { total_price, items } = req.body; // A rendelés adatai a frontendről

        // Beszúrjuk a rendelést a rendelések táblába a user_id-val együtt
        const sql = "INSERT INTO orders (user_id, total_price) VALUES (?, ?)";
        await db.query(sql, [userId, total_price]);

        res.status(201).json({ message: "Rendelés sikeresen rögzítve!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hiba történt a rendelés során" });
    }
});

module.exports = router;
