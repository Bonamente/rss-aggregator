/* eslint-disable no-param-reassign */
import 'bootstrap';
import axios from 'axios';
import i18next from 'i18next';
import {
  differenceBy,
  find,
  isNull,
  uniqueId,
} from 'lodash';
import parse from './parser.js';
import resources from './locales';
import validate from './validator.js';
import watch from './watcher.js';

const requestInterval = 300000;

const proxify = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

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
      state.form.processError = null;
      state.form.processState = 'finished';
    })
    .catch((err) => {
      if (err.message === 'Network Error' || err.message === 'no internet') {
        state.form.processError = 'networkError';
      } else {
        state.form.error = err.message;
      }

      state.form.processState = 'failed';
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
  const i18nextInstance = i18next.createInstance();

  return i18nextInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  }).then(() => {
    const state = {
      lng: defaultLanguage,
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
      lngToggler: document.querySelector('#lngDropdownMenuButton'),
      lngDropdownMenu: document.querySelector('#lngDropdownMenu'),
      mainHeading: document.querySelector('h1.main-heading'),
      example: document.querySelector('p.example-link'),
      lead: document.querySelector('.lead'),
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

    const watchedState = watch(state, elements, i18nextInstance);

    elements.lngDropdownMenu.addEventListener('click', (e) => {
      watchedState.lng = e.target.textContent;
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form.processState = 'loading';

      const formData = new FormData(e.target);
      const url = formData.get('url');

      const validationError = validate(url, watchedState.feeds);

      if (isNull(validationError)) {
        watchedState.form.error = null;
        loadRss(url, watchedState);
      } else {
        watchedState.form.processState = 'failed';
        watchedState.form.error = validationError;
      }
    });

    setTimeout(() => updatePosts(watchedState), requestInterval);
  });
};
