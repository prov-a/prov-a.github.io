import pytest
import rdflib
from pyshacl import validate
from io import BytesIO


def nquads_to_ntriples(nquads_file):
    """
    Converts N-Quads to N-Triples by removing named graphs.
    Returns the N-Triples as an in-memory string.
    """
    g = rdflib.ConjunctiveGraph()
    g.parse(nquads_file, format="nquads")

    # Serialize as N-Triples in memory
    ntriples_data = BytesIO()
    g.serialize(destination=ntriples_data, format="nt")
    ntriples_data.seek(0)  # Go to the start of the BytesIO buffer
    
    return ntriples_data


def test_validate_ntriples_with_shacl():
    """
    Test if converted N-Triples conform to SHACL constraints.
    """
    # Step 1: Convert N-Quads to N-Triples (in-memory)
    with open("test_data.nq", "rb") as nquads_file:
        ntriples_data = nquads_to_ntriples(nquads_file)

    # Step 2: Load SHACL shapes graph
    shacl_graph = rdflib.Graph()
    shacl_graph.parse("shape.ttl", format="ttl")

    # Step 3: Load RDF data graph from in-memory N-Triples
    data_graph = rdflib.Graph()
    data_graph.parse(ntriples_data, format="nt")

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
