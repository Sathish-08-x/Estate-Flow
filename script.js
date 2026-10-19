const defaultLeads = [
    { name: "MS.Amith varma", type: "Buyer", interest: "Apartment", budget: "3cr", stage: "New", priority: "High", date: "4-11-27", phone: "*******895" },
    { name: "Aditya", type: "Seller", interest: "House", budget: "1.25cr", stage: "Contacted", priority: "Medium", date: "10-11-27", phone: "*******265" },
    { name: "Mokshagan", type: "Buyer", interest: "Apartment", budget: "2cr", stage: "New", priority: "Low", date: "16-03-27", phone: "*******746" },
    { name: "Sai praveen", type: "Seller", interest: "Condo", budget: "3.5 cr", stage: "New", priority: "High", date: "12-08-27", phone: "*******123" },
    { name: "Datta sai praveen", type: "Buyer", interest: "Condo", budget: "2.7cr", stage: "New", priority: "High", date: "12-09-28", phone: "*******121" },
    { name: "Shiva Sai", type: "Buyer", interest: "House", budget: "4cr", stage: "New", priority: "V.High", date: "14-06-28", phone: "*******437" },
    { name: "Bala Sai", type: "Seller", interest: "House", budget: "3.5 cr", stage: "Closed Won", priority: "High", date: "14-08-28", phone: "******894" }
];

let currentLeads = [];

function loadData() {
    try {
        const saved = localStorage.getItem("estateflow_leads_v3");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                currentLeads = parsed;
                return;
            }
        }
    } catch (e) {
    }
    currentLeads = JSON.parse(JSON.stringify(defaultLeads));
    saveData();
}

function saveData() {
    try {
        localStorage.setItem("estateflow_leads_v3", JSON.stringify(currentLeads));
    } catch (e) {
    }
}

function showToast(message) {
    const toast = document.getElementById("toastNotice");
    if (toast) {
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(function () {
            toast.style.display = "none";
        }, 2200);
    }
}

function getPriorityBadgeClass(priority) {
    if (priority === "High" || priority === "V.High") return "badge-high";
    if (priority === "Low") return "badge-low";
    return "badge-medium";
}

function getStageSelectClass(stage) {
    if (stage === "Closed Won") return "stage-won";
    if (stage === "Cancelled") return "stage-cancelled";
    if (stage === "In Negotiation") return "stage-negotiation";
    return "";
}

