allensdk-celltypes-morphology
=============================

This is a [lightning-viz](http://lightning-viz.org/) plugin for creating a 3D visualualization of a neuron reconstruction from the [Allen Cell Types Database](http://celltypes.brain-map.org).  

installation
------------

    $ git clone https://github.com/dyf/allensdk-celltypes-morphology.git
    $ cd allensdk-celltypes-morphology
    $ npm link .

Then you need to import the visualization into a lightning server.

    $ cd /path/to/lightning
    $ npm start

Open http://localhost:3000, import the visualization as a local NPM module.

usage
-----

If you are inside an IPython/Jupyter notebook, you can:

    > from lightning import Lightning 
    > lgn = Lightning(ipython=True)
    > specimen_id = 471088062
    > lgn.plot(type='allensdk-celltypes-morphology', data={ 'specimen_id': [ specimen_id ] })
