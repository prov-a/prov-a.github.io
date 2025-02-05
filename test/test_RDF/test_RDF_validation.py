import pytest
import rdflib
from pyshacl import validate

# File paths
TEST_NQUADS_FILE = "test_data.nq"  # Input N-Quads file
TEST_NTRIPLES_FILE = "converted_data.ttl"  # Converted N-Triples file
TEST_SHACL_FILE = "shape.ttl"  # SHACL constraints file


def nquads_to_ntriples(nquads_file, output_ntriples_file):
    """
    Converts N-Quads to N-Triples by removing named graphs.
    """
    g = rdflib.ConjunctiveGraph()
    g.parse(nquads_file, format="nquads")

    # Serialize as Turtle (which works for SHACL validation)
    g.serialize(destination=output_ntriples_file, format="ttl")

    print(f"✅ Converted N-Quads saved as N-Triples: {output_ntriples_file}")


def test_validate_ntriples_with_shacl():
    """
    Test if converted N-Triples conform to SHACL constraints.
    """
    # Step 1: Convert N-Quads to N-Triples
    nquads_to_ntriples(TEST_NQUADS_FILE, TEST_NTRIPLES_FILE)

    # Step 2: Load SHACL shapes graph
    shacl_graph = rdflib.Graph()
    shacl_graph.parse(TEST_SHACL_FILE, format="ttl")

    # Step 3: Load RDF data graph
    data_graph = rdflib.Graph()
    data_graph.parse(TEST_NTRIPLES_FILE, format="ttl")

    # Step 4: Validate RDF against SHACL constraints
    conforms, results_graph, report_text = validate(
        data_graph=data_graph,
        shacl_graph=shacl_graph,
        ont_graph=None,
        serialize_report_graph=True,
        debug=False
    )

    # Save validation report
    with open("validation_report.txt", "w", encoding="utf-8") as f:
        f.write(report_text)

    # Assert that the RDF data conforms to SHACL
    assert conforms, f"❌ SHACL validation failed:\n{report_text}"

    print("✅ SHACL Validation Test Passed")


if __name__ == "__main__":
    pytest.main()
