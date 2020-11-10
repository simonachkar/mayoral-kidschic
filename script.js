console.log("Script is running mazarfakarz!!!");

const fs = require("fs");
const csv = require("csv-parser");
const slugify = require("slugify");

let urlsArr = fs.readFileSync("urls.txt").toString().split("\n");
const results = [];
const products = [];

const writeToCsv = (products) => {
  const head =
    "Handle,Title,CodeColorSize,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item\n";
  fs.appendFile("out.csv", head, (err) => {
    if (err) throw err;
  });

  products.map((product) => {
    const {
      handle,
      description,
      size,
      color,
      price,
      tags,
      code,
      barcode,
    } = product;

    const firstImg = product.images ? product.images[0] : "";

    const data = `${handle},${description} - ${color},${code}-${color}-${size},Mayoral item # ${code},Mayoral,,"${tags}",FALSE,Size,${size},${barcode},,shopify,0,deny,manual,${price},,TRUE,FALSE,,${firstImg},,,,,,,,,,,,,,,,,,,,,,,\n`;
    fs.appendFile("out.csv", data, (err) => {
      if (err) throw err;
    });
    if (product.images) {
      product.images.map((image, index) => {
        if (index > 0) {
          const data = `${handle},,,,,,,,,,,,,,,,,,,,,${image},,,,,,,,,,,,,,,,,,,,,\n`;
          fs.appendFile("out.csv", data, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
};

const fixPrice = (price) => {
  let newPrice;
  newPrice = Math.round((price / 100) * 2 + 2.99);
  const priceMod = newPrice % 10;
  if (priceMod === 4 || priceMod === 2 || priceMod === 7 || priceMod === 9) {
    return newPrice + 0.99;
  } else return newPrice + 1.99;
};

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const main = (collection) => {
  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      let prevHandle = "";

      results.map(async (product) => {
        try {
          const id = product["Style Code"].replace(/"/g, "");
          const barcode = product["Barcode"].replace(/"/g, "");
          let name = product["Style description"].replace(/"/g, "");
          const size = product["Size"].replace(/"/g, "");
          const color = product["Color name"].replace(/"/g, "");
          const colorCode = product["Color code"].replace(/"/g, "");
          const price = fixPrice(product["Cost Price"].replace(/"/g, ""));
          const sizeKey = product["Size key "].replace(/"/g, "");
          const family = product["Family"].replace(/"/g, "");
          let tags =
            capitalize(name.split(" ")[name.split(" ").length - 1]) +
            `,${collection}`;

          let description = name.replace(/"/g, "");

          switch (family[0]) {
            case "1":
              tags += ",Babycare,Layette,Baby,Boy";
              description += " for newborn boy";
              break;
            case "2":
              tags += ",Babycare,Layette,Baby,Girl";
              description += " for newborn girl";
              break;
            case "3":
              tags += ",Baby,Boy";
              description += " for baby boy";
              break;
            case "4":
              tags += ",Baby,Girl";
              description += " for baby girl";
              break;
            case "5":
              tags += ",Mini,Boy";
              description += " for boy";
              break;
            case "6":
              tags += ",Mini,Girl";
              description += " for girl";
              break;
            case "7":
              tags += ",Teen,Boy";
              description += " for teen boy";
              break;
            case "8":
              tags += ",Teen,Girl";
              description += " for teen girl";
              break;
            default:
              tags += ",Babycare";
              break;
          }

          let code;

          switch (id.length) {
            case 2:
              code = "000" + id;
              break;
            case 3:
              code = "00" + id;
              break;
            case 4:
              code = "0" + id;
              break;
            default:
              code = id;
              break;
          }
          let images = [];
          const handle = slugify(`${name} ${code} ${color}`, "-")
            .toLowerCase()
            .replace(/"/g, "");

          if (handle !== prevHandle) {
            for (i in urlsArr) {
              if (urlsArr[i].includes(`-${code}-0${colorCode}-`)) {
                images.push(urlsArr[i]);
              }
            }

            products.push({
              handle,
              description,
              size,
              color,
              price,
              tags,
              code,
              barcode,
              images,
            });

            // console.log("--------");
            // console.log(handle, size);
            // console.log(images);
            prevHandle = handle;
          } else {
            // console.log(handle, size);
            products.push({
              handle,
              description,
              size,
              color,
              price,
              tags,
              code,
              barcode,
            });
          }
        } catch (e) {
          return;
        }
      });

      // console.log(products);

      writeToCsv(products);
    });
};

main("Winter 2020/2021");
