# Scripts
Requires node >=13
This folder contains scripts to compile AssemblyScript(AS), minify CSS and JS, and insert the import tags in it.  
Those scripts produce two environement : 
 - a developpement environment where the CSS and JS are not minified, the AS is compiled in a lazy way to reduce compilation time and allow for fast trial and error.
 - a production environement where the JS and CSS are minified, the AS is compiled with as much optimisation arguments as possible.

