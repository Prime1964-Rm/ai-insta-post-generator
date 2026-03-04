import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { detectBadges } from "./badges.js";


export async function renderSlides(slides, imageUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 2
  });

  const template = fs.readFileSync(
    path.join("templates", "template2.html"),
    "utf-8"
  );

  for (let i = 0; i < slides.length; i++) {
    let html = template
      .replace(/{{title}}/g, slides[i].title)
      .replace(/{{content}}/g, slides[i].content)
      .replace(/{{bgImage}}/g, imageUrl); // ← inject background

      const badges = detectBadges(slides[i].title + " " + slides[i].content);

      let badgeHtml = badges
          .map(
              b => `<span class="badge" style="background:${b.color}">${b.label}</span>`
          )
          .join(" ");
          html = html.replace(/{{badges}}/g, badgeHtml);

    await page.setContent(html, { waitUntil: "networkidle0" }); // ← wait for image

    await page.screenshot({
      path: `output/slide_${i + 1}.png`,
      type: "png",
      fullPage: true
    });
  }

  await browser.close();
}