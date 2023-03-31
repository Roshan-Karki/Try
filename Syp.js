const express = require("express");
const app = express();
const port = 3004;
const connectData = require("./databaseConnection").con;

//Configurating the express.
app.set("view engine", "hbs"); // here "view engine is vaiable name and hbs is data".
app.set("views", "./view");
app.set("search","./view",)
app.use(express.static(__dirname + "/Public"));

//routing the link of between the pages.
app.get("/", (req, res) => {
  res.render("login");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/add", (req, res) => {
  res.render("add");
});
app.get("/search", (req, res) => {
  let qry = "select * from customerdata";
  connectData.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.render("search", { data: results });
    }
  });
});
app.get("/update", (req, res) => {
  res.render("update");
});
app.get("/delete", (req, res) => {
  res.render("delete");
});
app.get("/view", (req, res) => {
  let qry = "select * from customerdata";
  connectData.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.render("view", { data: results });
    }
  });
});

app.get("/addCustomer", (req, res) => {
  const { name, phone, product, price } = req.query;
  // console.log('hey')
  // res.send(req.query)

  //Sanitization xss .... adding the data in data base.
  let qry = "select * from customerdata where customerNumber=? or totalPrice=?";
  connectData.query(qry, [phone, price], (err, results) => {
    if (err) throw err;
    else {
      // console.log(results)
      if (results.length > 0) {
        res.send("Data already in database");
      } else {
        //insert query in the databse
        let qry1 = "insert into customerdata values(?, ?, ?,?)";
        connectData.query(
          qry1,
          [name, phone, product, price],
          (err, results) => {
            if (results.affectedRows > 0) {
              res.render("add", { mesg: true });
            }
          }
        );
      }
    }
  });
});
app.get("/searchCustomer", (req, res) => {
  // detching the data from the database
  const { phone } = req.query;

  let qry1 = "select * from customerdata where customerNumber=?";
  connectData.query(qry1, [phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("view", { message1: true, message2: false });
      } else {
        res.render("search", { message1: false, message2: true });
      }
    }
  });
});

app.get("/newSearch", (req, res) => {
  // detching the data from the database
  const { phone } = req.query;

  let qry2 = "select * from customerdata where customerNumber=?";
  connectData.query(qry2, [phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("update", { message3: true, mesg2: false, data: results });
      } else {
        res.render("update", { message4: false, mesg2: true });
      }
    }
  });
});
app.get("/updateCustomer", (req, res) => {
  const { phone, product, price } = req.query;
  console.log(phone, " ", product, " ", price);

  let qry3 =
    "update customerdata set Products=? , totalPrice=? where customerNumber=?";
  connectData.query(qry3, [product, price, phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.affectedRows > 0) {
        res.render("update", { umessage: true });
      }
    }
  });
});
app.get("/deleteCustomer", (req, res) => {
  const { name, phone, product, price } = req.query;
  console.log(name, " ", phone, " ", product, " ", price);

  let qry4 = "delete from customerdata where customerNumber=?";
  connectData.query(qry4, [phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.affectedRows > 0) {
        res.render("delete", { dmessage: true });
      }
    }
  });
});

// creating the server.
app.listen(port, (err) => {
  if (err) throw err;
  else console.log("Server is running at port %d:", port);
});
