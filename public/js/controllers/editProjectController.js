var app = angular.module('editProjectController', ['postProjectFactory', 'getProductFactory', 'editProjectFactory', 'checkPwFactory'])

  .controller('editProjectCtrl', editProjectCtrl)

  editProjectCtrl.$inject = ['$http', 'postProject', 'getProduct', 'editProject', 'checkPw']
  function editProjectCtrl($http, postProject, checkPw){
    var self = this;
    window.localStorage.checkPw = false;
    checkPw.checkPassword();
    var productId = window.location.hash.split('/')[3];
    $http({
      method: "GET"
      ,url: "/api/product/"+productId
    })
    .then(function(product){
      self.currentProduct = product.data;
      loadData(self.currentProduct);
    })

    function loadData(productObject){
      console.log(productObject);
      //////load text inputs
      $('.newProductTitle').val(productObject.name)
      $('.newProductDescription').val(productObject.description);
      $('.newProductTagsInput').val(productObject.tags.join(', '))
      $('.newProductCollectionsInput').val(productObject.collections.join(', '))
      $('.newProductType').val(productObject.productType);
      $('.newProductVendor').val(productObject.vendor);
      /////add photos
      var addImgsFunc = function(){
        $('.newProductCurrentImage').attr('src', productObject.images[0])
        for (var i = 0; i < productObject.images.length; i++) {
          $('#newProductMiniImage'+i).attr('src' , productObject.images[i]);
        }
      }
      addImgsFunc();
      //////functions for addding swatches
      function addSeasons(){
        var seasonHtmlArray = $('.createSeason');
        var currentValues = productObject.seasons;
        for (var i = 0; i < seasonHtmlArray.length; i++) {
          var elType = seasonHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(seasonHtmlArray[i]).addClass('picked');
              $(seasonHtmlArray[i]).attr('id', "picked_Season_"+currentValues[j]);
              $(seasonHtmlArray[i]).css({
                  backgroundColor: "blue"
              })
            }
          }
        }
      }
      addSeasons();
      function addFabrics(){
        var fabricHtmlArray = $('.createFabric');
        var currentValues = productObject.fabrics;
        for (var i = 0; i < fabricHtmlArray.length; i++) {
          var elType = fabricHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(fabricHtmlArray[i]).addClass('picked');
              $(fabricHtmlArray[i]).attr('id', "picked_Fabric_"+currentValues[j]);
              $(fabricHtmlArray[i]).css({
                backgroundColor: "blue"
              })
            }
          }
        }
      }
      addFabrics();
      function addStitches(){
        var stitchHtmlArray = $('.createStitch');
        console.log(stitchHtmlArray);
        var currentValues = productObject.stitchPatterns;
        console.log(currentValues);
        for (var i = 0; i < stitchHtmlArray.length; i++) {
          var elType = stitchHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            console.log('------------------------');
            console.log(currentValues[j]);
            console.log(elType);
            if( elType == currentValues[j]){
              $(stitchHtmlArray[i]).addClass('picked');
              $(stitchHtmlArray[i]).attr('id', "picked_Stitch_"+currentValues[j]);
              $(stitchHtmlArray[i]).css({
                backgroundColor: "blue"
              })
            }
          }
        }
      }
      addStitches();
      function addColors(){
        var colorsHtmlArray = $('.createColor');
        console.log(colorsHtmlArray);
        var currentValues = productObject.colors;
        for (var i = 0; i < colorsHtmlArray.length; i++) {
          var elType = colorsHtmlArray[i].classList[1].slice(6, 20);
          console.log(elType);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(colorsHtmlArray[i]).addClass('picked');
              $(colorsHtmlArray[i]).attr('id', "picked_Color_"+currentValues[j]);
              $(colorsHtmlArray[i]).css({
                backgroundColor: "blue"
              })
            }
          }
        }
      }
      addColors();
      function addButtons(){
        var buttonHtmlArray = $('.createButton');
        console.log(buttonHtmlArray);
        var currentValues = productObject.buttons;
        for (var i = 0; i < buttonHtmlArray.length; i++) {
          var elType = buttonHtmlArray[i].classList[1].slice(6, 20);
          for (var j = 0; j < currentValues.length; j++) {
            if( elType == currentValues[j]){
              $(buttonHtmlArray[i]).addClass('picked');
              $(buttonHtmlArray[i]).attr('id', "picked_Button_"+currentValues[j]);
              $(buttonHtmlArray[i]).css({
                backgroundColor: "blue"
              })
            }
          }
        }
      }
      addButtons();
    }
  ////////////////////////////
  ////////////////////////////
  //////end edit controller///
  //////////begin code to controler all upload functions (mirrored from create page)
  //////global variables we'll be using for moving the carousel
  var carouselMargin = 0; ///keeps track of carousel's margin
  var carouselCounter = 0;///keeps track of carousel's postion in the queue
  self.miniPhotoCounter = 0;
  self.tempPhotoCache = [];
  self.tempPhotoHTMLCache = [];
  /////end global variables

  ////////////////////////////////////////
  /////////Effects for carousel//////////
  ////click effect for seasonsplash
  function swatchLogic(swatchType){
    ///////note: swatchType needs to be added as a capital, i.e. "Season"
    $('.create'+swatchType).on('click', function(evt){
      if($(evt.target).css('opacity') == 1 ){
        $(evt.target).css({
          opacity: 0.5
          ,backgroundColor: "blue"
        })
        $(evt.target).attr('id', 'picked_'+swatchType+"_"+evt.target.innerText.split(' ').join(''));
        $(evt.target).addClass('picked');
      } else {
        $(evt.target).css({
          opacity: 1
          ,backgroundColor: "black"
        })
      }
    })
  }
  swatchLogic("Season");
  swatchLogic("Fabric");
  swatchLogic("Color");
  swatchLogic("Button");
  swatchLogic("Stitch");

  ///////////////////////////////////////////////////
  ///////////////build function to collect and submit
  $('.createSubmit').on('click', function(){
    self.createNewProject = {
      name: $('.carouselNameEntry').val()
      ,timestamp: ""
      ,images: []
      ,groups: []
      ,productType: ""
      ,tags: []
      ,vendor: ""
      ,colors: []
      ,fabrics: []
      ,buttons: ""
      ,stitchPattern: ""
      ,season: ""
    }
    var pickedElems = $('.picked');
    for (var i = 0; i < pickedElems.length; i++) {
      if(pickedElems[i].id.split('_')[1] == "Season"){
        self.createNewProject.season = pickedElems[i].id.split('_')[2];
      }
      else if(pickedElems[i].id.split('_')[1] == "Color"){
        self.createNewProject.colors.push(pickedElems[i].id.split('_')[2])
      }
      else if(pickedElems[i].id.split('_')[1] == "Fabric"){
        self.createNewProject.fabrics.push(pickedElems[i].id.split('_')[2])
      }
      else if(pickedElems[i].id.split('_')[1] == "Buttons"){
        self.createNewProject.buttons = pickedElems[i].id.split('_')[2];
      }
      else if(pickedElems[i].id.split('_')[1] == "Stitch"){
        self.createNewProject.stitchPattern = pickedElems[i].id.split('_')[2];
      }
    }
    $http({
      method: "POST"
      ,url: "/api/products/update"
      ,data: self.createNewProject
    })
    .then(function(newProjectStuff){
    })
  })

  /////////Effects for carousel//////////
  ////////////////////////////////////////


  ///////////////////////////////////////////
  //////////begin logic for moving carousel//
  ///function controlling carousel movement forward
  function moveNext(){
    var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
    var moveDistance = carouselMargin - singleCellDistance;
    carouselMargin = moveDistance;
    carouselCounter ++;
    // getName();
    $('.carouselBacking').animate({
      marginLeft: moveDistance
    })
  }

  ///function controlling carousel movement forward
  function movePrevious(){
    var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
    var moveDistance = carouselMargin + singleCellDistance;
    carouselMargin = moveDistance;
    carouselCounter --;
    $('.carouselBacking').animate({
      marginLeft: moveDistance
    }, 200)
  }

  ///on-click, move to next page
  $('.carouselRight').on('click', function(){
    if(carouselCounter < 7){
      moveNext();
    }
    highlightCounter();
  })

  //on click, move to the last page
  $('.carouselLeft').on('click', function(){
    if(carouselCounter > 0){
      movePrevious();
    }
    highlightCounter();
  })
  //////////end logic for moving carousel////
  ///////////////////////////////////////////

  ////////////////////////////////////////////
  /////////begin logic for progress counter///
  function highlightCounter(){
    if(carouselCounter == 0){
      $('.circle0').css({
        backgroundColor: 'white',
        color: 'black'
      })
      for (var i = 1; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 1){
      $('.circle1').css({
        backgroundColor: 'white',
        color: 'black'
      })
      $('.circle0').css({
        backgroundColor: "black",
        color: 'white'
      })
      for (var i = 2; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 2){
      $('.circle2').css({
        backgroundColor: 'white',
        color: 'black'
      })
      for (var i = 3; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      for (var i = 0; i < 2; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 3){
      $('.circle3').css({
        backgroundColor: 'white',
        color: 'black'
      })
      for (var i = 4; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      for (var i = 0; i < 3; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 4){
      $('.circle4').css({
        backgroundColor: 'white',
        color: 'black'
      })
      for (var i = 0; i < 4; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      for (var i = 5; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 5){
      $('.circle5').css({
        backgroundColor: 'white',
        color: 'black'
      })
      for (var i = 0; i < 5; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      for (var i = 6; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 6){
      $('.circle6').css({
        backgroundColor: 'white',
        color: 'black'
      })
      for (var i = 0; i < 6; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      for (var i = 7; i < 8; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
    } else if(carouselCounter == 7){
      for (var i = 0; i < 7; i++) {
        $('.circle'+i).css({
          backgroundColor: "black",
          color: 'white'
        })
      }
      $('.circle7').css({
        backgroundColor: 'white',
        color: 'black'
      })
    }
  }
  highlightCounter(); //run to set counter on load

  /////////end logic for progress counter/////
  ////////////////////////////////////////////

  ////////////////////////////////////////////
  //////begin logic for click to switch page//
  function circleClick(){
    $('.circle0').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle1').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle2').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle3').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle4').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[6];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle5').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle6').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
    $('.circle7').on('click', function(evt){
      var circlePositionBeta = $(evt.target)[0];
      var circlePosition = $(circlePositionBeta)[0].id.split('')[7];
      clickDistance(circlePosition);
      highlightCounter();
    })
  }
  circleClick();

  ////function for calculating distance
  function clickDistance(circlePosition){
    var spaces = circlePosition - carouselCounter;
    var singleCellDistance = $('.carouselBacking').width()* (0.12) + 4;
    var moveDistance = carouselMargin + (singleCellDistance*spaces*-1);
    carouselMargin = moveDistance;
    carouselCounter = circlePosition;
    $('.carouselBacking').css({
      marginLeft: moveDistance
    })
  }

  //////end logic for click to switch page//
  ////////////////////////////////////////////

  ///////////////////////////////////////////
  ////////Begin Logic for uploading photos///
  /////listens for change to file upload, creating an event every time there is a change
  function changeEffect(){
    $('#i_file').change( function(event) {
      if(self.miniPhotoCounter >= 0 && self.miniPhotoCounter < 4){
        frontendPhotoDisplay();
        $('#i_file').remove();
        $('.inputFileHolder').append(
          '<input type="file" id="i_file" name="files">'
        )
        changeEffect()
        self.miniPhotoCounter = self.tempPhotoCache.length;
      }
      else{
        alert('better delete some photos if you want to add more')
      }
    });
  }
  changeEffect();

  function frontendPhotoDisplay(){
    var tmppath = URL.createObjectURL(event.target.files[0]);//new temp url
    $(".newProductCurrentImage").attr('src',tmppath);////turn big image to what was just picked
    self.tempPhotoCache[self.miniPhotoCounter] = event.target.files[0]////add photo to the cache so we can send later
    self.tempPhotoHTMLCache[self.miniPhotoCounter] = event.target
    console.log(self.tempPhotoHTMLCache);
    $('#newProductMiniImage'+self.miniPhotoCounter).attr('src', tmppath)
    $('#newProductMiniImage'+self.miniPhotoCounter).css({
      outline: "3px solid orange"
    })
    self.miniPhotoCounter++;
    highlightMini();
  }
  //////function to delete the photo inside of a mini photo on click
  function deleteMiniPhoto(evt){
    var targetImage = $(evt.currentTarget.previousElementSibling);
    var placeInLine = targetImage[0].id.split('').pop();
    self.tempPhotoCache.splice(placeInLine, 1);///our master photo array should be adjusted
    self.tempPhotoHTMLCache.splice(placeInLine, 1);///our master photo array should be adjusted
    $('.newProductCurrentImage').attr('src', URL.createObjectURL(self.tempPhotoCache[0]));
    self.miniPhotoCounter = self.tempPhotoCache.length//sets this to the slot one after our last active upload;
    highlightMini();
    ///////now we need to reorder all of the remaining mini photos so that there are no spaces
    var allMiniPhotosLength = $('.newProductMiniImage').length;//array of all photos as elements
    for(var i = 0; i < allMiniPhotosLength; i++) {
      $('#newProductMiniImage'+i).attr('src', '');
      if(i < self.tempPhotoCache.length){
        var imageShift = $('#newProductMiniImage'+i)[0];
        $(imageShift).attr('src', URL.createObjectURL(self.tempPhotoCache[i]))
        // $('#newProductMiniImage'+i).src( URL.createObjectURL(self.tempPhotoCache[i]))
      }
      else if(i >= self.tempPhotoCache.length){
        var imageShift = $('#newProductMiniImage'+i)[0];
        $(imageShift).attr('src', '');
        $(imageShift).css({
          outline: '1px dashed gray'
        })
      }
    }
  }
  $('.newProductDeleteMini').on('click', deleteMiniPhoto);///Make all the small photo x buttons work

  function changeMiniPhoto(event){
    var source = $(event.target)[0].src;
    $(".newProductCurrentImage").attr('src', source);
    var photoNumber = $(event.target)[0].id.split('').pop();
    self.miniPhotoCounter = photoNumber;
    highlightMini();
  }
  $('.newProductMiniImageImage').on('click', changeMiniPhoto)

  ///create function to highlight mini image that's about to be updated
  function highlightMini(){
    var arrLength = $('.newProductMiniImage').length;
    $('#newProductMiniImage0').css({
      borderBottom: "1px solid white"
    })
    $('#newProductMiniImage1').css({
      borderBottom: "1px solid white"
    })
    $('#newProductMiniImage2').css({
      borderBottom: "1px solid white"
    })
    $('#newProductMiniImage3').css({
      borderBottom: "1px solid white"
    })
    $('#newProductMiniImage'+self.miniPhotoCounter).css({
      borderBottom: "12px solid #9F81F7"
    })
  }
  highlightMini();
  ////////End Logic for uploading photos/////
  ///////////////////////////////////////////

  ///////////////function to send full create http request
  function editProject(evt){
    console.log('something');
    var name = $('.newProductTitle').val();
    var timestamp = new Date();
    // var images = self.tempPhotoCache;
    var imagesHTML = self.tempPhotoHTMLCache;
    var collections = $('.newProductCollectionsInput').val().split(' ');
    var productType = $('.newProductTypeDropdown').val();
    var tags = $('.newProductTagsInput').val().split(' ');
    var vendor = $('.newProductVendor').val();
    var description = $('.newProductDescription').val();
    var colorsFunc = function(){
      var allPicked = $(".picked");
      var colorsArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        if(allPicked[i].id.split('_')[1] == 'Color')
        colorsArray.push(allPicked[i].id.split('_')[2])
      }
      return colorsArray;
    }
    var colors = colorsFunc();
    var fabricsFunc = function(){
      var allPicked = $(".picked");
      var fabricsArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        if(allPicked[i].id.split('_')[1] == 'Fabric')
        fabricsArray.push(allPicked[i].id.split('_')[2])
      }
      return fabricsArray;
    }
    var fabrics = fabricsFunc();
    var seasonsFunc = function(){
      var allPicked = $(".picked");
      var seasonsArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        if(allPicked[i].id.split('_')[1] == 'Season')
        seasonsArray.push(allPicked[i].id.split('_')[2])
      }
      return seasonsArray;
    }
    var seasons = seasonsFunc();
    var stitchesFunc = function(){
      var allPicked = $(".picked");
      var stitchesArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        if(allPicked[i].id.split('_')[1] == 'Stitch')
        stitchesArray.push(allPicked[i].id.split('_')[2])
      }
      return stitchesArray;
    }
    var stitches = stitchesFunc();
    var buttonsFunc = function(){
      var allPicked = $(".picked");
      var stitchesArray = [];
      for (var i = 0; i < allPicked.length; i++) {
        if(allPicked[i].id.split('_')[1] == 'Button')
        stitchesArray.push(allPicked[i].id.split('_')[2])
      }
      return stitchesArray;
    }
    var buttons = buttonsFunc();
    var statusVar = $(evt.target)[0].className.split('_')[2];
    if(statusVar == 'send'){
      var status = 'submitted to curator'
    } else if(statusVar == 'save'){
      var status = 'saved'
    }
    /////putting together whole object to send
    var newProjectObject = {
      projectId: window.location.hash.split('/')[3]
      ,name: name
      ,timestamp: timestamp
      ,description: description
      ,productType: productType
      ,tags: tags
      ,collections: collections
      ,vendor: vendor
      ,colors: colors
      ,fabrics: fabrics
      ,seasons: seasons
      ,stitchPatterns: stitches
      ,buttons: buttons
      ,status: status
    }
    console.log(newProjectObject);
    console.log(newProjectObject);
    editProjectToDb(newProjectObject, submitPhotos)
    // editProject().editProject(newProjectObject, submitPhotos)///post the object
  }
  $('.new_product_send').on('click', editProject);
  $('.new_product_save').on('click', editProject);

  /////function to update a project (will go in a factory)
  function editProjectToDb(projectArray, callback){
    console.log('in factory');
    console.log(projectArray);
    return $http({
      method: "POST"
      ,url: "/api/product/update"
      ,data: projectArray
    })
    .then(function(newProjectInfo){
      console.log('posted project');
      console.log(newProjectInfo);
      console.log('that was just the Id to compare against');
      callback(newProjectInfo.data._id);
      // return newProjectInfo;
    })
  }
  // setInterval(function(){
  //   console.log($('#i_file'));
  // }, 1000)
  function submitPhotos(productIdToUpdate){
    console.log(self.tempPhotoHTMLCache.length);
    $(".bodyview").append(
      "<form class='tempForm' action='/api/pictures' method='POST' enctype='multipart/form-data'>"+
      "</form>"
    )
    //
    console.log($(self.tempPhotoHTMLCache[0]));
    console.log($(self.tempPhotoHTMLCache[1]));
    console.log($(self.tempPhotoHTMLCache[2]));
    console.log($(self.tempPhotoHTMLCache[3]));
    if(self.tempPhotoHTMLCache[0]){
      $('.tempForm').append(self.tempPhotoHTMLCache[0]);
    }
    if(self.tempPhotoHTMLCache[1]){
      $('.tempForm').append(self.tempPhotoHTMLCache[1]);
    }
    if(self.tempPhotoHTMLCache[2]){
      $('.tempForm').append(self.tempPhotoHTMLCache[2]);
    }
    if(self.tempPhotoHTMLCache[3]){
      $('.tempForm').append(self.tempPhotoHTMLCache[3]);
    }
    $('.tempForm').append(
      "<input name='productId' type='text' value='"+productIdToUpdate+"'>"
    );
    console.log(self.tempPhotoHTMLCache);
    $('.tempForm').submit();
  }

  ///logout button functionality
  $('.logoutButton').on('click', function(){
    window.localStorage.hofbToken = "";
    window.location.hash = "#/signin"
  })


    ///////////////////////////////////////////////
    //////Begin logic for photo popup modal////////
    $('.newProductCurrentImage').on('click', function(){
      console.log($('.bodyview'));
      $('.bodyview').prepend(
        '<div class="photoModal">'+
          "<div class='modalFiller'>"+
          "</div>"+
          "<div class='modalPhotoHolder'>"+
            "<img class='modalImage' src='"+$('.newProductCurrentImage').attr('src')+"'>"+
          '</div>'+
          "<div class='modalFiller'>"+
          "</div>"+
        '</div>'
      )
      $('.modalFiller').on('click', function(){
        $('.photoModal').remove();
      })/////function to view a full page modal on click
    });
    //////End logic for photo popup modal//////////
    ///////////////////////////////////////////////


  ////////////////////////////////
  ///////////////////////////////
  ///////End all controller Code///
  }
