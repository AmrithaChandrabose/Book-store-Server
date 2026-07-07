const book = require('../models/bookModel')
const Stripe = require('stripe');
const { login } = require('./userController');
const { checkout } = require('../router/userRouter');
const stripeClient = new Stripe(process.env.paymentKey);

//get all Books
exports.getAllBooks = async (req, res) => {
    console.log("Inside allbooks")
    const searchKey = req.query.search || ""
    const query = {
        title: { $regex: searchKey, $options: "i" }
    }
    try {
        const books = await book.find(query)
        res.status(200).json({ message: "All books fetched", books })
    } catch (err) {
        res.status(500).json({ message: "Server not found" + err })
    }
}

// get home books
exports.getHomeBooks = async (req, res) => {
    try {
        const books = await book.find().sort({ _id: -1 }).limit(4)
        res.status(200).json({ message: "All books fetched", books })
    } catch (err) {
        res.status(500).json({ message: "Server not found" })
    }
}

// view a book
exports.viewABook = async (req, res) => {
    const { id } = req.params
    try {
        const books = await book.findById(id)
        res.status(200).json({ message: "A book fetched", books })
    } catch (err) {
        res.status(500).json({ message: "Server not found" })
    }
}

// Add a book by a user
exports.addBook = async (req, res) => {
    console.log("Inside allbooks")


    console.log(req)
    console.log(req.body)
    console.log(req.files)
    console.log(req.payload)

    const { title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body;

    const userMail = req.payload
    var UploadedImages = []
    req.files.map(item => UploadedImages.push(item.filename))

    try {
        const existingBook = await book.findOne({ title });
        if (existingBook) {
            console.log(existingBook)
            return res.status(401).json({ message: "Book already exists" });
        } else {
            const newBook = new book({ title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, UploadedImages, userMail })
            await newBook.save()
            res.status(201).json({ message: "Book added successfully", book });
        }

    } catch (err) {
        res.status(500).json({ message: "Server error" + err });
    }
};

// payment 
exports.bookPayment = async (req, res) => {
    const { bookDetails } = req.body
    const email = req.payload

    console.log(req.body)
    console.log(email)
    try {
        //status to sold and updated
        const updateBook = await book.findByIdAndUpdate(bookDetails._id, { title: bookDetails.title, noofpages: bookDetails.noofpages, imageUrl: bookDetails.imageUrl, price: bookDetails.price, dprice: bookDetails.dprice, abstract: bookDetails.abstract, publisher: bookDetails.publisher, language: bookDetails.language, isbn: bookDetails.isbn, category: bookDetails.category, status: 'sold', userMail: bookDetails.userMail, brought: email }, { new: true })
        console.log(updateBook);

        const line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: bookDetails.title,
                        description: `${bookDetails.author} | ${bookDetails.publisher}`,
                        images: [bookDetails.imageUrl],
                        metadata: {
                            title: bookDetails.title,
                            author: bookDetails.author,
                            noofpages: bookDetails.noofpages,
                            imageUrl: bookDetails.imageUrl,
                            price: bookDetails.price,
                            dprice: bookDetails.dprice,
                            abstract: bookDetails.abstract,
                            publisher: bookDetails.publisher,
                            language: bookDetails.language,
                            isbn: bookDetails.isbn,
                            category: bookDetails.category,
                            uploadedImages: bookDetails.uploadedImages,
                            status: "Sold",
                            userMail: bookDetails.userMail,
                            brought: email,
                        },
                    },
                    unit_amount: Math.round(Number(bookDetails.dprice) * 100),
                },
                quantity: 1,
            },
        ];
        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-error",
            line_items,
            mode: "payment",
        });
        console.log(session)

        res.status(200).json({ url: session.url })

    } catch (err) {
        console.log(err)
    }
}


// approve admin books
exports.approveAdminBooks = async (req, res) => {
    console.log("Inside approve admin ")
    const  bookDetails  = req.body
    const email = req.payload
    console.log(req.body)
    try {
        const updateBook = await book.findByIdAndUpdate(bookDetails._id, {
            title: bookDetails.title,
            author: bookDetails.author,
            noofpages: bookDetails.noofpages,
            imageUrl: bookDetails.imageUrl,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            isbn: bookDetails.isbn,
            category: bookDetails.category,
            uploadedImages: bookDetails.uploadedImages,
            status: "Approved",
            userMail: bookDetails.userMail,
            brought: email,
        },{new:true})
        await updateBook.save()
        res.status(201).json({ message: "updated successfully", updateBook });

    }
    catch (err) {
        res.status(500).json({ message: "Server error" + err });
    }


}

// reject admin books
exports.rejectAdminBooks = async (req, res) => {
    console.log("Inside reject admin ")
    const  bookDetails  = req.body
    const email = req.payload
    console.log(req.body)
    try {
        const updateBook = await book.findByIdAndUpdate(bookDetails._id, {
            title: bookDetails.title,
            author: bookDetails.author,
            noofpages: bookDetails.noofpages,
            imageUrl: bookDetails.imageUrl,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            isbn: bookDetails.isbn,
            category: bookDetails.category,
            uploadedImages: bookDetails.uploadedImages,
            status: "rejected",
            userMail: bookDetails.userMail,
            brought: email,
        },{new:true})
        await updateBook.save()
        res.status(201).json({ message: "updated successfully", updateBook });

    }
    catch (err) {
        res.status(500).json({ message: "Server error" + err });
    }


}
