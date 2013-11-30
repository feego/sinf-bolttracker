var preventDefaultArray = ['#splash', 'header', 'footer', 'aside'];

var loggedUser = {};

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

$('#login-button').click(function() {
    var username = $('#txt-signup-name').val(),
    userhash = String(CryptoJS.SHA512(username + $('#txt-signup-password').val()));
    var url = '/bolttracker/service/clientes.php?id=' + username + "&hash=" + userhash;

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var dataObj = jQuery.parseJSON(data);
            window.Lungo.Router.section("main");

            $('#main > header > p').text(dataObj.Nome);
            loggedUser = { id: username, hash: userhash };
            $('#search-button').show();
            disableAside = false;

            var filters = { "idCliente": loggedUser.id, "hashCliente" : loggedUser.hash };
            loadClientOrders(filters);
        }
    });
});

$('#track-button').click(function() {
    var filtersArray = { "idEncomenda": $('#txt-order-id').val() };

    $.ajax({
        url: '/bolttracker/service/encomendas.php',
        type: 'POST',
        dataType: 'json',
        data: ({ filters: filtersArray }),
        success: function(data){
            var dataObj = jQuery.parseJSON(data);
            window.Lungo.Router.section("main");

            $('#main > header > p').text("");
            loggedUser = { id: "", hash: "" };
            $('#search-button').hide();
            disableAside = true;
            
            $('#main-article').empty();
            $('#main-article').append(getOrderHtml(dataObj[0]));
        }
    });
});

function loadClientOrders(filtersArray) {
    $.ajax({
        url: '/bolttracker/service/encomendas.php',
        type: 'POST',
        dataType: 'json',
        data: ({ filters: filtersArray }),
        success: function(data){
            var dataObj = jQuery.parseJSON(data);

            $('#main-article').empty();

            for (var order in dataObj) {
                $('#main-article').append(getOrderHtml(dataObj[order]));
            }
        }
    });
}

function getOrderTotalUnits(orderData) {
    var counter = 0;
    for (var item in orderData.Itens) {
        counter += orderData.Itens[item].QuantidadeEncomendada;
    }
    return counter;
}

function getItemColor(status) {
    if (status == "Satisfeito")
        return "green";
    else if (status == "Parcialmente Satisfeito")
        return "yellow";
    else 
        return "red";
}

function getItemClass(status) {
    if (status == "Satisfeito")
        return "liquid";
    else if (status == "Parcialmente Satisfeito")
        return "exped";
    else 
        return "regist";
}

function getOrderProgressColor(status) {
    if (status == "Em progresso")
        return "warning";
    else if (status == "Satisfeita")
        return "success";
    else 
        return "danger";
}

function getProgressTitleColor(status) {
    if (status == "Em progresso")
        return "#f0ad4e";
    else if (status == "Satisfeita")
        return "#5cb85c";
    else 
        return "#d9534f";
}

function getOrderHtml(orderData) {
    var emAbertoNumerador = 0, parcSatisfNumerador = 0, satisfNumerador = 0, denominador = 0;

    var html = '<div class="order">';

    html += '<strong>' + orderData.Serie + "/" + orderData.NumDoc + '</strong>';
    html += '<div class="progress progress-striped">';
    html += '<div class="progress-bar progress-bar-' + getOrderProgressColor(orderData.Estado) + '" role="progressbar" aria-valuenow="10" aria-valuemin="10" aria-valuemax="100" style="width: ' + orderData.PercentagemConclusao + '%"></div></div>';
    html += '<div class="progress-title" style="color: ' + getProgressTitleColor(orderData.Estado) + ';">' + orderData.Estado + '</div>';
    html += '<table><tr><th>Data</th><th>Items</th><th>Total de unidades</th><th class="price-header">Preço total (s/IVA e c/IVA)</th></tr>';
    html += '<tr><td><p>' + orderData.Data.split(" ")[0] + '</p></td>';
    html += '<td><p>' + orderData.NumeroItens + '</p></td>';
    html += '<td><p>' + getOrderTotalUnits(orderData) + '</p></td>';
    html += '<td><p class="price-iva">/' + orderData.PrecoTotalComIva + '€</p><p class="price">' + orderData.PrecoTotalSemIva + '€</p></td></tr>';
    html += '</table><p class="more-dots">...</p>';

    html += '<div class="order-details"><table class="table-details">';
    html += '<tr><th></th><th>Item</th><th>Peso unitário</th><th>Quantidade satisfeita</th><th>Preço unitário (s/IVA)</th><th>Preço total (s/IVA e c/IVA)</th></tr>';
    

    for (var item in orderData.Itens) {
        html += '<tr class="item ' + getItemClass(orderData.Itens[item].Estado) + '">';
        html += '<td><div></div></td><td><div class="item-desc">';
        html += '<p class="ref-label">' + orderData.Itens[item].IdArtigo + '</p>';
        html += '<p class="desc-label">' + orderData.Itens[item].Descricao + '</p>';
        html += '<strong class="' + getItemColor(orderData.Itens[item].Estado) + '-label">' + orderData.Itens[item].Estado + '</strong>';
        orderData.Itens[item].PesoUnitario = 3;
        html += '</div></td><td style="padding-bottom:15px;"><p>' + ((orderData.Itens[item].PesoUnitario == 0) ? "-" : orderData.Itens[item].PesoUnitario + ' Kg') + '</p></td>';
        html += '<td style="padding-bottom:8px;"><p class="price-iva"><span class="price">' + orderData.Itens[item].QuantidadeSatisfeita + '</span>/' + orderData.Itens[item].QuantidadeEncomendada + '</p></td>';
        html += '<td style="padding-bottom:15px;"><p>' + orderData.Itens[item].PrecoUnitarioSemIva + ' €</p></td>';
        html += '<td><p class="price-iva"><span class="price">' + orderData.Itens[item].PrecoTotalSemIva + ' €</span>/' + orderData.Itens[item].PrecoTotalComIva + ' €</p>';
    
        denominador++;
        switch (orderData.Itens[item].Estado) {
            case "Satisfeito":
                satisfNumerador++;
                break;
            case "Parcialmente Satisfeito":
                parcSatisfNumerador++;
                break;
            default:
                emAbertoNumerador++;
                break;
        }
    }



    html += '</td></tr></table><table class="table-summary"><tr>';
    html += '<th><strong class="red-label">Em aberto</strong></th><th><strong class="yellow-label">Parcialmente satisfeitos</strong></th><th><strong class="green-label">Totalmente satisfeitos</strong></th>';
    html += '</tr><tr><td><p class="total"><span class="parcell">' + emAbertoNumerador + '</span>/' + denominador + '</p></td>';
    html += '<td><p class="total"><span class="parcell">' + parcSatisfNumerador + '</span>/' + denominador + '</p></td>';
    html += '<td><p class="total"><span class="parcell">' + satisfNumerador + '</span>/' + denominador + '</p></td></tr></table></div></div>';

    return html;

}