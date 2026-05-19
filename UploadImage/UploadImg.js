const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer'); 


const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});



router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, email, message } = req.body;
               
        const imageBuffer = req.file ? req.file.buffer : null;
       
        const sql = "INSERT INTO contact (name, email, message, image_data) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [name, email, message, imageBuffer]);
        
        res.status(201).json({ message: "Üzenet és kép sikeresen elmentve!" });
    } catch (error) {
        console.error("Hiba a mentés során:", error); 
        res.status(500).json({ error: "Szerver hiba a mentéskor" });
    }
});

module.exports = router;