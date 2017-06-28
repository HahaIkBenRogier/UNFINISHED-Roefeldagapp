$(document).ready(function() {
    $(".container.main").hide();
    
    //// COOKIES & LOGIN
    function setCookie(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function checkCookie() {
        var pw = getCookie("validatepassword");
        if (pw != "") {
            // Niks
        } else {
            metroDialog.open('#login-dialog');
        }
    }

    $('#login-dialog input').keyup(function () {
        var val = $(this).val();
        $.post('../api/validate.php', {
            'token': val
        }, function (data) {
            if (data === 1) {
                $('#login-dialog button').prop('disabled', false);

            }
        })
    });

    $('#login-dialog button').click(function() {
        setCookie("validatepassword", 1);
        metroDialog.close('#login-dialog');
    })

    
    /// BEDRIJVEN
    function listBedrijven() {
        checkCookie();
        $("#bedrijven").show();
        $.getJSON('../api/database.php/Bedrijven', {
        'columns': 'bedrijf,id',
        'order': 'bedrijf,desc'
        }, function (data) {
            //console.log(data['Bedrijven']['records']);
            $.each(data['Bedrijven']['records'], function(k, v) {
                var string = '<tr data-id="'+v['0']+'"><td class="bedrijven list name">'+v['1']+'</td><td class="bedrijven list edit" data-id="'+v['0']+'"><a href="#"><span class="mif-pencil"></span></a></td><td class="bedrijven list delete" data-id="'+v['0']+'"><a href="#"><span class="mif-bin"></span><a/></td></tr>';
                $(string).prependTo("tbody");
            } );
        })
    };
    
    
    $("a.bedrijven.list.new").click(function() {
        metroDialog.open('#bedrijf-nieuw-dialog');
        return false;
    })
    
    $(document).on('click', '.bedrijven.list.edit', function() {
        var name = $(this).parent().children(".bedrijven.list.name").text();
        var id = $(this).data('id');
        $("#bedrijf-bewerk-dialog input").val(name);
        $("#bedrijf-bewerk-dialog input").data('id', id);
        metroDialog.open('#bedrijf-bewerk-dialog');
        return false;
    }) 
    
    $(document).on('click', '.bedrijven.list.delete', function() {
        var name = $(this).parent().children(".bedrijven.list.name").text();
        var id = $(this).data('id');
        $("#bedrijf-bevestiging-verwijder-naam").text(name);
        $("#bedrijf-bevestiging-verwijder-naam").data('id', id);
        metroDialog.open('#bedrijf-verwijder-dialog');
        return false;
    }) 
    
    $("#bedrijf-nieuw-dialog button").click(function () {
        var input = $("#bedrijf-nieuw-dialog input").val();
        $.post('../api/database.php/Bedrijven', {
            'bedrijf': input
        }, function(data) {
            if (data != null) {
                var string = '<tr data-id="'+data+'"><td class="bedrijven list name">'+input+'</td><td class="bedrijven list edit" data-id="'+data+'"><a href="#"><span class="mif-pencil"></span></a></td><td class="bedrijven list delete" data-id="'+data+'"><a href="#"><span class="mif-bin"></span><a/></td></tr>';
                $(string).appendTo("tbody");
                metroDialog.close('#bedrijf-nieuw-dialog');
            }
        })
    });
    
    $('#bedrijf-bewerk-dialog button').click(function () {
        var input = $("#bedrijf-bewerk-dialog input").val();
        var id = $("#bedrijf-bewerk-dialog input").data('id');
        $.ajax({
            url: '../api/database.php/Bedrijven/' + id,
            type: 'PUT',
            data: { 'bedrijf': input },
            success: function(data) {
                if (data != null) {
                    var sel = 'tr[data-id="'+ id +'"]';
                    $('tr[data-id="'+ id +'"]').children(".bedrijven.list.name").text(input);
                    metroDialog.close('#bedrijf-bewerk-dialog');
                }
            }
        })
    })
    
    $('#bedrijf-verwijder-dialog input').keyup(function () {
        var val = $(this).val();
        $.post('../api/validate.php', {
            'token': val
        }, function (data) {
            if (data === 1) {
                $('#bedrijf-verwijder-dialog button').prop('disabled', false)
            }
        })
    });
    
    $('#bedrijf-verwijder-dialog button').click(function () {
        var id = $("#bedrijf-bevestiging-verwijder-naam").data('id');
        $.ajax({
            url: '../api/database.php/Bedrijven/' + id,
            type: 'DELETE',
            success: function(data) {
                if (data != null) {
                    $('tr[data-id="'+ id +'"]').remove();
                    metroDialog.close('#bedrijf-verwijder-dialog');
                    $('#bedrijf-verwijder-dialog input').removeAttr('value');
                }
            }
        })
    });
    
    /// ROUTES
    
    var ochtendroutes = [];
    var middagroutes = [];
    function listRoutes() {
        checkCookie();
        $("#routes").show();
        
        $.getJSON('../api/database.php/Bedrijven', {
        'columns': 'bedrijf,id',
        'order': 'bedrijf,desc'
        }, function (data) {
            $.each(data['Bedrijven']['records'], function(k, v) {
                var sub = {value: v['0'], label: v['1']};
                ochtendroutes.push(sub);
                middagroutes.push(sub);
            } );
        })
        
    }
    
    listRoutes();
    
    $(document).on('focus', '.table.routes.ochtend tr:last', function () {
        var table = $(this);
        var html = $('<tr><td><div class="input-control text"><input class="desc one" type="text"></div></td><td><div class="input-control text"><input class="desc two" type="text"></div></td></tr>');
        $('input', html).autocomplete(autocomplete_opt_ochtend);
        table.after(html);
        /// NIET VERGETEN ZOOI DOOR TE TELLEN
        //console.log(table);

    })
    
    $(document).on('focus', '.table.routes.middag tr:last', function () {
        var table = $(this);
        table.after('<tr><td><div class="input-control text"><input type="text"></div></td><td><div class="input-control text"><input type="text"></div></td></tr>');
        // DOOR TELLEN VANAF LAATSTE OCHTEND
    })
    
    $(document).on('focusout', '.table.routes.ochtend input', function() {
        $(this).removeClass("onfocus");
    })
    
    $(document).on('focusin', '.table.routes.ochtend input', function() {
        $(this).addClass("onfocus");
    })
    
    var autocomplete_opt_ochtend = {
      minLength: 0,
      source: ochtendroutes,
      focus: function( event, ui ) {
        $( ".table.routes.ochtend input.onfocus" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
        $( ".table.routes.ochtend input.onfocus" ).val( ui.item.label );
          alert(ui.item.value);
          /// Hier de functie starten
          
 
        return false;
      }
    }
    
    $( ".table.routes.ochtend input" ).autocomplete(autocomplete_opt_ochtend);

    
})