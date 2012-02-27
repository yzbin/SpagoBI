app.views.ChartExecutionPanel = Ext.extend(app.views.WidgetPanel, {
	dockedItems : [],
	scroll : 'vertical',

	initComponent : function() {
		console.log('init chart execution');
		app.views.ChartExecutionPanel.superclass.initComponent.apply(this,
				arguments);
		if(this.IS_FROM_COMPOSED){
			this.on('afterlayout',this.showLoadingMask,this);
		}
	},
	setChartWidget : function(resp, fromcomposition) {
	
		var r;
		var config = resp.config;
		config.animate = true;

		config.listeners = {
			scope: this,
            'itemtap': function(series, item, event) { 
	 			var crossParams = new Array();
				this.setCrossNavigation(resp, item, crossParams);
				this.fireEvent('execCrossNavigation', this, crossParams);
			}
        };
		
		if(config.dockedItems==undefined || config.dockedItems==null){
			config.dockedItems = new Array();
		}
		
		if(config.interactions==undefined || config.interactions==null){
			config.interactions = new Array();
		}

		if(config.options !== undefined && config.options !== null && config.options.showValueTip){
			this.addValueTip(config);
		}

		var chartConfig = {

			items : [ config ]
		};

		if (fromcomposition) {
			chartConfig.width = '100%';
			chartConfig.height = '100%';
			chartConfig.defaultType = 'chart';
			chartConfig.layout = 'fit';
			if(config.title){
				chartConfig.dockedItems = [{
	                dock: 'top',
	                xtype: 'toolbar',
	                ui: 'light',
	                title: config.title.value
	            }];
			}
			r = new Ext.Panel(chartConfig);
			this.insert(0, r);
			this.doLayout();
		} else {
			chartConfig.bodyMargin = '10% 1px 60% 1px';
			chartConfig.fullscreen = true;
			if(config.title){
				chartConfig.title = config.title.value;
			}
			app.views.chart = new Ext.chart.Panel(chartConfig);
		}
		if(this.IS_FROM_COMPOSED){
			this.loadingMask.hide();
		}
	}
	
	, addValueTip: function(config){
		config.interactions.push({
            type: 'iteminfo',
            listeners: {
                show: function(interaction, item, panel) {
                	panel.setWidth(400);
                	var str = "";
                	var storeItem = item.storeItem;
                	var values = item.value;
                	for(var propertyName in storeItem.data){
                	   if((storeItem.data).hasOwnProperty(propertyName) ){
                		   var propertyValue = (storeItem.data)[propertyName];
                		   if(values.indexOf(propertyValue)>=0){
                			   str = str +"<li><b><span>"+propertyName+"</b>: "+propertyValue+"</span></li>";
                		   }
                	   }
                	}
                	if(str.length>0){
                		str = "<ul>"+str+"</ul>";
                		 panel.update(str);
                	}
                }
            }
        });
	}
	, setCrossNavigation: function(resp, item, crossParams){
		
		var drill = resp.config.drill;
		if(drill != null && drill != undefined){
			var params = drill.params;
			var series = item.series;
			
			if(params != null && params != undefined){
				for(i=0; i< params.length; i++){
					var param = params[i];
					var name = param.paramName;
					var type = param.paramType;
					
					//case multi-series
					if (typeof series == 'array'){
						for(k = 0; k<series.length; k++){
							var serieField = series[k].field;
							var categoryField = series[k].label.field;
							
							var cat = item.storeItem.data[categoryField];
							var ser = item.storeItem.data[serieField];
							/*	RELATIVE AND ABSOLUTE PARAMETERS ARE MANAGED SERVER SIDE */
							if(type == 'SERIE'){
								crossParams.push({name : name, value : ser});
							}else if(type == 'CATEGORY'){
								crossParams.push({name : name, value : cat});
							}else{
								crossParams.push({name : name, value : param.paramValue});
							}
						}

					}else{
						//single serie
						var serieField = series.field;
						var categoryField = series.label.field;
						
						var cat = item.storeItem.data[categoryField];
						var ser = item.storeItem.data[serieField];
						/*	RELATIVE AND ABSOLUTE PARAMETERS ARE MANAGED SERVER SIDE */
						if(type == 'SERIE'){
							crossParams.push({name : name, value : ser});
						}else if(type == 'CATEGORY'){
							crossParams.push({name : name, value : cat});
						}else{
							crossParams.push({name : name, value : param.paramValue});
						}
					}
				}
			}				
		}
		return crossParams;
	}
});