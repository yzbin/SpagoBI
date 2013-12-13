/** SpagoBI, the Open Source Business Intelligence suite
 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/

/**
 * 
 * This class is the container for the ad-hoc reporting interface 
 *    
 *  @author
 *  Alberto Ghedin (alberto.ghedin@eng.it)
 */
 
  
Ext.define('Sbi.adhocreporting.AdhocreportingContainer', {
	extend: 'Ext.panel.Panel',

	config:{
    	worksheetEngineBaseUrl : '',
    	qbeFromBMBaseUrl : '',
    	qbeFromDataSetBaseUrl : '',
        user : '',
        myAnalysisServicePath: '',
        georeportEngineBaseUrl: ''
        //datasetsServicePath: ''
        , contextName: ''
	},

	/**
	 * @property {Panel} adhocreportingTabsPanel
	 *  Tab panel that contains the my analysis documents
	 */
    adhocreportingTabsPanel: null,
	
	/**
	 * @property {Panel} documentexecution
	 *  Tab panel that contains the execution of the engine
	 */
    documentexecution: null
	
	, constructor : function(config) {
		this.initConfig(config);
		
		this.layout =  'card';
		
		this.documentexecution = Ext.create('Sbi.selfservice.SelfServiceExecutionIFrame',{hideToolbar:true}); 
		this.adhocreportingTabsPanel = Ext.create('Sbi.adhocreporting.AdhocreportingTabsPanel', {
			adhocreportingContainer : this
			, myAnalysisServicePath : config.myAnalysisServicePath
		}); 
					
		this.items = [ this.adhocreportingTabsPanel
		               , this.documentexecution
		               ]
		this.callParent(arguments);
		
		this.addEvents(
		        /**
		         * @event event1
		         * Execute the qbe clicking in the model/dataset
				 * @param {Object} docType engine to execute 'QBE'/'WORKSHEET'/'COCKPIT'
				 * @param {Object} inputType 'DOCUMENT'
				 * @param {Object} record the record that contains all the information of the document
		         */
		        'executeDocument'
				);
		this.adhocreportingTabsPanel.on('executeDocument', this.executeDocument ,this);

	}

	,
	executeDocument: function(docType,inputType, record){
		if(docType=='COCKPIT'){
			//TODO: to be defined
			Sbi.debug("Cockpit document execution");
			alert('TODO: Cockpit execution');
		} else if (docType=='WORKSHEET'){
			Sbi.debug("Worksheet document execution");
			this.executeWorksheet(inputType, record);
		} else if (docType=='GEOREPORT'){
			Sbi.debug("Georeport document execution");
			this.executeGeoreport(inputType, record);
		} else {
			alert('Impossible to execute document of type [' + docType + ']');
		}
		
		this.getLayout().setActiveItem(1);	
	}
	
	
	
	, executeWorksheet: function(inputType, record){
		if(inputType == "DOCUMENT"){
			this.executeDocumentAction(inputType, record);			
		}
	}
	
	, executeGeoreport: function(inputType, record){
		if(inputType == "DOCUMENT"){
			this.executeDocumentAction(inputType, record);
		}
	}
	
	,executeDocumentAction: function(inputType, record){
		var doc = record.data;
		var executionUrl = this.contextName + '/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL='+doc.label+'&OBJECT_ID='+doc.id;
		this.documentexecution.load(executionUrl);
	}
	
   
	
});