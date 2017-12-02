$( document ).ready(function() {

  $('.cover').click(function() {
    $(this).hide()

    $('.touchToSee').show()

  })


  $('input[type="file"]').change(function() {
    if ($(this).val()) {
      console.log('uploaded')
    }
  })
})
