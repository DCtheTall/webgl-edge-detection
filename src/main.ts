import Scene from './lib/Scene';
import ImageCropper from './lib/ImageCropper';

let strongThresholdSlider: HTMLInputElement;
let weakThresholdSlider: HTMLInputElement;

function setWeakThresholdLabel(value: number) {
  const label = <HTMLDivElement>document.getElementById('weak-threshold-label');
  label.innerHTML = `Weak threshold: ${value}`;
}

function setStrongThresholdLabel(value: number) {
  const label = <HTMLDivElement>document.getElementById('strong-threshold-label');
  label.innerHTML = `Strong threshold: ${value}`;
}

function handleWeakThresholdChange(scene: Scene, value: number, render: boolean = true) {
  scene.setWeakThreshold(value);
  setWeakThresholdLabel(value);
  if (render) scene.render();
}

function handleStrongThresholdChange(scene: Scene, value: number) {
  scene.setStrongThreshold(value);
  setStrongThresholdLabel(value);
  weakThresholdSlider.setAttribute('max', String(value));
  weakThresholdSlider.value = String(value / 2);
  handleWeakThresholdChange(scene, value / 2, false);
  scene.render();
}

function renderScene(image: HTMLImageElement, scene: Scene): void {
  scene.shader.setUniformData('uResolution', [image.width, image.height]);
  scene.setTexture(image);
  scene.render();
}

(async function main(): Promise<void> {
  const image = <HTMLImageElement>document.getElementById('test-image');
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const errorText = <HTMLDivElement>document.getElementById('error-text');
  const imageCropper = new ImageCropper({
    button: <HTMLButtonElement>document.getElementById('upload-image-button'),
    input: <HTMLInputElement>document.getElementById('file-input'),
    maxFileSize: 1e6,
    complete(err: Error, imageUrl: string) {
      if (err) {
        let msg = err.message;
        errorText.innerHTML = msg;
        setTimeout(() =>
          errorText.innerHTML === msg ?
            errorText.innerHTML  = ''
            : null, 5e3);
      }
      else image.src = imageUrl;
    },
  });
  const scene = new Scene({
    canvas,
    strongEdgeThreshold: 80,
    weakEdgeThreshold: 30,
  });
  strongThresholdSlider =
    <HTMLInputElement>document.getElementById('strong-threshold-slider');
  weakThresholdSlider =
    <HTMLInputElement>document.getElementById('weak-threshold-slider');

  image.onload = renderScene.bind(null, image, scene);
  strongThresholdSlider.addEventListener(
    'change', (e: any) => handleStrongThresholdChange(scene, e.target.value));
  weakThresholdSlider.addEventListener(
    'change', (e: any) => handleWeakThresholdChange(scene, e.target.value));
})();
