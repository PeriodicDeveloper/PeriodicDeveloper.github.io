console.log("Welcome to PeriodicDeveloper's Homepage!");
const SHOWCASE = document.getElementById("showcase");

function generateCard(titleText, textDesc, imgSrc, url) {
	let card = document.createElement("div");
	card.classList.add("projectCard");

	let thumbnail = document.createElement("img");
	thumbnail.setAttribute("src", imgSrc);
	thumbnail.classList.add("thumbnail");

	let textBox = document.createElement("div");
	textBox.classList.add("textBox");

	let title = document.createElement("h3");
	title.textContent = titleText;
	title.classList.add("cardTitle");

	let description = document.createElement("p");
	description.textContent = textDesc;
	title.classList.add("cardDesc");
	
	let anchor = document.createElement("a");
	anchor.setAttribute("href", url);
	anchor.classList.add("projectLink");

	textBox.append(title, description);
	card.append(thumbnail, textBox);
	anchor.append(card);

	SHOWCASE.append(anchor);
}
const PROJECTS = [
	{
		title: "Tetris JS",
		description: "Minimal version of Tetris, written in JavaScript",
		thumbnail: "img/TetrisJS.webp",
		url: "TetrisJS/",
	},
	{
		title: "Game of Life",
		description: "Conway's game of life, with color indicating cell age",
		thumbnail: "img/GameOfLife.webp",
		url: "GameOfLife/",
	},
	{
		title: "Ice Skating Guy in Hat",
		description: "Control an army of RGB ice skating men in Asian hats!",
		thumbnail: "img/IceSkatingGuyInHat.webp",
		url: "IceSkatingGuyInHat/",
	}
];

for(let project of PROJECTS) {
	generateCard(project.title, project.description, project.thumbnail, project.url);
}
