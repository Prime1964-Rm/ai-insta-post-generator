import cron from "node-cron";
import { run } from "../../index.js";

cron.schedule("0 9 * * *", async () => {
  console.log("Running scheduled job...");
  await run();
});