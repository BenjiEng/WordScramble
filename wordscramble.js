$(function() {

  var clock;
  var score = 0;

   initClock = function() {
    clock = $('#my-clock').FlipClock(90, {
          autoStart: false,
          clockFace: 'MinuteCounter',
          countdown: true,
          callbacks: {
            stop: function() {
              alert('Times up thanks for playing! You got '+score+' word(s) correct!');
              initClock();
            }
          }
    });
  };

  $original = $('#original');
  $scrambledWord = $('#scrambled-word');
  keyDownListener = false;
  definitionText = "";
  var originalWord = ''

  //get word listener
  $('#get-word').on('click', function() {
    $("#guess-field").empty();
    $("#word-field").empty();
    $("#scrambled-word").empty();
    $("#original").empty();
    $('#get-word').button('loading');
    findWord();
  });

  //finds a word
  function findWord() {
    var self = this;
    debugger
    $.ajax({
      type: "GET",
      url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=pronoun&minCorpusCount=1&maxCorpusCount=-1&minDictionaryCount=2&maxDictionaryCount=-1&minLength=5&maxLength=12&api_key=dhuq34cwhqpb592fs8lyz64ujcwf3jzf8f74mbnroedvlk1pl",
      success: function(word) {
        var original = (word.word).toLowerCase();
        originalWord = original

        var scrambled = scramble(original);

        var originalIdx = 0;
        for(i=0; i<scrambled.length; i++) {
          $scrambledWord.append('<span class="letter-scrambled" id="'+scrambled[i]+'">'+scrambled[i]+'</span>');
          originalIdx += 1;
        };

        getDefinition(original);
        self.keyDownListener = true;
        $('#get-word').button('reset');
        clock.start();
      },
      error: function(e) {
        console.log(e);
      }
    });
  };

  //scrambles word
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

  //gets definition of word
  function getDefinition(word) {
    $.ajax({
      type: "GET",
      url: "http://api.wordnik.com:80/v4/word.json/"+word+"/definitions?limit=200&partOfSpeech=noun&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
      success: function(definition) {
        if (definition[0].text) {
          definitionText = definition[0].text;
        } else if (definition[1].text) {
          definitionText = definition[1].text;
        } else {
          definitionText = definition[2].text;
        }
      }
    });
  }

  //key down listener
  var wordIdx = 0;
  $(window).keydown(function(event) {
    var self = this;
    if (keyDownListener) {
      var keyCode = String.fromCharCode(event.keyCode).toLowerCase();
        if (keyCode == originalWord[wordIdx]) {
          $("#guess-field").html('<span class="correct-letter">'+keyCode+'</span>');
          $("#word-field").append('<span class="correct-letter">'+keyCode+'</span>');
          $("#"+keyCode).removeClass("letter-scrambled").addClass("letter-unscrambled").removeAttr("id");
          wordIdx +=1
        } else {
          $("#guess-field").html('<span class="incorrect-letter">'+keyCode+'</span>');
        };

        if (wordIdx === originalWord.length) {
          wordIdx = 0;
          // clock.stop();
          $("#game-status").html("You got it! The word was: ");
          $("#correct-word").html(originalWord);
          $("#definition").html(definitionText);
          $("#myModal").modal("show");
          score += 1;
        };
    }
  });

  //give up listener
  $("#give-up").on('click', function() {
    $("#game-status").html("You didn't get it :( The word was: ");
    $("#correct-word").html(originalWord);
    $("#definition").html(definitionText);
    $("#myModal").modal("show");
    keyDownListener = false;
  });


});
