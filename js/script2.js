

  $(document).ready(function(){
    $("#animateButton").click(function(){
      $("#demo").animate({
        left: '250px',
        opacity: '0.5',
        height: '150px',
        width: '150px'
      });
    });
  });

  $(document).ready(function(){
    $("#hoverButton").hover(function(){
      $("#demo2").css("color", "red");
    }, function(){
      $("#demo2").css("color", "black");
    });
  });

  $(document).ready(function(){
    $("#removeButton").click(function(){
      $("#demo3 li:last-child").remove();
    });
  });

  $(document).ready(function(){
    $("#toggleEffectButton").click(function(){
      $("#demo4").toggle("slow");
    });
  });


  $(document).ready(function(){
    $("#mouseDiv").mouseenter(function(){
      $(this).css("background-color", "lightgray");
    });
    $("#mouseDiv").mouseleave(function(){
      $(this).css("background-color", "white");
    });
  });

  $(document).ready(function(){
    $("#fileInput").change(function(){
      var input = this;
      var url = $(this).val();
      var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
      if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#imagePreview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
      } else {
        $('#imagePreview').attr('src', 'noimage.png');
      }
    });
  });


  $(document).ready(function(){
    $("#changeBackgroundButton").click(function(){
      $("body").css("background-color", "lightblue");
    });
  });

  $(document).ready(function(){
    function showTime() {
      var date = new Date();
      var time = date.toLocaleTimeString();
      $("#clock").html(time);
    }
    setInterval(showTime, 1000);
  });

  

  $(document).ready(function(){
    $(".accordion").click(function(){
      $(this).next().slideToggle();
    });
  });

  $(document).ready(function(){
    $("#inputField").focus(function(){
      $(this).css("background-color", "lightblue");
    });
    $("#inputField").blur(function(){
      $(this).css("background-color", "white");
    });
  });

  $(document).ready(function(){
    var count = 1;
    
    $("#addButton").click(function(){
      $("#dynamicList").append("<li>Öğe " + count + "</li>");
      count++;
    });
  });


  $(document).ready(function(){
    // Yukarı doğru kaydırılabilir butonun görünürlüğünü kontrol edin
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#scrollToTopBtn').fadeIn();
        } else {
            $('#scrollToTopBtn').fadeOut();
        }
    });
    // Yukarı doğru kaydırılabilir butona tıklandığında sayfayı animasyonlu olarak yukarı doğru kaydırın
    $('#scrollToTopBtn').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});


   // Sayfa yüklendiğinde jQuery kullanarak işlev tanımlayın
   $(document).ready(function(){
    // Metin kutusuna her tuşa basıldığında işlevi başlatın
    $("#inputText").keyup(function(){
        // Metin kutusundaki metni alın
        var inputText = $(this).val();
        // Metni tersine çevirin ve sonuç bölümüne ekleyin
        $("#outputText").text(inputText.split('').reverse().join(''));
    });
});