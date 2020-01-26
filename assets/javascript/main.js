//Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB37Tq9L4aWfSG6BicPG0APcMjPw7d046w",
    authDomain: "moreproperties-1fbc2.firebaseapp.com",
    databaseURL: "https://moreproperties-1fbc2.firebaseio.com",
    projectId: "moreproperties-1fbc2",
    storageBucket: "moreproperties-1fbc2.appspot.com",
    messagingSenderId: "241113120595",
    appId: "1:241113120595:web:035a24aa59e321df3f2ba6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
function addRow(trainInfo) {
    let today = moment();
    let startTime = moment(trainInfo.startTime, "HH:mm");
    console.log("START TIME: " + startTime);
    let startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
    console.log("START TIME CONVERTED: " + startTimeConverted);
    let frequency = trainInfo.frequency;
    let diffTime = today.diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    let remainder = diffTime % frequency;
    console.log("REMAINDER: " + remainder);
    let minsLeft = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minsLeft);
    let nextArrival = today.add(minsLeft, 'minutes').format("hh:mm A");
    console.log("NEXT ARRIVAL: " + nextArrival);
    //Display array of information
    console.log(trainInfo);
    
    
    
    //Adding rows to the display table
    let newRow = $("<tr>").attr("id", "tr-" + trainInfo.key);
    let newNameTd = $("<td>").attr("data-type", "name");
    newNameTd.append($("<span>").addClass("span-edit").text(trainInfo.name));
    newRow.append(newNameTd);
    let newdestinationTd = $("<td>").attr("data-type", "destination");
    newdestinationTd.append($("<span>").addClass("span-edit").text(trainInfo.destination));
    newRow.append(newdestinationTd);
    let newstartTimeTd = $("<td>").attr("data-type", "startTime");
    newstartTimeTd.append($("<span>").addClass("span-edit").text(trainInfo.startTime));
    newRow.append(newdestinationTd);
    newRow.append($("<td>").text(frequency).addClass("td-frequency"));
    newRow.append($("<td>").text(moment(nextArrival, "hh:mm A")));
    newRow.append($("<td>").text(minsLeft));
    newRow.append($("<button>").text("Delete").attr("data-key", trainInfo.key).addClass("delete-btn"));
    $("#table-body").append(newRow);
}
//Delete function
function deleteRow(key) {
    console.log(key);
    $("#tr-" + key).remove();
}
$(document).on("click", ".delete-btn", function () {
    let key = $(this).attr("data-key");
    //console.log(key);
    firebase.database().ref('/trainData/' + key).remove();
});
//Adding train info from user input
$("#add-train").on("click", function (event) {
    event.preventDefault();
    let trainInfo = {
        name: $("#train-name").val().trim(),
        destination: $("#destination").val().trim(),
        startTime: $("#first-train-time").val().trim(),
        frequency: parseInt($("#frequency").val().trim()),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
    //Pushes info to database
    database.ref("/trainData").push({
        name: trainInfo.name,
        destination: trainInfo.destination,
        startTime: trainInfo.startTime,
        frequency: trainInfo.frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject);
    });
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
});
database.ref("/trainData").on('child_added', function (data) {
    let trainInfo = {
        name: data.val().name,
        destination: data.val().destination,
        startTime: data.val().startTime,
        frequency: data.val().frequency,
        key: data.key
    };
    addRow(trainInfo);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject);
});
database.ref("/trainData").on('child_removed', function (data) {
    console.log(data);
    deleteRow(data.key);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject);
});