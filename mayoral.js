console.log("🔥  Script is running for 👕  Mayoral 👕");

const fs = require("fs");
const csv = require("csv-parser");
const slugify = require("slugify");
const {
  capitalize,
  fixMayoralPrice,
  getMayoralTitle,
  writeToShopifyCsv,
} = require("./helpers");

let urlsArr = fs.readFileSync("urls.txt").toString().split("\n");
const results = [];
const products = [];

fs.createReadStream("mayoral.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let prevHandle = "";

    results.map(async (product) => {
      try {
        let images = [];

        const attributes = {
          styleCode: product["Style code"].trim(),
          description: capitalize(
            product["Style description"].trim().toLowerCase()
          ),
          size: product["Size"].trim(),
          color: capitalize(product["Color name"].trim().toLowerCase()),
          colorCode: product["Color code"].trim(),
          price: fixMayoralPrice(product["Cost Price"]),
          tags: product["Collection"].trim().replace(/[ ,]+/g, ","),
          type: capitalize(product["Type"].trim()),
        };

        const title = getMayoralTitle(
          attributes.description,
          attributes.tags,
          attributes.color
        );
        const handle = slugify(
          `${attributes.description} ${attributes.styleCode} ${attributes.color}`
        );
        const description = `<p>${title}</p><p>Mayoral #: ${attributes.styleCode}</p>`;
        const vendor = "Mayoral";
        const size = attributes.size;

        // Add the images url only if it's the first handle
        if (handle !== prevHandle) {
          for (i in urlsArr) {
            if (
              urlsArr[i].includes(
                `-${attributes.styleCode}-${attributes.colorCode}-`
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
            type: attributes.type,
            tags: attributes.tags,
            size: [size],
            price: attributes.price,
            images,
          });
          prevHandle = handle;
        } else {
          products[products.length - 1].size.push(size);
        }
      } catch (err) {
        console.error(err);
      }
    });

    // Adding "Teen" tag
    products.map((p) => {
      if (p.title.includes("Teen")) {
        p.tags += ",Teen,Summer 2021";
      } else p.tags += ",Summer 2021";
    });

    writeToShopifyCsv(products);

    console.log("Done! ✅");
    console.log(`${products.length} products in total!`);
  });
