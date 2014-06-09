window.fbAsyncInit = function() {
    FB.init({
        appId : '615789688470381', // APP ID
        status : false,
        xfbml : true
    });

    FB.getLoginStatus(function(response) {
        //console.log(response);
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your app, and response.authResponse supplies the user's ID, a valid access token, a signed request, and the time the access token and signed request each expire
            console.log("user is logged in and has authenticated your app");
            //testAPI();
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            //console.log(accessToken);
            $('#fblogout').removeAttr("disabled");
            $('#fbQ').removeAttr("disabled");
            $('#add_fren').removeAttr("disabled");
            $('#tookIMG').removeAttr("disabled");

            //Get a list of all the albums
            FB.api('/me/albums', function (response) {
                //console.log(response)
                for (album in response.data) {
                    // Find the Profile Picture album
                    if (response.data[album].name == "Profile Pictures") {
                        //console.log("this is the album array" + album)
                        // Get a list of all photos in that album.
                        FB.api(response.data[album].id + "/photos", function(response) {
                            //The image link
                            image = response.data[0].images[0].source;//finding the newest uploaded profile picture
                            $('#user').html("<img src=" + image + " class=\"img-thumbnail\"/> " );
                        });
                    }
                }
            });

            //Get all user_photo scope for knockout.js call
            FB.api('/me', {fields: 'user_photos'}, function(response) {
                console.log(response);
                $(document).ready(function() { initApp(response) });
            });	


            $('#clear').show("slow");
            //Get Friend lists
            FB.api('me/friends', { fields: 'id, name, first_name ,picture'},function(response){
                console.log(response);
                //loop fren list img and append into fren id
                for (var i=0; i<response.data.length; i++) {
                    friendimg = response.data[i].picture.data.url;
                    friendname = response.data[i].name;
                    idlinks = response.data[i].id;
                    friendImages.push(response.data[i].picture.data.url);
                    friendName.push(response.data[i].name);
                    $('aside').append("<a href=http://www.facebook.com/" + idlinks + ">" + "<img data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + friendname +"\" src=" + friendimg + " /> </a>");
                }
                //var message = "FB.api:me/friends has loaded";
                //alertify.log( message);
                $('aside').append("<br><hr><h1>You Have " + "<span id='frenno' style=color:red;>" + response.data.length + "</span> friends</h1>");

            });

            //Get Pages Info
            FB.api('/195394500492498', function(response) {
                //var message = response.name + "Pages JSON data has been loaded";
                //alertify.log( message, "success" );
                //console.log(response);
            });

            //Find newest post
            FB.api('me/posts',function(response){
                //console.log(response);
                var createDIV = document.createElement("div");
                createDIV.setAttribute("style", "font-size:8px;");
                createDIV.setAttribute("id","recentAct");
                $('#welcome').append(createDIV);
                var output = "<ul>";	
                for (var i=0; i<response.data.length; i++) {
                    if (response.data[i].story !== undefined){
                        output +="<li>";
                        output += response.data[i].story;
                        output +="</li>";
                    };
                };
                $('#recentAct').append(output);
                $('#recentAct').prepend("Your Recent Activities are:");
            });

            //Get Info of the user
            FB.api(uid, function(info) {
                //console.log(info); // show in console
                $('#welcome').html("Hello there <span style=\"color:red; \">" + info.first_name + "</span>");
                $('#mymessage').html("Name: "+ info.name + "<br>First name: "+ info.first_name + "<br>ID: "+ info.id + "<br>About Me = " + info.bio );
                var img_link = "http://graph.facebook.com/"+ info.id+"/picture" // using graph api store user's profile picture.
                //$('#user').html("<img src=" + img_link +" /> " );
                });


        } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, but has not authenticated your app
            console.log("this user is not authorizied your apps");
            $('#welcome').html("Hello there , Please Authorizied This apps for your information");
            FB.login(function(response) {
                // FB.api('/me/feed', 'post', {message: 'I\'m started using FB API'});
                if (response.authResponse) { // if user login to your apps right after handle an event
                    $('#welcome').html('please wait a moment.....')
                    window.location.reload();
                };
            }, {scope: 'user_about_me,email,user_location,user_photos,publish_actions,user_birthday,user_likes'});	
            // Permission granted for use who login

        } else {
            // the user isn't logged in to Facebook. status == unknown
            console.log("this isn't logged in to Facebook.");
            FB.login(function(response) {
                if (response.authResponse) {
                    window.location.reload();
                } else {
                    alertify.alert('An Error has Occurs,Please Reload your Pages');
                }
            });
        }
    });
};



