import * as fs from "fs";

const NAME = "../../data.json";

export function read() {
  try {
    return JSON.parse(fs.readFileSync(NAME, "utf8"));
  } catch (error) {
    return [];
  }
}

export function write(data: object) {
  try {
    fs.writeFileSync(NAME, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}
