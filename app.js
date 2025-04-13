// App data storage
let workouts = [];
let exercises = [];
let sets = [];
let groups = [];
let reminders = [];
let users = [];
let currentUser = null;

// Workout types
const workoutTypes = [
    "Pushday",
    "Pullday",
    "Legday",
    "Full Body",
    "Upper Body",
    "Lower Body",
    "Cardio"
];

// DOM Elements
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-btn');
const startWorkoutBtn = document.getElementById('start-workout-btn');
const backButtons = document.querySelectorAll('.back-btn');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const saveWorkoutBtn = document.getElementById('save-workout-btn');
const addSetBtn = document.getElementById('add-set-btn');
const saveExerciseBtn = document.getElementById('save-exercise-btn');
const addReminderBtn = document.getElementById('add-reminder-btn');
const saveReminderBtn = document.getElementById('save-reminder-btn');
const createGroupBtn = document.getElementById('create-group-btn');
const saveGroupBtn = document.getElementById('save-group-btn');
const userProfileBtn = document.getElementById('user-profile-btn');
const logoutBtn = document.getElementById('logout-btn');

// Modals
const exerciseModal = document.getElementById('exercise-modal');
const reminderModal = document.getElementById('reminder-modal');
const groupModal = document.getElementById('group-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Initialize app
function initApp() {
    checkAuthentication();
    loadData();
    renderWorkouts();
    renderNextTraining();
    renderProgress();
    setupEventListeners();
}

// Check if user is authenticated
function checkAuthentication() {
    const savedUser = localStorage.getItem('ironpulse_current_user');
    
    if (!savedUser) {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    
    // Update user profile button with user's name
    if (userProfileBtn) {
        userProfileBtn.textContent = currentUser.name;
    }
}

// Load data from localStorage
function loadData() {
    const savedWorkouts = localStorage.getItem('ironpulse_workouts');
    const savedExercises = localStorage.getItem('ironpulse_exercises');
    const savedSets = localStorage.getItem('ironpulse_sets');
    const savedGroups = localStorage.getItem('ironpulse_groups');
    const savedReminders = localStorage.getItem('ironpulse_reminders');
    const savedUsers = localStorage.getItem('ironpulse_users');
    
    if (savedWorkouts) workouts = JSON.parse(savedWorkouts);
    if (savedExercises) exercises = JSON.parse(savedExercises);
    if (savedSets) sets = JSON.parse(savedSets);
    if (savedGroups) groups = JSON.parse(savedGroups);
    if (savedReminders) reminders = JSON.parse(savedReminders);
    if (savedUsers) users = JSON.parse(savedUsers);
    
    // Add sample data if none exists
    if (workouts.length === 0) {
        addSampleData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('ironpulse_workouts', JSON.stringify(workouts));
    localStorage.setItem('ironpulse_exercises', JSON.stringify(exercises));
    localStorage.setItem('ironpulse_sets', JSON.stringify(sets));
    localStorage.setItem('ironpulse_groups', JSON.stringify(groups));
    localStorage.setItem('ironpulse_reminders', JSON.stringify(reminders));
    localStorage.setItem('ironpulse_users', JSON.stringify(users));
}

// Add sample data
function addSampleData() {
    // Sample workouts
    workouts = [
        { id: 1, name: 'Leg day', type: 'Legday', date: '2025-04-22', userId: currentUser.id },
        { id: 2, name: 'Push day', type: 'Pushday', date: '2025-04-19', userId: currentUser.id },
        { id: 3, name: 'Pull day', type: 'Pullday', date: '2025-04-16', userId: currentUser.id }
    ];
    
    // Sample exercises
    exercises = [
        { id: 1, name: 'Squats', workoutId: 1 },
        { id: 2, name: 'Leg Press', workoutId: 1 },
        { id: 3, name: 'Bench Press', workoutId: 2 },
        { id: 4, name: 'Shoulder Press', workoutId: 2 },
        { id: 5, name: 'Pull-ups', workoutId: 3 },
        { id: 6, name: 'Deadlift', workoutId: 3 }
    ];
    
    // Sample sets
    sets = [
        { id: 1, exerciseId: 1, reps: 10, weight: 100, completed: true },
        { id: 2, exerciseId: 1, reps: 8, weight: 110, completed: true },
        { id: 3, exerciseId: 2, reps: 12, weight: 150, completed: true },
        { id: 4, exerciseId: 3, reps: 8, weight: 80, completed: true },
        { id: 5, exerciseId: 3, reps: 7, weight: 80, completed: true },
        { id: 6, exerciseId: 4, reps: 10, weight: 60, completed: true },
        { id: 7, exerciseId: 5, reps: 8, weight: 0, completed: true },
        { id: 8, exerciseId: 6, reps: 5, weight: 120, completed: true }
    ];
    
    // Sample reminders
    reminders = [
        { id: 1, workoutId: 2, interval: 2, nextDate: '2025-04-26', active: true, userId: currentUser.id }
    ];
    
    // Sample groups
    groups = [
        { 
            id: 1, 
            name: 'Fitness Buddies', 
            description: 'Group for tracking progress together',
            members: [
                { id: currentUser.id, name: currentUser.name, progress: '+12%' },
                { id: 2, name: 'Anna', progress: '+5%' },
                { id: 3, name: 'Mike', progress: '+8%' }
            ]
        }
    ];
    
    saveData();
}

// Render workouts on home screen
function renderWorkouts() {
    const workoutsList = document.getElementById('last-workouts-list');
    if (!workoutsList) return;
    
    workoutsList.innerHTML = '';
    
    // Filter workouts for current user
    const userWorkouts = workouts.filter(workout => workout.userId === currentUser.id);
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...userWorkouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display up to 3 most recent workouts
    const recentWorkouts = sortedWorkouts.slice(0, 3);
    
    if (recentWorkouts.length === 0) {
        workoutsList.innerHTML = '<p>No workouts yet. Start your fitness journey!</p>';
        return;
    }
    
    recentWorkouts.forEach(workout => {
        const workoutDate = new Date(workout.date);
        const formattedDate = workoutDate.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
        
        const workoutItem = document.createElement('div');
        workoutItem.className = 'workout-item';
        workoutItem.dataset.id = workout.id;
        workoutItem.innerHTML = `
            <div class="workout-info">
                <h3>${workout.name}</h3>
                <div class="workout-date">${formattedDate}</div>
            </div>
            <div class="progress-indicator">
                Progress <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </div>
        `;
        
        // Add click event to view workout details
        workoutItem.addEventListener('click', () => {
            viewWorkoutDetails(workout.id);
        });
        
        workoutsList.appendChild(workoutItem);
    });
}

// View workout details
function viewWorkoutDetails(workoutId) {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    const workoutExercises = exercises.filter(e => e.workoutId === workoutId);
    
    // Create workout detail screen dynamically
    const detailScreen = document.createElement('div');
    detailScreen.id = 'workout-detail-screen';
    detailScreen.className = 'screen';
    
    let exercisesHtml = '';
    
    workoutExercises.forEach(exercise => {
        const exerciseSets = sets.filter(s => s.exerciseId === exercise.id);
        
        let setsHtml = '';
        exerciseSets.forEach(set => {
            setsHtml += `
                <div class="set-item" data-id="${set.id}">
                    <span class="set-number">Set ${exerciseSets.indexOf(set) + 1}</span>
                    <span class="set-details">${set.reps} reps × ${set.weight} kg</span>
                    <button class="edit-set-btn" data-id="${set.id}">Edit</button>
                </div>
            `;
        });
        
        exercisesHtml += `
            <div class="exercise-item" data-id="${exercise.id}">
                <div class="exercise-header">
                    <span class="exercise-name">${exercise.name}</span>
                    <button class="add-set-to-exercise-btn" data-id="${exercise.id}">+ Set</button>
                </div>
                <div class="sets-list">
                    ${setsHtml}
                </div>
            </div>
        `;
    });
    
    const workoutDate = new Date(workout.date);
    const formattedDate = workoutDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
    
    detailScreen.innerHTML = `
        <div class="container">
            <div class="screen-header">
                <button class="back-btn">&larr;</button>
                <h2>${workout.name}</h2>
            </div>
            
            <div class="workout-date-detail">${formattedDate}</div>
            <div class="workout-type-detail">${workout.type || 'Kein Typ'}</div>
            
            <div id="workout-exercises">
                ${exercisesHtml}
            </div>
            
            <button id="add-exercise-to-workout-btn" class="btn-secondary" data-workout-id="${workoutId}">+ Übung hinzufügen</button>
            <button id="repeat-workout-btn" class="btn-primary" data-workout-id="${workoutId}">Workout wiederholen</button>
        </div>
    `;
    
    // Add the screen to the DOM
    document.querySelector('main').appendChild(detailScreen);
    
    // Show the screen
    showScreen('workout-detail-screen');
    
    // Add event listeners for the new buttons
    document.querySelectorAll('.edit-set-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const setId = parseInt(btn.dataset.id);
            openEditSetModal(setId);
        });
    });
    
    document.querySelectorAll('.add-set-to-exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const exerciseId = parseInt(btn.dataset.id);
            openAddSetModal(exerciseId);
        });
    });
    
    document.getElementById('add-exercise-to-workout-btn').addEventListener('click', () => {
        openAddExerciseToWorkoutModal(workoutId);
    });
    
    document.getElementById('repeat-workout-btn').addEventListener('click', () => {
        repeatWorkout(workoutId);
    });
    
    // Add back button functionality
    detailScreen.querySelector('.back-btn').addEventListener('click', () => {
        document.querySelector('main').removeChild(detailScreen);
        showScreen('home-screen');
    });
}

