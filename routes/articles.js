const router = require("express").Router();
const prisma = require("../prisma.js");
router.get("/articles", async (req, res) => {
  await prisma.article
    .findMany()
    .then((articles) => {
      res.json(articles.reverse());
      console.log("Articles List sent from DB");
    })
    .catch((err) => console.log(err));
});

router.get("/articles/:articleTitle", async (req, res) => {
  const articleTitle = req.params.articleTitle;

  await prisma.article
    .findUnique({
      where: {
        title: articleTitle,
      },
    })
    .then((article) => {
      res.json(article);
      console.log("Article sent from DB");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
