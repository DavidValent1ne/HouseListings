let map;
let marker;
import { initURLWithCords } from "./housing.js";
export function intiMapURL() {
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "AIzaSyBY_nzCtfpc_67REDX5QbgAw6invTSHPmY", v: "weekly"});
}

export function getMarkerPosition(marker) {
    marker.addListener('click', function() {
      var position = marker.getPosition();
      console.log('Marker position:', position.lat(), position.lng());
    });
  }

export function markerClick() {
    getMarkerPosition(marker);
}

export async function initMap(latitude, longitude) { 
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: latitude, lng: longitude },
    zoom: 18,
  });

   marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    draggable:true,
    title:"Drag me! \n   Or    \nClick me!",
  });
  marker.addListener("click", function () {
    // Retrieve the position of the clicked marker
    const position = marker.getPosition();
  
    // Use the position for further processing or display
    initURLWithCords(position.lat(), position.lng());
    console.log("Marker clicked. Position:", position.lat(), position.lng());
  });
  return(marker);

}

