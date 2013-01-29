/*
 * jQuery UI Multi Slider
 *   base on jQuery UI Slider 1.8.14
 * but applying changes made on http://www.kelvinluck.com/assets/jquery/ui-slider/script/ui.slider.js
 * (more info here : http://www.kelvinluck.com/assets/jquery/ui-slider/slider_test.html)
 *
 * Added feature compared to jquery-ui slider :
 * - Possibility to have more than 2 handles (from kelvinluck's component)
 * - Handles should be ordered : you won't be able to move an handle after/before another handle (from kelvinluck's component)
 * - Added a tooltip for value (from kelvinluck's component)
 * - Removed special cases where there is only one handle (use slider in this case, not multislider)
 * - Added a tooltip for handle label
 * - Always displaying tooltips
 * - Added "frozen" state to disable drag'n'drop on certain handles
 * - Added odd & even display of tooltip, alternating bottom/top displaying of tooltips
 * - Tooltips' z-index should always be the higher possible when tooltip is hovered
 * - Refactored "slide" event compared to jquery-ui slider's "slide" event. In multislider,
 * data passed to this callback is different, and the callback should be able to update other handles
 * if needed (when this is the case, the updatedIndexes array should be updated by the callback)
 *
 *
 * For backward compatibility purposes, current widget is renamed to "ui.multislider" in order to
 * not collide with ui.slider
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.multislider", $.ui.mouse, {

	widgetEventPrefix: "slide",

	options: {
		animate: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null,
        frozenHandleIndexes: [],
        handlesTooltips: null,
        tooltips: null,
        // By default, handles should not pass other handles
        validateSlide: function(slider, event, slidingInfos){ return slider._avoidToPassHandles(slidingInfos); }
	},

	_create: function() {
		var self = this,
			o = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
			handleCount = ( o.values && o.values.length ) || 1,
			handles = [];

		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();

		this.element
			.addClass( "ui-slider" +
				" ui-slider-" + this.orientation +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" +
				( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );

		this.range = $([]);

		if ( o.range ) {
			if ( o.range === true ) {
				if ( !o.values ) {
					o.values = [ this._valueMin(), this._valueMin() ];
				}
				if ( o.values.length && o.values.length < 2 ) {
					o.values = [ o.values[0], o.values[0] ];
				}
			}

			this.range = $( "<div></div>" )
				.appendTo( this.element )
				.addClass( "ui-slider-range" +
				// note: this isn't the most fittingly semantic framework class for this element,
				// but worked best visually with a variety of themes
				" ui-widget-header" +
				( ( o.range === "min" || o.range === "max" ) ? " ui-slider-range-" + o.range : "" ) );
		}

		for ( var i = existingHandles.length; i < handleCount; i += 1 ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( self.element ) );

        this.handles.filter(":even").addClass("even");
        this.handles.filter(":odd").addClass("odd");

		this.handle = this.handles.eq( 0 );

		this.handles.add( this.range ).filter( "a" )
			.click(function( event ) {
				event.preventDefault();
			})
			.hover(function() {
				if ( !o.disabled ) {
					$( this ).addClass( "ui-state-hover" );
				}
			}, function() {
				$( this ).removeClass( "ui-state-hover" );
			})
			.focus(function() {
				if ( !o.disabled ) {
					$( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
					$( this ).addClass( "ui-state-focus" );
				} else {
					$( this ).blur();
				}
			})
			.blur(function() {
				$( this ).removeClass( "ui-state-focus" );
			});

		this.handles.each(function( i ) {
			$( this ).data( "index.ui-slider-handle", i );
            if(self.options.handlesTooltips){
                $( this ).append( '<span class="ui-slider-handle-tooltip ui-widget-content ui-corner-all">'+self.options.handlesTooltips[i]+'</span>');
            }
		});

		if (this.options.tooltips) {
			this.handles.append('<span class="ui-slider-tooltip ui-widget-content ui-corner-all"></span>');
		}

        if(this.options.frozenHandleIndexes){
            this.freezeHandles(this.options.frozenHandleIndexes);
        }

		this.handles
			.keydown(function( event ) {
				var ret = true,
					index = $( this ).data( "index.ui-slider-handle" ),
					allowed,
					curVal,
					newVal,
					step;

				if ( self.options.disabled ) {
					return;
				}

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
					case $.ui.keyCode.END:
					case $.ui.keyCode.PAGE_UP:
					case $.ui.keyCode.PAGE_DOWN:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						ret = false;
						if ( !self._keySliding ) {
							self._keySliding = true;
							$( this ).addClass( "ui-state-active" );
							allowed = self._start( event, index );
							if ( allowed === false ) {
								return;
							}
						}
						break;
				}

				step = self.options.step;
		        curVal = newVal = self.values( index );

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
						newVal = self._valueMin();
						break;
					case $.ui.keyCode.END:
						newVal = self._valueMax();
						break;
					case $.ui.keyCode.PAGE_UP:
						newVal = self._trimAlignValue( curVal + ( (self._valueMax() - self._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.PAGE_DOWN:
						newVal = self._trimAlignValue( curVal - ( (self._valueMax() - self._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
						if ( curVal === self._valueMax() ) {
							return;
						}
						newVal = self._trimAlignValue( curVal + step );
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						if ( curVal === self._valueMin() ) {
							return;
						}
						newVal = self._trimAlignValue( curVal - step );
						break;
				}

				self._slide( event, index, newVal );

				return ret;

			})
			.keyup(function( event ) {
				var index = $( this ).data( "index.ui-slider-handle" );

				if ( self._keySliding ) {
					self._keySliding = false;
					self._stop( event, index );
					self._change( event, index );
					$( this ).removeClass( "ui-state-active" );
				}

			});

		this._refreshValue();

		this._animateOff = false;
	},

	destroy: function() {
		this.handles.remove();
		this.range.remove();

		this.element
			.removeClass( "ui-slider" +
				" ui-slider-horizontal" +
				" ui-slider-vertical" +
				" ui-slider-disabled" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" )
			.removeData( "slider" )
			.unbind( ".slider" );

		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function( event ) {
		var o = this.options,
			position,
			normValue,
			distance,
			closestHandle,
			self,
			index,
			allowed,
			offset,
			mouseOverHandle;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		self = this;
		this.handles.each(function( i ) {
			if(!$(this).hasClass("ui-state-frozen")){
				var thisDistance = Math.abs( normValue - self.values(i) );
				if ( distance > thisDistance ) {
					distance = thisDistance;
					closestHandle = $( this );
					index = i;
				}
			}
		});

		// workaround for bug #3736 (if both handles of a range are at 0,
		// the first is always used as the one with least distance,
		// and moving it is obviously prevented by preventing negative ranges)
		if( o.range === true && this.values(1) === o.min ) {
			index += 1;
			closestHandle = $( this.handles[index] );
		}

        // if target handle is disabled, don't start moving...
        if($(this.handles[index]).hasClass("ui-state-frozen")){
            return false;
        }

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		self._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function( event ) {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );

		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this.handles.removeClass( "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},

	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_start: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.values( index ),
            values: this.values()
		};
		return this._trigger( "start", event, uiHash );
	},

    _avoidToPassHandles: function(slidingInfos){
        // Extracted from initial algorithm in _slide() : will allow to
        // use (or not use) this check during sliding validation
        if (slidingInfos.oldValue < slidingInfos.newValue
            && slidingInfos.index < slidingInfos.options.values.length - 1
            && slidingInfos.newValue > slidingInfos.values[slidingInfos.index+1])
            return false;

        if (slidingInfos.oldValue > slidingInfos.newValue
            && slidingInfos.index > 0
            && slidingInfos.newValue < slidingInfos.values[slidingInfos.index-1])
            return false;

        return true;
    },

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed,
            self = this;

        var clonedValues = this.values().slice(0);
        var slideInfos = {
            options: this.options,
            handles: this.handles,
            handle: this.handles[index],
            newValue: newVal,
            oldValue: clonedValues[index],
            values: clonedValues,
            index: index,
            updatedIndexes: [index]
        };
        // Should be made *after* creation of slideInfos, otherwise, oldValue will be badly valued
        clonedValues[index] = newVal;
    	// The slide callback should fill slideInfos.updatedIndexes attribute eventually with
        // additionnal indexes for values updated during slide (a handle could update value of another
        // handle during slide)
        // TODO: trigger "slide" event again and again while slideInfos.updatedIndexes changes
        var allowed = this._trigger("slide", event, slideInfos);
        if(allowed !== false){
            if(slideInfos.updatedIndexes === null || slideInfos.updatedIndexes === undefined || slideInfos.updatedIndexes === true){
                updatedIndexes = [ ];
            }
            if($.inArray(index, slideInfos.updatedIndexes) === -1){
                slideInfos.updatedIndexes.push(index);
            }

            if(this.options.validateSlide){
                if(!this.options.validateSlide(this, event, slideInfos)){
                    return;
                }
            }

            $.each(slideInfos.updatedIndexes, function(i, updatedIndex){
                if(clonedValues[updatedIndex] !== self.values()[updatedIndex]){
                    self.values( updatedIndex, clonedValues[updatedIndex], true );
                }
            });
        }
	},

	_stop: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.values( index ),
            values: this.values()
		};
		this._trigger( "stop", event, uiHash );
	},

	_change: function( event, index ) {
		if ( !this._keySliding && !this._mouseSliding ) {
			var uiHash = {
				handle: this.handles[ index ],
                value: this.values( index ),
                values: this.values()
			};
			this._trigger( "change", event, uiHash );
		}
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
		        return this._values( index );
			}
		} else {
			return this._values();
		}
	},

    freezeHandles: function(handleIndexes) {
        return this._setOption("freezeHandles", handleIndexes);
    },

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		$.Widget.prototype._setOption.apply( this, arguments );

		switch ( key ) {
			case "disabled":
				if ( value ) {
					this.handles.filter( ".ui-state-focus" ).blur();
					this.handles.removeClass( "ui-state-hover" );
					this.handles.attr( "disabled", "disabled" );
					this.element.addClass( "ui-disabled" );
				} else {
					this.handles.removeAttr( "disabled" );
					this.element.removeClass( "ui-disabled" );
				}
				break;
            case "freezeHandles":
                var self = this;
                var handleIndexes = $.isArray(value)?value:[ value ];
                $.each(handleIndexes, function(i, handleIndex){
                    $(self.handles.get(handleIndex)).addClass("ui-state-frozen");
                });
                break;
			case "orientation":
				this._detectOrientation();
				this.element
					.removeClass( "ui-slider-horizontal ui-slider-vertical" )
					.addClass( "ui-slider-" + this.orientation );
				this._refreshValue();
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();
				for ( i = 0; i < valsLength; i += 1 ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
		}
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else {
			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i+= 1) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = (val - this._valueMin()) % step;
			alignValue = val - valModStep;

		if ( Math.abs(valModStep) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed(5) );
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.options.max;
	},

	_refreshValue: function() {
		var oRange = this.options.range,
			o = this.options,
			self = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			valPercent,
			_set = {},
			lastValPercent,
			value,
			valueMin,
			valueMax,
			numOptions = this.options.values ? this.options.values.length : 0;

        var min = this._valueMin();
        var diff = this._valueMax() - this._valueMin();
        if (oRange === true) {
            var firstHandlePercent = (this.values(0) - min) / diff * 100;
            var rangePercent = (this.values(numOptions-1) - min) / diff * 100 - firstHandlePercent;
            if (self.orientation == 'horizontal') {
                self.range.stop(1,1)[animate ? 'animate' : 'css']({ left: firstHandlePercent + '%', width: rangePercent + '%' }, o.animate);
            } else {
                self.range.stop(1,1)[animate ? 'animate' : 'css']({ bottom: firstHandlePercent + '%', height: rangePercent + '%' }, o.animate);
            }
        }
        this.handles.each(function(i, j) {
            var valPercent = (self.values(i) - min) / diff * 100;
            var _set = {}; _set[self.orientation == 'horizontal' ? 'left' : 'bottom'] = valPercent + '%';
            $(this).stop(1,1)[animate ? 'animate' : 'css'](_set, o.animate);
            if (o.tooltips) {
                $('.ui-slider-tooltip', this).text(o.tooltips[self.values(i)]);
            }
        });
	}

});

$.extend( $.ui.multislider, {
	version: "1.8.14"
});

}(jQuery));
