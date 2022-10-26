const router = require("express").Router();
const prisma = require("../prisma.js");

router.get("/topic", async (req, res) => {
  await prisma.article
    .findMany({
      select: {
        topic: true,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
