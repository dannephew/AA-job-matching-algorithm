
function togglePasswordVisibility() {
    var x = document.getElementById("passwordVal");
    if(x.type === "password"){
        x.type = "text";
    } else {
        x.type = "password";
    }
}