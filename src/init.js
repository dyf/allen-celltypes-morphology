var jQuery = require('./jquery.min.js');
var M = require('./morphology.js');


function download_morphology_path(specimen_id, on_success) {
    var url = "http://celltypes.brain-map.org/api/v2/data/NeuronReconstruction/query.json?wrap=true&criteria=model::NeuronReconstruction,rma::criteria,[specimen_id$eq" + specimen_id + "],rma::include,well_known_files&num_rows=all";
    
    $.getJSON(url, function(data) {
        if (data.msg.length > 0) {
            var path = data.msg[0].well_known_files[0].download_link;
            on_success(path);
        }
    });
}



function download_morphology(specimen_id, on_success) {
    download_morphology_path(specimen_id, function(link) {
        var url = "http://api.brain-map.org" + link;

        $.ajax(url, { 
            success: function(data) {
                morphology = new M.Morphology(M.parse_swc(data));
                on_success(morphology);
            }
        });
    });
}

module.exports.download_morphology = download_morphology;
module.exports.download_morphology_path = download_morphology_path;
