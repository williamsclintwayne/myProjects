// Set the initial countdown value
let countdownValue = 20;

// Function to update the countdown
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    // Display the current countdown value
    countdownElement.innerHTML = countdownValue;
    
    // Decrement the countdown value
    countdownValue--;

    // Check if the countdown has reached zero
    if (countdownValue < 0) {
        clearInterval(intervalId); // Stop the countdown
        countdownElement.innerHTML = "Time is up!!";
    }
}

// Call updateCountdown every 1000 milliseconds (1 second)
const intervalId = setInterval(updateCountdown, 1000);




