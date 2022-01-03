// const loadSkills = async () => {
//     // try {
//         const res = await fetch("researches_base.json");
//         hpSkills = await res.json();
//         hpSkills = hpSkills.map((skill) => {
//             const x = {};
//             x.name = skill.N;
//             x.id = skill.I;
//             return x;
//         });
//     	displaySkills(hpSkills)
//         searchSkills()
//         setTimeout(loadSkillsData, 50);
//     // } catch (err) {
//     //     console.error(err);
//     // }
// };
const loadSkills = async () => {
	const res = await fetch("researches.json")
	hpSkills = await res.json()
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
	console.log(hpSkills[0])
	document.getElementById("data-download").style.display = "none"
}
const loadSkillsCss = async () => {
	var head = document.getElementsByTagName("head")[0]
	var link = document.createElement("link")
	link.rel = "stylesheet"
	link.href = "researches.css"
	head.appendChild(link)
}

window.addEventListener("load", (event) => {
	setTimeout(loadSkills, 5)
	setTimeout(loadSkillsCss, 10)
})
