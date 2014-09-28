$(document).ready(function() {

	
	var random_room= $('.create_random');
	var room_name = $('.room_name');
	var room='';

	var username;

	//GET RANDOM ROOM NAME
	random_room.on( "click", function( event ) {

		event.preventDefault();
		var chars = "2345689ABCDEFGHJKMNPQRSTUVWXTZabcdefghkmnpqrstuvwxyz";
		var string_length = 8;//53^8 = 62259690411361, lots of room for everyone!
		var randomstring = '';
		for(var i = 0; i < string_length; i++) {
		  var rnum = Math.floor(Math.random() * chars.length);
		  randomstring += chars.substring(rnum, rnum + 1);
		}


		//Deletes pre-existing text in the box
		if(room_name.val()!=''){
			room_name.val('');		
		}
		room = randomstring;
		user(room);	
				
	});

	//FIRST JOIN ROOM BUTTON
	$('#join1').on( "click", function( event ) {	
		var n1 = $('#name1');	
		if(n1.val()!=''){
			event.preventDefault();
			user(n1.val());	
		}
		else{
			event.preventDefault();
		}

	});

	//FIRST JOIN ROOM BUTTON
	$('#join2').on( "click", function( event ) {	
		var n2 = $('#name2');	
		if(n2.val()!=''){
			event.preventDefault();
			user(n2.val());	
		}
		else{
			event.preventDefault();
		}

	});


	//Analyse username
	function user(rooy){
		var msg_body='<div class="control-group"><label>Username :</label><input id="username" type="text" class="span2"><span class="help-inline hide">Not empty !</span></div>';
		bootbox.dialog({
			message:msg_body,
			title:"Enter Username",
			buttons:{success:{label:"Chat!",className:"btn-success",callback:function(){
					 /**
			         * if the username is not entered : error
			         */
			        username = $("#username");
			        if(username.val() == ""){
			            username.parent('div').addClass("error");
			            username.siblings('span').removeClass('hide');
			        /**
			         * else write the nickname in the right of the navbar
			         * and the Modal Connection closes when the user click on the "close button"
			         */
			        } else {
			        	window.location.href="http://localhost:2014/?room="+rooy+"&user="+username.val();
			            //$('.you').text(username.val()); 
			            //initialize();
			        }

		}}}});
	}

	$("#about").on("click", function(e){
      e.preventDefault();

      var msg_body = '<div class="col-sm-12">'+
                '<div class="column">'+
                    '<h2>Welcome to Talkplus</h2>'+
                    '<div class="content">'+
                     '<p>Talkplus is a start-up company that specialises in development of scalable communication infrastructure'+
                     ' designed to provide reliable, free and easy communication between people.</p>'+
                     '<p>Talkplus is created by <i>OTY CHINEDU STANLEY</i> otychinedu@gmail.com.</b>'+
                    '</div>'+
                '</div>'+
            '</div>';

      	bootbox.alert({
			message:msg_body,
			title:"About Us",

			});
    });


	$("#faq").on("click", function(e){
      e.preventDefault();

      var faq_msg = '<div class="col-sm-12">'+
                        '<div class="panel-group toggles" id="accordion">'+
                         '   <div class="panel panel-default">'+
                          '      <div class="panel-heading">'+
                           '         <h4 class="panel-title">'+
                            '            <a data-toggle="collapse" data-parent="#accordion" href="#collapse-one" class="collapsed">'+
                             '               <i class="entyp-plus-squared-1"></i>'+
                              '              <i class="entyp-minus-squared-1"></i>'+
                               '             How do i download Talkplus? '+
                                '        </a>'+
                                 '   </h4>'+
                                '</div>'+
                                '<div id="collapse-one" class="panel-collapse collapse" style="height: 0px;">'+
                                 '   <div class="panel-body">'+
                                  '      Talkplus does not need any download or installation or plugin. '+
                                   '     Just visit the visit the site at <a href="talkplus.herokuapp.com">talkplus.herokuapp.com</a> '+
                                   ' </div>'+
                                '</div>'+
                            '</div>'+
                            '   <div class="panel panel-default">'+
                          '      <div class="panel-heading">'+
                           '         <h4 class="panel-title">'+
                            '            <a data-toggle="collapse" data-parent="#accordion" href="#collapse-two" class="collapsed">'+
                             '               <i class="entyp-plus-squared-1"></i>'+
                              '              <i class="entyp-minus-squared-1"></i>'+
                               '             What is Talkplus subscription plan?'+
                                '        </a>'+
                                 '   </h4>'+
                                '</div>'+
                                '<div id="collapse-two" class="panel-collapse collapse" style="height: 0px;">'+
                                 '   <div class="panel-body">'+
                                  '      Users do not need to pay a penny to make use of any Talkplus service. '+
                                   '     It is absolutely free.'+
                                   ' </div>'+
                                '</div>'+
                            '</div>'+
                               '   <div class="panel panel-default">'+
                          '      <div class="panel-heading">'+
                           '         <h4 class="panel-title">'+
                            '            <a data-toggle="collapse" data-parent="#accordion" href="#collapse-3" class="collapsed">'+
                             '               <i class="entyp-plus-squared-1"></i>'+
                              '              <i class="entyp-minus-squared-1"></i>'+
                               '             Who can use Talkplus?'+
                                '        </a>'+
                                 '   </h4>'+
                                '</div>'+
                                '<div id="collapse-3" class="panel-collapse collapse" style="height: 0px;">'+
                                 '   <div class="panel-body">'+
                                  '   Everyone can use Talkplus, be it an individual, firm, government, etc. '+
                                   ' </div>'+
                                '</div>'+
                            '</div>'+
                                    '   <div class="panel panel-default">'+
                          '      <div class="panel-heading">'+
                           '         <h4 class="panel-title">'+
                            '            <a data-toggle="collapse" data-parent="#accordion" href="#collapse-4" class="collapsed">'+
                             '               <i class="entyp-plus-squared-1"></i>'+
                              '              <i class="entyp-minus-squared-1"></i>'+
                               '             What do i need to run Talkplus?'+
                                '        </a>'+
                                 '   </h4>'+
                                '</div>'+
                                '<div id="collapse-4" class="panel-collapse collapse" style="height: 0px;">'+
                                 '   <div class="panel-body">'+
                                  '   Talkplus requires a webcam and microphone enabled device. Browsers such as Chrome, firefox and Opera supports Talkplus. '+
                                   ' </div>'+
                                '</div>'+
                            '</div>'+
                           
                        '</div>'+
                    '</div>';

                    bootbox.alert({
			message:faq_msg,
			title:"Frequently Asked Questions",

			});


     }); 


});