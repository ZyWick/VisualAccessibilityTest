const numbers = Array.from({length: 8}, (_, i) => i + 1);

const iconContainer = document.getElementById('iconContainer');
const startButton = document.getElementById('start_button');
const resultsContainer = document.getElementById('results');

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

function displayIcons () {
    let target = 1 + Math.floor(Math.random() * 8);

    numbers.forEach(number => {
        const icon = document.createElement('button');
        icon.classList.add('icon');
        icon.innerText = number;
        
        // Append the icon to the icon container
        if (target == number) { 
            icon.classList.add('target');
            icon.style.borderRadius = `40%`;
        }
        iconContainer.appendChild(icon);
    });
}

function nextTrial () {
    if (totalTrial < numTrials)
        displayIcons ()
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