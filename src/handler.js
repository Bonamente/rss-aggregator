import { renderLoadingSpinner } from './renders.js';

const processStateHandler = (processState, elements, i18next) => {
  const { feedbackElement, inputElement, submitButton } = elements;
  switch (processState) {
    case 'filling':
      inputElement.readOnly = false;
      submitButton.disabled = false;
      feedbackElement.textContent = '';
      break;
    case 'loading':
      inputElement.readOnly = true;
      submitButton.disabled = true;
      renderLoadingSpinner(elements, i18next);
      break;
    case 'finished':
      inputElement.readOnly = false;
      submitButton.disabled = false;
      submitButton.innerHTML = '';
      submitButton.textContent = i18next.t('form.submitButton');
      inputElement.value = '';
      inputElement.classList.remove('is-invalid');
      feedbackElement.textContent = '';
      feedbackElement.classList.remove('text-danger');
      break;
    case 'failed':
      inputElement.readOnly = false;
      submitButton.disabled = false;
      submitButton.innerHTML = '';
      submitButton.textContent = i18next.t('form.submitButton');
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

export default processStateHandler;
