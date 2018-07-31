![Edge detection photo](/public/edge-photo.png?raw=true "Edge detection photo")

# webgl-edge-detection
Edge detection in images and video with WebGL using Canny edge detection.
---

[Live demo](https://dcthetall-edge-detection.herokuapp.com/)

### Algorithm
This program uses Canny edge detection on images and video in real time.
The algorithm is broken into the following steps:

1. Apply a 5-pixel Gaussian blur to the image. This program uses the open source library
[glsl-fast-gaussian-blur](https://github.com/Jam3/glsl-fast-gaussian-blur).

2. Calculate the texture intensity gradient.
It calculates intensity values in [0, 1],
0 being true black, 1 being true white.
It measures how it changes with respect to each
component of the UV coordinates of the texture.
This is done using a simple linear approximation. 

3. Round the gradient to 1 of the 8 cardinal directions.
This is done by seeing which direction has the highest
dot product with the gradient vector.

4. Suppress any gradient that is not a local maximum in
the direction the vector points.

5. Apply a double threshold to the gradient vector to classify
each pixel as not an edge, a weak edge, or a strong edge.

6. Apply hysteresis to the existing weak edges. If a weak
edge does not neighbor a strong edge, then it is likely
due to noise, so we consider it to not be an edge. If a weak
edge does neighbor a strong edge, then consider it a strong
edge as well.
