import Scene from './lib/Scene';
import ImageCropper from './lib/ImageCropper';

let image: HTMLImageElement;
let video: HTMLVideoElement;
let errorText: HTMLDivElement;
let strongThresholdSlider: HTMLInputElement;
let weakThresholdSlider: HTMLInputElement;
let imageUploadController: HTMLDivElement;
let toggleVideoButton: HTMLButtonElement;
let localStream: MediaStream;
let toggleEdgeDetectionInput: HTMLInputElement;

function addError(msg: string) {
  errorText.innerHTML = msg;
  setTimeout(() =>
    errorText.innerHTML === msg ?
      errorText.innerHTML = ''
      : null, 5e3);
}

function setWeakThresholdLabel(value: number) {
  const label = <HTMLDivElement>document.getElementById('weak-threshold-label');
  label.innerHTML = `Weak threshold: ${value}`;
}

function setStrongThresholdLabel(value: number) {
  const label = <HTMLDivElement>document.getElementById('strong-threshold-label');
  label.innerHTML = `Strong threshold: ${value}`;
}

function handleWeakThresholdChange(scene: Scene, value: number, render: boolean = true) {
  const normalizedValue = value / 100;
  scene.setWeakThreshold(normalizedValue);
  setWeakThresholdLabel(normalizedValue);
  if (render) scene.render();
}

function handleStrongThresholdChange(scene: Scene, value: number) {
  const normalizedValue = value / 100;
  scene.setStrongThreshold(normalizedValue);
  setStrongThresholdLabel(normalizedValue);
  weakThresholdSlider.setAttribute('max', String(value));
  weakThresholdSlider.value = String(value / 2);
  handleWeakThresholdChange(scene, value / 2, false);
  scene.render();
}

function renderSceneWithImage(scene: Scene) {
  scene.shader.setUniformData('uResolution', [image.width, image.height]);
  scene.setImageTexture(image);
  scene.render();
}

function renderSceneWithVideo(scene: Scene) {
  scene.shader.setUniformData('uResolution', [video.width, video.height]);
  scene.render();
  window.requestAnimationFrame(renderSceneWithVideo.bind(null, scene));
}

function handleEdgeDetectionToggle(scene: Scene, e: any) {
  scene.shader.setUniformData('uUseEdgeDetection', Number(e.target.checked));
  if (!scene.usingVideo) renderSceneWithImage(scene);
}

async function handleToggleVideo(scene: Scene): Promise<void> {
  if (scene.usingVideo) {
    imageUploadController.style.display = 'block';
    toggleVideoButton.innerHTML = 'Use webcam';
    localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    localStream = null;
    video.srcObject = null;
    window.cancelAnimationFrame(0);
    renderSceneWithImage(scene);
  } else {
    try {
      localStream =
        await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      imageUploadController.style.display = 'none';
      toggleVideoButton.innerHTML = 'Use image';
      video.srcObject = localStream;
      video.play();
      video.addEventListener('playing', () => {
        scene.setVideoTexture(video);
        renderSceneWithVideo(scene);
      });
    } catch (err) {
      addError(
        'Failed to start start webcam, make sure you allow this site to use your camera.');
    }
  }
  scene.render();
}

(async function main(): Promise<void> {
  image = <HTMLImageElement>document.getElementById('image');
  video = <HTMLVideoElement>document.getElementById('video');
  errorText = <HTMLDivElement>document.getElementById('error-text');

  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const imageCropper = new ImageCropper({
    button: <HTMLButtonElement>document.getElementById('upload-image-button'),
    input: <HTMLInputElement>document.getElementById('file-input'),
    maxFileSize: 1e6,
    complete(err: Error, imageUrl: string) {
      if (err) {
        addError(err.message);
      }
      else image.src = imageUrl;
    },
  });
  const scene = new Scene({
    canvas,
    strongEdgeThreshold: .3,
    weakEdgeThreshold: .15,
  });

  strongThresholdSlider =
    <HTMLInputElement>document.getElementById('strong-threshold-slider');
  weakThresholdSlider =
    <HTMLInputElement>document.getElementById('weak-threshold-slider');
  imageUploadController =
    <HTMLDivElement>document.getElementById('image-upload');
  toggleVideoButton =
    <HTMLButtonElement>document.getElementById('toggle-video');
  toggleEdgeDetectionInput =
    <HTMLInputElement>document.getElementById('toggle-edge-detection');

  image.onload = renderSceneWithImage.bind(null, scene);
  strongThresholdSlider.addEventListener(
    'change', (e: any) => handleStrongThresholdChange(scene, e.target.value));
  weakThresholdSlider.addEventListener(
    'change', (e: any) => handleWeakThresholdChange(scene, e.target.value));
  toggleVideoButton.addEventListener(
    'click', handleToggleVideo.bind(null, scene));
  toggleEdgeDetectionInput.addEventListener(
    'change', handleEdgeDetectionToggle.bind(null, scene));
})();
