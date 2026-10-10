import unittest
from unittest.mock import patch

import automation


class TestRecordValidation(unittest.TestCase):

    def test_valid_demo_records(self):
        record = {
            "record_a": "DEMO-1001",
            "record_b": "DEMO-1002",
            "status": "Pending",
        }
        valid, message = automation.validate_record(record)
        self.assertTrue(valid)
        self.assertEqual(message, "Validation passed")

    def test_missing_identifier_is_rejected(self):
        record = {"record_a": "", "record_b": "DEMO-1002"}
        valid, _ = automation.validate_record(record)
        self.assertFalse(valid)

    def test_identical_identifiers_are_rejected(self):
        record = {
            "record_a": "DEMO-1001",
            "record_b": "DEMO-1001",
        }
        valid, _ = automation.validate_record(record)
        self.assertFalse(valid)

    def test_non_demo_identifiers_are_rejected(self):
        record = {
            "record_a": "REAL-1001",
            "record_b": "DEMO-1002",
        }
        valid, _ = automation.validate_record(record)
        self.assertFalse(valid)

    def test_successful_processing(self):
        record = {
            "record_a": "DEMO-1001",
            "record_b": "DEMO-1002",
            "status": "Pending",
        }
        with patch.object(
            automation,
            "simulate_operation",
            return_value="Simulated successfully",
        ):
            result = automation.process_record(record)

        self.assertEqual(result["result"], "Done")
        self.assertEqual(result["attempts"], 1)

    def test_retry_after_temporary_failure(self):
        record = {
            "record_a": "DEMO-1001",
            "record_b": "DEMO-1002",
            "status": "Pending",
        }
        with patch.object(
            automation,
            "simulate_operation",
            side_effect=[
                RuntimeError("Temporary failure"),
                "Simulated successfully",
            ],
        ), patch.object(automation.time, "sleep"):
            result = automation.process_record(record)

        self.assertEqual(result["result"], "Done")
        self.assertEqual(result["attempts"], 2)

    def test_failure_after_all_retries(self):
        record = {
            "record_a": "DEMO-1001",
            "record_b": "DEMO-1002",
            "status": "Pending",
        }
        with patch.object(
            automation,
            "simulate_operation",
            side_effect=RuntimeError("Temporary failure"),
        ), patch.object(automation.time, "sleep"):
            result = automation.process_record(record)

        self.assertEqual(result["result"], "Error")
        self.assertEqual(result["attempts"], automation.MAX_RETRIES)


if __name__ == "__main__":
    unittest.main()
