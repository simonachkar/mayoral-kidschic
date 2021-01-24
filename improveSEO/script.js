const fs = require("fs");
const csv = require("csv-parser");
const { csvWriter } = require("./csvWriter");
const {
  FLOWER_GIRL,
  DRESSY_SHOES,
  CHURCH_DRESSES,
  NURSING_BAGS,
  BOY_SUITS,
  BABY_SHOWER,
  IN_GENERAL,
} = require("./seo-descriptions");

// Read CSV file
const readCSV = (path) => {
  const results = [];
  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log(`Done reading ${path}`);
          resolve(results);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Change description according to the tag
const getBoostedDescription = (row) => {
  const tags = row["Tags"];
  const title = row["Title"].toLowerCase();
  let description = row["Body (HTML)"];

  if (title.includes("bag")) {
    description += NURSING_BAGS;
  }

  if (title.includes("shoe")) {
    description += DRESSY_SHOES;
  }

  if (tags.includes("Girl") && tags.includes("Dress")) {
    // Flower girl, Dressy Shoes
    description += FLOWER_GIRL;
  } else if (tags.includes("Babycare")) {
    // Baby Shower Gift
    description += BABY_SHOWER;
  } else if (tags.includes("Boy")) {
    // Boys Suites
    description += BOY_SUITS + IN_GENERAL;
  } else if (tags.includes("Girl")) {
    // First Communion / Baptism / Christening Dresses
    description += CHURCH_DRESSES + IN_GENERAL;
  } else if (tags) {
    // this is to avoid empty rows
    description += IN_GENERAL;
  }

  return description;
};

// Write to a new CSV

const main = async () => {
  const results = await readCSV("./improveSEO/data.csv");

  results.forEach((row) => {
    const newDescription = getBoostedDescription(row);
    if (newDescription) {
      row["Body (HTML)"] = newDescription;
    }
  });

  csvWriter
    .writeRecords(results)
    .then(() => console.log("The CSV file was written successfully"));
};

main();
