export const getDescByCity = (city, destinations) => destinations.find((destination) => destination.name === city).description;
export const getPhotosByCity = (city, destinations) => destinations.find((destination) => destination.name === city).pictures;
export const getQuotientWithoutRemainder = (val, by) => (val - val % by) / by;
