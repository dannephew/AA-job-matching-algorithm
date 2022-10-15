
function togglePasswordVisibility() {
    var x = document.getElementById("passwordVal");
    if(x.type === "password"){
        x.type = "text";
    } else {
        x.type = "password";
    }
};

function selectionLimit() {
    var select = document.querySelector("#workCultureSelect");
    var total = 0;
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected == true) {
            total = total + 1
        }
    }
    if (total > 3) {
        select.options[select.options.selectedIndex].selected=false
    }
};