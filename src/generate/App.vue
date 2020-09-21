<template>
    <div id="app-container">
        <h1><a href="https://leventhalmap.org" target="_blank">LMEC</a> ⧽ Generate a Map Exercise link</h1>
        
        <table>
            <tr><td class="label">Enter Google Forms share URL <div class="instructions">Click the "Send" button in Google Forms and choose to send as a link. Then copy the full URL. Do not choose "Shorten URL."</div></td><td class="input" ><input type="text" placeholder="Google Forms URL" v-model="gfEntry"></td></tr>
            <tr><td class="label">Enter Digital Collections URL <div class="instructions">From an object on Map Center's Digital Collections page, copy the browser's URL.</div></td><td class="input" ><input type="text" placeholder="Digital Collections URL" v-model="dcEntry"></td></tr>
             <tr><td class="label">Canvas, Sequence, Image <div class="instructions">For an object with just one image, leave all of these set to 0. For more complicated objects, contact Map Center staff.</div></td><td class="input"><input type="text" class="number-input" placeholder="Canvas" v-model="canvas"><input type="text" class="number-input" placeholder="Sequence" v-model="sequence"><input type="text" class="number-input" placeholder="Image" v-model="image"></td></tr>

        </table>
        <div id="result">
            <h2>Shareable Link</h2>
        <input type="text" readonly v-model="computedURL" id="computedURL"><br>
        <button @click="gotoLink">Go to this Map Exercise</button>
        <button @click="copy">Copy this URL to clipboard</button>
        </div>
    </div>
</template>


<script>
import Vue from "vue";
export default Vue.extend({

    data: function() { 
        return {
            gfEntry: "",
            dcEntry: "",
            canvas: 0,
            sequence: 0,
            image: 0
    }},

    methods: {
        gotoLink: function() {
            window.open(this.computedURL);
        },
        
        copy: function() {
            var t = document.getElementById('computedURL');
            t.select();
            t.setSelectionRange(0, 99999);
            document.execCommand("copy");
        }
    },
    computed: {
        computedURL: function(){
            var gfId = this.gfEntry.slice(this.gfEntry.search("/d/e/")+5,this.gfEntry.search('/viewform'));
            var dcID = this.dcEntry.slice(this.dcEntry.search("commonwealth:")+13)
            return `https://geoservices.leventhalmap.org/map-exercise/#${gfId}$${dcID}$${this.canvas}$${this.sequence}$${this.image}`;
        }
    }
    
});
</script>

<style>

#app-container {
    font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
    padding: 10px 30px;
}

input { 
    font-size: 1.5em;
    padding: 5px;
}

input::placeholder {
    color: #bbb;
}

td input {
        width: 100%;
}

input.number-input {
    width: 24px;
    margin-right: 8px;
}

table { width: 100%; }

td.input {
    width: 80%;
    vertical-align: top;
}


.instructions {
    font-size: 0.8em;
    font-style: italic;
    color: #555;
    padding: 10px;
}

#result {
    background-color: rgb(233, 226, 255);
    padding: 15px;
    border-radius: 5px;
}

#result input {
    width: 80%;
    margin-bottom: 10px;
}

button {  background-color: #2f0f3b; /* Green */
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer; 
  border-radius: 2px;
  font-weight: bold;
  }


</style>