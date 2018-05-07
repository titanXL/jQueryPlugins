(function ( $, window, document ) {

    // Create the defaults once
    var pluginName = 'charCounter',
        defaults = {
            propertyName: "charCounter",
            maxlength: 1000
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = $(element);

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
        this.count = this.options.maxlength  
        this.counterContainer = null  
        this.counter = $('<span id="counter">' + this.count + ' chars left </span>')
        this.init();
    }

    Plugin.prototype.init = function () {
        this.element.attr('maxlength', this.options.maxlength)
        this.counterContainer = this.createCounterContainer()
        this.renderCounter();
        this.bindEventHandlers()
    };
  
    Plugin.prototype.bindEventHandlers = function() {
      var self = this
      this.element.on('input', function() {
        var length = self.element.val().length
        self.updateCounter(self.count - length)
      })
    }
    
    Plugin.prototype.renderCounter = function () {
      this.counterContainer.append(this.counter)
      
      this.element.after(this.counterContainer.get(0))
    }
    
    Plugin.prototype.createCounterContainer = function() {
     var container = '<div class="counter-container"></div>'
     return $(container)
    }
  
    Plugin.prototype.updateCounter = function(length) {
      this.counter.html(length + ' chars left')
    }
    
    Plugin.prototype.destroy = function() {
      this.element.off()
      this.counterContainer.remove()
    }
    
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            } else if($.data(this, 'plugin_' + pluginName) && options === 'destroy') {
                 $.data(this, 'plugin_' + pluginName).destroy()
            }
        });
    }

})( jQuery, window, document );

$('#notes').charCounter({
  'maxlength': 100
})

