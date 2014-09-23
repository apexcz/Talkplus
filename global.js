/**
global functions
*/

$(function() {

	
	/**
     * Declare the variables for random room name and created roomname
    */
	var random_room= $('.create_random');
	var room_name = $('#room_name');

	/**
     * Declare the variable username
    */
	var username = $("#username");

	//GET RANDOM ROOM NAME
	random_room.on( "click", function( event ) {
		
		var chars = "2345689ABCDEFGHJKMNPQRSTUVWXTZabcdefghkmnpqrstuvwxyz";
		var string_length = 8;//53^8 = 62259690411361, lots of room for everyone!
		var randomstring = '';
		for(var i = 0; i < string_length; i++) {
		  var rnum = Math.floor(Math.random() * chars.length);
		  randomstring += chars.substring(rnum, rnum + 1);
		}

		if(room_name.val()!=''){
			room_name.val('');		
		}
		window.location.hash = randomstring;
		//window.location.href="http://localhost:2014";

		  $('#UsernameModal').modal({
		      backdrop: "static",
		      keyboard: false
		  }); 
				
	});

	//GET  ROOM NAME
	$('#create_room').on( "submit", function( event ) {		
		if(room_name.val()!=''){
			event.preventDefault();
			window.location.hash = room_name.val();
			 

			 $('#UsernameModal').modal({
		      backdrop: "static",
		      keyboard: false
		  }); 
		}
		else{
			event.preventDefault();
		}

	});

	//Modal Username onclick 
	
	 $("#enter").on("click", function(){
        /**
         * if the username is not entered : error
         */
        if(username.val() == ""){
            username.parent('div').addClass("error");
            username.siblings('span').removeClass('hide');
        /**
         * else write the nickname in the right of the navbar
         * and the Modal Connection closes when the user click on the "close button"
         */
        } else {
        	window.location.href="http://localhost:2014";
            $('.you').text(username.val());
            $('#UsernameModal').modal('hide'); 
            initialize();
        }
    });



});