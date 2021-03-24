import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'invalidUrl',
  },
  mixed: {
    notOneOf: 'alreadyExists',
  },
});

const validate = (url, feeds) => {
  const urls = feeds.map((feed) => feed.url);
  const schema = yup.string().url().required().notOneOf(urls);

  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.message;
  }
};

export default validate;
