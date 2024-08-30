// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZOKfvEkJwXu7_rXh1lInc6cYdeVnaRo0",
  authDomain: "purposeful-fadad.firebaseapp.com",
  projectId: "purposeful-fadad",
  storageBucket: "purposeful-fadad.appspot.com",
  messagingSenderId: "189982272401",
  appId: "1:189982272401:web:4c4f30e26d1edce7b74830",
  measurementId: "G-6VP08HK24T"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Expose functions globally
window.signUp = async function () {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert('Sign-up successful!');
        showUserDetails(user);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

window.logIn = async function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert('Login successful!');
        showUserDetails(user);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

window.logOut = async function () {
    try {
        await signOut(auth);
        alert('Logged out successfully!');
        document.getElementById('user-details').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('task-container').style.display = 'none';
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

// Show User Details
function showUserDetails(user) {
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-details').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('task-container').style.display = 'block';
    initializeTasks(); // Load tasks when user is logged in
}

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        showUserDetails(user);
    } else {
        document.getElementById('user-details').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('task-container').style.display = 'none';
    }
});

// Task Management
const taskCategories = {
    lifetime: [
        'Travel to a new country',
        'Learn a new language',
        'Start a new hobby',
        'Write a book',
        'Run a marathon'
    ],
    naught: [
        'Pull a harmless prank',
        'Stay up all night',
        'Try a new hairstyle',
        'Do a digital detox for a day',
        'Watch a movie marathon'
    ],
    teenager: [
        'Join a school club',
        'Volunteer for a cause',
        'Learn to cook a meal',
        'Start a small business',
        'Attend a concert'
    ]
};

// Function to get a random set of tasks
function getRandomTasks(tasks) {
    const selectedTasks = [];
    const taskSet = new Set();

    while (taskSet.size < 5) {
        const randomIndex = Math.floor(Math.random() * tasks.length);
        taskSet.add(tasks[randomIndex]);
    }

    taskSet.forEach(task => selectedTasks.push(task));
    return selectedTasks;
}

// Function to get tasks from localStorage or generate them if not present
function initializeTasks() {
    let lifetimeTasks = JSON.parse(localStorage.getItem('lifetimeTasks'));
    let naughtTasks = JSON.parse(localStorage.getItem('naughtTasks'));
    let teenagerTasks = JSON.parse(localStorage.getItem('teenagerTasks'));

    // Generate tasks if not already stored in localStorage
    if (!lifetimeTasks) {
        lifetimeTasks = getRandomTasks(taskCategories.lifetime);
        localStorage.setItem('lifetimeTasks', JSON.stringify(lifetimeTasks));
    }
    if (!naughtTasks) {
        naughtTasks = getRandomTasks(taskCategories.naught);
        localStorage.setItem('naughtTasks', JSON.stringify(naughtTasks));
    }
    if (!teenagerTasks) {
        teenagerTasks = getRandomTasks(taskCategories.teenager);
        localStorage.setItem('teenagerTasks', JSON.stringify(teenagerTasks));
    }

    displayTasks(lifetimeTasks, naughtTasks, teenagerTasks);
}

// Function to display tasks
function displayTasks(lifetimeTasks, naughtTasks, teenagerTasks) {
    const lifetimeList = document.getElementById('lifetime-list');
    const naughtList = document.getElementById('naught-list');
    const teenagerList = document.getElementById('teenager-list');

    const renderTasks = (tasks, list, category) => {
        list.innerHTML = tasks.map(task => `<li><input type="checkbox" onchange="checkAllTasksCompleted('${category}')"> ${task}</li>`).join('');
    };

    renderTasks(lifetimeTasks, lifetimeList, 'lifetime');
    renderTasks(naughtTasks, naughtList, 'naught');
    renderTasks(teenagerTasks, teenagerList, 'teenager');
}

// Check if all tasks are completed for a given category
window.checkAllTasksCompleted = function (category) {
    const list = document.getElementById(`${category}-list`);
    const checkboxes = list.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    const button = document.getElementById(`${category}-complete-btn`);
    button.disabled = !allChecked;
};

// Function to handle task completion and redirect
window.completeTasks = function (category) {
    if (confirm("You completed all tasks in this category! Do you want to claim your reward?")) {
        // Redirect to Telegram chat
        window.location.href = "https://t.me/karthi_ckk";
    }
};
