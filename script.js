let promptArea = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#img");
let imagee = document.querySelector("#img img");
let imageInput = document.querySelector("#img input");

const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDOsbQHrWD6FgdMB0UTjOcYh7NNJpYMRXg";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

// Function to generate AI response
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".AI-chat-area");
    let requestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{
                "parts": [{ "text": user.message },
                (user.file.data ? [{ "inline_data": user.file }] : [])]
            }]
        })
    }
    try {
        let response = await fetch(api_url, requestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    }
    catch (error) {
        console.log(error);
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        imagee.src = `img.svg`;
        imagee.classList.remove("choose");
        user.file = " ";
    }
}

// Function to create new chat box
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

// Function to handle chat response
function handleChatResponse(userMessage) {
    user.message = userMessage;
    let html = ` <img id="userimg" src="useric.png" alt="userImage" width="8%">
           <div class="user-chat-area"> ${user.message} 
           ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
           </div> `;

    let userChatBox = createChatBox(html, "user-chatbox");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let html = `<img id="aiimg" src="ai img.png" alt="AIimage" width="10%">
            <div class="AI-chat-area">
              <img class="load" src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="loading..." width="20px">
            </div> `;

        let aiChatBox = createChatBox(html, "AI-chatbox");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}

// Event listener for "Enter" key
promptArea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && promptArea.value.trim() !== "") {
        handleChatResponse(promptArea.value);
        promptArea.value = " ";
    }
});

// Event listener for image input change
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        imagee.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        imagee.classList.add("choose");
    };
    reader.readAsDataURL(file);
});

// Event listener for image button
imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click();
});

// Event listener for submit button (arrow button)
document.querySelector("#submit").addEventListener("click", () => {
    let message = promptArea.value.trim();
    if (message !== "") {
        handleChatResponse(message);
        promptArea.value = " ";
    }
});
