const domParser = new DOMParser();

const parse = (rssData) => {
  const parsedRssData = domParser.parseFromString(rssData, 'application/xml');
  const error = parsedRssData.querySelector('parsererror');

  if (error) throw new Error('invalidRSS');

  const feedTitleElement = parsedRssData.querySelector('channel > title');
  const feedDescriptionElement = parsedRssData.querySelector('channel > description');
  const feedTitle = feedTitleElement.textContent;
  const feedDescription = feedDescriptionElement.textContent;

  const getPostContent = (item) => {
    const postTitleElement = item.querySelector('title');
    const postLinkElement = item.querySelector('link');
    const postTitle = postTitleElement.textContent;
    const url = postLinkElement.textContent;

    return { postTitle, url };
  };

  const postElements = parsedRssData.querySelectorAll('item');
  const postContents = [...postElements].map(getPostContent);

  return { feedTitle, feedDescription, postContents };
};

export default parse;
