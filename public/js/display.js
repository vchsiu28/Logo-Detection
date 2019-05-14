var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      var output = document.getElementById('output');
      output.src = dataURL;
      if(output.height >= output.width){
        output.style ="align:center;max-width:400px;max-height:400px;";

      } else {
        output.style ="align:center;max-height:400px;max-width:400px";
      }

    };
    reader.readAsDataURL(input.files[0]);
  };
