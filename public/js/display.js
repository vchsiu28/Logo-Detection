var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      var output = document.getElementById('output');
      output.src = dataURL;
      if(output.height >= output.width){
        output.style ="float:right;width:100%;height=400";

      } else {
        output.style ="float:right;height:100%;width=400";

      }

    };
    reader.readAsDataURL(input.files[0]);
  };
