import Scene from './lib/Scene';

(function main() {
  const testImage = <HTMLImageElement>document.getElementById('test-image');
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const scene = new Scene(canvas);
})();
