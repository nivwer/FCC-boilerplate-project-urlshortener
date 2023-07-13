require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
require('./connection')

const Url = require('./models/Urls')


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoint
app.post('/api/shorturl', (req, res) => {
  dns.lookup(new URL(req.body.url).hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    
    const createShortUrl = async (url) => {
      var id = await Url.count({});

      const shortUrl = new Url({
        url: url,
        shorturl: id
      })
      await shortUrl.save()
      return shortUrl
    };

    const findUrl = async (url) => {
      const urlFound = await Url.findOne({url: url});
      let urlDoc = ''
      
      if (urlFound === null) {
        urlDoc = createShortUrl(url)
        return urlDoc;
      } else {
        urlDoc = urlFound
        return urlDoc;
      } 
    };

    findUrl(req.body.url)
    .then(urlDoc => res.json({
      original_url : urlDoc.url,
      short_url: urlDoc.shorturl
    }))
    .catch(err => console.log(err))

  });
});

app.get('/api/shorturl/:short_url', async (req, res) => {
  const urlDoc = await Url.findOne({shorturl: req.params.short_url});
  res.redirect(urlDoc.url)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
