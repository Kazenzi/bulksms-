const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
})

const credentials = {
    //key and api name here 
  };

  app.get('/sms', (req, res) => {
    const sql = "SELECT PhoneNumber FROM personadetails";
    db.query(sql, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to fetch phone numbers");
      }
  
      const AfricasTalking = require('africastalking')(credentials);
      const sms = AfricasTalking.SMS;
  
      const phoneNumbers = data.map(item => item.PhoneNumber);
      const text = req.query.message; // Access the 'message' query parameter
  
      if (!text || text.trim().length === 0) { // Check if 'text' is empty
        return res.status(400).send("Message can't be blank");
      }
  
      function sendMessage() {
        const options = {
          to: phoneNumbers,
          message: text,
        };
  
        sms.send(options)
          .then(response => {
            console.log(response);
            res.send("Message sent successfully");
          })
          .catch(error => {
            console.log(error);
            res.status(500).send("Failed to send message");
          });
      }
  
      sendMessage();
    });
  });
  


app.get('/', (re, res) => {
    return res.json("Its working");
})
app.get('/persona', (req, res) => {
    const sql = "SELECT * FROM personadetails";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/create', (req, res) => {
    const sql = "INSERT INTO `personadetails`( `Name`, `Role`, `PhoneNumber`) VALUES (?,?,?)";
    const values = [
        req.body.name,
        req.body.role,
        req.body.phoneNumber
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.delete('/removepersona/:id', (req, res) => {
    
    const sql = `DELETE FROM personadetails WHERE id = ${req.params.id}`;
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
  });

app.get('/messages', (req, res) => {
    const sql = "SELECT * FROM messagedetails";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})




app.post('/messagecreate', (req, res) => {
    const sql = "INSERT INTO `messagedetails`(  `Title`, `Message`, `occurence`, `startdate`, `enddate`) VALUES (?,?,?,?,?)";
    const values = [
     req.body.title,
    req.body.message,
    req.body.occurrence,
    req.body.startDate,
    req.body.endDate
    ];
    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("listening")

})

const sendSms = () =>{
  const sql= "SELECT * FROM `messagedetails` WHERE `occurence` = 'daily' OR `occurence` = 'weekly'";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
}