// Repeat workout
function repeatWorkout(workoutId) {
    const originalWorkout = workouts.find(w => w.id === workoutId);
    if (!originalWorkout) return;
    
    // Create a new workout screen with pre-filled exercises
    const newWorkoutScreen = document.createElement('div');
    newWorkoutScreen.id = 'repeat-workout-screen';
    newWorkoutScreen.className = 'screen';
    
    // Get workout type options
    let workoutTypeOptions = '';
    workoutTypes.forEach(type => {
        const selected = type === originalWorkout.type ? 'selected' : '';
        workoutTypeOptions += `<option value="${type}" ${selected}>${type}</option>`;
    });
    
    newWorkoutScreen.innerHTML = `
        <div class="container">
            <div class="screen-header">
                <button class="back-btn">&larr;</button>
                <h2>WORKOUT WIEDERHOLEN</h2>
            </div>
            
            <div class="workout-form">
                <div class="form-group">
                    <label for="repeat-workout-type">Workout Typ</label>
                    <select id="repeat-workout-type" required>
                        ${workoutTypeOptions}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="repeat-workout-name">Workout Name</label>
                    <input type="text" id="repeat-workout-name" value="${originalWorkout.name}" placeholder="z.B. Push Day, Leg Day...">
                </div>
                
                <div id="repeat-exercises-container">
                    <!-- Exercises will be added here -->
                </div>
                
                <button id="save-repeat-workout-btn" class="btn-primary">Workout speichern</button>
            </div>
        </div>
    `;
    
    // Add the screen to the DOM
    document.querySelector('main').appendChild(newWorkoutScreen);
    
    // Show the screen
    showScreen('repeat-workout-screen');
    
    // Get exercises from original workout
    const workoutExercises = exercises.filter(e => e.workoutId === workoutId);
    const exercisesContainer = document.getElementById('repeat-exercises-container');
    
    workoutExercises.forEach(exercise => {
        const exerciseSets = sets.filter(s => s.exerciseId === exercise.id);
        
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.dataset.originalId = exercise.id;
        
        let setsHtml = '';
        exerciseSets.forEach((set, index) => {
            setsHtml += `
                <div class="set-form repeat-set-form">
                    <div class="set-form-group">
                        <label>Set ${index + 1}</label>
                    </div>
                    <div class="set-form-group">
                        <label>Reps</label>
                        <input type="number" class="repeat-set-reps" min="1" value="${set.reps}">
                    </div>
                    <div class="set-form-group">
                        <label>Weight (kg)</label>
                        <input type="number" class="repeat-set-weight" min="0" value="${set.weight}">
                    </div>
                    <button type="button" class="remove-repeat-set">&times;</button>
                </div>
            `;
        });
        
        exerciseItem.innerHTML = `
            <div class="exercise-header">
                <span class="exercise-name">${exercise.name}</span>
                <button type="button" class="remove-repeat-exercise">&times;</button>
            </div>
            <div class="repeat-sets-container">
                ${setsHtml}
            </div>
            <button type="button" class="add-repeat-set-btn" data-exercise-index="${workoutExercises.indexOf(exercise)}">+ Set hinzufügen</button>
        `;
        
        exercisesContainer.appendChild(exerciseItem);
        
        // Add event listener to remove exercise button
        exerciseItem.querySelector('.remove-repeat-exercise').addEventListener('click', () => {
            exerciseItem.remove();
        });
        
        // Add event listeners to remove set buttons
        exerciseItem.querySelectorAll('.remove-repeat-set').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.repeat-set-form').remove();
                updateRepeatSetNumbers(exerciseItem);
            });
        });
        
        // Add event listener to add set button
        exerciseItem.querySelector('.add-repeat-set-btn').addEventListener('click', () => {
            addRepeatSet(exerciseItem);
        });
    });
    
    // Add back button functionality
    newWorkoutScreen.querySelector('.back-btn').addEventListener('click', () => {
        document.querySelector('main').removeChild(newWorkoutScreen);
        showScreen('workout-detail-screen');
    });
    
    // Add save button functionality
    document.getElementById('save-repeat-workout-btn').addEventListener('click', () => {
        saveRepeatedWorkout();
    });
}

