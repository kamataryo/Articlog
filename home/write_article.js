let edit_text;
let titleFlag = false;
let urlFlag = false;
let publishFlag = false;
class WriteArticle {
  constructor(text) {
    ajax('blog/edit_article.html').then(this.onResolve, this.onRejected);
  }
  onResolve(response) {
    let textarea = document.getElementById('textarea');
    textarea.innerHTML = response;
    edit_text = response;

    ajax('blog/url.txt').then(WriteArticle.onResolveURL, WriteArticle.onRejected);

    document.getElementById("textarea").addEventListener('keyup',function(){
      let preview_button = document.getElementById('preview-button');
      preview_button.style.background = 'gray';
    });
  }
  static onResolveURL(response) {
    let publish_button = document.getElementById('publish-button');
    publish_button.style.background = 'gray';

    let text = WriteArticle.read_url_txt(response);
    document.getElementById("link").addEventListener('keyup',function(){
      var display = document.getElementById('link-display');
      for (let w = 0; w < text.url.length; ++w) {
        if (document.getElementById("link").value == text.url[w] ) {
          let pos = 0;
          for (var v = 0; v < 10; ++v) {
           pos = text.url[w].indexOf('' + v, text.url[w].length - 2);
           if (pos >= text.url[w].length - 2) { break; }
          }
          let number = '';
          if (pos > 0) {
            number = text.url[w].substring(pos, text.url[w].length);
            display.innerHTML = 'すでに存在するリンク名です。';
            display.innerHTML += text.url[w].substring(0, pos) + (Number(number) + 1);
            display.innerHTML += 'というリンク名はどうでしょうか？';
          } else {
            display.innerHTML = 'すでに存在するリンク名です。';
            display.innerHTML += text.url[w] + '2';
            display.innerHTML += 'というリンク名はどうでしょうか？';
          }
          let publish_button = document.getElementById('publish-button');
          publish_button.style.background = 'gray';
          urlFlag = false;
          break;
        } else {
          urlFlag = true;
          if (titleFlag) {
            let publish_button = document.getElementById('publish-button');
            publish_button.style.background = 'black';
            display.innerHTML = '';
          }
        }
      }
      if (text.url.length == 0 && document.getElementById("link").value != '') {
        if (titleFlag) {
          let publish_button = document.getElementById('publish-button');
          publish_button.style.background = 'black';
        }
        urlFlag = true;
      }
      if (document.getElementById("link").value == '') {
        let publish_button = document.getElementById('publish-button');
        publish_button.style.background = 'gray';
        urlFlag = false;
      }
    });
    document.getElementById("title").addEventListener('keyup',function(){
      titleFlag = true;
      if (urlFlag) {
        let publish_button = document.getElementById('publish-button');
        publish_button.style.background = 'black';
      }
      if (document.getElementById("title").value == '') {
        let publish_button = document.getElementById('publish-button');
        publish_button.style.background = 'gray';
        titleFlag = false;
      }
    });

  }  
  static onRejected(err) {
    alert(err);
  }
  save_article() {
    document.fm.action = 'http://localhost:8080/home';
    this.submit();
  }
  preview_article() {
    if (edit_text == document.fm.textarea.value) {
      document.fm.action = 'http://localhost:8080/preview';
      this.submit();
    }
  }
  written_article() {
    if (urlFlag && titleFlag) {
     this.submit();
    }
  }
  submit() {
    
    let translated = document.fm.textarea.value.replace(/script/g, "sssss");
    document.fm.textarea2.value = encodeURI(translated);
    document.fm.submit();
  }
  static read_url_txt(url_txt) {
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
    return {url:url, title:title};
  }
};
let write_article = new WriteArticle();