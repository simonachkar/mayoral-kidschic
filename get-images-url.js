console.log("Getting images URLs from Cloudinary... Yalla di2a...");

const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getImgs = (nextC) => {
  cloudinary.api.resources(
    { type: "upload", max_results: 500, next_cursor: nextC },
    (error, result) => {
      if (error) throw error;
      else {
        result.resources.map((d) => {
          fs.appendFile("urls.txt", d.secure_url + "\n", (err) => {
            if (err) throw err;
          });
        });
        if (result.next_cursor) {
          getImgs(result.next_cursor);
        }
      }
    }
  );
};

getImgs();
