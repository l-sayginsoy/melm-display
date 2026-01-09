const express = require("express");
const path = require("path");

const app = express();
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir, {
  etag: false,
  lastModified: false,
  setHeaders: (res, filePath) => {
    const lower = String(filePath).toLowerCase();
    // Wichtig: Damit der Monitor nach einem Austausch der Dateien sofort den neuen Stand zeigt,
    // schalten wir das Caching fuer die dynamischen Inhalte aus.
    const isPlanImg = (
      lower.endsWith("speiseplan.jpg") ||
      lower.endsWith("fruehstueck.jpg") ||
      lower.endsWith("mittagessen.jpg") ||
      lower.endsWith("nachmittagskaffee.jpg") ||
      lower.endsWith("abendbrot.jpg")
    );

    if (
      lower.endsWith(".html") ||
      lower.endsWith("quotes.json") ||
      lower.includes(`${path.sep}bg${path.sep}`) ||
      lower.endsWith("drk-logo.svg") ||
      isPlanImg
    ) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server laeuft auf http://localhost:${PORT}`);
});
