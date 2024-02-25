const numbers = Array.from({length: 8}, (_, i) => i + 1);

const iconContainer = document.getElementById('iconContainer');
const startButton = document.getElementById('start_button');

const startBox = document.getElementById('start');

startButton.addEventListener("click", () => {
    startBox.style.display = "none";
    numbers.forEach(number => {
        const icon = document.createElement('button');
        icon.classList.add('icon');
        icon.innerText = number;
        // Append the icon to the icon container
        iconContainer.appendChild(icon);
    });
})

console.log("hello")