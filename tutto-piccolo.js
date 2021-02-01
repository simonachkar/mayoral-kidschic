console.log("🔥  Script is running for 👕  Tutto Piccolo 👕");

const fs = require("fs");
const csv = require("csv-parser");
const slugify = require("slugify");
const {
  capitalize,
  getTPTags,
  getTPSize,
  writeToShopifyCsv,
} = require("./helpers");

let urlsArr = fs.readFileSync("urls.txt").toString().split("\n");
const results = [];
const products = [];

fs.createReadStream("tutto-piccolo.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let prevHandle = "";

    results.map(async (product) => {
      try {
        let images = [];

        const attributes = {
          style: product["Style"].trim(),
          description: capitalize(product["Description"].trim().toLowerCase()),
          collection: product["Col Code"].trim(),
          composition: capitalize(product["Composition"].trim().toLowerCase()),
          colour: capitalize(product["Colour"].trim().toLowerCase()),
          story: capitalize(product["Story"].trim().toLowerCase()),
          gender: product["Gender"].trim(),
          directions: {
            washing: product["Whasing"].trim(),
            bleach: product["Bleach"].trim(),
            drying: product["Drying"].trim(),
            ironing: product["Ironing"].trim(),
            drycleaning: product["Dry Cleaning"].trim(),
          },
          size: product["Size"].trim(),
        };

        const title = `${attributes.story} ${attributes.description} ${attributes.colour}`;
        const handle = slugify(`${title} ${attributes.style}`, "-");
        const description = `<p>${title}</p><p>${attributes.composition}</p><p>Tutto Piccolo #: ${attributes.style}</p><p><b>Directions:</b></p><ul><li>${attributes.directions.washing}</li><li>${attributes.directions.bleach}</li><li>${attributes.directions.drying}</li><li>${attributes.directions.ironing}</li><li>${attributes.directions.drycleaning}</li></ul>`;
        const vendor = "Tutto Piccolo";
        const type = attributes.description;
        const tags = getTPTags(attributes.gender, attributes.size);
        const size = getTPSize(attributes.size);
        const price = "";

        // Add the images url only if it's the first handle
        if (attributes.style !== prevHandle) {
          for (i in urlsArr) {
            if (
              urlsArr[i].includes(
                `${attributes.style}_${attributes.collection}`
              )
            ) {
              images.push(urlsArr[i]);
            }
          }
          products.push({
            handle,
            title,
            description,
            vendor,
            type,
            tags,
            size: [size],
            price,
            images,
          });
          prevHandle = attributes.style;
        } else {
          products[products.length - 1].size.push(size);
        }
      } catch (err) {
        console.error(err);
      }
    });

    writeToShopifyCsv(products);
    console.log("Done! ✅");
    console.log(`${products.length} products in total!`);
  });
