if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env' });
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const gridfs = require('multer-gridfs-storage');

//DB Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(success => console.log(`DB is connected`))
    .catch(err => console.error(err));

//File Storage
/* const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads/bookCovers'),
    filename: (req, file, cb) => {
        //cb(null, uuid() + path.extname(file.originalname));
        cb(null, new Date().getTime() + path.extname(file.originalname)); //naming file without uuid module (based on upload time + file extension - IMPORTANT: for apps with multiple connected users at the same time, it is a must to use uuid, otherwise, if 2 users upload the image at the exact same time, files will be overwrited)
    }
}); */

//View engine & Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, 'views/layouts/layout'));
app.use(expressLayouts);

//Middlewares
app.use(express.urlencoded({ extended: false }));
/* app.use(multer({ storage, //name of storage variable
    fileFilter: function (req, file, cb) {

        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true); //null=not accepted; true=accepted
        }
        cb("Error: Formato de imagen no soportado. Formatos soportados: " + filetypes);
    },
    limits: { fileSize: 1000000 },
}).single('cover')); //input name @ books/_form_fields HTML/ejs */

//Files Splitting
const imageMimeTypes = ['image/jpeg','image/jpg','image/png','image/gif']
const splitter = new gridfs ({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
        if (imageMimeTypes.includes(file.mimetype)) {
          return {
            //bucketName: path.join(__dirname, 'public/uploads/bookCovers'),
            filename: Date.now() + path.extname(file.originalname)};
        } else {
            return null;}
}})

app.use(multer({splitter}).single('cover'));

//File Saving
/* const imageMimeTypes = ['image/jpeg','image/jpg','image/png','image/gif']
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads/bookCovers'),
    limits: {
        fields: 0, // 0non-file field
        fileSize: 1000000, // 1mb maximum size
        files: 1, // maximum 1 file
        parts: 1 // files + fields
    },
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))},
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }})

app.use(multer({storage}).single('cover')); */

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'));
app.use('/authors', require('./routes/authors'));
app.use('/books', require('./routes/books'));

//Starting server
app.listen(process.env.PORT || 3000)
