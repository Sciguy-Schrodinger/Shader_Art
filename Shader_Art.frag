#define PI 3.14159265359 // Defined constant pi

uniform vec2 u_resolution; // a 2-vector: (width,height)
uniform float u_time; // Global constant representing number of seconds passed since start of program

// Swizzling is the notation to write multi-component vectors as: a.xyz <-> vec3(a.x,a.y,a.z), etc...

// UV: normalized screen coordinates. (0,0) is the bottom-left corner, (1,1) is the top-right, regardless of window size. Dividing by u_resolution makes the coordinates size-independent, so the pattern looks the same at any resolution.

// Multitude of GLSL data types and functions exists...

float random_number(float x){  // RNG
    return fract(100000.0*PI*sin(x));
}


vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){ // User defined function with inputs and outputs
return a + b * cos(PI*(c*t + d));
}

void main(){
     vec2 UV = gl_FragCoord.xy / u_resolution.xy; // FragCoord pixel co-ordinates is (0,width)x(0,height); u_resulution.xy pixel co-ordinates is (width,height) -> UV pixel co-ordinates normalized to (0,1)
     UV -= 0.5; // Shift so center is (0,0); range becomes (-0.5, 0.5)
     UV *= 2.0; // Rescale UV co-ordinates so that window is (-1,1)
     UV.x *= u_resolution.x / u_resolution.y; // Ensures no stretching or distortion for different sized canvases

     vec2 UV_copy = UV;
     vec3 finalColour = vec3(0.0); // Initialize a 3-vector with all components set to 0.0

     for(float i = 0.0; i < 5.0; i++){ // Basic programming fundamentals apply
     	UV = fract(2.0 * UV) - 0.5; // Fold UV space into a repeating grid (fract) and recenter.
        float r = length(UV) * exp(-length(UV_copy)); // Radial distance, damped by the original (pre-fold) distance.
     	vec3 colour = palette(r,vec3(i,0.0,0.0),vec3(0.0,i*i,0.0),vec3(0.0,0.0,i*i*i),vec3(random_number(u_time),random_number(u_time * u_time),random_number(u_time * u_time * u_time)) + 1.5 * i + 0.5 * u_time); // RGB colour from the palette; values can exceed 1.0 (clamped to white on output), which makes the colour more vibrant

        r = abs(sin(10.0*r + 0.25*u_time)/10.0); // Turn radial distance into concentric bands (sin), take abs for positive rings, scale down
	r = pow(0.01 / r, 1.2); // Sharpen the rings: small r → large output (bright), large r → small output (dark)

        finalColour += colour * r;
     }
     
     gl_FragColor = vec4(finalColour,1.0); // Output the final color: RGB from the accumulator, alpha = 0.0 (transparent), alpha = 1.0 (opaque)
}