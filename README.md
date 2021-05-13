# Shashin
Shashin, Japanese for picture, is a basic image fetching app via Unsplash.

## Get started
1. Clone repo
2. Get an API Access Key from Unsplash and save to a `.env` file
3. From within the project directory, run `node server/index.js` to start the backend so you can fetch images from Unsplash
4. Open up `/app/index.html` to gain access to the frontend and start searching for images

## MVP
1. Fetch images based on user query from 3rd party API
2. Display images
3. Show image and image details, if any, in a modal when selected

## Future updates
- Refactor and modulize JS
- *Lazy load / Virtualize / Windowize* more images when user reaches toward the bottom of the scrolling window
- Properly cache all fetched images for a given query to minimalize additional and unnecessary fetches and downloads
- Transition / animation for opening and closing modal
- Loading state after submitting a query to fetch images
- Tests (user, snapshot, end-to-end)
- Fallback CSS for unsupported features (gap, aspect-ratio, etc.)
- Further error handling states
- Builder tool / packager to minimize code