const prisma = require("../prisma.js");
const puppeteer = require("puppeteer");

async function start() {
  const extentionPath = "./bypass-paywalls-chrome-master";

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extentionPath}`,
      `--load-extension=${extentionPath}`,
    ],
  });
  const page = await browser.newPage();

  let links = [];

  await page
    .goto("https://www.wsj.com/news/latest-headlines?mod=wsjheader", {
      waitUntil: "networkidle0",
    })
    .then(() => console.log("Links Page Loaded"))
    .catch((err) => console.log(err));

  links = await page.evaluate(() => {
    const link = Array.from(
      document.querySelectorAll(
        "#main > div > div > article > div.WSJTheme--overflow-hidden--qJmlzHgO > div > div > h2 > a"
      )
    ).map((data) => data.href);

    return link;
  });

  console.log(links);

  for (let i = 0; i < links.length; i++) {
    await page
      .goto(links[i], {
        waitUntil: "networkidle0",
      })
      .then(() => console.log("Article Page " + i + " Loaded"))
      .catch((err) => console.log(err));

    await page
      .evaluate(() => {
        const author =
          Array.from(
            document.getElementsByClassName("css-1ohky7u-AuthorLink")
          )[0] ||
          Array.from(
            document.getElementsByClassName("css-jmaeq5-PlainByline")
          )[0];
        const title =
          document.querySelector(
            "#__next > div > main > div.css-u1dda4.e105m3c32 > div > div.crawler.css-bsrkcm-Box.e1vnmyci0 > h1"
          ) || document.querySelector("#main > header > div > div > h1");
        const subTitle =
          document.querySelector(
            "#__next > div > main > div.css-u1dda4.e105m3c32 > div > h2"
          ) || document.querySelector("#main > header > div > div > h2");
        const body1 = Array.from(
          document.querySelectorAll(
            "#__next > div > main > article > div.crawler.css-1rlknzd.e1of74uw7 > section > p"
          ) ||
            document.querySelectorAll(
              "#wsj-article-wrap > div.article-content > p"
            )
        ).map((bodyData) => bodyData?.textContent || undefined);
        const body2 = Array.from(
          document.querySelectorAll(
            "#__next > div > main > article > div.crawler.css-1rlknzd.e1of74uw7 > section > div > p"
          ) ||
            document.querySelectorAll(
              "#wsj-article-wrap > div.article-content > div.paywall > p"
            )
        ).map((bodyData) => bodyData?.textContent || undefined);
        const image =
          document.querySelector(
            "#wsj-article-wrap > div.is-lead-inset > div > figure > div > img"
          ) ||
          document.querySelector(
            "#__next > div > main > article > div.crawler.css-1rlknzd.e1of74uw7 > div.media-layout.css-9oedd1-Layout.ek23gj80 > figure > img"
          );
        const date = Array.from(
          document.getElementsByClassName("css-a8mttu-Timestamp-Timestamp")
        )[0];
        const article = {
          author: author?.textContent || "The Editorial Board",
          title: title?.textContent || "",
          subTitle: subTitle?.textContent,
          body: body1.concat(body2),
          image: {
            src: image?.src,
            width: image?.width.toString(),
            height: image?.height.toString(),
          },
          date:
            date?.textContent ||
            new Date().toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "long",
            }),
        };

        article.body.pop();

        if (article.body[0] === null) {
          article.body.splice(0, 1);
        } else if (article.body[-1] === null) {
          article.body.pop();
        } else null;

        return article.title === "" || article.body.length === 0
          ? undefined
          : article;
      })
      .then((data) => {
        {
          data === undefined
            ? null
            : // await prisma.article
              //   .create({
              //     data: data,
              //   })
              //   .then(() => {
              //     res.json("New Article Saved to Prisma DB");
              //   })
              //   .catch((err) => console.log(err));;
              console.log(data);
        }
      })
      .catch((err) => console.log(err));
  }
  await browser.close();
}

start().catch((err) => console.log(err));
