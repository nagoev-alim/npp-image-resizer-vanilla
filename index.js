// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='image-resizer'>
    <h2 class='title'>Image Resizer</h2>
    <div class='resizer'>

      <div class='container' data-upload=''>
        <input type='file' accept='image/*' class='visually-hidden' data-upload-input=''>
        ${feather.icons.image.toSvg({ width: 48, height: 48 })}
        <img class='visually-hidden' src='#' alt='image' data-image=''>
        <p class='h5'>Browse File to Upload</p>
      </div>

      <div class='content'>
        <label>
          <span>Width</span>
          <input type='number' data-width=''>
        </label>
        <label>
          <span>Height</span>
          <input type='number' data-height=''>
        </label>
        <label>
          <input class='visually-hidden' type='checkbox' data-ratio='' checked>
          <span class='checkbox'></span>
          <span>Lock aspect ratio</span>
        </label>
        <label>
          <input class='visually-hidden' type='checkbox' data-quality=''>
          <span class='checkbox'></span>
          <span>Reduce quality</span>
        </label>
        <button data-download=''>Download Image</button>
      </div>

    </div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      upload: document.querySelector('[data-upload]'),
      uploadImg: document.querySelector('[data-image]'),
      inputUpload: document.querySelector('[data-upload-input]'),
      inputWidth: document.querySelector('[data-width]'),
      inputHeight: document.querySelector('[data-height]'),
      inputRatio: document.querySelector('[data-ratio]'),
      inputQuality: document.querySelector('[data-quality]'),
      btnDownload: document.querySelector('[data-download]'),
    };

    this.PROPS = {
      imageRatio: null,
    };

    this.DOM.upload.addEventListener('click', () => this.DOM.inputUpload.click());
    this.DOM.inputUpload.addEventListener('change', this.loadFile);
    this.DOM.btnDownload.addEventListener('click', this.onDownload);
    this.DOM.inputWidth.addEventListener('keyup', this.onKeyUp);
    this.DOM.inputHeight.addEventListener('keyup', this.onKeyUp);
  }

  /**
   * @function loadFile - Load file event handler
   * @param files
   */
  loadFile = ({ target: { files } }) => {
    const file = files[0];
    if (!file) return;

    this.DOM.uploadImg.classList.remove('visually-hidden');
    this.DOM.uploadImg.src = URL.createObjectURL(file);

    this.DOM.uploadImg.addEventListener('load', () => {
      this.DOM.inputWidth.value = this.DOM.uploadImg.naturalWidth;
      this.DOM.inputHeight.value = this.DOM.uploadImg.naturalHeight;
      this.PROPS.imageRatio = this.DOM.uploadImg.naturalWidth / this.DOM.uploadImg.naturalHeight;
      this.DOM.upload.parentElement.classList.add('is-active');
    });
  };

  /**
   * @function onDownload - Resize and download image
   */
  onDownload = () => {
    this.DOM.btnDownload.textContent = 'Downloading...';

    const canvas = document.createElement('canvas');
    const a = document.createElement('a');
    const ctx = canvas.getContext('2d');
    const imgQuality = this.DOM.inputQuality.checked ? 0.6 : 1.0;

    canvas.width = this.DOM.inputWidth.value;
    canvas.height = this.DOM.inputHeight.value;

    setTimeout(() => {
      ctx.drawImage(this.DOM.upload.querySelector('img'), 0, 0, canvas.width, canvas.height);
      a.href = canvas.toDataURL('image/jpeg', imgQuality);
      a.download = new Date().getTime();
      a.click();

      this.DOM.btnDownload.textContent = 'Download Image'
      showNotification('success', 'Image successfully downloaded')
    }, 1000);
  };

  /**
   * @function onKeyUp - Inputs keyup event handler
   * @param target
   */
  onKeyUp = ({ target }) => {
    if (target.matches('[data-width="')) {
      this.DOM.inputHeight.value = Math.floor(this.DOM.inputRatio.checked ? this.DOM.inputWidth.value / this.PROPS.imageRatio : this.DOM.inputHeight.value);
    }
    if (target.matches('[data-height="')) {
      this.DOM.inputWidth.value = Math.floor(this.DOM.inputRatio.checked ? this.DOM.inputHeight.value * this.PROPS.imageRatio : this.DOM.inputWidth.value);
    }
  };
}

// ⚡️Class instance
new App();
