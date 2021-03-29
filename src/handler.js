const processStateHandler = (processState, elements) => {
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
      feedbackElement.textContent = '';
      feedbackElement.classList.remove('text-danger');
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
