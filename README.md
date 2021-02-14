
# Mayoral Kids Chic Script

<p align="center">
    <img alt="logo" src="https://cdn.shopify.com/s/files/1/0297/6772/9245/files/mayoral-baby-chic_360x.png?v=158932103" width="220" />
</p>


Script to export Mayoral products and fetch images from Cloudinary and prepare Shopify csv file.

## Steps

### Download Products csv file 
- Go to the Mayoral Admin Panel
- Get the csv file for the order wanted
- Place the file at the root of this project and call it `data.csv`
- Make sure the seperators are `,` and the header of the csv file is set properly
- Remove every odd charachter (e.g. `"`)
- The file should look something like this
```
Style code,Color code,Size,Family,Subfamily,Color name,Style description,Cost Price Barcode,Size key 
00030,025,6,3C,,Dark,Basic regular fit trousers,01530,8445054297297,60
00030,025,9,3C,,Dark,Basic regular fit trousers,01530,8445054297303,60
00030,025,12,3C,,Dark,Basic regular fit trousers,01530,8445054297310,60
00030,025,18,3C,,Dark,Basic regular fit trousers,01530,8445054297327,60
```

### Upload Images to Cloudinary
- Get all images from the Mayoral Admin Panel
- Upload all images to Cloudinary 
- Get the API credentials from Cloudinary

### Run `npm i` 
Of course...

### Run `npm run get-urls` 
**Before doing that make sure to add the corresponding values in a new file called `config.sh`**

This will get all urls and save them into a text file

### Run `npm run start`
This will run the script and create a file `out.csv` that is suitable for Shopify product import

### Manually add quantities
As for now, this step can't be automated, you need to get the quantity manually from Mayoral.

A good way that works is to use `CodeColorSize` column and sort it by `CodeColorSize` this will put the same products next to each others.

