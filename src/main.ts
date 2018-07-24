import Scene from './lib/Scene';

(function main() {
  const image = <HTMLImageElement>document.getElementById('test-image');
  image.onload = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const scene = new Scene(canvas);
    scene.setTexture(image);
    scene.render();
  }
})();
