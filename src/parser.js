const domParser = new DOMParser();

const parse = (rssData) => {
  const parsedRssData = domParser.parseFromString(rssData, 'application/xml');
  const error = parsedRssData.querySelector('parsererror');

  if (error) throw new Error('invalidRss');

  const feedTitleElement = parsedRssData.querySelector('channel > title');
  const feedDescriptionElement = parsedRssData.querySelector('channel > description');
  const feedTitle = feedTitleElement.textContent;
  const feedDescription = feedDescriptionElement.textContent;

  const getPostContent = (item) => {
    const postTitleElement = item.querySelector('title');
    const postDescriptionElement = item.querySelector('description');
    const postLinkElement = item.querySelector('link');
    const postTitle = postTitleElement.textContent;
    const postDescription = postDescriptionElement.textContent;
    const url = postLinkElement.textContent;

    return { postTitle, postDescription, url };
  };

  const postElements = parsedRssData.querySelectorAll('item');
  const postContents = [...postElements].map(getPostContent);

  return { feedTitle, feedDescription, postContents };
};

export default parse;
