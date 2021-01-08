import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import IIIF from 'ol/source/IIIF';
import IIIFInfo from 'ol/format/IIIFInfo';

import './style.styl'

const hashVars = window.location.hash.substring(1).split('$');

// We should have 5 hash variables separated by $ character.
// 0 = ID of a Google Form
// 1 = Digital Commonwealth ID -- OR Manifest if prefixed by "m:" -- OR Image if prefixed by "i:"
// 2 = Sequence Number
// 3 = Canvas Number
// 4 = Image Number

var layer = new TileLayer(),
map = new Map({
    layers: [ layer ],
    target: 'ol-map'
});

// Check if we have 5 vars in the hash
if (hashVars.length < 2) {
    failLoad();
}
 else {
    initialize();
}


function initialize(){

    // Set the Google form to the source of the inline frame
    document.getElementById('form-frame').src = `https://docs.google.com/forms/d/e/${hashVars[0]}/viewform?embedded=true`;

    if(hashVars[1].slice(0,3)==='m::') {
        fetch(hashVars[1].slice(3))
        .then(response => response.json())
        .then(manifest => parseManifest(manifest))
        .catch(failLoad);
    }
    
    else if(hashVars[1].slice(0,3)==="i::") {
        fetch(hashVars[1].slice(3))
        .then(response => response.json())
        .then(imageInfo => loadImage(imageInfo))
        .catch(failLoad);
    }

    else {
    
    // Fetch the Manifest
    fetch(`https://www.digitalcommonwealth.org/search/commonwealth:${hashVars[1]}/manifest.json`)
        .then(response => response.json())
        .then(manifest => parseManifest(manifest))
        .catch(failLoad);
    }

}

function failLoad(){
    document.body.innerHTML = '<h1 class="error">Page failed to load. This URL is formatted incorrectly.</h1>';
}

function parseManifest(manifest) {

    console.log(manifest);

    // First set the #map-title object to the Manifest's title metadata
    document.getElementById('map-title').innerText = manifest.label;


    // Now get the Image endpoint using the sequence, canvas, image
    fetch(manifest.sequences[hashVars[2]].canvases[hashVars[3]].images[hashVars[4]].resource.service['@id'])
        .then(response => response.json())
        .then(imageInfo => loadImage(imageInfo))
        .catch(failLoad);

}


function loadImage(imageInfo) {
    console.log("Loading image");
    var options = new IIIFInfo(imageInfo).getTileSourceOptions();
    console.log(options);
    
    if (options === undefined || options.version === undefined) {
        return;
    }

    options.zDirection = -1;
 
    var iiifTileSource = new IIIF(options);
          layer.setSource(iiifTileSource);
          map.setView(
            new View({
              resolutions: iiifTileSource.getTileGrid().getResolutions(),
              extent: iiifTileSource.getTileGrid().getExtent(),
              constrainOnlyCenter: true,
            })
          );
    map.getView().fit(iiifTileSource.getTileGrid().getExtent());

};