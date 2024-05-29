function paraph(){
    window.open("gpsavion.html", "_self");
}

function paraph2(){
    window.open("Maintenancepre.html", "_self");
}
function paraph3(){
    window.open("Simulavion.html", "_self");
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
