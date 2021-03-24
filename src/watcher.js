import onChange from 'on-change';
import i18next from 'i18next';
import {
  renderFeeds,
  renderPosts,
  renderErrors,
  renderProcessError,
} from './renders.js';

const processStateHandler = (processState, elements) => {
  const { inputElement, submitButton, feedbackElement } = elements;

  switch (processState) {
    case 'filling':
      submitButton.disabled = false;
      feedbackElement.textContent = '';
      break;
    case 'sending':
      submitButton.disabled = true;
      break;
    case 'finished':
      submitButton.disabled = false;
      inputElement.value = '';
      inputElement.classList.remove('is-invalid');
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = i18next.t('success');
      break;
    case 'failed':
      submitButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

const watch = (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        processStateHandler(value, elements);
        break;
      case 'form.processError':
        renderProcessError(state, elements);
        break;
      case 'form.error':
        renderErrors(state, elements);
        break;
      case 'feeds':
        renderFeeds(state, elements);
        break;
      case 'posts':
        renderPosts(state, elements);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export default watch;
