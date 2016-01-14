(function($) {
  $(document).ready(function() {

    /**
     *  Валидация формы заказа
     */
    $.validate({
      form: '#calculator-gate-form',
      onElementValidate : function(valid, $el, $form, errorMess) {
        //когда идёт валидация элементов
      },
      onSuccess : function($form) {
        //alert('The form '+ $form.attr('id') + ' is valid!');
        calculate();
        $('#edit-generate-button').show(200);
        return false; // Will stop the submission of the form
      },
    });

    $.validate({
      form: '#order-gate-form',
      onElementValidate : function(valid, $el, $form, errorMess) {
        //когда идёт валидация элементов
      },
      onSuccess : function($form) {
        var data = [];
        data[0] = "to=" + $('#edit-order-email').val();
        data[1] = "name=" + $('#edit-order-name').val();
        data[2] = "message=Сделан заказ на Металл-Сити.\n\nПараметры заказа:\n" 
                  + $('#edit-order-text').val() 
                  + '\n\nДанные заказчика:\nE-mail: ' + $('#edit-order-email').val() 
                  + '\nФИО: ' + $('#edit-order-name').val()
                  + '\nАдрес: ' + $('#edit-order-adress').val()
                  + '\nТелефон: ' + $('#edit-order-telefone').val()
                  + '\nПожелания к заказу: ' + $('#edit-order-suggestion').val();
        var html = $.ajax({
          type: "POST",
          data: data.join('&'),
          url: "/calculator/sendmail",
          async: false
        }).responseText;
        if(html == 1){
          $('#order-gate-form').hide(300);
          $('#send-result').html('Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
        }
        else{
          alert('Сообщение не отправлено. Мы выясняем в чём ошибка.');
        }
        return false;
      },
    });
    /**
     *  Валидация формы заказа закончена
     */


    /**
     * фунции скрытия-показывания различных элементов формы заказа
     */

    //если меняется тип калькулятора
    $('#edit-select-type input[type=radio]').change(function(){
      remove_checkbox();
      $('#edit-generate-button').hide(200);
      if($(this).val() == 'gates'){
        show_hide('gates');
      }
      if($(this).val() == 'wicket'){
        show_hide('wicket');
      }  
      if($(this).val() == 'gates_wicket'){
        show_hide('gates_wicket');
      }     
    });

    //при выборе типа ворот показывать выбранные ворота
    $('#edit-select-gate-type input[type=radio]').change(function(){
      $('#edit-generate-button').hide(200);
      if($(this).val() == 'gateswing'){
        show_hide('gateswing');
        remove_checkbox('gate');
        totalArea();
        if ($('#edit-select-type-gates-wicket').prop('checked')) {
          $('.form-item-select-wicket, .form-item-wicket-width, .form-item-wicket-height').show(300);
        };
      }
      if($(this).val() == 'gateroll'){
        show_hide('gateroll');
        remove_checkbox('gate');
        if ($('#edit-select-type-gates-wicket').prop('checked')) {
          $('.form-item-select-wicket, .form-item-wicket-width, .form-item-wicket-height').show(300);
        };
      }   
    });

    //при выборе калитки прятать кнопку оформления
    $('#edit-select-wicket input[type=radio]').change(function(){
      if ($(this).attr('cutting') == '1') { //если калитка художественной резки, то показывать роспись
        $('.element-59').css('display', '');
        console.log($(this).attr('cutting'));
      } 
      else{
        $('.element-59').css('display', 'none');
        console.log($(this).attr('cutting'));
      };
      $('#edit-generate-button').hide(200); 
    });

    //при выборе какого-нибудь варианта доставки показывать форму для заполнения километров от МКАД
    $('#edit-delivery input[type=radio]').change(function(){
      var type = $(this).val();
      $('#edit-generate-button').hide(200);  //скрывать кнопку оформления заказа
      if(type == 'delivery_fair' || type == 'delivery_taxi'){
        $('.form-item-kilometers').show(200);
      }
      if(type == 'pickup'){
        $('.form-item-kilometers').hide(200);
      }      
    });

    //прятать кнопку оформления заказа, когда меняются значения в этих полях
    $('#edit-kilometers, .addition, #edit-width, #edit-height, #edit-wicket-width--2, #edit-wicket-height--2').keyup(function(){
      if ($(this).attr('id') == 'edit-width' || $(this).attr('id') == 'edit-height') {
        totalArea();
      };
      $('#edit-generate-button').hide(200);
    });

    //при выборе типа ворот показывать какие ворота есть на сайте
    $('.form-item-select-gate input[type=radio]').change(function(){
      if ($(this).attr('tid') == '21' || $(this).attr('cutting') == '1') { //если ворота художественной резки, то показывать роспись
        $('.element-57').css('display', '');
        $('.element-58').css('display', '');
        console.log('+' + $(this).attr('tid'));
      } 
      else{
        $('.element-57').css('display', 'none');
        $('.element-58').css('display', 'none');
        console.log('-' + $(this).attr('tid'));
      };
      $('#edit-generate-button').hide(200);
    });

    $('.addition-checkbox').change(function(){
      $('#edit-generate-button').hide(200);
    });

    $('.install-checkbox').change(function(){
      $('#edit-generate-button').hide(200);
    });

    //если нажата кнопка оформить заказ, то скрываем форму с калькулятором и переходим к формированию заказа
    $('#edit-generate-button').click(function(){
      scrollToAnchor();
      $('#edit-generate').show(200);
      $('#edit-calculator').hide(200);
      $('#edit-order-name').reset();
      
    });

    //если нажата кнопка редактировать заказ, то возвращаемся к редактированию заказа
    $('#edit-back-to-calculator').click(function(){
      $('#edit-generate').hide(200);
      $('#edit-calculator').show(200);
      return false; 
    });


    function show_hide(type) {
      var time = 200;
      if (type == 'gates') {
        $('.form-item-select-gate-type').show(time);
        $('.form-item-select-wicket, .form-item-wicket-width, .form-item-wicket-height, .form-item-width, .form-item-height').hide(time);
        
        $('.default-elements').removeClass('dnone').addClass('dblock'); //допольнительные элементы
        $('.elements').addClass('dnone').removeClass('dblock');
        $('[id ^= as-gate').addClass('dnone').removeClass('dblock');
        remove_chkbox_and_input('[id ^= as-gate');
        $('[id ^= as-wicket').addClass('dnone').removeClass('dblock');
        remove_chkbox_and_input('[id ^= as-wicket');
      };
      if (type == 'wicket') {
        console.log('wicket');
        $('.form-item-select-gate-type, .form-item-width, .form-item-height').hide(time);
        $('.form-item-select-gate, .form-item-width, .form-item-height').hide(time);
        $('.form-item-select-wicket, .form-item-wicket-width, .form-item-wicket-height').show(time);
        $('.default-elements').addClass('dnone').removeClass('dblock'); //допольнительные элементы
        $('.elements').removeClass('dnone').addClass('dblock');
        $('[id ^= as-gate').addClass('dnone').removeClass('dblock');
        remove_chkbox_and_input('[id ^= as-gate');
        $('[id ^= as-wicket').removeClass('dnone').addClass('dblock');
      };
      if (type == 'gates_wicket') {
        $('.form-item-select-gate-type').show(time);
        $('.form-item-select-gate, .form-item-width, .form-item-height').hide(time);
        $('.form-item-select-wicket, .form-item-wicket-width, .form-item-wicket-height').hide(time);

        $('.default-elements').addClass('dnone').removeClass('dblock'); //допольнительные элементы
        $('.elements').removeClass('dnone').addClass('dblock');
        $('[id ^= as-gate').addClass('dnone').removeClass('dblock');
        $('[id ^= as-wicket').removeClass('dnone').addClass('dblock');
      };
      if (type == 'gateswing') {
        $('.form-item-select-gate, .form-item-width, .form-item-height').show(time);
        $('.form-item-select-gate input[value^=gateswing]').parent().show(time);
        $('.form-item-select-gate input[value^=gateroll]').parent().hide(time);

        //установить высоту и ширину
        $('#edit-width').val($('#edit-select-gate-type-gateswing').attr('width'));
        $('#edit-height').val($('#edit-select-gate-type-gateswing').attr('height'));

        $('.default-elements').addClass('dnone').removeClass('dblock'); //допольнительные элементы
        $('.elements').removeClass('dnone').addClass('dblock');
        $('[id ^= as-gateswing').removeClass('dnone').addClass('dblock');
        $('[id ^= as-gateroll').addClass('dnone').removeClass('dblock');
        remove_chkbox_and_input('[id ^= as-gateroll');
        remove_chkbox_and_input('[id ^= as-wicket');
      };
      if (type == 'gateroll') {
        $('.form-item-select-gate, .form-item-width, .form-item-height').show(time);
        $('.form-item-select-gate input[value^=gateswing]').parent().hide(time);
        $('.form-item-select-gate input[value^=gateroll]').parent().show(time);

        //установить высоту и ширину
        $('#edit-width').val($('#edit-select-gate-type-gateroll').attr('width'));
        $('#edit-height').val($('#edit-select-gate-type-gateroll').attr('height'));

        $('.default-elements').addClass('dnone').removeClass('dblock'); //допольнительные элементы
        $('.elements').removeClass('dnone').addClass('dblock');
        $('[id ^= as-gateswing').addClass('dnone').removeClass('dblock');
        $('[id ^= as-gateroll').removeClass('dnone').addClass('dblock');
        remove_chkbox_and_input('[id ^= as-gateswing');
        remove_chkbox_and_input('[id ^= as-wicket');
      };      
    }

    function remove_checkbox(gate){   
      if(gate == undefined){
        $('.form-item-select-gate-type input').attr('checked', false);
        $('.form-item-select-wicket input').attr('checked', false);
        $('.form-item-select-gate input').attr('checked', false);
      }
      if(gate == 'gate'){
        $('.form-item-select-gate input').attr('checked', false);
      }
    }

    function remove_chkbox_and_input(selector){
      $(selector + '] input').attr('checked', false);
      $(selector + '] input').val(0);
    }


    /**
     *  функции подсчёта общей стоимости заказа
     */    
    function calculate() {
      summ = 0;     
      orderText = '';                       //инициализация текста заказа

      //смотрим, какой тип калькулятора
      $('.form-item-select-type input').each(function(){
        if($(this).prop('checked')){
          calculate_products($(this).prop('value'));
        }    
      });

      calculate_additional(); //считаем доп элементы
      calculate_delivery();   //считаем доставку

      orderText += '\nИтого: ' + addSpaces(summ) + ' руб.'; //пишем итого в поле заказа
      $('#total-summ').html(addSpaces(summ)); //записали сумму в div
      $('#edit-order-text').val(orderText);    //записали текст заказа в textarea
    } 

    function calculate_products(type){
      //выбираем тип считаемых изделий
      if (type == 'gates') {
        calculate_products_gate();
      }

      if (type == 'wicket') {
        calculate_products_wicket();
      }

      if (type == 'gates_wicket') {
        calculate_products_gate();
        calculate_products_wicket();
      }  
    }

    //считаем стоимость ворот
    function calculate_products_gate(){
      //берём стоимость за метр
      var cost_meter = 0;
      var gate_width = $('#edit-width').val();   //берём ширину ворот
      var gate_height = $('#edit-height').val(); //берём высоту ворот
      var gate_type = '';
      var gate_name = '';
      var gate_price = 0;
      var is_user_login_rate = $('input[name=is_user_login_rate]').val(); //залогинен ли пользователь?

      //определяем тип ворот
      $('.form-item-select-gate-type input').each(function(){
        if($(this).prop('checked')){
          gate_type = $.trim($(this).next('label').html());
        }    
      });      

      //определяем название ворот
      $('.form-item-select-gate input').each(function(){
        if($(this).prop('checked')){
          cost_meter = $(this).attr('price') / $(this).attr('aream');
          gate_name = $.trim($(this).next('label').find('.product-name').html());
        }    
      });

      //пишем в поле заказа размеры изделия
      //gate_price = parseInt(is_user_login_rate * 1.3 * gate_width * gate_height * cost_meter/10000);
      gate_price = parseInt(is_user_login_rate * gate_width * gate_height * cost_meter/10000);
      orderText += gate_type + ': ' + gate_name + '\n';
      orderText += 'Размеры ворот: ' + gate_width + 'x' + gate_height + ' см. ';
      orderText += 'Стоимость ворот: ' + gate_price + ' руб. \n';
      summ += gate_price; 
    }

    //считаем стоимость калитки
    function calculate_products_wicket(){
      var cost_meter = 0; //берём стоимость за метр
      var wicket_width = $('#edit-wicket-width--2').val();   //берём ширину калитки
      var wicket_height = $('#edit-wicket-height--2').val(); //берём высоту калитки
      var wicket_price = 0;
      var is_user_login_rate = $('input[name=is_user_login_rate]').val(); //залогинен ли пользователь?

      //определяем название калитки
      $('.form-item-select-wicket input').each(function(){
        if($(this).prop('checked')){
          cost_meter = $(this).attr('price') / $(this).attr('aream');
          wicket_name = $.trim($(this).next('label').find('.product-name').html());;
        }    
      });

      //пишем в поле заказа размеры изделия
      //wicket_price = parseInt(is_user_login_rate * 1.3 * wicket_width * wicket_height * cost_meter / 10000);
      wicket_price = parseInt(is_user_login_rate * wicket_width * wicket_height * cost_meter / 10000);
      orderText += 'Калитка: ' + wicket_name + '\n';
      orderText += 'Размеры калитки: ' + wicket_width + 'x' + wicket_height + ' см.';
      orderText += 'Стоимость калитки: ' + wicket_price + ' руб. \n';
      summ += wicket_price; 
    }

    function calculate_additional(){
      var summ_addition = 0;           //переменная для подсчёта суммы в полях доп элементов textfield
      var summ_additionCheckbox = 0;   //переменная для подсчёта суммы в полях доп элементов checkbox
      //cчитаем суммы доп элементов. определяем массив доп элементов
      var types = ['additional', 'automatic', 'installation', 'settings'];

      //для каждого раздела доп элементов делаем перебор
      $(types).each(function(index, value){
          var title = ''; //определяем заголовок группы элементов
          if(value == 'additional') { title = '\nДополнительные опции:\n'; }
          if(value == 'automatic') { title = '\nАвтоматика:\n'; } 
          if(value == 'installation') { title = '\nУстановка:\n'; } 
          if(value == 'settings') { title = '\nДругие параметры:\n'; }

          //считаем сумму в полях дополнительных элементов, где есть выбор количества
          $('input.addition-' + value).each(function(index, value){
            if($(this).val() > 0){
              attrPrice = parseInt($(this).attr('price'));
              attrValue = parseInt($(this).val());
              addSumm = attrPrice * attrValue;
              orderText += title + $(this).attr('element-name') + ': ' + attrPrice + 'руб. * ' + attrValue + 'шт. = ' + addSumm + 'руб. ';
              install = $('.' + $(this).attr('id'));
              if(install.prop('checked')){
                installPrice = parseInt(install.attr('installprice')) * attrValue;
                addSumm += installPrice;
                orderText += 'Установка: ' + installPrice + ' руб. \n';
              }
              else{
                orderText += '\n';
              }
              summ_addition += addSumm; //прибавляем стоимость дополнения к общей сумме
              title = '';
            }
          });

          //сумма в полях доп элементов, где есть чекбоксы
          $('input.addition-checkbox-' + value).each(function(){            
              if ($(this).prop('checked')) {
                summ_additionCheckbox += parseInt($(this).attr('price'));
                orderText += title + $(this).attr('element-name') + ': ' + $(this).attr('price') + 'руб. \n';
                install = $('.' + $(this).attr('id'));
                if(install.prop('checked')){
                  installPrice = parseInt(install.attr('installprice'));
                  summ_additionCheckbox += installPrice;
                  orderText += 'Установка: ' + installPrice + ' руб. \n';
                }
                else{
                orderText += '\n';
              }
                title = '';
              }          
            }
          );

        }
      );
      summ += summ_addition + summ_additionCheckbox;
    }

    //считаем стоимость доставки
    function calculate_delivery(){
      var deliveryCost = 0;
      var deliveryType = '';
      var pickup = 0;
      $('.form-item-delivery-type input[type=radio]').each(function(){
        if($(this).prop('checked')){
          deliveryCost = parseInt($('input[name=' + $(this).prop('value') + ']').val());
          deliveryType = $(this).next('label').html();
          if($(this).val() == 'pickup'){
            pickup = 1;
          }
        }
      });
      var kilometers = parseInt($('#edit-kilometers').val()); //сколько километров нужно доставлять
      summ_delivery = deliveryCost*kilometers;                  //конечная цена доставки

      //запишем в поле заказа стоимость доставки, если сумма доставки больше 0 или самовывоз
      if(summ_delivery > 0){
        orderText += '\nДоставка:\n' + deliveryType + ' = ' + summ_delivery + 'руб. \n';
        summ += summ_delivery;
      }
      if(pickup){
        orderText += '\nДоставка:\nСамовывоз - бесплатно. \n';
      }
    }

    //открывает-закрывает филдсет
    $('#form-calculator .fieldset-legend').on('click', function() {
      $('#form-calculator #edit-calculator fieldset').addClass('collapsed', 300);
      parent = $(this).parent().parent();
      if(parent.hasClass('collapsed')){
        parent.removeClass("collapsed", 300);
      }
      scrollToAnchor();
    });

    //функция для скрола
    function scrollToAnchor(){
        //var aTag = $("#"+ aid);
        var aTag = $("#edit-calculator");
        $('html,body').animate({scrollTop: aTag.offset().top},'slow');
    }

    //функция, считающая сумму
    function totalArea() {
      var width = $('#edit-width').val();
      var height = $('#edit-height').val();
      var total = width * height / 10000;
      
      //монтаж 
      if ($.isNumeric(total)) {
        $('.element-60 input').attr('checked', false);
        $('.element-61 input').attr('checked', false);
        if(total > 6){
          var totalPlus = Math.ceil(total - 6);
          var totalSum = 8000 + totalPlus*800;
          $('.element-61 .element-price').html(totalSum + ' руб.');
          $('.element-61 .element-data input').attr('price', totalSum);
          $('.element-60').addClass('dnone').removeClass('drow');
          $('.element-61').removeClass('dnone').addClass('drow');
        }
        else{
          $('.element-61').addClass('dnone').removeClass('drow');
          $('.element-60').removeClass('dnone').addClass('drow');    
        }
      }
    }


  //выбираем тот товар, который открыт на данной странице
    var html = $.ajax({
      type: "POST",
      data: "from=" + location.href,
      url: "/calculator/params",
      async: false
    }).responseText;
    if(html != ''){
      console.log(html);
      result = html.split('_');
      if(result[0] == 'wicket'){
        $('#edit-select-type-wicket').click();
        $('[value ^= ' + html).click();
      }
      else{
        $('#edit-select-type-gates').click();
        $('#edit-select-gate-type-' + result[0]).click();
        $('[value ^= ' + html).click();
      }
    }

function addSpaces(n) {
  n += "";
  n = new Array(4 - n.length % 3).join("U") + n;
  return n.replace(/([0-9U]{3})/g, "$1 ").replace(/U/g, "");
}

  });
})(jQuery);