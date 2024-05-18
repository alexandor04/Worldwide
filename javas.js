// The number of pages available for loading more posts
var maxPages = parseInt('34');
/* Ghost Search */
// Replace it with your domain: ghost_host = 'https://yoursite.domain'
var ghost_host = 'https://roughtrade.ghost.io';
// Settings > Integrations > New Custom Integration. Copy Key. Replace ghost_key below.
var ghost_key = '17e7f410823c30ba9f7a89dd5e';

/* Disqus */
var disqus_shortname = 'biron-demo'; // Replace 'biron-demo' with your disqus account shortname
    
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:2660609,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-XSFQRHW56P');

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M3BGVC2');/*]]>*/

(function(window, document) {
    //var path      = window.location.pathname.match(/[^\/]./)[0];
    var path      = window.location.pathname.match(/\/(gb|us)\/?/i)[1];
    var home_icon = document.getElementsByClassName("header__brand-home")[0];
    home_icon.setAttribute('href',  home_icon.getAttribute('href') + '/' + path);
})(window, document);


