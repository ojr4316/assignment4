function generateRandomCoords() {
  const ra = Math.random() * 24;
  const dec = Math.random() * 180 - 90;

  const raHours = Math.floor(ra);
  const raMinutes = Math.floor((ra - raHours) * 60);
  const raSeconds = Math.floor((ra - raHours - raMinutes / 60) * 3600);

  const decDegrees = Math.floor(dec);
  const decMinutes = Math.floor((dec - decDegrees) * 60);
  const decSeconds = Math.floor((dec - decDegrees - decMinutes / 60) * 3600);

  return {
    ra: `${raHours}h ${raMinutes}m ${raSeconds}s`,
    dec: `${decDegrees}° ${decMinutes}' ${decSeconds}"`,
  };
}

const alignmentStars = ['Vega', 'Polaris', 'Capella', 'Rigel'];

class Ship {
  constructor() {
    let coords = generateRandomCoords();
    this.name = 'Satellite 1';
    this.velocity = Math.random() * 25000;
    this.sensorsActive = false;
    this.ra = coords.ra;
    this.dec = coords.dec;
    this.distanceFromEarth = parseFloat(Math.random() * 10000000);
    this.alignmentStar =
      alignmentStars[Math.floor(Math.random() * alignmentStars.length)];
    this.batteryLevel = Math.random() * 50 + 50;
    this.temperature = Math.random() * 50 - 100;
    this.radiation = Math.random() * 20;
  }

  toJSON() {
    return {
      name: this.name,
      velocity: Number(this.velocity).toFixed(2),
      sensorsActive: this.sensorsActive,
      ra: this.ra,
      dec: this.dec,
      distanceFromEarth: Number(this.distanceFromEarth).toFixed(2),
      alignmentStar: this.alignmentStar,
      batteryLevel: Number(this.batteryLevel).toFixed(2),
      temperature: Number(this.temperature).toFixed(2),
      radiation: Number(this.radiation).toFixed(2),
    };
  }

  travel() {
    if (this.batteryLevel > 0) {
        this.batteryLevel -= parseFloat(Math.random() * 0.05);
    }
    this.distanceFromEarth += parseFloat(Math.random() * this.velocity);
  }
}

module.exports = Ship;
