const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb) {
        const appName = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        
        // Get existing versions
        const files = fs.readdirSync('uploads');
        const versions = files
            .filter(f => f.startsWith(appName + '_v'))
            .map(f => parseInt(f.match(/_v(\d+)/)[1]));
        
        const nextVersion = versions.length > 0 ? Math.max(...versions) + 1 : 1;
        cb(null, `${appName}_v${nextVersion}${ext}`);
    }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    const files = fs.readdirSync('uploads');
    const apps = {};
    
    files.forEach(file => {
        const match = file.match(/(.+)_v(\d+)/);
        if (match) {
            const [, name, version] = match;
            if (!apps[name]) {
                apps[name] = [];
            }
            apps[name].push({
                version: parseInt(version),
                filename: file
            });
        }
    });

    res.render('index', { apps });
});

app.get('/app/:name', (req, res) => {
    const appName = req.params.name;
    const files = fs.readdirSync('uploads')
        .filter(f => f.startsWith(appName + '_v'))
        .map(f => ({
            filename: f,
            version: parseInt(f.match(/_v(\d+)/)[1])
        }))
        .sort((a, b) => b.version - a.version);

    res.render('app', { appName, versions: files });
});

app.post('/upload', (req, res, next) => {
    if (req.query.password !== '13579') {
        return res.status(403).send('Incorrect password');
    }
    next();
}, upload.single('file'), (req, res) => {
    res.redirect('/');
});

app.delete('/delete', (req, res) => {
    const { file, password } = req.query;
    console.log('Delete request for file:', file);
    if (password !== '13579') {
        return res.status(403).send('Incorrect password');
    }
    try {
        fs.unlinkSync(path.join('uploads', file));
        console.log('File successfully deleted:', file);
        res.status(200).send('Deleted');
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
    }
});

app.listen(port, () => {
    console.log(`App platform running at http://localhost:${port}`);
});
