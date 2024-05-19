function paraph(){
    document.getElementById("btn").addEventListener("click", function(){
    window.open("avion_de_chasse.html", "_blank");
    })
}

function paraph2(){
    var button2 = document.getElementById("btn2");
    var buttonName= button2.textContent;
    if (buttonName == "Développer"){
        document.getElementById("blocp2").i
    document.getElementById("blocp2").innerHTML = `
    <ul>
        <li>En mars 2005 : le magazine Forbes classe Larry Page et Sergey Brin à la 55e place de son classement des plus grandes fortunes de la planète avec 7,2 milliards de dollars chacun.</li>
        <li>En décembre 2005 :  le Financial Times désigne Brin et Page « hommes de l'année » </li>
        <li>En 2006, Forbes situe Larry Page à la 27e place de son classement des plus grandes fortunes de la planète avec 12,8 milliards de dollars. Son associé Sergey Brin est quant à lui 26e avec 12,9 milliards de dollars</li>
        <li>En 2007, Forbes classe Larry Page à la 5e place de son classement des plus grandes fortunes des États-Unis avec 18,5 milliards de dollars. Il est ex aequo avec son associé Sergey Brin</li>
        <li>En septembre 2013, Forbes le classe à la 20e place de son classement des plus grandes fortunes de la planète avec 24,9 milliards de dollars.</li>
        <li>En 2014, la fortune de Larry Page s'élève à plus 32 milliards de dollars. C'est la 17e personne la plus riche du monde.</li>
        <li>En 2016, selon Forbes, sa fortune est estimée à 36,4 milliards de dollars, ce qui le place donc au 12e rang sur la liste des milliardaires du monde du magazine.</li>
        <li>Toujours selon Forbes, sa fortune s'élève à 54 milliards de dollars en 2018 et 50,8 milliards de dollars en 2019.</li>
        <li>En mars 2021, d'après bloomberg.com, sa fortune atteint 90 milliards de dollars, ce qui fait de lui le septième homme le plus riche au monde. </li>
        <li>En mars 2023, selon Forbes, sa fortune est estimée à 82,2 milliards de dollars, ce qui le place au 10e rang sur la liste des milliardaires du monde.</li>
    </ul>`;
    document.getElementById("btn2").textContent="Réduire";
    }
    else if (buttonName == "Réduire"){
        document.getElementById("blocp2").textContent=" ";
        document.getElementById("btn2").textContent="Développer";
    }
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

function image1(){
    var button = document.getElementById("btnmg");
    var buttonName = button.textContent;
    if(buttonName =="New York>"){
        var image = document.createElement("img");
        image.src = "GNY.jpg";
        image.width = 300;
        image.id = "im1";
        image.classList = "iml";    
        var imageplace = document.getElementById("loc");
        imageplace.appendChild(image);
        document.getElementById("btnmg").textContent="New York<";
    }
    else if (buttonName =="New York<"){
        var image = document.getElementById("im1");
        var parentplace = image.parentNode;
        parentplace.removeChild(image);
        document.getElementById("btnmg").textContent="New York>";
    }

}
function image2(){
    var button = document.getElementById("btnmg2");
    var buttonName = button.textContent;
    if(buttonName =="Paris>"){
        var image = document.createElement("img");
        image.src = "locauxgo.jpg";
        image.width = 300;
        image.id = "im2";
        image.classList = "iml";
        var imageplace = document.getElementById("loc");
        imageplace.appendChild(image);
        document.getElementById("btnmg2").textContent="Paris<";
    }
    else if (buttonName =="Paris<"){
        var image = document.getElementById("im2");
        var parentplace = image.parentNode;
        parentplace.removeChild(image);
        document.getElementById("btnmg2").textContent="Paris>";
    }

}
