const express = require('express');
const router = express.Router();
const Article = require('../models/article'); // Import the model

// Route to get all articles
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to add a new article
router.post('/articles', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        detailUrl: req.body.detailUrl
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