// Add a set to a repeated exercise
function addRepeatSet(exerciseItem) {
    const setsContainer = exerciseItem.querySelector('.repeat-sets-container');
    const setIndex = setsContainer.children.length + 1;
    
    const setForm = document.createElement('div');
    setForm.className = 'set-form repeat-set-form';
    setForm.innerHTML = `
        <div class="set-form-group">
            <label>Set ${setIndex}</label>
        </div>
        <div class="set-form-group">
            <label>Reps</label>
            <input type="number" class="repeat-set-reps" min="1" value="8">
        </div>
        <div class="set-form-group">
            <label>Weight (kg)</label>
            <input type="number" class="repeat-set-weight" min="0" value="0">
        </div>
        <button type="button" class="remove-repeat-set">&times;</button>
    `;
    
    setsContainer.appendChild(setForm);
    
    // Add event listener to remove button
    setForm.querySelector('.remove-repeat-set').addEventListener('click', () => {
        setForm.remove();
        updateRepeatSetNumbers(exerciseItem);
    });
}

// Update set numbers in repeated exercise
function updateRepeatSetNumbers(exerciseItem) {
    const setForms = exerciseItem.querySelectorAll('.repeat-set-form');
    setForms.forEach((form, index) => {
        form.querySelector('label').textContent = `Set ${index + 1}`;
    });
}

