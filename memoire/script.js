import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

// import "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/pdfmake.min.js";
// import "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts.js";


const firebaseConfig = {
    apiKey: "AIzaSyBZLlDjbEVyg1d3YHSy8xrfiU0BQTsm2kw",
    authDomain: "dawa2y-4b654.firebaseapp.com",
    databaseURL: "https://dawa2y-4b654-default-rtdb.firebaseio.com",
    projectId: "dawa2y-4b654",
    storageBucket: "dawa2y-4b654.appspot.com",
    messagingSenderId: "540036161894",
    appId: "1:540036161894:web:048fb2c6ef06c922bfa8a7"
};


firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);


///// check if the website is connected to firebase (in console) //////
if (app.name === '[DEFAULT]') {
    console.log('Firebase connection successful!');
} else {
    console.error('Firebase connection failed!');
}





///////////             Login                ////////////////



const form_btn = document.getElementById("form-btn");

function Login() {
    const loginForm = document.querySelector("#login-form");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (email === '') {
            alert('please enter your email');
            return;
        }

        if (password === '') {
            alert('please enter your password');
            return;
        }

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("User successfully logged in:", user.uid);
                const uid = user.uid;




                window.location.href = "doctorPage.html";

            })
            .catch((error) => {
                console.log("error :", error);
                const errorCode = error.code;
                const errorMessage = error.message;


                if (errorCode === "auth/user-not-found") {
                    // Incorrect email
                    alert('Incorrect email:', errorMessage);
                } else if (errorCode === "auth/wrong-password") {
                    // Incorrect password
                    alert('Incorrect password:', errorMessage);
                } else {
                    // Other errors
                    alert('Error:', errorMessage);
                }

            });
    });

}
try {
    form_btn.addEventListener("click", Login());
} catch {}





/////////////                 Pharmacie Login             ////////////



const form_btn_pharmacie = document.getElementById("form-btn-pharmacie");

let pharmacie;

function LoginPharmacie() {
    const loginFormPharmacie = document.querySelector("#login-form-pharmacie");


    loginFormPharmacie.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (email === '') {
            alert('please enter your email');
            return;
        }

        if (password === '') {
            alert('please enter your password');
            return;
        }

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in


                const user = userCredential.user;


                if (user) {
                    getUserData(user.email)

                    function getUserData(email) {
                        const db = firebase.database();
                        const pharmaciesRef = db.ref("pharmacies");



                        get(pharmaciesRef, "value")
                            .then((snapshot) => {
                                const pharmacies = snapshot.val();

                                if (pharmacies) {
                                    // Find the doctor with the matching email
                                    pharmacie = Object.values(pharmacies).find((pharmacie) => pharmacie.email === email);

                                    console.log('pharmacie', pharmacie);

                                    if (pharmacie) {
                                        window.location.href = "pharmaciePage.html";
                                    } else {
                                        alert("that's not a pharmacie's account");
                                    }


                                }
                            });
                    }
                }



                console.log("User successfully logged in:", user.uid);
                const uid = user.uid;


            })
            .catch((error) => {
                console.log("error :", error);
                const errorCode = error.code;
                const errorMessage = error.message;


                if (errorCode === "auth/user-not-found") {
                    // Incorrect email
                    alert('Incorrect email:', errorMessage);
                } else if (errorCode === "auth/wrong-password") {
                    // Incorrect password
                    alert('Incorrect password:', errorMessage);
                } else {
                    // Other errors
                    alert('Error:', errorMessage);
                }

            });
    });

}
try {
    form_btn_pharmacie.addEventListener("click", LoginPharmacie());
} catch {}






///////////                  Doctor Data                ////////////////
let doctor;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        getUserData(user.email)

        function getUserData(email) {
            const db = firebase.database();
            const doctorsRef = db.ref("doctors");

            get(doctorsRef, "value")
                .then((snapshot) => {
                    const doctors = snapshot.val();

                    if (doctors) {
                        // Find the doctor with the matching email
                        doctor = Object.values(doctors).find((doctor) => doctor.email === email);

                        if (doctor) {

                            localStorage.setItem('doctor', JSON.stringify(doctor));
                            console.log(doctor.name, doctor.speciality);

                            document.getElementById("name").textContent += doctor.name;
                            document.getElementById("specialite").textContent += doctor.speciality;
                            console.log('doc id', doctor.key);
                            // doctor=data;
                        }
                    }

                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }
})




