VANTA.DOTS({
    el: "#body",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    size: 2.60,
    color: 0x0,
    color2: 0x0,
    backgroundColor: 0xffffff,
    showLines: false
  })

document.addEventListener('DOMContentLoaded', function() {
    const navbarBurger = document.querySelector('.navbar-burger');
    const menu = document.getElementById(navbarBurger.dataset.target);

    navbarBurger.addEventListener('click', () => {
    navbarBurger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

});

vex.defaultOptions.className = 'vex-theme-wireframe';

$(document).ready(function() {
    $('#questionForm').on('submit', function(e) {
        e.preventDefault();
  
        const questionContent = $.trim($('#questionForm textarea').val());
        const brokerCode = $('#brokerCode').val(); // Ensure you're retrieving the broker code

        if (questionContent === '') {
            vex.dialog.alert('Empty Submission.');
            return;
        }
  
        $.ajax({
            url: '/user/submitQuestion',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ brokerCode, content: questionContent }),
            success: function(response) {
                vex.dialog.alert({
                    message: 'Your question has been sent. You should hear back from our team within 3 business days.',
                    callback: function() {
                        $('#questionForm textarea, #questionForm button[type="submit"]').attr('disabled', true).hide();
                        $('#anotherQuestion').show();
                    }
                });
            },
            error: function() {
                vex.dialog.alert('An error occurred. Please try again later.');
            }
        });
    });

    // Event handler for "Send Another Question" button
    $('#anotherQuestion').on('click', function() {
        // Clear the textarea
        $('#questionForm textarea').val('');

        // Re-enable the textarea and the submit button, then focus the textarea
        $('#questionForm textarea, #questionForm button[type="submit"]').attr('disabled', false).show();
        $('#questionForm textarea').focus();

        // Hide the "Send Another Question" button itself
        $(this).hide();
    });
});
