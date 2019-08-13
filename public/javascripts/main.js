console.log("Start");

$("form").submit(function(e){
  e.preventDefault();
});

$('#translate').click(function (event) {
  console.log('on click translate');
  event.preventDefault();

  var text = $('#text').val();
  var lang = $('#lang').val();
  var params = $.param({ text: text, lang: lang });

  var translateXhr = $.ajax({
    contentType: 'application/json',
    //data: JSON.stringify({ text: text, lang: lang }),
    //dataType: 'json',
    processData: false,
    type: 'GET',
    url: '/gTranslate?' + params,
    success: function (data) {
      //$('#result').html(data.Response.text);
      $('#result').html(data.translation);
    },
    error: function () {
      alert('Failed to translate');
    }
  });

  return false;
});

$('#search').click(function (event) {
  console.log('on click search');
  event.preventDefault();

  var query = $('#query').val();
  var page = $('#searchPage').val() * 1;

  var searchXhr = $.ajax({
    contentType: 'application/json',
    //data: JSON.stringify({ query: query, page: page }),
    //dataType: 'json',
    processData: false,
    type: 'GET',

    url: '/gSearch?' + $.param({ query: query, page: page }),
    success: function (data) {
      console.log('success', data);
      $('#searchResults').empty();
      data.forEach(function(result) {
        //var result = JSON.parse(resultStr);
        console.log('result', result);
        var title = result.title || result.snippet || result.URL;
        $('#searchResults').append('<tr><td><a href="' + result.URL + '" target="_blank">' + title + '</a><br><small class="text-success">' + result.URL.slice(0,50) + '</small><br><small>' + result.snippet + '</small></td></tr>');
      });
    },
    error: function () {
      alert('Failed to translate');
    }
  });

  return false;
});
