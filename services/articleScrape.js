const prisma = require("../prisma.js");
const puppeteer = require("puppeteer");

async function start() {
  const extentionPath = "./bypass-paywalls-chrome-master";

  const browser = await puppeteer.launch({
    // executablePath: "/usr/local/bin/chromium",
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
            document.getElementsByClassName("css-mbn33i-AuthorLink")
          )[0] ||
          Array.from(
            document.getElementsByClassName("css-1qf7jf5-PlainByline")
          )[0];
        const title =
          Array.from(
            document.getElementsByClassName("css-1lvqw7f-StyledHeadline")
          )[0] ||
          Array.from(
            document.getElementsByClassName(
              "css-1ruciut-StyledHeadline-BigTopHeadline"
            )
          )[0] ||
          Array.from(
            document.getElementsByClassName(
              "css-456klt-StyledHeadline-BigTopHeadline-BigTopHeadline"
            )
          )[0];
        const subTitle = Array.from(
          document.getElementsByClassName("css-mosdo-Dek-Dek")
        )[0];
        const body = Array.from(
          document.getElementsByClassName("css-xbvutc-Paragraph")
        ).map((bodyData) => bodyData?.textContent);
        // const body2 = Array.from(
        //   document.querySelectorAll(
        //     "#__next > div > main > article > div.crawler.css-1rlknzd.e1of74uw7 > section > div > p"
        //   ) ||
        //     document.querySelectorAll(
        //       "#wsj-article-wrap > div.article-content > div.paywall > p"
        //     )
        // ).map((bodyData) => bodyData?.textContent || undefined);
        const image = Array.from(document.getElementsByTagName("img"))[0];
        const date = Array.from(
          document.getElementsByClassName("css-a8mttu-Timestamp-Timestamp")
        )[0];
        const article = {
          author: author?.textContent || "The Editorial Board",
          title: title?.textContent || "",
          subTitle: subTitle?.textContent,
          body: JSON.stringify(body),
          image: JSON.stringify({
            src: image?.src,
            width: image?.width.toString(),
            height: image?.height.toString(),
          }),
          date:
            date?.textContent ||
            new Date().toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "long",
            }),
        };

        JSON.parse(article.body).pop();

        // if (JSON.parse(article.body)[0] === null) {
        //   JSON.parse(article.body).splice(0, 1);
        // } else if (JSON.parse(article.body)[-1] === null) {
        //   JSON.parse(article.body).pop();
        // } else null;

        return article.title === "" || JSON.parse(article.body).length === 0
          ? undefined
          : article;
      })
      .then(async (data) => {
        {
          data === undefined
            ? console.log("Failed to Save Article because of Missing Data")
            : await prisma.article
                .create({
                  data: data,
                })
                .then(() => {
                  console.log("New Article Saved to Prisma DB");
                })
                .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
  await browser.close();
}

start().catch((err) => console.log(err));
