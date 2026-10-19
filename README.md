# EstateFlow - Property Lead Management System

A web-based Lead Management and Sales Pipeline application built for real estate agents to organize buyer and seller inquiries, track follow-ups, and monitor sales progression.

**Live Deployment:** [https://sathish-08-x.github.io/Estate-Flow/](https://sathish-08-x.github.io/Estate-Flow/)

---

## Academic Details
- **Course Code:** CSE326 (Internet Programming)
- **Assessment:** CA1 Project-Based Assessment
- **Team Name:** Boys-QH-T
- **Team Members:**
  - **Sathish Gudipudi (Lead)** - 12613921
  - **Member 2** - 12614592
  - **Member 3** - 12620884

---

## Problem Statement
Property agents regularly receive inquiries from multiple buyers and sellers across various channels, but often lose track of follow-up dates, client budgets, specific property requirements, and communication history.

## Project Objective
Develop a front-end lead-management web application that centralizes property inquiries, organizes client preferences, schedules upcoming follow-ups, and visually displays sales progress across pipeline stages.

---

## Key Features

1. **Top Navigation & Global Search:**
   - Real-time client and property search bar that filters table records instantly as you type.
   - Quick navigation links with smooth scrolling to each section.

2. **KPI Summary Cards:**
   - Live dashboard cards displaying metrics for Total Active Leads, Site Visits Scheduled, Pending Follow-ups, and Closed Deals.

3. **Lead Intake Form:**
   - Captures client name, role (Buyer vs. Seller), property category (Apartment, House, Condo, Villa, Commercial), target budget, lead stage, priority level, follow-up date, and contact number.
   - Built with front-end validation.

4. **Dynamic Data Management (JavaScript):**
   - When a new lead is submitted, it is dynamically prepended to the top of the Leads Directory table without reloading the page.
   - Automatically recalculates and updates the total active lead count.

5. **Visual Sales Pipeline (Kanban Board):**
   - Categorizes leads into 4 distinct progression stages: *New Inquiry*, *Contacted*, *Site Visit*, and *Closed Won*.
   - Each card displays client details, property preference, budget, and priority tag.

6. **Follow-Up Schedule:**
   - Dedicated action schedule listing upcoming calls, site visits, and negotiation meetings with dates and contact numbers.

7. **Property Leads Directory Table:**
   - Responsive table format with color-coded priority badges (High, Medium, Low, V.High) and client type tags.

---

## Technologies Used

- **HTML5:** Semantic structure (`<header>`, `<aside>`, `<main>`, `<section>`, `<table>`, `<form>`).
- **CSS3:** Flexbox and Grid layouts, clean outline card styling, responsive design, color-coded status badges.
- **JavaScript (ES6):** DOM manipulation, event listeners (`submit`, `keyup`), dynamic row creation, and client-side array/DOM filtering.

---

## How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/Sathish-08-x/Estate-Flow.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Estate-Flow
   ```
3. Open `index.html` in Google Chrome, Microsoft Edge, or any modern web browser.
