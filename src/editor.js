/*
# Copyright (C) 2024 Fabio Mariani, Provenance Lab, Leuphana University Lüneburg - All Rights Reserved
# Unauthorized copying of this file, via any medium is strictly prohibited
*/

$.get("src/vocabularies/AAT_vocabularies.json", function(AAT_vocabularies) {
    currencyData = AAT_vocabularies.currencies
    cultureData = AAT_vocabularies.cultures
    groupData = AAT_vocabularies.groupTypes
    namesData = AAT_vocabularies.names
    occupationsData = AAT_vocabularies.occupations
    relationsData = AAT_vocabularies.relations
    documentsData = AAT_vocabularies.documents
})

//-------------------
function fillPage(editor_snippet, party_snippet, location_snippet, relation_snippet) {

    //navigation______________________
    if (filteredDataIndexList){
        $("#countData").html(filteredDataIndexList.length)
    }
    else{
        $("#countData").html(projectData.data.length)
    }

    $("#prevObject").click(function() {
        if (filteredDataIndexList){
            currentFilterIndex = filteredDataIndexList.indexOf(currentObjectID)
            if (currentFilterIndex === 0) {
                currentObjectID = filteredDataIndexList[filteredDataIndexList.length - 1]
            }
            else{
                currentObjectID = filteredDataIndexList[currentFilterIndex-1]
            }
        }
        else{
            if (currentObjectID===0){
                currentObjectID=projectData.data.length - 1
            }
            else{
                currentObjectID -= 1
            }
        }
        objectData = projectData.data[currentObjectID]
        $("#editorContainer").empty()
        $("#editorContainer").append(editor_snippet);
        setTimeout(function () { fillPage(editor_snippet, party_snippet, location_snippet, relation_snippet) }, 200)
    });

    $("#nextObject").click(function() {
        if (filteredDataIndexList){
            currentFilterIndex = filteredDataIndexList.indexOf(currentObjectID)
            if (currentFilterIndex === filteredDataIndexList.length - 1) {
                currentObjectID = filteredDataIndexList[0]
            }
            else{
                currentObjectID = filteredDataIndexList[currentFilterIndex+1]
            }
        }
        else{
            if (currentObjectID === projectData.data.length - 1) {
                currentObjectID=0
            }
            else{
                currentObjectID += 1
            }
        }
        objectData = projectData.data[currentObjectID]
        $("#editorContainer").empty()
        $("#editorContainer").append(editor_snippet);
        setTimeout(function () { fillPage(editor_snippet, party_snippet, location_snippet, relation_snippet) }, 200)
    });

    if (filteredDataIndexList){
        $("#filterTitle").select2({
            allowClear: true,
            data: projectData.data.filter((item, index) => filteredDataIndexList.includes(index))
                .map((item, index) => ({ id: index, text: `${item.title} [${item.author}]` })),
            placeholder: "Search Title",
            width: "100%",
            sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
        })
    }
    else{
        $("#filterTitle").select2({
            allowClear: true,
            data: projectData.data.map((item, index) => ({ id: index, text: `${item.title} [${item.author}]` })),
            placeholder: "Search Title",
            width: "100%",
            sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
        })
    }

    //filters______________________
    if (filters){
        $("#filterModalBtn").hide()
        $("#filtersArea").removeClass("d-none")
        $("#filterTitleContainer").removeClass("col-10").addClass("col-12");
        for (const [key, value] of Object.entries(filters)) {
            if (key == "party"){
                $("#filtersContainer").append(`<p>${key}: ${value.label}</p>`);
            }
            else{
                $("#filtersContainer").append(`<p>${key}: ${value}</p>`);
            }
        }
    }
    $('#removeFilter').on('click', function (e) {
        filteredDataIndexList = null
        filters = null
        $("#editorContainer").empty()
        $("#editorContainer").append(editor_snippet);
        setTimeout(function () { fillPage(editor_snippet, party_snippet, location_snippet, relation_snippet) }, 200)
    })

    $("#filterAuthor").select2({
        dropdownParent: $('#filterModal'),
        allowClear: true,
        data: uniqueAuthors,
        placeholder: "Search Author",
        width: "100%",
        sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
    });

    $("#filterInstitution").select2({
        dropdownParent: $('#filterModal'),
        allowClear: true,
        data: uniqueInstitution,
        placeholder: "Search Institution",
        width: "100%",
        sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
    });

    $("#filterParty").select2({
        minimumInputLength: 1,
        ajax: {
            processResults: function (res, params) {
                let filteredData = Object.keys(projectData.parties).reduce((accumulator, key) => {
                    let party = projectData.parties[key];
                    if (party.label && party.label.toLowerCase().includes(params.term.toLowerCase())) {
                        accumulator.push({ id: key, text: party.label });
                    }
                    return accumulator;
                }, []);
                return { results: filteredData }
            }
        },
        dropdownParent: $('#filterModal'),
        allowClear: true,
        placeholder: "Search Party",
        width: "100%",
        sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
    });

    $('#filterTitle').on('change', function (e) {
        currentObjectID = parseInt($(this).val())
        objectData = projectData.data[currentObjectID]
        $("#editorContainer").empty()
        $("#editorContainer").append(editor_snippet);
        setTimeout(function () { fillPage(editor_snippet, party_snippet, location_snippet, relation_snippet) }, 200)
    })

    $('#search_button').on('click', function (e) {
        $('#filterModal').modal('hide');
        filterKeywordValue = $('#filterKeyword').val()
        filterAuthorValue = $('#filterAuthor').val()
        filterInstitutionValue = $('#filterInstitution').val()
        filterPartyValue = $('#filterParty').val()
        filters = {}
        if (filterAuthorValue){
            filters["author"] = $('#filterAuthor').val()
        }
        if (filterInstitutionValue){
            filters["institution"] = $('#filterInstitution').val()
        }
        if (filterPartyValue){
            filters["party"] = {}
            filters["party"]["id"] = $('#filterParty').val()
            filters["party"]["label"] = $('#filterParty').find(':selected').text()
        }
        if (filterKeywordValue){
            filters["keyword"] = $('#filterKeyword').val()
        }
        if (Object.keys(filters).length > 0) {
            filteredDataIndexList = projectData.data
                .map((item, index) => ({ item, index })) // Include index alongside item
                .filter(({ item }) =>
                    Object.entries(filters).every(([key, value]) => {
                        if (key === "keyword" && value !== null && !item.provenance.toLowerCase().includes(value.toLowerCase())) {
                            return false;
                        }
                        else if (key === "party" && value !== null) {
                            let found = false;
                            for (let act of item.provenanceData) {
                                if (act.data.parties) {
                                    for (let p of act.data.parties) {
                                        if (p.data.id == value["id"]) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                                if (found) break;
                            }
                            if (!found) {
                                return false;
                            }
                        } else if (!["keyword", "party"].includes(key) && value !== null && item[key] !== value) {
                            return false;
                        }
                        return true;
                    })
                )
                .map(({ index }) => index); // Map to index only
            if (filteredDataIndexList && filteredDataIndexList.length > 0){
                currentObjectID = filteredDataIndexList[0]
                objectData = projectData.data[currentObjectID]
                $("#editorContainer").empty()
                $("#editorContainer").append(editor_snippet)
                setTimeout(function () { fillPage(editor_snippet, party_snippet, location_snippet, relation_snippet) }, 200)
            }
            else{
                $('#noResultsModal').modal("show")
                filteredDataIndexList = null
                filters = null
                $('#filterKeyword').val(null)
                $('#filterAuthor').val(null).trigger('change', true)
                $('#filterInstitution').val(null).trigger('change', true)
            }
        }
        else{
            filteredDataIndexList = null
            filters = null
        }
    })

    //form_____________________________________
    var structuredData = []
    var selectedActivity = null
    var activityID = 0

    var identifierID = 0
    var priceID = 0
    var sourceID = 0

    var partyID = 0
    var locationID = 0
    var relationID = 0
    var nameID = 0

    //fill form if data_____________________________________
    if (objectData["provenanceData"].length) {
        $('#loader').modal('show')
        structuredData = objectData["provenanceData"]
        activityID = 0
        for (let thisActivity in objectData["provenanceData"]) {
            let thisActivityID = parseInt(objectData["provenanceData"][thisActivity]["id"])
            if (thisActivityID >= activityID) { activityID = thisActivityID + 1 }
            $("#activitiesList").append(createActivityHTML(thisActivityID))
            let thisActivityData = objectData["provenanceData"][thisActivity]["data"]
            if ("activityType" in thisActivityData){
                let thisActivityType = thisActivityData["activityType"].split("__")[1]
               $("#activity" + thisActivityID + " .activity-type").html(thisActivityType)
            }
            if ("assertionContradiction" in thisActivityData) {
                $("#activity" + thisActivityID + " div.arrow i").removeClass("fa-arrow-circle-down")
                $("#activity" + thisActivityID + " div.arrow i").addClass("fa-question-circle").addClass("text-info")
            }
            let thisActivityEdtfString = "activityTimeEDTF" in thisActivityData ? thisActivityData["activityTimeEDTF"] : false;
            dateGeneration(manual=true, thisActivityEdtfString , thisActivityID)
            selectedActivity = thisActivityID
            checkID(structuredData[structuredData.findIndex(x => x.id == selectedActivity)]["data"])
        }
        let firstActivity = $("#activitiesList .activity-element").first().attr('id')
        if (firstActivity) {
            selectActivity("#" + firstActivity)
            selectedActivity = firstActivity.replace("activity", "")
            fillForm(structuredData[structuredData.findIndex(x => x.id == selectedActivity)]["data"], function () { setTimeout(function () { $('#loader').modal('hide') }, 200) } )
        }
        else{
            setTimeout(function () { $('#loader').modal('hide') }, 200)
        }
    }

    //fill tombstone data____________________
    if (objectData["title"]){
        if (objectData["url"]){
            $("#title").html("<a href='" + objectData["url"] + " ' target='_blank'>" + objectData["title"] + "</a>")
        }
        else{
            $("#title").html(objectData["title"])
        }
    }
    $("#author").append(objectData["author"])
    $("#institution").append(objectData["institution"])
    $("#accession").append(objectData["accessionID"])
    $("#date").html(objectData["date"])
    if (objectData["provenance"]){
        $("#provenance").append("<p>" + objectData["provenance"].split("\n").join("</p><p>") + "</p>")
    }
    if (objectData["notes"]){
        $("#notes").append("<p>" + objectData["notes"].split("\n").join("</p><p>") + "</p>")
    } else {
        $("#cardNotes").remove()
    }
    if (objectData["medium"]){
        $("#medium").append(objectData["medium"])
    } else {
        $("#cardMedium").remove()
    }
    if (objectData["creditLine"]){
        $("#credit").append(objectData["creditLine"])
    } else {
        $("#cardCredit").remove()
    }
    if (objectData["exhibitions"]){
        $("#exhibitions").append("<ol><li class='mb-3'>" + objectData["exhibitions"].split("\n").join("</li><li class='mb-3'>") + "</li></ol>")
    } else {
        $("#cardExhibitions").remove()
    }
    if (objectData["bibliography"]){
        $("#bibliography").append("<ul><li class='mb-3'>" + objectData["bibliography"].split("\n").join("</li><li class='mb-3'>") + "</li></ul>")
    } else {
        $("#cardBibliography").remove()
    }
    if (objectData["inscriptions"]){
        $("#inscriptions").append("<p>" + objectData["inscriptions"].split("\n").join("</p><p>") + "</p>")
    } else {
        $("#cardInscriptions").remove()
    }

    //activities list____________________
    $("#activitiesList").sortable({
        start: function (event, ui) {
            ui.item.data('start_pos', ui.item.index());
        },
        stop: function (event, ui) {
            let startPos = ui.item.data('start_pos');
            let newPos = ui.item.index()
            if (startPos != newPos) {
                let changedElement = structuredData[startPos]
                structuredData.splice(startPos, 1)
                structuredData.splice(newPos, 0, changedElement);
                serializeForm()
            }
        }
    })

    $("#addActivity").on("click", function () {
        $('#loader').modal('show')
        setTimeout(function () {
            serializeForm(function () {
                $("#activitiesList").append(createActivityHTML(activityID));
                let newActivity = { "id": activityID, "data": [] }
                structuredData.push(newActivity)
                selectActivity($("#activity" + activityID))
                selectedActivity = activityID
                activityID += 1
                serializeForm(function () {
                    $('#loader').modal('hide')
                })
            })
        }, 200)
    })

    $("#activitiesList").on("click", ".activity-delete", function (e) {
        e.stopPropagation();
        let activityToDelete = this;
        let result = confirm("Are you sure to remove this Activity?");
        if (result) {
            $('#loader').modal('show')
            setTimeout(function () {
                serializeForm(function () {
                        let target = $(activityToDelete).attr('for');
                        $('#' + target).remove();
                        target = target.replace("activity", "")
                        let targetIndex = structuredData.findIndex(x => x.id == target)
                        structuredData.splice(targetIndex, 1)
                        let allActivities = $(".activity-element").map(function () {
                            return this;
                        }).get();
                        if (allActivities.length == 0) {
                            selectedActivity = null
                            $("#activityForm").hide()
                            serializeForm(function () {
                                $('#loader').modal('hide')
                            })
                        }
                        else {
                            let lastElement = allActivities[allActivities.length - 1]
                            selectActivity(lastElement)
                            selectedActivity = $(lastElement).attr('id').replace("activity", "")
                            let selectedActivityIndex = structuredData.findIndex(x => x.id == selectedActivity)
                            fillForm(structuredData[selectedActivityIndex]["data"], function () {
                                setTimeout(function () {
                                    serializeForm(function () {
                                        $('#loader').modal('hide')
                                    })
                                }, 200)
                            })
                        }
                    })
            }, 200)
        }
    })

    $("#activitiesList").on("click", ".activity-selector", function () {
        let activityToSelect = this;
        $('#loader').modal('show')
        setTimeout(function () {
            serializeForm(function () {
                selectActivity("#" + $(activityToSelect).attr('for'))
                selectedActivity = $(activityToSelect).attr('for').replace("activity", "")
                let selectedActivityIndex = structuredData.findIndex(x => x.id == selectedActivity)
                fillForm(structuredData[selectedActivityIndex]["data"], function () {
                    setTimeout(function () {
                        $('#loader').modal('hide')
                    }, 200)
                })
            })
        }, 200)
    })

    $('#activityForm').on("change", "#activityType", function (e) {
        e.stopPropagation();
        let activityType
        if ($('#activityType').val()){
            activityType = $('#activityType').val().split("__")[1]
            let selectedOption = $('#activityType').find(":selected");
            let selectedOptgroup = selectedOption.parent("optgroup").attr("label")
            $(".party-role option").prop("disabled", false);
            if (selectedOptgroup == "Production"){
                $(".party-role option[value='sender'], .party-role option[value='sender_agent'], .party-role option[value='receiver_agent']").prop("disabled", true)
                $(".party-role:has(option:selected[value='sender'], option:selected[value='sender_agent'], option:selected[value='receiver_agent'])").val("")
                if (activityType == "Creation"){
                    $(".party-role option[value='receiver']").prop("disabled", true)
                    $(".party-role:has(option:selected[value='receiver'])").val("")
                }
            }
            else if (selectedOptgroup == "Change of Custody"){
                $(".party-role option[value='sender_agent'], .party-role option[value='receiver_agent']").prop("disabled", true)
                $(".party-role:has(option:selected[value='sender_agent'], option:selected[value='receiver_agent'])").val("")
            }
        }
        else {
            $(".party-role option").prop("disabled", false);
            activityType = "Unknown Activity"
        }
        $("#activity" + selectedActivity + " .activity-type").html(activityType)
    });

    function selectActivity(selectedActivityElement) {
        $(".activity-element.active .activity-selector").addClass("btn-outline-dark")
        $(".activity-element.active .activity-selector").removeClass("btn-outline-light")
        $(".activity-element.active").removeClass("active bg-secondary border-secondary rounded-left");
        $(selectedActivityElement).addClass("active bg-secondary border-secondary rounded-left");
        $(".activity-element.active .activity-selector").removeClass("btn-outline-dark");
        $(".activity-element.active .activity-selector").addClass("btn-outline-light");
        $(".location-wikidata").empty()
        $(".location-wikidata").append('<option value="" selected>Choose</option>')
        initializeWikidata(".location-wikidata", "#activityForm")
        $("#activityForm").trigger("reset");
        $("#partiesContainer").empty()
        $("#identifiersContainer").empty()
        $("#pricesContainer").empty()
        $("#sourcesContainer").empty()
        $("#activityForm").show()
    }

    function createActivityHTML(createActivityID) {
        return `
        <div class="list-group-item activity-element" id="activity${createActivityID}" style="z-index:5 !important">
            <div class="arrow text-center text-dark" style="z-index:5 !important"><br>
                <div style="margin-top: -42px">
                    <span style="z-index:5 !important" class="rounded-circle bg-light"><i style="position: relative;" class="rounded-circle fa-solid fa-lg fa-arrow-circle-down"></i></span>
                </div>
            </div>
            <div class="row ps-0">
                <div class="col-2 p-0 m-auto text-center">
                    <i class="fas fa-sort pe-2" style="cursor: -webkit-grab; cursor: grab;"></i>
                </div>
                <div class="col-8 p-0">
                    <button class="btn btn-outline-dark activity-selector w-100" type="button" for="activity${createActivityID}">
                        <span class="activity-type">Unknown Activity</span><br>
                        <small class="activity-year">????</small>
                    </button>
                </div>
                <div class="col-2 p-0 m-auto">
                    <button class="btn btn-danger btn-sm float-end m-auto activity-delete" type="button" for="activity${createActivityID}"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>`;
    }

    function dateGeneration(manual=false, edtfString=false, idAct=false) {
        if (manual == false){
            edtfString = $('#activityTimeEDTF').val()
        }
        let timeString = ""
        if (edtfString) {
            timeString = edtfString
        }
        else {
            timeString = "????"
        }

        if (manual == false){
            $("#activity" + selectedActivity + " .activity-year").html(timeString)
        }
        else{
            $("#activity" + idAct + " .activity-year").html(timeString)
        }
    }

    // Identifiers_____________________
    $("#activityForm").on("click", "#addIdentifier", function (e) {
        e.stopPropagation();
        addIdentifier(identifierID)
        identifierID += 1
        serializeForm()
    })

    $("#activityForm").on("click", ".identifier-delete", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Identifier?");
        if (result) {
            let target = $(this).attr('for');
            $('#' + target).remove();
            serializeForm()
        }
    })

    function addIdentifier(addIdentifierID, addIdentifierType = false, addIdentifierValue = false) {
        $('#identifiersContainer').append(`
            <div class="row mt-4" id="identifier${addIdentifierID}">
                <div class="col-md-4">
                    <select class="form-select" name="identifier${addIdentifierID}type">
                        <option value="" disabled selected>Identifier Type</option>
                        <option value="">None</option>
                        <option value="aat:300404626">identification number</option>
                        <option value="aat:300404628">lot number</option>
                        <option value="aat:300404622">creation number</option>
                        <option value="aat:300452086">collector number</option>
                        <option value="aat:300404620">catalog number</option>
                        <option value="aat:300412177">stock number</option>
                        <option value="aat:300444185">Lugt number</option>
                        <option value="aat:300312355">accession number</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" name="identifier${addIdentifierID}value" placeholder="Identifier">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-danger btn-sm identifier-delete" type="button" for="identifier${addIdentifierID}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `)
        if (addIdentifierType) {
            $("select[name='identifier" + addIdentifierID + "type']").val(addIdentifierType)
        }
        if (addIdentifierValue) {
            $("input[name='identifier" + addIdentifierID + "value']").val(addIdentifierValue)
        }
    }

    // Prices_____________________
    $("#activityForm").on("click", "#addPrice", function (e) {
        e.stopPropagation();
        addPrice(priceID)
        priceID += 1
        serializeForm()
    })

    $("#activityForm").on("click", ".price-delete", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Price?");
        if (result) {
            let target = $(this).attr('for');
            $('#' + target).remove();
            serializeForm()
        }
    })

    function addPrice(addPriceID, addPriceType = false, addPriceValue = false, addPriceCurrency = false) {
        $('#pricesContainer').append(`
            <div class="row mt-4" id="price${addPriceID}">
                <div class="col-md-3">
                    <select class="form-select" name="price${addPriceID}type">
                        <option value="" disabled selected>Price Type</option>
                        <option value="">None</option>
                        <option value="aat:300417246">sale price</option>
                        <option value="aat:300417244">estimated price</option>
                        <option value="aat:300417242">starting price</option>
                        <option value="aat:300417243">reserve price</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" name="price${addPriceID}value" placeholder="Price">
                </div>
                <div class="col-md-5">
                    <select class="form-select" name="price${addPriceID}currency">
                        <option value="" selected>Choose</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-danger btn-sm price-delete" type="button" for="price${addPriceID}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `)
        if (addPriceType) {
            $("select[name='price" + addPriceID + "type']").val(addPriceType)
        }
        if (addPriceValue) {
            $("input[name='price" + addPriceID + "value']").val(addPriceValue)
        }
        currenciesSelector("select[name='price" + addPriceID + "currency']", selectCurrency=addPriceCurrency)
    }

    function currenciesSelector(selectorCurrency, selectCurrency=false){
        $(selectorCurrency).select2({
            allowClear: true,
            dropdownParent: $('#activityForm'),
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = currencyData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            },
            placeholder: "Search Currency",
            width: "100%"
        })
        if (selectCurrency) {
            $(selectorCurrency).append(new Option(selectCurrency.split("__")[1], selectCurrency, true, true))
        }
    }

    // Source/Assertion__________________________________
    $('#assertionContradiction').change(function () {
        if ($('#assertionContradiction').is(':checked')) {
            $("#activity" + selectedActivity + " div.arrow i").removeClass("fa-arrow-circle-down")
            $("#activity" + selectedActivity + " div.arrow i").addClass("fa-question-circle").addClass("text-info")
        } else {
            $("#activity" + selectedActivity + " div.arrow i").removeClass("fa-question-circle").removeClass("text-info")
            $("#activity" + selectedActivity + " div.arrow i").addClass("fa-arrow-circle-down")
        }
    });

    $("#addSource").on("click", function () {
        addSource(sourceID)
        sourceID += 1
        serializeForm()
    })

    $("#sourcesContainer").on("click", ".source-delete", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Source?");
        if (result) {
            let target = $(this).attr('for');
            $('#' + target).remove();
            serializeForm()
        }
    })

    function addSource(addSourceID, addSourceType=null) {
        $("#sourcesContainer").append(`
            <div class="card border-secondary mb-3" id="source${addSourceID}">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <button class="btn btn-link text-dark font-weight-bold text-start" type="button" data-bs-toggle="collapse" data-bs-target="#source${addSourceID}body">
                                <span id="source${addSourceID}title">Unknown Source</span>
                            </button>
                        </div>
                        <div class="col-2">
                            <button class="btn btn-danger btn-sm float-end source-delete" type="button" for="source${addSourceID}"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                <div id="source${addSourceID}body" class="collapse">
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="source${addSourceID}type" class="form-label">Type</label>
                            <select class="form-control w-100" id="source${addSourceID}type" name="source${addSourceID}type"></select>
                        </div>
                        <div class="mb-3">
                            <label for="source${addSourceID}citation" class="form-label">Citation</label>
                            <input type="text" class="form-control source-lab" id="source${addSourceID}citation" name="source${addSourceID}citation" placeholder="Enter the source citation (i.e., Chicago style reference)">
                        </div>
                        <div class="mb-3">
                            <label for="source${addSourceID}url" class="form-label">Zotero Link (public groups only)</label>
                            <input type="text" class="form-control source-url" id="source${addSourceID}url" name="source${addSourceID}url" placeholder="Enter Zotero link (public groups only)">
                        </div>
                        <div class="mb-3">
                            <label for="source${addSourceID}author" class="form-label">Author(s)</label>
                            <input type="text" class="form-control" id="source${addSourceID}author" name="source${addSourceID}author" placeholder="Enter the author's name(s)">
                        </div>
                        <div class="mb-3">
                            <label for="source${addSourceID}date" class="form-label">Date</label>
                            <input type="text" class="form-control date-check" id="source${addSourceID}date" name="source${addSourceID}date" placeholder="Enter date (YYYY-MM-DD)">
                        </div>
                        <div class="mb-3">
                            <label for="source${addSourceID}notes" class="form-label">Notes</label>
                            <textarea class="form-control" id="source${addSourceID}notes" name="source${addSourceID}notes" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>`)
        initializeSourceType("#source"+addSourceID+"type", addSourceType)
    }

    function initializeSourceType(initSourceSel, initSourceType=false){
        $(initSourceSel).select2({
            allowClear: true,
            dropdownParent: $(initSourceSel).closest('.collapse'),
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = documentsData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            },
            placeholder: "Search Source Type",
            width: "100%"
        })
        if (initSourceType) {
            $(initSourceSel).append(new Option(initSourceType.split("__")[1], initSourceType, true, true))
        }
    }

    $('#activityForm').on("change", ".source-url", function () {
        let changeSourceID = $(this).attr('id').replace("url", "").replace("source", "")
        zoteroAPI("#source" + changeSourceID, $(this).val())
    })

    $('#activityForm').on("change", ".source-lab", function () {
        let changeSourceID = $(this).attr('id').replace("citation", "").replace("source", "")
        if ($(this).val()){
                $("#source" + changeSourceID + "title").html($(this).val())
        }
        else{
            $("#source" + changeSourceID + "title").html("Unknown Source")
        }
    })

    // Location_________________________________________
    $('#activityForm').on("change", ".location-data", async function () {
        locationContainer = $(this).closest(".location-container")
        city = locationContainer.find(".city").val()
        province = locationContainer.find(".province").val()
        country = locationContainer.find(".country").val()
        locationWD = locationContainer.find(".location-wikidata").val()
        locationWDtagID = locationContainer.find(".location-wikidata").attr('id')
        promises = []
        $('#loader').modal('show')
        locationValue = ""
        if (city){
            locationValue = city
        }
        else if (province){
            locationValue = province
        }
        else if (country){
            locationValue = country
        }
        promises.push(queryWD(locationValue, "#"+locationWDtagID, locationWD))
        await Promise.all(promises).then(() => {
            $('#loader').modal('hide')
         });
    });

    // Party_________________________________________
    $("#addParty").on("click", function () {
        let partySnippet = party_snippet.split("[[index]]").join(partyID)
        $("#partiesContainer").append(partySnippet);
        initializeWikidata('#party' + partyID + ' .wikidata', "#party" + partyID + "modal")
        initializeUlan('#party' + partyID + ' .ulan', "#party" + partyID + "modal")
        let uniquePartyID = ranLetter() + Date.now()
        $("#party" + partyID + "id").val(uniquePartyID)
        activatePartySelector()
        $('#partiesContainer .collapse').removeClass('show');
        $("#party" + partyID + "body").addClass('show')
        cultureSelector("#party" + partyID + "cultures")
        groupSelector("#party" + partyID + "groupTypes")
        occupationSelector("#party" + partyID + "occupations")
        let activityType = $('#activityType').val().split("__")[1]
        let selectedOption = $('#activityType').find(":selected");
        let selectedOptgroup = selectedOption.parent("optgroup").attr("label")
        if (selectedOptgroup == "Production"){
            $("#party" + partyID + " .party-role option[value='sender'], .party-role option[value='sender_agent'], .party-role option[value='receiver_agent']").prop("disabled", true)
            if (activityType == "Creation"){
                $("#party" + partyID + " .party-role option[value='receiver']").prop("disabled", true)
            }
        }
        else if (selectedOptgroup == "Change of Custody"){
            $("#party" + partyID + " .party-role option[value='sender_agent'], .party-role option[value='receiver_agent']").prop("disabled", true)
        }
        partyID += 1
        serializeForm()
    })

    $("#partiesContainer").on("click", ".delete-party", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Party?");
        if (result) {
            let target = $(this).attr('for')
            $('#' + target).remove()
            serializeForm()
        }
    })

    $('#activityForm').on("change", ".party-type", function (e) {
        e.stopPropagation();
        let value = $(this).parent().children('.party-type').filter(':checked').val();
        let id = $(this).attr('name').replace("party", "").replace("type", "")
        $("#party" + id + "relationsContainer").empty()
        $("#party" + id + "nameContainer").empty()
        if (value == "person") {
            $("#party" + id + "body .person-data").show()
            $("#party" + id + "body .group-data").hide()
            $("#party" + id + "body .group-data .form-check-input").prop('checked', false);
            $("#party" + id + "body .group-data .form-control").val("").trigger('change');
            $("#party" + id + "deathLabel").text("Death")
            $("#party" + id + "birthLabel").text("Birth")
        }
        else {
            $("#party" + id + "body .group-data").show()
            $("#party" + id + "body .person-data").hide()
            $("#party" + id + "body .person-data .form-check-input").prop('checked', false);
            $("#party" + id + "body .person-data .form-control").val("").trigger('change');
            $("#party" + id + "deathLabel").text("Dissolution")
            $("#party" + id + "birthLabel").text("Formation")
            let name = $('#party' + id + 'label').val()
            if (name == "") { name = "Unknown Party" }
            else {
                $("#party" + id + "edit").html("<i class='fas fa-user-edit'></i> Edit " + name)
            }
            $("#party" + id + " .party-title").html(name)
        }
    });

    $('#activityForm').on("change", ".party-label", async function () {
        let thisPartyID = $(this).attr('id').replace("label", "").replace("party", "")
        let partyLabel = $(this).val()
        let thisPartyWD = $("#party" + thisPartyID + "WD").val()
        let thisPartyULAN = $("#party" + thisPartyID + "ULAN").val()
        let promises = []
        $('#loader').modal('show')
        if (partyLabel == "") {
            partyLabel = "Unknown Party"
            promises.push(queryWD("", "#party" + thisPartyID + "WD", thisPartyWD))
            promises.push(queryULAN("", "#party" + thisPartyID + "ULAN", thisPartyULAN))
        }
        else {
            $("#party" + thisPartyID + "edit").html("<i class='fas fa-user-edit'></i> Edit " + partyLabel)
            promises.push(queryWD(partyLabel, "#party" + thisPartyID + "WD", thisPartyWD))
            promises.push(queryULAN(partyLabel, "#party" + thisPartyID + "ULAN", thisPartyULAN))
        }
        $("#party" + thisPartyID + " .party-title").html(partyLabel)
        await Promise.all(promises).then((values) => {
            $('#loader').modal('hide')
         });
    });

    function activatePartySelector() {
        let unvailableParties = $(".party-id").map(function () { return $(this).attr("value"); }).get();
        $('.party-selector').select2({
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = Object.keys(projectData.parties).reduce((accumulator, key) => {
                        let party = projectData.parties[key];
                        if (party.label && party.label.toLowerCase().includes(params.term.toLowerCase())) {
                            accumulator.push({ id: key, text: party.label });
                        }
                        return accumulator;
                    }, []);
                    return { results: filteredData }
                }
            },
            placeholder: "Search existing Party",
            allowClear: true,
            sorter: data => data.sort((a, b) => a.text.localeCompare(b.text)),
            templateResult: function (data) {
                if (unvailableParties.includes(data.id)) {
                    data.disabled = true
                }
                return data.text;
            }
        });
        $(".party-selector").children('option').prop('disabled', false)
        for (let uP in unvailableParties) {
            $(".party-selector").children('[value="' + unvailableParties[uP] + '"]').prop('disabled', true)
        }

        $('.party-selector').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            let actualPartyID = $(this).attr('id').replace("party", "").replace("select2", "")
            let selectedPartyID = $(this).val()
            if (selectedPartyID && selectedPartyID !== "") {
                if (projectData.parties[selectedPartyID]){
                    partyData = projectData.parties[selectedPartyID]
                    let selectedActivityIndex = structuredData.findIndex(x => x.id == selectedActivity)
                    let actualPartyIndex = structuredData[selectedActivityIndex]["data"]["parties"].findIndex(e => e.index == actualPartyID)

                    for (let key in structuredData[selectedActivityIndex]["data"]["parties"][actualPartyIndex]["data"]) {
                        if (key !== "role") {
                            delete structuredData[selectedActivityIndex]["data"]["parties"][actualPartyIndex]["data"][key]
                        }
                    }
                    for (let key in partyData) {
                        if (key !== "role") {
                            structuredData[selectedActivityIndex]["data"]["parties"][actualPartyIndex]["data"][key] = partyData[key]
                        }
                    }
                    $("#activityForm").trigger("reset");
                    $("#partiesContainer").empty()
                    $("#identifiersContainer").empty()
                    $("#pricesContainer").empty()
                    $("#sourcesContainer").empty()
                    $("#activityForm").show()
                    $('#loader').modal('show')
                    fillForm(structuredData[selectedActivityIndex]["data"], function () {
                        setTimeout(function () {
                            serializeForm(function () {
                                $('#loader').modal('hide')
                            })
                        }, 200);
                    })
                    $("#party" + actualPartyID + "body").collapse()
                }
            }
        });
    }

    $('#activityForm').on("change", ".party-wikidata", function (e) {
        e.stopPropagation();
        $(".alert-warning").val("")
        $(".alert-warning").removeClass("alert-warning")
        let partySelectorID = this.id.replace("WD", "")
        if (this.value) {
            let queryWDid = this.value.split("___")[0]
            $('#loader').modal('show')
            try{
                let endpointUrl = 'https://query.wikidata.org/sparql?',
                sparqlQuery = `
                SELECT DISTINCT *
                WHERE {
                    VALUES ?party { wd:`+ queryWDid + `}
                    OPTIONAL { ?party wdt:P569 ?birthDate. BIND(xsd:date(?birthDate) AS ?birth)}
                    OPTIONAL { ?party wdt:P570 ?deathDate. BIND(xsd:date(?deathDate) AS ?death)}
                    OPTIONAL { ?party wdt:P571 ?inceptionDate. BIND(xsd:date(?inceptionDate) AS ?inception)}
                    OPTIONAL { ?party wdt:P576 ?dissolutionDate. BIND(xsd:date(?dissolvedDate) AS ?dissolution)}
                }`
                settings = {
                    headers: { Accept: 'application/sparql-results+json' },
                    data: { query: sparqlQuery }
                };
                $.ajax(endpointUrl, settings).then( function (data) {
                    queryData = data.results.bindings[0]
                    if ("birth" in queryData || "inception" in queryData) {
                        let wdBirth
                        if ("birth" in queryData) {
                            wdBirth = queryData["birth"].value
                        }
                        else {
                            wdBirth = queryData["inception"].value
                        }
                        $("#" + partySelectorID + "birthTimeString").val(wdBirth)
                        let edtfBirth = TextToEdtf(wdBirth)
                        if (edtfBirth){
                            let edtfSibling = $("#" + partySelectorID + "birthTimeString").closest(".time-container").find('.edtf-check')
                            edtfSibling.val(edtfBirth).trigger('change', true)
                        }
                    }
                    if ("death" in queryData || "dissolution" in queryData) {
                        let wdDeath
                        if ("death" in queryData) {
                            wdDeath = queryData["death"].value
                        }
                        else {
                            wdDeath = queryData["dissolution"].value
                        }
                        $("#" + partySelectorID + "deathTimeString").val(wdDeath)
                        let edtfDeath = TextToEdtf(wdDeath)
                        if (edtfDeath){
                            let edtfSibling = $("#" + partySelectorID + "deathTimeString").closest(".time-container").find('.edtf-check')
                            edtfSibling.val(edtfDeath).trigger('change', true)
                        }
                    }
                    $('#loader').modal('hide')
                })
            }
            catch {
                $('#loader').modal('hide')
            }
        }
    })

    //party names
    $("#partiesContainer").on("click", ".add-party-name", function (e) {
        e.stopPropagation();
        let nameContainer = $(this).attr('for')
        let partyIDaddName = nameContainer.replace("party", "").replace("nameContainer", "")
        partyNameAdd(nameID, partyIDaddName)
        nameID += 1
        serializeForm()
    })
    $("#partiesContainer").on("click", ".delete-name", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Name?");
        if (result) {
            let target = $(this).attr('for');
            $('#' + target).remove();
            serializeForm()
        }
    })

    function partyNameAdd (NameAddID, NameAddPartyID, NameAddType = false, NameAddVal = false) {
        $('#party' + NameAddPartyID + 'nameContainer').append(`
            <div class="row mt-4" id="party${NameAddPartyID}name${NameAddID}">
                <div class="col-4">
                    <select class="form-control form-control" name="party${NameAddPartyID}name${NameAddID}type">
                        <option value=""></option>
                    </select>
                </div>
                <div class="col-4">
                    <input type="text" class="form-control form-control w-100" name="party${NameAddPartyID}name${NameAddID}value" placeholder="Name">
                </div>
                <div class="col-4">
                    <button class="btn btn-danger btn-sm delete-name" type="button" for="party${NameAddPartyID}name${NameAddID}"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        `)
        if (NameAddVal) {
            $("input[name='party" + NameAddPartyID + "name" + NameAddID + "value']").val(NameAddVal)
        }
        nameSelector("select[name='party" + NameAddPartyID + "name" + NameAddID + "type']", NameAddType)
    }

    function nameSelector(nameSelector, nameSelect=false){
        $(nameSelector).select2({
            allowClear: true,
            dropdownParent:  $(nameSelector).closest('.modal'),
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = namesData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            },
            placeholder: "Search Name Type",
            width: "100%",
        })
        if (nameSelect) {
            $(nameSelector).append(new Option(nameSelect.split("__")[1], nameSelect, true, true))
        }
    }

    //party location
    $("#partiesContainer").on("click", ".location-add", function (e) {
        e.stopPropagation();
        let locationsContainer = $(this).attr('for')
        let locationPartyID = locationsContainer.replace("party", "").replace("locationsContainer", "")
        let locationSnippet = location_snippet.split("[[index]]").join(locationID)
        locationSnippet = locationSnippet.split("[[party_index]]").join(locationPartyID)
        $('#' + locationsContainer).append(locationSnippet)
        initializeWikidata('#' + locationsContainer + " .location-wikidata", "#party" + locationPartyID + "modal")
        locationID += 1
        serializeForm()
    })

    $("#partiesContainer").on("click", ".delete-location", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Location?");
        if (result) {
            let target = $(this).attr('for');
            $('#' + target).remove();
            serializeForm()
        }
    })

    $('#activityForm').on("change", ".location-address", function (e) {
        e.stopPropagation();
        let bothID = extractFormKey($(this).attr('id'))
        let thisPartyID = bothID[1]
        let thisLocationID = bothID[3]
        let locationLabelArray = []
        let street = $('#party' + thisPartyID + 'location' + thisLocationID + 'street').val()
        let city = $('#party' + thisPartyID + 'location' + thisLocationID + 'city').val()
        let province = $('#party' + thisPartyID + 'location' + thisLocationID + 'province').val()
        let country = $('#party' + thisPartyID + 'location' + thisLocationID + 'country').val()
        let vague = $('#party' + thisPartyID + 'location' + thisLocationID + 'locationVague').is(':checked')
        if (street) { locationLabelArray.push(street) }
        if (city) { locationLabelArray.push(city) }
        if (province) { locationLabelArray.push(province) }
        if (country) { locationLabelArray.push(country) }
        let locationLabel = locationLabelArray.join(", ")
        if (locationLabelArray.length == 0) { locationLabel = "Unknown Location" } else if (vague) { locationLabel = "Near " + locationLabel }
        $("#party" + thisPartyID + "location" + thisLocationID + "title").html(locationLabel)
    });

    //party Relation
    $("#partiesContainer").on("click", ".add-relation", function (e) {
        e.stopPropagation();
        let relationContainer = $(this).attr('for')
        let relationPartyID = relationContainer.replace("party", "").replace("relationsContainer", "")
        let relationSnippet = relation_snippet.split("[[index]]").join(relationID)
        relationSnippet = relationSnippet.split("[[party_index]]").join(relationPartyID)
        $('#party' + relationPartyID + 'relationsContainer').append(relationSnippet)
        initializeRelation(relationID, relationPartyID)
        relationID += 1
        serializeForm()
    })

    function initializeRelation(relAddID, relAddPartyID, relAddTypeSelect = false, relAddPartySelect = false) {
        let relSelector = "#party" + relAddPartyID + "relation" + relAddID + " .relation-type"
        $(relSelector).select2({
            allowClear: true,
            dropdownParent:  $(relSelector).closest('.modal'),
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = relationsData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            },
            placeholder: "Search Relation Type",
            width: "100%",
        })

        if (relAddTypeSelect) {
            $(relSelector).append(new Option(relAddTypeSelect.split("__")[1], relAddTypeSelect, true, true))
        }
        activateRelationSelector(relAddID, relAddPartyID, relAddPartySelect)
    }

    function activateRelationSelector(relSelID, relSelPartyID, relSelPartySelect = false) {
        let relPartySelector = "#party" + relSelPartyID + "relation" + relSelID + " .relation-party"
        $(relPartySelector).select2({
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = Object.keys(projectData.parties).reduce((accumulator, key) => {
                        let party = projectData.parties[key];
                        if (party.label && party.label.toLowerCase().includes(params.term.toLowerCase())) {
                            accumulator.push({ id: key, text: party.label });
                        }
                        return accumulator;
                    }, []);
                    return { results: filteredData }
                }
            },
            placeholder: "Search Party",
            width: '100%',
            allowClear: true,
            dropdownParent:  $(relPartySelector).closest('.modal'),
            sorter: data => data.sort((a, b) => a.text.localeCompare(b.text)),
        })

        if (relSelPartySelect) {
            let thisRelPartyLabel = projectData.parties[relSelPartySelect]["label"]
            $(relPartySelector).append(new Option(thisRelPartyLabel, relSelPartySelect, true, true))
        }
    }

    $("#partiesContainer").on("click", ".delete-relation", function (e) {
        e.stopPropagation();
        let result = confirm("Are you sure to remove this Relation?")
        if (result) {
            let target = $(this).attr('for')
            $('#' + target).remove()
            serializeForm()
        }
    })

    // AAT selectors
    function cultureSelector(cultureSelector, cultureSelect=false){
        $(cultureSelector).select2({
            width: "100%",
            multiple: true,
            dropdownParent:  $(cultureSelector).closest('.modal'),
            placeholder: "Search Getty's AAT",
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = cultureData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            }
        })
        if (cultureSelect){
            for (let sel in cultureSelect){
                $(cultureSelector).append(new Option(cultureSelect[sel].split("__")[1], cultureSelect[sel], true, true))
            }
        }
    }

    function groupSelector(groupSelector, groupSelect=false){
        $(groupSelector).select2({
            width: "100%",
            multiple: true,
            dropdownParent:  $(groupSelector).closest('.modal'),
            placeholder: "Search Getty's AAT",
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = groupData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            }
        })
        if (groupSelect){
            for (let sel in groupSelect){
                $(groupSelector).append(new Option(groupSelect[sel].split("__")[1], groupSelect[sel], true, true))
            }
        }
    }

    function occupationSelector(occupationSelector, occupationSelect=false){
        $(occupationSelector).select2({
            width: "100%",
            multiple: true,
            dropdownParent:  $(occupationSelector).closest('.modal'),
            placeholder: "Search Getty's AAT",
            minimumInputLength: 1,
            ajax: {
                processResults: function (res, params) {
                    let filteredData = occupationsData.filter(function(option) {
                        return option.text.toLowerCase().includes(params.term.toLowerCase());
                    });
                    return { results: filteredData }
                }
            }
        })
        if (occupationSelect){
            for (let sel in occupationSelect){
                $(occupationSelector).append(new Option(occupationSelect[sel].split("__")[1], occupationSelect[sel], true, true))
            }
        }
    }

    //auxiliary functions
    function ranLetter() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        return alphabet[Math.floor(Math.random() * alphabet.length)] + alphabet[Math.floor(Math.random() * alphabet.length)] + alphabet[Math.floor(Math.random() * alphabet.length)]
    }

    $(document.body).delegate('[type="checkbox"][readonly="readonly"]', 'click', function (e) {
        e.preventDefault();
    });
    $(document.body).delegate('[type="radio"][readonly="readonly"]', 'click', function (e) {
        e.preventDefault();
    });
    $(document.body).delegate('select[readonly="readonly"]', 'keyup keydown keypress mousedown mouseup click', function (e) {
        e.preventDefault();
    });

    function serializeForm(callback) {
        if (selectedActivity || selectedActivity === 0) {
            let selectedActivityIndex = structuredData.findIndex(x => x.id == selectedActivity)
            let serializedForm = $("#activityForm").serializeArray()
            let newData = {}
            for (let formVal of serializedForm) {
                if (formVal["value"] !== ""){
                    if (formVal["name"].includes("party")) {
                        let pieces = extractFormKey(formVal["name"])
                        let partyIndex = pieces[1]
                        let partyKey = pieces[2]
                        if (!('parties' in newData)) {
                            newData["parties"] = []
                        }
                        if (!(newData["parties"].some(e => e.index == partyIndex))) {
                            newData["parties"].push({ "index": partyIndex, "data": {} })
                        }
                        let partyArrayIDX = newData["parties"].findIndex(e => e.index == partyIndex)
                        if (pieces.length <= 3) {
                            if (partyKey == "cultures"){
                                if (!('cultures' in newData["parties"][partyArrayIDX]["data"])) {
                                    newData["parties"][partyArrayIDX]["data"]["cultures"] = []
                                }
                                newData["parties"][partyArrayIDX]["data"]["cultures"].push(formVal["value"])
                            }
                            else if (partyKey == "groupTypes"){
                                if (!('groupTypes' in newData["parties"][partyArrayIDX]["data"])) {
                                    newData["parties"][partyArrayIDX]["data"]["groupTypes"] = []
                                }
                                newData["parties"][partyArrayIDX]["data"]["groupTypes"].push(formVal["value"])
                            }
                            else if (partyKey == "occupations"){
                                if (!('occupations' in newData["parties"][partyArrayIDX]["data"])) {
                                    newData["parties"][partyArrayIDX]["data"]["occupations"] = []
                                }
                                newData["parties"][partyArrayIDX]["data"]["occupations"].push(formVal["value"])
                            }
                            else{
                                newData["parties"][partyArrayIDX]["data"][partyKey] = formVal["value"]
                            }
                        }
                        else {
                            let valueIndex = pieces[3]
                            let valueKey = pieces[4]
                            if (partyKey == "relation") {
                                if (!("relations" in newData.parties[partyArrayIDX].data)) {
                                    newData.parties[partyArrayIDX].data["relations"] = []
                                }
                                let valueArray = newData.parties[partyArrayIDX].data["relations"]
                                let existingIndex = valueArray.findIndex(e => e.id == valueIndex)
                                if (existingIndex === -1) {
                                    valueArray.push({ id: valueIndex })
                                    existingIndex = valueArray.length - 1 // Newly added index
                                }
                                valueArray[existingIndex][valueKey] = formVal["value"]
                            }
                            else if (partyKey == "name") {
                                if (!("names" in newData.parties[partyArrayIDX].data)) {
                                    newData.parties[partyArrayIDX].data["names"] = []
                                }
                                let valueArray = newData.parties[partyArrayIDX].data["names"]
                                let existingIndex = valueArray.findIndex(e => e.id == valueIndex)
                                if (existingIndex === -1) {
                                    valueArray.push({ id: valueIndex })
                                    existingIndex = valueArray.length - 1 // Newly added index
                                }
                                valueArray[existingIndex][valueKey] = formVal["value"]
                            }
                            else if (partyKey == "location") {
                                if (!("locations" in newData.parties[partyArrayIDX].data)) {
                                    newData.parties[partyArrayIDX].data["locations"] = []
                                }
                                let valueArray = newData.parties[partyArrayIDX].data["locations"]
                                let existingIndex = valueArray.findIndex(e => e.id == valueIndex)
                                if (existingIndex === -1) {
                                    valueArray.push({ id: valueIndex })
                                    existingIndex = valueArray.length - 1 // Newly added index
                                }
                                valueArray[existingIndex][valueKey] = formVal["value"]
                            }
                        }
                    }
                    else if (formVal["name"].includes("identifier")) {
                        let pieces = extractFormKey(formVal["name"])
                        let valueIndex = pieces[1]
                        let valueKey = pieces[2]
                        if (!("identifiers" in newData)) {
                            newData["identifiers"] = []
                        }
                        let valueArray = newData["identifiers"]
                        let existingIndex = valueArray.findIndex(e => e.id == valueIndex)
                        if (existingIndex === -1) {
                            valueArray.push({ id: valueIndex })
                            existingIndex = valueArray.length - 1 // Newly added index
                        }
                        valueArray[existingIndex][valueKey] = formVal["value"]
                    }
                    else if (formVal["name"].includes("price")) {
                        let pieces = extractFormKey(formVal["name"])
                        let valueIndex = pieces[1]
                        let valueKey = pieces[2]
                        if (!("prices" in newData)) {
                            newData["prices"] = []
                        }
                        let valueArray = newData["prices"]
                        let existingIndex = valueArray.findIndex(e => e.id == valueIndex)
                        if (existingIndex === -1) {
                            valueArray.push({ id: valueIndex })
                            existingIndex = valueArray.length - 1 // Newly added index
                        }
                        valueArray[existingIndex][valueKey] = formVal["value"]
                    }
                    else if (formVal["name"].includes("source")) {
                        let pieces = extractFormKey(formVal["name"])
                        let valueIndex = pieces[1]
                        let valueKey = pieces[2]
                        if (!('sources' in newData)) {
                            newData["sources"] = []
                        }
                        let valueArray = newData["sources"]
                        let existingIndex = valueArray.findIndex(e => e.id == valueIndex)
                        if (existingIndex === -1) {
                            valueArray.push({ id: valueIndex })
                            existingIndex = valueArray.length - 1 // Newly added index
                        }
                        valueArray[existingIndex][valueKey] = formVal["value"]
                    }
                    else {
                        newData[formVal["name"]] = formVal["value"]
                    }
                }
            }
            if ("parties" in newData) {
                for (let activityParty of newData["parties"]) {
                    let activityPartyData = Object.assign({}, activityParty["data"])
                    let activityPartyID = activityPartyData["id"]
                    let newPartyData = {}
                    activityParty["data"] = {}
                    for (let [key, value] of Object.entries(activityPartyData)) {
                        if (key !== "role") {
                            newPartyData[key] = value;
                        }
                        if (key === "id" || key === "role") {
                            activityParty["data"][key] = value;
                        }
                    }
                    projectData.parties[activityPartyID] = newPartyData
                }
            }
            structuredData[selectedActivityIndex]["data"] = newData
        }
        else {
            structuredData = []
        }

        projectData.data[currentObjectID].provenanceData = structuredData
        localStorage.setItem('provaData', JSON.stringify(projectData))

        if (callback) {
            return callback()
        }
    }

    function checkID(form) {
        if (form != []) {
            for (let key in form) {
                if (key == "parties") {
                    for (let par of form["parties"]) {
                        let remotePartyData = projectData.parties[par["data"]["id"]]
                        for (let partyKey in remotePartyData) {
                            par["data"][partyKey] = remotePartyData[partyKey];
                        }
                        let parID = parseInt(par["index"])
                        if (parID >= partyID) { partyID = parID + 1 }
                        for (let parKey in par["data"]) {
                            if (parKey == "locations") {
                                for (let loc of par["data"][parKey]) {
                                    let locID = parseInt(loc["id"])
                                    if (locID >= locationID) { locationID = locID + 1 }
                                }
                            }
                            else if (parKey == "relations") {
                                for (let rel of par["data"][parKey]) {
                                    let relID = parseInt(rel["id"])
                                    if (relID >= relationID) { relationID = relID + 1 }
                                }
                            }
                            else if (parKey == "names") {
                                for (let na of par["data"][parKey]) {
                                    let naID = parseInt(na["id"])
                                    if (naID >= nameID) { nameID = naID + 1 }
                                }
                            }
                        }
                    }
                }
                else if (key == "sources") {
                    for (let so of form[key]) {
                        let soID = parseInt(so["id"])
                        if (soID >= sourceID) { sourceID = soID + 1 }
                    }
                }
                else if (key == "identifiers") {
                    for (let iden of form[key]) {
                        let idenID = parseInt(iden["id"])
                        if (idenID >= identifierID) { identifierID = idenID + 1 }
                    }
                }
                else if (key == "prices") {
                    for (let pri of form[key]) {
                        let priID = parseInt(pri["id"])
                        if (priID >= priceID) { priceID = priID + 1 }
                    }
                }
            }
        }
    }

    async function fillForm(form, callback) {
        let promises = []
        if (form != []) {
            let place_name = ""
            if ("activityCity" in form){
                place_name = form["activityCity"]
            }
            else if ("activityProvince" in form){
                place_name = form["activityProvince"]
            }
            else if ("activityCountry" in form){
                place_name = form["activityCountry"]
            }
            if ("activityLocationWD" in form){
                promises.push(queryWD(place_name, "#activityLocationWD", form["activityLocationWD"]))
            }
            else{
                promises.push(queryWD(place_name, "#activityLocationWD"))
            }
            if ("activityType" in form){
                $("#activityType").val(form["activityType"])
                if ($('#activityType').val()){
                    $("#activity" + selectedActivity + " .activity-type").html($('#activityType').val().split("__")[1])
                }
            }
            for (let key in form) {
                if (key == "parties") {
                    for (let par of form["parties"]) {
                        let remotePartyData = projectData.parties[par["data"]["id"]]
                        for (let partyKey in remotePartyData) {
                            par["data"][partyKey] = remotePartyData[partyKey];
                        }
                        let parID = parseInt(par["index"])
                        let partySnippet = party_snippet.split("[[index]]").join(parID)
                        $("#partiesContainer").append(partySnippet).promise().done(function() {
                            initializeWikidata('#party' + parID + ' .wikidata', "#party" + parID + "modal")
                            initializeUlan('#party' + parID + ' .ulan', "#party" + parID + "modal")
                            $("#party" + parID + "selector label").html("Switch with another existing Party")
                            activatePartySelector()
                            cultureSelector("#party" + parID + "cultures")
                            groupSelector("#party" + parID + "groupTypes")
                            occupationSelector("#party" + parID + "occupations")
                            let activityType = $('#activityType').val().split("__")[1]
                            let selectedOption = $('#activityType').find(":selected");
                            let selectedOptgroup = selectedOption.parent("optgroup").attr("label")
                            if (selectedOptgroup == "Production"){
                                $(".party-role option[value='sender'], .party-role option[value='sender_agent'], .party-role option[value='receiver_agent']").prop("disabled", true)
                                if (activityType == "Creation"){
                                    $(".party-role option[value='receiver']").prop("disabled", true)
                                }
                            }
                            else if (selectedOptgroup == "Change of Custody"){
                                $(".party-role option[value='sender_agent'], .party-role option[value='receiver_agent']").prop("disabled", true)
                            }
                            if (parID >= partyID) { partyID = parID + 1 }
                            if ("label" in par["data"]) {
                                let partyLabel = par["data"]["label"]
                                if ("WD" in par["data"]) {
                                    promises.push(queryWD(partyLabel, "#party" + parID + "WD", par["data"]["WD"]))
                                }
                                else {
                                    promises.push(queryWD(partyLabel, "#party" + parID + "WD"))
                                }
                                if ("ULAN" in par["data"]) {
                                    promises.push(queryULAN(partyLabel, "#party" + parID + "ULAN", par["data"]["ULAN"]))
                                }
                                else {
                                    promises.push(queryULAN(partyLabel, "#party" + parID + "ULAN"))
                                }
                            }
                            for (let parKey in par["data"]) {
                                if (parKey == "locations") {
                                    for (let loc of par["data"][parKey]) {
                                        let locID = parseInt(loc["id"])
                                        if (locID >= locationID) { locationID = locID + 1 }
                                        let locationSnippet = location_snippet.split("[[index]]").join(locID)
                                        locationSnippet = locationSnippet.split("[[party_index]]").join(parID)
                                        $("#party" + parID + "locationsContainer").append(locationSnippet).promise().done(function() {
                                            initializeWikidata("#party" + parID + "location" + locID + "WD", "#party" + parID + "modal")
                                            for (let locKey in loc) {
                                                let locVal = loc[locKey]
                                                let locSel = "party" + parID + "location" + locID + locKey
                                                let locSelector = "select[name=" + locSel + "], input[name=" + locSel + "]"
                                                if (locVal == "on") {
                                                    $(locSelector).prop('checked', true);
                                                }
                                                else if ($(locSelector).attr('type') == "radio") {
                                                    $("input[name=" + locSel + "][value=" + locVal + "]").attr('checked', 'checked');
                                                }
                                                else {
                                                    $(locSelector).val(locVal)
                                                }
                                            }
                                            let locationArray = [];
                                            let locationTitle = "";
                                            let street = $('#party' + parID + 'location' + locID + 'street').val();
                                            let city = $('#party' + parID + 'location' + locID + 'city').val();
                                            let province = $('#party' + parID + 'location' + locID + 'province').val();
                                            let country = $('#party' + parID + 'location' + locID + 'country').val();
                                            let vague = $('#party' + parID + 'location' + locID + 'locationVague').is(':checked');
                                            if (street) { locationArray.push(street); }
                                            if (city) { locationArray.push(city); }
                                            if (province) { locationArray.push(province); }
                                            if (country) { locationArray.push(country); }
                                            if (locationArray.length === 0) {
                                                locationTitle = "Unknown Location";
                                            } else {
                                                locationTitle = locationArray.join(", ");
                                                if (vague) { locationTitle = "Near " + locationTitle; }
                                            }
                                            $("#party" + parID + "location" + locID + "title").html(locationTitle);
                                            let locationLabelQuery = city || province || country;
                                            if ("WD" in loc){
                                                promises.push(queryWD(locationLabelQuery, '#party' + parID + 'location' + locID + 'WD', loc["WD"]))
                                            }
                                            else{
                                                promises.push(queryWD(locationLabelQuery, '#party' + parID + 'location' + locID + 'WD'))
                                            }
                                        })
                                    }
                                }
                                if (parKey == "relations") {
                                    for (let rel of par["data"][parKey]) {
                                        let relID = parseInt(rel["id"])
                                        if (relID >= relationID) { relationID = relID + 1 }
                                        let relationSnippet = relation_snippet.split("[[index]]").join(relID)
                                        relationSnippet = relationSnippet.split("[[party_index]]").join(parID)
                                        $('#party' + parID + 'relationsContainer').append(relationSnippet).promise().done(function() {
                                            if ("party" in rel){
                                                initializeRelation(relID, parID, rel["type"], rel["party"])
                                            }
                                            else{
                                                initializeRelation(relID, parID, rel["type"])
                                            }
                                        })
                                    }
                                }
                                else if (parKey == "names") {
                                    for (let na of par["data"][parKey]) {
                                        let naID = parseInt(na["id"])
                                        partyNameAdd(naID, parID, na["type"], na["value"])
                                        if (naID >= nameID) { nameID = naID + 1 }
                                    }
                                }
                                else if (parKey == "cultures") {
                                    cultureSelector("#party" + parID + "cultures", par["data"][parKey])
                                }
                                else if (parKey == "groupTypes") {
                                    groupSelector("#party" + parID + "groupTypes", par["data"][parKey])
                                }
                                else if (parKey == "occupations") {
                                    occupationSelector("#party" + parID + "occupations", par["data"][parKey])
                                }
                                else {
                                    let parVal = par["data"][parKey]
                                    let parSel = "party" + parID + parKey
                                    let parSelector = "select[name=" + parSel + "], input[name=" + parSel + "]"
                                    if (parVal == "on") {
                                        $(parSelector).prop('checked', true);
                                    }
                                    else if ($(parSelector).attr('type') == "radio") {
                                        $("input[name=" + parSel + "][value=" + parVal + "]").attr('checked', 'checked');
                                    }
                                    else {
                                        $(parSelector).val(parVal)
                                    }
                                    if (parKey == "label"){
                                        $("#party" + parID + "edit").html("<i class='fas fa-user-edit'></i> Edit " + parVal)
                                    }
                                }
                            }
                            let partyTitle = $('#party' + parID + 'label').val()
                            if (partyTitle != "") {
                                $("#party" + parID + " .party-title").html(partyTitle)
                            }
                            if (par["data"]["type"] == "group") {
                                $("#party" + parID + "body .group-data").show()
                                $("#party" + parID + "body .person-data").hide()
                                $("#party" + parID + "deathLabel").text("Dissolution")
                                $("#party" + parID + "birthLabel").text("Formation")
                            }
                        })
                    }
                }
                else if (key == "identifiers") {
                    for (let iden of form[key]) {
                        let idenID = parseInt(iden["id"])
                        addIdentifier(idenID, iden["type"], iden["value"])
                        if (idenID >= identifierID) { identifierID = idenID + 1 }
                    }
                }
                else if (key == "prices") {
                    for (let pri of form[key]) {
                        let priID = parseInt(pri["id"])
                        addPrice(priID, pri["type"], pri["value"], pri["currency"])
                        if (priID >= priceID) { priceID = priID + 1 }
                    }
                }
                else if (key == "sources") {
                    for (let so of form[key]) {
                        let soID = parseInt(so["id"])
                        if (soID >= sourceID) { sourceID = soID + 1 }
                        if ("type" in so){
                            addSource(soID, so["type"])
                        }
                        else{
                            addSource(soID)
                        }
                        if ("citation" in so){
                            $("#source" + soID + "title").html(so["citation"])
                        }
                        for (let soK in so) {
                            let soValue = so[soK]
                            let soKey = "source" + soID + soK
                            let soSelector = "select[name=" + soKey + "], input[name=" + soKey + "], textarea[name=" + soKey + "]"
                            $(soSelector).val(soValue)
                        }
                    }
                }
                else {
                    let value = form[key]
                    let selector = "select[name=" + key + "], input[name=" + key + "], textarea[name=" + key + "]"
                    if (value == "on") {
                        $(selector).prop('checked', true);
                        if (key == "assertionContradiction") {
                            $("#activity" + selectedActivity + " div.arrow i").removeClass("fa-arrow-circle-down")
                            $("#activity" + selectedActivity + " div.arrow i").addClass("fa-question-circle").addClass("text-info")
                        }
                    }
                    if ($(selector).attr('type') == "radio") {
                        $("input[name=" + key + "][value=" + value + "]").attr('checked', 'checked');
                    }
                    else if (key != "activityType") {
                        $(selector).val(value)
                    }
                }
            }
            dateGeneration()
            if (callback){
                await Promise.all(promises).then((values) => {
                   return callback()
                });
            }
        }
    }

    $("#activityForm").on("change", "input,select,textarea", function (e, auto_selected) {
        e.stopPropagation();
        if ($(this).hasClass("date-check") && $(this).val()) {
            let dateInput = $(this).val();
            let yearPattern = /^\d{4}$/;
            let yearMonthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
            let fullDatePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            if (yearPattern.test(dateInput)) {
                return;
            } else if (yearMonthPattern.test(dateInput)) {
                return;
            } else if (fullDatePattern.test(dateInput)) {
                let parts = dateInput.split('-');
                let year = parseInt(parts[0], 10);
                let month = parseInt(parts[1], 10);
                let day = parseInt(parts[2], 10);
                let daysInMonth = [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (day > daysInMonth[month - 1]) {
                    $(this).val("");
                }
            } else {
                $(this).val("");
            }
            function isLeapYear(year) {
                return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
            }
        }
        if ($(this).hasClass("edtf-parse")){
            let edtfSibling = $(this).closest(".time-container").find('.edtf-check')
            if ($(this).val()) {
                let edtfValue = TextToEdtf($(this).val())
                if (edtfValue){
                    edtfSibling.val(edtfValue).trigger('change', true)
                }
            }
            else {
                edtfSibling.val("").trigger('change', true)
            }
        }
        if ($(this).hasClass("edtf-check") && !auto_selected) {
            if ($(this).val()) {
                let timeValue = parseEDTFDate($(this).val())
                if (!timeValue){
                    $(this).val("").trigger('change')
                }
            }
        }
        if ($(this).hasClass("date-fill")) {
            dateGeneration()
        }
        serializeForm()
    });

    function escapeHTML(htmlStr) {
        if (typeof htmlStr !== "undefined") {
            return $("<textarea></textarea>").html(htmlStr).text();
        }
        else {
            return "";
        }
    }

    function extractFormKey(str) {
        return str.split(/(\d+)/).filter(Boolean);
    }

    // External Services___________________________________
    function zoteroAPI(zoteroAPIselector, zoteroAPIvalue){
        $(zoteroAPIselector + "title").html("Unknown Source")
        $(zoteroAPIselector + "citation").val("")
        try {
            let itemKey = zoteroAPIvalue.split("items/")[1].split("/")[0]
            let itemGroup = zoteroAPIvalue.split("items/")[0].split("groups/")[1].split("/")[0]
            $.get("https://api.zotero.org/groups/" + itemGroup + "/items/" + itemKey + "?format=bib",
                function (result) {
                    if (result) {
                        let citation = $(result).find(".csl-entry").text()
                        $(zoteroAPIselector + "title").html(citation)
                        $(zoteroAPIselector + "citation").val(citation)
                        $.get("https://api.zotero.org/groups/" + itemGroup + "/items/" + itemKey,
                            function (resultData) {
                                let type = resultData.data.itemType
                                if (type == "book") {
                                    $(zoteroAPIselector + "type").append(new Option("books", "aat:300028051__books", true, true))
                                }
                                else if (type == "article-journal") {
                                    $(zoteroAPIselector + "type").append(new Option("articles", "aat:300048715__articles", true, true))
                                }
                                let authors = resultData.data.creators
                                let formattedAuthors = authors.filter(author => author.creatorType === 'author')
                                    .map(author => author.firstName && author.lastName ? `${author.lastName}, ${author.firstName}` : author.name)
                                    .join('; ');
                                $(zoteroAPIselector + "author").val(formattedAuthors)
                                $(zoteroAPIselector + "date").val(resultData.data.date)
                                serializeForm()
                            }
                        )
                    }
                }
            )
        }
        catch { }
    }

    function initializeWikidata(WDselector, dropdownParentWD) {
        $(WDselector).prepend('<option class="bg-secondary text-light" value="add_new">Enter Wikidata ID manually</option>')
        $(WDselector).select2({
            allowClear: true,
            dropdownParent: dropdownParentWD,
            minimumResultsForSearch: -1,
            placeholder: "Choose...",
            width: '100%',
            templateResult: function (data, container) {
                if (data.element) {
                    $(container).addClass($(data.element).attr("class"));
                }
                return data.text;
            }
        }).on('select2:close', function (e) {
            e.stopImmediatePropagation();
            let el = $(this);
            if (el.val() == "add_new") {
                let newVal = prompt("Enter Wikidata ID manually: ");
                if (newVal !== null && newVal.length > 0) {
                    $('#loader').modal('show')
                    $.getJSON("https://www.wikidata.org/w/api.php?callback=?", {
                        search: newVal,
                        action: "wbsearchentities",
                        language: "en",
                        uselang: "en",
                        format: "json",
                        limit: 1,
                        strictlanguage: true,
                    }, function (data) {
                        if (data) {
                            try{
                                el.children(".selected-option").remove()
                                $.each(data.search, function (i, item) {
                                    let wdID = (item.id + '___' + escapeHTML(item.label) + " (" + item.title + ') - ' + escapeHTML(item.description)).split(' ').join('_')
                                    el.append('<option class="selected-option" value=' + wdID+ ' >' + wdID.split("___")[1].split('_').join(' ') + '</option>')
                                    el.val(wdID);
                                    el.trigger('change');
                                    $('#loader').modal('hide')
                                })
                            }
                            catch{
                                el.val("")
                                el.trigger('change');
                                $('#loader').modal('hide')
                            }
                        } else {
                            el.val("")
                            el.trigger('change');
                            $('#loader').modal('hide')
                        }
                    })
                }
                else {
                    el.val("")
                    el.trigger('change',[]);
                }
            }
        }).on("select2:clear", async function (e) {
            setTimeout(function() {
                $(WDselector).select2('close');
            }, 5);
            $('#loader').modal('show')
            let promises = []
            let actualQuery = $(WDselector).attr("title");
            promises.push(queryWD(actualQuery, WDselector))
            await Promise.all(promises).then((values) => {
                $('#loader').modal('hide')
             });
        })
    }

    function queryWD(query, selectorWD, selectWD = false) {
        return new Promise((resolve,reject)=>{
            $(selectorWD).attr("title", query)
            $(selectorWD).empty()
            if (selectWD){
                $(selectorWD).append('<option class="selected-option" value=' + selectWD + ' >' + selectWD.split("___")[1].split('_').join(' ') + '</option>');
                $(selectorWD).val(selectWD).trigger('change.select2')
                $(selectorWD).prepend('<option class="bg-secondary text-light" value="add_new">Enter Wikidata ID manually</option>')
                resolve()
            }
            else{
                $.getJSON("https://www.wikidata.org/w/api.php?callback=?", {
                    search: query.replace("#", ""),
                    action: "wbsearchentities",
                    language: "en",
                    uselang: "en",
                    format: "json",
                    limit: 10,
                    strictlanguage: true,
                },function (data) {
                    $(selectorWD).prepend('<option value="" selected>Choose</option>')
                    selectWDid = selectWD ? selectWD.split("___")[0] : false;
                    $.each(data.search, function (i, item) {
                        let wdID = (item.id + '___' + escapeHTML(item.label) + " (" + item.title + ') - ' + escapeHTML(item.description)).split(' ').join('_')
                        if (item.id != selectWDid){
                            $(selectorWD).append('<option value=' + wdID+ ' >' + wdID.split("___")[1].split('_').join(' ') + '</option>')
                        }
                    })
                    $(selectorWD).prepend('<option class="bg-secondary text-light" value="add_new">Enter Wikidata ID manually</option>')
                    resolve()
                })
            }
        })
    }

    function initializeUlan(ULANselector, dropdownParentULAN) {
        $(ULANselector).prepend('<option class="bg-secondary text-light" value="add_new">Enter ULAN ID manually</option>')
        $(ULANselector).select2({
            allowClear: true,
            dropdownParent: dropdownParentULAN,
            minimumResultsForSearch: -1,
            placeholder: "Choose...",
            width: '100%',
            templateResult: function (data, container) {
                if (data.element) {
                    $(container).addClass($(data.element).attr("class"));
                }
                return data.text;
            }
        }).on('select2:close', function (e) {
            e.stopImmediatePropagation();
            let el = $(this);
            if (el.val() == "add_new") {
                let newVal = prompt("Enter ULAN ID manually: ");
                if (newVal !== null && newVal.length > 0) {
                    $('#loader').modal('show')
                    $.ajax({
                        url: 'https://vocab.getty.edu/sparql',
                        method: 'GET',
                        data: {
                            format: 'json',
                            query: `select ?label{ulan:${newVal} xl:prefLabel/xl:literalForm ?label.}`
                         },
                        success: function(response) {
                            el.children(".selected-option").remove()
                            if (response.results.bindings.length > 0) {
                                let label = response.results.bindings[0].label.value;
                                ulanID = ('ulan/' + newVal + '___' + label + " (ulan/" + newVal + ")").split(' ').join('_')
                                el.append('<option class="selected-option" value=' + ulanID+ ' >' + ulanID.split("___")[1].split('_').join(' ') + '</option>')
                                el.val(ulanID);
                                el.trigger('change');
                                $('#loader').modal('hide')
                            }
                            else{
                                el.val("")
                                el.trigger('change');
                                $('#loader').modal('hide')
                            }
                        },
                        error: function(xhr, status, error) {
                            el.val("")
                            el.trigger('change');
                            $('#loader').modal('hide')
                        }
                    })
                }
                else {
                    el.val("")
                    el.trigger('change',[]);
                }
            }
        }).on("select2:clearing", async function (e) {
            setTimeout(function() {
                $(ULANselector).select2('close');
            }, 5);
            $('#loader').modal('show')
            let promises = []
            let actualQuery = $(ULANselector).attr("title");
            promises.push(queryULAN(actualQuery, ULANselector))
            await Promise.all(promises).then((values) => {
                $('#loader').modal('hide')
             });
        })
    }

    function queryULAN(query, selectorULAN, selectULAN = false) {
        return new Promise((resolve,reject)=>{
            $(selectorULAN).attr("title", query)
            $(selectorULAN).empty()
            if (selectULAN && "selectULAN"){
                $(selectorULAN).append('<option class="selected-option" value=' + selectULAN + ' >' + selectULAN.split("___")[1].split('_').join(' ') + '</option>');
                $(selectorULAN).val(selectULAN).trigger('change.select2')
                $(selectorULAN).prepend('<option class="bg-secondary text-light" value="add_new">Enter ULAN ID manually</option>')
                resolve()
            }
            else {
                let queryOption = {"q0": {"query": query.replace("#", ""), "type": "/ulan", "limit":10}}
                $.post("https://services.getty.edu/vocab/reconcile/",
                    {'queries': JSON.stringify(queryOption)},
                function (data) {
                    $(selectorULAN).prepend('<option value="" selected>Choose</option>')
                    selectULANid = selectULAN ? selectULAN.split("___")[0] : false;
                    $.each(data.q0.result, function (i, item) {
                        ulanID = (item.id + '___' + escapeHTML(item.name) + " (" + item.id + ")").split(' ').join('_')
                        if (item.id != selectULANid){
                           $(selectorULAN).append('<option value=' + ulanID+ ' >' + ulanID.split("___")[1].split('_').join(' ') + '</option>')
                        }
                    })
                    $(selectorULAN).prepend('<option class="bg-secondary text-light" value="add_new">Enter ULAN ID manually</option>')
                    resolve()
                })
            }
        })
    }
}

function partyClear(){
    for (let k in projectData.parties) {
        let found = false
        for (let data of projectData.data) {
            for (let act of data.provenanceData) {
                if (act.data.parties){
                    for (let p of act.data.parties) {
                        if (p.data.id == k) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) break;
            }
            if (found) break;
        }
        if (!found){
            for (let p in projectData.parties) {
                if (k != p) {
                    if ("relations" in projectData.parties[p]){
                        if (Object.keys(projectData.parties[p].relations).some(rel => projectData.parties[p].relations[rel].party === k)) {
                            found = true;
                            break
                        }
                    }
                }
            }
        }
        if (!found){
            delete projectData.parties[k]
            localStorage.setItem('provaData', JSON.stringify(projectData))
        }
    }
}

$(window).on('beforeunload', function() {
    if ($('input').is(':focus')) {
        $('input').blur();
        setTimeout(function() {
            $(window).off('beforeunload')
        }, 500);
    }
});
