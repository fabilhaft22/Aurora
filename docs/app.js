//basic commands

document.getElementById("basicToggleCommands").addEventListener("change", function() {
    let prefixCommands = document.querySelectorAll(".basicPrefix");
    let slashCommands = document.querySelectorAll(".basicSlash");
    let label = document.getElementById("basicToggleLabel");

    if (this.checked) {
        prefixCommands.forEach(cmd => cmd.classList.add("hidden"));
        slashCommands.forEach(cmd => cmd.classList.remove("hidden"));
        label.innerText = "Slash Commands";
    } else {
        prefixCommands.forEach(cmd => cmd.classList.remove("hidden"));
        slashCommands.forEach(cmd => cmd.classList.add("hidden"));
        label.innerText = "Prefix";
    }
});

document.getElementById("moderationToggleCommands").addEventListener("change", function() {
    let prefixCommands = document.querySelectorAll(".moderationPrefix");
    let slashCommands = document.querySelectorAll(".moderationSlash");
    let label = document.getElementById("moderationToggleLabel");

    if (this.checked) {
        prefixCommands.forEach(cmd => cmd.classList.add("hidden"));
        slashCommands.forEach(cmd => cmd.classList.remove("hidden"));
        label.innerText = "Slash Commands";
    } else {
        prefixCommands.forEach(cmd => cmd.classList.remove("hidden"));
        slashCommands.forEach(cmd => cmd.classList.add("hidden"));
        label.innerText = "Prefix";
    }
});