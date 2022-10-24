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

router.get("/articles/page/:pageNumber", async (req, res) => {
  let pageNumber = req.params.pageNumber;

  if (pageNumber > 4) {
    pageNumber = 1;
  }

  await prisma.article
    .findMany()
    .then((articles) => {
      if (pageNumber == 1) {
        res.json(articles.reverse().slice(0, 25));
      } else if (pageNumber == 2) {
        res.json(articles.reverse().slice(25, 50));
      } else if (pageNumber == 3) {
        res.json(articles.reverse().slice(50, 75));
      } else if (pageNumber == 4) {
        res.json(articles.reverse().slice(75, 100));
      }
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
    .then(async (article) => {
      res.json(article);
      console.log("Article sent from DB");
      await prisma.article
        .update({
          where: {
            title: article.title,
          },
          data: {
            views: article.views + 1,
          },
        })
        .then(() => console.log("Updated Article Views"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.delete("/articles", async (req, res) => {
  await prisma.article
    .deleteMany()
    .then(() => {
      res.json("All Articles have been Deleted");
      console.log("All Articles have been Deleted");
    })
    .catch((err) => console.log(err));
});

router.delete("/articles/:articleTitle", async (req, res) => {
  const articleTitle = req.params.articleTitle;

  await prisma.article
    .delete({
      where: { title: articleTitle },
    })
    .then(() => {
      res.json("Article has been Deleted");
      console.log("Article has been Deleted");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
