document.addEventListener("DOMContentLoaded", function () {

    const leadForm = document.getElementById("leadForm");
    const leadsTableBody = document.getElementById("leadsTableBody");
    const totalLeadsCounter = document.getElementById("totalLeadsCount");
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                themeToggle.textContent = "☀️ Light Mode";
            } else {
                themeToggle.textContent = "🌙 Dark Mode";
            }
        });
    }

    function updateLeadCount() {
        if (totalLeadsCounter && leadsTableBody) {
            const count = leadsTableBody.getElementsByTagName("tr").length;
            totalLeadsCounter.textContent = count;
        }

        const closedMetric = document.getElementById("metricClosed");
        const negotiationMetric = document.getElementById("metricNegotiation");
        if (leadsTableBody) {
            const selects = leadsTableBody.querySelectorAll(".stage-select");
            let closedCount = 0;
            let negotiationCount = 0;
            selects.forEach(function (sel) {
                if (sel.value === "Closed Won") closedCount++;
                if (sel.value === "In Negotiation") negotiationCount++;
            });
            if (closedMetric) closedMetric.textContent = closedCount;
            if (negotiationMetric) negotiationMetric.textContent = negotiationCount;
        }
    }

    window.updateRowStage = function (selectElement) {
        selectElement.classList.remove("stage-won", "stage-cancelled", "stage-negotiation");
        if (selectElement.value === "Closed Won") {
            selectElement.classList.add("stage-won");
        } else if (selectElement.value === "Cancelled") {
            selectElement.classList.add("stage-cancelled");
        } else if (selectElement.value === "In Negotiation") {
            selectElement.classList.add("stage-negotiation");
        }
        updateLeadCount();
    };

    window.deleteLead = function (buttonElement) {
        const row = buttonElement.closest("tr");
        if (row) {
            row.remove();
            updateLeadCount();
        }
    };

    updateLeadCount();

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
                    <select class="stage-select ${stageClass}" onchange="updateRowStage(this)">
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
                <td><button type="button" class="btn-delete" onclick="deleteLead(this)">Delete</button></td>
            `;

            leadsTableBody.insertBefore(newRow, leadsTableBody.firstChild);

            let targetCardsContainer = null;
            let targetCountBadge = null;

            if (leadStage === "New") {
                targetCardsContainer = document.getElementById("cardsNew");
                targetCountBadge = document.getElementById("countNew");
            } else if (leadStage === "Contacted") {
                targetCardsContainer = document.getElementById("cardsContacted");
                targetCountBadge = document.getElementById("countContacted");
            } else if (leadStage === "Site Visit Scheduled") {
                targetCardsContainer = document.getElementById("cardsVisit");
                targetCountBadge = document.getElementById("countVisit");
            } else if (leadStage === "In Negotiation") {
                targetCardsContainer = document.getElementById("cardsNegotiation");
                targetCountBadge = document.getElementById("countNegotiation");
            } else if (leadStage === "Closed Won") {
                targetCardsContainer = document.getElementById("cardsClosed");
                targetCountBadge = document.getElementById("countClosed");
            }

            if (targetCardsContainer) {
                const newPipelineCard = document.createElement("div");
                newPipelineCard.className = "pipeline-card";
                newPipelineCard.innerHTML = `
                    <h5>${clientName}</h5>
                    <p>${propertyInterest} • ${budget}</p>
                    <span class="badge ${badgeClass}">${priority}</span>
                `;
                targetCardsContainer.insertBefore(newPipelineCard, targetCardsContainer.firstChild);

                if (targetCountBadge) {
                    targetCountBadge.textContent = parseInt(targetCountBadge.textContent || "0") + 1;
                }
            }

            updateLeadCount();
            leadForm.reset();
        });
    }

    if (searchInput) {
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
