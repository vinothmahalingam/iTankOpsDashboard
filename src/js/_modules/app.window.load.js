/**
 * window load function
 **/
 
$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");
    /**
     * reduce double fire issues
     **/
    if (prevType != e.type) {   
        switch (e.type) {
            case "blur":
                $.root_.toggleClass("blur")

                if (myapp_config.debugState)
                console.log("blur");
            
                break;
            case "focus":
                $.root_.toggleClass("blur")
                if (myapp_config.debugState)

                console.log("focused");

                break;
        }
    }

    $(this).data("prevType", e.type);
})