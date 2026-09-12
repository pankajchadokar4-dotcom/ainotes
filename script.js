const topicInput = document.getElementById("topic");
const levelSelect = document.getElementById("level");
const lengthSelect = document.getElementById("length");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("output");
const themeBtn = document.getElementById("themeBtn");

generateBtn.addEventListener("click", generateNotes);
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
}
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.textContent = "☀️ Light Mode";

        localStorage.setItem("theme","dark");

    }else{

        themeBtn.textContent = "🌙 Dark Mode";

        localStorage.setItem("theme","light");

    }

});
async function generateNotes() {

    const topic = topicInput.value.trim();

    if (!topic) {
        output.innerText = "Please enter a topic.";
        return;
    }

    const level = levelSelect.value;
    const length = lengthSelect.value;

    output.innerText = "Generating notes...";

    const prompt = `
Generate study notes on ${topic}.

Difficulty Level: ${level}
Length: ${length}

Include:

1. Definition
2. Important Concepts
3. Key Points
4. Interview Questions
5. MCQs with Answers

Format properly using headings and bullet points.
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            output.innerText =
                data.error?.message || "Something went wrong.";
            return;
        }

        const notes =
            data.candidates[0].content.parts[0].text;

        output.innerText = notes;output.innerHTML = marked.parse(notes);

    } catch (error) {

        console.error(error);

        output.innerText =
            "Error connecting to Gemini API.";

    }


}