const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    
    const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed!'), false);
    }
};


const limits = {
    fileSize: 2 * 1024 * 1024 
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
}).single('resumeFile');


app.get('/', (req, res) => {
    res.render('form', { message: null });
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
       
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).render('form', { message: { type: 'error', text: 'File is too large! Maximum size is 2MB.' } });
            }
        } 

        else if (err) {
            return res.status(400).render('form', { message: { type: 'error', text: err.message } });
        }
        
        else if (!req.file) {
            return res.status(400).render('form', { message: { type: 'error', text: 'Please select a file to upload.' } });
        }

        res.render('success', { fileName: req.file.filename });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
