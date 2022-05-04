# Scripts
Those scripts are meant to run with bash on an unix env.
This folder contains scripts to compile AssemblyScript(AS), minify CSS and JS, and insert the import tags in it.  
Those scripts produce two environement : 
 - a developpement environments where the CSS and JS are not minifyed, the AS is comipiled in a laizy way to reduce compilation time and allow for fast trial and error.
 - a production environement where the JS and CSS are minifyed, the AS is compiled with as much optimisation arguments as possible.

