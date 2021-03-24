/* eslint-disable no-param-reassign */
import 'bootstrap';
import axios from 'axios';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import en from './locales/en.js';
import validate from './validator';
import parse from './parser.js';
import watch from './watcher.js';

const proxify = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${url}`;

const loadRss = (url, state) => {
  state.form.processState = 'sending';

  axios.get(proxify(url), { params: { disableCache: 'true' } })
    .then(({ data }) => {
      const { feedTitle, feedDescription, postContents } = parse(data.contents);
      const feed = {
        url,
        feedTitle,
        feedDescription,
        id: uniqueId(),
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

export default () => {
  i18next.init({
    lng: 'en',
    debug: false,
    resources: {
      en,
    },
  }).then(() => {
    const state = {
      form: {
        processState: 'filling',
        processError: null,
        error: null,
      },
      feeds: [],
      posts: [],
    };

    const elements = {
      form: document.querySelector('.rss-form'),
      inputElement: document.querySelector('.rss-form input'),
      submitButton: document.querySelector('.rss-form button'),
      feedbackElement: document.querySelector('.feedback'),
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),
    };

    const watchedState = watch(state, elements);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form.processState = 'sending';

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
  });
};
