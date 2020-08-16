const express = require('express');
const app = express();
var multerS3 = require('multer-s3')

const cors = require('cors');
const mongoose = require('mongoose');
const AWS = require('aws-sdk')
const multer = require('multer')
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.BUCKET_REGION
})

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {

            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

app.post('/savememe', upload.array('image', 1), function (req, res, next) {
    console.log(req.body.text, 'textreqa')
    const { body: { userID, text } } = req;
    const newMeme = new Meme({
        userID,
        text: JSON.parse(text),
        image: req.files
    })
    newMeme.save()
        .then((test) => res.json(test))
        .catch((err) => res.status(400).json('errorPOST' + err))
})

const Schema = mongoose.Schema;
const memeSchema = new Schema({
    userID: String,
    text: [],
    image: []
}, { timestamps: true })

const Meme = mongoose.model("memes", memeSchema);

app.get('/displaymeme', function (req, res) {
    Meme.find()
        .then(meme => { return res.json(meme) })
        .catch(err => { console.log(err) })
})

app.post('/deletememes', function (req, res) {
    Meme.remove({})
        .then(user => { return res.json(user) })
        .catch(error => { console.log(error, 'error') })
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});