# PROV-A Data Model

## Namespace Declarations
- `owl:` <http://www.w3.org/2002/07/owl#>
- `rdf:` <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
- `rdfs:` <http://www.w3.org/2000/01/rdf-schema#>
- `xsd:` <http://www.w3.org/2001/XMLSchema#>
- `crm:` <http://www.cidoc-crm.org/cidoc-crm/>
- `crminf:` <http://www.cidoc-crm.org/crminf/>
- `np:` <http://www.nanopub.org/nschema#>
- `dct:` <http://purl.org/dc/terms/>
- `gvp:` <http://vocab.getty.edu/ontology#>

---

## Core Elements
- [Physical Object](#physical-object)
- [Provenance Activity](#provenance-activity)
- [Party](#party)
- [Timespan](#timespan)
- [Location](#location)
- [Provenance Assessment](#provenance-assessment)
- [Nanopublication](#nanopublication)
- [Assertion Graph](#assertion-graph)
- [Provenance Graph](#provenance-graph)
- [Publication Info Graph](#publication-info-graph)

---

### Physical Object

- **Type:** [crm:E19_Physical_Object](http://www.cidoc-crm.org/cidoc-crm/E19_Physical_Object)  
- **Label:** Physical Object

#### Properties

- **[crm:P102_has_title](http://www.cidoc-crm.org/cidoc-crm/P102_has_title)**  
  - **Description:** The title of the physical object.
  - **Value:**  
    - **Type:** [crm:E35_Title](http://www.cidoc-crm.org/cidoc-crm/E35_Title)  
    - **Label:** Title  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The symbolic content (text) of the title.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of title, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300404670](http://vocab.getty.edu/aat/300404670)  

- **[crm:P70i_is_documented_in](http://www.cidoc-crm.org/cidoc-crm/P70i_is_documented_in)**  
  - **Description:** The document that provides evidence or details about the physical object.
  - **Value:**  
    - **Type:** [crm:E31_Document](http://www.cidoc-crm.org/cidoc-crm/E31_Document)  
    - **Label:** Document  
    - **Properties:**
      - **[crm:P1_is_identified_by](http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by)**  
        - **Description:** An identifier for the document.
        - **Value:**  
          - **Type:** [crm:E42_Identifier](http://www.cidoc-crm.org/cidoc-crm/E42_Identifier)  
          - **Label:** Identifier  
          - **Properties:**
            - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
              - **Description:** The literal value of the identifier.  
              - **Datatype:** `xsd:string`
            - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
              - **Description:** The type of identifier, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
              - **Value:** [http://vocab.getty.edu/aat/300404630](http://vocab.getty.edu/aat/300404630)  

- **[crm:P67i_is_referred_to_by](http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by)**  
  - **Description:** The linguistic object representing the author of the physical object.
  - **Value:**  
    - **Type:** [crm:E33_Linguistic_Object](http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object)  
    - **Label:** Author  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The textual representation of the author.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of linguistic object for the author, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300435446](http://vocab.getty.edu/aat/300435446)  

- **[crm:P67i_is_referred_to_by](http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by)**  
  - **Description:** The linguistic object representing the institution related to the physical object.
  - **Value:**  
    - **Type:** [crm:E33_Linguistic_Object](http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object)  
    - **Label:** Institution  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The textual representation of the institution.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of linguistic object for the institution, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300435449](http://vocab.getty.edu/aat/300435449)  

- **[crm:P67i_is_referred_to_by](http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by)**  
  - **Description:** The linguistic object representing the date associated with the physical object.
  - **Value:**  
    - **Type:** [crm:E33_Linguistic_Object](http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object)  
    - **Label:** Date  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The literal date value.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of linguistic object for the date, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300435447](http://vocab.getty.edu/aat/300435447)  

- **[crm:P67i_is_referred_to_by](http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by)**  
  - **Description:** The linguistic object representing the accession ID of the physical object.
  - **Value:**  
    - **Type:** [crm:E33_Linguistic_Object](http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object)  
    - **Label:** Accession ID  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The literal accession ID value.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of linguistic object for the accession ID, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300312355](http://vocab.getty.edu/aat/300312355)  

- **[crm:P67i_is_referred_to_by](http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by)**  
  - **Description:** The linguistic object representing the medium of the physical object.
  - **Value:**  
    - **Type:** [crm:E33_Linguistic_Object](http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object)  
    - **Label:** Medium  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The textual description of the medium.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of linguistic object for the medium, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300435429](http://vocab.getty.edu/aat/300435429)  

- **[crm:P67i_is_referred_to_by](http://www.cidoc-crm.org/cidoc-crm/P67i_is_referred_to_by)**  
  - **Description:** The linguistic object representing the credit line information.
  - **Value:**  
    - **Type:** [crm:E33_Linguistic_Object](http://www.cidoc-crm.org/cidoc-crm/E33_Linguistic_Object)  
    - **Label:** Credit Line  
    - **Properties:**
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The textual content of the credit line.  
        - **Datatype:** `xsd:string`
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of linguistic object for the credit line, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
        - **Value:** [http://vocab.getty.edu/aat/300435418](http://vocab.getty.edu/aat/300435418)  

---

### Provenance Activity

- **Type:** [crm:E7_Activity](http://www.cidoc-crm.org/cidoc-crm/E7_Activity)  
- **Label:** Provenance Activity

#### Properties

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** The type of the provenance activity, expressed using [Getty AAT](http://vocab.getty.edu/aat/) terms.  
  - **Value Pattern:** `http://vocab.getty.edu/aat/`

- **[crm:P183i_starts_after_the_end_of](http://www.cidoc-crm.org/cidoc-crm/P183i_starts_after_the_end_of)**  
  - **Description:** Indicates that this activity starts after the end of another activity.  
  - **Value:** [Provenance Activity](#provenance-activity)

- **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
  - **Description:** Specifies the time span during which the provenance activity took place.  
  - **Value:** [Timespan](#timespan)  

- **[crm:P7_took_place_at](http://www.cidoc-crm.org/cidoc-crm/P7_took_place_at)**  
  - **Description:** Describes the location where the provenance activity occurred.  
  - **Value:** [Location](#location) 

- **[crm:P9_consists_of](http://www.cidoc-crm.org/cidoc-crm/P9_consists_of)**  
  - **Description:** A component of the provenance activity recording the assignment of an identifier to an object.  
  - **Value:**
      - **Type:** [crm:E15_Identifier_Assignment](http://www.cidoc-crm.org/cidoc-crm/E15_Identifier_Assignment)  
      - **Label:** Identifier Assignment  
      - **Properties:**
        - **[crm:P140_assigned_attribute_to](http://www.cidoc-crm.org/cidoc-crm/P140_assigned_attribute_to)**  
          - **Description:** The physical object shape to which an attribute is assigned.  
          - **Value:** [Physical Object](#physical-object)
        - **[crm:P141_assigned](http://www.cidoc-crm.org/cidoc-crm/P141_assigned)**  
          - **Description:** The identifier that has been assigned.
          - **Value:**  
            - **Type:** [crm:E42_Identifier](http://www.cidoc-crm.org/cidoc-crm/E42_Identifier)  
            - **Label:** Identifier  
            - **Properties:**
              - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
                - **Description:** The literal value of the identifier.  
                - **Datatype:** `xsd:string`
              - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
                - **Description:** The type of identifier, defined by a [Getty AAT](http://vocab.getty.edu/aat/) term.  
                - **Value Pattern:** `http://vocab.getty.edu/aat/`

- **[crm:P9_consists_of](http://www.cidoc-crm.org/cidoc-crm/P9_consists_of)** 
  - **Description:** A component of the provenance activity recording the assignment of a monetary value to an object. 
  - **Value:**
      - **Type:** [crm:E13_Attribute_Assignment](http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment)  
      - **Label:** Attribute Assignment  
      - **Properties:**
        - **[crm:P140_assigned_attribute_to](http://www.cidoc-crm.org/cidoc-crm/P140_assigned_attribute_to)**  
          - **Description:** Specifies the physical object to which an attribute is assigned.  
          - **Value:** [Physical Object](#physical-object)
        - **[crm:P141_assigned](http://www.cidoc-crm.org/cidoc-crm/P141_assigned)**  
          - **Description:** The monetary value assigned to the object.  
          - **Value:**
            - **Type:** [crm:E97_Monetary_Amount](http://www.cidoc-crm.org/cidoc-crm/E97_Monetary_Amount)  
            - **Label:** Monetary Amount  
            - **Properties:**
              - **[crm:P90_has_value](http://www.cidoc-crm.org/cidoc-crm/P90_has_value)**  
                - **Description:** The numerical value representing the object's monetary worth.  
                - **Datatype:** `xsd:string`
              - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
                - **Description:** The type of monetary valuation, categorized using [Getty AAT](http://vocab.getty.edu/aat/) terminology.  
                - **Value Pattern:** `http://vocab.getty.edu/aat/`
              - **[crm:P180_has_currency](http://www.cidoc-crm.org/cidoc-crm/P180_has_currency)**  
                - **Description:** The currency in which the monetary amount is expressed, using [Getty AAT](http://vocab.getty.edu/aat/) terminology.  
                - **Value Pattern:** `http://vocab.getty.edu/aat/`

- **[crm:P9_consists_of](http://www.cidoc-crm.org/cidoc-crm/P9_consists_of)** 
  - **Description:** A component of the provenance activity recording the acquisition of an object, tracking the transfer of legal ownership. 
  - **Value:**
      - **Type:** [crm:E8_Acquisition](http://www.cidoc-crm.org/cidoc-crm/E8_Acquisition)  
      - **Label:** Acquisition  
      - **Properties:**
        - **[crm:P24_transferred_title_of](http://www.cidoc-crm.org/cidoc-crm/P24_transferred_title_of)**  
          - **Description:** Specifies the physical object whose legal ownership changed hands.  
          - **Value:** [Physical Object](#physical-object)
        - **[crm:P23_transferred_title_from](http://www.cidoc-crm.org/cidoc-crm/P23_transferred_title_from)**  
          - **Description:** Identifies the previous owner of the object.  
          - **Value:** [Party](#party)
        - **[crm:P22_transferred_title_to](http://www.cidoc-crm.org/cidoc-crm/P22_transferred_title_to)**  
          - **Description:** Identifies the new owner of the object.  
          - **Value:** [Party](#party)
        - **[crm:P14_carried_out_by](http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by)**  
          - **Description:** The individual or organization responsible for executing the acquisition.  
          - **Value:** [Party](#party)

- **[crm:P9_consists_of](http://www.cidoc-crm.org/cidoc-crm/P9_consists_of)**
  - **Description:** A component of the provenance activity recording the transfer of custody of an object, distinct from legal ownership.
  - **Value:**
      - **Type:** [crm:E10_Transfer_of_Custody](http://www.cidoc-crm.org/cidoc-crm/E10_Transfer_of_Custody)  
      - **Label:** Transfer of Custody  
      - **Properties:**
        - **[crm:P30_transferred_custody_of](http://www.cidoc-crm.org/cidoc-crm/P30_transferred_custody_of)**  
          - **Description:** Specifies the physical object whose custody changed hands.  
          - **Value:** [Physical Object](#physical-object)
        - **[crm:P28_custody_surrendered_by](http://www.cidoc-crm.org/cidoc-crm/P28_custody_surrendered_by)**  
          - **Description:** Identifies the party that relinquished custody of the object.  
          - **Value:** [Party](#party)
        - **[crm:P29_custody_received_by](http://www.cidoc-crm.org/cidoc-crm/P29_custody_received_by)**  
          - **Description:** Identifies the party that received custody of the object.  
          - **Value:** [Party](#party)
        - **[crm:P14_carried_out_by](http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by)**  
          - **Description:** The individual or organization responsible for executing the transfer of custody.  
          - **Value:** [Party](#party)

---

### Party

- **Type:** [crm:E21_Person](http://www.cidoc-crm.org/cidoc-crm/E21_Person) / [crm:E74_Group](http://www.cidoc-crm.org/cidoc-crm/E74_Group)  
- **Label:** Party  

### Properties  

- **[owl:sameAs](http://www.w3.org/2002/07/owl#sameAs)**  
  - **Description:** A link to an external identifier representing the same entity ([Wikidata](https://www.wikidata.org/) or [Getty ULAN](http://www.getty.edu/research/tools/vocabularies/ulan/)).  
  - **Value:** URI  

- **[crm:P1_is_identified_by](http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by)**  
  - **Description:** The appellation assigned to the party.  
  - **Value:**  
    - **Type:** [crm:E41_Appellation](http://www.cidoc-crm.org/cidoc-crm/E41_Appellation)  
    - **Label:** Appellation  
    - **Properties:**  
      - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
        - **Description:** The type of appellation, categorized using [Getty AAT](http://vocab.getty.edu/aat/) terminology.  
        - **Value Pattern:** `http://vocab.getty.edu/aat/`  
      - **[crm:P190_has_symbolic_content](http://www.cidoc-crm.org/cidoc-crm/P190_has_symbolic_content)**  
        - **Description:** The literal content of the appellation.  
        - **Datatype:** xsd:string  

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** The cultural classification of the party.  
  - **Value:**  
    - **Type:** [crm:E55_Type](http://www.cidoc-crm.org/cidoc-crm/E55_Type)  
    - **Pattern:** `http://vocab.getty.edu/aat/` 
    - **Properties:**  
        - **[crm:P127_has_broader_term](http://www.cidoc-crm.org/cidoc-crm/P127_has_broader_term)**
          - **Description:** Cultural Affiliation.  
          - **Value:** [http://vocab.getty.edu/aat/300055768](http://vocab.getty.edu/aat/300055768)

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** The occupation or profession of the party.  
  - **Value:**  
    - **Type:** [crm:E55_Type](http://www.cidoc-crm.org/cidoc-crm/E55_Type)  
    - **Pattern:** `http://vocab.getty.edu/aat/`
    - **Properties:**  
        - **[crm:P127_has_broader_term](http://www.cidoc-crm.org/cidoc-crm/P127_has_broader_term)**
          - **Description:** Occupations.  
          - **Value:** [http://vocab.getty.edu/aat/300263369](http://vocab.getty.edu/aat/300263369)

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** The classification of a group.  
  - **Value:**  
    - **Type:** [crm:E55_Type](http://www.cidoc-crm.org/cidoc-crm/E55_Type)  
    - **Pattern:** `http://vocab.getty.edu/aat/`
    - **Properties:**  
        - **[crm:P127_has_broader_term](http://www.cidoc-crm.org/cidoc-crm/P127_has_broader_term)**
          - **Description:** Group Type.  
          - **Value:** [http://vocab.getty.edu/aat/300192630](http://vocab.getty.edu/aat/300192630)

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** The gender classification of the party.  
  - **Value:**  
    - **Type:** [crm:E55_Type](http://www.cidoc-crm.org/cidoc-crm/E55_Type)  
    - **Pattern:** `http://vocab.getty.edu/aat/`
    - **Properties:**  
        - **[crm:P127_has_broader_term](http://www.cidoc-crm.org/cidoc-crm/P127_has_broader_term)**
          - **Description:** Gender.  
          - **Value:** [http://vocab.getty.edu/aat/300445640](http://vocab.getty.edu/aat/300445640)

- **[crm:P98i_was_born](http://www.cidoc-crm.org/cidoc-crm/P98i_was_born)**  
  - **Description:** The birth event of the person.  
  - **Value:**  
    - **Type:** [crm:E67_Birth](http://www.cidoc-crm.org/cidoc-crm/E67_Birth)  
    - **Label:** Birth  
    - **Properties:**  
      - **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
        - **Description:** The time span during which the birth occurred.  
        - **Value:** [Timespan](#timespan)  

- **[crm:P95i_was_formed_by](http://www.cidoc-crm.org/cidoc-crm/P95i_was_formed_by)**  
  - **Description:** The formation event of a group.  
  - **Value:**  
    - **Type:** [crm:E66_Formation](http://www.cidoc-crm.org/cidoc-crm/E66_Formation)  
    - **Label:** Formation  
    - **Properties:**  
      - **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
        - **Description:** The time span of the group's formation.  
        - **Value:** [Timespan](#timespan)  

- **[crm:P100i_died_in](http://www.cidoc-crm.org/cidoc-crm/P100i_died_in)**  
  - **Description:** The death event of the person.  
  - **Value:**  
    - **Type:** [crm:E69_Death](http://www.cidoc-crm.org/cidoc-crm/E69_Death)  
    - **Label:** Death  
    - **Properties:**  
      - **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
        - **Description:** The time span of the death.  
        - **Value:** [Timespan](#timespan)  

- **[crm:P99i_was_dissolved_by](http://www.cidoc-crm.org/cidoc-crm/P99i_was_dissolved_by)**  
  - **Description:** The dissolution event of a group.  
  - **Value:**  
    - **Type:** [crm:E68_Dissolution](http://www.cidoc-crm.org/cidoc-crm/E68_Dissolution)  
    - **Label:** Dissolution  
    - **Properties:**  
      - **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
        - **Description:** The time span of the dissolution.  
        - **Value:** [Timespan](#timespan)  

- **[crm:P74_has_current_or_former_residence](http://www.cidoc-crm.org/cidoc-crm/P74_has_current_or_former_residence)**  
  - **Description:** The current or former residence of the party.  
  - **Value:** [Location](#location)  

---

### Timespan

- **Type:** [crm:E52_Time-Span](http://www.cidoc-crm.org/cidoc-crm/E52_Time-Span)  
- **Label:** Timespan  

#### Properties

- **[crm:P82a_begin_of_the_begin](http://www.cidoc-crm.org/cidoc-crm/P82a_begin_of_the_begin)**  
  - **Description:** The date when the time span began.  
  - **Value:** xsd:date

- **[crm:P82b_end_of_the_end](http://www.cidoc-crm.org/cidoc-crm/P82b_end_of_the_end)**  
  - **Description:** The date when the time span ended.  
  - **Value:** xsd:date

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** Specifies the type of the time span, categorized using [Getty AAT](http://vocab.getty.edu/aat/) terminology.  
  - **Value Pattern:** `http://vocab.getty.edu/aat/`  

---

### Location

- **Type:** [crm:E53_Place](http://www.cidoc-crm.org/cidoc-crm/E53_Place)  
- **Label:** Location  

#### Properties

- **[owl:sameAs](http://www.w3.org/2002/07/owl#sameAs)**  
  - **Description:** A link to an external identifier representing the same entity ([Wikidata](https://www.wikidata.org/)).  
  - **Value:** URI  

- **[crm:P89_falls_within](http://www.cidoc-crm.org/cidoc-crm/P89_falls_within)**  
  - **Description:** Indicates that the location falls within a larger location.  
  - **Value:** [Location](#location)

- **[crm:P189i_is_approximated_by](http://www.cidoc-crm.org/cidoc-crm/P189i_is_approximated_by)**  
  - **Description:** Indicates that the location is approximated by another location.  
  - **Value:** [Location](#location)

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** Specifies the type of the location, categorized using [Getty AAT](http://vocab.getty.edu/aat/). terminology.  
  - **Value Pattern:** `http://vocab.getty.edu/aat/`  

---

### Provenance Assessment

- **Type:** [crminf:I15_Provenance_Assessment](http://www.cidoc-crm.org/crminf/I15_Provenance_Assessment)  
- **Label:** Provenance Assessment

#### Properties

- **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
  - **Description:** The type of the provenance assessment, expressed using [Getty AAT](http://vocab.getty.edu/aat/) terms.  
  - **Value:** [http://vocab.getty.edu/aat/300444173](http://vocab.getty.edu/aat/300444173)

- **[crminf:J20_is_about_the_provenance_of](http://www.cidoc-crm.org/crminf/is_about_the_provenance_of)**  
  - **Description:** The physical object that the provenance assessment is about.  
  - **Value:** [Physical Object](#physical-object)

- **[crm:P14_carried_out_by](http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by)**  
  - **Description:** The individual or organization responsible for carrying out the provenance assessment.  
  - **Value:** [E39_Actor](http://www.cidoc-crm.org/cidoc-crm/E39_Actor)

- **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
  - **Description:** The time span during which the provenance assessment took place.  
  - **Value:** [Timespan](#timespan)

- **[crm:P3_has_note](http://www.cidoc-crm.org/cidoc-crm/P3_has_note)**  
  - **Description:** A textual note associated with the provenance assessment.  
  - **Value:** xsd:string

- **[crm:P16_used_specific_object](http://www.cidoc-crm.org/cidoc-crm/P16_used_specific_object)**  
  - **Description:** The information object used in the provenance assessment.  
  - **Value:** [E73_Information_Object](http://www.cidoc-crm.org/cidoc-crm/E73_Information_Object)  
  - **Properties:**
    - **[crm:P2_has_type](http://www.cidoc-crm.org/cidoc-crm/P2_has_type)**  
      - **Description:** The type of the information object, expressed using [Getty AAT](http://vocab.getty.edu/aat/) terms.  
      - **Value Pattern:** http://vocab.getty.edu/aat/
    - **[crm:P94i_was_created_by](http://www.cidoc-crm.org/cidoc-crm/P94i_was_created_by)**  
      - **Description:** The creation event that produced the information object used in the assessment.  
      - **Value:** [E65_Creation](http://www.cidoc-crm.org/cidoc-crm/E65_Creation)  
      - **Properties:**
        - **[crm:P14_carried_out_by](http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by)**  
          - **Description:** The individual or organization responsible for carrying out the creation of the information object.  
          - **Value:** [E39_Actor](http://www.cidoc-crm.org/cidoc-crm/E39_Actor)
        - **[crm:P4_has_time-span](http://www.cidoc-crm.org/cidoc-crm/P4_has_time-span)**  
          - **Description:** The time span during which the creation of the information object occurred.  
          - **Value:** [Timespan](#timespan)
    - **[owl:sameAs](http://www.w3.org/2002/07/owl#sameAs)**  
      - **Description:** A link to an external identifier representing the same entity ([Zotero](https://www.zotero.org/)).  
      - **Value:** URI  

- **[crminf:J21_concluded_provenance](http://www.cidoc-crm.org/crminf/concluded_provenance)**  
  - **Description:** The final conclusion of the provenance assessment.  
  - **Value:** [I14_Provenance_Belief](http://www.cidoc-crm.org/crminf/I14_Provenance_Belief)  
  - **Properties:**
    - **[crminf:J5_holds_to_be](http://www.cidoc-crm.org/crminf/holds_to_be)**  
      - **Description:** The belief held regarding the provenance.  
      - **Value:** [Getty AAT](http://vocab.getty.edu/aat/) terms (e.g., [true](http://vocab.getty.edu/aat/300068765), [probably](http://vocab.getty.edu/aat/300435721), [possibly](http://vocab.getty.edu/aat/300435722), [obsolete](http://vocab.getty.edu/aat/300404908))
    - **[crminf:J4_that](http://www.cidoc-crm.org/crminf/that)**  
      - **Description:** The specific provenance assertion, which is encapsulated within a named graph. This graph provides the context for the provenance activity and its associated data.  
      - **Value:** [Assertion Graph](#assertion-graph)

---

### Nanopublication

- **Type:** [np:Nanopublication](http://www.nanopub.org/ns/schema#Nanopublication)  
- **Label:** Nanopublication

#### Properties

- **[np:hasProvenance](http://www.nanopub.org/ns/schema#hasProvenance)**  
  - **Description:** Refers to the provenance associated with the nanopublication, which includes information about its creation, history, and context.  
  - **Value:** [Provenance Graph](#provenance-graph)

- **[np:hasPublicationInfo](http://www.nanopub.org/ns/schema#hasPublicationInfo)**  
  - **Description:** Contains information about the publication of the nanopublication, such as metadata about the source or publication process.  
  - **Value:** [Publication Info Graph](#publication-info-graph)

- **[np:hasAssertion](http://www.nanopub.org/ns/schema#hasAssertion)**  
  - **Description:** Refers to the assertion made by the nanopublication, representing the claim or fact it supports.  
  - **Value:** [Assertion Graph](#assertion-graph)

---

### Assertion Graph

- **Type:** [np:Assertion](http://www.nanopub.org/ns/schema#Assertion)  
- **Label:** Assertion Graph
- **Content:** [Provenance Activity](#provenance-activity)

---

### Provenance Graph

- **Type:** [np:Provenance](http://www.nanopub.org/ns/schema#Provenance)  
- **Label:** Provenance Graph
- **Content:** [Provenance Assessment](#provenance-assessment)

---

### Publication Info Graph

- **Type:** [np:PublicationInfo](http://www.nanopub.org/ns/schema#ublicationInfo )  
- **Label:** Publication Info  Graph
- **Content:**
  - **subject:** [Nanopublication](#nanopublication)
  - **Properties**
    - **[dct:created](http://purl.org/dc/terms/created)**  
        - **Description:** The timestamp indicating when the nanopublication was created.  
        - **Value:** xsd:dateTime

    - **[dct:creator](http://purl.org/dc/terms/creator)**  
        - **Description:** The individual or organization responsible for creating the nanopublication (ORCID).  
        - **Value:** URI

    - **[dct:license](http://purl.org/dc/terms/license)**  
        - **Description:** The license under which the nanopublication is distributed.  
        - **Value:** URI

    - **[dct:source](http://purl.org/dc/terms/source)**  
        - **Description:** The source from which the nanopublication is derived or referenced.  
        - **Value:** URI

---
