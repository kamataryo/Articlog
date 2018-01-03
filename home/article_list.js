class ArticleList {
  constructor() {
    ajax('url.txt').then(this.onResolveArticleList, this.onRejected);
  }
  onResolveArticleList(url_txt) {
    let begin = 0;
    let end   = 0;
    let url = [];
    let title = [];
    while (-1 != (end = url_txt.indexOf(' ', begin) ) ) {
      url.push( url_txt.substring(begin, end) );
      begin = end + 1;
      end = url_txt.indexOf(' ', begin);
      begin = end + 1;
      end = url_txt.indexOf('\n', begin);
      title.push( url_txt.substring(begin, end) );
      begin = end + 1;
    }

    let article_list_div = document.getElementById('article-list');
    article_list_div.innerHTML = '';
    for (let v = 0; v < url.length; ++v) {
        article_list_div.innerHTML += '<a href="' + url[v]+ '">' + title[v] + '</a><br>';
    }
  }
  onRejected(err) {
    alert(err);
  }
};
let article_list = new ArticleList();