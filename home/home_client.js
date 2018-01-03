var saveText = 'ここに記事を書いて下さい';
class Home {
  constructor(url_txt) {
    this.url_txt = url_txt;
  } 
  home() {
    location.href = '/home';
  }
  init_write_article() {
    this.change('write_article.html');
  }
  init_article_list() {
    let iframe = document.getElementById('iframe');
    iframe.style.visibility = 'hidden';
    let article = document.getElementById('article');
    article.style.visibility = 'visible';
    iframe.style.width = '0px';
    article.style.width = '100%';
    ajax('blog/url.txt').then(onResolveArticleList, onRejected);
  }
  article_list(url_txt) {
    this.read_url_txt(url_txt);
    var article = document.getElementById('article');
    article.innerHTML = '';
    for (let v = 0; v < this.url.length; ++v) {
      article.innerHTML += '<a href="' + this.url[v]+ '">' + this.title[v] + '</a><br>';
    }
  }
  image_upload() {
    this.change('image_upload.html');
  }
  setting() {
    this.change('setting.html');
  }
  plugin() {
    this.change('plugin.html');
  }
  change(file) {
    let iframe = document.getElementById('iframe');
    iframe.src = file;
    iframe.style.visibility = 'visible';
    let article = document.getElementById('article');
    article.style.visibility = 'hidden';
    iframe.style.width = '100%';
    article.style.width = '0px';
    article.innerHTML = '';
  }
  read_url_txt(url_txt) {
    let begin = 0;
    let end   = 0;
    this.url = [];
    this.title = [];
    while (-1 != (end = url_txt.indexOf(' ', begin) ) ) {
      this.url.push( url_txt.substring(begin, end) );
      begin = end + 1;
      end = url_txt.indexOf(' ', begin);
      begin = end + 1;
      end = url_txt.indexOf('\n', begin);
      this.title.push( url_txt.substring(begin, end) );
      begin = end + 1;
    }
  }
};
var home;

home = new Home(ajax('blog/url.txt').then(onResolve, onRejected));
function onResolveWriteArticle(response) {
  home.write_article(response);
}
function onResolveArticleList(response) {
  home.article_list(response);
}
function onResolve(response) {
  return response;
}
function onRejected(err) {
  alert(err);
}