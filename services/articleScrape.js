const prisma = require("../prisma.js");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const axios = require("axios");

async function scrapeWSJ() {
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
  let startTime = new Date().getTime();

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

    return link.slice(0, 2);
  });

  links.reverse();

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
        const topic = Array.from(
          document.getElementsByClassName("css-12fqrno-Link-Link")
        )[0];
        const body = Array.from(
          document.getElementsByClassName("css-xbvutc-Paragraph")
        ).map((bodyData) => bodyData?.textContent);
        const image = Array.from(document.getElementsByTagName("img"))[0];
        const date = Array.from(
          document.getElementsByClassName("css-a8mttu-Timestamp-Timestamp")
        )[0];

        body.pop();

        const article = {
          author: author?.textContent || "The Editorial Board",
          title: title?.textContent || "",
          subTitle: subTitle?.textContent,
          topic: topic?.textContent,
          body: JSON.stringify(body),
          image: JSON.stringify({
            src: image?.src,
            width: image?.width.toString(),
            height: image?.height.toString(),
          }),
          views: 0,
          date:
            date?.textContent ||
            new Date().toLocaleString([], {
              timeZone: "America/New_York",
              dateStyle: "medium",
              timeStyle: "long",
            }),
        };

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
                .then(async () => {
                  console.log("New Article Saved to Prisma DB");

                  await prisma.article
                    .findMany()
                    .then(async (articles) => {
                      if (articles.length > 100) {
                        await prisma.article
                          .delete({
                            where: { title: articles[-1].title },
                          })
                          .then(() => console.log("Deleted Oldest Article"))
                          .catch((err) => console.log(err));
                      } else null;
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
  await browser.close();
  await axios
    .get(
      "https://api.vercel.com/v1/integrations/deploy/prj_AUZzHmtBiiXoGnGo5UvVAoEzL1Kz/EM5nKmAFJ7?buildCache=false"
    )
    .then(() => console.log("Sent ReDeploy Request to Vercel"))
    .catch((err) => console.log(err));

  const totalTime = (new Date().getTime() - startTime) / 1000 + " seconds";

  console.log("Finised Scraping Articles in " + totalTime);
}

scrapeWSJ();

const job = cron.schedule("* */2 * * *", scrapeWSJ);
