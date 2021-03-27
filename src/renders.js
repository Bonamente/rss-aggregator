import i18next from 'i18next';

const makePostViewed = (uiState, postId) => {
  const { viewedPosts } = uiState;

  if (viewedPosts.includes(postId)) return;

  const link = document.querySelector(`a[data-id="${postId}"]`);
  link.classList.remove('font-weight-bold');
  link.classList.add('font-weight-normal');

  uiState.viewedPosts.push(postId);
};

const showModal = (uiState, elements, posts, postId) => {
  const {
    modalTitle,
    modalBody,
    modalLink,
    modalClose,
  } = elements;

  const post = posts.find((el) => el.id === postId);
  const { postTitle, postDescription, url } = post;

  makePostViewed(uiState, postId);

  modalTitle.textContent = postTitle;
  modalBody.textContent = postDescription;
  modalLink.setAttribute('href', url);
  modalLink.textContent = i18next.t('buttons.modalLink');
  modalClose.textContent = i18next.t('buttons.modalClose');
};

const buildPostElement = (state, elements, post) => {
  const { uiState, posts } = state;
  const { viewedPosts } = uiState;
  const { postTitle, url, id } = post;

  const postElement = document.createElement('li');
  const link = document.createElement('a');
  const button = document.createElement('button');

  link.setAttribute('href', url);
  link.dataset.id = id;
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = postTitle;
  link.addEventListener('click', () => makePostViewed(uiState, id));

  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.dataset.id = id;
  button.dataset.toggle = 'modal';
  button.dataset.target = '#modal';
  button.textContent = i18next.t('buttons.postPreview');
  button.addEventListener('click', () => showModal(uiState, elements, posts, id));

  if (viewedPosts.includes(id)) {
    link.classList.add('font-weight-normal');
  } else {
    link.classList.add('font-weight-bold');
  }

  postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  postElement.append(link, button);

  return postElement;
};

const buildFeedElement = (feed) => {
  const { feedTitle, feedDescription } = feed;

  const feedElement = document.createElement('li');
  const feedTitleElement = document.createElement('h3');
  const feedDescriptionElement = document.createElement('p');

  feedTitleElement.textContent = feedTitle;
  feedDescriptionElement.textContent = feedDescription;

  feedElement.classList.add('list-group-item');
  feedElement.append(feedTitleElement, feedDescriptionElement);

  return feedElement;
};

export const renderFeeds = (state, elements) => {
  const { feeds } = state;
  const { feedsContainer } = elements;

  feedsContainer.innerHTML = '';

  const feedsHeading = document.createElement('h2');
  const feedsList = document.createElement('ul');
  const feedsListContent = feeds.map(buildFeedElement);

  feedsHeading.textContent = i18next.t('headings.feeds');
  feedsList.classList.add('list-group', 'mb-5');
  feedsList.append(...feedsListContent);
  feedsContainer.append(feedsHeading, feedsList);
};

export const renderPosts = (state, elements) => {
  const { posts } = state;
  const { postsContainer } = elements;

  postsContainer.innerHTML = '';

  const postsHeading = document.createElement('h2');
  const postsList = document.createElement('ul');
  const postsListContent = posts.map((post) => buildPostElement(state, elements, post));

  postsHeading.textContent = i18next.t('headings.posts');
  postsList.classList.add('list-group');
  postsList.append(...postsListContent);
  postsContainer.append(postsHeading, postsList);
};

export const renderErrors = (state, elements) => {
  const { error } = state.form;

  if (!error) return;

  const { inputElement, feedbackElement } = elements;
  inputElement.classList.add('is-invalid');
  feedbackElement.classList.remove('text-success');
  feedbackElement.classList.add('text-danger');
  feedbackElement.textContent = i18next.t(`errors.${error}`);
};

export const renderProcessError = (state, elements) => {
  const { processError } = state.form;

  if (!processError) return;

  const { feedbackElement } = elements;
  feedbackElement.classList.remove('text-success');
  feedbackElement.classList.add('text-danger');
  feedbackElement.textContent = i18next.t('errors.networkError');
  console.log(feedbackElement);
};
