$( document ).ready(function() {

  $('.cover').click(function() {
    $(this).hide()

    $('.touchToSee').show()

  })

  function showImagePreview(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader()
    
      reader.onload = function(e) {
        $('#preview').attr('src', e.target.result)
      }
    
      reader.readAsDataURL(input.files[0])
    }
  }

  var imageContains = function(clarifai, foodType, threshold) {
    var concepts = clarifai.outputs[0].data.concepts
  
    console.log(concepts)
  
    concepts.forEach(element => {
      if (element.name === foodType && element.value >= threshold) {
        return true
      }
    })
  
    return false
  }

  $('input[type="file"]').change(function (event) {
    var files = event.target.files
    $('.preview').show()
    $('.touchToSee').hide()
    showImagePreview(this)

    event.stopPropagation() // Stop stuff happening
    event.preventDefault() // Totally stop stuff happening

    // START A LOADING SPINNER HERE

    // Create a formdata object and add the files
    var data = new FormData()
    data.append('food', files[0])



    $.ajax({
      url: 'submit',
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: function(data) {
        if(data.status === 'success') {
          
          var containsFoodItem = imageContains(data.clarifai, 'sandwich', 0.90)

          if (containsFoodItem == true) {

            $('.tick').show()

          } else {
            $('.cross').show()
          }
        }
        else {
          // Handle errors here
          console.log('ERRORS: ' + data.message)
        }
      },
      error: function(err) {
        // Handle errors here
        console.log('ERRORS: ' + err)
        // STOP LOADING SPINNER
      }
    })
  })

  // Grab the files and set them to our variable
  
})
