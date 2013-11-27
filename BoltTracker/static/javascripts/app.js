var preventDefaultArray = ['#splash', 'header', 'footer', 'aside'];


$.fn.hasOverflow = function() {
    var $this = $(this);
    var $children = $this.find('*');
    var len = $children.length;

    if (len) {
        var maxWidth = 0;
        var maxHeight = 0
        $children.map(function(){
            maxWidth = Math.max(maxWidth, $(this).outerWidth(true));
            maxHeight = Math.max(maxHeight, $(this).outerHeight(true));
        });

        return maxWidth > $this.width() || maxHeight > $this.height();
    }

    return false;
};

for (val in preventDefaultArray) {
    $(preventDefaultArray[val]).bind('touchmove', function(e){
        e.preventDefault();
    });
}


$('#main-article').bind('touchmove', function(e){
    Lungo.Aside.hide();
});

$$('.order').singleTap(function() {
    var order = $(this);

    if (!order.hasClass('wide')) {
        order.find('.order-details').show();
        order.height(order.find('.table-summary').offset().top - order.offset().top + 40);
    }
    else {
        order.height(95);
        setTimeout( function() {
            order.find('.order-details').hide();
        }, 300);
    }

    order.toggleClass('wide');
});

function loadOrders() {
    $.getJSON('test.json', function(data){
        alert(data);
    });
}