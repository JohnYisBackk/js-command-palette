"use strict";

lucide.createIcons();

// ======================================================
// SELECT ELEMENTS
// ======================================================

const openPaletteBtn = document.querySelector("#openPaletteBtn");
const infoBtn = document.querySelector("#infoBtn");

const palettePreview = document.querySelector("#palettePreview");
const featuresSection = document.querySelector("#features");

const commandPaletteModal = document.querySelector("#commandPaletteModal");
const closePaletteBtn = document.querySelector("#closePaletteBtn");
const commandSearchInput = document.querySelector("#commandSearchInput");
const commandList = document.querySelector("#commandList");
const commandEmptyState = document.querySelector("#commandEmptyState");
const commandResultsCount = document.querySelector("#commandResultsCount");

// ======================================================
// DATA
// ======================================================

const commands = [
  {
    id: "dashboard",
    title: "Go to Dashboard",
    description: "Navigate to your workspace",
    icon: "layout-dashboard",
    category: "Navigation",
    shortcut: ["G", "D"],
  },
  {
    id: "features",
    title: "Explore Features",
    description: "Discover what's possible",
    icon: "layout-grid",
    category: "Navigation",
    shortcut: ["G", "F"],
  },
  {
    id: "github",
    title: "Open GitHub",
    description: "Visit the developer's profile",
    icon: "github",
    category: "Navigation",
    shortcut: ["G", "H"],
  },
  {
    id: "theme",
    title: "Toggle Theme",
    description: "Switch between dark and light mode",
    icon: "moon",
    category: "Quick Actions",
    shortcut: ["T"],
  },
  {
    id: "copy",
    title: "Copy Current URL",
    description: "Copy the page link to clipboard",
    icon: "copy",
    category: "Quick Actions",
    shortcut: ["C"],
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    description: "View available keyboard shortcuts",
    icon: "keyboard",
    category: "Quick Actions",
    shortcut: ["?"],
  },
];

// ======================================================
// STATE
// ======================================================

let searchTerm = "";
let filteredCommands = [...commands];
let activeCommandIndex = 0;
let pendingShortcut = "";
let currentTheme = "dark";

// ======================================================
// OPEN / CLOSE PALETTE
// ======================================================

function openPalette() {
  commandPaletteModal.showModal();

  document.body.style.overflow = "hidden";

  commandSearchInput.focus();
}

function closePalette() {
  commandPaletteModal.close();

  document.body.style.overflow = "";
}

// ======================================================
// FILTER COMMANDS
// ======================================================

function filterCommands() {
  searchTerm = commandSearchInput.value.toLowerCase().trim();

  filteredCommands = commands.filter((command) => {
    const matchTitle = command.title.toLowerCase().includes(searchTerm);
    const matchDescription = command.description
      .toLowerCase()
      .includes(searchTerm);

    return matchTitle || matchDescription;
  });

  activeCommandIndex = 0;
  renderCommands();
}

// ======================================================
// RENDER COMMANDS
// ======================================================

function renderCommands() {
  commandList.innerHTML = "";

  const count = filteredCommands.length;

  commandResultsCount.textContent = `${count} ${count === 1 ? "command" : "commands"}`;

  if (count === 0) {
    commandEmptyState.hidden = false;
  } else {
    commandEmptyState.hidden = true;
  }

  filteredCommands.forEach((command, index) => {
    const isActive = index === activeCommandIndex;

    const commandHTML = `
    <button type="button" 
      class="palette-command ${isActive ? "active" : ""}"
       data-command="${command.id}">

              <span class="palette-command-icon">
                <i data-lucide="${command.icon}"></i>
              </span>

              <span class="palette-command-info">
                <span class="palette-command-title">
                ${command.title}
                </span>
 
                <span class="palette-command-description">
                  ${command.description}
                </span>
              </span>

              <span class="palette-command-shortcut"> 
            ${command.shortcut
              .map((key) => {
                return `<kbd>${key}</kbd>`;
              })
              .join("")}
              </span>
    </button>
    `;

    commandList.insertAdjacentHTML("beforeend", commandHTML);
  });

  lucide.createIcons();
}

// ======================================================
// KEYBOARD NAVIGATION
// ======================================================

