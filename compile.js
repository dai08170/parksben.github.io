const fs = require('fs');
const path = require('path');

const postDir = 'src/posts/';
const allPost = fs
  .readdirSync(path.resolve(postDir))
  .filter(d => /^\d{4}-/gi.test(d));

const postData = allPost.map(p => {
  const article = fs.readFileSync(
    path.resolve(`${postDir}${p}/article.md`),
    'utf-8'
  );
  const titleHandler = /标题(:|：).+\n/gi.exec(article);
  const tagHandler = /标签(:|：).+\n/gi.exec(article);
  const contentHandler = article.split(/={3}\n/gi);

  const title = titleHandler.length
    ? titleHandler[0].replace(/(标题(:|：)\s*|\n)/gi, '')
    : '';
  const tag = tagHandler.length
    ? tagHandler[0].replace(/(标签(:|：)\s*|\n)/gi, '').split(/,\s?/gi)
    : '';
  const content = contentHandler.length
    ? contentHandler[contentHandler.length - 1].replace('\n', '')
    : '';
  const time = p.split('_')[0].replace('T', ' ');

  return {
    title,
    tag,
    time,
    url: `/post/${p}`,
    thumb: `posts/${p}/thumb.jpg`,
    content,
  };
});

fs.writeFileSync(
  path.join(path.resolve('src/posts'), 'data.json'),
  JSON.stringify(postData),
  'utf-8'
);

console.log('文章打包完毕...');