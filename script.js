function paraph(){
    window.open("gpsavion.html", "_self");
}

function paraph2(){
    document.getElementById("btn2").addEventListener("click", function(){
        window.open("", "_blank");
        })
}

function opacity() {
    var pourcent = (parseFloat(document.getElementById('1').value)/100);
    console.log(pourcent);
    var sections = document.getElementsByClassName("sectionv");
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.backgroundColor = "rgba(255, 255, 255, " + pourcent + ")";

    }
    document.getElementById('1').value = "";
}
document.getElementById('1').addEventListener('change', opacity)