// Save repeated workout
function saveRepeatedWorkout() {
    const workoutName = document.getElementById('repeat-workout-name').value.trim();
    const workoutType = document.getElementById('repeat-workout-type').value;
    
    if (!workoutName) {
        alert('Please enter a workout name');
        return;
    }
    
    if (!workoutType) {
        alert('Please select a workout type');
        return;
    }
    
    const exerciseItems = document.querySelectorAll('#repeat-exercises-container .exercise-item');
    
    if (exerciseItems.length === 0) {
        alert('Please add at least one exercise');
        return;
    }
    
    // Generate new IDs
    const workoutId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id)) + 1 : 1;
    let exerciseId = exercises.length > 0 ? Math.max(...exercises.map(e => e.id)) + 1 : 1;
    let setId = sets.length > 0 ? Math.max(...sets.map(s => s.id)) + 1 : 1;
    
    // Create workout
    const newWorkout = {
        id: workoutId,
        name: workoutName,
        type: workoutType,
        date: new Date().toISOString().split('T')[0],
        userId: currentUser.id
    };
    
    workouts.push(newWorkout);
    
    // Create exercises and sets
    exerciseItems.forEach(item => {
        const exerciseName = item.querySelector('.exercise-name').textContent;
        
        const newExercise = {
            id: exerciseId,
            name: exerciseName,
            workoutId: workoutId
        };
        
        exercises.push(newExercise);
        
        const setForms = item.querySelectorAll('.repeat-set-form');
        setForms.forEach(form => {
            const reps = parseInt(form.querySelector('.repeat-set-reps').value) || 0;
            const weight = parseInt(form.querySelector('.repeat-set-weight').value) || 0;
            
            const newSet = {
                id: setId,
                exerciseId: exerciseId,
                reps: reps,
                weight: weight,
                completed: true
            };
            
            sets.push(newSet);
            setId++;
        });
        
        exerciseId++;
    });
    
    // Save data
    saveData();
    
    // Update UI
    renderWorkouts();
    
    // Remove repeat workout screen
    const repeatWorkoutScreen = document.getElementById('repeat-workout-screen');
    document.querySelector('main').removeChild(repeatWorkoutScreen);
    
    // Remove workout detail screen
    const workoutDetailScreen = document.getElementById('workout-detail-screen');
    document.querySelector('main').removeChild(workoutDetailScreen);
    
    // Go back to home screen
    showScreen('home-screen');
    
    // Show success message
    alert('Workout saved successfully!');
}

// Open modal to edit a set
function openEditSetModal(setId) {
    const set = sets.find(s => s.id === setId);
    if (!set) return;
    
    const exercise = exercises.find(e => e.id === set.exerciseId);
    
    // Create edit set modal
    const editSetModal = document.createElement('div');
    editSetModal.id = 'edit-set-modal';
    editSetModal.className = 'modal';
    
    editSetModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Set bearbeiten - ${exercise ? exercise.name : 'Übung'}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="edit-set-reps">Wiederholungen</label>
                    <input type="number" id="edit-set-reps" value="${set.reps}" min="1">
                </div>
                
                <div class="form-group">
                    <label for="edit-set-weight">Gewicht (kg)</label>
                    <input type="number" id="edit-set-weight" value="${set.weight}" min="0">
                </div>
                
                <button id="save-edit-set-btn" class="btn-primary" data-id="${setId}">Speichern</button>
                <button id="delete-set-btn" class="btn-secondary">Löschen</button>
            </div>
        </div>
    `;
    
    // Add the modal to the DOM
    document.body.appendChild(editSetModal);
    
    // Show the modal
    editSetModal.style.display = 'block';
    
    // Add event listeners
    editSetModal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(editSetModal);
    });
    
    editSetModal.querySelector('#save-edit-set-btn').addEventListener('click', () => {
        const reps = parseInt(document.getElementById('edit-set-reps').value) || 0;
        const weight = parseInt(document.getElementById('edit-set-weight').value) || 0;
        
        // Update set
        set.reps = reps;
        set.weight = weight;
        
        // Save data
        saveData();
        
        // Update UI
        const setElement = document.querySelector(`.set-item[data-id="${setId}"]`);
        if (setElement) {
            setElement.querySelector('.set-details').textContent = `${reps} reps × ${weight} kg`;
        }
        
        // Close modal
        document.body.removeChild(editSetModal);
    });
    
    editSetModal.querySelector('#delete-set-btn').addEventListener('click', () => {
        // Remove set
        const setIndex = sets.findIndex(s => s.id === setId);
        if (setIndex !== -1) {
            sets.splice(setIndex, 1);
        }
        
        // Save data
        saveData();
        
        // Update UI
        const setElement = document.querySelector(`.set-item[data-id="${setId}"]`);
        if (setElement) {
            setElement.remove();
        }
        
        // Close modal
        document.body.removeChild(editSetModal);
    });
    
    // Close modal when clicking outside
    editSetModal.addEventListener('click', (e) => {
        if (e.target === editSetModal) {
            document.body.removeChild(editSetModal);
        }
    });
}

// Open modal to add a set to an exercise
function openAddSetModal(exerciseId) {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    // Create add set modal
    const addSetModal = document.createElement('div');
    addSetModal.id = 'add-set-modal';
    addSetModal.className = 'modal';
    
    addSetModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Set hinzufügen - ${exercise.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="add-set-reps">Wiederholungen</label>
                    <input type="number" id="add-set-reps" value="8" min="1">
                </div>
                
                <div class="form-group">
                    <label for="add-set-weight">Gewicht (kg)</label>
                    <input type="number" id="add-set-weight" value="0" min="0">
                </div>
                
                <button id="save-add-set-btn" class="btn-primary" data-id="${exerciseId}">Hinzufügen</button>
            </div>
        </div>
    `;
    
    // Add the modal to the DOM
    document.body.appendChild(addSetModal);
    
    // Show the modal
    addSetModal.style.display = 'block';
    
    // Add event listeners
    addSetModal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(addSetModal);
    });
    
    addSetModal.querySelector('#save-add-set-btn').addEventListener('click', () => {
        const reps = parseInt(document.getElementById('add-set-reps').value) || 0;
        const weight = parseInt(document.getElementById('add-set-weight').value) || 0;
        
        // Generate new set ID
        const setId = sets.length > 0 ? Math.max(...sets.map(s => s.id)) + 1 : 1;
        
        // Create new set
        const newSet = {
            id: setId,
            exerciseId: exerciseId,
            reps: reps,
            weight: weight,
            completed: true
        };
        
        // Add set
        sets.push(newSet);
        
        // Save data
        saveData();
        
        // Update UI
        const exerciseSets = sets.filter(s => s.exerciseId === exerciseId);
        const setNumber = exerciseSets.length;
        
        const setsListElement = document.querySelector(`.exercise-item[data-id="${exerciseId}"] .sets-list`);
        if (setsListElement) {
            const setElement = document.createElement('div');
            setElement.className = 'set-item';
            setElement.dataset.id = setId;
            setElement.innerHTML = `
                <span class="set-number">Set ${setNumber}</span>
                <span class="set-details">${reps} reps × ${weight} kg</span>
                <button class="edit-set-btn" data-id="${setId}">Edit</button>
            `;
            
            // Add event listener to edit button
            setElement.querySelector('.edit-set-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openEditSetModal(setId);
            });
            
            setsListElement.appendChild(setElement);
        }
        
        // Close modal
        document.body.removeChild(addSetModal);
    });
    
    // Close modal when clicking outside
    addSetModal.addEventListener('click', (e) => {
        if (e.target === addSetModal) {
            document.body.removeChild(addSetModal);
        }
    });
}

