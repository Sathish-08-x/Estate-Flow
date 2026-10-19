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

function syncPipelineAndMetrics() {
    const tableBody = document.getElementById("leadsTableBody");
    if (!tableBody) return;

    const cardsNew = document.getElementById("cardsNew");
    const cardsContacted = document.getElementById("cardsContacted");
    const cardsVisit = document.getElementById("cardsVisit");
    const cardsNegotiation = document.getElementById("cardsNegotiation");
    const cardsClosed = document.getElementById("cardsClosed");

    if (cardsNew) cardsNew.innerHTML = "";
    if (cardsContacted) cardsContacted.innerHTML = "";
    if (cardsVisit) cardsVisit.innerHTML = "";
    if (cardsNegotiation) cardsNegotiation.innerHTML = "";
    if (cardsClosed) cardsClosed.innerHTML = "";

    let cNew = 0, cContacted = 0, cVisit = 0, cNeg = 0, cClosed = 0;
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(function (row) {
        const cells = row.querySelectorAll("td");
        if (cells.length < 8) return;

        const name = cells[0].textContent.trim();
        const interest = cells[2].textContent.trim();
        const budget = cells[3].textContent.trim();
        const stageSelect = cells[4].querySelector(".stage-select");
        const stage = stageSelect ? stageSelect.value : cells[4].textContent.trim();
        const priorityBadge = cells[5].querySelector(".badge");
        const priority = priorityBadge ? priorityBadge.textContent.trim() : "Medium";
        const priorityClass = priorityBadge ? priorityBadge.className : "badge badge-medium";

        const card = document.createElement("div");
        card.className = "pipeline-card";
        card.innerHTML = `
            <h5>${name}</h5>
            <p>${interest} • ${budget}</p>
            <span class="${priorityClass}">${priority}</span>
        `;

        if (stage === "New" && cardsNew) {
            cardsNew.appendChild(card);
            cNew++;
        } else if (stage === "Contacted" && cardsContacted) {
            cardsContacted.appendChild(card);
            cContacted++;
        } else if (stage === "Site Visit Scheduled" && cardsVisit) {
            cardsVisit.appendChild(card);
            cVisit++;
        } else if (stage === "In Negotiation" && cardsNegotiation) {
            cardsNegotiation.appendChild(card);
            cNeg++;
        } else if (stage === "Closed Won" && cardsClosed) {
            cardsClosed.appendChild(card);
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
    if (totalLeadsCounter) totalLeadsCounter.textContent = rows.length;

    const metricVisits = document.getElementById("metricVisits");
    const metricNegotiation = document.getElementById("metricNegotiation");
    const metricClosed = document.getElementById("metricClosed");

    if (metricVisits) metricVisits.textContent = cVisit;
    if (metricNegotiation) metricNegotiation.textContent = cNeg;
    if (metricClosed) metricClosed.textContent = cClosed;
}

function saveToLocalStorage() {
    const tableBody = document.getElementById("leadsTableBody");
    if (!tableBody) return;

    const leads = [];
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(function (row) {
        const cells = row.querySelectorAll("td");
        if (cells.length < 8) return;

        const name = cells[0].textContent.trim();
        const type = cells[1].textContent.trim();
        const interest = cells[2].textContent.trim();
        const budget = cells[3].textContent.trim();
        const stageSelect = cells[4].querySelector(".stage-select");
        const stage = stageSelect ? stageSelect.value : "New";
        const priorityBadge = cells[5].querySelector(".badge");
        const priority = priorityBadge ? priorityBadge.textContent.trim() : "Medium";
        const date = cells[6].textContent.trim();
        const phone = cells[7].textContent.trim();

        leads.push({ name, type, interest, budget, stage, priority, date, phone });
    });

    localStorage.setItem("estateflow_leads_data", JSON.stringify(leads));
}

function loadFromLocalStorage() {
    const tableBody = document.getElementById("leadsTableBody");
    const saved = localStorage.getItem("estateflow_leads_data");
    if (!saved || !tableBody) return;

    try {
        const leads = JSON.parse(saved);
        if (!Array.isArray(leads) || leads.length === 0) return;

        tableBody.innerHTML = "";
        leads.forEach(function (lead) {
            let badgeClass = "badge-medium";
            if (lead.priority === "High" || lead.priority === "V.High") badgeClass = "badge-high";
            if (lead.priority === "Low") badgeClass = "badge-low";

            let stageClass = "";
            if (lead.stage === "Closed Won") stageClass = "stage-won";
            if (lead.stage === "Cancelled") stageClass = "stage-cancelled";
            if (lead.stage === "In Negotiation") stageClass = "stage-negotiation";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${lead.name}</strong></td>
                <td><span class="badge-type">${lead.type}</span></td>
                <td>${lead.interest}</td>
                <td>${lead.budget}</td>
                <td>
                    <select class="stage-select ${stageClass}" onchange="saveLeadStage(this)">
                        <option value="New" ${lead.stage === "New" ? "selected" : ""}>New</option>
                        <option value="Contacted" ${lead.stage === "Contacted" ? "selected" : ""}>Contacted</option>
                        <option value="Site Visit Scheduled" ${lead.stage === "Site Visit Scheduled" ? "selected" : ""}>Site Visit Scheduled</option>
                        <option value="In Negotiation" ${lead.stage === "In Negotiation" ? "selected" : ""}>In Negotiation</option>
                        <option value="Closed Won" ${lead.stage === "Closed Won" ? "selected" : ""}>Closed Won</option>
                        <option value="Cancelled" ${lead.stage === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
                <td><span class="badge ${badgeClass}">${lead.priority}</span></td>
                <td>${lead.date}</td>
                <td>${lead.phone}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn-save" onclick="saveLeadRow(this)">Save</button>
                        <button type="button" class="btn-delete" onclick="deleteLead(this)">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (e) {
    }
}

window.saveLeadStage = function (selectElement) {
    selectElement.classList.remove("stage-won", "stage-cancelled", "stage-negotiation");
    if (selectElement.value === "Closed Won") {
        selectElement.classList.add("stage-won");
    } else if (selectElement.value === "Cancelled") {
        selectElement.classList.add("stage-cancelled");
    } else if (selectElement.value === "In Negotiation") {
        selectElement.classList.add("stage-negotiation");
    }

    syncPipelineAndMetrics();
    saveToLocalStorage();
    showToast("Stage updated to " + selectElement.value + " & saved!");
};

window.saveLeadRow = function (buttonElement) {
    const row = buttonElement.closest("tr");
    if (!row) return;

    const select = row.querySelector(".stage-select");
    if (select) {
        saveLeadStage(select);
    }

    buttonElement.textContent = "Saved ✓";
    buttonElement.classList.add("saved");
    setTimeout(function () {
        buttonElement.textContent = "Save";
        buttonElement.classList.remove("saved");
    }, 1500);
};

window.deleteLead = function (buttonElement) {
    const row = buttonElement.closest("tr");
    if (row) {
        row.remove();
        syncPipelineAndMetrics();
        saveToLocalStorage();
        showToast("Lead deleted!");
    }
};

document.addEventListener("DOMContentLoaded", function () {

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                themeToggle.textContent = "☀️ Light Mode";
                localStorage.setItem("estateflow_theme", "dark");
            } else {
                themeToggle.textContent = "🌙 Dark Mode";
                localStorage.setItem("estateflow_theme", "light");
            }
        });

        if (localStorage.getItem("estateflow_theme") === "dark") {
            document.body.classList.add("dark-mode");
            themeToggle.textContent = "☀️ Light Mode";
        }
    }

    if (!localStorage.getItem("estateflow_leads_data")) {
        saveToLocalStorage();
    } else {
        loadFromLocalStorage();
    }

    syncPipelineAndMetrics();

    const leadForm = document.getElementById("leadForm");
    const leadsTableBody = document.getElementById("leadsTableBody");

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
            const followUpDate = document.getElementById("followUpDate").value;
            const phoneNumber = document.getElementById("phoneNumber").value.trim() || "*******000";

            if (!clientName || !budget) {
                alert("Please fill in both the Client Name and Budget.");
                return;
            }

            let badgeClass = "badge-medium";
            if (priority === "High" || priority === "V.High") {
                badgeClass = "badge-high";
            } else if (priority === "Low") {
                badgeClass = "badge-low";
            }

            let stageClass = "";
            if (leadStage === "Closed Won") stageClass = "stage-won";
            if (leadStage === "Cancelled") stageClass = "stage-cancelled";
            if (leadStage === "In Negotiation") stageClass = "stage-negotiation";

            const newRow = document.createElement("tr");
            let formattedDate = followUpDate || "Pending";

            newRow.innerHTML = `
                <td><strong>${clientName}</strong></td>
                <td><span class="badge-type">${clientType}</span></td>
                <td>${propertyInterest}</td>
                <td>${budget}</td>
                <td>
                    <select class="stage-select ${stageClass}" onchange="saveLeadStage(this)">
                        <option value="New" ${leadStage === "New" ? "selected" : ""}>New</option>
                        <option value="Contacted" ${leadStage === "Contacted" ? "selected" : ""}>Contacted</option>
                        <option value="Site Visit Scheduled" ${leadStage === "Site Visit Scheduled" ? "selected" : ""}>Site Visit Scheduled</option>
                        <option value="In Negotiation" ${leadStage === "In Negotiation" ? "selected" : ""}>In Negotiation</option>
                        <option value="Closed Won" ${leadStage === "Closed Won" ? "selected" : ""}>Closed Won</option>
                        <option value="Cancelled" ${leadStage === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
                <td><span class="badge ${badgeClass}">${priority}</span></td>
                <td>${formattedDate}</td>
                <td>${phoneNumber}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="btn-save" onclick="saveLeadRow(this)">Save</button>
                        <button type="button" class="btn-delete" onclick="deleteLead(this)">Delete</button>
                    </div>
                </td>
            `;

            if (leadsTableBody) {
                leadsTableBody.insertBefore(newRow, leadsTableBody.firstChild);
            }

            syncPipelineAndMetrics();
            saveToLocalStorage();
            leadForm.reset();
            showToast("New lead for " + clientName + " saved to pipeline!");
        });
    }

    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    if (searchInput && leadsTableBody) {
        searchInput.addEventListener("keyup", function () {
            const query = searchInput.value.toLowerCase();
            const rows = leadsTableBody.getElementsByTagName("tr");

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
