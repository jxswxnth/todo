const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
const port = process.env.PORT;
let tasks = ["Wake Up", "Drink water","Walk a bit"];
let works = [];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  today = date.getDate();
  res.render('pages/list', {
    heading: today,
    listOfTasks: tasks
  });
})
app.post('/', (req,res)=>{
  item = req.body.newTask;
    if(req.body.taskORwork==="WorkList"){ //taskORwork is name of submit button and
      // we can get value from that as per 'heading'
      works.push(item);
      res.redirect('/work');
    } else {
      tasks.push(item);
      res.redirect('/');
    }
})


app.get("/work",(req,res)=>{
  res.render('pages/list',{
    heading: "WorkList",
    listOfTasks: works
  })
})

app.get('/about', (req,res)=>{
  res.render('pages/about',{
    heading: "About"
  })
})

app.listen(port, (req, res) => {
  console.log(`App is listening at port ${port}`)
})