///////////           Get patient + patients recommendations           ////////////////



const userFormDb = firebase.database().ref('patients');
// JavaScript code


const searchBar = document.getElementById('search-input');
const recommendationsList = document.getElementById('recommendations');
let patientName = "";
let patient;

searchBar.addEventListener('input', (event) => {
    const searchQuery = searchBar.value.trim();

    userFormDb.once('value', (snapshot) => {
        const users = snapshot.val();

        if (users) {
            const filteredUsers = Object.values(users).filter(Patient => Patient.name.toLowerCase().startsWith(searchQuery));


            recommendationsList.innerHTML = '';
            filteredUsers.forEach(Patient => {
                // const Patient = childSnapshot.val();
                const listItem = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = Patient.name;
                listItem.appendChild(a);

                const idDiv = document.createElement('div');
                idDiv.className = 'patient-id';
                idDiv.textContent = Patient.id;
                listItem.appendChild(idDiv);
                // idDiv.style.display= 'none';

                recommendationsList.appendChild(listItem);
                listItem.addEventListener('click', (event) => {
                    patient = Patient;
                    patientName = Patient.name;
                    searchBar.value = patientName;
                    recommendationsList.style.display = 'none';
                    console.log("patients", Patient);
                });
            });
            if (searchQuery.length > 0) {
                recommendationsList.style.display = 'block';
            } else {
                recommendationsList.style.display = 'none';
            }
        }
    });
});



///////////////////             layout stuff                /////////////////

const openForm = document.querySelector("#add-prescription");
const closeForm = document.querySelector("#btn-form-discard");
const form = document.querySelector(".med-form");
const overlay = document.querySelector("#overlay");

let prescriptionCount = 1;


const medNameInput = document.getElementById('med-name');
const doseInput = document.getElementById('dose');
const quantitySelect = document.getElementById('quantity');
const repititionAfterinput = document.getElementById('repititionAfter');




openForm.addEventListener("click", function() {

    const timeInputs = document.querySelectorAll('.scroll-content input[type="time"]');
    const noteTextareas = document.querySelectorAll('.scroll-content textarea');

    form.classList.add("active");
    overlay.classList.add("active");
    document.querySelector(".scroll-view").innerHTML = "";
    medNameInput.value = '';
    doseInput.value = '';
    quantitySelect.value = '';
    repititionAfterinput.value = '';

    timeInputs.forEach((input) => (input.value = ''));
    noteTextareas.forEach((textarea) => (textarea.value = ''));


    const scrollContent = document.createElement("div");
    scrollContent.classList.add("scroll-content");

    const label = document.createElement("label");
    label.textContent = "Time To take Medicine";
    scrollContent.appendChild(label);

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const timeInput = document.createElement("input");
    timeInput.type = "time";
    inputGroup.appendChild(timeInput);

    const textarea = document.createElement("textarea");
    textarea.name = "text";
    textarea.cols = "50";
    textarea.rows = "2";
    textarea.placeholder = "Notes";
    inputGroup.appendChild(textarea);

    scrollContent.appendChild(inputGroup);
    scrollView.appendChild(scrollContent);

});


closeForm.addEventListener("click", () => {
    form.classList.remove("active");
    overlay.classList.remove("active");


});
// ***************************************************************************
const addBtn = document.querySelector("#btn-form-add-task");
const scrollView = document.querySelector(".scroll-view");


addBtn.addEventListener("click", () => {
    const scrollContent = document.createElement("div");
    scrollContent.classList.add("scroll-content");

    const label = document.createElement("label");
    label.textContent = "Time To take Medicine";
    scrollContent.appendChild(label);

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const timeInput = document.createElement("input");
    timeInput.type = "time";
    inputGroup.appendChild(timeInput);
    inputGroup.appendChild(timeInput);

    const textarea = document.createElement("textarea");
    textarea.name = "text";
    textarea.cols = "50";
    textarea.rows = "2";
    textarea.placeholder = "Notes";
    inputGroup.appendChild(textarea);

    scrollContent.appendChild(inputGroup);
    scrollView.appendChild(scrollContent);

});


