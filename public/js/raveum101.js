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

      if ($.trim($('#questionForm textarea').val()) === '') {
          vex.dialog.alert('Empty Submission.');
          return;
      }

      // Assuming AJAX or form submission logic goes here

      // Show Vex.js confirmation after submitting
      vex.dialog.alert({
          message: 'Your question has been sent. You should hear back from our team within 3 business days.',
          callback: function() {
              $('#questionForm textarea, #questionForm button[type="submit"]').attr('disabled', true).hide();
              $('#anotherQuestion').show();
          }
      });
  });

  $('#anotherQuestion').on('click', function() {
      vex.dialog.confirm({
          message: 'Are you sure you want to send another question?',
          callback: function(value) {
              if(value) {
                  $('#questionForm textarea').val('');
                  $('#questionForm textarea, #questionForm button[type="submit"]').attr('disabled', false).show();
                  $('#anotherQuestion').hide();
              }
          }
      });
  });
});
