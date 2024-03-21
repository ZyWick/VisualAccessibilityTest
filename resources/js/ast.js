const numbers = Array.from({ length: 5 }, (_, i) => i + 1);

const iconContainer = document.getElementById("iconContainer");
const startButton = document.getElementById("start_button");
const resultsContainer = document.getElementById("results");
const promptCont = document.getElementById("prompt-cont");
const shapeConfigurations = [
  "facebook-filled",
  "facebook-outlined",
  "instagram-filled",
  "instagram-outlined",
  "messenger-filled",
  "messenger-outlined",
  "tiktok-filled",
  "tiktok-outlined",
  "x-filled",
  "x-outlined",
];
const colorConfigurations = [
  {
    red: "filter: invert(18%) sepia(100%) saturate(6385%) hue-rotate(359deg) brightness(92%) contrast(122%);",
  },
  {
    yellow:
      "filter: invert(90%) sepia(91%) saturate(6811%) hue-rotate(359deg) brightness(107%) contrast(101%);",
  },
  {
    blue: "filter: invert(9%) sepia(100%) saturate(7207%) hue-rotate(248deg) brightness(89%) contrast(144%);",
  },
  {
    black:
      "filter: invert(0%) sepia(79%) saturate(14%) hue-rotate(316deg) brightness(91%) contrast(100%);",
  },
];

const colorArr = ["red", "yellow", "blue", "black"]

let promptText;
let config;
let colorSelect, icon, shape

const startBox = document.getElementById("start");
const numTrials = 5;
let totalHit = 0;
let totalTrial = 0;
let startTime;
let arrayOfTimes = [];
let accuracy;

startButton.addEventListener("click", () => {
  config = getConfiguration();
  startBox.style.display = "none";
  iconContainer.style.display = "flex";
  displayPrompt();
  nextTrial();
});

iconContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("target")) totalHit++;
  endTime = new Date();
  arrayOfTimes.push(endTime - startTime);
  iconContainer.innerHTML = ``;
  totalTrial++;
  nextTrial();
});

function displayPrompt() {
  const iconName = config.icon.charAt(0).toUpperCase() + config.icon.slice(1);
  const promptText = document.createElement("h1");
  promptText.classList.add("prompt");
  promptText.textContent = `Click the ${iconName} icon`;
  promptCont.appendChild(promptText);
}

function displayIcons() {
  const iconNames = ["facebook", "messenger", "instagram", "tiktok", "x"];
  const shuffledIcons = shuffleIcons(iconNames);

  shuffledIcons.forEach((iconName) => {
    const icon = document.createElement("img");
    icon.src = `resources/images/${iconName}-${config.shape}.svg`;
    icon.classList.add("icon");
    icon.style.cssText = Object.values(config.color)[0]; //color value
    if (iconName === config.icon) {
      icon.classList.add("target");
    }
    icon.style.fontSize = "3.5em";
    icon.style.cursor = "pointer";
    iconContainer.appendChild(icon);
  });
}

function getConfiguration() {
  colorSelect = document.getElementById("color").value;
  shapeSelect = document.getElementById("shape").value;
  const configSplit = shapeSelect.split("-");
  icon = configSplit[0];
  shape = configSplit[1];

  return { color: colorConfigurations[colorSelect], icon: icon, shape: shape };
}

function shuffleIcons(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function nextTrial() {
  if (totalTrial < numTrials) {
    startTime = new Date();
    displayIcons();
  } else done();
}

function done() {
  accuracy = (totalHit / numTrials) * 100;

  let finalTimes = "",
    i;
  for (i = 0; i < arrayOfTimes.length; i++) {
    if (i === arrayOfTimes.length - 1) {
      finalTimes += arrayOfTimes[i] + "ms";
    } else {
      finalTimes += arrayOfTimes[i] + "ms, ";
    }
  }

  resultsContainer.innerHTML = `
        <h3>Test Results</h3>
        Times: ${finalTimes}<br>
        Accuracy = ${accuracy}%
    `;
  resultsContainer.style.display = "block";
  iconContainer.style.display = "none";
  saveToCsv();
}

//csv file is created and ready to download
function saveToCsv() {
  var encodedUri, link;
  let csvContent = "data:text/csv;charset=utf-8,TestResults,\n";
  csvContent += colorArr[colorSelect] + "," + "\r\n";
  csvContent += icon + "," + "\r\n";
  csvContent += shape + "," + "\r\n";
  arrayOfTimes.forEach(function (infoArray) {
    let row = infoArray + ",";
    csvContent += row + "\r\n";
  });

  csvContent += `${accuracy}\r\n`;
  encodedUri = encodeURI(csvContent);

  link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "testResults.csv");
  document.body.appendChild(link);
  link.click();
}