///////////           Get medicine + medicines recommendations           ////////////////



const medsDB = firebase.database().ref('medecines');
const medsearchBar = document.getElementById('med-name');
const recommendationsListMeds = document.getElementById('med-recommendation');
let medName = "";
medsearchBar.addEventListener('input', (event) => {
    const searchQuery = medsearchBar.value.trim(); // Change 'searchBar' to 'medsearchBar'
    medsDB.once('value', (snapshot) => {
        recommendationsListMeds.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const med = childSnapshot.val();
            const medKey = childSnapshot.key; // Get the medicine key (name)
            if (medKey.toLowerCase().startsWith(searchQuery.toLowerCase())) { // Check if medicine key matches the search query
                const listItem = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = medKey; // Use the medicine key as the text content
                listItem.appendChild(a);
                console.log("medsList", listItem);

                recommendationsListMeds.appendChild(listItem);
                listItem.addEventListener('click', (event) => {
                    medName = medKey;
                    medsearchBar.value = medName;
                    recommendationsListMeds.style.display = 'none';
                });
            }
        });
        if (searchQuery.length > 0) {
            recommendationsListMeds.style.display = 'block';
        } else {
            recommendationsListMeds.style.display = 'none';
        }
    });
});




///////////           saving medicine data in object           ////////////////



let medList = [];

const addButton = document.getElementById('btn-form-add');
let medcount = 0;
let doneReading = false;
addButton.addEventListener('click', (event) => {

    const forbRef = firebase.database().ref('patients/' + patient.id + '/recipes');
    forbRef.once('value', (snapshot) => {
        const currentMed = medNameInput.value.trim();
        alert(snapshot.numChildren());
        snapshot.forEach((recipesSnapshot) => {
            alert(recipesSnapshot.key);
            recipesSnapshot.child('medicines').forEach((medsSnapshot) => {
                let medName = medsSnapshot.child('medName').val();
                let activationDateRef = medsSnapshot.child('activationDate');
                if (activationDateRef.exists()) {
                    let activationDate = activationDateRef.val();
                    let dateParts = activationDate.split("/");
                    var day = parseInt(dateParts[0], 10);
                    var month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
                    var year = parseInt(dateParts[2], 10);
                    var targetDate = new Date(year, month, day);
                    targetDate.setDate(targetDate.getDate() + duration);
                    var today = new Date();
                    if (targetDate >= today) {

                    } else {
                        alert(medName + " expired");
                        const forbMedsRef = firebase.database().ref('medicines/' + medName + '/forbMeds');
                        var forbs;
                        forbMedsRef.once('value', (forbSnapshot) => {
                            if (forbSnapshot.val() != null) {
                                forbs = forbSnapshot.val().split("/");
                                for (let i = 0; i < forbs.length; i++) {
                                    if (forbs[i].trim == currentMed) {
                                        alert("wayli" + currentMed + " is not working with " + medName);
                                    }
                                }
                            }
                        });

                    }
                } else {
                    alert(medName + "not activated");
                }

            });
        });
        doneReading = true;
        contin();
    });


    function contin() {
        const timeInputs = document.querySelectorAll('.scroll-content input[type="time"]');
        const noteTextareas = document.querySelectorAll('.scroll-content textarea');

        // Retrieve values from the form inputs
        const medName = medNameInput.value.trim();
        const dose = doseInput.value.trim();
        const quantity = parseInt(quantitySelect.value);
        let repititionAfter;
        if (repititionAfterinput.value == '') {
            repititionAfter = 1;
        } else {
            repititionAfter = parseInt(repititionAfterinput.value);
        }

        const tasks = [];


        tasks.some((tn) => tn.hour === '' || tn.note === '')

        for (let i = 0; i < timeInputs.length; i++) {

            if (timeInputs[i].value !== '' || noteTextareas[i].value.trim() !== '') {
                const hour = timeInputs[i].value;
                const note = noteTextareas[i].value.trim();
                tasks.push({ hour, note });
                // console.log('time :',timeInputs[i].value,'note',noteTextareas[i].value.trim() );
            }
        }

        //////////////////////         check if fields are empty        //////////////////

        if (medName === '' || dose === '' || quantity === '') {
            alert('Please fill in all the required fields');
            return;
        }

        /////// check if tasks are empty || tasks.some((tn) => tn.time === '' || tn.note === '')  ///// 


        if (medList.some((item) => item.medName === medName)) {
            const confirmResult = confirm('Medicine already exists. Do you want to modify it?');

            if (confirmResult) {

                const formData = {

                    medName: medName,
                    dose: dose,
                    quantity: quantity,
                    repititionAfter: repititionAfter,
                    tasks: tasks
                };

                const existingIndex = medList.findIndex((item) => item.medName === medName);
                if (existingIndex !== -1) {

                    medList[existingIndex] = formData; // Update the existing object with the new form data

                    document.getElementById('med-form').classList.remove("active");
                    document.getElementById('overlay').classList.remove("active");
                    return;
                }
            } else {
                return;
            }
        }

        const formData = {
            medName: medName,
            dose: dose,
            quantity: quantity,
            repititionAfter: repititionAfter,
            tasks: tasks

        };

        // Reset the form inputs

        document.getElementById('med-form').classList.remove("active");
        document.getElementById('overlay').classList.remove("active");

        medcount++;
        const prescription = document.getElementById('Prescription');
        const med = document.createElement('div');
        const a = document.createElement('a');
        const icon = document.createElement('i');

        icon.className = 'fas fa-trash';
        // icon.alt='';
        // icon.src = 'assets/trash-solid.svg';
        med.textContent = "Medicine " + medcount + ":";
        a.textContent = medName;
        // med.title='edit';

        icon.addEventListener('click', (event) => {

            med.remove();
            medList.splice(medList.findIndex((item) => item[medName]), 1);
        });


        med.appendChild(a);
        med.appendChild(icon);

        prescription.appendChild(med);

        medList.push(formData);
    }

});







