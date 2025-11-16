precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform sampler2D tMap;
uniform float uBorderThickness;
uniform vec3 uBorderColor;
uniform float uPadding;
uniform float uCornerRadius;

varying vec2 vUv;

// Signed distance function for a rounded rectangle
float roundedRectSDF(vec2 uv, vec2 size, float radius) {
  vec2 d = abs(uv - 0.5) - (size * 0.5 - radius);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}

void main() {
  // Calculate aspect ratio to maintain image proportions
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  // Adjust UVs for aspect ratio
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // Apply padding by scaling UVs inward
  vec2 paddedUv = (uv - 0.5) * (1.0 - 2.0 * uPadding) + 0.5;

  // Calculate SDF for the rounded rectangle (image area)
  vec2 size = vec2(1.0 - 2.0 * uPadding, 1.0 - 2.0 * uPadding);
  float sdf = roundedRectSDF(paddedUv, size, uCornerRadius);

  // Calculate SDF for the border (slightly larger area)
  float borderSdf = roundedRectSDF(paddedUv, size + uBorderThickness * 2.0, uCornerRadius + uBorderThickness);

  // Determine if we're in the image, border, or outside
  if (sdf <= 0.0) {
    // Inside the image area
    vec2 textureUv = (paddedUv - uPadding) / (1.0 - 2.0 * uPadding);
    gl_FragColor = texture2D(tMap, textureUv);
  } else if (borderSdf <= 0.0) {
    // Inside the border area
    gl_FragColor = vec4(uBorderColor, 1.0);
  } else {
    // Outside the border
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}