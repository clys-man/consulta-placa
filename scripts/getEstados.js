import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import { resolve } from "path";

const URL =
  "https://pt.wikipedia.org/wiki/Placas_de_identifica%C3%A7%C3%A3o_de_ve%C3%ADculos_no_Brasil";
const FILE = resolve("./data.json");

const getStates = () => {
  const data = fs.readFileSync(FILE.toString());
  const { states } = JSON.parse(data);

  return states;
};

const getData = async () => {
  const rangeByState = [];
  let statesWithRange = {};
  const states = getStates();

  const html = await axios.get(URL);
  const $ = cheerio.load(html.data);
  const tables = $("table.wikitable").find("tbody");

  tables[2].children.forEach((element) => {
    const rows = $(element);

    rows.each((index, row) => {
      const col = $(row).find("td");

      const range = $(col[0]).text()
        .replace(/( a | e | - | )/g, "-")
        .replace("\n", "");
      let state = $(col[1]).text().replace("\n", "");

      if (state !== "" && state !== "") {
        states.forEach((element) => {
          if (element.nome === state) {
            state = element.sigla;
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
    rows.each((index, row) => {
      const col = $(row).find("td");
      col.each((index, col) => {
        let text = $(col).text().replace("\n", "");

        if (index === 0) {
          states.forEach((element) => {
            if (element.nome === text) {
              text = element.sigla;
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

  // sort statesWithRange by state name
  const ordered = {};
  Object.keys(statesWithRange).sort().forEach((key) => {
    ordered[key] = statesWithRange[key];
  });

  statesWithRange = ordered;

  return { rangeByState, statesWithRange };
};

const main = async () => {
  const { rangeByState, statesWithRange } = await getData();
  const data = fs.readFileSync(FILE.toString());
  const json = JSON.parse(data);

  json.rangeByState = rangeByState;
  json.statesWithRange = statesWithRange;

  fs.writeFile(FILE.toString(), JSON.stringify(json), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

main();
