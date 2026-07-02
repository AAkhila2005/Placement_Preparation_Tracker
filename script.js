let chart;
let records = [];
let editIndex = -1;

window.onload = function () {

    records = JSON.parse(localStorage.getItem("records"));

if (!records) {

    records = [

        {
            topic: "Arrays",
            category: "DSA",
            solved: 120
        },

        {
            topic: "Quantitative Aptitude",
            category: "Aptitude",
            solved: 35
        },

        {
            topic: "Operating Systems",
            category: "Core Subject",
            solved: 18
        }

    ];

    localStorage.setItem("records", JSON.stringify(records));
}

    displayRecords();

};

document.getElementById("saveBtn").addEventListener("click", function () {

    let topic = document.getElementById("topic").value;
    let category = document.getElementById("category").value;
    let solved = document.getElementById("solved").value;

    if (topic === "" || solved === "") {
        alert("Please fill all fields!");
        return;
    }

    let record = {
    topic: topic,
    category: category,
    solved: solved
};

if (editIndex === -1) {

    // Add new record
    records.push(record);

} else {

    // Update existing record
    records[editIndex] = record;

    editIndex = -1;

    document.getElementById("saveBtn").textContent = "Save Progress";

}

    localStorage.setItem("records", JSON.stringify(records));

    displayRecords();

    document.getElementById("topic").value = "";
    document.getElementById("category").value = "DSA";
    document.getElementById("solved").value = "";    

});


function displayRecords() {

    let tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    let search = document.getElementById("searchInput").value.toLowerCase();

    records.forEach(function(record, index) {

        if (!record.topic.toLowerCase().includes(search)) {
            return;
        }

        tableBody.innerHTML += `
            <tr>
                <td>${record.topic}</td>
                <td>${record.category}</td>
                <td>${record.solved}</td>
                <td>
                    <button class="btn edit-btn btn-sm me-2"
                    onclick="editRecord(${index})">
                        Edit
                    </button>

                    <button class="btn btn-danger btn-sm"
                    onclick="deleteRecord(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}


function updateDashboard() {

    let dsaTotal = 0;
    let aptitudeTotal = 0;
    let coreSubjectTotal = 0;

    records.forEach(function(record) {

        if (record.category === "DSA") {
            dsaTotal += Number(record.solved);
        }

        if (record.category === "Aptitude") {
            aptitudeTotal += Number(record.solved);
        }

        if (record.category === "Core Subject") {
            coreSubjectTotal += Number(record.solved);
        }

    });

    document.getElementById("dsaCount").textContent = dsaTotal;
    document.getElementById("aptitudeCount").textContent = aptitudeTotal;
    document.getElementById("coreSubjectCount").textContent = coreSubjectTotal;

    updateChart(dsaTotal, aptitudeTotal, coreSubjectTotal);
}

function editRecord(index) {

    editIndex = index;

    document.getElementById("topic").value = records[index].topic;
    document.getElementById("category").value = records[index].category;
    document.getElementById("solved").value = records[index].solved;

    document.getElementById("saveBtn").textContent = "Update Progress";

}

function updateChart(dsa, aptitude, core) {

    const ctx = document.getElementById("progressChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["DSA", "Aptitude", "Core Subject"],
            datasets: [{
                label: "Problems Solved",
                data: [dsa, aptitude, core],
                backgroundColor: [
                   "#dd396a",   // DSA - Dark Pink
                   "#ea739b",   // Aptitude - Medium Pink
                   "#e9b2c4"    // Core Subject - Rose Pink
                ],
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        
        options: {
               responsive: true,
               maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

}

document.getElementById("exportBtn").addEventListener("click", function () {

    let csv = "Topic,Category,Solved\n";

    records.forEach(function(record) {
        csv += `${record.topic},${record.category},${record.solved}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });

    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;
    link.download = "Placement_Tracker.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});

function deleteRecord(index) {

    if (confirm("Are you sure you want to delete this record?")) {

        records.splice(index, 1);

        localStorage.setItem("records", JSON.stringify(records));

        displayRecords();

    }

}