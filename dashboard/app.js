const runButton = document.getElementById("runButton");
const downloadButton = document.getElementById("downloadButton");
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

```
resultCell.textContent = result;
attemptsCell.textContent = attempts;

const statusClass = result === "Done" ? "done" : "failed";

resultCell.innerHTML = "";

const tag = document.createElement("span");
tag.className = `tag ${statusClass}`;
tag.textContent = result;
resultCell.appendChild(tag);
```

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

```
progressBar.style.width = `${percentage}%`;
progressText.textContent = `${percentage}%`;
```

}

function resetDashboard() {
const rows = getRows();

```
rows.forEach(row => {
    row.querySelector(".result").textContent = "—";
    row.querySelector(".attempts").textContent = "0";
    row.querySelector("td:nth-child(3)").innerHTML =
        '<span class="tag pending">Pending</span>';
});

totalCount.textContent = rows.length;
updateSummary(0, 0, rows.length);
updateProgress(0, rows.length);
```

}

async function runSimulation() {
if (isRunning) {
return;
}

```
isRunning = true;
runButton.disabled = true;
downloadButton.disabled = true;
runButton.textContent = "Processing...";
statusBadge.textContent = "Running";

resetDashboard();

const rows = getRows();
const total = rows.length;

let completed = 0;
let failed = 0;

message.textContent =
    "Starting the fictional processing simulation...";

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
downloadButton.disabled = false;

isRunning = false;
```

}

function downloadResults() {
const rows = getRows();

```
const headers = [
    "Record A",
    "Record B",
    "Input Status",
    "Result",
    "Attempts"
];

const csvRows = [headers];

rows.forEach(row => {
    const cells = row.querySelectorAll("td");

    csvRows.push([
        cells[0].textContent.trim(),
        cells[1].textContent.trim(),
        cells[2].textContent.trim(),
        cells[3].textContent.trim(),
        cells[4].textContent.trim()
    ]);
});

const csvContent = csvRows
    .map(row =>
        row.map(value =>
            `"${value.replace(/"/g, '""')}"`
        ).join(",")
    )
    .join("\r\n");

const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
);

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "demo_processing_results.csv";

document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);
```

}

runButton.addEventListener("click", runSimulation);
downloadButton.addEventListener("click", downloadResults);
