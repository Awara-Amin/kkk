
const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
var dbNotes = require("./db/db.json");
const path = require("path");
const util = require("util");
const {logger,jsonMiddleWare , urlMiddleWarre}= require('./helpers/middleWares');
const { uuid } = require("./helpers/middleWares");
// const readFile = util.promisify(fs.readFile); // in this form, it only returns a promis  https://www.youtube.com/watch?v=6_bZGA_BpcI. but if you give .then it does more
// const writeFile = util.promisify(fs.writeFile);

if (dbNotes === "") dbNotes = [];

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// building promises
const readFilePro = (filePath) => { 
  return new Promise((resolve, reject) => { 
      fs.readFile(filePath,(err, data)=> { 
          if(err) reject(`i could not find this file`)
          resolve(data); // if data exist in the file it comes to here, if not, then it would be rejected
      })
  })
}

const writeFilePro = (filePath, content) => { 
  return new Promise((resolve, reject) => { 
      fs.writeFile(filePath, content, err => { 
          if(err) reject(`could not write file`);
          resolve(`success`)
      });
  });
};


const getDogPic = async (filePath, content) => {
  try {
        const data = await readFilePro(filePath); 
        // console.log(`Bread: ${data}`);
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(content);

await writeFilePro(filePath, JSON.stringify(parsedNotes));
console.log('rondom dog image saved to file');
} catch(err){
 console.log(err); 
}
};


// app.get("/api/notes", async (req, res)=> {
//   const notes = await readFile("./db/db.json");
//   res.json(JSON.parse(notes));
//   // res.json("hi");
// });

app.get("/api/notes", async (req, res)=> {
  try {
  const notes = await readFilePro("./db/db.json");
  const respose = JSON.parse(notes);
  res.status(200).json({
    status: "succsess",
    result:respose.length,
    data: {
        notes: respose
    }
})
  } catch (error) {
    console.error("Error in loading the database:", error);
  }
  });

  

app.post("/api/notes", function(req,res){
  const {title, text} = req.body;
  
  if(req.body == " ") res.error(`Error in posting ${receivedNote.title}.`);
  const receivedNote = {
    id: uuid(),
    title,
    text,
  };
  getDogPic("./db/db.json", receivedNote)
  res.json(`Note ${receivedNote.title} added successfully.\n`);
  // res.send("catching and rendering")
});



app.delete("/api/notes/:id", (req,res)=>{
 console.log(`${req.method} request has been received.`);
readFilePro('./db/db.json')
//  readFile(`${__dirname}/./db/db.json`)
.then((data) => {
const notes = JSON.parse(data);
  // console.log(req.params.id);
    const deleteNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFile(
        `${__dirname}/db/db.json`,
        JSON.stringify(deleteNote),
        (err) => {
            res.json({
                status:"success",
                data: {
                    remenatsNotes: deleteNote
                }
            });
        }
);
      })
})



// link to the main page
app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// link to the /notes page
app.get("/notes", (req, res)=>{
  // res.sendFile(path.join(__dirname, "/notes.html"))
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

const PORT = 3000;
app.listen(3000, function(req, res){
  console.log(`Server is up and runing on port ${PORT}`)
})


