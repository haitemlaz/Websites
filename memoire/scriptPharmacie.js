const firebaseConfig = {
    apiKey: "AIzaSyBZLlDjbEVyg1d3YHSy8xrfiU0BQTsm2kw",
    authDomain: "dawa2y-4b654.firebaseapp.com",
    databaseURL: "https://dawa2y-4b654-default-rtdb.firebaseio.com",
    projectId: "dawa2y-4b654",
    storageBucket: "dawa2y-4b654.appspot.com",
    messagingSenderId: "540036161894",
    appId: "1:540036161894:web:624fca1c1635391bbfa8a7"
};

firebase.initializeApp(firebaseConfig);

const id = document.getElementById("recipe_id");
const medsContainer = document.getElementById("medsContainer")

const btn = document.getElementById("btn");
btn.addEventListener("click", function() {

    const idValue = id.value;
    const array = idValue.split("-");
    const myRef = firebase.database().ref('patients/' + array[0] + "/recipes/" + array[1]);
    const drNameText = document.getElementById('drName');
    const dateText = document.getElementById("date");
    const durationText = document.getElementById("duration");
    myRef.on('value', (snapshot) => {
        medsContainer.innerHTML = "";
        const nbr = snapshot.numChildren();
        const drName = snapshot.child('drName').val();
        const date = snapshot.child('date').val();
        const duration = snapshot.child('treatmentDuration').val();
        var textNode = document.createTextNode(drName);
        drNameText.textContent = drName;
        textNode = document.createTextNode(date);
        dateText.textContent = date;
        textNode = document.createTextNode(duration);
        durationText.textContent = duration;
        myRef.child('medicines').once('value', (medSnapshot) => {
            let i = 0;
            medSnapshot.forEach((childSnapshot) => {
                i++;
                const medName = childSnapshot.child('medName').val();
                var btnActivate = document.createElement('Button');
                var btnOrder = document.createElement('Button');
                btnActivate.id = 'btnActivate' + i;
                btnOrder.id = 'btnOrder' + i;
                var listItem = document.createElement('li');
                if (childSnapshot.hasChild('activationDate')) {
                    var activationDate = childSnapshot.child('activationDate').val();
                    var dateParts = activationDate.split("/");
                    var day = parseInt(dateParts[0], 10);
                    var month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
                    var year = parseInt(dateParts[2], 10);

                    // Create a new Date object with the specified date
                    var targetDate = new Date(year, month, day);

                    // Add the specified duration in days to the target date
                    targetDate.setDate(targetDate.getDate() + duration);

                    // Get today's date
                    var today = new Date();

                    // Compare the target date with today's date
                    if (targetDate >= today) {
                        btnActivate.textContent = "activated";
                        btnActivate.disabled = true;
                        btnActivate.style.backgroundColor = "green";
                        btnActivate.style.color = "white";
                    } else if (targetDate < today) {
                        btnActivate.textContent = "expired";
                        btnActivate.disabled = true;
                        btnActivate.style.color = "red";

                    }
                    textNode = document.createTextNode(medName);
                    listItem.appendChild(textNode);
                    listItem.appendChild(btnActivate);

                } else {
                    btnActivate.textContent = "activate";
                    if (childSnapshot.hasChild('orderDate')) {
                        let orderDate = childSnapshot.child('orderDate').val();
                        var dateParts = orderDate.split("/");
                        var day = parseInt(dateParts[0], 10);
                        var month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
                        var year = parseInt(dateParts[2], 10);
                        var targetDate = new Date(year, month, day);

                        // Add the specified duration in days to the target date
                        targetDate.setDate(targetDate.getDate());

                        // Get today's date
                        var today = new Date();

                        // Compare the target date with today's date
                        if (targetDate >= today) {
                            btnOrder.textContent = "ordered";
                            btnOrder.disabled = true;
                            btnOrder.style.backgroundColor = "green";
                            btnOrder.style.color = "white";
                        }
                    } else {
                        btnOrder.textContent = "order";

                        const orderRef = childSnapshot.ref.child("orderDate");

                        btnOrder.addEventListener('click', function() {
                            var selectedDate = datePicker.value;
                            var parts = selectedDate.split('-');
                            var formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0];
                            orderRef.set(formattedDate);
                        });
                    }
                    const activationRef = childSnapshot.ref.child("activationDate");
                    btnActivate.addEventListener("click", function() {
                        var selectedDate = datePicker.value;

                        // Split the selected date using the hyphen delimiter
                        var parts = selectedDate.split('-');
                        // Reconstruct the date string using the desired format (dd/mm/yyyy)
                        var formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0];
                        activationRef.set(formattedDate);
                    });
                    var datePicker = document.createElement('input');
                    datePicker.type = 'date';
                    datePicker.id = 'date' + i;
                    var currentDate = new Date();
                    // Format the current date to yyyy-mm-dd format
                    var formattedDate = currentDate.toISOString().split('T')[0];
                    // Set the minimum date allowed in the input field
                    datePicker.min = formattedDate;

                    textNode = document.createTextNode(medName);
                    listItem.appendChild(textNode);
                    listItem.appendChild(btnActivate);
                    listItem.appendChild(btnOrder);
                    listItem.appendChild(datePicker);
                }




                medsContainer.appendChild(listItem);
            });
        })

    })
});