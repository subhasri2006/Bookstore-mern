require("dotenv").config();

const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");

const Book = require("../models/Book");


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    migrateBooks();
})
.catch(err => {
    console.log(err);
});


async function migrateBooks() {

    try {

        const books = await Book.find();

        for (let book of books) {

            let updateData = {};


            // ======================
            // IMAGE MIGRATION
            // ======================

            if (
                book.image &&
                book.image.includes("/uploads/")
            ) {

                const imageName = book.image.split("/uploads/")[1];

                const imagePath = path.join(
                    __dirname,
                    "../uploads",
                    imageName
                );


                if (fs.existsSync(imagePath)) {

                    const result = await cloudinary.uploader.upload(
                        imagePath,
                        {
                            folder: "bookstore/images"
                        }
                    );


                    updateData.image = result.secure_url;

                    console.log(
                        "Image uploaded:",
                        book.title
                    );

                } else {

                    console.log(
                        "Image not found:",
                        imagePath
                    );

                }
            }



            // ======================
            // PDF MIGRATION
            // ======================

            if (
                book.pdfFile &&
                book.pdfFile.includes("/uploads/")
            ) {

                const pdfName = book.pdfFile.split("/uploads/")[1];

                const pdfPath = path.join(
                    __dirname,
                    "../uploads",
                    pdfName
                );


                if (fs.existsSync(pdfPath)) {


                    const result = await cloudinary.uploader.upload(
                        pdfPath,
                        {
                            folder: "bookstore/pdfs",
                            resource_type: "raw"
                        }
                    );


                    updateData.pdfFile = result.secure_url;


                    console.log(
                        "PDF uploaded:",
                        book.title
                    );

                } else {

                    console.log(
                        "PDF not found:",
                        pdfPath
                    );

                }
            }



            // UPDATE DATABASE

            if (Object.keys(updateData).length > 0) {

                await Book.findByIdAndUpdate(
                    book._id,
                    updateData
                );

                console.log(
                    "Updated:",
                    book.title
                );
            }

        }


        console.log("Migration completed 🎉");
        process.exit();


    } catch(error) {

        console.log(error);
        process.exit(1);

    }

}