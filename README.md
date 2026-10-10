# Python Desktop Automation Simulator

A fictional Python portfolio project demonstrating spreadsheet-driven processing, input validation, simulated workflow execution, retry handling, and automated testing.

## Project Overview

Repetitive desktop workflows often involve structured inputs, validation, execution checks, and status tracking. This project demonstrates these concepts through a safe simulation using fictional record identifiers.

The program does not connect to external business applications or modify real records.

## Key Features

* **Structured input processing:** Reads fictional record pairs from CSV.
* **Input validation:** Checks identifiers before processing.
* **Retry handling:** Retries simulated temporary failures with a limited retry policy.
* **Status tracking:** Records successful, failed, and skipped items.
* **Result reporting:** Writes outcomes to a separate CSV file.
* **Automated testing:** Uses Python's unittest framework.
* **Continuous integration:** GitHub Actions runs tests on repository updates.

## Workflow

1. Load fictional records.
2. Validate each record pair.
3. Simulate the processing operation.
4. Retry recoverable failures within a configured limit.
5. Record the outcome and attempt count.
6. Generate a processing summary and results file.

## Technology Stack

* Python
* CSV data processing
* `unittest`
* GitHub Actions
* Exception handling and retry logic

## Repository Structure

```text
python-desktop-automation-simulator/
├── .github/
│   └── workflows/
│       └── tests.yml
├── tests/
│   └── test_automation.py
├── automation.py
├── sample_data.csv
├── requirements.txt
├── .gitignore
└── README.md
```

## Getting Started

Requirements: Python 3.12 or a compatible recent Python version.

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the automated tests:

```bash
python -m unittest discover -s tests -v
```

Run the simulation:

```bash
python automation.py
```

The simulation writes its results to `processing_results.csv` in the project directory.

## Privacy and Scope

This is an independent demonstration using fictional identifiers and simulated operations. It does not contain company data, credentials, proprietary screenshots, or connections to internal systems.

## Future Improvements

* Add a mock desktop interface.
* Add structured logging and richer reporting.
* Expand test coverage for invalid input and failure scenarios.
* Add a visual summary of processing results.
