const fs = require("fs");

const capitalize = (string) => {
  return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

const getTPTags = (gender, size) => {
  let tags = "";
  if (gender === "Niño") {
    tags += "Boy,";
  } else {
    tags += "Girl,";
  }

  tags += "Baby,Mini,Teen,Summer 2021, Tutto Piccolo";

  return tags;
};

const getTPSize = (size) => {
  switch (size) {
    case "Peq":
      return "Small";
    case "Med":
      return "Medium";
    case "Gra":
      return "Large";
    case "12.A":
      return "12 years";
    case "10.A":
      return "10 years";
    case "8.A":
      return "8 years";
    case "6.A":
      return "6 years";
    case "5.A":
      return "5 years";
    case "4.A":
      return "4 years";
    case "12.M":
      return "12 months";
    case "18.M":
      return "18 months";
    case "24.M":
      return "24 months";
    case "36.M":
      return "36 months";
    default:
      return "";
  }
};

const getTPVariants = (size) => {
  let variants = [];

  if (size[0].includes("years") || size[0].includes("months")) {
    variants = [
      {
        size: "12 months",
        quantity: size.find((el) => el === "12 months") ? 1 : 0,
      },
      {
        size: "18 months",
        quantity: size.find((el) => el === "18 months") ? 1 : 0,
      },
      {
        size: "24 months",
        quantity: size.find((el) => el === "24 months") ? 1 : 0,
      },
      {
        size: "36 months",
        quantity: size.find((el) => el === "36 months") ? 1 : 0,
      },
      {
        size: "4 years",
        quantity: size.find((el) => el === "4 years") ? 1 : 0,
      },
      {
        size: "5 years",
        quantity: size.find((el) => el === "5 years") ? 1 : 0,
      },
      {
        size: "6 years",
        quantity: size.find((el) => el === "6 years") ? 1 : 0,
      },
      {
        size: "8 years",
        quantity: size.find((el) => el === "8 years") ? 1 : 0,
      },
      {
        size: "10 years",
        quantity: size.find((el) => el === "10 years") ? 1 : 0,
      },
      {
        size: "12 years",
        quantity: size.find((el) => el === "12 years") ? 1 : 0,
      },
    ];
  } else {
    variants = [
      {
        size: "Small",
        quantity: size.find((el) => el === "Small") ? 1 : 0,
      },
      {
        size: "Medium",
        quantity: size.find((el) => el === "Medium") ? 1 : 0,
      },
      {
        size: "Large",
        quantity: size.find((el) => el === "Large") ? 1 : 0,
      },
    ];
  }
  return variants;
};

// SimonsCode is for sorting
const writeToShopifyCsv = async (products) => {
  console.log("📝  Writing to csv broski");
  const head =
    "Handle,SimonsCode,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item\n";

  fs.appendFile("out.csv", head, (err) => {
    if (err) throw err;
  });

  products.map((product) => {
    const {
      handle,
      title,
      description,
      vendor,
      type,
      tags,
      size,
      price,
      images,
    } = product;

    const variants = getTPVariants(size);

    const firstImg = images.length ? images[0] : "";

    const data = `"${handle}","${handle}-0-0","${title}","${description}","${vendor}","${type}","${tags}",FALSE,Size,"${variants[0].size}",,,shopify,"${variants[0].quantity}",deny,manual,"${price}",,TRUE,FALSE,,"${firstImg}",,,,,,,,,,,,,,,,,,,,,,,\n`;

    fs.appendFile("out.csv", data, (err) => {
      if (err) throw err;
    });

    if (images.length) {
      images.map((image, index) => {
        if (index > 0) {
          const data = `"${handle}","${handle}-0-${index}","${title}",,,,,,,,,,,,,,,,,,,"${image}",,,,,,,,,,,,,,,,,,,,,\n`;
          fs.appendFile("out.csv", data, (err) => {
            if (err) throw err;
          });
        }
      });
    }

    if (variants.length) {
      variants.map((variant, index) => {
        if (index > 0) {
          const data = `"${handle}","${handle}-${index}-0","${title}","${description}","${vendor}","${type}","${tags}",FALSE,Size,"${variant.size}",,,shopify,"${variant.quantity}",deny,manual,"${price}",,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,,,\n`;
          fs.appendFile("out.csv", data, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
};

module.exports = {
  capitalize,
  writeToShopifyCsv,
  getTPTags,
  getTPSize,
};
