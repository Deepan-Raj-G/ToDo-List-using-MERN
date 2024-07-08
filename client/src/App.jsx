import { useEffect, useState } from 'react';
import './App.css';

export default function App() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiurl = "http://localhost:1212";

  const handleSubmit =() =>{
    setError("");
    //check inputs
    if(title.trim() !== '' && description.trim() !== ''){
      fetch(apiurl + "/addItems", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title, description})
      })
      .then((res) => {
        if(res.ok){
          setTodo([...todo, {title,description}]);
          setTitle("");
          setDescription("");
          setMessage("Item Added Successfully");
          setTimeout(() => {
            setMessage("");
          },3000);
          
        }
      })
      .catch(() => {
        setError("Unable to Add Item");
      })
    }
  }

  useEffect(() => {
    listItems()
  },[]);

  const listItems = () =>{
    fetch(apiurl+"/listItems")
    .then((res) => res.json())
    .then((res) => {
      setTodo(res);
    })
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    //check inputs
    if(editTitle.trim() !== '' && editDescription.trim() !== ''){
      fetch(apiurl + "/updateItem/" + editId, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title : editTitle, description : editDescription})
      })
      .then((res) => {
        if(res.ok){
          const updateTodos = todo.map((item) => {
            if(item._id == editId){
              item.title = editTitle;
              item.description = editDescription;
            }
            return item;
          })

          setTodo(updateTodos);
          setMessage("Item Updated Successfully");
          setTimeout(() => {
            setMessage("");
          },3000);

          setEditId(-1);
        }
      })
      .catch(() => {
        setError("Unable to Add Item");
      })
    }
  };

  const handleCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) =>{
    if(window.confirm("Are you sure want to delete?")){
      fetch(apiurl + "/deleteItem/" + id , {
        method: "DELETE"
      })
      .then(() => {
        const deleteTodos = todo.filter((item) => item._id !== id);
        setTodo(deleteTodos);
      });
    }
    

  }

  return (
    <>
      <div className='row p-3 bg-success text-light'>
        <h1>Todo Project with MERN Stack</h1>
      </div>
      <div className='row '>
        <h3>Add Item</h3>
        {message && <p className='text-success'>{message}</p>}
        <div className='form-group d-flex gap-2'>
          <input className='form-control' onChange= {(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Title'/>
          <input className='form-control' onChange= {(e) => setDescription(e.target.value)} value={description} type="text" placeholder='Description' />
          <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className='text-danger'>{error}</p>}
      </div>
      <div className='row mt-3'>
        <h3>Todo List</h3>
        <ul>
          {
            todo.map((item) =>
              <li className='list-group-item d-flex justify-content-between bg-info align-items-center my-2'>
                <div className='d-flex flex-column me-2'>
                  {
                    editId == -1 || editId !== item._id ? <>
                      <span className='fw-bold'>{item.title}</span>
                      <span>{item.description}</span>
                    </> : <>
                      <div className='form-group d-flex gap-2'>
                        <input className='form-control' onChange= {(e) => setEditTitle(e.target.value)} value={editTitle} type="text" placeholder='Title'/>
                        <input className='form-control' onChange= {(e) => setEditDescription(e.target.value)} value={editDescription} type="text" placeholder='Description' />
                      </div>
                    </>
                  }
                  
                </div>
                <div className='d-flex gap-2'>
                  {
                    editId == -1 || editId !== item._id ? <>
                      <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button>
                      <button className='btn btn-danger'onClick={() => handleDelete(item._id)}>Delete</button>
                    </> : <>
                      <button className='btn btn-warning' onClick={handleUpdate} >Update</button>
                      <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>
                    </>
                  }
                </div>
              </li>
            )
          }
          
        </ul>
      </div>
    </>
  )
}