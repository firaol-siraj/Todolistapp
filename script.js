const task = document.querySelector('.task'),
tasks = document.querySelector('.task-container ul'),
noTask = document.querySelector('.notask-yet');
let count = 0, completed = 0;
let input = document.getElementById('todo-inputs');
let addBtn = document.getElementById('addBtn');
addBtn.disabled = true;
input.addEventListener('input', function(){
    addBtn.disabled = input.value.trim() === "";
})
input.addEventListener('keydown', function(target){
    if(target.key === 'Enter'){
        addTodo();
    }
})
function addTodo(){
    let input = document.getElementById('todo-inputs');
    let inputValue = input.value;
    if(inputValue.trim() === ""){
        alert("your are not write your task!");
    }else{
        noTask.style.display = "none";
        const taskObject = {
            date:Date.now(),
            text:inputValue,
            taskComplete:false         
        };
        saveLocalTask(taskObject);
        createTask(taskObject);
        input.value = "";
    } 
}
function createTask(task,isloaded = false){
    let taskList = document.createElement('li');
    taskList.classList.add('tasks');
    taskList.dataset.id = task.date;
    taskList.innerHTML = `<h3 class="task">${task.text}</h3>
                          <button class="task-complete">Complete</button>
                          <button class="task-remove">Delete</button>`;
    if(task.taskComplete){
        const taskText = taskList.querySelector('.task');
        const btn = taskList.querySelector('.task-complete');
        taskText.style.textDecoration = "line-through";
        taskText.style.opacity = "0.5";
        btn.textContent = 'Completed';
    }
    tasks.appendChild(taskList);
    taskList.querySelector('.task-complete').addEventListener('click', function(){
        complete(task.date,taskList);
    })
    taskList.querySelector('.task-remove').addEventListener('click', function(){
        removed(task.date,taskList);
    })
    if(!isloaded){
        count +=1;
        todoCount(count);
    }
}
function saveLocalTask(task){
    let myTask = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    myTask.push(task);
    localStorage.setItem("tasks", JSON.stringify(myTask));
}
function getTask(){
    let myTask = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    if(myTask.length === 0){
        noTask.style.display = "block";
    }else{
        noTask.style.display = "none";
    }
    count = 0;
    completed = 0;
    myTask.forEach(task => {
        createTask(task,true);
        if(task.taskComplete){
            completed +=1;
        }else{
            count +=1;
        }
    });
    todoCount(count);
    completedTodo(completed);
} 
function complete(taskId,taskElement){
    let taskText = taskElement.querySelector('.task'),
    btn = taskElement.querySelector('.task-complete');
    let myTask = JSON.parse(localStorage.getItem("tasks"));

    let task = myTask.find(t => t.date == taskId);
    if(!task.taskComplete){
        task.taskComplete=true;
        taskText.style.textDecoration = "line-through";
        taskText.style.opacity = "0.5";
        btn.textContent = 'Completed';
        if(count > 0){
            count -=1;
            todoCount(count);
        }
        completed += 1;
        completedTodo(completed);
    }
    localStorage.setItem('tasks',JSON.stringify(myTask));
}
function removed(taskId,taskElement){
    let myTask = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    let completeText = taskElement.querySelector('.task-complete').textContent;
    myTask = myTask.filter(task => task.date != taskId);
    localStorage.setItem('tasks', JSON.stringify(myTask));
    taskElement.remove();
    if(myTask.length === 0){
        noTask.style.display = "block";
    }else{
        noTask.style.display = "none";
    }
    if(count > 0 && completeText != "Completed"){
        count -=1
        todoCount(count);
    }
    if(completeText === "Completed" && completed > 0){
        completed -= 1;
        completedTodo(completed);
    }
}
document.querySelector('.clear-task').addEventListener('click', function(){
    tasks.innerHTML = '';
    localStorage.removeItem('tasks');
    noTask.style.display = "block";
    count = 0;
    todoCount(count);
    completed = 0;
    completedTodo(completed);
    
})
function todoCount(count){
    document.querySelector('.count-task').textContent = `Total Todos: ${count}`;
}
function completedTodo(completed){
    document.querySelector('.completed-task').textContent = `Completed Todos: ${completed}`;
}
document.addEventListener('DOMContentLoaded', getTask);