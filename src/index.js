'use strict';

var LightningVisualization = require('lightning-visualization');
var _ = require('lodash');
var INIT = require('./init.js');
var MW = require('./morphology_widget.js');

/* 
 * Uncomment this code to require an optional stylesheet
 */
// var fs = require('fs');
// var styles = fs.readFileSync(__dirname + '/styles/style.css');


/*
 * Extend the base visualization object
 */

var Visualization = LightningVisualization.extend({

    init: function() {
        /*
         * FILL IN Add any logic for initializing the visualization
         */ 
        var _self = this;
        
        INIT.download_morphology(this.data.specimen_id, function(morphology) {
            _self.morphology = morphology;
            _self.render();
        });
    },

    /*
     * optionally pass a string of CSS styles 
     */
    // styles: styles,

    render: function() {
        /*
         * FILL IN Render the visualization
         */

        /*
         * FILL IN Get data / selector from this.data and this.selector
         */
        var container = $(this.selector);
        container.html("");

        console.log("here i am");
        console.log(this.width, this.height);
        console.log(container.width(), container.height());
/*
        var element = $("<div>").appendTo(container)
            .width(this.width)
            .height(this.height);
*/
        new MW.MorphologyWidget(container, morphology);
    },

    formatData: function(data) {
        /*
         * Format your data from a raw JSON blob
         */
        return data;
    },

    updateData: function(formattedData) {
        this.data = formattedData;
        /*
         * FILL IN Re-render your visualization
         */
    },

    appendData: function(formattedData) {    
        /*
         * FILL IN Update this.data to include the newly formatted data
         */

        /*
         * FILL IN Re-render the visualization
         */    
    }

});


module.exports = Visualization;
