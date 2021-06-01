const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const { spawn } = require("child_process");
const { once } = require("events");
const { json } = require("express");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const delay = () => new Promise(resolve => {
  setTimeout(() => {
      resolve();
  }, 4000);
});

async function dsd(datauri, coordinate) {
  var temperatures = ""; 

  const sensor = spawn("python",["new_solution.py"]);

  sensor.stdout.on("data", function (data) {
    
    temperatures = temperatures + data.toString();
    
  });

  sensor.stdout.on("end", function () {
   
    
    
  });

  sensor.stdin.write(
    JSON.stringify(datauri) + "\n" + JSON.stringify(coordinate)
  );
  
  
  sensor.stdin.end();
  await once(sensor, "close");
 

  return temperatures;
}

app.post("/", (req, res) => {
  const datauri = req.body.img;
  const coordinate = req.body.co;
  
  dsd(datauri, coordinate).then((fdata) =>res.send(fdata));
  
  
});
app.listen(9000, () => {
  console.log(`Example app listening at 3000`);
});
