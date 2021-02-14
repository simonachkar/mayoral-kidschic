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

const getVariants = (vendor, size, tags) => {
  if (vendor === "Tutto Piccolo") return getTPVariants(size);
  else return getMayoralVariants(size, tags);
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

const getMayoralVariants = (size, tags) => {
  let variants = [];

  if (tags.includes("Layette")) {
    variants = [
      {
        size: "0-1 month",
        quantity: 0,
      },
      {
        size: "1-2 months",
        quantity: 0,
      },
      {
        size: "2-4 months",
        quantity: 0,
      },
      {
        size: "4-6 months",
        quantity: 0,
      },
      {
        size: "6-9 months",
        quantity: 0,
      },
      {
        size: "12 months",
        quantity: 0,
      },
      {
        size: "18 months",
        quantity: 0,
      },
    ];
  } else if (tags.includes("Baby")) {
    variants = [
      {
        size: "6 months",
        quantity: 0,
      },
      {
        size: "9 months",
        quantity: 0,
      },
      {
        size: "12 months",
        quantity: 0,
      },
      {
        size: "24 months",
        quantity: 0,
      },
      {
        size: "36 months",
        quantity: 0,
      },
    ];
  } else {
    size.map((s) => {
      variants.push({
        size: s,
        quantity: 0,
      });
    });
  }
  return variants;
};

const fixMayoralPrice = (price) => {
  let newPrice;
  newPrice = Math.round((price / 100) * 2 + 2.99);
  const priceMod = newPrice % 10;
  if (priceMod === 4 || priceMod === 2 || priceMod === 7 || priceMod === 9) {
    return newPrice + 0.99;
  } else return newPrice + 1.99;
};

const getMayoralTitle = (description, tags, color) => {
  let title = description;

  if (tags.includes("Mini")) {
    if (tags.includes("Girl")) title += " for Girl";
    if (tags.includes("Boy")) title += " for Boy";
  } else if (tags.includes("Baby")) {
    if (tags.includes("Girl")) title += " for Baby Girl";
    if (tags.includes("Boy")) title += " for Baby Boy";
  } else if (tags.includes("Layette")) {
    if (tags.includes("Girl")) title += " for Newborn Girl";
    if (tags.includes("Boy")) title += " for Newborn Boy";
  } else {
    if (tags.includes("Girl")) title += " for Teen Girl";
    if (tags.includes("Boy")) title += " for Teen Boy";
  }

  title += ` ${color}`;

  return title;
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

    const variants = getVariants(vendor, size, tags);

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
  fixMayoralPrice,
  getMayoralTitle,
};
