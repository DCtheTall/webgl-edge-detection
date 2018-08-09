interface ImageUploaderConstructorParams {
  input: HTMLInputElement;
  button: HTMLButtonElement;
  complete: (err: Error, imageUrl: string) => void;
}

export default class ImageCropper {
  private input: HTMLInputElement;
  private fileReader: FileReader;
  private image: HTMLImageElement;
  private srcCanvas: HTMLCanvasElement;
  private srcContext: CanvasRenderingContext2D;
  private dstCanvas: HTMLCanvasElement;
  private dstContext: CanvasRenderingContext2D;
  private maxFileSize: number;
  private complete: (err: Error, imageUrl: string) => void;

  constructor({
    input,
    button,
    complete,
  }: ImageUploaderConstructorParams) {
    button.addEventListener('click', this.onButtonClick.bind(this));
    this.input = input;
    this.input.addEventListener('change', this.onFileChange.bind(this));
    this.fileReader = new FileReader();
    this.fileReader.addEventListener('load', this.onFileRead.bind(this));
    this.image = new Image();
    this.image.onload = this.onImageLoad.bind(this);
    this.srcCanvas = document.createElement('canvas');
    this.srcContext = this.srcCanvas.getContext('2d');
    this.dstCanvas = document.createElement('canvas');
    this.dstContext = this.dstCanvas.getContext('2d');
    this.maxFileSize = 1e6;
    this.complete = complete;
  }

  private getNewSideLength(): number {
    let curr = Math.min(this.image.width, this.image.height);
    let pow = 0;
    while ((curr >> 1) > 0) {
      pow += 1;
      curr >>= 1;
    }
    return 1 << pow;
  }

  private onButtonClick() {
    this.input.click();
  }

  private onFileChange(event: any) { // TODO find out what is appropriate type, or if TS needs this
    const file = <File>event.target.files[0];
    const extension = file.name.split('.').pop();

    if (!file || !file.size)
      return this.complete(new Error('Image failed to upload'), null);
    if (file && file.size >= this.maxFileSize)
      return this.complete(new Error('File size cannot exceed 1MD'), null);
    if (!(<any>['png', 'jpg']).includes(extension))
      return this.complete(new Error('You must use .png or .jpg'), null);

    this.fileReader.readAsDataURL(file);
  }

  private onFileRead() {
    this.image.src = this.fileReader.result;
  }

  private onImageLoad() {
    if (Math.max(this.image.width, this.image.height) > 2048)
      return this.complete(new Error('Image cannot be greater than 2048px by 2048px'), null);
    if (Math.min(this.image.width, this.image.height) < 512)
      return this.complete(new Error('Image must be at least 512px by 512px'), null);

    const sideLength = this.getNewSideLength();
    this.srcCanvas.width = this.image.width;
    this.srcCanvas.height = this.image.height;
    this.srcContext.drawImage(this.image, 0, 0);
    this.dstCanvas.width = sideLength;
    this.dstCanvas.height = sideLength;
    this.dstContext.drawImage(
      this.srcCanvas,
      (this.image.width - sideLength) / 2,
      (this.image.height - sideLength) / 2,
      this.image.width,
      this.image.height,
      0,
      0,
      this.image.width,
      this.image.height,
    );
    this.complete(null, this.dstCanvas.toDataURL());
  }
}
