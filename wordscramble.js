$(function() {

$original = $('#original');
$scrambledWord = $('#scrambled-word');

$('#get-word').on('click', function() {
  $(".guess-field").empty();
  $(".word-field").empty();
  $("#scrambled-word").empty();
  findWord();
});

var originalWord = ''
function findWord() {

  $.ajax({
    type: "GET",
    url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=4&maxDictionaryCount=-1&minLength=5&maxLength=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
    success: function(word) {
      var original = (word.word).toLowerCase();
      originalWord = original

      var scrambled = scramble(original);

      var originalIdx = 0;
      for(i=0; i<scrambled.length; i++) {
        $scrambledWord.append('<span class="letter-scrambled" id="'+scrambled[i]+'">'+scrambled[i]+'</span>');
        originalIdx += 1;
      };

    }
  });

};

function scramble(word) {
  word_arr = word.split('');
  for(i=0; i<word_arr.length; i++) {
    var rand = (Math.floor(Math.random() * word_arr.length));
    var temp = word_arr[i];
    word_arr[i] = word_arr[rand]
    word_arr[rand] = temp
  }
  return word_arr.join('');
};

var wordIdx = 0;
$(window).keydown(function(event) {
  var keyCode = String.fromCharCode(event.keyCode).toLowerCase();
    if (keyCode == originalWord[wordIdx]) {
      $(".guess-field").html('<span class="correct-letter">'+keyCode+'</span>');
      $(".word-field").append('<span class="correct-letter">'+keyCode+'</span>');
      $("#"+keyCode).removeClass("letter-scrambled").addClass("letter-unscrambled").removeAttr("id");
      wordIdx +=1
    } else {
      $(".guess-field").html('<span class="incorrect-letter">'+keyCode+'</span>');
    };

    if (wordIdx === originalWord.length) {
      wordIdx = 0;
      alert("The word was: "+originalWord+". You got it!");
      originalWord = 'x';
    };
});

$("#give-up").on('click', function() {
  $('#original').html('<p class="theWord">'+originalWord+'</p>');
});


});