function renderAll() {
    const tableBody = document.getElementById("leadsTableBody");
    const cardsNew = document.getElementById("cardsNew");
    const cardsContacted = document.getElementById("cardsContacted");
    const cardsVisit = document.getElementById("cardsVisit");
    const cardsNegotiation = document.getElementById("cardsNegotiation");
    const cardsClosed = document.getElementById("cardsClosed");

    if (tableBody) tableBody.innerHTML = "";
    if (cardsNew) cardsNew.innerHTML = "";
    if (cardsContacted) cardsContacted.innerHTML = "";
    if (cardsVisit) cardsVisit.innerHTML = "";
    if (cardsNegotiation) cardsNegotiation.innerHTML = "";
    if (cardsClosed) cardsClosed.innerHTML = "";

    let cNew = 0, cContacted = 0, cVisit = 0, cNeg = 0, cClosed = 0;

    currentLeads.forEach(function (lead, index) {
        const priorityClass = getPriorityBadgeClass(lead.priority);
        const stageClass = getStageSelectClass(lead.stage);

        if (tableBody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${lead.name}</strong></td>
                <td><span class="badge-type">${lead.type}</span></td>
                <td>${lead.interest}</td>
                <td>${lead.budget}</td>
                <td>
                    <select class="stage-select ${stageClass}" onchange="changeLeadStageByIndex(${index}, this.value)">
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                        <option value="In Negotiation">In Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </td>
                <td><span class="badge ${priorityClass}">${lead.priority}</span></td>
                <td>${lead.date}</td>
                <td>${lead.phone}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn-save" onclick="saveLeadByIndex(${index}, this)">Save</button>
                        <button type="button" class="btn-delete" onclick="deleteLeadByIndex(${index})">Delete</button>
                    </div>
                </td>
            `;

            const selectEl = tr.querySelector(".stage-select");
            if (selectEl) {
                selectEl.value = lead.stage;
            }

            tableBody.appendChild(tr);
        }

        const card = document.createElement("div");
        card.className = "pipeline-card";
        card.innerHTML = `
            <h5>${lead.name}</h5>
            <p>${lead.interest} • ${lead.budget}</p>
            <span class="badge ${priorityClass}">${lead.priority}</span>
        `;

        if (lead.stage === "New") {
            if (cardsNew) cardsNew.appendChild(card);
            cNew++;
        } else if (lead.stage === "Contacted") {
            if (cardsContacted) cardsContacted.appendChild(card);
            cContacted++;
        } else if (lead.stage === "Site Visit Scheduled") {
            if (cardsVisit) cardsVisit.appendChild(card);
            cVisit++;
        } else if (lead.stage === "In Negotiation") {
            if (cardsNegotiation) cardsNegotiation.appendChild(card);
            cNeg++;
        } else if (lead.stage === "Closed Won") {
            if (cardsClosed) cardsClosed.appendChild(card);
            cClosed++;
        }
    });

    const countNew = document.getElementById("countNew");
    const countContacted = document.getElementById("countContacted");
    const countVisit = document.getElementById("countVisit");
    const countNegotiation = document.getElementById("countNegotiation");
    const countClosed = document.getElementById("countClosed");

    if (countNew) countNew.textContent = cNew;
    if (countContacted) countContacted.textContent = cContacted;
    if (countVisit) countVisit.textContent = cVisit;
    if (countNegotiation) countNegotiation.textContent = cNeg;
    if (countClosed) countClosed.textContent = cClosed;

    const totalLeadsCounter = document.getElementById("totalLeadsCount");
    const metricVisits = document.getElementById("metricVisits");
    const metricNegotiation = document.getElementById("metricNegotiation");
    const metricClosed = document.getElementById("metricClosed");

    if (totalLeadsCounter) totalLeadsCounter.textContent = currentLeads.length;
    if (metricVisits) metricVisits.textContent = cVisit;
    if (metricNegotiation) metricNegotiation.textContent = cNeg;
    if (metricClosed) metricClosed.textContent = cClosed;
}

window.changeLeadStageByIndex = function (index, newStage) {
    if (currentLeads[index]) {
        currentLeads[index].stage = newStage;
        saveData();
        renderAll();
        showToast("Saved: " + currentLeads[index].name + " is now " + newStage);
    }
};

window.saveLeadByIndex = function (index, buttonElement) {
    if (currentLeads[index]) {
        saveData();
        renderAll();
        if (buttonElement) {
            buttonElement.textContent = "Saved ✓";
            buttonElement.classList.add("saved");
            setTimeout(function () {
                buttonElement.textContent = "Save";
                buttonElement.classList.remove("saved");
            }, 1200);
        }
        showToast("Saved " + currentLeads[index].name + " successfully ✓");
    }
};

window.deleteLeadByIndex = function (index) {
    if (currentLeads[index]) {
        const deletedName = currentLeads[index].name;
        currentLeads.splice(index, 1);
        saveData();
        renderAll();
        showToast("Deleted lead: " + deletedName);
    }
};

document.addEventListener("DOMContentLoaded", function () {

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                themeToggle.textContent = "☀️ Light Mode";
                try { localStorage.setItem("estateflow_theme", "dark"); } catch (e) {}
            } else {
                themeToggle.textContent = "🌙 Dark Mode";
                try { localStorage.setItem("estateflow_theme", "light"); } catch (e) {}
            }
        });

        try {
            if (localStorage.getItem("estateflow_theme") === "dark") {
                document.body.classList.add("dark-mode");
                themeToggle.textContent = "☀️ Light Mode";
            }
        } catch (e) {}
    }

    loadData();
    renderAll();

    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
        leadForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const clientName = document.getElementById("clientName").value.trim();
            const clientTypeElement = document.querySelector('input[name="clientType"]:checked');
            const clientType = clientTypeElement ? clientTypeElement.value : "Buyer";
            const propertyInterest = document.getElementById("propertyInterest").value;
            const budget = document.getElementById("budget").value.trim();
            const leadStage = document.getElementById("leadStage").value;
            const priority = document.getElementById("priority").value;
            const followUpDate = document.getElementById("followUpDate").value || "Pending";
            const phoneNumber = document.getElementById("phoneNumber").value.trim() || "*******000";

            if (!clientName || !budget) {
                alert("Please fill in both the Client Name and Budget.");
                return;
            }

            const newLead = {
                name: clientName,
                type: clientType,
                interest: propertyInterest,
                budget: budget,
                stage: leadStage,
                priority: priority,
                date: followUpDate,
                phone: phoneNumber
            };

            currentLeads.unshift(newLead);
            saveData();
            renderAll();
            leadForm.reset();
            showToast("New lead for " + clientName + " saved!");
        });
    }

    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    if (searchInput) {
        searchInput.addEventListener("keyup", function () {
            const query = searchInput.value.toLowerCase();
            const tableBody = document.getElementById("leadsTableBody");
            if (!tableBody) return;
            const rows = tableBody.getElementsByTagName("tr");

            for (let i = 0; i < rows.length; i++) {
                const rowText = rows[i].textContent.toLowerCase();
                if (rowText.includes(query)) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
        });
    }
});