function navigateCommands(direction) {
  if (filteredCommands.length === 0) {
    return;
  }

  if (direction === "down") {
    activeCommandIndex++;
  } else if (direction === "up") {
    activeCommandIndex--;
  }

  if (activeCommandIndex >= filteredCommands.length) {
    activeCommandIndex = 0;
  } else if (activeCommandIndex < 0) {
    activeCommandIndex = filteredCommands.length - 1;
  }

  renderCommands();

  const activeButton = commandList.querySelector(".palette-command.active");

  activeButton?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}

// ======================================================
// EXECUTE COMMAND
// ======================================================

async function executeCommand(commandId) {
  switch (commandId) {
    case "dashboard":
      closePalette();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      break;

    case "features":
      closePalette();

      featuresSection.scrollIntoView({
        behavior: "smooth",
      });

      break;

    case "github":
      closePalette();

      window.open(
        "https://github.com/JohnYisBackk",
        "_blank",
        "noopener,noreferrer",
      );

      break;

    case "theme":
      closePalette();
      toggleTheme();

      break;

    case "copy":
      try {
        await navigator.clipboard.writeText(window.location.href);

        closePalette();

        alert("URL copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy URL:", error);

        alert("Failed to copy URL. Please try again.");
      }

      break;

    case "shortcuts":
      closePalette();

      alert(
        "Keyboard Shortcuts\n\n" +
          "Ctrl + K - Open Command Palette\n" +
          "ArrowDown - Next command\n" +
          "ArrowUp - Previous command\n" +
          "Enter - Execute command\n" +
          "Escape - Close Command Palette",
      );

      break;

    default:
      break;
  }
}

// ======================================================
// THEME MANAGEMENT
// ======================================================

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme();

  localStorage.setItem("commandPaletteTheme", currentTheme);
}

function applyTheme() {
  document.body.classList.toggle("light-mode", currentTheme === "light");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("commandPaletteTheme");

  currentTheme = savedTheme === "light" ? "light" : "dark";

  applyTheme();
}

// ======================================================
// EVENT LISTENERS
// ======================================================

openPaletteBtn.addEventListener("click", () => {
  openPalette();
});

closePaletteBtn.addEventListener("click", () => {
  closePalette();
});

commandPaletteModal.addEventListener("click", (event) => {
  const rect = commandPaletteModal.getBoundingClientRect();

  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    closePalette();
  }
});

commandPaletteModal.addEventListener("close", () => {
  document.body.style.overflow = "";
});

commandSearchInput.addEventListener("input", filterCommands);

commandSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();

    navigateCommands("down");
  } else if (event.key === "ArrowUp") {
    event.preventDefault();

    navigateCommands("up");
  } else if (event.key === "Enter") {
    event.preventDefault();

    const activeCommand = filteredCommands[activeCommandIndex];

    if (activeCommand) {
      executeCommand(activeCommand.id);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
    event.preventDefault();

    if (!commandPaletteModal.open) {
      openPalette();
    }
  }
});

commandList.addEventListener("click", (event) => {
  const button = event.target.closest(".palette-command");

  if (!button) return;

  const commandId = button.dataset.command;

  executeCommand(commandId);
});

document.addEventListener("keydown", (event) => {
  if (
    commandPaletteModal.open ||
    (event.target instanceof HTMLElement &&
      (event.target.matches("input, textarea, select") ||
        event.target.isContentEditable)) ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.repeat
  ) {
    pendingShortcut = "";
    return;
  }

  const key = event.key.toLowerCase();

  if (pendingShortcut === "g") {
    pendingShortcut = "";

    if (key === "d") {
      event.preventDefault();
      executeCommand("dashboard");
      return;
    } else if (key === "f") {
      event.preventDefault();
      executeCommand("features");
      return;
    } else if (key === "h") {
      event.preventDefault();
      executeCommand("github");
      return;
    }
  }

  if (key === "g") {
    pendingShortcut = "g";
    return;
  }

  if (key === "t") {
    event.preventDefault();
    executeCommand("theme");
  } else if (key === "c") {
    event.preventDefault();
    executeCommand("copy");
  } else if (key === "?") {
    event.preventDefault();
    executeCommand("shortcuts");
  }
});

infoBtn.addEventListener("click", () => {
  openPalette();
});

// ======================================================
// INITIALIZE APP
// ======================================================

function initApp() {
  loadTheme();
  renderCommands();
}

initApp();