// Load the SDK asynchronously
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is successful.
// This testAPI() function is only called in those cases.
function testAPI() {
    console.log('Welcome! Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
    });
}


function postfeed1(){
    FB.ui({
        method: 'feed',
        link: 'http://comm.nccu.edu.tw/02_list_detail.php?sn=931',
        picture: 'http://comm.nccu.edu.tw/material/content/20140207_10_b406bc81e93ab76a607512550fbbdea5.gif',
        caption: '這是政治大學傳播學院網站',
    }, function(response){});
};



function postfeed(){
    FB.ui({
        method: 'feed',
        name: 'The Facebook SDK for Javascript',
        caption: 'Bringing Facebook to the desktop and mobile web',
        description: (
            'A small JavaScript library that allows you to harness ' +
            'the power of Facebook, bringing the user\'s identity, ' +
            'social graph and distribution power to your site.'
        ),
        link: 'https://developers.facebook.com/docs/reference/javascript/',
        picture: 'http://www.fbrell.com/public/f8.jpg'
    }, function(response) {
        if (response && response.post_id) {
            alertify.alert('Post was published.');
        } else {
            alertify.alert('Post was not published.');
        }
    });
};



function addFren(){
    FB.ui({
        method: 'friends',
        id: 'orangeying1024',
    }, function(response) { console.log(response) });
};