//////////////           saving prescription in firebase           ////////////////

const duration = document.getElementById('duration');
const print = document.getElementById('print');
const confirmbtn = document.getElementById('confirm-button');
let prescriptionId;


confirmbtn.addEventListener('click', (event) => {

    const dateInput = document.getElementById('date-input');
    let date = dateInput.value;
    var selectedDate = new Date(date);
    var formattedDate = selectedDate.toLocaleDateString("en-GB");
    date = formattedDate;


    const dur = parseInt(duration.value);

    if (patient == null) {
        alert('Please enter patient name');
        return;
    }

    if (date === '') {
        alert('Please enter the date ');
        return;
    }

    console.log(medList);
    console.log("patient :", patient);

    const recipes = firebase.database().ref(`patients/${patient.id}/recipes`);

    recipes.once('value')
        .then((snapshot) => {
            const count = snapshot.numChildren();
            console.log('Number of recipes:', count);
            prescriptionId = patient.id + '-' + count;


            for (let i = 0; i < medList.length; i++) {
                firebase.database().ref(`patients/${patient.id}/recipes/${count}/medicines/` + i).set(medList[i]);
            }
            firebase.database().ref(`patients/${patient.id}/recipes/${count}/date`).set(date);
            firebase.database().ref(`patients/${patient.id}/recipes/${count}/treatmentDuration`).set(dur);
            firebase.database().ref(`patients/${patient.id}/recipes/${count}/drName`).set(doctor.name);

            console.log('dr', doctor.name, 'date', date);


            print.classList.add("active");
            overlay.classList.add("active");

        });


});


//////////////////////////       print priscription     //////////////////////////////////




const printBtn = document.getElementById('print-btn');
const cancelPrintBtn = document.getElementById('cancel-print-btn');

cancelPrintBtn.addEventListener('click', (event) => {
    print.classList.remove("active");
    overlay.classList.remove("active");
    location.reload();
});


