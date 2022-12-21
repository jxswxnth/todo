require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const port = process.env.PORT;
const now = date.getDate();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.set({
  strictQuery: true
});
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.otvpdjb.mongodb.net/${process.env.DB_DATABASE}`);

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema] //array of itemSchema based items.
})
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Wake up"
})
const item2 = new Item({
  name: "Drink water"
})
const item3 = new Item({
  name: "Walk a bit"
})
const defaultItems = [item1, item2, item3];

app.get('/', (req, res) => {
  Item.find((err, results) => {
    if (!err) {
      if (results.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("3 items inserted.");
          }
        })
        res.redirect('/');
      } else {
        res.render('pages/list', {
          heading: "Tasks",
          listOfItems: results,
          today: now
        });
      }
    }
  });
});

app.post('/', (req,res)=>{
  let item = req.body.newItem;
  let todo = req.body.toDoList;

  const newItem = new Item({
    name: item
  });
  if (todo === "Tasks") {
    newItem.save();
    res.redirect('/');
  } else {
    List.findOne({
      name: todo
    }, (err, foundList) => {
      if (!err) {
        if (foundList) {
          foundList.items.push(newItem);
          foundList.save();
          res.redirect('/' + todo);
        }
      }
    });
  }
})

app.post('/delete', (req, res) => {
  let deleteID = req.body.idToDelete;
  let ListName = req.body.ListName;

  if (ListName === "Tasks") {
    Item.deleteOne({
      _id: deleteID
    }, (err) => {
      if (!err) {
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({
      name: ListName
    }, {
      $pull: {
        items: {
          _id: deleteID
        }
      }
    }, (err, result) => {
      if (!err) {
        res.redirect('/' + ListName);
      }
    });
  }
});

app.get('/:listFromUser', (req, res) => {
  const customList = _.capitalize(req.params.listFromUser);
  const newList = new List({
    name: customList,
    items: []
  });
  List.findOne({
    name: customList
  }, (err, result) => {
    if (!err) {
      if (result) {
        res.render('pages/list', {
          heading: result.name,
          listOfItems: result.items,
          today: now
        });
      } else {
        newList.save(); //saving new route in db
        res.redirect('/' + customList); // redirecting to saved route
      }
    }
  });
});

app.listen(port, (req, res) => {
  console.log(`App is listening at port ${port}`)
})