//ajax TESTING
function requestClick1(){//Rewrite innerHTML
    var request;
    if (window.XMLHttpRequest) { // determine ActiveX or HttpRequest for cross browser compatibility
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //request.open('GET', 'https://dl.dropboxusercontent.com/s/meoqwhieyv22c32/data.xml');
    request.open('GET', 'data.json');
    request.onreadystatechange = function() {
        if ((request.readyState===4) && (request.status===200)) {
            var items = JSON.parse(request.responseText);
            var output = '<ul>';
            console.log(items);
            for (var key in items) {
                output += '<li>' + items[key].name + '</li>';
                output += '<dd>';
                output += '<li>' + items[key].bio + '</li>';
                output += '</dd>';
            }
            output += '</ul>';
            document.getElementById('update').innerHTML = output;
            console.log(output);
        }
    }
    request.send();
}


//using jquery Ajax Method
function requestClick(){
    $.getJSON('data.json' , function(data){
        console.log(data);
        var output = '<ul>';
        $.each(data, function(key,val){//same as for in javascript
            output += '<li>' + val.name + '</li>';
        });
        output +='</ul>';
        $('#update').append(output);
    });
};


//facebook querry json format
function fbClick(){
    FB.api('/me', function(response) {
        var jsonStr = JSON.stringify(response);
        $('#update pre').show();
        $('#update pre').append(jsonStr);
        $('#fbQ').attr("disabled", "disabled");
        var message = response.name + "JSON data has been loaded";
        alertify.alert( message);
    });
};


//preload friends info into global variables.
var friendImages = [];
var friendName = [];


//search friends with keep call api methods
$('#search1').keyup(function(){
    FB.api('me/friends', { fields: 'name, first_name ,picture'},function(response) {
        var searchField = $('#search').val();
        var myExp = new RegExp(searchField,"i");
        if (searchField !== "" || 0){
            for (var i=0; i<response.data.length; i++) {
                friendname = response.data[i].name;
                var output;
                if(friendname.search(myExp) != -1){ // -1 if no match is found
                    friendimg = response.data[i].picture.data.url;
                    IDnumber = response.data[i].id;
                    output += '<h3> Friends name : ' + friendname + '</h3>';
                    output += '<small> Friends ID : ' + IDnumber + '<small>';
                    output += "<img src=" + friendimg +" /> ";
                    $('#friendscontent').html(output);
                } // if myExp
            } //for loops
        } else {
            $('#friendscontent').html('No result found');
        } // if searchField not equal to zero
        var node = document.getElementById('friendscontent').innerHTML;
        var Replaces = node.replace("undefined" , " " );
        document.getElementById('friendscontent').innerHTML = Replaces
    });
});


//Try with not dynamic search
$('#search').bind("enterKey",function(e){
    var searchField = $('#search').val();
    var message = "Starting Search.....";
    alertify.log( message, "custom" );
    if (searchField !== "" || 0) {
        var myExp = new RegExp(searchField,"i");
        for (var i=0; i<friendName.length; i++) {
            friendname = friendName[i];
            if (friendname.search(myExp) != -1) {// -1 if no match is found
                friendimg = friendImages[i];
                var output;
                output += "<div><img src=" + friendimg +" > ";
                output += "<h4 style='display:inline-block'> Friends name : <small>" + friendname + "</small></h4></div>";
                $('#friendscontent').html(output);
                $( "img[title='" + friendname +"']" ).show("slow");
                var friendsnumber = $("#friendscontent > div").length;
                $('#frenno').html(friendsnumber);
                var message = "Your have found " + friendsnumber + " friends";
                alertify.log( message, "custom" );
            } else {
                $( "img[title='" + friendname +"']" ).hide();
                var friendsnumber = $("#friendscontent > div").length;
                $('#frenno').html(friendsnumber);
            } // if myExp
        } //for loops
    } else {
        $('#friendscontent').html('No Result Found ');
        $('img').show();
    } // if searchField not equal to zero
    var node = document.getElementById('friendscontent').innerHTML;//fix undifined problem
    var Replaces = node.replace("undefined" , " " );
    document.getElementById('friendscontent').innerHTML = Replaces;	
});
$('#search').keyup(function(e){
    if (e.keyCode == 13) { $(this).trigger("enterKey") };
});





// Dynamic search friends with preloaded arrays PROBLEM ALOT with LAGGGGINGGGGGG
$('#searc1h').keyup(function(){
    var searchField = $('#search').val();
    if (searchField !== "" || 0) {
        var myExp = new RegExp(searchField,"i");
        for (var i=0; i<friendName.length; i++) {
            friendname = friendName[i];
            if (friendname.search(myExp) != -1) {// -1 if no match is found
                friendimg = friendImages[i];
                var output;
                output += "<div><img src=" + friendimg +" > ";
                output += "<h4 style='display:inline-block'> Friends name : <small>" + friendname + "</small></h4></div>";
                $('#friendscontent').html(output);
                $( "img[title='" + friendname +"']" ).show();
                var friendsnumber = $("#friendscontent > div").length
                $('#frenno').html(friendsnumber);
            } else {
                $( "img[title='" + friendname +"']" ).hide();
                $("#clear").show();
            } // if myExp
        } //for loops
    } else {
        $('#friendscontent').html('No Result Found ');
        $('img').show();
    } // if searchField not equal to zero
    var node = document.getElementById('friendscontent').innerHTML;
    var Replaces = node.replace("undefined" , " " );
    document.getElementById('friendscontent').innerHTML = Replaces;	
});



//clear updated content
function clear1(){
    $('#friendscontent').empty();
    $('#friendscontent').html('No Result Found ');
    $('img').show();
    var message = "Your have clear all Search Result";
    alertify.log( message, "custom" );
}



//Jquery Append ITEMs
function requestClick2(){
    var request;
    if (window.XMLHttpRequest) { // determine ActiveX or HttpRequest for cross browser compatibility
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    request.open('GET', 'data.txt');
    console.log(request);
    request.onreadystatechange = function() {
        if ((request.readyState===4) && (request.status===200)) {
            $('#update').append(request.responseText);
        }
    }
    request.send();
}

//HTML2CANVAS
function captureImage(){
    var canvas;
    html2canvas($('#main'), {
"logging": true, //Enable log (use Web Console for get Errors and Warings)
        "proxy":"http://140.119.169.167/temp/html2canvasproxy.php",
        "onrendered": function(canvas) {
            //var uridata = canvas.toDataURL("image/png");
            
            
var img = new Image();
                        img.onload = function() {
                            document.body.appendChild(img);
                        };
                        img.error = function() {
                            if(window.console.log) {
                                window.console.log("Not loaded image from canvas.toDataURL");
                            } else {
                                alert("Not loaded image from canvas.toDataURL");
                            }
                        };
                        img.src = canvas.toDataURL("image/png");
window.open(img.src);
        }
    });
};



//FB.logout
$('#fblogout').click(function(){
    console.log("clicked");
    var message = "Are You Sure wanna Logout?";
    alertify.confirm( message, function (e) {
        if (e) {
            FB.logout(function(response) {
                window.location.reload();
            });
        } else {
            //after clicking Cancel
        }
    });
});

