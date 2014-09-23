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

	$("#aboutu").on("click", function(e){
      e.preventDefault();
      alert('dfcvdf');
    });


});