/* #THEME COLOR (variable overrides)
========================================================================== */
$color-primary:         							#00bbff;
$color-fusion: 										darken(desaturate(adjust-hue($color-primary, 5), 70%), 10%); 

/* #GLOBAL IMPORTS
========================================================================== */
@import './src/scss/_imports/_theme-modules-import';

/* #Reset userselect
========================================================================== */
#myapp-1 {
	box-shadow: none !important;
}
#myapp-3 {
	box-shadow: 0 0 0 3px #2ba1ff;
}