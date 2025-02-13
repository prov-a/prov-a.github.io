![License](https://img.shields.io/badge/license-MIT-blue)
![tests](https://github.com/prov-a/prov-a.github.io/actions/workflows/main.yml/badge.svg)


# PROV-A: the Provenance App

PROV-A (The Provenance App) is a web-based tool designed to streamline the creation and publication of provenance information as Linked Open Data (LOD). By integrating AI-driven natural language processing (NLP) with human validation, PROV-A balances efficiency with scholarly rigor, making provenance research more accessible and scalable for cultural institutions.

## Features
- Web-based, client-side application
- Supports integration of automated data extraction workflows
- Structured provenance data based on [CIDOC-CRM](https://cidoc-crm.org/) standard
- User-friendly interface for data structuring
- Generates Linked Open Data structured as nanopublications
- SPARQL endpoint for querying generated LOD

## Access
PROV-A is available at: [prov-a.github.io](https://prov-a.github.io)

## Data Model
- **Preprocessed Data Schema:** Users can format their provenance data according to a predefined JSON schema before uploading it into PROV-A. The schema is available at: [JSON Schema](https://github.com/prov-a/prov-a.github.io/blob/main/test/test_JSON/schema.json)
- **Generated RDF SHACL:** The structure of RDF output follows a data model available at: [SHACL Schema](https://github.com/prov-a/prov-a.github.io/blob/main/test/test_RDF/shape.ttl)

## Usage
1. **Initialsze Project**: Enter metadata, select licensing, and input artefacts records.
2. **Structure Data**: Validate and refine AI-extracted provenance information.
3. **Generate LOD**: Transform provenance data into RDF and query the SPARQL endpoint.

## Testing
A dedicated testing directory is available for validating data transformations and workflow consistency. See [Testing Directory](https://github.com/prov-a/prov-a.github.io/tree/main/test).

## Libraries
PROV-A leverages open-source libraries, including:
- [**N3.js**](https://github.com/quadstorejs/quadstore): RDF quads writer
- [**Quadstore**](https://github.com/quadstorejs/quadstore): LevelDB-backed RDF graph database
- [**quadstore-comunica**](https://github.com/quadstorejs/quadstore-comunica): SPARQL qery engine

## License
PROV-A is released under the MIT License. See [LICENSE](https://github.com/prov-a/prov-a.github.io/blob/main/LICENSE) for details.
