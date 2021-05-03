const url = "https://localhost:44386/api/Covid";
var data;
const states = ["N/A", "Infected", "Cured", "Deceased"];

//collect (filtered) data via AJAX
function queryData(filterString)
{
    "use strict";

    let query = `${url}/List`;

    if(filterString !== undefined && filterString !== null)
        query += `?${filterString}`;

    $.ajax({
        url: query, 
        success: handleSuccess, 
        error: handleFailure, 
        method: 'GET'
    });
}

//callback when queryData succeeded
function handleSuccess(receivedData)
{
    "use strict";
    const container = document.querySelector("#listDisplay");

    container.innerHTML = "";

    data = receivedData;

    data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${element.firstName} ${element.lastName}</td><td>${new Date(element.infectedOn).toLocaleDateString()}</td><td>${states[parseInt(element.state)]}</td>`;

        const td = document.createElement("td");
        const btn = document.createElement("button");
        btn.innerHTML = "edit";
        btn.addEventListener('click', function() {showEditEntryDialog(element); }, false);

        td.appendChild(btn);
        row.appendChild(td);

        container.appendChild(row);
    });

    //showFeedback("Success", "", "success");
}

//callback when queryData fails
function handleFailure()
{
    "use strict";

    showFeedback("Failure", "An error occured while processing your request", "failure");
}

function showFeedback(headline, body, className)
{
    "use strict";

    const target = document.querySelector("#feedback");

    target.innerHTML = `<div class="feedback-headline">${headline}</div>${body ?? ""}`;
    target.className = className;

    setTimeout(function() { target.classList.add("closed");}, 3000 );
}

//handle adding entries
function showAddEntryDialog()
{
    "use strict";
    
    document.querySelector("#AddEntryForm").style.display = "flex";
    document.querySelector("#EditEntryForm").style.display = "none";
    document.querySelector("#frmContainer").style.visibility = "visible";
}

function closeAddEntryDialog(save)
{
    "use strict";
    
    document.querySelector("#frmContainer").style.visibility = "collapse";
    document.querySelector("#AddEntryForm").style.display = "none";

    if(save === true)
    {
        const formData = {
            LastName: document.querySelector("#AddEntryForm input[name=lastName]").value,
            FirstName: document.querySelector("#AddEntryForm input[name=firstName").value,
            State: parseInt(document.querySelector("#AddEntryForm select").value),
            InfectedOn: document.querySelector("#AddEntryForm input[name=infectedOn]").value
        };

        $.ajax({
            url: `${url}/Add`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => { queryData(); }
        });        
    }

    document.querySelector("#AddEntryForm").reset();
}

//handle updating entries
function showEditEntryDialog(person)
{
    "use strict";

    document.querySelector("#EditEntryForm #EditName").innerHTML = `<strong>Name:</strong> ${person.firstName} ${person.lastName}`;
    document.querySelector("#EditEntryForm #EditInfected").innerHTML = `<strong>Infected on:</strong> ${new Date(person.infectedOn).toLocaleDateString()}`;
    document.querySelector("#EditEntryForm input[type=hidden]").value = person.id;
    document.querySelector("#EditEntryForm select").value = person.state;

    document.querySelector("#AddEntryForm").style.display = "none";
    document.querySelector("#EditEntryForm").style.display = "flex";
    document.querySelector("#frmContainer").style.visibility = "visible";
}

function closeEditEntryDialog(save)
{
    "use strict";

    document.querySelector("#EditEntryForm").style.display = "none";
    document.querySelector("#frmContainer").style.visibility = "collapse";

    if(save)
    {
        const formData = {
            ID: parseInt(document.querySelector("#EditEntryForm input[type=hidden]").value),
            State: parseInt(document.querySelector("#EditEntryForm select").value)
        };

        $.ajax({
            url: `${url}/Update`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: () => { queryData(); }
        });
    }

    document.querySelector("#EditEntryForm").reset();
}

//handle filtering
function handleFilterChanged()
{
    "use strict";

    var queryString = "";

    const selectedState = parseInt(document.querySelector("#FilterState").value);

    if(selectedState !== 0)
    {
        queryString = `state=${states[selectedState]}`;
    }

    const dateString = document.querySelector("#FilterDate").value;

    if(dateString.length > 0)
    {
        if(queryString.length > 0)
        {
            queryString += "&";
        }
        
        queryString += `date=${dateString}`;
    }
    
    queryData(queryString);
}

//wire up listeners
function attachListeners()
{
    "use strict";

    document.querySelector("#btnAdd")?.addEventListener('click', showAddEntryDialog, false);
    document.querySelector("#btnDoAdd")?.addEventListener('click', function() {closeAddEntryDialog(true);}, false);
    document.querySelector("#btnCancelAdd")?.addEventListener('click', function() {closeAddEntryDialog(false);}, false);
    document.querySelector("#btnDoEdit")?.addEventListener('click', function() {closeEditEntryDialog(true);}, false);
    document.querySelector("#btnCancelEdit")?.addEventListener('click', function() {closeEditEntryDialog(false);}, false);
    document.querySelector("#FilterState")?.addEventListener('change', handleFilterChanged, false);
    document.querySelector("#FilterDate")?.addEventListener('change', handleFilterChanged, false);
}

//init
(
    function ()
    {
        attachListeners();
        queryData();
    }
)();