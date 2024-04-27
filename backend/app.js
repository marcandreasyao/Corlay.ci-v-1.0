// // Step 1: Import necessary modules
// const express = require('express');
// const mongoose = require('mongoose');  // Make sure this comes before any use of mongoose
// const path = require('path');

// // Step 2: Connect to MongoDB
// mongoose.connect('mongodb://localhost/newsDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected successfully"))
// .catch(err => console.error("Could not connect to MongoDB:", err));

// // Step 3: Create an Express application
// const app = express();

// // Middleware to parse JSON
// app.use(express.json());

// // Serve static files from the specified directory
// const frontendPath = path.join(__dirname, '../Corlay.ci v 1.0'); // Adjust the path as necessary
// app.use(express.static(frontendPath));

// // Define a basic route to confirm server is working
// app.get('/', (req, res) => {
//   res.send('Server is running and can serve static files!');
// });

// // Define the port and start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Step 1: Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Step 2: Connect to MongoDB
mongoose.connect('mongodb://localhost/newsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("Could not connect to MongoDB:", err));

// Step 3: Define Mongoose Schema and Model
const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  datePosted: { type: Date, default: Date.now }
});

const News = mongoose.model('News', newsSchema);

// Step 4: Create an Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the specified directory
const frontendPath = path.join(__dirname, 'Corlay.ci v 1.0');
app.use(express.static(frontendPath));

// Setup a basic route to confirm server is working
app.get('/', (req, res) => {
  res.send('Serveur NodeJS Prêt!');
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Get all news articles
app.get('/api/news', async (req, res) => {
    try {
      const articles = await News.find();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Post a new article
  app.post('/api/news', async (req, res) => {
    const article = new News(req.body);
    try {
      const savedArticle = await article.save();
      res.status(201).json(savedArticle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  