/* eslint-disable no-param-reassign */
import 'bootstrap';
import axios from 'axios';
import i18next from 'i18next';
import { differenceBy, find, uniqueId } from 'lodash';
import resources from './locales';
import validate from './validator.js';
import parse from './parser.js';
import watch from './watcher.js';

const requestInterval = 5000;

const proxify = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${url}`;

const loadRss = (url, state) => {
  state.form.processState = 'loading';

  axios.get(proxify(url), { params: { disableCache: 'true' } })
    .then(({ data }) => {
      const { feedTitle, feedDescription, postContents } = parse(data.contents);
      const feed = {
        feedTitle,
        feedDescription,
        id: uniqueId(),
        url,
      };

      const posts = postContents.map((item) => ({ ...item, feedId: feed.id, id: uniqueId() }));

      state.feeds.unshift(feed);
      state.posts.unshift(...posts);
      state.form.error = null;
      state.form.processState = 'finished';
    })
    .catch((err) => {
      if (err.message === 'Network Error') {
        state.form.processError = 'networkError';
      } else {
        state.form.error = err.message;
      }

      state.form.processState = 'failed';
      throw err;
    });
};

const updatePosts = (state) => {
  const { feeds, posts } = state;
  const feedsUrls = feeds.map((feed) => feed.url);
  const promises = feedsUrls.map((url) => axios(proxify(url), { params: { disableCache: 'true' } })
    .then(({ data }) => {
      const { postContents } = parse(data.contents);
      const feedId = find(feeds, ['url', url]).id;
      const newPosts = differenceBy(postContents, posts, 'url').map((post) => ({ ...post, feedId, id: uniqueId() }));
      state.posts.unshift(...newPosts);
    })
    .catch((err) => console.log(err)));

  Promise.all(promises).finally(() => setTimeout(() => updatePosts(state), requestInterval));
};

export default () => {
  const defaultLanguage = 'ru';

  i18next.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  }).then(() => {
    const state = {
      form: {
        processState: 'filling',
        processError: null,
        error: null,
      },
      feeds: [],
      posts: [],
      uiState: {
        viewedPosts: [],
      },
    };

    const elements = {
      form: document.querySelector('.rss-form'),
      inputElement: document.querySelector('.rss-form input'),
      submitButton: document.querySelector('.rss-form button'),
      feedbackElement: document.querySelector('.feedback'),
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),
      modalTitle: document.querySelector('#modal .modal-title'),
      modalBody: document.querySelector('#modal .modal-body'),
      modalLink: document.querySelector('#modal .full-article'),
      modalClose: document.querySelector('#modal .modal-footer .btn-secondary'),
    };

    const watchedState = watch(state, elements);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form.processState = 'loading';

      const formData = new FormData(e.target);
      const url = formData.get('url');

      const validationError = validate(url, watchedState.feeds);

      if (validationError) {
        watchedState.form.processState = 'failed';
        watchedState.form.error = validationError;
      } else {
        watchedState.form.error = null;
        loadRss(url, watchedState);
      }
    });

    setTimeout(() => updatePosts(watchedState), requestInterval);
  });
};
