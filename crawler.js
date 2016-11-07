
'use strict';

crawler();
function crawler(){

// angulara
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var stringify = require('stringify');
var querystring = require('querystring');
var http = require('http');
// var dot = require('dot-object');
var xml2json = require("simple-xml2json");


// //////////////////////////////////////////////////////////////////////////////////////
// OAUTH2
// //////////////////////////////////////////////////////////////////////////////////////

function login( client_token ) {

	// TODO: integrate express() app
	// specifically to make the URI redirect call > res.redirect();

	const credentials = {
		'client': {
			'id': '<client-id></client-id>',
			'secret': '<client-secret></client-secret>'
		},
		'auth': {
			'tokenHost': 'https://api.oauth.com' /*,
			'tokenPath': '',
			'revokePath': '',
			'authorizeHost': '',
			'authorizePath': '' */
		},
		'options': {
			'useBodyAuth': true
		}
	}
	const oauth2 = require('simple-oauth2').create( credentials );
	// Authorization oauth2 URI
	const authorizationUri = oauth2.authorizationCode.authorizeURL({
	  redirect_uri: 'http://localhost:3000/callback',
	  scope: '<scope>',
	  state: '<state>'
	});

	// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
	res.redirect(authorizationUri);

	// Get the access token object (the authorization code is given from the previous step).
	const tokenConfig = {
	  code: '<code>',
	  redirect_uri: 'http://localhost:3000/callback'
	};

	// Callbacks
	// Save the access token
	oauth2.authorizationCode.getToken(tokenConfig, (error, result) => {
	  if (error) {
	    return console.log('Access Token Error', error.message);
	  }

	  const token = oauth2.accessToken.create(result);
	});

	// Promises
	// Save the access token
	oauth2.authorizationCode.getToken(tokenConfig)
	.then((result) => {
	  const token = oauth2.accessToken.create(result);

		console.log( 'token value', token );


	})
	.catch((error) => {
	  console.log('Access Token Error', error.message);
	});

}



// //////////////////////////////////////////////////////////////////////////////////////
// END OAUTH2
// //////////////////////////////////////////////////////////////////////////////////////


// api access server
function PostCode( codestring, client_token ) {

  // REQUEST BODY (QUERY)
  ////////
  var post_data = querystring.stringify({
      'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
      'output_format': 'json',
      'output_info': 'compiled_code',
      'warning_level' : 'QUIET',
      'js_code' : codestring
  });


  // CONFIG
  ////////
  // An object of options to indicate where to post to
  var post_options = {
  	  // ebay specific
      host: 'api.sandbox.ebay.com',
      port: '80',
      path: '/buy/browse/v1/item_summary/search?q=phone&limit=50&offset=50',
      method: 'GET',
      headers: {
      	  'Authorization': '',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {

  		// instantiate response object
  		var response = {
  			'body': {}
  		};
  		
  		// process the response object based on the data chunk
  		//processResponse( chunk, response );

  		// parse the response object
  		//parseResponse( response );

  		// display the response
  		//console.log( 'final response value ', response );

      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}
// /////////////////////////////////////////////////////////////////////////////////
// EXECUTION
// /////////////////////////////////////////////////////////////////////////////////

var client_token = {
	'body': {}
};

login( client_token );

PostCode('', client_token);

// /////////////////////////////////////////////////////////////////////////////////
// END EXECUTION
// /////////////////////////////////////////////////////////////////////////////////

function processResponse( chunk, response ) {

	var chunky = chunk;

	// convert chunk from xml to JSON

	response.body = xml2json.parser( chunky );

	// define success or failure

	// detect failure
	if( response.body.errormessage.xmlns.length > 0 ) {
		// then, error ocurred
		response.error = response.body.errormessage.error;
	}
	//console.log('processResponse() response value ', response );
}



// sad little rabbit hole
function parseResponse( response ) {

	// convert the string to an array of letters called chunky
	var chunky = []; // array of objects
	for(var letter = 0; letter < chunk.length; letter++ ) {
		chunky += chunk[ letter ];
	}

	var chunky_copy = chunky;
	var chunky_word = chunky;
	/*
	for(var p = 0; p < chunky.length; p++) {
		var pos = 0;
		var wpos = p;
		// find tags of xml fields
		if( chunky[ p ] == '<' && chunky[ p + 1 ] != '/' )
		{
			var start_tag = '';
			pos = wpos;
			while( chunky_copy[ pos ] != '>' )
			{
				start_tag += chunky_copy[ pos ];
				pos++;
			}
			start_tag += '>';
			response[ 'start_tags' ].push( start_tag );
		} else if( chunky[ p ] == '>' )
		{
		   	var word = '';
		   	pos = wpos;
			if ( chunky[ wpos+1 ] != '<' ) {
			   	while( chunky_word[ pos ] != '<' )
			   	{

			   		//word += chunky_word[ wpos ];
			   		pos++;
			   	}
			} else {
				word += 'zzzz';
			}
			response[ 'words' ].push( word );
		}
		*/

	}
	
	// construct the lines
	//parsedResponse = start_tags;

	//return parsedResponse;

}

//