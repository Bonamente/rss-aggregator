import onChange from 'on-change';
import processStateHandler from './handler.js';
import {
  renderFeeds,
  renderPosts,
  renderErrors,
  renderProcessError,
} from './renders.js';

const watch = (state, elements, i18next) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        processStateHandler(value, elements, i18next);
        break;
      case 'form.processError':
        renderProcessError(state, elements, i18next);
        break;
      case 'form.error':
        renderErrors(state, elements, i18next);
        break;
      case 'feeds':
        renderFeeds(state, elements, i18next);
        break;
      case 'posts':
        renderPosts(state, elements, i18next);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export default watch;
