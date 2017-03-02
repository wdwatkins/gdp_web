 //Ran into Scope issues and this is the way I could find the elements I wanted events on
 $('body').on('click', function(event){
     if($(event.target.parentElement).is($('#copyCitation'))){
        copyToClipboard(document.getElementById("copyTarget"));
     }
     else if($(event.target).is($('.welcomeToggleButton'))){
         toggleWelcomeArea();
     }
     else if($(event.target).parent().is($('.welcomeToggleButton'))){
         toggleWelcomeArea();
     }
     else if($(event.target).parents().is($('#gdpGui'))){
         toggleWelcomeArea();
     }
 });
 
 function toggleWelcomeArea(){
     //Hides Welcome Content
     $('.welcome-content').slideToggle('slow');
     //Removes margin from top to rest neatly against header
     $('.toggleButtonArea').toggleClass('noMargin');
     //Triggers animation for toggle button
     $('.welcomeToggleButton').toggleClass('animationTrigger');
     //Rotatates arrow inside toggle button
     $('.toggleArrow').toggleClass('rotate');
 }
 
 //Took this off of stack overflow, works, but up for better suggestions if there are any
 function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    //Places a Copy Success Message then removes it from DOM
    if(succeed === document.execCommand("copy")){
        $('.citationHolder').append('<div class="success">Citation Copy Successful</div>');
        $('.success').fadeOut(3000, function(){
            $(this).remove();
        });
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}


 
 