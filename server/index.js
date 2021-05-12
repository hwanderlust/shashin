const express = require('express');
const cors = require('cors')
const fetch = require('node-fetch');
require('dotenv').config();

const server = express();
const ACCESS_KEY = process.env.ACCESS_KEY;
const PORT = process.env.PORT || 3000;
const UNSPLASH_URL = `https://api.unsplash.com/search/photos`

server.use(cors());
server.use(logger);

server.get("/", (req, res) => {
  res.send("Hello World!");
});

server.get("/search/:query", (req, res) => {
  const searchQuery = req.params.query || "";
  if (!searchQuery.length) {
    return res.json({ error: "No query", msg: "Uh oh! It appears we failed to get what you were looking for. Please try again." });
  }
  apiRequest(
    searchQuery,
    1,
    (photos, numOfPages) => res.json({ photos, numOfPages }),
    (error) => res.json(error)
  );
});

server.get('/search/:query/:pageNum', (req, res) => {
  console.log(req.params);
  const searchQuery = req.params.query || "";
  const pageNum = req.params.pageNum || 1;

  if (!searchQuery.length) {
    return res.json({ error: "No query", msg: "Uh oh! It appears we failed to get what you were looking for. Please try again." });
  }

  apiRequest(
    searchQuery,
    pageNum,
    (photos, numOfPages) => res.json({ photos, numOfPages }),
    (error) => res.json(error)
  );
});

server.listen(PORT, () => {
  console.log(`we are live on port ${PORT}!`);
});

function apiRequest(query, pageNum, handleSuccess = console.log, handleFailure = console.error) {
  const url = `${UNSPLASH_URL}?query=${query}&per_page=100&page=${pageNum}&orientation=squarish`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Client-ID ${ACCESS_KEY}`
    }
  }

  fetch(url, options)
    .then(r => r.json())
    .then(r => {
      const photos = serialize(r.results);

      if (!photos.length) {
        console.log(`failure`);
        handleFailure({ error: "No data", msg: "Oops! Looks like we messed up somehow. Please try again." });
        return;
      }

      console.log(`success`);
      handleSuccess(photos, r.total_pages);
    })
    .catch(handleFailure);
}

function serialize(data) {
  if (!data.length) return [];
  return data.map(el => {
    return {
      id: el.id,
      date: el.created_at,
      description: el.description || el.slug,
      urls: el.urls,
      links: el.links,
      likes: el.likes,
      user: {
        id: el.user.id,
        username: el.user.username || pic.user.twitter_username || pic.user.name,
        bio: el.user.bio
      }
    }
  });
}

function logger(req, res, next) {
  console.log(req.method, req.originalUrl, new Date());
  next();
}