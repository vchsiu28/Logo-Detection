
 var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      var output = document.getElementById('output');
      output.src = dataURL;
      if(output.height >= output.width){
        output.style ="float:left;width:100%;height=450";

      } else {
        output.style ="float:left;height:100%;width=450";
      }

    };
    reader.readAsDataURL(input.files[0]);
  };