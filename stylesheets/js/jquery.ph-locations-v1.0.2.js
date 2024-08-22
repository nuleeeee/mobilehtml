/*
 *  jquery-ph-locations - v1.0.2
 *  jQuery Plugin for displaying dropdown list of Philippines' Region, Province, City and Barangay in your webpage.
 *  https://github.com/buonzz/jquery-ph-locations
 *
 *  Made by Buonzz Systems
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

	"use strict";

		// defaults
		var pluginName = "ph_locations",
			defaults = {
                location_type : "city", // what data this control supposed to display? regions, provinces, cities or barangays?,
				api_base_url: 'https://fk350plrl6.execute-api.us-east-1.amazonaws.com/prod/',
				order: "name asc",
				filter: {},
                default_values : {
                    "regions": "Select Region",
                    "provinces": "Select Province",
                    "cities": "Select City",
                    "barangays" : "Select Baranggay"
                },
                use_psgc_as_value : false,
                api_key: "knffxw2q0x13ty4KImwlDaX6yNOv4aXftqdbe8vi"
            };

		// plugin constructor
		function Plugin ( element, options ) {
            this.psgc_code = '';
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
                $(this.element).on('change', this.onChange.bind(this));
				return this
            },

			fetch_list: function (filter) {

				this.settings.filter = filter;

				$.ajax({
                    type: "GET",
                    url: this.settings.api_base_url +  this.settings.location_type,
                    crossDomain: true,
                    dataType: 'json',
                    headers: {"x-api-key": this.settings.api_key},
					success: this.onDataArrived.bind(this),
					data: $.param(this.map_parameters())
                });

            }, // fetch list
            onDataArrived(data){
				$(this.element).html(this.build_options(data));
			},

			map_parameters(){

				var mapped_parameter = {"filter": {
					"where": {},
					"order" : this.settings.order
					}
				};

				 for(var property in this.settings.filter)
				    mapped_parameter.filter.where[property] = this.settings.filter[property];

				 return mapped_parameter;
			},

			build_options(params){
				var shtml = "";

                // add default value
                shtml += '<option value="" disabled="disabled" selected>';
                shtml +=  this.settings.default_values[this.settings.location_type];
                shtml += '</option>';


				for(var i=0; i<params.data.length;i++){

                    if(this.settings.use_psgc_as_value)
    					shtml += '<option value="' + params.data[i].id + '" data-psgc-code=' +  params.data[i].id + '>';
                    else
    					shtml += '<option value="' + params.data[i].name + '" data-psgc-code=' +  params.data[i].id + '>';

					shtml +=  params.data[i].name ;
					shtml += '</option>';
				}

				return shtml
			},
            onChange(e){
                var val = $( "option:selected" , this.element).data('psgc-code');
                $(this.element).data('selected-psgc-code', val);
			},

		} );


		$.fn[ pluginName ] = function( options, args ) {
			return this.each( function() {
				var $plugin = $.data( this, "plugin_" + pluginName );
				if (!$plugin) {
					var pluginOptions = (typeof options === 'object') ? options : {};
					$plugin = $.data( this, "plugin_" + pluginName, new Plugin( this, pluginOptions ) );
				}

				if (typeof options === 'string') {
					if (typeof $plugin[options] === 'function') {
						if (typeof args !== 'object') args = [args];
						$plugin[options].apply($plugin, args);
					}
				}
			} );
		};

} )( jQuery, window, document );