// Open modal to add an exercise to a workout
function openAddExerciseToWorkoutModal(workoutId) {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    // Create add exercise modal
    const addExerciseModal = document.createElement('div');
    addExerciseModal.id = 'add-exercise-to-workout-modal';
    addExerciseModal.className = 'modal';
    
    addExerciseModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Übung hinzufügen - ${workout.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="add-exercise-name">Übungsname</label>
                    <input type="text" id="add-exercise-name" placeholder="z.B. Bankdrücken, Kniebeugen...">
                </div>
                
                <div id="add-exercise-sets-container">
                    <!-- Sets will be added here -->
                </div>
                
                <button id="add-set-to-new-exercise-btn" class="btn-secondary">+ Set hinzufügen</button>
                
                <button id="save-add-exercise-btn" class="btn-primary" data-id="${workoutId}">Übung hinzufügen</button>
            </div>
        </div>
    `;
    
    // Add the modal to the DOM
    document.body.appendChild(addExerciseModal);
    
    // Show the modal
    addExerciseModal.style.display = 'block';
    
    // Add one set by default
    addSetToNewExercise();
    
    // Add event listeners
    addExerciseModal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(addExerciseModal);
    });
    
    addExerciseModal.querySelector('#add-set-to-new-exercise-btn').addEventListener('click', () => {
        addSetToNewExercise();
    });
    
    addExerciseModal.querySelector('#save-add-exercise-btn').addEventListener('click', () => {
        const exerciseName = document.getElementById('add-exercise-name').value.trim();
        
        if (!exerciseName) {
            alert('Bitte gib einen Übungsnamen ein');
            return;
        }
        
        // Generate new exercise ID
        const exerciseId = exercises.length > 0 ? Math.max(...exercises.map(e => e.id)) + 1 : 1;
        
        // Create new exercise
        const newExercise = {
            id: exerciseId,
            name: exerciseName,
            workoutId: workoutId
        };
        
        // Add exercise
        exercises.push(newExercise);
        
        // Add sets
        const setForms = document.querySelectorAll('#add-exercise-sets-container .set-form');
        let setId = sets.length > 0 ? Math.max(...sets.map(s => s.id)) + 1 : 1;
        
        const newSets = [];
        
        setForms.forEach((form, index) => {
            const reps = parseInt(form.querySelector('.set-reps').value) || 0;
            const weight = parseInt(form.querySelector('.set-weight').value) || 0;
            
            const newSet = {
                id: setId,
                exerciseId: exerciseId,
                reps: reps,
                weight: weight,
                completed: true
            };
            
            newSets.push(newSet);
            sets.push(newSet);
            setId++;
        });
        
        // Save data
        saveData();
        
        // Update UI
        const workoutExercisesElement = document.getElementById('workout-exercises');
        if (workoutExercisesElement) {
            const exerciseElement = document.createElement('div');
            exerciseElement.className = 'exercise-item';
            exerciseElement.dataset.id = exerciseId;
            
            let setsHtml = '';
            newSets.forEach((set, index) => {
                setsHtml += `
                    <div class="set-item" data-id="${set.id}">
                        <span class="set-number">Set ${index + 1}</span>
                        <span class="set-details">${set.reps} reps × ${set.weight} kg</span>
                        <button class="edit-set-btn" data-id="${set.id}">Edit</button>
                    </div>
                `;
            });
            
            exerciseElement.innerHTML = `
                <div class="exercise-header">
                    <span class="exercise-name">${exerciseName}</span>
                    <button class="add-set-to-exercise-btn" data-id="${exerciseId}">+ Set</button>
                </div>
                <div class="sets-list">
                    ${setsHtml}
                </div>
            `;
            
            workoutExercisesElement.appendChild(exerciseElement);
            
            // Add event listeners for the new buttons
            exerciseElement.querySelectorAll('.edit-set-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const setId = parseInt(btn.dataset.id);
                    openEditSetModal(setId);
                });
            });
            
            exerciseElement.querySelector('.add-set-to-exercise-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openAddSetModal(exerciseId);
            });
        }
        
        // Close modal
        document.body.removeChild(addExerciseModal);
    });
    
    // Close modal when clicking outside
    addExerciseModal.addEventListener('click', (e) => {
        if (e.target === addExerciseModal) {
            document.body.removeChild(addExerciseModal);
        }
    });
}

// Add set to new exercise modal
function addSetToNewExercise() {
    const setsContainer = document.getElementById('add-exercise-sets-container');
    const setIndex = setsContainer.children.length + 1;
    
    const setForm = document.createElement('div');
    setForm.className = 'set-form';
    setForm.innerHTML = `
        <div class="set-form-group">
            <label>Set ${setIndex}</label>
        </div>
        <div class="set-form-group">
            <label>Reps</label>
            <input type="number" class="set-reps" min="1" value="8">
        </div>
        <div class="set-form-group">
            <label>Weight (kg)</label>
            <input type="number" class="set-weight" min="0" value="0">
        </div>
        <button type="button" class="remove-set">&times;</button>
    `;
    
    setsContainer.appendChild(setForm);
    
    // Add event listener to remove button
    setForm.querySelector('.remove-set').addEventListener('click', () => {
        setForm.remove();
        // Update set numbers
        updateSetNumbers();
    });
}

// Update set numbers in modal
function updateSetNumbers() {
    const setForms = document.querySelectorAll('.set-form');
    setForms.forEach((form, index) => {
        form.querySelector('label').textContent = `Set ${index + 1}`;
    });
}

// Render next training reminder
function renderNextTraining() {
    const nextTrainingElement = document.getElementById('next-training');
    if (!nextTrainingElement) return;
    
    // Filter reminders for current user
    const activeReminders = reminders.filter(reminder => reminder.active && reminder.userId === currentUser.id);
    
    if (activeReminders.length === 0) {
        nextTrainingElement.innerHTML = `
            <p id="next-workout-name">No upcoming workouts</p>
            <p id="next-workout-date">Set a reminder to get started</p>
        `;
        return;
    }
    
    // Find the next workout based on reminders
    const nextReminder = activeReminders.reduce((closest, current) => {
        const currentDate = new Date(current.nextDate);
        const closestDate = closest ? new Date(closest.nextDate) : null;
        
        if (!closestDate || currentDate < closestDate) {
            return current;
        }
        return closest;
    }, null);
    
    if (nextReminder) {
        const workout = workouts.find(w => w.id === nextReminder.workoutId);
        const nextDate = new Date(nextReminder.nextDate);
        const formattedDate = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        document.getElementById('next-workout-name').textContent = workout ? workout.name : 'Workout';
        document.getElementById('next-workout-date').textContent = formattedDate;
    }
}

// Calculate progress for a specific workout type
function calculateWorkoutTypeProgress(workoutType) {
    // Filter workouts by type and user
    const typeWorkouts = workouts.filter(w => w.type === workoutType && w.userId === currentUser.id);
    
    // Sort by date (oldest first)
    const sortedWorkouts = [...typeWorkouts].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedWorkouts.length < 2) {
        return 0; // Not enough workouts to calculate progress
    }
    
    // Get the two most recent workouts
    const recentWorkout = sortedWorkouts[sortedWorkouts.length - 1];
    const previousWorkout = sortedWorkouts[sortedWorkouts.length - 2];
    
    // Get exercises for both workouts
    const recentExercises = exercises.filter(e => e.workoutId === recentWorkout.id);
    const previousExercises = exercises.filter(e => e.workoutId === previousWorkout.id);
    
    // Calculate total volume for each workout
    let recentVolume = 0;
    let previousVolume = 0;
    
    recentExercises.forEach(exercise => {
        const exerciseSets = sets.filter(s => s.exerciseId === exercise.id);
        exerciseSets.forEach(set => {
            recentVolume += set.reps * set.weight;
        });
    });
    
    previousExercises.forEach(exercise => {
        const exerciseSets = sets.filter(s => s.exerciseId === exercise.id);
        exerciseSets.forEach(set => {
            previousVolume += set.reps * set.weight;
        });
    });
    
    // Calculate percentage increase
    if (previousVolume === 0) return 0;
    
    const percentageIncrease = ((recentVolume - previousVolume) / previousVolume) * 100;
    return Math.round(percentageIncrease);
}

// Render progress chart
function renderProgress() {
    const progressPercentageElement = document.getElementById('progress-percentage');
    if (!progressPercentageElement) return;
    
    // Calculate overall progress across all workout types
    let totalProgress = 0;
    let typeCount = 0;
    
    // Get unique workout types for the current user
    const userWorkouts = workouts.filter(w => w.userId === currentUser.id);
    const workoutTypeSet = new Set(userWorkouts.map(w => w.type).filter(Boolean));
    const uniqueWorkoutTypes = Array.from(workoutTypeSet);
    
    uniqueWorkoutTypes.forEach(type => {
        const typeProgress = calculateWorkoutTypeProgress(type);
        if (typeProgress !== 0) {
            totalProgress += typeProgress;
            typeCount++;
        }
    });
    
    const averageProgress = typeCount > 0 ? Math.round(totalProgress / typeCount) : 0;
    
    progressPercentageElement.textContent = `${averageProgress > 0 ? '+' : ''}${averageProgress}% progress this week`;
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreen = button.getAttribute('data-screen');
            showScreen(targetScreen);
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen('home-screen');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-screen="home-screen"]').classList.add('active');
        });
    });
    
    // Start workout button
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', () => {
            showScreen('new-workout-screen');
        });
    }
    
    // Add exercise button
    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', () => {
            openExerciseModal();
        });
    }
    
    // Save workout button
    if (saveWorkoutBtn) {
        saveWorkoutBtn.addEventListener('click', () => {
            saveWorkout();
        });
    }
    
    // Add set button
    if (addSetBtn) {
        addSetBtn.addEventListener('click', () => {
            addSetToModal();
        });
    }
    
    // Save exercise button
    if (saveExerciseBtn) {
        saveExerciseBtn.addEventListener('click', () => {
            saveExercise();
        });
    }
    
    // Add reminder button
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', () => {
            openReminderModal();
        });
    }
    
    // Save reminder button
    if (saveReminderBtn) {
        saveReminderBtn.addEventListener('click', () => {
            saveReminder();
        });
    }
    
    // Create group button
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => {
            openGroupModal();
        });
    }
    
    // Save group button
    if (saveGroupBtn) {
        saveGroupBtn.addEventListener('click', () => {
            saveGroup();
        });
    }
    
    // User profile button
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', () => {
            // Show user profile or dropdown
            console.log('User profile clicked');
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }
    
    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === exerciseModal || e.target === reminderModal || e.target === groupModal) {
            closeAllModals();
        }
    });
}

// Logout function
function logout() {
    // Remove current user from localStorage
    localStorage.removeItem('ironpulse_current_user');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Show screen
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenId).classList.add('active');
}

// Open exercise modal
function openExerciseModal() {
    document.getElementById('exercise-name').value = '';
    document.getElementById('sets-container').innerHTML = '';
    addSetToModal(); // Add one set by default
    
    exerciseModal.style.display = 'block';
}

// Add set to exercise modal
function addSetToModal() {
    const setsContainer = document.getElementById('sets-container');
    const setIndex = setsContainer.children.length + 1;
    
    const setForm = document.createElement('div');
    setForm.className = 'set-form';
    setForm.innerHTML = `
        <div class="set-form-group">
            <label>Set ${setIndex}</label>
        </div>
        <div class="set-form-group">
            <label>Reps</label>
            <input type="number" class="set-reps" min="1" value="8">
        </div>
        <div class="set-form-group">
            <label>Weight (kg)</label>
            <input type="number" class="set-weight" min="0" value="0">
        </div>
        <button type="button" class="remove-set">&times;</button>
    `;
    
    setsContainer.appendChild(setForm);
    
    // Add event listener to remove button
    setForm.querySelector('.remove-set').addEventListener('click', () => {
        setForm.remove();
        // Update set numbers
        updateSetNumbers();
    });
}

// Save exercise from modal
function saveExercise() {
    const exerciseName = document.getElementById('exercise-name').value.trim();
    
    if (!exerciseName) {
        alert('Please enter an exercise name');
        return;
    }
    
    const setForms = document.querySelectorAll('.set-form');
    const exerciseSets = [];
    
    setForms.forEach((form, index) => {
        const reps = parseInt(form.querySelector('.set-reps').value) || 0;
        const weight = parseInt(form.querySelector('.set-weight').value) || 0;
        
        exerciseSets.push({
            setNumber: index + 1,
            reps,
            weight
        });
    });
    
    // Add to exercises container in new workout screen
    const exercisesContainer = document.getElementById('exercises-container');
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'exercise-item';
    
    let setsHtml = '';
    exerciseSets.forEach(set => {
        setsHtml += `
            <div class="set-item">
                <span class="set-number">Set ${set.setNumber}</span>
                <span class="set-details">${set.reps} reps × ${set.weight} kg</span>
            </div>
        `;
    });
    
    exerciseItem.innerHTML = `
        <div class="exercise-header">
            <span class="exercise-name">${exerciseName}</span>
            <button type="button" class="remove-exercise">&times;</button>
        </div>
        <div class="sets-list">
            ${setsHtml}
        </div>
    `;
    
    exercisesContainer.appendChild(exerciseItem);
    
    // Add event listener to remove button
    exerciseItem.querySelector('.remove-exercise').addEventListener('click', () => {
        exerciseItem.remove();
    });
    
    // Close modal
    closeAllModals();
}

// Save workout
function saveWorkout() {
    const workoutName = document.getElementById('workout-name').value.trim();
    const workoutType = document.getElementById('workout-type').value;
    
    if (!workoutName) {
        alert('Please enter a workout name');
        return;
    }
    
    if (!workoutType) {
        alert('Please select a workout type');
        return;
    }
    
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    if (exerciseItems.length === 0) {
        alert('Please add at least one exercise');
        return;
    }
    
    // Generate new IDs
    const workoutId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id)) + 1 : 1;
    let exerciseId = exercises.length > 0 ? Math.max(...exercises.map(e => e.id)) + 1 : 1;
    let setId = sets.length > 0 ? Math.max(...sets.map(s => s.id)) + 1 : 1;
    
    // Create workout
    const newWorkout = {
        id: workoutId,
        name: workoutName,
        type: workoutType,
        date: new Date().toISOString().split('T')[0],
        userId: currentUser.id
    };
    
    workouts.push(newWorkout);
    
    // Create exercises and sets
    exerciseItems.forEach(item => {
        const exerciseName = item.querySelector('.exercise-name').textContent;
        
        const newExercise = {
            id: exerciseId,
            name: exerciseName,
            workoutId: workoutId
        };
        
        exercises.push(newExercise);
        
        const setItems = item.querySelectorAll('.set-item');
        setItems.forEach(setItem => {
            const setDetails = setItem.querySelector('.set-details').textContent;
            const [repsText, weightText] = setDetails.split('×');
            
            const reps = parseInt(repsText.trim());
            const weight = parseInt(weightText.trim());
            
            const newSet = {
                id: setId,
                exerciseId: exerciseId,
                reps: reps,
                weight: weight,
                completed: true
            };
            
            sets.push(newSet);
            setId++;
        });
        
        exerciseId++;
    });
    
    // Save data
    saveData();
    
    // Update UI
    renderWorkouts();
    
    // Reset form
    document.getElementById('workout-name').value = '';
    document.getElementById('workout-type').selectedIndex = 0;
    document.getElementById('exercises-container').innerHTML = '';
    
    // Go back to home screen
    showScreen('home-screen');
    
    // Show success message
    alert('Workout saved successfully!');
}

// Open reminder modal
function openReminderModal() {
    const reminderWorkout = document.getElementById('reminder-workout');
    reminderWorkout.innerHTML = '';
    
    // Add workout options
    workouts.forEach(workout => {
        const option = document.createElement('option');
        option.value = workout.id;
        option.textContent = workout.name;
        reminderWorkout.appendChild(option);
    });
    
    reminderModal.style.display = 'block';
}

// Save reminder
function saveReminder() {
    const workoutId = parseInt(document.getElementById('reminder-workout').value);
    const interval = parseInt(document.getElementById('reminder-interval').value);
    
    if (!workoutId || !interval) {
        alert('Please select a workout and interval');
        return;
    }
    
    // Calculate next date
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + interval);
    
    // Generate new ID
    const reminderId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
    
    // Create reminder
    const newReminder = {
        id: reminderId,
        workoutId: workoutId,
        interval: interval,
        nextDate: nextDate.toISOString().split('T')[0],
        active: true,
        userId: currentUser.id
    };
    
    reminders.push(newReminder);
    
    // Save data
    saveData();
    
    // Update UI
    renderNextTraining();
    
    // Close modal
    closeAllModals();
    
    // Show success message
    alert('Reminder set successfully!');
}

// Open group modal
function openGroupModal() {
    groupModal.style.display = 'block';
}

// Save group
function saveGroup() {
    const groupName = document.getElementById('group-name').value.trim();
    const groupDescription = document.getElementById('group-description').value.trim();
    
    if (!groupName) {
        alert('Please enter a group name');
        return;
    }
    
    // Generate new ID
    const groupId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    
    // Create group
    const newGroup = {
        id: groupId,
        name: groupName,
        description: groupDescription,
        members: [
            { id: currentUser.id, name: currentUser.name, progress: '+0%' }
        ]
    };
    
    groups.push(newGroup);
    
    // Save data
    saveData();
    
    // Close modal
    closeAllModals();
    
    // Show success message
    alert('Group created successfully!');
}

// Close all modals
function closeAllModals() {
    exerciseModal.style.display = 'none';
    reminderModal.style.display = 'none';
    groupModal.style.display = 'none';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
