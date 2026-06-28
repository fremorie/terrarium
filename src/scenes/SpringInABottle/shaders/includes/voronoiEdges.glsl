// Hash a cell coordinate to a pseudo-random 2D point inside that cell
vec2 hashCell(vec2 cell) {
    vec2 random = vec2(
        dot(cell, vec2(127.1, 311.7)),
        dot(cell, vec2(269.5, 183.3))
    );
    return fract(sin(random) * 43758.5453);
}

// Voronoi: returns x = distance to nearest feature point (F1),
//          y = distance to second nearest (F2)
vec2 voronoi(vec2 position) {
    vec2 baseCell = floor(position);
    vec2 localPosition = fract(position);

    float nearestDistance = 8.0;
    float secondNearestDistance = 8.0;

    for (int offsetY = -1; offsetY <= 1; offsetY++) {
        for (int offsetX = -1; offsetX <= 1; offsetX++) {
            vec2 neighborCell = vec2(float(offsetX), float(offsetY));
            vec2 featurePoint = neighborCell + hashCell(baseCell + neighborCell);
            float distanceToFeature = length(featurePoint - localPosition);

            if (distanceToFeature < nearestDistance) {
                secondNearestDistance = nearestDistance;
                nearestDistance = distanceToFeature;
            } else if (distanceToFeature < secondNearestDistance) {
                secondNearestDistance = distanceToFeature;
            }
        }
    }

    return vec2(nearestDistance, secondNearestDistance);
}