function generatePrescriptionPDF() {
    // Define the prescription content and styling
    var docDefinition = {
        pageSize: { width: 400, height: 550 },
        pageMargins: [20, 40, 20, 0],
        content: [{
                columns: [{
                        width: 'auto',
                        stack: [
                            { text: 'Dr.' + doctor.name, style: 'doctorName' },
                            { text: 'Specialty: ' + doctor.speciality, style: 'doctorSpecialty' }
                        ]
                    },
                    {
                        width: 'auto',
                        stack: [
                            { text: doctor.adress, style: 'doctorAddress' },
                            { text: 'Phone: ' + doctor.tlf, style: 'doctorPhone' }
                        ],
                        alignment: 'right',
                        absolutePosition: { x: 230, y: 40 }
                    }
                ],
                columnGap: 10
            },
            { text: 'PRESCRIPTION', style: 'title' },
            {
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        [
                            { text: 'Patient Name: ' + patient.name, style: 'patientInfo' },
                            { text: 'Date: ' + new Date().toLocaleDateString(), style: 'patientInfo' }
                        ]
                    ]
                },
                layout: 'noBorders',

            },

            {
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        [
                            { text: 'Age: ' + calculateAge(patient['birth date']), style: 'patientInfo' },
                            { text: 'Treatment Duration: ' + duration.value, style: 'patientInfo' }
                        ]
                    ]
                },
                layout: 'noBorders',
                margin: [0, 3]
            },
            { text: 'Medicines:', style: 'title2' },
            {
                ul: [],
                margin: [0, 10]
            },
            {
                text: "Doctor's Signature :",
                fontSize: 14,
                bold: true,
                alignment: 'left',
                absolutePosition: { x: 5, y: 450 }

            }
        ],
        styles: {
            title: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 20, 0, 10]
            },
            title2: {
                fontSize: 16,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            patientInfo: {
                fontSize: 12,
                margin: [0, 5]
            },
            doctorName: {
                fontSize: 12,
                bold: true
            },
            doctorSpecialty: {
                fontSize: 10
            },
            doctorAddress: {
                fontSize: 10
            },
            doctorPhone: {
                fontSize: 10
            }
        }
    };

    medList.forEach(function(medicine) {
        let days;
        if (medicine.repititionAfter == 1) {
            medicine.repititionAfter = '';
            days = 'day';
        } else {
            medicine.repititionAfter = ' ' + medicine.repititionAfter;
            days = ' days';
        }

        var listItem = {
            text: [medicine.quantity + ' ',
                { text: medicine.medName, bold: true },
                ' (' + medicine.dose + ')' + ' - ' + medicine.tasks.length + ' times every' + medicine.repititionAfter + days
            ],
            margin: [0, 5]
        };

        docDefinition.content[docDefinition.content.length - 2].ul.push(listItem);
    });




    const key = 5;
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let qrImg;

    let output = "";
    if (prescriptionId.charAt(10) == '-') {
        for (let i = 0; i < prescriptionId.length; i++) {
            if (i == 10) {
                output += '-'
            } else {
                output += chars.charAt(parseInt(prescriptionId.charAt(i)) + 5);
            }
        }
        console.log('output', output);
    }


    qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${output}`;



    var qrCodeImage = new Image();


    qrCodeImage.src = qrImg;


    qrCodeImage.crossOrigin = 'anonymous'; // Set cross-origin attribute to handle CORS
    qrCodeImage.onload = function() {
        // Create a canvas element to convert the image to dataURL
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = qrCodeImage.width;
        canvas.height = qrCodeImage.height;
        context.drawImage(qrCodeImage, 0, 0);
        var dataURL = canvas.toDataURL();



        docDefinition.content.push({
            image: dataURL, // Replace 'imageURL' with the actual URL or base64 data of the image
            width: 100, // Adjust the width as per your requirements
            height: 100, // Adjust the height as per your requirements
            alignment: 'center', // Align the image to the center
            absolutePosition: { x: 280, y: 410 },
        });

        docDefinition.content.push({
            text: prescriptionId,
            alignment: 'center', // Align the image to the center
            absolutePosition: { x: 280, y: 510 },
        });


        var pdfDoc = pdfMake.createPdf(docDefinition);

        // Download the PDF
        pdfDoc.download('prescription.pdf');
    };

    qrCodeImage.onerror = function() {
        console.error('Failed to load QR code image');
    };
}



printBtn.addEventListener('click', (event) => {
    generatePrescriptionPDF();

});





///////////////////          verify  patient's id        ////////////////

const addPatient = document.querySelector("#add-patient");
const verifyPopUp = document.querySelector(".patientVerify");
// const overlay = document.querySelector("#overlay");
const verify = document.querySelector("#verify-id");
const patientAddForm = document.querySelector(".patientAdd");

const verifyIdInput = document.getElementById("patient-id-add");

let patientId;


addPatient.addEventListener("click", () => {
    verifyPopUp.classList.add("active");
    overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
    verifyPopUp.classList.remove("active");
    overlay.classList.remove("active");
    patientAddForm.classList.remove("active");
});

verify.addEventListener("click", () => {

    if (verifyIdInput.value === '') {
        alert("please enter the patient's id");
        return;
    }

    patientId = verifyIdInput.value.trim();


    userFormDb.once('value')
        .then(snapshot => {

            const patientsData = snapshot.val();
            const exist = patientsData.hasOwnProperty(patientId);

            if (exist) {
                verifyPopUp.classList.remove("active");
                overlay.classList.remove("active");
                alert("this id already exist");
            } else {
                verifyPopUp.classList.remove("active");
                patientAddForm.classList.add("active");
            }
        })
});


///////////////////////         Add Patient        //////////////////////


const addPatientConfirm = document.getElementById('add-patient-btn-confirm');
const addPatientCancel = document.getElementById('add-patient-btn-cancel');

const nameInput = document.getElementById('patient-name');
const ageInput = document.getElementById('age');
const genderInput = document.getElementById('gender');
const phoneInput = document.getElementById('phoneNumber');
const insurenceInput = document.getElementById('insurence');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');





addPatientConfirm.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const gender = genderInput.value.trim();
    const phone = phoneInput.value.trim();
    const insurence = parseInt(insurenceInput.value.trim());
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    if (name === '' || age === '' || gender === '') {
        alert("Please fill the required fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }



    firebase.auth().createUserWithEmailAndPassword(email, password);

    firebase.database().ref(`patients/${patientId}/name`).set(name);
    firebase.database().ref(`patients/${patientId}/age`).set(age);
    firebase.database().ref(`patients/${patientId}/sex`).set(gender);
    firebase.database().ref(`patients/${patientId}/phone`).set(phone);
    firebase.database().ref(`patients/${patientId}/insurence`).set(insurence);
    firebase.database().ref(`patients/${patientId}/email`).set(email);


    overlay.classList.remove("active");
    patientAddForm.classList.remove("active");
});



addPatientCancel.addEventListener("click", () => {
    overlay.classList.remove("active");
    patientAddForm.classList.remove("active");
});





////////////////////////  profile ///////////////////////////////////

const profileBtn = document.getElementById('sb-Profile');

const patientProfile = document.getElementById('patientProfile');







profileBtn.addEventListener('click', () => {

    if (searchBar.value === '') {
        alert("Choose a patient first");
        return;
    }

    patientProfile.classList.add('active');
    profileBtn.classList.add('active');
    overlay.classList.add('active');

    overlay.addEventListener('click', () => {
        patientProfile.classList.remove('active');
        profileBtn.classList.remove('active');
    });



    document.querySelector(".value-name").textContent = patient.name;

    document.querySelector(".value-age").textContent = calculateAge(patient['birth date']);

    document.querySelector(".value-phone").textContent = patient.phone;
    document.querySelector(".value-email").textContent = patient.email;

    if (patient.insurence == 1) {
        document.querySelector(".value-insurance").textContent = 'available';
    } else {
        document.querySelector(".value-insurance").textContent = "unavailable";
    }


    if (patient.sex === 'm') {
        document.querySelector(".value-gender").textContent = 'male';
    } else {

        if (patient.sex === 'f') {
            document.querySelector(".value-gender").textContent = 'female';
        }
    }







});


//////////////////  Recipes history ////////////

const recipeBtn = document.getElementById('sb-History');
const recipeslayout = document.querySelector(".recipes-popup");
const recipeHistory = document.querySelector(".recipes");
let count;


recipeBtn.addEventListener('click', () => {

    if (searchBar.value === '') {
        alert("Choose a patient first");
        return;
    }


    recipeBtn.classList.add('active');
    recipeslayout.classList.add('active');
    overlay.classList.add('active');

    overlay.addEventListener('click', () => {
        recipeHistory.innerHTML = '';
        recipeslayout.classList.remove('active');
        recipeBtn.classList.remove('active');

    });



    firebase.database().ref(`patients/${patient.id}`).once('value')
        .then(snapshot => {

            patient = snapshot.val();
            console.log('recipes', patient.recipes);
        });


    let recipes = firebase.database().ref(`patients/${patient.id}/recipes`);

    recipes.once('value')
        .then((snapshot) => {
            recipes = snapshot.val();
            count = snapshot.numChildren();
            console.log('count', count);

            if (count == 0) {
                const noRecipes = document.createElement('div');
                noRecipes.classList.add('no-recipes');
                noRecipes.textContent = 'there is no recipes';
                recipeHistory.appendChild(noRecipes);

                return;
            }


            for (let i = count - 1; i > -1; i--) {
                const recipe = document.createElement('div');
                recipe.classList.add('recipe');

                const doctorName = document.createElement('div');
                doctorName.classList.add('doctor');
                console.log('i', i);
                doctorName.textContent = 'Dr.' + recipes[i].drName;

                const recipeDate = document.createElement('a');
                recipeDate.textContent = recipes[i].date;



                recipe.appendChild(doctorName);
                recipe.appendChild(recipeDate);
                recipeHistory.appendChild(recipe);
            }


        });

});







/////////////////                   Diseases                       /////////////////


const diseasesBtn = document.getElementById("sb-Diseases");
const diseaseslayout = document.querySelector(".diseases-popup");
const diseasesHistory = document.querySelector(".diseases");
const addDisease = document.getElementById('add-disease');
const diInput = document.getElementById('disease-input');
const saveDisease = document.getElementById('save-disease');


diseasesBtn.addEventListener('click', () => {


    if (searchBar.value === '') {
        alert("Choose a patient first");
        return;
    }

    diseasesBtn.classList.add('active');
    diseaseslayout.classList.add('active');
    overlay.classList.add('active');



    overlay.addEventListener('click', () => {
        diseasesHistory.innerHTML = '';
        diseaseslayout.classList.remove('active');
        diseasesBtn.classList.remove('active');

        diInput.classList.remove('active');
        saveDisease.classList.remove('active');
        addDisease.classList.remove('nonactive');

    });



    firebase.database().ref(`patients/${patient.id}`).once('value')
        .then(snapshot => {

            patient = snapshot.val();
            console.log('diseases', patient.diseases);
        });

    //////

    let diseases = firebase.database().ref(`patients/${patient.id}/diseases`);

    diseases.once('value')
        .then((snapshot) => {
            diseases = snapshot.val();
            count = snapshot.numChildren();
            console.log('count', count);

            if (count == 0) {
                const noDiseases = document.createElement('div');
                noDiseases.classList.add('no-diseases');
                noDiseases.textContent = 'there is no diseases';
                diseasesHistory.appendChild(noDiseases);
                return;
            }


            addDisease.addEventListener('click', () => {
                diInput.classList.add('active');
                saveDisease.classList.add('active');
                addDisease.classList.add('nonactive');

                saveDisease.addEventListener('click', () => {

                    firebase.database().ref(`patients/${patient.id}/diseases/${count}`).set(diInput.value);

                    diInput.classList.remove('active');
                    saveDisease.classList.remove('active');
                    addDisease.classList.remove('nonactive');


                    const disease = document.createElement('div');
                    disease.classList.add('disease');

                    disease.textContent = diInput.value;


                    diseasesHistory.appendChild(disease);
                });


            });


            for (let i = 0; i < count; i++) {
                const disease = document.createElement('div');
                disease.classList.add('disease');

                disease.textContent = diseases[i];


                diseasesHistory.appendChild(disease);
            }
        });

});


///////////           Calculate Age          //////////
function calculateAge(birthDate) {
    const today = new Date();

    // Extract the day, month, and year from the birth date string
    const [birthDay, birthMonth, birthYear] = birthDate.split('/');

    // Create a new Date object using the extracted values
    const birthDateObj = new Date(`${birthYear}-${birthMonth}-${birthDay}`);

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
}