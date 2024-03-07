var express = require('express');
var path = require('path');
var app = express();
const fs = require('fs');
const exphbs = require('express-handlebars');
const port = process.env.port || 3000;

const Handlebars = require('handlebars');
Handlebars.registerHelper('formatAvgReviews', function (avgReviews) {
    return avgReviews ? avgReviews : 'N/A';
});

Handlebars.registerHelper('highlightRow', function (avgReviews, options) {
    return avgReviews ? options.fn(this) : options.inverse(this);
});

app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main" }));

app.set('view engine', 'hbs');


const dataFilePath = path.join(__dirname, 'datasetA.json');
let jsonData;

fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    try {
        jsonData = JSON.parse(data);
        console.log('JSON data is loaded and ready!');
    } catch (error) {
        console.error('Error:', error);
    }
});

//Default Route.
app.get('/', function (req, res) {
    res.render('partials/index', { title: 'Assignment2 of Umesh.' });
});

//user route.
app.get('/users', function (req, res) {
    res.send('respond with a resource');
});

//Error route.
// app.get('*', function (req, res) {
//     res.render('partials/error', { title: 'Error', message: 'Wrong Route' });
// });

app.get('/data', (req, res) => {
    if (jsonData) {
        res.render('data', { jsonData });
    } else {
        res.status(500).send('Error!');
    }
});

app.get('/data/isbn/:index', (req, res) => {
    const index = req.params.index;
    if (jsonData[index] && jsonData[index].ISBN_13) {
        res.render('isbn', { isbn: jsonData[index].ISBN_13 });
    } else {
        res.status(404).send('Wrong ISBN!');
    }
});

app.get('/allData', (req, res) => {
    res.render('allData', { jsonData });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
