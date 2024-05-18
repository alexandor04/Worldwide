dataLayer = [{
  'source'   : 'OVERBLOG_PORTAL',
}];

window.hasGABeenLoaded = false;

var s = document.createElement("script");
s.async = true;
s.src = "https://cdn.lib.getjad.io/library/6783/overblogkiwi";
s.setAttribute('importance', 'high');
s.onload = function(){
  function setupSlideIn() {
      var divSlidein = document.createElement("div");
      divSlidein.id = 'slidein';
      document.body.appendChild(divSlidein);
  }

  if( document.readyState !== 'loading' ) {
      setupSlideIn();
  } else {
      document.addEventListener('DOMContentLoaded', setupSlideIn, false);
  }
};
var g = document.getElementsByTagName("head")[0];
g.parentNode.insertBefore(s, g);

// targeting
var jadTargeting = {};
var noTargetingKeys = ['slots'];
for (var k in dataLayer[0]) {
    if (noTargetingKeys.indexOf(k) === -1) {
        if (typeof dataLayer[0][k] === 'string') {
            jadTargeting[k] = [dataLayer[0][k]];
        } else if (Array.isArray(dataLayer[0][k])) {
            jadTargeting[k] = dataLayer[0][k];
        } else {
            // unknow type
        }
    }
}

jadElementsMapping = {
    "adsense-before-page": "adsense-before-page",
    footer: "cod-adsense-bottom",
    footer_2: "adsense-list-cod",
    footer_3: "mobile-footer",
    header: "user-728",
    header_2: "mobile-header",
    mtf_leaderboard: "mag-728-90",
    mtf_leaderboard_2: "adsense-home",
    mtf_leaderboard_3: "PUB 728x90",
    mtf_leaderboard_4: "blog-directory-728",
    mtf_leaderboard_5: "md-atf-728-90",
    rectangle_atf: "cod-adsense-top",
    rectangle_atf_2: "sidebar-atf-300-600",
    rectangle_atf_3: "sidebar-mtf-300-250",
    rectangle_mtf: "autopromo-300-250",
    rectangle_btf: "md-btf-300-600",
    slidein: "slidein",
};

window.jad = window.jad || {};
jad.cmd = jad.cmd || [];

jad.cmd.push(function() {
  jad.public.setConfig({
      debug: false,
      page: '/6783/OverBlogKiwi/portail',
      targeting: jadTargeting,
      prebidTargeting: jadTargeting,
      elementsMapping: jadElementsMapping,
      cappingByPosition: [{
          position: "interstitial",
          ttl: 86400,
          limit: 10,
      }, {
          position: "slidein",
          ttl: 86400,
          limit: 10,
      }],
      cmp: {
          name: 'didomi',
          siteId: 'e23a01f6-a508-4e71-8f50-c1a9cae7c0d0',
          noticeId: '3FCZAAB8',
          paywall: {
              clientId: 'AVvF60FpOZcS6UoBe6sf8isBLYwzuLgMQCnNdE-FvpoW_OhR8P6zERqhyuIBGPOxqrTHKxv7QxsXnfck',
              planId: 'P-1PX20425XC513033RMBQZVRI',
              tosUrl: 'https://www.over-blog.com/terms-of-sale',
              touUrl: 'https://www.over-blog.com/terms-of-use',
              privacyUrl: 'https://www.over-blog.com/privacy-policy'
          },
          includeCmp: true
      }
  });
  jad.public.loadPositions();
  jad.public.displayPositions();

    var loadGATimeoutID = setTimeout(function(){
    loadGA()
  }, 1000);

  window.didomiOnReady = window.didomiOnReady || [];
  window.didomiOnReady.push(function (Didomi) {
    clearTimeout(loadGATimeoutID);

    function getDidomiConsent(didomiId){
      var consents = false;
      if (Didomi.isConsentRequired()) {
        consents = Didomi.getUserConsentStatusForVendor(didomiId);
      } else {
        consents = true;
      }
      return consents;
    }

    var hasGADidomiConsent = getDidomiConsent("google") && getDidomiConsent("c:googleana-XMqagawa");

    if(!window.hasGABeenLoaded){
      loadGA(hasGADidomiConsent);
    }

      });
})

window.didomiConfig = {
  "app": {
    "name": "CanalBlog",
    "logoUrl": "https://static.canalblog.com/sharedDocs/images/frontend/logo_cb_hp.png",
    "privacyPolicyURL": "https://www.canalblog.com/privacy-policy"
  },
  theme: {
    color: "#043D76",
    linkColor: "#000000"
  }
}
