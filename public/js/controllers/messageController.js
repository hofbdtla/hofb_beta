angular.module('messageController', ['allMessagesFactory', 'checkPwFactory'])

  .controller('messageCtrl', messageCtrl);

  messageCtrl.$inject = ['$http', 'allMessages', 'checkPw'];
  function messageCtrl($http, allMessages, checkPw){
    var self = this;
    window.localStorage.checkPw = false;
    checkPw.checkPassword();
    function allMessagesFunc(setHtmlCallback){
      $http({
        method: "GET"
        ,url: '/api/checkstatus/'+ window.localStorage.hofbToken
      })
      .then(function(decodedToken){
        self.decodedToken = decodedToken;
        $http({
          method: "GET"
          ,url: "/api/conversations/"+decodedToken.data.name
        })
        .then(function(allConversations){
          self.allConversations = allConversations.data;
          console.log(self.allConversations);
          setHtmlCallback(self.allConversations);
        })
      })
    }

    function addEmailHtml(list){
      for (var i = 0; i < list.length; i++) {
        $('.messageContainer').append(
          '<div class="messagesCell">'+
            "<div class='messageListSquareContainer'>"+
              "<img class='messageListSquareContainerSquare' src='"+list[i].imageUrl+"' id='"+list[i].productId+"'>"+
              "</img>"+
            "</div>"+
            "<div id='"+list[i]._id+"' class='messageContentHolder'>"+
              "<div class='messageListContentTitle'>"+
                list[i].productName +
              "</div>"+
            "</div>"+
          "</div>"
        )
      }
      addInteractionToMessages(list);
    }

    function addInteractionToMessages(convoList){
      $('.messageContentHolder').on('mouseleave', function(evt){
        for (var i = 0; i < $('.messagesCell').length; i++) {
          $($('.messagesCell')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
        for (var i = 0; i < $('.messageListContentTitle').length; i++) {
          $($('.messageListContentTitle')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
        for (var i = 0; i < $('.messageContentHolder').length; i++) {
          $($('.messageContentHolder')[i]).css({
            'backgroundColor': "#B2B2B4"
            ,color: "black"
          })
        }
      })
      $('.messageContentHolder').on('mouseenter', function(evt){
        var elemen = $($(evt.target)[0].parentNode);
        elemen.css({
          backgroundColor: "black"
          ,color: 'white'
        })
        $(evt.target).css({
          backgroundColor: "black"
          ,color: 'white'
        })
        $($(evt.target)[0].children[0]).css({
          backgroundColor: "black"
          ,color: 'white'
        })
        elemen.attr('id', 'lit');
      })
      $('.messageListSquareContainerSquare').on('click', function(evt){
        console.log(evt.target);
        var productId = evt.target.id;
        window.location.hash = "#/view/product/"+productId;
      })
      $('.messageContentHolder').on('click', function(evt){
        $('.messageChatWindowList').html('');
        for (var i = 0; i < convoList.length; i++) {
          if(convoList[i]._id == evt.target.id){
            console.log(convoList[i].comments.length);
            for (var j = 0; j < convoList[i].comments.length; j++) {
              if(j%2 == 0){
                $('.messageChatWindowList').append(
                  '<div class="messageContent">'+
                    "<p class='messageSender'>"+convoList[i].comments[j].sender+"</p>"+
                    "<p class='messageText'>"+convoList[i].comments[j].messageText+"</p>"+
                  "</div>"
                )
              }
              else {
                $('.messageChatWindowList').append(
                  '<div class="messageContentOdd">'+
                    "<p class='messageTextOdd'>"+convoList[i].comments[j].messageText+"</p>"+
                  "</div>"
                )
              }
            }
          }
        }
      })
    }
    allMessagesFunc(addEmailHtml);/////call the function to load all messages

    ///logout button functionality
    $('.logoutButton').on('click', function(){
      window.localStorage.hofbToken = "";
      window.location.hash = "#/signin";
    })
  /////////end of the messages controller
  ///////////////////////////////////////
  ///////////////////////////////////////
  }
