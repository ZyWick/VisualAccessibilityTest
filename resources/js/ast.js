const numbers = Array.from({length: 5}, (_, i) => i + 1);

const iconContainer = document.getElementById('iconContainer');
const startButton = document.getElementById('start_button');
const resultsContainer = document.getElementById('results');
const promptCont = document.getElementById('prompt-cont');
let promptText;

const startBox = document.getElementById('start');
const numTrials = 5;

let totalHit = 0;
let totalTrial = 0;
let startTime;
let totalTime;
let accuracy;

startButton.addEventListener("click", () => {
    startBox.style.display = "none";
    iconContainer.style.display = "flex";
    displayPrompt();
    startTime = new Date();
    nextTrial ()
})

iconContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("target"))
        totalHit++;
    iconContainer.innerHTML = ``;
    totalTrial++;
    nextTrial ()
})

function displayPrompt() {
    const promptText = document.createElement('h1');
    promptText.classList.add('prompt');
    promptText.textContent = 'Click the Facebook icon';
    promptCont.appendChild(promptText);
}

function displayIcons() {
    const iconNames = ['facebook', 'facebook-messenger', 'instagram', 'tiktok', 'twitter'];
    const shuffledIcons = shuffleArray(iconNames);

    shuffledIcons.forEach((iconName) => {
        const icon = document.createElement('i');
        icon.classList.add('fab', `fa-${iconName}`, 'icon');
        icon.style.fontSize = "3.5em";
        icon.style.cursor = "pointer";
        iconContainer.appendChild(icon);
    });
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function nextTrial () {
    if (totalTrial < numTrials) {
        displayIcons ();
    }   
    else done()
}

function done() {
    endTime = new Date();
    totalTime = endTime - startTime;
    accuracy = totalHit / numTrials * 100;
    resultsContainer.innerHTML = `
        <h3>Test Results</h3>
        Total time = ${totalTime}ms <br>
        Accuracy = ${accuracy}%
    `
    resultsContainer.style.display = "block";
    iconContainer.style.display = "none";
    saveToCsv()
}

//csv file is created and ready to download
function saveToCsv(){
	var encodedUri, link;
	let csvContent = "data:text/csv;charset=utf-8,TestResults\n";
	// arrayOfTimes.forEach(function (infoArray) {
	// 	let row = infoArray + ",";
    //     csvContent += row + "\r\n";
    // });
    csvContent+= `${totalTime},\r\n${accuracy}\r\n`
	encodedUri = encodeURI(csvContent);
	
	link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "testResults.csv");
	document.body.appendChild(link);
	link.click();
}

console.log("hello")