const runButton = document.getElementById("runButton");
const recordsTable = document.getElementById("recordsTable");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const failedCount = document.getElementById("failedCount");
const pendingCount = document.getElementById("pendingCount");
const statusBadge = document.getElementById("statusBadge");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const message = document.getElementById("message");

let isRunning = false;

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function getRows() {
    return Array.from(recordsTable.querySelectorAll("tr"));
}

function setRowResult(row, result, attempts) {
    const resultCell = row.querySelector(".result");
    const attemptsCell = row.querySelector(".attempts");

    resultCell.textContent = result;
    attemptsCell.textContent = attempts;

    const statusClass = result === "Done" ? "done" : "failed";

    resultCell.innerHTML = "";

    const tag = document.createElement("span");
    tag.className = `tag ${statusClass}`;
    tag.textContent = result;
    resultCell.appendChild(tag);
}

function updateSummary(completed, failed, pending) {
    completedCount.textContent = completed;
    failedCount.textContent = failed;
    pendingCount.textContent = pending;
}

function updateProgress(processed, total) {
    const percentage = total === 0
        ? 0
        : Math.round((processed / total) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
}

function resetDashboard() {
    const rows = getRows();

    rows.forEach(row => {
        row.querySelector(".result").textContent = "—";
        row.querySelector(".attempts").textContent = "0";
        row.querySelector("td:nth-child(3)").innerHTML =
            '<span class="tag pending">Pending</span>';
    });

    totalCount.textContent = rows.length;
    updateSummary(0, 0, rows.length);
    updateProgress(0, rows.length);
}

async function runSimulation() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    runButton.disabled = true;
    runButton.textContent = "Processing...";
    statusBadge.textContent = "Running";
    resetDashboard();

    const rows = getRows();
    const total = rows.length;

    let completed = 0;
    let failed = 0;

    message.textContent = "Starting the fictional processing simulation...";

    for (let index = 0; index < total; index++) {
        const row = rows[index];

        message.textContent =
            `Processing fictional record pair ${index + 1} of ${total}...`;

        await wait(650);

        let attempts = 0;
        let succeeded = false;

        // Simulate a temporary failure with a limited retry policy.
        while (attempts < 3 && !succeeded) {
            attempts++;

            // Approximately 15% chance of a simulated failure per attempt.
            const temporaryFailure = Math.random() < 0.15;

            if (!temporaryFailure) {
                succeeded = true;
            } else if (attempts < 3) {
                message.textContent =
                    `Temporary simulated error. Retrying record ${index + 1}...`;

                await wait(400);
            }
        }
const inputStatusCell = row.querySelector("td:nth-child(3)");

if (succeeded) {
    completed++;
    inputStatusCell.innerHTML =
        '<span class="tag done">Processed</span>';
    setRowResult(row, "Done", attempts);
} else {
    failed++;
    inputStatusCell.innerHTML =
        '<span class="tag failed">Failed</span>';
    setRowResult(row, "Error", attempts);
}
        updateSummary(completed, failed, total - completed - failed);
        updateProgress(index + 1, total);
    }

    statusBadge.textContent = "Finished";
    message.textContent =
        `Simulation finished. ${completed} completed, ${failed} failed. ` +
        "No external systems were accessed.";

    runButton.disabled = false;
    runButton.textContent = "↻ Run Again";
    isRunning = false;
}

runButton.addEventListener("click", runSimulation);
