function isNumberKey(evt){
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
  return true;
}

$('#validationCustomUsername').on('keypress change', function() {
  $(this).val(function(index, value) {
    return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
  });
});

// function isValidDate(event){

//   var today, someday;
//   var exMonth=document.getElementById('selectedMonth');
//   console.log('MONTH:', exMonth.value);
//   var exYear=document.getElementById('selectedYear');
//   console.log('YEAR:', exYear.value);

//   today = new Date();
//   someday = new Date();
//   someday.setFullYear(exYear.value, exMonth.value, someday.getDate());

//   if (someday < today) {
//     // document.getElementById("errmsg").innerHTML = "Please select a valid expiry date";
//     exMonth.setCustomValidity("tets Please select a valid expiry date");
//     exYear.setCustomValidity("");
//     return false;
//   }
// }

$("#selectedYear").bind('blur', function(event) {
  var today, someday;
  var exMonth=document.getElementById('selectedMonth');
  console.log('MONTH1:', exMonth.value);
  var exYear=document.getElementById('selectedYear');
  console.log('YEAR1:', exYear.value);

  today = new Date();
  someday = new Date();
  someday.setFullYear(exYear.value, exMonth.value - 1 , someday.getDate());

  if (someday < today) {
    // document.getElementById("errmsg").innerHTML = "Please select a valid expiry date";
    exYear.setCustomValidity("Please select a valid expiry date");
    $(".selectedYear").text("Please select a valid expiry date");
    }else{
      exYear.setCustomValidity("");
    return false;
  }
  
});
