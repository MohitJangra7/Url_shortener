// const express = require('express');
// const mongoose = require('mongoose');
// const ShortUrl = require('./models/shortUrl');
// const app = express();

// mongoose.connect('mongodb://127.0.0.1:27017/Project', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: false }));

// app.get('/', async (req, res) => {
//   const shortUrls = await ShortUrl.find();
//   res.render('index', { shortUrls: shortUrls });
// });

// app.post('/shortUrls', async (req, res) => {
//   await ShortUrl.create({ full: req.body.fullUrl });
//   res.redirect('/');
// });

// app.get('/:shortUrl', async (req, res) => {
//   const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
//   if (shortUrl == null) return res.sendStatus(404);

//   shortUrl.clicks++;
//   shortUrl.save();

//   res.redirect(shortUrl.full);
// });

// // New route to handle URL deletion
// app.post('/deleteUrl', async (req, res) => {
//   const urlToDelete = req.body.urlToDelete;

//   try {
//     // Find the URL in the database and remove it
//     await ShortUrl.findOneAndDelete({ full: urlToDelete });
//     res.redirect('/');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(process.env.PORT || 5000);


const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/Project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  const fullUrl = req.body.fullUrl;

  // Check if the URL already exists
  const existingShortUrl = await ShortUrl.findOne({ full: fullUrl });

  if (existingShortUrl) {
    // If it exists, show a message with the existing shortened URL and a "Copy" button
    return res.send(`
      Shortened URL already exists, copy the link below: <br>
      <input type="text" value="localhost:5000/${existingShortUrl.short}" id="shortenedUrl" readonly>
      <button onclick="copyToClipboard()">Copy</button>

      <script>
        // Function to copy the URL to the clipboard
        function copyToClipboard() {
          const copyText = document.getElementById("shortenedUrl");
          copyText.select();
          document.execCommand("copy");
          alert("Copied the shortened URL: " + copyText.value);
        }
      </script>
    `);
  }

  // If the URL doesn't exist, create a new shortened URL
  const newShortUrl = await ShortUrl.create({ full: fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

// New route to handle URL deletion
app.post('/deleteUrl', async (req, res) => {
  const urlToDelete = req.body.urlToDelete;

  try {
    // Find the URL in the database and remove it
    await ShortUrl.findOneAndDelete({ full: urlToDelete });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT || 5000);
