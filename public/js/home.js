document.addEventListener('DOMContentLoaded', function() {
    fetchClients();

    const navbarBurger = document.querySelector('.navbar-burger');
    const menu = document.getElementById(navbarBurger.dataset.target);

    navbarBurger.addEventListener('click', () => {
    navbarBurger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

});

function fetchClients() {
    fetch('/clients/getClients', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(clients => {
        $('#clientsTable').DataTable({
            data: clients,
            columns: [
                { title: "First Name", data: "firstName" },
                { title: "Last Name", data: "lastName" },
                { title: "Age", data: "age", defaultContent: "N/A" },
                { title: "Phone Number", data: "phoneNumber" },
                { title: "Email", data: "email" },
                { title: "Potential Budget", data: "potentialBudget" },
                { title: "Timeline to Invest", data: "timelineToInvest" },
                { 
                    title: "Actions", 
                    data: null, 
                    defaultContent: "", 
                    orderable: false,
                    render: function(data, type, row, meta) {
                        return `<button class="button is-small is-info" onclick="performAction('${row.id}');">Edit</button>`;
                    }
                }
            ],
            destroy: true,
        });
    })
    .catch(error => {
        console.error('Error fetching clients:', error);
    });
}


// DOM elements
const registerClientBtn = document.getElementById('registerNewClientBtn');

// Initialize Vex.js
vex.defaultOptions.className = 'vex-theme-wireframe';

// Event listeners
registerClientBtn.addEventListener('click', function() {
    console.log("clicked")
    vex.dialog.open({
        message: 'Register New Client',
        input: [
            '<input name="firstName" type="text" placeholder="First Name *" required />',
            '<input name="lastName" type="text" placeholder="Last Name *" required />',
            '<input name="age" type="number" placeholder="Age" />',
            '<input name="phoneNumber" type="tel" placeholder="Phone Number" />',
            '<input name="email" type="email" placeholder="Email *" required/>',
            '<input name="potentialBudget" type="number" placeholder="Potential Budget ($$$) *" required />',
            '<select name="timelineToInvest">',
                '<option value="">Timeline to Invest (months) </option>',
                '<option value="1">1</option>',
                '<option value="2">2</option>',
                '<option value="3">3</option>',
                '<option value="4">4</option>',
                '<option value="5">5</option>',
                '<option value="6">6</option>',
                '<option value="7">7</option>',
                '<option value="8">8</option>',
                '<option value="9">9</option>',
                '<option value="10">10</option>',
                '<option value="11">11</option>',
                '<option value="12">12</option>',
                '<option value="00">N/A</option>',
            '</select>',
        ].join(''),
        buttons: [
            Object.assign({}, vex.dialog.buttons.YES, { text: 'Submit'}),
            Object.assign({}, vex.dialog.buttons.NO, { text: 'Cancel' })
        ],
        callback: function (data) {
            if (!data) {
                console.log('Cancelled');
            } else {
                // Confirm input data
                vex.dialog.confirm({
                    message: 'Are these details correct? Click OK to confirm:',
                    input: [
                        `<p>First Name: ${data.firstName}</p>`,
                        `<p>Last Name: ${data.lastName}</p>`,
                        `<p>Age: ${data.age || 'N/A'}</p>`,
                        `<p>Phone Number: ${data.phoneNumber || 'N/A'}</p>`,
                        `<p>Email: ${data.email || 'N/A'}</p>`,
                        `<p>Potential Budget: $${data.potentialBudget}</p>`,
                        `<p>Timeline to Invest: ${data.timelineToInvest} months</p>`,
                    ].join(''),
                    callback: function (value) {
                        if (!data.timelineToInvest) {
                            vex.dialog.alert('Please select a timeline to invest.');
                            return;
                        }
                        if (value) {
                            submitClientForm(data);
                        } else {
                            console.log('Reopen form for editing - not implemented in this example');
                        }
                    }
                });
            }
        }
    });
});

function submitClientForm(data) {
    const json = JSON.stringify(data);

    fetch('/clients/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong with the submission');
        }
    })
    .then(data => {
        vex.dialog.alert('Client Registered!');
        window.location.reload();
    })
    .catch(error => {
        vex.dialog.alert('Error: ' + error.message);
    });
}