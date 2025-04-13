// App data storage
let workouts = [];
let exercises = [];
let sets = [];
let groups = [];
let reminders = [];
let currentUser = {
    id: 1,
    name: 'User',
    workouts: []
};

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

// Modals
const exerciseModal = document.getElementById('exercise-modal');
const reminderModal = document.getElementById('reminder-modal');
const groupModal = document.getElementById('group-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Initialize app
function initApp() {
    loadData();
    renderWorkouts();
    renderNextTraining();
    renderProgress();
    setupEventListeners();
}

// Load data from localStorage
function loadData() {
    const savedWorkouts = localStorage.getItem('ironpulse_workouts');
    const savedExercises = localStorage.getItem('ironpulse_exercises');
    const savedSets = localStorage.getItem('ironpulse_sets');
    const savedGroups = localStorage.getItem('ironpulse_groups');
    const savedReminders = localStorage.getItem('ironpulse_reminders');
    
    if (savedWorkouts) workouts = JSON.parse(savedWorkouts);
    if (savedExercises) exercises = JSON.parse(savedExercises);
    if (savedSets) sets = JSON.parse(savedSets);
    if (savedGroups) groups = JSON.parse(savedGroups);
    if (savedReminders) reminders = JSON.parse(savedReminders);
    
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
}

// Add sample data
function addSampleData() {
    // Sample workouts
    workouts = [
        { id: 1, name: 'Leg day', date: '2025-04-22', userId: 1 },
        { id: 2, name: 'Push day', date: '2025-04-19', userId: 1 },
        { id: 3, name: 'Pull day', date: '2025-04-16', userId: 1 }
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
        { id: 1, workoutId: 2, interval: 2, nextDate: '2025-04-26', active: true }
    ];
    
    // Sample groups
    groups = [
        { 
            id: 1, 
            name: 'Fitness Buddies', 
            description: 'Group for tracking progress together',
            members: [
                { id: 1, name: 'You', progress: '+12%' },
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
    workoutsList.innerHTML = '';
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
        workoutItem.innerHTML = `
            <div class="workout-info">
                <h3>${workout.name}</h3>
                <div class="workout-date">${formattedDate}</div>
            </div>
            <div class="progress-indicator">
                Progress <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </div>
        `;
        
        workoutsList.appendChild(workoutItem);
    });
}

// Render next training reminder
function renderNextTraining() {
    const activeReminders = reminders.filter(reminder => reminder.active);
    
    if (activeReminders.length === 0) {
        document.getElementById('next-training').innerHTML = `
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

// Render progress chart
function renderProgress() {
    // This would normally calculate real progress based on workout history
    // For demo purposes, we're using static data
    document.getElementById('progress-percentage').textContent = '+12% progress this week';
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
    startWorkoutBtn.addEventListener('click', () => {
        showScreen('new-workout-screen');
    });
    
    // Add exercise button
    addExerciseBtn.addEventListener('click', () => {
        openExerciseModal();
    });
    
    // Save workout button
    saveWorkoutBtn.addEventListener('click', () => {
        saveWorkout();
    });
    
    // Add set button
    addSetBtn.addEventListener('click', () => {
        addSetToModal();
    });
    
    // Save exercise button
    saveExerciseBtn.addEventListener('click', () => {
        saveExercise();
    });
    
    // Add reminder button
    addReminderBtn.addEventListener('click', () => {
        openReminderModal();
    });
    
    // Save reminder button
    saveReminderBtn.addEventListener('click', () => {
        saveReminder();
    });
    
    // Create group button
    createGroupBtn.addEventListener('click', () => {
        openGroupModal();
    });
    
    // Save group button
    saveGroupBtn.addEventListener('click', () => {
        saveGroup();
    });
    
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

// Update set numbers in modal
function updateSetNumbers() {
    const setForms = document.querySelectorAll('.set-form');
    setForms.forEach((form, index) => {
        form.querySelector('label').textContent = `Set ${index + 1}`;
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
    
    if (!workoutName) {
        alert('Please enter a workout name');
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
                completed: false
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
    
    // Reset interval
    document.getElementById('reminder-interval').value = '2';
    
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
        active: true
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
    document.getElementById('group-name').value = '';
    document.getElementById('group-description').value = '';
    
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
            { id: 1, name: 'You', progress: '+0%' }
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
