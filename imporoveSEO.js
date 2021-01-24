console.log("Imporving the euS eeE Ohh mazarfakarz!!!");

const fs = require("fs");
const csv = require("csv-parser");
const results = [];
const cleanData = [];

// read
const head =
  "Handle,Title,CodeColorSize,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item\n";

fs.appendFile("out.csv", head, (err) => {
  if (err) throw err;
});

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let prevHandle = "";

    results.map(async (product) => {
      try {
        if (product.Tags.includes("Girl") && product.Tags.includes("Dress")) {
          console.log(product.Tags);
        }

        const data = `${handle},${description} - ${color},${code}-${color}-${size},Mayoral item # ${code},Mayoral,,"${tags}",FALSE,Size,${size},${barcode},,shopify,0,deny,manual,${price},,TRUE,FALSE,,${firstImg},,,,,,,,,,,,,,,,,,,,,,,\n`;
        fs.appendFile("out.csv", data, (err) => {
          if (err) throw err;
        });
      } catch (e) {
        return;
      }
    });

    // console.log(products);
  });
