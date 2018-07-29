import Scene from './lib/Scene';
import ImageCropper from './lib/ImageCropper';

function renderScene(image: HTMLImageElement, scene: Scene): void {
  scene.setTexture(image);
  scene.render();
}

(function main(): void {
  const image = <HTMLImageElement>document.getElementById('test-image');
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const scene = new Scene(canvas);
  const imageCropper = new ImageCropper({
    button: <HTMLButtonElement>document.getElementById('upload-image-button'),
    input: <HTMLInputElement>document.getElementById('file-input'),
    complete(err: Error, imageUrl: string) {
      if (err) console.error(err);
      else image.src = imageUrl;
    },
  });
  image.onload = renderScene.bind(null, image, scene);
})();
