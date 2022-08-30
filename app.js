
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// DB -------------------------------------------------------------------------------
const url = "mongodb+srv://*********@**********.mongodb.net/todoListDB"

mongoose.connect(url)
const itemsSchema = new mongoose.Schema ({
  name: String
})
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Bem vindo ao nosso To Do list!"
})
const item2 = new Item({
  name: "Adicione uma entrada abaixo."
})

const defaultItems = [item1, item2]

// DB -------------------------------------------------------------------------------
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({},function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err)
        } else {
          console.log("Success")
        }
      })
      res.redirect("/")
    } else{
        res.render("list", {listTitle: capitalizeFirstLetter(day), newListItems: foundItems})
    }  
  })
})

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  })
  item.save()
  res.redirect("/")
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox
  Item.findOneAndDelete({_id:checkedItemId}, function(e){
    if (!e) {
      console.log("Item removed.")
      res.redirect("/")
    } else console.log(e)
  })
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully");
});
