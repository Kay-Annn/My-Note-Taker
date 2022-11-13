const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const PORT = 3000;
const path = require('path');
const filePath = path.join(__dirname, 'db/db.json');



app.use(express.static(__dirname + '/public'));


app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public/', 'notes.html'));
});

app.get('/api/notes', function (req, res) {
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      const obj= JSON.parse(data);;
     res.status(200).json(obj);
    } else {
      res.status(400).json(err);
    }
  });
});


app.post('/api/notes', function (req, res) {
  fs.readFile(filePath, (error, data) => {
    const newUserNote = {
      title: req.body.title,
      text: req.body.text,
    }

    if (error) {
      console.log(error);
      return;
    }
    const parsedData = JSON.parse(data);
    console.log(parsedData)
    parsedData.push(newUserNote);
    fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), (err) => {
  
      if (err) {
        console.log('Failed to write updated data to file');
        return;
      }
      console.log('Updated file successfully');
      res.status(200).json(req.body)
    
    });
  });
 
});



app.delete('/api/notes:id', (req, res) => res.json());


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './public/', 'index.html'));
});

app.listen(PORT, () =>
  console.info(`Example app listening at http://localhost:${PORT} 🚀`)
);


