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
      break;
    case 'finished':
      inputElement.readOnly = false;
      submitButton.disabled = false;
      inputElement.value = '';
      inputElement.classList.remove('is-invalid');
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = i18next.t('success');
      break;
    case 'failed':
      inputElement.readOnly = false;
      submitButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

export default processStateHandler;
