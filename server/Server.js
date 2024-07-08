const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() =>{
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB');
    console.log(err);
});

const ToDoSchema = new mongoose.Schema({
    title : String,
    description : String
});

const ToDoModel = mongoose.model('ToDo', ToDoSchema);




app.post('/addItems' , async(req, res) => {
    const {title, description} =req.body;
    // const newToDo = {
    //     id : ToDo.length + 1,
    //     tittle,
    //     description
    // };
    // /ToDo.push(newToDo);
    // res.status(201).json(newToDo);

    try{
        const newToDo = new ToDoModel({title, description});
        await newToDo.save();
        res.status(201).json(newToDo);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});




app.get('/listItems' , async(req, res) => {
    try{
        const ToDo = await ToDoModel.find();
        res.status(200).json(ToDo);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});



app.put('/updateItem/:id', async (req, res) => {
    try {
        const { title, description } = req.body; 
        const id = req.params.id;

        const updateToDo = await ToDoModel.findByIdAndUpdate(
            id,
            { title, description }, 
            { new: true }
        );

        if (!updateToDo) {
            return res.status(404).json({ message: "Updated ToDo List is empty" });
        }

        res.status(200).json(updateToDo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.delete('/deleteItem/:id' , async(req, res) =>{
    try{
        const id = req.params.id;
        const deleteTodo = await ToDoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});


const port = 1212;

app.listen(port , () =>{
    console.log("Server is listening on the port "+port);
});
