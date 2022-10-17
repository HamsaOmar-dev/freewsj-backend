const router = require("express").Router();
const prisma = require("../prisma.js");

let testData = [
  {
    author: "Joe Flint",
    title:
      "Rupert Murdoch Media Deal Would Elevate Son, Bet on Wisdom of Scale",
    subTitle:
      "Fox and News Corp are considering a proposal that they reunite though hurdles to a deal remain",
    body: [
      "Nearly a decade ago, Rupert Murdoch decided it was a sound strategy to split his media empire in two. Now, he wants to put it back together. ",
      "People familiar with Mr. Murdoch’s proposal to reunite Wall Street Journal parent News Corp NWSA -2.13%▼ and Fox News parent Fox Corp. FOX -0.75%▼ point to a number of differences—within the companies, the industry and the Murdoch family—between now and when they were split in 2013. ",
      "Both companies could benefit from being bigger, they say. Fox is a slimmer company after selling off major entertainment assets to Walt Disney Co. years ago. News Corp has struggled to lift its stock price, despite making strides in its publishing and digital real-estate units. ",
      "The combined company would have more balance sheet strength to pursue acquisitions, people close to the proposed deal said. Some of them said the companies would be on stronger footing to compete for digital-ad dollars, using the scale of their combined properties. Those people also said the companies could join forces in sports-betting, a growing sector where each side has interests.",
      "Mr. Murdoch’s succession planning is also at a different point than several years ago, when both his sons had major roles at the companies. Now, his younger son, James Murdoch, is no longer involved in operations. Lachlan Murdoch, who is co-chairman of News Corp and executive chairman and chief executive of Fox, would likely see a significant expansion of his responsibilities in a merger, people familiar with the situation said. Robert Thomson, the News Corp CEO, who has had a good working relationship with Lachlan Murdoch, could retain a large role, they said.",
      "There are several hurdles to completing a deal. Special board committees at each company were recently created to study the proposed transaction. They would have to agree on financial terms, such as the relative value of one company to the other in a stock deal. A majority of the non-Murdoch-family shareholders also would have to approve a deal.",
      "Mr. Murdoch’s family’s trust has major voting stakes in each company—about 39% in News Corp and 42% in Fox Corp. The 91-year-old media baron now effectively controls the trust, but when he dies his four adult children, who each have votes, will have substantial say in the companies’ future. There could be significant takeover interest in his media properties, deal makers in the industry say. A bigger company could make any unwanted takeover attempts more challenging.",
      "Some media executives, including people close to Fox and News Corp, said they don’t see major strategic benefits of merging the two companies and were perplexed at the move for such a deal now. ",
      "Some of the people see potential risks in mashing together the vastly different journalistic brands of Fox News and News Corp, whose Dow Jones unit publishes the Journal. Others close to the deal say the companies were together once before and can navigate a reunion.",
      "Fox News would bring its robust business to the mix, but also legal risks for the combined company. It is facing defamation lawsuits by voting-machine companies—a $2.7 billion claim from Smartmatic USA Corp. and a $1.6 billion suit from Dominion Voting Systems—stemming from remarks Fox News anchors and guests made alleging widespread election fraud in the 2020 presidential election. Fox has denied wrongdoing, defending itself on First Amendment grounds, and said it was covering newsworthy matters.",
      "When News Corp split up in 2013, with publishing assets being cleaved from Fox News and entertainment assets, executives at the companies said each side would benefit from an increased focus on its business. Backers of a deal now are making a different case.",
      "One area of potential cooperation between Fox and News Corp is sports betting, which many media companies are eager to tap into. Fox has a partnership with Flutter Entertainment PLC’s Stars Group on Fox Bet, an online and mobile betting platform. ",
      "News Corp earlier this year entered into a partnership with the Las Vegas digital sports-gambling investment firm Tekkorp Capital for an online gambling platform in Australia.",
      "The combined assets of News Corp and Fox could present a stronger offering to advertisers in a marketplace increasingly dominated by large tech players, according to people familiar with the matter. ",
      "News Corp and its subsidiaries have been at the forefront of striking content deals with large tech platforms, including Alphabet Inc.’s Google, Apple Inc. and Meta Platforms Inc., formerly known as Facebook. The additional leverage from Fox’s sports and news assets could help with future negotiations, though some of these programs, such as the Facebook News tab, seem unlikely to continue at current levels in the face of growing regulatory pressure around the globe.",
    ],
    image: {
      src: "https://images.wsj.net/im-645171?width=860&height=573",
      width: "620",
      height: "413",
    },
    date: "Oct. 16, 2022 6:30 pm ET",
  },
];

router.get("/articles", async (req, res) => {
  // await prisma.article
  //   .findMany()
  //   .then((articles) => {
  //     res.json(articles);
  //     console.log("Articles List sent from DB");
  //   })
  //   .catch((err) => console.log(err));
  res.json(testData);
});

router.get("/articles/:articleTitle", async (req, res) => {
  const articleTitle = req.params.articleTitle;

  // await prisma.article
  //   .findUnique({
  //     where: {
  //       title: articleTitle,
  //     },
  //   })
  //   .then((article) => {
  //     res.json(article);
  //     console.log("Article sent from DB");
  //   })
  //   .catch((err) => console.log(err));
  res.json(testData[0]);
});

module.exports = router;
