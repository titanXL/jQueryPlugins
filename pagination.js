// needs to be tested in a separate file to see the history functionality
(function ( $, window, document, undefined ) {

    var pluginName = "pagination",
        defaults = {
            allPages: 0,
            pagesPerView: 1,
            offset: 0,
            displayDots: false,
            trackHistory: false
        };
    // Check if plugin name already exists and re assign it if so
    if($.fn[pluginName]) {
      pluginName= "pagination-exp"
    }
    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = $(element);
        this.container = $('.paginationContainer');

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function() {
          var data = this.options.trackHistory ? this.getLocationData() : null
          this.render(data);
          this.bindEventHandlers();
        },
        destroy: function() {
          this.element.off();
          this.element.removeData();
        },
        render: function(data) {
            this.element.html('')
            this.generateHtml(data)
            this.container.append(this.element)
        },
        generateHtml: function(data) {
            var totalPages = Math.ceil(this.options.allPages/ this.options.pagesPerView);
            var currentPage = data ? Number(data.page) : 1;
            var previousPage = currentPage - 1 < 1 ? 1 : currentPage - 1;
            var nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1;
            var prevPageControllsDisabled = currentPage === 1 ? 'disabled' : ''
            var nextPageControllsDisabled = currentPage === totalPages ? 'disabled': ''
            var offset = this.options.offset;
            var displayDots = this.options.displayDots;
            var items = ''
            items += '<li class="page ' + prevPageControllsDisabled + '" data-page="' + 1 + '"><a href="#page=' + 1 + '" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
            items += '<li class="page ' + prevPageControllsDisabled + '" data-page="' + previousPage + '"><a href="#page=' + previousPage + '" aria-label="Previous single"><span aria-hidden="true">&lsaquo;</span></a></li>';
            var min = currentPage - offset;
            if(min < 1) min = 1;
            var max = currentPage + offset;
            if(max + 1 > totalPages) max = totalPages
            if(max > 3*offset + 1 && displayDots) {
              for (var i = 1; i <= offset; i++) {
                items += '<li class="page" data-page="' + i + '">' + '<a href="#page=' + i + '">'+ i + '</a>' + '</li>';
              }
              items += '<li class="page"><a href="#" class="no-click">&hellip;</a></li>';
            }
            for(var i = min; i <= max; i++) {
              if( i === currentPage) {
                items += '<li class="page active" data-page="' + i + '">' + '<a href="#page=' + i + '">'+ i + '</a>' + '</li>';
              } else {
                items += '<li class="page" data-page="' + i + '">' + '<a href="#page=' + i + '">'+ i + '</a>' + '</li>';
              }
            }
            if(max < totalPages - offset && displayDots) {
              items += '<li class="page"><a href="#" class="no-click">&hellip;</a></li>';
              for (var i = totalPages - offset + 1; i <= totalPages; i++) {
                items += '<li class="page" data-page="' + i + '">' + '<a href="#page=' + i + '">'+ i + '</a>' + '</li>';
              }
            }
            items += '<li class="page ' + nextPageControllsDisabled + '" data-page="' + nextPage + '"><a href="#page=' + nextPage + '" aria-label="Next"><span aria-hidden="true">&rsaquo;</span></a></li>';
            items += '<li class="page ' + nextPageControllsDisabled + '" data-page="' + totalPages + '"><a href="#page=' + totalPages + '" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
          this.element.append(items);
          if(!this.options.trackHistory) {
            $('.page a').attr('href', '#')
          }
        },
        bindEventHandlers: function() {
          var that = this
          if(!this.options.trackHistory) {
            this.element.on('click', '.page', function() {
              that.render($(this).data())
            })
          }
          if(this.options.trackHistory) {
            $(window).on('popstate hashchange', function() {
              var data = that.getLocationData();
              that.render(data)
            })
          }
        },
        getLocationData: function() {
          var regex = /#page=(\d+)/g;
          var href = window.location.href;
          var match = regex.exec(href);
          var data
          if(match) {
            data = {
              page: match[1]
            }
          } else {
            data = {
              page: 1
            }
          }
          return data;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin-" + pluginName)) {
                $.data(this, "plugin-" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


$('#pagi').pagination({
            allPages: 120,
            pagesPerView: 5,
            offset: 3,
            displayDots: true,
            trackHistory: false
        })

