let people = [];
let customItems = [];
let tax = 0;
let gratuity = 0;
let customFee = 0;
let subtotal = 0;



function showStep(stepNumber) {
    const slider = document.getElementById('tabSlider');
    const steps = [document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3')];
    const tabs = [document.getElementById('tab-step1'), document.getElementById('tab-step2'), document.getElementById('tab-step3')];

    // Hide all steps and deactivate all tabs
    steps.forEach((step, index) => {
        step.style.display = index === stepNumber - 1 ? 'block' : 'none';
        tabs[index].classList.remove('active', 'inactive');
        tabs[index].classList.add(index === stepNumber - 1 ? 'active' : 'inactive');
    });

    // Move slider according to step number (translateX by stepNumber * 100%)
    slider.style.transform = `translateX(${(stepNumber - 1) * 100}%)`;
}


// Handle next and back button clicks
document.getElementById('nextStep1').onclick = function () {
    calculateSubtotal();
    displaySubtotal();
    // Move to Step 2 and activate the tab
    document.getElementById('tab-step2').disabled = false; // Enable Step 2 tab
    showStep(2); // Go to step 2
};

document.getElementById('backStep2').onclick = function () {
    // Move back to Step 1
    showStep(1); // Go to step 1
};

document.getElementById('nextStep2').onclick = function () {
    // Capture tax, gratuity, and fees
    tax = parseFloat(document.getElementById('taxInput').value) || 0;
    gratuity = parseFloat(document.getElementById('gratuityInput').value) || 0;
    customFee = parseFloat(document.getElementById('customFeeInput').value) || 0;

    // Move to Step 3 and activate the tab
    document.getElementById('tab-step3').disabled = false; // Enable Step 3 tab
    displayFinalBill();
    showStep(3); // Go to step 3
};

document.getElementById('backStep3').onclick = function () {
    // Move back to Step 2
    showStep(2); // Go to step 2
};

// Initialize by showing step 1
showStep(1);








// Person Management

// Show/hide the add person form
document.getElementById('openPersonForm').onclick = function () {
    const personForm = document.getElementById('addPersonForm');
    personForm.style.display = personForm.style.display === 'none' ? 'flex' : 'none';
    document.getElementById('personNameInput').focus(); 

};

// Handle submit person action
document.getElementById('submitPerson').onclick = function () {
    let personName = document.getElementById('personNameInput').value;
    if (personName) {
        people.push({ name: personName, items: [] });
        displayPeople();
        document.getElementById('personNameInput').value = ''; // Clear the input field
        document.getElementById('addPersonForm').style.display = 'none'; // Hide form after submission
    }
};


// Show/hide the add shared item form
document.getElementById('openSharedItemForm').onclick = function () {
    const sharedItemForm = document.getElementById('addSharedItemForm');
    sharedItemForm.style.display = sharedItemForm.style.display === 'none' ? 'block' : 'none';
    displayCustomItemPeople(); // Update people list inside shared item form
};

// Handle submit shared item action
document.getElementById('submitCustomItem').onclick = function () {
    let itemName = document.getElementById('customItemNameInput').value;
    let itemPrice = parseFloat(document.getElementById('customItemPriceInput').value);
    let selectedPeople = [];
    people.forEach((person, index) => {
        if (document.getElementById(`person-${index}`).checked) {
            selectedPeople.push(index);
        }
    });

    if (itemName && !isNaN(itemPrice) && selectedPeople.length > 0) {
        customItems.push({ name: itemName, price: itemPrice, people: selectedPeople });
        document.getElementById('customItemNameInput').value = '';
        document.getElementById('customItemPriceInput').value = '';
        document.getElementById('addSharedItemForm').style.display = 'none'; // Hide form after submission
        displayCustomItems(); // Re-render custom items for each person
    }
};

// Update the people list in the shared item form
function displayCustomItemPeople() {
    let customItemPeopleList = document.getElementById('customItemPeopleList');
    customItemPeopleList.innerHTML = '';
    people.forEach((person, index) => {
        customItemPeopleList.innerHTML += `
            <input type="checkbox" id="person-${index}" value="${index}">
            <label for="person-${index}">${person.name}</label><br>`;
    });
}

// Display people (and their items) in the people list
function displayPeople() {
    let peopleList = document.getElementById('people-list');
    peopleList.innerHTML = ''; // Clear the existing list

    people.forEach((person, index) => {
        let personDiv = document.createElement('div');
        personDiv.classList = "personCard";
        personDiv.innerHTML = `
            <p>${person.name}</p>
            <div id="items-${index}"></div><br><br>
            <button class="button-57" onclick="showItemForm(${index})">+ Add Item</button><br>
            <div id="addItemForm-${index}" style="display:none; flex-direction:column;">
                <input type="text" id="itemNameInput-${index}" placeholder="Enter item name" class="input-1" autofocus>
                <input type="number" id="itemPriceInput-${index}" placeholder="Enter item price" class="input-1">
                <button onclick="submitItem(${index})" class="button-57">Submit Item</button>
            </div>
        `;
        peopleList.appendChild(personDiv);
        displayItems(index);
    });
}

// Show the item form for a specific person
// Show or hide the item form for a specific person and set focus on item name input
function showItemForm(personIndex) {
    let itemForm = document.getElementById(`addItemForm-${personIndex}`);
    
    if (itemForm) {
        // Toggle form visibility
        let isHidden = (itemForm.style.display === 'none' || !itemForm.style.display);
        itemForm.style.display = isHidden ? 'flex' : 'none';
        
        // If the form is being shown, focus on the Item Name input field
        if (isHidden) {
            let itemNameInput = document.getElementById(`itemNameInput-${personIndex}`);
            if (itemNameInput) {
                itemNameInput.focus();
            }
        }
    }
}


// Handle submitting an item to a person
function submitItem(personIndex) {
    let itemName = document.getElementById(`itemNameInput-${personIndex}`).value;
    let itemPrice = parseFloat(document.getElementById(`itemPriceInput-${personIndex}`).value);
    
    if (itemName && !isNaN(itemPrice)) {
        people[personIndex].items.push({ name: itemName, price: itemPrice });
        
        // Clear input fields
        document.getElementById(`itemNameInput-${personIndex}`).value = '';
        document.getElementById(`itemPriceInput-${personIndex}`).value = '';
        
        // Hide the form after submission
        document.getElementById(`addItemForm-${personIndex}`).style.display = 'none';
        
        // Call displayItems to re-render the UI
        displayItems(personIndex); 
    }
}


// Display items for a specific person (including the delete button)
function displayItems(personIndex) {
    let itemsDiv = document.getElementById(`items-${personIndex}`);
    let person = people[personIndex];
    
    if (!itemsDiv) {
        return; // Ensure the div exists before trying to modify it
    }

    itemsDiv.innerHTML = ''; // Clear previous items

    // Display personal items with delete functionality
    person.items.forEach((item, itemIndex) => {
        itemsDiv.innerHTML += `
        <div style="display: flex; flex-direction: row; gap: 2rem; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 0.8rem; flex-grow: 1;">
                ${item.name}:
            </div>
            <div style="font-size: 0.8rem; text-align: right; min-width: 80px;">
                $${item.price.toFixed(2)}
            </div>
            <div style="display: flex; gap: 1rem; font-size: 1rem;">
                <button class="button-47" onclick="editItem(${personIndex}, ${itemIndex})">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="button-47" onclick="deleteItem(${personIndex}, ${itemIndex})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });

    // Display shared items for this person (if any)
    displayCustomItems(); // Re-render custom shared items
};


// Delete a personal item for a specific person
function deleteItem(personIndex, itemIndex) {
    people[personIndex].items.splice(itemIndex, 1); // Remove the item from the person's list
    displayItems(personIndex); // Re-render the updated items list
};

// Show edit fields for personal items
function editItem(personIndex, itemIndex) {
    let item = people[personIndex].items[itemIndex];
    let itemsDiv = document.getElementById(`items-${personIndex}`);

    // Replace the item text with input fields for editing
    itemsDiv.innerHTML = `
        <input type="text" id="editItemName-${personIndex}-${itemIndex}" value="${item.name}" class="input-1">
        <input type="number" id="editItemPrice-${personIndex}-${itemIndex}" value="${item.price}" class="input-1">
        <button class="button-57" onclick="submitEditItem(${personIndex}, ${itemIndex})">Save</button>
    `;
}

// Save the edited personal item
function submitEditItem(personIndex, itemIndex) {
    let newItemName = document.getElementById(`editItemName-${personIndex}-${itemIndex}`).value;
    let newItemPrice = parseFloat(document.getElementById(`editItemPrice-${personIndex}-${itemIndex}`).value);

    if (newItemName && !isNaN(newItemPrice)) {
        people[personIndex].items[itemIndex] = { name: newItemName, price: newItemPrice };
        displayItems(personIndex); // Re-render the updated items
    }
}



// Display shared items for each person
function displayCustomItems() {
    console.log("custom items", customItems);
    if (customItems.length === 0) {
        return; // No custom items, so exit the function early
    }

    people.forEach((person, personIndex) => {
        let sharedItemsDiv = document.getElementById(`sharedItems-${personIndex}`);

        if (!sharedItemsDiv) return; // Ensure the container exists before updating it

        sharedItemsDiv.innerHTML = ''; // Clear previous shared items

        // Add shared items for the current person
        customItems.forEach((customItem, customItemIndex) => {
            if (customItem.people.includes(personIndex)) {
                let sharedItemShare = (customItem.price / customItem.people.length).toFixed(2);
                sharedItemsDiv.innerHTML += `
                    <div>
                        Shared: ${customItem.name} - $${sharedItemShare} (Your Share)
                        <button onclick="editSharedItem(${customItemIndex})">Edit</button>
                        <button onclick="deleteSharedItem(${customItemIndex})">Delete</button>
                    </div>
                `;
            }
        });
    });

}



// Show edit fields for shared items
function editSharedItem(customItemIndex) {
    let customItem = customItems[customItemIndex];
    
    // Show input fields for editing the shared item name and price
    let sharedItemForm = document.getElementById('addSharedItemForm');
    sharedItemForm.innerHTML = `
        <input type="text" id="editSharedItemName-${customItemIndex}" value="${customItem.name}" class="input-1">
        <input type="number" id="editSharedItemPrice-${customItemIndex}" value="${customItem.price}" class="input-1">
        <button onclick="submitEditSharedItem(${customItemIndex})">Save</button>
    `;
    sharedItemForm.style.display = 'block'; // Display the shared item form for editing
}

// Save the edited shared item
function submitEditSharedItem(customItemIndex) {
    let newSharedItemName = document.getElementById(`editSharedItemName-${customItemIndex}`).value;
    let newSharedItemPrice = parseFloat(document.getElementById(`editSharedItemPrice-${customItemIndex}`).value);

    if (newSharedItemName && !isNaN(newSharedItemPrice)) {
        customItems[customItemIndex].name = newSharedItemName;
        customItems[customItemIndex].price = newSharedItemPrice;
        displayPeople();    
    }
}

// Delete a shared item from all people
function deleteSharedItem(customItemIndex) {
    customItems.splice(customItemIndex, 1); // Remove the shared item from the customItems array
    displayPeople();
}






// Subtotal Calculation and Display
function calculateSubtotal() {
    subtotal = 0;
    people.forEach(person => {
        person.items.forEach(item => {
            subtotal += item.price;
        });
    });

    customItems.forEach(item => {
        subtotal += item.price;
    });
}

function displaySubtotal() {
    document.getElementById('subtotalDisplay').innerHTML = `Subtotal: $${subtotal.toFixed(2)}`;
}

// Final Bill Calculation and Display

function displayFinalBill() {
    let resultDiv = document.getElementById('finalBill');
    let singleResultDiv = document.getElementById('seperateBill');
    let costBreakdown = document.getElementById('costBreak');

    resultDiv.style.display = 'block';
    singleResultDiv.style.display = 'flex';

    singleResultDiv.innerHTML = ''; 
    costBreakdown.innerHTML = ''; 

    let totalTax = subtotal * (tax / 100);
    let totalGratuity = subtotal * (gratuity / 100);
    let totalCustomFee = customFee;
    let grandTotal = subtotal + totalTax + totalGratuity + totalCustomFee;

    let costsTitle = document.createElement('h3');
    costsTitle.textContent = 'Costs Breakdown:';
    costBreakdown.appendChild(costsTitle);

    let subtotalPara = document.createElement('p');
    subtotalPara.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    costBreakdown.appendChild(subtotalPara);

    let taxPara = document.createElement('p');
    taxPara.textContent = `Tax (at ${tax}%): $${totalTax.toFixed(2)}`;
    costBreakdown.appendChild(taxPara);

    let gratuityPara = document.createElement('p');
    gratuityPara.textContent = `Gratuity/Tips (at ${gratuity}%): $${totalGratuity.toFixed(2)}`;
    costBreakdown.appendChild(gratuityPara);

    let feePara = document.createElement('p');
    feePara.textContent = `Custom Shared Fee: $${totalCustomFee.toFixed(2)}`;
    costBreakdown.appendChild(feePara);

    let hr = document.createElement('hr');
    costBreakdown.appendChild(hr);

    let grandTotalPara = document.createElement('h3');
    grandTotalPara.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
    costBreakdown.appendChild(grandTotalPara);


    let personTotals = {};

    people.forEach((person, index) => {
        let personItemTotal = person.items.reduce((total, item) => total + item.price, 0);
        personTotals[person.name] = {
            items: person.items,
            itemTotal: personItemTotal,
            tax: personItemTotal * (tax / 100),
            gratuity: personItemTotal * (gratuity / 100),
            customFee: totalCustomFee / people.length,
            total: 0
        };
    });

    customItems.forEach(item => {
        let share = item.price / item.people.length;
        item.people.forEach(personIndex => {
            personTotals[people[personIndex].name].itemTotal += share;
            personTotals[people[personIndex].name].tax += share * (tax / 100);
            personTotals[people[personIndex].name].gratuity += share * (gratuity / 100);
        });
    });

    people.forEach((person, index) => {
        let personTotal = personTotals[person.name];
        personTotal.total = personTotal.itemTotal + personTotal.tax + personTotal.gratuity + personTotal.customFee;

        let breakdownDiv = document.createElement('button');
        breakdownDiv.className = 'button-67';

        let personHeader = document.createElement('h4');
        personHeader.textContent = `${person.name}'s Breakdown`;

        // let showButton = document.createElement('button');
        // showButton.textContent = 'Show Breakdown';
        // showButton.id = `showBreakdown-${index}`;
        // showButton.classList = "showBreakdown";

        let breakdownDetails = document.createElement('div');
        breakdownDetails.id = `billBreakDown-${index}`;
        breakdownDetails.style.display = 'none';
        breakdownDetails.classList = "billBreakdown";

        let itemList = document.createElement('ol');
        personTotal.items.forEach(item => {
            let itemLi = document.createElement('li');
            itemLi.textContent = `${item.name}: $${item.price.toFixed(2)}`;
            itemList.appendChild(itemLi);
            
        });

        breakdownDetails.appendChild(itemList);

        customItems.forEach(customItem => {
            if (customItem.people.includes(index)) {
                let sharedItemShare = (customItem.price / customItem.people.length).toFixed(2);
                let sharedItemLi = document.createElement('li');
                sharedItemLi.textContent = `Shared: ${customItem.name} - $${sharedItemShare} (Your Share)`;
                breakdownDetails.appendChild(sharedItemLi);
            }
        });

        breakdownDetails.innerHTML += `
        <div class="breakdownTotal">
            <small>Items Total: $${personTotal.itemTotal.toFixed(2)}</small>
            <small>Tax: $${personTotal.tax.toFixed(2)}</small>
            <small>Gratuity/Tips: $${personTotal.gratuity.toFixed(2)}</small>
            <small>Custom Fee: <bold> $${personTotal.customFee.toFixed(2)}<bold></small>
        `;

        let totalPara = document.createElement('p');
        totalPara.innerHTML = `<strong>Total: $${personTotal.total.toFixed(2)}</strong>`;

        breakdownDiv.appendChild(personHeader);
        // breakdownDiv.appendChild(showButton);
        breakdownDiv.appendChild(breakdownDetails);
        breakdownDiv.appendChild(totalPara);

        singleResultDiv.appendChild(breakdownDiv);

        breakdownDiv.addEventListener('click', function () {
            if (breakdownDetails.style.display === 'none') {
                breakdownDetails.style.display = 'block';
            } else {
                breakdownDetails.style.display = 'none';
            }
        });
    });
}

document.getElementById('resetApp').onclick = function () {
    location.reload();
};
