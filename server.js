import express from "express";
import "dotenv/config";
import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

const app = express();
const port =3000|| process.env.PORT ;

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(express.json());

let names = [];
let id = 1;
//send names
app.post("/send/names", (req, res) => {
  // console.log(req.body);
  const obj = { id: id++, name: req.body.name };
  names.push(obj);
  res.json({
    status: "success",
    obj,
  });
});

//get all names
app.get("/get/names", (req, res) => {
  logger.info("get all names");
  res.json(names);
});

//get single name
app.get("/get/name/:id", (req, res) => {
  const { id } = req.params;
  const name = names.find((name) => name.id === parseInt(id));

  res.status(200).json({
    status: "success",
    name,
  });
});

//update name
app.put("/update/name/:id", (req, res) => {
  const { id } = req.params;

  const updatedname = names.find((n) => {
    return n.id === parseInt(id);
  });

  updatedname.name = req.body.name;

  res.status(200).json({
    message: "success",
    updatedname,
  });
});

//delete name

app.delete("/delete/name/:id", (req, res) => {
  const { id } = req.params;

  const deletedname = names.find((name) => {
    return name.id === parseInt(id);
  });

  names.splice(names.indexOf(deletedname), 1);

  res.status(200).json({
    message: "success",
    names,
  });
});

app.listen(port, () => console.log(`server is running on port ${port}`));
