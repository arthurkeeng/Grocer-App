import { useEffect, useState } from "react";
import "../todo.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const getLocalStorage = () => {
  let lists = localStorage.getItem("list");
  if (lists) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
const Todo = () => {
  const [list, setList] = useState(getLocalStorage());
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "it works",
  });
  const [items, setItems] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      alertFunct();
      return () => clearTimeout(timeout);
    }, 7000);
  }, [alert]);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const alertFunct = (show = false, msg = "") => {
    setAlert({ show, msg });
  };
  const handleEdit = (e, id) => {
    let target = e.currentTarget.className;

    if (target === "edit") {
      let edited = list.find((item) => item.id === id);
      setIsEditing(true);
      setEditId(id);
      setItems(edited.name);
    }
    if (target === "del") {
      let newList = list.filter((item) => item.id !== id);
      setList(newList);
    }
  };
  const handleClick = (e) => {
    if (!items) {
      alertFunct(true, "please input an item in the input...");
    } else if (items && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, name: items };
          }
          return item;
        })
      );
      setIsEditing(false);
      setEditId(null);
      setItems("");
    } else {
      const newList = { id: new Date().getTime().toString(), name: items };
      setList([...list, newList]);
      alertFunct(true, "an item has been added");
      setItems("");
    }
  };
  return (
    <main>
      <section className="todoSection">
        {alert.show && <h5>{alert.msg}</h5>}
        <h3>welcome to the Grocery List</h3>
        <div>
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            style={styles.input}
          />
          <button type="submit" onClick={handleClick}>
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
        <TodoList list={list} handleEdit={(e, id) => handleEdit(e, id)} />
        <button onClick={() => setList([])}>Clear Items</button>
      </section>
    </main>
  );
};

const TodoList = ({ list, handleEdit }) => {
  return (
    <>
      {list.map((item) => {
        const { id, name } = item;
        return (
          <div style={styles.div} key={id}>
            <h3>{name}</h3>
            <h2>
              <button className="edit" onClick={(e) => handleEdit(e, id)}>
                <FaEdit />
              </button>
              <button className="del" onClick={(e) => handleEdit(e, id)}>
                <FaTrash />
              </button>
            </h2>
          </div>
        );
      })}
    </>
  );
};

const styles = {
  div: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "limegreen",
    height: "fit-content",
    borderRadius: "5px",
    padding: "5px",
    margin: "1.2rem  0",
  },
  input: {
    width: "70%",
    padding: "9px",
  },
};
export default Todo;
