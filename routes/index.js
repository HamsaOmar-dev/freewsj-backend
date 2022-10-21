const router = require("express").Router();
const prisma = require("../prisma.js");

router.get("/", async (req, res) => {
  await prisma.article
    .findMany({
      take: 7,
    })
    .then((articles) => {
      res.json(articles.reverse());
      console.log("Home Article List sent from DB");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
