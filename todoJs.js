let todoList = [];

const basicURL = "./todoBack.php";

let userCredential;

const updateList = () => {
  const list = todoList.map((item) => {
    return `
            <li class="list-group-item d-flex flex-row justify-content-between" key="${
              item.id
            }">
            <div>
                <input class="form-check-input me-1 ${
                  item.id
                } " type="checkbox" onchange="taskDone(this)" id="checked" ${
      item.status && "checked"
    }>
                <span class=${item.status && "done"}>${item.text}</span>
            </div>
            <div class="icons-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon ${
                  item.status && "done"
                } ${
      item.id
    }" onclick="editTodo(this)" data-bs-toggle="modal" data-bs-target="#modal">
                    <path
                        d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z" />
                </svg>  
                
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon  ${
                  item.id
                }" onclick="deleteModal(this)" data-bs-toggle="modal" data-bs-target="#modal-delete" >
                    <path
                        d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z" />
                </svg>
            </div>
             </li>  
        
        `;
  });
  document.getElementById("list-group").innerHTML = list
    .toString()
    .replaceAll(",", " ");
};
let user; //localStorage.getItem('user')
const welcomeElement = document.getElementById("welcome");
const signUpModal = new bootstrap.Modal(document.getElementById("modal-sign"), {
  keyboard: false,
});

document.addEventListener("DOMContentLoaded", () => {
  const operation = "load";

  if (!user) {
    signUpModal.toggle();
    return;
  }
  document.querySelector(".logout").style.display = "block";
  welcomeElement.innerHTML = "Welcome " + user + " !";

  // updateList()

  fetch(basicURL, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ operation, name: "", password: "" }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        formContainer.style.display = "none";
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        welcomeMessage.innerHTML = "Welcome " + data.name;
        welcomeMessage.style.display = "block";
      }
    });
});

const modal = document.getElementById("modal");
const signInButton = document.getElementById("signInButton");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logout");
const fnameField = document.querySelector(".fname");
const newAccountButton = document.getElementById("newAccount");
const inputTask = document.getElementById("input");
const modalTitle = document.getElementById("handle-todo");
const saveButton = document.getElementById("save");
const inputDelete = document.getElementById("input-delete");
const email = document.getElementById("email");
const fname = document.getElementById("fname");
const password = document.getElementById("password");
const feedback = document.querySelector(".feedback");

const signIn = () => {
  const enteredEmail = email.value;
  const enteredPassword = password.value;
  const enteredFname = fname.value;

  if (!enteredEmail || !enteredPassword || !enteredFname) {
    feedback.innerHTML = "Missing some input values";

    return;
  }

  fetch(basicURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Basic " + window.btoa(`${email}:${password}`),
    },
    body: JSON.stringify({
      name: enteredFname,
      email: enteredEmail,
      password: enteredPassword,
      operation: "register",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        welcomeElement.innerHTML = "Welcome " + data.user.name + " !";
        document.querySelector(".logout").style = "display: block";
        signUpModal.toggle();
        userCredential = {
          email: data.user.email ?? enteredEmail,
          password: data.user.password ?? enteredPassword,
        };
        user = true;
      } else {
        feedback.innerHTML = "Something went wrong, try again later.";
      }
    });

  welcomeElement.innerHTML = "Welcome " + enteredFname + " !";
  document.querySelector(".logout").style = "display: block";
};

const toggleSignIn = () => {
  signInButton.style.display = "block";
  loginButton.style.display = "none";
  fnameField.style.display = "block";
  newAccountButton.style.display = "none";
  feedback.innerHTML = "";
};

const logout = () => {
  window.location.reload();
};

const login = () => {
  const enteredEmail = email.value;
  const enteredPassword = password.value;

  //console.log(enteredEmail, enteredPassword);

  if (!enteredEmail || !enteredPassword) {
    feedback.innerHTML = "Missing some input values";

    return;
  }

  fetch(basicURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Basic " + window.btoa(`${enteredEmail}:${password}`),
    },
    body: JSON.stringify({
      email: enteredEmail,
      password: enteredPassword,
      operation: "login",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        user = true;
        userCredential = {
          email: data.user.email ?? enteredEmail,
          password: data.user.password ?? enteredPassword,
        };
        welcomeElement.innerHTML = "Welcome " + data.user.name + " !";
        document.querySelector(".logout").style = "display: block";
        password.style.display = "none";
        signUpModal.toggle();
        todoList = data.user.activity;
        updateList();
      } else {
        feedback.innerHTML = "Wrong email or password!!";
      }
    });
};

let currentId;

const newTodo = () => {
  modalTitle.innerHTML = "New task";
  inputTask.value = "";
  inputTask.focus();
  index = null;
};

const saveTodo = () => {
  const itemId = todoList.findIndex((todo) => todo.id === currentId);
  let currentObj;

  if (!user) {
    alert();
    return;
  }

  if (itemId !== -1) {
    currentObj = {
      id: itemId,
      text: inputTask.value,
      date: new Date().toISOString(),
      status: false,
    };
    todoList[itemId] = currentObj;
    editFetch(itemId);
  } else {
    currentObj = {
      id: todoList.length,
      text: inputTask.value,
      date: new Date().toISOString(),
      status: false,
    };
    todoList.push(currentObj);
    fetch(basicURL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization:
          "Basic " +
          window.btoa(`${userCredential.email}:${userCredential.password}`),
      },
      body: JSON.stringify({
        email: userCredential.email,
        password: userCredential.password,
        operation: "newTodo",
        todo: currentObj,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
      });
  }

  inputTask.value = "";
  currentId = null;

  updateList();
};

const editTodo = (e) => {
  inputTask.focus();
  modalTitle.innerHTML = "Edit Todo";
  const index = e.classList[2];
  currentId = +index;
  inputTask.value = todoList[index]?.text;

  updateList();
};

const editFetch = (index) => {
  fetch(basicURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        window.btoa(`${userCredential.email}:${userCredential.password}`),
    },
    body: JSON.stringify({
      email: userCredential.email,
      password: userCredential.password,
      operation: "editTask",
      itemId: index,
      newContent: todoList[index]?.text,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
    });
};

const deleteModal = (e) => {
  const index = e.classList[1];
  inputDelete.value = todoList[index].text;
  currentId = index;
};

const deleteTodo = () => {
  todoList.splice(currentId, 1);
  fetch(basicURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        window.btoa(`${userCredential.email}:${userCredential.password}`),
    },
    body: JSON.stringify({
      email: userCredential.email,
      password: userCredential.password,
      operation: "removeTodo",
      itemId: currentId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
    });

  currentId = null;

  updateList();
};

const taskDone = (e) => {
  const index = e.classList[2];
  const item = todoList[index];
  const newObj = { ...item, status: e.checked };
  todoList[index] = newObj;
  fetch(basicURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        window.btoa(`${userCredential.email}:${userCredential.password}`),
    },
    body: JSON.stringify({
      email: userCredential.email,
      password: userCredential.password,
      operation: "taskDone",
      itemId: index,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
    });

  updateList();
};

const alert = () => {
  var alert = document.getElementById("alert");
  alert.innerHTML = `<div class="alert alert-warning alert-dismissible" role="alert"> You need to sign up first! 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
};

const error = () => {
  var alert = document.getElementById("alert");
  alert.innerHTML = `<div class=" error-warning error-dismissible" role="error"> You need to sign up first! 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
};

inputTask.addEventListener(
  "onchange",
  (e) => (inputTask.value = e.target.value)
);
