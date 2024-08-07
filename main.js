console.log("Welcome to PeriodicDeveloper's Homepage!");
const SHOWCASE = document.getElementById("showcase");

function generateCard(titleText, textDesc, imgSrc, url) {
	let card = document.createElement("div");
	card.classList.add("projectCard");

	let thumbnail = document.createElement("img");
	thumbnail.setAttribute("src", imgSrc);
	thumbnail.classList.add("thumb");

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

	textBox.append(title, description);
	card.append(thumbnail, textBox);
	anchor.append(card);

	SHOWCASE.append(anchor);
}
const PROJECTS = [
	{
		title: "TetrisJS",
		description: "Minimal version of Tetris, written in JavaScript",
		thumbnail: "img/TetrisJS.webp",
		url: "TetrisJS/",
	}
];

for(let project of PROJECTS) {
	generateCard(project.title, project.description, project.thumbnail, project.url);
}
