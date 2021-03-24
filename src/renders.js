import i18next from 'i18next';

const buildFeedElement = (feed) => {
  const { feedTitle, feedDescription } = feed;
  return `<li class="list-group-item"><h3>${feedTitle}</h3><p>${feedDescription}</p></li>`;
};

const buildPostElement = (post) => {
  const { postTitle, url, id } = post;
  return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <a href="${url}" class="font-weight-bold" data-id="${id}" target="_blank" rel="noopener noreferrer">${postTitle}</a>    
  </li>`;
};

export const renderFeeds = (state, elements) => {
  const { feeds } = state;
  const { feedsContainer } = elements;

  feedsContainer.innerHTML = '';

  const feedsHeading = document.createElement('h2');
  const feedsList = document.createElement('ul');
  const feedsListContent = feeds.map(buildFeedElement).join('');

  feedsHeading.textContent = i18next.t('headings.feeds');
  feedsList.classList.add('list-group', 'mb-5');
  feedsList.innerHTML = feedsListContent;
  feedsContainer.append(feedsHeading, feedsList);
};

export const renderPosts = (state, elements) => {
  const { posts } = state;
  const { postsContainer } = elements;

  postsContainer.innerHTML = '';

  const postsHeading = document.createElement('h2');
  const postsList = document.createElement('ul');
  const postsListContent = posts.map(buildPostElement).join('');

  postsHeading.textContent = i18next.t('headings.posts');
  postsList.classList.add('list-group');
  postsList.innerHTML = postsListContent;
  postsContainer.append(postsHeading, postsList);
};

export const renderErrors = (state, elements) => {
  const { error } = state.form;

  if (!error) return;

  const { inputElement, feedbackElement } = elements;
  inputElement.classList.add('is-invalid');
  feedbackElement.classList.add('text-danger');
  feedbackElement.textContent = i18next.t(`errors.${error}`);
};

export const renderProcessError = (state, elements) => {
  const { processError } = state.form;

  if (!processError) return;

  const { feedbackElement } = elements;
  feedbackElement.classList.add('text-danger');
  feedbackElement.textContent = i18next.t(`errors.${processError}`);
};
