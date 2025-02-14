/*
MIT License

Copyright (C) 2025 Fabio Mariani, Provenance Lab, Leuphana University Lüneburg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Quadstore, Engine, BrowserLevel } from './dist/quadstore.js'
const { DataFactory, StreamParser } = N3
const { namedNode, literal, defaultGraph, quad, blank, blankNode } = DataFactory


const pfx = {
    owl: "http://www.w3.org/2002/07/owl#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    crm: "http://www.cidoc-crm.org/cidoc-crm/",
    crminf: "http://www.cidoc-crm.org/crminf/",
    np: "http://www.nanopub.org/nschema#",
    dct: "http://purl.org/dc/terms/",
    gvp: "http://vocab.getty.edu/ontology#",
    ulan: "http://vocab.getty.edu/ulan/",
    aat: "http://vocab.getty.edu/aat/",
    wd: "https://www.wikidata.org/wiki/"
}

const ownershipChanges = ["aat:300157782__Acquisition", "aat:300417643__Auction", "aat:300417641__Bequest",
    "aat:300417640__Endowment", "aat:300263427__Exchange", "aat:300263427/aat:300417642__Exchange and Purchase",
    "aat:300417654__Field Collected", "aat:300417637__Gift", "aat:300417637/aat:300263427__Gift and Exchange",
    "aat:300417637/aat:300417642__Gift and Purchase", "aat:300417637/aat:300404159__Partial_Gift",
    "aat:300435595__Gift (Promised)", "aat:300444188__Inheritance", "aat:300417642__Purchase",
    "aat:300417843__Restitution"
]

// Declare global variables
let backend, dataFactory, store, engine, quadsArray;

export async function initializeDatabase() {
  backend = new BrowserLevel("quadstore");
  dataFactory = DataFactory;
  store = new Quadstore({ backend, dataFactory });
  engine = new Engine(store);
  quadsArray = [];
  await store.open();
}

function ensureTrailingSlash(uri) {
    return uri.endsWith('/') ? uri : uri + '/';
}

export async function generateLOD(projData) {
    await store.open();
    await store.clear();
    const orcid = "https://orcid.org/" + projData.orcid
    const license = projData.license
    const uri = ensureTrailingSlash(projData.uri)

    for (let i in projData.data) {
        let obj = projData.data[i]
        let objGraphURI = uri + "graph/object/" + i
        let objURI = uri + "object/" + i

        quadsArray.push(quad(
            namedNode(objURI),
            namedNode(pfx.rdf + "type"),
            namedNode(pfx.crm + "E19_Physical_Object"),
            namedNode(objGraphURI)
        ))
        //_____title
        if (obj.title) {
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.rdfs + "label"),
                literal(obj.title),
                namedNode(objGraphURI)
            ))
            let titleNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P102_has_title"),
                titleNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                titleNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E35_Title"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                titleNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.title),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                titleNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300404670"),
                namedNode(objGraphURI)
            ))
        }
        //_____url
        if (obj.url) {
            let pageNode = blankNode()
            let urlNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P70i_is_documented_in"),
                pageNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                pageNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E31_Document"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                pageNode,
                namedNode(pfx.crm + "P1_is_identified_by"),
                urlNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                urlNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E42_Identifier"),
                objGraphURI
            ))
            quadsArray.push(quad(
                urlNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.url),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                urlNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300404630"),
                namedNode(objGraphURI)
            ))
        }
        //_____author
        if (obj.author) {
            let authorNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P67i_is_referred_to_by"),
                authorNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                authorNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E33_Linguistic_Object"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                authorNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.author),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                authorNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300435446"),
                namedNode(objGraphURI)
            ))
        }
        //_____institution
        if (obj.institution) {
            let institutionNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P67i_is_referred_to_by"),
                institutionNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                institutionNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E33_Linguistic_Object"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                institutionNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.institution),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                institutionNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300435449"),
                namedNode(objGraphURI)
            ))
        }
        //_____date
        if (obj.date) {
            let dateNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P67i_is_referred_to_by"),
                dateNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                dateNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E33_Linguistic_Object"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                dateNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.date),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                dateNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300435447"),
                namedNode(objGraphURI)
            ))
        }
        //_____accessionID
        if (obj.accessionID) {
            let accessionNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P67i_is_referred_to_by"),
                accessionNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                accessionNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E33_Linguistic_Object"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                accessionNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.accessionID),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                accessionNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300312355"),
                namedNode(objGraphURI)
            ))
        }
        //_____medium
        if (obj.medium) {
            let mediumNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P67i_is_referred_to_by"),
                mediumNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                mediumNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E33_Linguistic_Object"),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                mediumNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.medium),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                mediumNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300435429"),
                namedNode(objGraphURI)
            ))
        }
        //_____creditLine
        if (obj.creditLine) {
            let creditNode = blankNode()
            quadsArray.push(quad(
                namedNode(objURI),
                namedNode(pfx.crm + "P67i_is_referred_to_by"),
                creditNode,
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                creditNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E33_Linguistic_Object"),
                namedNode(objGraphURI)
             ))
            quadsArray.push(quad(
                creditNode,
                namedNode(pfx.crm + "P190_has_symbolic_content"),
                literal(obj.creditLine),
                namedNode(objGraphURI)
            ))
            quadsArray.push(quad(
                creditNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300435418"),
                namedNode(objGraphURI)
            ))
        }

        let prevPrevActivityURI = null
        let prevActivityURI = null
        let prevActivityID = null
        let contradictionCount = 0
        //____Activities
        for (let act_i in obj.provenanceData) {
            let act = obj.provenanceData[act_i].data
            let nanopub_idx = 0
            let activityURI
            let nanopubURI
            let argumentationURI
            if (act.assertionContradiction && prevActivityURI){
                activityURI = prevActivityURI
                nanopubURI = activityURI + "np/" + prevActivityID + "_" + contradictionCount + "/"
                argumentationURI = uri + "object/" + i + "/argumentation/" + prevActivityID + "_" + contradictionCount + "/"
                contradictionCount += 1
            }
            else{
                activityURI = uri +"object/" + i + "/activity/" + act_i + "/"
                nanopubURI = activityURI + "np/" + act_i +"/"
                argumentationURI = uri + "object/" + i + "/argumentation/" + act_i + "/"
                contradictionCount = 0
            }
            let nanopubURIhead = nanopubURI + "head/"
            let nanopubURIAssertion = nanopubURI + "assertionGraph/"
            let nanopubURIProvenance = nanopubURI + "provenanceGraph/"
            let nanopubURIPubInfo = nanopubURI + "pubInfoGraph/"
            //____NP head
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.np + "Nanopublication"),
                namedNode(nanopubURIhead)
            ))
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.np + "hasProvenance"),
                namedNode(nanopubURIProvenance),
                namedNode(nanopubURIhead)
            ))
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.np + "hasPublicationInfo"),
                namedNode(nanopubURIPubInfo),
                namedNode(nanopubURIhead)
            ))
            //____PubInfo
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.dct + "created"),
                literal(new Date().toISOString(), namedNode(pfx.xsd +"dateTime")),
                namedNode(nanopubURIPubInfo)
            ))
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.dct + "creator"),
                namedNode(orcid),
                namedNode(nanopubURIPubInfo)
            ))
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.dct + "license"),
                namedNode(license),
                namedNode(nanopubURIPubInfo)
            ))
            if (obj.url) {
                quadsArray.push(quad(
                    namedNode(nanopubURI),
                    namedNode(pfx.dct + "source"),
                    namedNode(obj.url),
                    namedNode(nanopubURIPubInfo)
                ))
            }
            //____provenance graph
            quadsArray.push(quad(
                namedNode(argumentationURI),
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crminf + "I15_Provenance_Assessment"),
                namedNode(nanopubURIProvenance)
            ))
            quadsArray.push(quad(
                namedNode(argumentationURI),
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300444173"),
                namedNode(nanopubURIProvenance)
            ))
            quadsArray.push(quad(
                namedNode(argumentationURI),
                namedNode(pfx.crminf + "J20_is_about_the_provenance_of"),
                namedNode(objURI),
                namedNode(nanopubURIProvenance)
            ))
            if (act.assertionAuthor){
                let assertionAuthorNode = blankNode()
                quadsArray.push(quad(
                    namedNode(argumentationURI),
                    namedNode(pfx.crm + "P14_carried_out_by"),
                    assertionAuthorNode,
                    namedNode(nanopubURIProvenance)
                ))
                quadsArray.push(quad(
                    assertionAuthorNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E39_Actor"),
                    namedNode(nanopubURIProvenance)
                ))
                quadsArray.push(quad(
                    assertionAuthorNode,
                    namedNode(pfx.rdfs + "label"),
                    literal(act.assertionAuthor),
                    namedNode(nanopubURIProvenance)
                ))
            }
            if (act.assertionTimeString || act.assertionTimeEDTF){
                timespan_creation(namedNode(argumentationURI), nanopubURIProvenance, act.assertionTimeString, act.assertionTimeEDTF)
            }
            if (act.assertionNotes){
                quadsArray.push(quad(
                    namedNode(argumentationURI),
                    namedNode(pfx.crm + "P3_has_note"),
                    literal(act.assertionNotes),
                    namedNode(nanopubURIProvenance)
                ))
            }
            if (act.sources){
                for (let source of act.sources){
                    let sourceNode = blankNode()
                    quadsArray.push(quad(
                        namedNode(argumentationURI),
                        namedNode(pfx.crm + "P16_used_specific_object"),
                        sourceNode,
                        namedNode(nanopubURIProvenance)
                    ))
                    quadsArray.push(quad(
                        sourceNode,
                        namedNode(pfx.rdf + "type"),
                        namedNode(pfx.crm + "E73_Information_Object"),
                        namedNode(nanopubURIProvenance)
                    ))
                    if (source.type){
                        quadsArray.push(quad(
                            sourceNode,
                            namedNode(pfx.crm + "P2_has_type"),
                            namedNode(pfx.aat + source.type.split("__")[0].split("aat:")[1]),
                            namedNode(nanopubURIProvenance)
                        ))
                    }
                    if (source.citation){
                        quadsArray.push(quad(
                            sourceNode,
                            namedNode(pfx.rdfs + "label"),
                            literal(source.citation),
                            namedNode(nanopubURIProvenance)
                        ))
                    }
                    if (source.author || source.date){
                        let sourceCreation = blankNode()
                        quadsArray.push(quad(
                            sourceNode,
                            namedNode(pfx.crm + "P94i_was_created_by"),
                            sourceCreation,
                            namedNode(nanopubURIProvenance)
                        ))
                        quadsArray.push(quad(
                            sourceCreation,
                            namedNode(pfx.rdf + "type"),
                            namedNode(pfx.crm + "E65_Creation"),
                            namedNode(nanopubURIProvenance)
                        ))
                        if (source.date){
                            timespan_creation(sourceCreation, nanopubURIProvenance, source.date, source.date)
                        }
                        if (source.author){
                            for (let aut of source.author.split(";")) {
                                let agent = blankNode()
                                quadsArray.push(quad(
                                    sourceCreation,
                                    namedNode(pfx.crm + "P14_carried_out_by"),
                                    agent,
                                    namedNode(nanopubURIProvenance)
                                ))
                                quadsArray.push(quad(
                                    agent,
                                    namedNode(pfx.rdf + "type"),
                                    namedNode(pfx.crm + "E39_Actor"),
                                    namedNode(nanopubURIProvenance)
                                ))
                                quadsArray.push(quad(
                                    agent,
                                    namedNode(pfx.rdfs + "label"),
                                    literal(aut.trim()),
                                    namedNode(nanopubURIProvenance)
                                ))
                            }
                        }
                    }
                    if (source.url) {
                        quadsArray.push(quad(
                            sourceNode,
                            namedNode(pfx.owl + "sameAs"),
                            namedNode(source.url),
                            namedNode(nanopubURIProvenance)
                        ))
                    }
                    if (source.notes){
                        let quoteNode = blankNode()
                        quadsArray.push(quad(
                            sourceNode,
                            namedNode(pfx.crm + "P3_has_note"),
                            literal(source.notes),
                            namedNode(nanopubURIProvenance)
                        ))
                    }
                }
            }
            //____AssertionGraph
            //_____activity certainty
            quadsArray.push(quad(
                namedNode(nanopubURI),
                namedNode(pfx.np + "hasAssertion"),
                namedNode(nanopubURIAssertion),
                namedNode(nanopubURIhead)
            ))
            let beliefNode = blankNode()
            quadsArray.push(quad(
                namedNode(argumentationURI),
                namedNode(pfx.crminf + "J21_concluded_provenance"),
                beliefNode,
                namedNode(nanopubURIProvenance)
            ))
            quadsArray.push(quad(
                beliefNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crminf + "I14_Provenance_Belief"),
                namedNode(nanopubURIProvenance)
            ))
            quadsArray.push(quad(
                beliefNode,
                namedNode(pfx.crminf + "J5_holds_to_be"),
                namedNode(pfx.aat + act.activityCertainty.split("aat:")[1]),
                namedNode(nanopubURIProvenance)
            ))
            quadsArray.push(quad(
                beliefNode,
                namedNode(pfx.crminf + "J4_that"),
                namedNode(nanopubURIAssertion),
                namedNode(nanopubURIProvenance)
            ))

            //_____activity title
            quadsArray.push(quad(
                namedNode(activityURI),
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E7_Activity"),
                namedNode(nanopubURIAssertion)
            ))
            quadsArray.push(quad(
                namedNode(activityURI),
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300055863"),
                namedNode(nanopubURIAssertion)
            ))
            if (act.activityType) {
                let activityType = act.activityType.split("__")[0].split("aat:")[1]
                if (activityType) {
                    let activityParts = activityType.split("/").map(part => part.replace("aat:", ""))
                    for (let actType of activityParts) {
                        quadsArray.push(quad(
                            namedNode(activityURI),
                            namedNode(pfx.crm + "P2_has_type"),
                            namedNode(pfx.aat + actType),
                            namedNode(nanopubURIAssertion)
                        ))
                    }
                }
            }
            let subActivityNode = blankNode()
            quadsArray.push(quad(
                namedNode(activityURI),
                namedNode(pfx.crm + "P9_consists_of"),
                subActivityNode,
                namedNode(nanopubURIAssertion)
            ))
            let isCustody = false
            if (act.activityType == "aat:300404387__Creation" || act.activityType == "aat:300417639__Commission") {
                quadsArray.push(quad(
                    subActivityNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E12_Production"),
                    namedNode(nanopubURIAssertion)
                ))
                quadsArray.push(quad(
                    subActivityNode,
                    namedNode(pfx.crm + "P108_has_produced"),
                    namedNode(objURI),
                    namedNode(nanopubURIAssertion)
                ))
            } else if (ownershipChanges.includes(act.activityType)) {
                quadsArray.push(quad(
                    subActivityNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E8_Acquisition"),
                    namedNode(nanopubURIAssertion)
                ))
                quadsArray.push(quad(
                    subActivityNode,
                    namedNode(pfx.crm + "P24_transferred_title_of"),
                    namedNode(objURI),
                    namedNode(nanopubURIAssertion)
                ))
            } else if (act.activityType) {
                isCustody = true
                quadsArray.push(quad(
                    subActivityNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E10_Transfer_of_Custody"),
                    namedNode(nanopubURIAssertion)
                ))
                quadsArray.push(quad(
                    subActivityNode,
                    namedNode(pfx.crm + "P30_transferred_custody_of"),
                    namedNode(objURI),
                    namedNode(nanopubURIAssertion)
                ))
            }
            //_____activity title
            if (act.activityTitle) {
                quadsArray.push(quad(
                    namedNode(activityURI),
                    namedNode(pfx.rdfs + "label"),
                    literal(act.activityTitle),
                    namedNode(nanopubURIAssertion)
                ))
            }
            if (act.assertionContradiction){
                if (prevPrevActivityURI){
                    quadsArray.push(quad(
                        namedNode(activityURI),
                        namedNode(pfx.crm + "P183i_starts_after_the_end_of"),
                        namedNode(prevPrevActivityURI),
                        namedNode(nanopubURIAssertion)
                    ))
                }
            }
            else{
                if (prevActivityURI){
                    quadsArray.push(quad(
                        namedNode(activityURI),
                        namedNode(pfx.crm + "P183i_starts_after_the_end_of"),
                        namedNode(prevActivityURI),
                        namedNode(nanopubURIAssertion)
                    ))
                    prevPrevActivityURI = prevActivityURI
                    prevActivityURI = activityURI
                    prevActivityID = act_i
                }
                else{
                    prevActivityURI = activityURI
                    prevActivityID = act_i
                }
            }
            //_____activity Time
            timespan_creation(namedNode(activityURI), nanopubURIAssertion, act.activityTimeString, act.activityTimeEDTF)
            //_____activity Location
            location_creation(activityURI, pfx.crm + "P7_took_place_at", nanopubURIAssertion, act.activityStreet, act.activityCity,
            act.activityProvince, act.activityCountry, act.activityLocationWD, act.activityLocationVague)
            //_____activity Identifiers
            if (act.identifiers) {
                for (let idn of act.identifiers) {
                    if (idn.value) {
                        let identifierAssignmentNode = blankNode()
                        quadsArray.push(quad(
                            namedNode(activityURI),
                            namedNode(pfx.crm + "P9_consists_of"),
                            identifierAssignmentNode,
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            identifierAssignmentNode,
                            namedNode(pfx.rdf + "type"),
                            namedNode(pfx.crm + "E15_Identifier_Assignment"),
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            identifierAssignmentNode,
                            namedNode(pfx.crm + "P140_assigned_attribute_to"),
                            namedNode(objURI),
                            namedNode(nanopubURIAssertion)
                        ))
                        let identifierNode = blankNode()
                        quadsArray.push(quad(
                            identifierAssignmentNode,
                            namedNode(pfx.crm + "P141_assigned"),
                            identifierNode,
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            identifierNode,
                            namedNode(pfx.rdf + "type"),
                            namedNode(pfx.crm + "E42_Identifier"),
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            identifierNode,
                            namedNode(pfx.rdfs + "label"),
                            literal(idn.value),
                            namedNode(nanopubURIAssertion)
                        ))
                        if (idn.type) {
                            quadsArray.push(quad(
                                identifierNode,
                                namedNode(pfx.crm + "P2_has_type"),
                                namedNode(pfx.aat + idn.type.split("__")[0].split("aat:")[1]),
                                namedNode(nanopubURIAssertion)
                            ))
                        }

                    }
                }
            }
            //_____activity Prices
            if (act.prices) {
                for (let price of act.prices) {
                    if (price.value) {
                        let attributeAssignmentNode = blankNode()
                        quadsArray.push(quad(
                            namedNode(activityURI),
                            namedNode(pfx.crm + "P9_consists_of"),
                            attributeAssignmentNode,
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            attributeAssignmentNode,
                            namedNode(pfx.rdf + "type"),
                            namedNode(pfx.crm + "E13_Attribute_Assignment"),
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            attributeAssignmentNode,
                            namedNode(pfx.crm + "P140_assigned_attribute_to"),
                            namedNode(objURI),
                            namedNode(nanopubURIAssertion)
                        ))
                        let attributeNode = blankNode()
                        quadsArray.push(quad(
                            attributeAssignmentNode,
                            namedNode(pfx.crm + "P141_assigned"),
                            attributeNode,
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            attributeNode,
                            namedNode(pfx.rdf + "type"),
                            namedNode(pfx.crm + "E97_Monetary_Amount"),
                            namedNode(nanopubURIAssertion)
                        ))
                        quadsArray.push(quad(
                            attributeNode,
                            namedNode(pfx.crm + "P90_has_value"),
                            literal(price.value),
                            namedNode(nanopubURIAssertion)
                        ))
                        if (price.type) {
                            quadsArray.push(quad(
                                attributeNode,
                                namedNode(pfx.crm + "P2_has_type"),
                                namedNode(pfx.aat + price.type.split("__")[0].split("aat:")[1]),
                                namedNode(nanopubURIAssertion)
                            ))
                        }
                        if (price.currency) {
                            quadsArray.push(quad(
                                attributeNode,
                                namedNode(pfx.crm + "P180_has_currency"),
                                namedNode(pfx.aat + price.currency.split("__")[0].split("aat:")[1]),
                                namedNode(nanopubURIAssertion)
                            ))
                        }
                    }
                }
            }
            //_____activity Parties
            if (act.parties) {
                for (let party of act.parties) {
                    let pURI = uri + "party/" + party.data.id
                    let pRole = party.data.role
                    if (pRole == "sender"){
                        if(isCustody){
                            quadsArray.push(quad(
                                subActivityNode,
                                namedNode(pfx.crm + "P28_custody_surrendered_by"),
                                namedNode(pURI),
                                namedNode(nanopubURIAssertion)
                            ))
                        }
                        else{
                            quadsArray.push(quad(
                                subActivityNode,
                                namedNode(pfx.crm + "P23_transferred_title_from"),
                                namedNode(pURI),
                                namedNode(nanopubURIAssertion)
                            ))
                        }
                    }
                    if (pRole == "receiver"){
                        if(isCustody){
                            quadsArray.push(quad(
                                subActivityNode,
                                namedNode(pfx.crm + "P29_custody_received_by"),
                                namedNode(pURI),
                                namedNode(nanopubURIAssertion)
                            ))
                        }
                        else{
                            quadsArray.push(quad(
                                subActivityNode,
                                namedNode(pfx.crm + "P22_transferred_title_to"),
                                namedNode(pURI),
                                namedNode(nanopubURIAssertion)
                            ))
                        }
                    }
                    if (pRole == "agent"){
                        quadsArray.push(quad(
                            subActivityNode,
                            namedNode(pfx.crm + "P14_carried_out_by"),
                            namedNode(pURI),
                            namedNode(nanopubURIAssertion)
                        ))
                    }
                    if (pRole == "receiver_agent"){
                        quadsArray.push(quad(
                            subActivityNode,
                            namedNode(pfx.crm + "P11_had_participant"),
                            namedNode(pURI),
                            namedNode(nanopubURIAssertion)
                        ))
                    }
                    if (pRole == "sender_agent"){
                        quadsArray.push(quad(
                            subActivityNode,
                            namedNode(pfx.crm + "P11_had_participant"),
                            namedNode(pURI),
                            namedNode(nanopubURIAssertion)
                        ))
                    }
                }
            }
        }
    }
    //____Parties
    for (let i in projData.parties) {
        let partiesURI = uri + "party/" + projData.parties[i] + /graph
        let party = projData.parties[i]
        let pURI = uri + "party/" + party.id
        quadsArray.push(quad(
            namedNode(pURI),
            namedNode(pfx.rdfs + "label"),
            literal(party.label),
            namedNode()
        ))
        if (party.type == "group"){
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E74_Group"),
                namedNode(partiesURI)
            ))
        }
        else {
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E21_Person"),
                namedNode(partiesURI)
            ))
        }
        if (party.WD) {
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.owl + "sameAs"),
                namedNode(pfx.wd  + party.WD.split("_")[0]),
                namedNode(partiesURI)
            ))
        }
        if (party.ULAN) {
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.owl + "sameAs"),
                namedNode(pfx.ulan  + party.ULAN.split("_")[0].split("ulan/")[1]),
                namedNode(partiesURI)
            ))
        }
        if (party.names){
            for (let name of party.names) {
                if (name.value){
                    let nameNode = blankNode()
                    quadsArray.push(quad(
                        namedNode(pURI),
                        namedNode(pfx.crm + "P1_is_identified_by"),
                        nameNode,
                        namedNode(partiesURI)
                    ))
                    quadsArray.push(quad(
                        nameNode,
                        namedNode(pfx.rdf + "type"),
                        namedNode(pfx.crm + "E41_Appellation"),
                        namedNode(partiesURI)
                    ))
                    if (name.type){
                        quadsArray.push(quad(
                            nameNode,
                            namedNode(pfx.crm + "P2_has_type"),
                            namedNode(pfx.aat  + name.type.split("_")[0].split("aat:")[1]),
                            namedNode(partiesURI)
                        ))
                    }
                    quadsArray.push(quad(
                        nameNode,
                        namedNode(pfx.crm + "P190_has_symbolic_content"),
                        literal(name.value),
                        namedNode(partiesURI)
                    ))
                }
            }
        }
        if (party.cultures){
            for (let culture of party.cultures) {
                let cultureNode = namedNode(pfx.aat  + culture.split("_")[0].split("aat:")[1])
                quadsArray.push(quad(
                    namedNode(pURI),
                    namedNode(pfx.crm + "P2_has_type"),
                    cultureNode,
                    namedNode(partiesURI)
                ))
                quadsArray.push(quad(
                    cultureNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E55_Type"),
                    namedNode(partiesURI)
                ))
                quadsArray.push(quad(
                    cultureNode,
                    namedNode(pfx.rdf + "P127_has_broader_term"),
                    namedNode(pfx.aat + "300055768"),
                    namedNode(partiesURI)
                ))
            }
        }

        if (party.occupations){
            for (let occupation of party.occupations) {
                let occupationNode = namedNode(pfx.aat  + occupation.split("_")[0].split("aat:")[1])
                quadsArray.push(quad(
                    namedNode(pURI),
                    namedNode(pfx.crm + "P2_has_type"),
                    occupationNode,
                    namedNode(partiesURI)
                ))
                quadsArray.push(quad(
                    occupationNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E55_Type"),
                    namedNode(partiesURI)
                ))
                quadsArray.push(quad(
                    occupationNode,
                    namedNode(pfx.rdf + "P127_has_broader_term"),
                    namedNode(pfx.aat + "300263369"),
                    namedNode(partiesURI)
                ))
            }
        }

        if (party.groupTypes){
            for (let groupType of party.groupTypes) {
                let groupTypeNode = namedNode(pfx.aat  + groupType.split("_")[0].split("aat:")[1])
                quadsArray.push(quad(
                    namedNode(pURI),
                    namedNode(pfx.crm + "P2_has_type"),
                    groupTypeNode,
                    namedNode(partiesURI)
                ))
                quadsArray.push(quad(
                    groupTypeNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E55_Type"),
                    namedNode(partiesURI)
                ))
                quadsArray.push(quad(
                    groupTypeNode,
                    namedNode(pfx.rdf + "P127_has_broader_term"),
                    namedNode(pfx.aat + "300192630"),
                    namedNode(partiesURI)
                ))
            }
        }

        if (party.gender){
            let genderNode = namedNode(pfx.aat  + party.gender.split("aat:")[1])
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.crm + "P2_has_type"),
                genderNode,
                namedNode(partiesURI)
            ))
            quadsArray.push(quad(
                genderNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E55_Type"),
                namedNode(partiesURI)
            ))
            quadsArray.push(quad(
                genderNode,
                namedNode(pfx.rdf + "P127_has_broader_term"),
                namedNode(pfx.aat + "300445640"),
                namedNode(partiesURI)
            ))
        }

        if (party.relations){
            for (let relation of party.relations) {
                if (relation.type && relation.party){
                    quadsArray.push(quad(
                        namedNode(pURI),
                        namedNode(pfx.gvp + relation.type.split("__")[0].split("gvp:")[1]),
                        namedNode(uri + "party/" + relation.party),
                        namedNode(partiesURI)
                    ))
                }
            }
        }

        if (party.birthTimeEDTF || party.birthTimeString){
            let birthProperty, birthType
            if (party.type == "group"){
                birthProperty = "P95i_was_formed_by"
                birthType = "E66_Formation"
            }
            else {
                birthProperty = "P98i_was_born"
                birthType = "E67_Birth"
            }
            let birthNode = blankNode()
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.crm + birthProperty),
                birthNode,
                namedNode(partiesURI)
            ))
            quadsArray.push(quad(
                birthNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + birthType),
                namedNode(partiesURI)
            ))
            timespan_creation(birthNode, partiesURI, party.birthTimeString, party.birthTimeEDTF)
        }

        if (party.deathTimeEDTF || party.deathTimeString){
            let deathProperty, deathType
            if (party.type == "group"){
                deathProperty = "P99i_was_dissolved_by"
                deathType = "E68_Dissolution"
            }
            else {
                deathProperty = "P100i_died_in"
                deathType = "E69_Death"
            }
            let deathNode = blankNode()
            quadsArray.push(quad(
                namedNode(pURI),
                namedNode(pfx.crm + deathProperty),
                deathNode,
                namedNode(partiesURI)
            ))
            quadsArray.push(quad(
                deathNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + deathType),
                namedNode(partiesURI)
            ))
            timespan_creation(deathNode, partiesURI, party.deathTimeString, party.deathTimeEDTF)
        }

        if (party.locations){
            for (let location of party.locations) {
                location_creation(pURI, pfx.crm + "P74_has_current_or_former_residence", partiesURI, location.street, location.city, location.province, location.country, location.WD, location.locationVague)
            }
        }
    }
    await store.multiPut(quadsArray)
    const { items } = await store.get({});
    const writer = new N3.Writer({format: 'N-Quads', prefixes: pfx}) // or 'TriG'
    items.forEach(quad => {
        writer.addQuad(quad)
    })
    writer.end((error, result) => {
        let blob = new Blob([result], { type: 'application/n-quads' })
        let blobUrl = URL.createObjectURL(blob);
        $('#downloadLink').attr('href', blobUrl).attr('download', 'prova.nq').show();
        $('#loaderModal').modal('hide')
    })
}

async function location_creation(subject, predicate, graph, street, city, province, country, locationWD, locationVague){
    let location = city || province|| country || null
    if (location) {
        let locationLabel = [city, province, country].filter(Boolean).join(", ")
        let locationNode = blankNode()
        let streetNode = blankNode()
        quadsArray.push(quad(
            locationNode,
            namedNode(pfx.rdf + "type"),
            namedNode(pfx.crm + "E53_Place"),
            namedNode(graph)
        ))
        let typeNode;
        if (city) {
            typeNode = namedNode(pfx.aat + "300008389");
        } else if (province) {
            typeNode = namedNode(pfx.aat + "300236157");
        } else if (country) {
            typeNode = namedNode(pfx.aat + "300387506");
        }
        quadsArray.push(quad(
            locationNode,
            namedNode(pfx.crm + "P2_has_type"),
            typeNode,
            namedNode(graph)
        ))
        quadsArray.push(quad(
            locationNode,
            namedNode(pfx.rdfs + "label"),
            literal(locationLabel),
            namedNode(graph)
        ))

        if (locationWD) {
            quadsArray.push(quad(
                locationNode,
                namedNode(pfx.owl + "sameAs"),
                namedNode(pfx.wd + locationWD.split("_")[0]),
                namedNode(graph)
            ))
        }

        if (street) {
            locationLabel = street + ", " + locationLabel
            quadsArray.push(quad(
                streetNode,
                namedNode(pfx.rdfs + "label"),
                literal(locationLabel),
                namedNode(graph)
            ))
            quadsArray.push(quad(
                streetNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E53_Place"),
                namedNode(graph)
            ))
            quadsArray.push(quad(
                streetNode,
                namedNode(pfx.crm + "P2_has_type"),
                namedNode(pfx.aat + "300386983"),
                namedNode(graph)
            ))
            quadsArray.push(quad(
                streetNode,
                namedNode(pfx.crm + "P89_falls_within"),
                locationNode,
                namedNode(graph)
            ))
        }
        if (locationVague) {
            let vagueNode = blankNode()
            quadsArray.push(quad(
                vagueNode,
                namedNode(pfx.rdfs + "label"),
                literal("Near " + locationLabel),
                namedNode(graph)
            ))
            quadsArray.push(quad(
                vagueNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E53_Place"),
                namedNode(graph)
            ))
            if (street){
                quadsArray.push(quad(
                    vagueNode,
                    namedNode(pfx.crm + "P189i_is_approximated_by"),
                    streetNode,
                    namedNode(graph)
                ))
            }
            else {
                quadsArray.push(quad(
                    vagueNode,
                    namedNode(pfx.crm + "P189i_is_approximated_by"),
                    locationNode,
                    namedNode(graph)
                ))
            }
            quadsArray.push(quad(
                namedNode(subject),
                namedNode(predicate),
                vagueNode,
                namedNode(graph)
            ))
        } else if (street){
            quadsArray.push(quad(
                namedNode(subject),
                namedNode(predicate),
                streetNode,
                namedNode(graph)
            ))
        } else {
            quadsArray.push(quad(
                namedNode(subject),
                namedNode(predicate),
                locationNode,
                namedNode(graph)
            ))
        }
    }
}

async function timespan_creation(subject, graph, timeString, timeEDTF){
    timeString = timeString || timeEDTF || null
    if (timeString) {
        let timespanList = []
        if (timeEDTF) {
            let parsedDate = parseEDTFDate(timeEDTF)
            if (parsedDate) {
                if (parsedDate.list.length) {
                    timespanList = parsedDate.list
                } else {
                    timespanList = [parsedDate]
                }
            }
        }
        if (timespanList.length == 0) {
            let timespanNode = blankNode()
            quadsArray.push(quad(
                subject,
                namedNode(pfx.crm + "P4_has_time-span"),
                timespanNode,
                namedNode(graph)
            ))
            quadsArray.push(quad(
                timespanNode,
                namedNode(pfx.rdf + "type"),
                namedNode(pfx.crm + "E52_Time-Span"),
                namedNode(graph)
            ))
            quadsArray.push(quad(
                timespanNode,
                namedNode(pfx.rdfs + "label"),
                literal(timeString),
                namedNode(graph)
            ))
        } else {
            let listTimespanNode = []
            for (let parsedDate of timespanList) {
                let timespanNode = blankNode()
                quadsArray.push(quad(
                    timespanNode,
                    namedNode(pfx.rdf + "type"),
                    namedNode(pfx.crm + "E52_Time-Span"),
                    namedNode(graph)
                ))
                if (timespanList.length > 1) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.rdfs + "label"),
                        literal(parsedDate.string),
                        namedNode(graph)
                    ))
                } else {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.rdfs + "label"),
                        literal(timeString),
                        namedNode(graph)
                    ))
                }
                if (parsedDate.range.length) {
                    if (parsedDate.lowerLimit) {
                        quadsArray.push(quad(
                            timespanNode,
                            namedNode(pfx.crm + "P82a_begin_of_the_begin"),
                            literal(parsedDate.lowerLimit, namedNode(pfx.xsd +"date")),
                            namedNode(graph)
                        ))
                    }
                    if (parsedDate.upperLimit) {
                        quadsArray.push(quad(
                            timespanNode,
                            namedNode(pfx.crm + "P82b_end_of_the_end"),
                            literal(parsedDate.upperLimit, namedNode(pfx.xsd +"date")),
                            namedNode(graph)
                        ))
                    }
                } else {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P82a_begin_of_the_begin"),
                        literal(parsedDate.lowerLimit, namedNode(pfx.xsd +"date")),
                        namedNode(graph)
                    ))
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P82b_end_of_the_end"),
                        literal(parsedDate.upperLimit, namedNode(pfx.xsd +"date")),
                        namedNode(graph)
                    ))
                }
                if (parsedDate.is_vague) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300435723"),
                        namedNode(graph)
                    ))
                }
                if (parsedDate.is_uncertain) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300435722"),
                        namedNode(graph)
                    ))
                }
                if (parsedDate.is_bce) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300455836"),
                        namedNode(graph)
                    ))
                }
                if (parsedDate.is_day) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300379242"),
                        namedNode(graph)
                    ))
                } else if (parsedDate.is_month) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300379245"),
                        namedNode(graph)
                    ))
                } else if (parsedDate.is_season) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300133091"),
                        namedNode(graph)
                    ))
                } else if (parsedDate.is_year) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300379244"),
                        namedNode(graph)
                    ))
                } else if (parsedDate.is_decade) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300379246"),
                        namedNode(graph)
                    ))
                } else if (parsedDate.is_century) {
                    quadsArray.push(quad(
                        timespanNode,
                        namedNode(pfx.crm + "P2_has_type"),
                        namedNode(pfx.aat + "300379247"),
                        namedNode(graph)
                    ))
                }
                listTimespanNode.push(timespanNode)
            }
            if (listTimespanNode.length == 1){
                quadsArray.push(quad(
                    subject,
                    namedNode(pfx.crm + "P4_has_time-span"),
                    listTimespanNode[0],
                    namedNode(graph)
                ))
            }
            else{
                for (let timespanNode of listTimespanNode) {
                    quadsArray.push(quad(
                        subject,
                        namedNode(pfx.crm + "P4_has_time-span"),
                        timespanNode,
                        namedNode(graph)
                    ))
                }
            }
        }
    }
}

export async function download(){
    const { items } = await store.get({});
    const writer = new N3.Writer({format: 'N-Quads', prefixes: pfx}) // or 'TriG'
    items.forEach(quad => {
        writer.addQuad(quad)
    })
    writer.end((error, result) => {
        let blob = new Blob([result], { type: 'application/n-quads' })
        let blobUrl = URL.createObjectURL(blob);
        $('#downloadLink').attr('href', blobUrl).attr('download', 'prova.nq').show();
        $('#loaderModal').modal('hide')
    })
}


export async function sparql(sparqlQuery){
    $("#error").addClass("d-none")
    $("#noresults").addClass("d-none")
    $("#resultsNav").addClass("d-none")
    $('#loaderModalQuery').modal('show')
    var container = $("#resultsContainer");
    container.empty()
    var counter = $("#resultsCounter");
    counter.empty()
    container.empty()
    try{
        let stream = await engine.queryBindings(sparqlQuery);
        let results = []
        stream.on('data', function(bindings) {
            if (bindings){
                results.push(JSON.parse(bindings.toString()))
            }
        })
        stream.on('end', () => {
            $('#loaderModalQuery').modal('hide')
            if (results.length){
                let headers = Object.getOwnPropertyNames(results[0]).reverse()
                displayResults(headers, results)
            }
            else{
                $("#noresults").removeClass("d-none")
            }
        })
    }
    catch {
        $('#loaderModalQuery').modal('hide')
        $("#error").removeClass("d-none")
    }
}


function displayResults(headers, results) {
    var container = $("#resultsContainer");
    var counter = $("#resultsCounter");
    $("#resultsNav").removeClass("d-none")
    counter.html(results.length)
    var table = $("<table>").addClass("table table-bordered");
    table.attr('id', 'resultsTable');
    let thead = $("<thead>")
    var headerRow = $("<tr>");
    headers.forEach(function(header) {
        var th = $("<th>").text(header);
        headerRow.append(th);
    });
    thead.append(headerRow)
    table.append(thead);
    let tbody = $("<tbody>")
    results.forEach(function(result) {
        var row = $("<tr>");
        headers.forEach(function(header) {
            var cell = $("<td>").text(result[header]);
            row.append(cell);
        });
        tbody.append(row);
    });
    table.append(tbody)
    container.append(table);
}
