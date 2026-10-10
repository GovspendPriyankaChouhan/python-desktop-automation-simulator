import csv
import random
import time
from pathlib import Path

BASE_DIR = Path(**file**).resolve().parent
INPUT_FILE = BASE_DIR / "sample_data.csv"
OUTPUT_FILE = BASE_DIR / "processing_results.csv"

MAX_RETRIES = 3

def load_records():
"""Load fictional record pairs from the sample CSV file."""
with INPUT_FILE.open("r", newline="", encoding="utf-8") as file:
return list(csv.DictReader(file))

def validate_record(record):
"""Check that a record contains two distinct, non-empty IDs."""
record_a = record.get("record_a", "").strip()
record_b = record.get("record_b", "").strip()

```
if not record_a or not record_b:
    return False, "Missing record identifier"

if record_a == record_b:
    return False, "Record identifiers must be different"

if not record_a.startswith("DEMO-") or not record_b.startswith("DEMO-"):
    return False, "Only fictional DEMO identifiers are accepted"

return True, "Validation passed"
```

def simulate_operation(record):
"""Simulate a safe operation without changing external systems."""
# This is a demonstration, not a real record merge.
if random.random() < 0.15:
raise RuntimeError("Simulated temporary processing error")

```
return "Simulated successfully"
```

def process_record(record):
"""Validate and process one record pair with limited retries."""
valid, message = validate_record(record)

```
if not valid:
    return {
        **record,
        "result": "Error",
        "message": message,
        "attempts": 0,
    }

for attempt in range(1, MAX_RETRIES + 1):
    try:
        message = simulate_operation(record)
        return {
            **record,
            "result": "Done",
            "message": message,
            "attempts": attempt,
        }
    except RuntimeError as error:
        if attempt == MAX_RETRIES:
            return {
                **record,
                "result": "Error",
                "message": str(error),
                "attempts": attempt,
            }

        time.sleep(0.5 * attempt)

raise RuntimeError("Unexpected processing state")
```

def save_results(results):
"""Write processing statuses to a separate output file."""
fields = [
"record_a",
"record_b",
"status",
"result",
"message",
"attempts",
]

```
with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=fields)
    writer.writeheader()
    writer.writerows(results)
```

def main():
records = load_records()
results = []

```
for record in records:
    if record.get("status", "").strip().lower() == "done":
        results.append({
            **record,
            "result": "Skipped",
            "message": "Already processed",
            "attempts": 0,
        })
        continue

    result = process_record(record)
    results.append(result)

    print(
        f"{result['record_a']} + {result['record_b']} "
        f"-> {result['result']} "
        f"(attempts: {result['attempts']})"
    )

save_results(results)

completed = sum(item["result"] == "Done" for item in results)
failed = sum(item["result"] == "Error" for item in results)
skipped = sum(item["result"] == "Skipped" for item in results)

print("\nProcessing summary")
print(f"Total records: {len(results)}")
print(f"Completed: {completed}")
print(f"Failed: {failed}")
print(f"Skipped: {skipped}")
print(f"Results saved to: {OUTPUT_FILE.name}")
```

if **name** == "**main**":
main()
