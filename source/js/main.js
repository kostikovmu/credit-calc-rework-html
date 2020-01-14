(function ($) {

  'use strict';

  var declension = function(month) {
    var txt,
      conunt = month % 10;

    if( (month > 5 && month < 21) || conunt === 0 || (conunt >= 5 && conunt <= 9)) {
      txt = 'месяцев';
    }
    else if(conunt === 1) {
      txt = 'месяц';
    }

    else {
      txt = 'месяца';
    }

    return txt;
  };

  var inputs = function () {

    $('.credit__input_phone').each(function () {
      $(this).inputmask({"mask": "+7 (999) 999-99-99"
      });
    });


    $('.credit__input')
      .focus(function () {
        if($(this).val() === '') {
          $(this).next().addClass('credit__label_active');
        }
      })
      .blur(function () {
        if($(this).val() === '') {
          $(this).next().removeClass('credit__label_active');
        }
      })

      .each(function () {
        if($(this).val() !== '') {
          $(this).next().addClass('credit__label_active');
        }
      });
  }

  var ajaxSend = function () {

    $('.credit__form').submit(function(e){
      e.preventDefault();
      $.ajax({
        url: '/wp-content/plugins/credit_calc/send.php',
        type: 'post',
        data: $(this).serialize() + '&payment=' + parseInt($('.credit__result-value').html()),
        beforeSend: function(){
          $('.overlay').fadeIn();
          $('body').addClass('modal-open');
        },
        success: function(response){
          if (response==0){
            $('.popup__title').html('Ошибка отправки!').css({'color':'#ff1a29'});
            $('.popup__description').html('&nbsp;');
            $('.popup').fadeIn();
          }
          else if (response==1){
            $('.popup__title').html('Ваша заявка отправлена!').css({'color':'#0c0c0c'});
            $('.popup__description').html('Менеджер свяжется с вами в ближайшее время!');
            $('.popup').fadeIn();
            $('.credit__input[name="name"], .credit__input[name="phone"]').val('');

          }
        },
        error: function(){
          $('.popup__title').html('Ошибка, попробуйте еще раз!').css({'color':'#ff1a29'});
          $('.popup__description').html('&nbsp;');
          $('.popup').fadeIn();
        }
      });
    });
  }

  var calculator = function () {
    $('.credit__input-amount').val('500000 ₽');
    $('.credit__input-term').val('12 месяцев');
    $('.credit__result-value').html('54166 ₽');


    $('.credit__range-amount').slider({
      range: 'min',
      step: 10000,
      min: 50000,
      max: 1000000,
      value: 500000,
      slide: function (e, ui) {
        var term = $('.credit__range-term').slider('value'),
          amount = ui.value,
          rate = MyAjax / 100,
          // rate = 0.02,
          res = Math.round(( amount + (amount * rate * term)) / term);

        $('.credit__input-amount').val(amount + ' ₽');
        $('.credit__result-value').html(res + ' ₽');
      }
    });
    $('.credit__range-term').slider({
      range: 'min',
      max: 60,
      min: 1,
      value: 12,
      slide: function (e, ui) {
        var amount = $('.credit__range-amount').slider('value'),
          term = ui.value,
          rate = MyAjax / 100,
          // rate = 0.02,
          res = Math.round(( amount + (amount * rate * term)) / term);

        $('.credit__input-term').val(term + ' ' + declension(term));
        $('.credit__result-value').html(res + ' ₽');
      }
    });
  }

  var modalClose = function() {

    $('.popup__close, .overlay').click(function (e) {
      e.preventDefault();
      $('.popup').fadeOut();
      $('body').removeClass('modal-open');
      $('.overlay').fadeOut();
    })

  };

  jQuery(document).ready(function($){
    calculator();
    inputs();
    ajaxSend();
    modalClose();
  });

})(jQuery);

