export function lightenColor(colorHex: string) {
  // Convert hexadecimal color string to decimal RGB values
  const rgb = {
    r: parseInt(colorHex.substring(1, 3), 16),
    g: parseInt(colorHex.substring(3, 5), 16),
    b: parseInt(colorHex.substring(5, 7), 16),
  };

  // Lighten each RGB component
  const lightenFactor = 0.8; // Adjust as needed
  const lightenedRGB = {
    r: Math.min(255, rgb.r + lightenFactor * (255 - rgb.r)),
    g: Math.min(255, rgb.g + lightenFactor * (255 - rgb.g)),
    b: Math.min(255, rgb.b + lightenFactor * (255 - rgb.b)),
  };

  // Convert decimal RGB values back to hexadecimal color string
  const lightenedColor = `#${Math.round(lightenedRGB.r).toString(16).padStart(2, "0")}${Math.round(lightenedRGB.g).toString(16).padStart(2, "0")}${Math.round(lightenedRGB.b).toString(16).padStart(2, "0")}`;

  return lightenedColor;
}
