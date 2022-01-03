const skillList = document.getElementById("skillList")
const searchBar = document.getElementById("searchBar")
let hpSkills = []
var fullLoad = false

const searchSkills = (e) => {
	const searchString = searchBar.value.toLowerCase()
	const filteredSkills = hpSkills.filter((skill) => {
		return (
			skill.name.toLowerCase().includes(searchString) ||
			skill.id.toLowerCase().includes(searchString) ||
			skill.category?.toLowerCase()?.includes(searchString)
		)
	})
	const filteredSkillsReverse = hpSkills.filter((skill) => {
		return !(
			skill.name.toLowerCase().includes(searchString) ||
			skill.id?.toLowerCase()?.includes(searchString) ||
			skill.category?.toLowerCase()?.includes(searchString)
		)
	})
	filterSkills(filteredSkills, filteredSkillsReverse)
	if (filteredSkills.length !== 0) document.location.hash = searchString
}

searchBar.addEventListener("keyup", searchSkills)

const getSkill = (v = null) => {
	const searchString = v ?? searchBar.value.toLowerCase()
	return hpSkills.filter((skill) => {
		return (
			skill.name.toLowerCase().includes(searchString) ||
			skill.id.toLowerCase().includes(searchString) ||
			skill.category?.toLowerCase()?.includes(searchString)
		)
	})
}
const filterSkills = (skills, skillsReverse) => {
	skills.forEach((skill) => {
		document.getElementById(skill.id)?.classList?.remove("hide")
	})
	skillsReverse.forEach((skill) => {
		document.getElementById(skill.id)?.classList?.add("hide")
	})
}

const displayLevels = (skills, total, totalEndless) => {
	var text = ""
	skills.forEach((skill, i) => {
		text += `<p class="level">Level ${i + 1}${
			totalEndless !== undefined && i + 1 == skills.length ? "+" : ""
		}</p>`
		skill.effects.forEach((effect) => {
			text += `<p class="effect">${effect[0]}${typeof effect[1] === "number" ? "" : `: ${effect[1]}`}</p>`
		})
		skill.price.forEach((effect) => {
			text += `<p class="price">${effect[0]}: ${effect[1]}</p>`
		})
	})
	if (total !== undefined) {
		text += `<p class="level total">Total</p>`
		total.effects.forEach((effect) => {
			text += `<p class="effect total">${effect[0]}${
				typeof effect[1] === "number" ? "" : `: ${effect[1]}`
			}</p>`
		})
		total?.price?.forEach((effect) => {
			text += `<p class="price">${effect[0]}: ${effect[1]}</p>`
		})
	}
	if (totalEndless !== undefined) {
		text += `<p class="level totalEndless">Total Endless</p>`
		totalEndless.effects.forEach((effect) => {
			text += `<p class="effect totalEndless">${effect[0]}${
				typeof effect[1] === "number" ? "" : `: ${effect[1]}`
			}</p>`
		})
	}
	return text
}
const displaySkills = async (skills) => {
	if (!fullLoad) {
		const htmlString = await Promise.all(
			skills.map(async (skill, i) => {
				var x = ""
				x += `<div class="skill" id="${skill.id}">`
				x += `<h3>${skill.name}</h3>`
				x += "</div>"
				return x
			})
		)
		skillList.innerHTML = htmlString.join("")
	} else {
		skills.forEach((skill) => {
			var x = document.getElementById(skill.id).innerHTML
			document.getElementById(skill.id).classList.add(skill.category)
			// x += `<div class="skill ${skill.category}" id="${skill.id}">`
			// x += `<h3>${skill.name}</h3>`
			if (skill.description !== skill.name) x += `<p class="description">${skill.description}</p>`
			x += `<div class="images">`
			if (skill.endlessOnly) x += `<img src="images/icon-infinitode-2-logo.png" title="Endless only">`
			if (skill.maxEndlessModeLevels != 0 && !skill.endlessOnly)
				x += `<img src="images/icon-infinitode-1-logo.png" title="Extra levels in endless">`
			x += `</div>`
			if (skill.maxEndlessModeLevels == 0) x += `<p>Max level: ${skill.levelsTotal}</p>`
			else if (skill.endlessOnly) x += `<p>Max level: ${skill.maxEndlessModeLevels}</p>`
			else x += `<p>Max level: ${skill.levelsTotal}(+${skill.maxEndlessModeLevels})</p>`
			x += `<p type="button" class="collapsible">Expand</p>
				<div class="content">
					${displayLevels(skill.levels, skill.total, skill.totalEndless)}
				</div>`
			document.getElementById(skill.id).innerHTML = x
		})
		searchSkills()
		var coll = document.getElementsByClassName("collapsible")
		for (var i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function () {
				this.classList.toggle("active")
				var content = this.nextElementSibling
				if (content.style.display === "block") {
					this.innerHTML = "Expand"
					content.style.display = "none"
				} else {
					this.innerHTML = "Collapse"
					content.style.display = "block"
				}
			})
		}
	}
}
try {
	searchBar.value = (decodeURI(document.location.hash) ?? "#").substring(1)
} catch {
	searchBar.value = ""
}
const loadSkills = async () => {
	// try {
	const res = await fetch("researches_base.json")
	hpSkills = await res.json()
	hpSkills = hpSkills.map((skill) => {
		const x = {}
		x.name = skill.N
		x.id = skill.I
		return x
	})
	displaySkills(hpSkills)
	searchSkills()
	setTimeout(loadSkillsData, 2)
	// } catch (err) {
	//     console.error(err);
	// }
}
const loadSkillsData = async () => {
	const res = await fetch("researches.json")
	hpSkills = await res.json()
	setTimeout(loadSkillsCss, 10)
	hpSkills = hpSkills.map((skill) => {
		const x = {}
		x.levels = skill.L
		x.levelsTotal = skill.L.length
		x.name = skill.N
		x.maxEndlessModeLevels = skill.EM
		x.endlessOnly = skill.E ?? false
		x.category = skill.C
		x.description = skill.D
		x.id = skill.I
		x.total = skill.T
		x.totalEndless = skill.TE
		return x
	})
	fullLoad = true
	displaySkills(hpSkills)
	document.getElementById("data-download").style.display = "none"
}
//<link rel="stylesheet" href="researches.css" />;
const loadSkillsCss = async () => {
	var head = document.getElementsByTagName("head")[0]
	var link = document.createElement("link")
	link.rel = "stylesheet"
	// link.type = "text/css";
	link.href = "researches.css"
	head.appendChild(link)
}

window.addEventListener("load", (event) => {
	setTimeout(loadSkills, 5)
})
