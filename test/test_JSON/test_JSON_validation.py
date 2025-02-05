import pytest
import json
from jsonschema import validate, ValidationError

# File paths (Ensure these files exist)
TEST_JSON_FILE = "test_data.json"
TEST_SCHEMA_FILE = "schema.json"


def load_json(filename):
    """
    Loads and returns JSON data from a file.
    """
    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)


def test_validate_json():
    """
    Test if JSON data conforms to the JSON Schema.
    """
    try:
        # Load JSON schema and data
        schema = load_json(TEST_SCHEMA_FILE)
        data = load_json(TEST_JSON_FILE)

        # Validate the JSON data
        validate(instance=data, schema=schema)

        print("✅ JSON validation passed.")
    except ValidationError as e:
        pytest.fail(f"❌ JSON validation failed: {e.message}")
    except Exception as e:
        pytest.fail(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    pytest.main()
