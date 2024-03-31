const numbers = Array.from({ length: 5 }, (_, i) => i + 1);

const iconContainer = document.getElementById("iconContainer");
const startButton = document.getElementById("start_button");
const resultsContainer = document.getElementById("results");
const promptCont = document.getElementById("prompt-cont");
const notifyCont = document.getElementById("notify");
const nextBtnCont = document.getElementById("next-button")
const pname = document.getElementById("name");
const type = document.getElementById("type");

const shapeConfigurations = [
  "facebook-filled",
  "facebook-outlined",
  "instagram-filled",
  "instagram-outlined",
  "tiktok-filled",
  "tiktok-outlined",
  "x-filled",
  "x-outlined",
];
const colorConfigurations = {
  red: "filter: invert(18%) sepia(100%) saturate(6385%) hue-rotate(359deg) brightness(92%) contrast(122%);",
  yellow:
      "filter: invert(90%) sepia(91%) saturate(6811%) hue-rotate(359deg) brightness(107%) contrast(101%);",
      blue: "filter: invert(9%) sepia(100%) saturate(7207%) hue-rotate(248deg) brightness(89%) contrast(144%);",
}

let nextButton;
let promptText;
const startBox = document.getElementById("start");
const numTrials = 5;
let totalHit = 0;
let totalTrial = 0;
let startTime;
let arrayOfTimes = [];
let accuracy;

let clickPromiseResolve;

startButton.addEventListener("click", async () => {
  let config;
  let iconName;
  const icons = ["facebook", "instagram", "tiktok", "x"]
  const iconsTemp = [... icons]
  const colorArr = ["red", "yellow", "blue"]
  const colorArrTemp = [... colorArr]
  const shapeArr = ["filled", "outlined"]
  const shapeArrTemp = [... shapeArr]
  const configs = colorArr.concat(shapeArr)
  let configsShuffled
  let allData = []; 

  startBox.style.display = "none";
  iconContainer.style.display = "flex";
 

  for (i=0;i<icons.length;i++) {
    notifyCont.innerHTML=''
    nextBtnCont.innerHTML=''

    iconName = icons[i]
    configsShuffled = shuffleArr(configs);

    displayPrompt(iconName)
    for (j=0;j<configsShuffled.length; j++) {
      totalHit = 0;
      totalTrial = 0;
      startTime = 0;
      endTime = 0;
      arrayOfTimes = [];
      accuracy = 0;

      config = configsShuffled[j]
      // console.log(iconName + config)
      for(k=0; k<5; k++) {
        startTime = new Date()
        displayIcons(iconName, config, iconsTemp, colorArrTemp, shapeArrTemp)
        await waitForClick()
      }
      accuracy = (totalHit / numTrials) * 100;
      allData.push({ iconName, config, arrayOfTimes, accuracy });
      // console.log(allData)
    }
    promptCont.innerHTML=''
    displayNotification(iconName)
    await waitForClick() 
  }
  goodbye()
  generateCsv(allData);
 });

 function waitForClick() {
  return new Promise(resolve => {
    clickPromiseResolve = resolve;
  });
}

function goodbye() {
  notifyCont.innerHTML=''
  nextBtnCont.innerHTML=''
  notifyCont.textContent="Thank you for your time and participation :D."
}

nextBtnCont.addEventListener("click", (e) => {
  clickPromiseResolve();
})

iconContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("target")) totalHit++;
  endTime = new Date();
  arrayOfTimes.push(endTime - startTime);
  iconContainer.innerHTML = ``;
  clickPromiseResolve();
});

function generateCsv(allData) {
  const fileName = (pname.value === "" ? "testResult" : pname.value) + "_" + type.value;
  let csvContent = "TestResults,\n";
  csvContent += "Icon,Config,Time (ms),Accuracy (%),\n";
  allData.forEach((data) => {
    csvContent += `${data.iconName},${data.config},`;
    data.arrayOfTimes.forEach((time) => {
      csvContent += `${time},`;
    });
    csvContent += `${data.accuracy}\n`;
  });

  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  // Create a temporary link to trigger the download
  const link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", `${fileName}.csv`);

  // Append the link to the document and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
}


function displayPrompt(icon) {
  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
  promptCont.textContent = `Click the ${iconName} icon`;
}

async function displayNotification(icon) {
  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
  notifyCont.textContent=`Test for ${iconName} is done.`
  nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextBtnCont.appendChild(nextButton)
}

function displayIcons(iconName, config, icons, colorArr, shapeArr ) {
  const shuffledIcons = shuffleArr(icons);
  let shapeShuffle
  let colorShuffle
  let indexShuffle

  shuffledIcons.forEach((currIcon) => {
    const iconCont = document.createElement("img");
    if(currIcon === iconName) {
      iconCont.classList.add("target");
      if (shapeArr.includes(config)) {
        iconCont.src = `resources/images/${currIcon}-${config}.svg`
      } else {
        iconCont.src = `resources/images/${currIcon}-filled.svg`;
        iconCont.style.cssText = colorConfigurations[config]; 
      }
    } else {
      //randomzie
      if(shapeArr.includes(config)) {
        shapeShuffle = shuffleArr(shapeArr)
        indexShuffle = shuffleArr(shapeArr.length - 1)
        iconCont.src = `resources/images/${currIcon}-${shapeShuffle[indexShuffle]}.svg`
      } else {
        colorShuffle = shuffleArr(colorArr)
        indexShuffle = shuffleArr(colorArr.length - 1)
        iconCont.src = `resources/images/${currIcon}-filled.svg`;
        iconCont.style.cssText = colorConfigurations[colorShuffle[indexShuffle]]; 
      }
    }

    iconCont.classList.add("icon");
    iconCont.style.fontSize = "3.5em";
    iconCont.style.cursor = "pointer";
    iconContainer.appendChild(iconCont);
  });
}

function shuffleArr(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

