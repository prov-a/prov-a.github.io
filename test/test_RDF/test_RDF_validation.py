import pytest
import rdflib
from pyshacl import validate

# File paths
TEST_NQUADS_FILE = "test_data.nq"  # Input N-Quads file
TEST_NTRIPLES_FILE = "converted_data.ttl"  # Converted N-Triples file
TEST_SHACL_FILE = "shape.ttl"  # SHACL constraints file


def test_validate_ntriples_with_shacl():
    """
    Test if converted N-Triples conform to SHACL constraints.
    """
    
    # Step 1: Load SHACL shapes graph
    shacl_graph = rdflib.Graph()
    shacl_graph.parse(TEST_SHACL_FILE, format="ttl")

    # Step 2: Load RDF data graph
    data_graph = rdflib.Graph()
    data_graph.parse(TEST_NQUADS_FILE, format="nquads")

    for subj, pred, obj in data_graph:
        print(subj, pred, obj)
    
    # Step 3: Validate RDF against SHACL constraints
    conforms, results_graph, report_text = validate(
        data_graph=data_graph,
        shacl_graph=shacl_graph,
        ont_graph=None,
        serialize_report_graph=True,
        debug=False
    )

    # Assert that the RDF data conforms to SHACL
    assert conforms, f"❌ SHACL validation failed:\n{report_text}"

    print("✅ SHACL Validation Test Passed")


if __name__ == "__main__":
    pytest.main()
