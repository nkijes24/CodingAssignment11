let loot = [];

let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");
let quantityInput = document.getElementById("quantity");
let partySizeInput = document.getElementById("partySize");
let addLootButton = document.getElementById("addLootButton");
let splitLootButton = document.getElementById("splitLootButton");
let lootRows = document.getElementById("lootRows");
let noLootMessage = document.getElementById("noLootMessage");
let totalLoot = document.getElementById("totalLoot");
let lootPerMember = document.getElementById("lootPerMember");
let totalsPanel = document.getElementById("totalsPanel");
let resultsSection = document.getElementById("resultsSection");
let message = document.getElementById("message");

addLootButton.addEventListener("click", addLoot);
splitLootButton.addEventListener("click", splitLoot);
partySizeInput.addEventListener("input", updateUI);

function addLoot() {
    let name = lootNameInput.value.trim();
    let value = Number(lootValueInput.value);
    let quantity = Number(quantityInput.value);

    // Validation protects the loot array so invalid data never becomes application state.
    if (name === "") {
        message.innerText = "Please enter a loot name.";
        return;
    }

    if (isNaN(value) || value < 0) {
        message.innerText = "Please enter a valid non-negative loot value.";
        return;
    }

    if (isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
        message.innerText = "Please enter a quantity of 1 or greater.";
        return;
    }

    let lootItem = {
        name: name,
        value: value,
        quantity: quantity
    };

    loot.push(lootItem);

    message.innerText = "";
    lootNameInput.value = "";
    lootValueInput.value = "";
    quantityInput.value = "";

    updateUI();
}

function removeLoot(index) {
    // splice changes the source-of-truth array, then updateUI reflects the new state.
    loot.splice(index, 1);
    message.innerText = "";
    updateUI();
}

function splitLoot() {
    // The split button exists for the assignment, but calculations stay centralized in updateUI.
    updateUI();
}

function updateUI() {
    let partySize = Number(partySizeInput.value);
    let partyIsValid = !isNaN(partySize) && partySize >= 1 && Number.isInteger(partySize);
    let hasLoot = loot.length > 0;
    let total = 0;

    lootRows.innerHTML = "";

    // This traditional for loop calculates total currency from the current loot state.
    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value * loot[i].quantity;
    }

    // This loop renders the list from state, so the screen matches the loot array.
    for (let i = 0; i < loot.length; i++) {
        let row = document.createElement("div");
        row.className = "loot-row";

        let nameCell = document.createElement("div");
        nameCell.className = "loot-cell";
        nameCell.innerText = loot[i].name;

        let valueCell = document.createElement("div");
        valueCell.className = "loot-cell";
        valueCell.innerText = loot[i].value.toFixed(2);

        let quantityCell = document.createElement("div");
        quantityCell.className = "loot-cell";
        quantityCell.innerText = loot[i].quantity;

        let actionCell = document.createElement("div");
        actionCell.className = "loot-cell loot-actions";

        let removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.type = "button";
        removeBtn.addEventListener("click", function () {
            removeLoot(i);
        });

        actionCell.appendChild(removeBtn);
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(quantityCell);
        row.appendChild(actionCell);
        lootRows.appendChild(row);
    }

    if (!partyIsValid) {
        message.innerText = "Please enter a valid party size of 1 or greater.";
    } else if (message.innerText === "Please enter a valid party size of 1 or greater.") {
        message.innerText = "";
    }

    if (hasLoot) {
        noLootMessage.classList.add("hidden");
        totalsPanel.classList.remove("hidden");
    } else {
        noLootMessage.classList.remove("hidden");
        totalsPanel.classList.add("hidden");
    }

    if (hasLoot && partyIsValid) {
        splitLootButton.disabled = false;
        resultsSection.classList.remove("hidden");
        lootPerMember.innerText = (total / partySize).toFixed(2);
    } else {
        splitLootButton.disabled = true;
        resultsSection.classList.add("hidden");
        lootPerMember.innerText = "0.00";
    }

    totalLoot.innerText = total.toFixed(2);
}

updateUI();
