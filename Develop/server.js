const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const { v4: uuidv4 } = require('uuid');
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
      const obj = JSON.parse(data);;
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
      id: uuidv4(),
    }

    if (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
    const parsedData = JSON.parse(data);
    console.log(parsedData)
    parsedData.push(newUserNote);
    fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), (err) => {

      if (err) {
        console.log('Failed to write updated data to file');
        res.status(500).send("Something went wrong");
      }
      console.log('Updated file successfully');
      res.status(200).json(req.body)

    });
  });

});


app.delete('/api/notes/:id', function (req, res) {
  //read all notes from the db.json file
  fs.readFile(filePath, (error, data) => {
    const id = req.params.id

    function removeObjectWithId(arr, id) {
      return arr.filter((obj) => obj.id !== id);
    }

    const newArr = removeObjectWithId(JSON.parse(data), id);

    fs.writeFile(filePath, JSON.stringify(newArr, null, 2), (err) => {

      if (err) {
        console.log('Failed to write updated data to file');
        res.status(500).send('Failed to write updated data to file');
      }
      console.log('Updated file successfully');
      res.status(200).json(req.body)

    });
   
  });
});


  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './public/', 'index.html'));
  });


  app.listen(PORT, () =>
    console.info(`Example app listening at http://localhost:${PORT} 🚀`)
  );


