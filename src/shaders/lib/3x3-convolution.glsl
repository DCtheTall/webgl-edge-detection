/**
 * 3x3 Matrix convolution
 */
float convoluteMatrices(mat3 A, mat3 B) {
  return (
    dot(A[0], B[0])
      + dot(A[1], B[1])
      + dot(A[2], B[2]));
}

#pragma glslify: export(convoluteMatrices);
