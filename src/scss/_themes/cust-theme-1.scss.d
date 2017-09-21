/* #THEME COLOR (variable overrides)
========================================================================== */
$color-primary:         							#205694;
$color-fusion: 										darken(desaturate(adjust-hue($color-primary, 5), 30%), 5%); 

/* #GLOBAL IMPORTS
========================================================================== */
@import './src/scss/_imports/_theme-modules-import';

/* #Reset userselect
========================================================================== */
#myapp-1 {
	box-shadow: none !important;
}
#myapp-2 {
	box-shadow: 0 0 0 3px #2ba1ff;
}