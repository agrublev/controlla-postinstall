import test from "ava";
import { pkgPath } from "./_helpers";
import { exec } from "child_process";
import fetchMock from "fetch-mock";
import { promisify } from "util";
import { init } from "../src/init";
import fetch from "node-fetch";
import pkgJsonFull from "./fixtures/package-full/package";
import { retrieveCols } from "../src/utils/print";

const logo = "You are beautiful!";
const stats = {
  slug: "nuxtjs",
  currency: "USD",
  image:
    "https://opencontrolla-production.s3-us-west-1.amazonaws.com/251e1a10-369b-11e7-8ad6-5967d7493bb7.png",
  balance: 435949,
  yearlyIncome: 2528815,
  backersCount: 110,
  contributorsCount: 129
};

test.before(t => {
  // Assign as the assignment in init happens after mocking
  global.fetch = fetch;
  fetchMock.mock("https://opencontrolla.com/fake.json", stats);
  fetchMock.mock(
    "https://opencontrolla.com/fake/logo.txt?reverse=true&variant=variant2",
    {
      body: logo,
      headers: { "content-type": "text/plain" }
    }
  );
});

test.beforeEach(t => {
  fetchMock.resetHistory();
});

test.serial("it prints everything", async t => {
  // const formatInCurrency = formatMoney(stats.currency)

  const pkgControlla = pkgJsonFull.controlla;
  const url = pkgControlla.url + "/" + pkgControlla.donation.amount;

  const cols = retrieveCols();
  const printedSpaces = " ".repeat(cols / 2);

  let log = "";
  process.stdout.write = (write =>
    function(string, encoding, fileDescriptor) {
      log += string;
      write.apply(process.stdout, arguments);
    })(process.stdout.write);

  await init(pkgPath, false);

  const content = [
    printedSpaces,
    "Thanks for installing package-with-postinstall 🙏",
    "Please consider donating to our open controlla",
    "to help us maintain this package.",
    pkgControlla.donation.text,
    url
  ];

  content.forEach(c => t.true(log.includes(c)));
});

test.serial("it prints nothing when hide is true", async t => {
  let log = "";
  process.stdout.write = (write =>
    function(string, encoding, fileDescriptor) {
      log += string;
      write.apply(process.stdout, arguments);
    })(process.stdout.write);

  await init(pkgPath, true);

  t.false(fetchMock.called());
  t.is(log.trim(), "");
});

test.serial("yarn postinstall script works as expected", async t => {
  const { stdout: rawStdout } = await promisify(exec)("yarn postinstall", {
    cwd: pkgPath
  });
  const stdout = rawStdout.toString("utf8");

  const content = [
    "Thanks for installing package-with-postinstall",
    "Please consider donating to our open controlla",
    "to help us maintain this package."
  ];

  content.forEach(c => t.true(stdout.includes(c)));
});
