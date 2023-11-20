import axios from "axios";
import cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

interface State {
  name: string;
  abbreviation: string;
}

interface Data {
  range: string;
  state: string;
}

interface StatesWithRange {
  [key: string]: { ranges: string[] };
}

const URL =
  "https://pt.wikipedia.org/wiki/Placas_de_identifica%C3%A7%C3%A3o_de_ve%C3%ADculos_no_Brasil";
const FILE = path.join(path.resolve(), "./data.json");

const getStates = (): State[] => {
  const data = fs.readFileSync(FILE, "utf-8");
  const { states } = JSON.parse(data);

  return states;
};

const getData = async () => {
  const rangeByState: Data[] = [];
  let statesWithRange: StatesWithRange = {};
  const states = getStates();

  const html = await axios.get(URL);
  const $ = cheerio.load(html.data);
  const tables = $("table.wikitable").find("tbody");

  tables[2].children.forEach((element) => {
    const rows = $(element);

    rows.each((_, row) => {
      const col = $(row).find("td");

      const range = $(col[0]).text()
        .replace(/( a | e | - | )/g, "-")
        .replace("\n", "");
      let state = $(col[1]).text().replace("\n", "");

      if (state !== "" && state !== "") {
        states.forEach((element) => {
          if (element.name === state) {
            state = element.abbreviation;
          }
        });

        const data = { range, state };
        rangeByState.push(data);
      }
    });
  });

  tables[3].children.forEach((element) => {
    const rows = $(element);

    let state = "";
    rows.each((_, row) => {
      const col = $(row).find("td");
      col.each((index, col) => {
        let text = $(col).text().replace("\n", "");

        if (index === 0) {
          states.forEach((element) => {
            if (element.name === text) {
              text = element.abbreviation;
            }
          });

          state = text;
          statesWithRange[state] = { "ranges": [] };
        } else if (text !== "" && text !== "—") {
          const range = text.replace(" — ", "-").replace(" ", "");

          statesWithRange[state].ranges.push(range);
        }
      });
    });
  });

  const ordered: StatesWithRange = {};
  Object.keys(statesWithRange).sort().forEach((key) => {
    ordered[key] = statesWithRange[key];
  });

  statesWithRange = ordered;

  return { rangeByState, statesWithRange };
};

const main = async () => {
  const { rangeByState, statesWithRange } = await getData();
  const data = fs.readFileSync(FILE, "utf-8");
  const json = JSON.parse(data);

  json.rangeByState = rangeByState;
  json.statesWithRange = statesWithRange;

  fs.writeFile(FILE, JSON.stringify(json), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

main();
