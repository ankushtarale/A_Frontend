(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('rxjs/operators'), require('rxjs'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('flx-ui-datatable', ['exports', '@angular/core', '@angular/http', 'rxjs/operators', 'rxjs', '@angular/forms', '@angular/common'], factory) :
    (factory((global['flx-ui-datatable'] = {}),global.ng.core,global.ng.http,global.rxjs.operators,global.rxjs,global.ng.forms,global.ng.common));
}(this, (function (exports,core,http,operators,rxjs,forms,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var FlxUiDatatableService = (function () {
        function FlxUiDatatableService(http$$1) {
            this.http = http$$1;
            this.dataUrl = '';
            this.behavior = new rxjs.BehaviorSubject([]);
            this.flxData = this.behavior.asObservable();
            this.pagination = [];
            this.totalItems = 0;
            this.dataOffset = 0;
            this.limit = 20;
            this.dataSrcKey = '';
            //Hold items selected for multiple select
            this.multipleDeletion = [];
            //Keep track if API call is completed
            this.loadFinish = false;
            this.lazyloadingConfig = {};
        }
        /**
         * @param {?} config
         * @return {?}
         */
        FlxUiDatatableService.prototype.setLazyloadingConfig = /**
         * @param {?} config
         * @return {?}
         */
            function (config) {
                this.lazyloadingConfig = config;
            };
        /**
         *
         * @param {?} url User api rul
         * @return {?}
         */
        FlxUiDatatableService.prototype.getData = /**
         *
         * @param {?} url User api rul
         * @return {?}
         */
            function (url) {
                var /** @type {?} */ headers = new http.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                return this.http.get(url, { headers: headers }).pipe(operators.retry(5), operators.map(function (response) { return response.json(); }));
            };
        /**
         *
         * @param {?} url Service api url
         * @param {?} id Datatype id to export
         * @param {?} data Data to export
         * @return {?}
         */
        FlxUiDatatableService.prototype.postData = /**
         *
         * @param {?} url Service api url
         * @param {?} id Datatype id to export
         * @param {?} data Data to export
         * @return {?}
         */
            function (url, id, data) {
                var /** @type {?} */ headers = new http.Headers();
                headers.append('Content-Type', 'application/json; charset=utf-8');
                return this.http.post(url + id, data, { headers: headers }).pipe(operators.map(function (resp) { return resp.json(); }));
            };
        /**
         *
         * @param {?} dataUrl Set dataurl
         * @return {?}
         */
        FlxUiDatatableService.prototype.setDataUrl = /**
         *
         * @param {?} dataUrl Set dataurl
         * @return {?}
         */
            function (dataUrl) {
                this.dataUrl = dataUrl;
            };
        /**
         * @return {?}
         */
        FlxUiDatatableService.prototype.getDataUrl = /**
         * @return {?}
         */
            function () {
                return this.dataUrl;
            };
        /**
         *
         * @param {?} data Register new data from user API
         * @return {?}
         */
        FlxUiDatatableService.prototype.chageDataTable = /**
         *
         * @param {?} data Register new data from user API
         * @return {?}
         */
            function (data) {
                this.behavior.next(data);
            };
        /**
         *
         * @param {?} numberOfList Total number of list
         * @param {?} limit Pagination limit
         * @return {?}
         */
        FlxUiDatatableService.prototype.createPagination = /**
         *
         * @param {?} numberOfList Total number of list
         * @param {?} limit Pagination limit
         * @return {?}
         */
            function (numberOfList, limit) {
                var /** @type {?} */ obj = [];
                var /** @type {?} */ counter = 1;
                for (var /** @type {?} */ i = 0; i < numberOfList; i += limit) {
                    obj.push({ label: counter, value: i });
                    counter++;
                }
                if (!this.isLazyLoadingEnabled) {
                    obj.push({ label: 'All', value: 'all' });
                }
                return obj;
            };
        /**
         * @return {?}
         */
        FlxUiDatatableService.prototype.isLazyLoadingEnabled = /**
         * @return {?}
         */
            function () {
                return this.lazyloadingConfig.hasOwnProperty("apiOffsetKey") && this.lazyloadingConfig.apiOffsetKey;
            };
        /**
         * @param {?} dataUrl
         * @param {?=} setSelectPagination
         * @return {?}
         */
        FlxUiDatatableService.prototype.loadFlxDataTableData = /**
         * @param {?} dataUrl
         * @param {?=} setSelectPagination
         * @return {?}
         */
            function (dataUrl, setSelectPagination) {
                var _this = this;
                if (setSelectPagination === void 0) {
                    setSelectPagination = true;
                }
                this.loadFinish = false;
                this.loader = this.getData(dataUrl).subscribe(function (responseData) {
                    try {
                        _this.multipleDeletion = [];
                        var /** @type {?} */ data = (_this.dataSrcKey) ? responseData[_this.dataSrcKey] : responseData;
                        _this.chageDataTable(data);
                        if (_this.isLazyLoadingEnabled()) {
                            _this.totalItems = responseData.total;
                            // Handle 1 pagination out of zero problem 1/0  instead of 0/0 if no data is comming
                            if (data.length > 0) {
                                _this.dataOffset = _this.dataOffset + _this.limit;
                            }
                        }
                        else {
                            _this.totalItems = data.length;
                            _this.dataOffset = 1;
                        }
                        if (setSelectPagination) {
                            if (_this.isLazyLoadingEnabled()) {
                                _this.pagination = _this.createPagination(responseData.total, _this.limit);
                            }
                            else {
                                _this.pagination = _this.createPagination(data.length, _this.limit);
                            }
                        }
                        _this.loadFinish = true;
                    }
                    catch (e) {
                        console.log('Error in reading data in ', e);
                    }
                }, (function (e) {
                    _this.loadFinish = true;
                }));
            };
        /**
         * @return {?}
         */
        FlxUiDatatableService.prototype.cancelLoading = /**
         * @return {?}
         */
            function () {
                this.loader.unsubscribe();
            };
        //Set source key to read from payload response JSON
        /**
         * @param {?} srcKey
         * @return {?}
         */
        FlxUiDatatableService.prototype.setDataSrcKey = /**
         * @param {?} srcKey
         * @return {?}
         */
            function (srcKey) {
                this.dataSrcKey = srcKey;
            };
        /**
         * @return {?}
         */
        FlxUiDatatableService.prototype.getDataLength = /**
         * @return {?}
         */
            function () {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.flxData.subscribe(function (resp) {
                        resolve(resp.length);
                    }, (function (e) {
                        resolve(0);
                    }));
                });
            };
        FlxUiDatatableService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        FlxUiDatatableService.ctorParameters = function () {
            return [
                { type: http.Http }
            ];
        };
        return FlxUiDatatableService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var FlxUiDataTable = (function () {
        function FlxUiDataTable(service) {
            var _this = this;
            this.service = service;
            this.behavior = new rxjs.BehaviorSubject([]);
            this.flxDatatableData = this.behavior.asObservable();
            this.service.flxData.subscribe(function (resp) {
                _this.ChangeData(resp);
            });
        }
        /**
         *
         * @param data Change table data with new data
         */
        /**
         *
         * @param {?} data Change table data with new data
         * @return {?}
         */
        FlxUiDataTable.prototype.ChangeData = /**
         *
         * @param {?} data Change table data with new data
         * @return {?}
         */
            function (data) {
                this.behavior.next(data);
            };
        /**
         * Reload data from api: void
         * @return {?}
         */
        FlxUiDataTable.prototype.reloadData = /**
         * Reload data from api: void
         * @return {?}
         */
            function () {
                this.service.loadFlxDataTableData(this.service.getDataUrl());
            };
        /**
         * @return {?}
         */
        FlxUiDataTable.prototype.abortRequest = /**
         * @return {?}
         */
            function () {
                this.service.cancelLoading();
            };
        FlxUiDataTable.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        FlxUiDataTable.ctorParameters = function () {
            return [
                { type: FlxUiDatatableService }
            ];
        };
        return FlxUiDataTable;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var FlxUiDatatableComponent = (function () {
        function FlxUiDatatableComponent(__form, service) {
            this.__form = __form;
            this.service = service;
            this.classes = {};
            this.headers = [];
            this.lazyloadingConfig = {};
            this.embedPictures = {};
            this.dataKeys = [];
            this.enableDataExports = false;
            this.dataExportsConfig = {};
            this.searchKeys = [];
            this.dataSrcKey = '';
            this.hasActionButtons = false;
            this.hideNumbers = false;
            this.enableMultipleSelection = false;
            this.multipleSelectKey = '';
            this.hasAddButton = false;
            this.dataUrl = '';
            this.actionButtonStart = false;
            this.multipleSelectButton = { text: 'Selected', icon: '' };
            this.searchPlaceholder = 'Enter name to search';
            this.actionHeader = 'Actions';
            this.limit = 20;
            this.spinnerSrc = '';
            this.actionButtons = [];
            this.paginationButtons = { background: '#dddddd', textColor: '#335599' };
            this.tableHeader = { background: '#ffffff', textColor: '#335599' };
            this.searchButton = { background: '#cccccc', textColor: '#335599' };
            this.addButton = {};
            this.searchBar = { borderSize: '1px', borderColor: '#ccc', background: '#ffffff', textColor: '#000000' };
            this.firstActionButtonClicked = new core.EventEmitter();
            this.secondActionButtonClicked = new core.EventEmitter();
            this.thirdActionButtonClicked = new core.EventEmitter();
            this.multipleSelectClicked = new core.EventEmitter();
            this.addButtonClicked = new core.EventEmitter();
            this.isExportAll = false;
            this.tData = [];
            this.behavior = new rxjs.BehaviorSubject([]);
            this.searchDataTempOffset = [];
            this.displayData = this.behavior.asObservable();
            this.offset = 1;
        }
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.reload = /**
         * @return {?}
         */
            function () {
                this.service.loadFlxDataTableData(this.reloadUrl, true);
            };
        /**
         *
         * @param checked Export all selection
         */
        /**
         *
         * @param {?} checked Export all selection
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.checkToExportOption = /**
         *
         * @param {?} checked Export all selection
         * @return {?}
         */
            function (checked) {
                this.isExportAll = checked;
            };
        /**
         *
         * @param exportType Export type: print|pdf|excel|word
         */
        /**
         *
         * @param {?} exportType Export type: print|pdf|excel|word
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.exportDocumentsAs = /**
         *
         * @param {?} exportType Export type: print|pdf|excel|word
         * @return {?}
         */
            function (exportType) {
                var _this = this;
                var /** @type {?} */ loading = (document.getElementById("export_loading"));
                loading.style.display = 'block';
                var /** @type {?} */ headers = (!this.dataExportsConfig.dataColumns || this.dataExportsConfig.dataColumns.length < 1) ? this.dataKeys : this.dataExportsConfig.dataColumns;
                var /** @type {?} */ dataToExport = (!this.isExportAll) ? this.displayData : this.service.flxData;
                //Subscribe to data
                dataToExport.subscribe(function (data) {
                    var /** @type {?} */ arrayObj = [];
                    try {
                        //Loop and push data
                        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                            var d = data_1_1.value;
                            var /** @type {?} */ obj = {};
                            for (var /** @type {?} */ h = 0; h < headers.length; h++) {
                                obj[headers[h]] = d[headers[h]];
                            }
                            arrayObj.push(obj);
                        }
                    }
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (data_1_1 && !data_1_1.done && (_a = data_1.return))
                                _a.call(data_1);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                    if (exportType == 'print') {
                        try {
                            printJS({ printable: arrayObj, properties: headers, type: 'json' });
                            loading.style.display = 'none';
                        }
                        catch (e) {
                            loading.style.display = 'none';
                            // console.log('PrintJS not found. Add `https://printjs-4de6.kxcdn.com/print.min.js` to your index.html or add as part of angular.json script') ;
                        }
                    }
                    else {
                        var /** @type {?} */ extension_1 = (exportType == 'pdf') ? 'pdf' : (exportType == 'excel') ? 'xlsx' : 'docx';
                        var /** @type {?} */ pageId = (exportType == 'pdf') ? 3 : (exportType == 'excel') ? 5 : 4;
                        var /** @type {?} */ requestData = { "data": JSON.stringify(arrayObj) };
                        _this.service.postData('http://exporter.azurewebsites.net/api/export/ExportFromJSON/', pageId, requestData).subscribe(function (resp) {
                            var /** @type {?} */ download = 'http://exporter.azurewebsites.net/api/export/GetFile/' + resp;
                            download += "?fileName=andrei&extension=" + extension_1;
                            window.location.href = download;
                            loading.style.display = 'none';
                        }, (function (e) {
                            //console.log('file export error',e) ;
                        }));
                    }
                    var e_1, _a;
                }).unsubscribe();
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.hasImageEmbeded = /**
         * @return {?}
         */
            function () {
                return this.embedPictures.hasOwnProperty("index");
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.getImage = /**
         * @return {?}
         */
            function () {
                console.log('eoeoe');
                //   let img = new Image() ;
                //   img.src = imageSrc ;
                //   img.onload = ((e)=>{
                //       return imageSrc ;
                //   }) ;
                //   img.onerror = ((e)=>{
                //     return this.embedPictures.fallbackUrl ;
                //   })
            };
        /**
         * @param {?} JSONData
         * @param {?} ReportTitle
         * @param {?} ShowLabel
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.JSONToCSVConvertor = /**
         * @param {?} JSONData
         * @param {?} ReportTitle
         * @param {?} ShowLabel
         * @return {?}
         */
            function (JSONData, ReportTitle, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var /** @type {?} */ arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                var /** @type {?} */ CSV = '';
                //Set Report title in first row or line
                CSV += ReportTitle + '\r\n\n';
                //This condition will generate the Label/Header
                if (ShowLabel) {
                    var /** @type {?} */ row = "";
                    //This loop will extract the label from 1st index of on array
                    for (var /** @type {?} */ index in arrData[0]) {
                        //Now convert each value to string and comma-seprated
                        row += index + ',';
                    }
                    row = row.slice(0, -1);
                    //append Label row with line break
                    CSV += row + '\r\n';
                }
                //1st loop is to extract each row
                for (var /** @type {?} */ i = 0; i < arrData.length; i++) {
                    var /** @type {?} */ row = "";
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var /** @type {?} */ index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }
                    row.slice(0, row.length - 1);
                    //add a line break after each row
                    CSV += row + '\r\n';
                }
                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }
                //Generate a file name
                var /** @type {?} */ fileName = "MyReport_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g, "_");
                //Initialize file format you want csv or xls
                var /** @type {?} */ uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension
                //this trick will generate a temp <a /> tag
                var /** @type {?} */ link = document.createElement("a");
                link.href = uri;
                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";
                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        /**
         *
         * @param newData
         */
        /**
         *
         * @param {?} newData
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.changeDisplayData = /**
         *
         * @param {?} newData
         * @return {?}
         */
            function (newData) {
                this.behavior.next(newData);
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.isLazyloadingEnabled()) {
                    this.reloadUrl = this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=0&' + this.lazyloadingConfig.apiSearchKey + '=';
                }
                else {
                    this.reloadUrl = this.dataUrl;
                }
                this.searchForm = this.__form.group({
                    searchString: ['', forms.Validators.required]
                });
                this.searchForm = this.__form.group({
                    searchString: ['', forms.Validators.required]
                });
                this.service.limit = this.limit;
                this.service.setLazyloadingConfig(this.lazyloadingConfig);
                this.service.setDataUrl(this.dataUrl);
                this.service.setDataSrcKey(this.dataSrcKey);
                var /** @type {?} */ url = (this.isLazyloadingEnabled()) ? this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=0&' + this.lazyloadingConfig.apiSearchKey + '=' : this.dataUrl;
                this.service.loadFlxDataTableData(url);
                this.service.flxData.subscribe(function (resp) {
                    _this.tData = resp;
                    var /** @type {?} */ obj = [];
                    if (_this.tData.length > _this.limit) {
                        for (var /** @type {?} */ i = 0; i < _this.limit; i++) {
                            obj.push(_this.tData[i]);
                        }
                        // this.service.dataOffset = this.limit;
                    }
                    else {
                        for (var /** @type {?} */ i = 0; i < _this.tData.length; i++) {
                            obj.push(_this.tData[i]);
                        }
                        // this.service.dataOffset = obj.length;
                    }
                    _this.searchDataTempOffset = obj;
                    _this.changeDisplayData(obj);
                });
            };
        /**
         * @param {?} values
         * @param {?} form
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.searchDataInApi = /**
         * @param {?} values
         * @param {?} form
         * @return {?}
         */
            function (values, form) {
                this.service.chageDataTable([]);
                this.service.loadFlxDataTableData(this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=0&' + this.lazyloadingConfig.apiSearchKey + '=' + values.searchString);
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                // alert(window.innerWidth)
            };
        /**
         * @param {?} index
         * @param {?} buttonIndex
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.actionButtonClicked = /**
         * @param {?} index
         * @param {?} buttonIndex
         * @return {?}
         */
            function (index, buttonIndex) {
                if (buttonIndex == 0) {
                    return this.firstActionButtonClicked.emit({ index: index, data: this.tData[index] });
                }
                else if (buttonIndex == 1) {
                    return this.secondActionButtonClicked.emit({ index: index, data: this.tData[index] });
                }
                else {
                    this.thirdActionButtonClicked.emit({ index: index, data: this.tData[index] });
                }
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.addButtonClick = /**
         * @return {?}
         */
            function () {
                this.addButtonClicked.emit();
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.confirmDelete = /**
         * @return {?}
         */
            function () {
                return this.multipleSelectClicked.emit(this.service.multipleDeletion);
            };
        /**
         * @param {?} checked
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.addRemove = /**
         * @param {?} checked
         * @return {?}
         */
            function (checked) {
                var _this = this;
                if (checked) {
                    this.displayData.subscribe(function (data) {
                        try {
                            for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                                var i = data_2_1.value;
                                try {
                                    _this.service.multipleDeletion.push(i[_this.multipleSelectKey]);
                                }
                                catch (e) { }
                            }
                        }
                        catch (e_2_1) {
                            e_2 = { error: e_2_1 };
                        }
                        finally {
                            try {
                                if (data_2_1 && !data_2_1.done && (_a = data_2.return))
                                    _a.call(data_2);
                            }
                            finally {
                                if (e_2)
                                    throw e_2.error;
                            }
                        }
                        // console.log(this.service.multipleDeletion) ;
                        var e_2, _a;
                    });
                }
                else {
                    this.service.multipleDeletion = [];
                }
            };
        /**
         * @param {?} dataKeyvalue
         * @param {?} index
         * @param {?} selected
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.addRemoveDeleteItem = /**
         * @param {?} dataKeyvalue
         * @param {?} index
         * @param {?} selected
         * @return {?}
         */
            function (dataKeyvalue, index, selected) {
                var _this = this;
                if (!selected) {
                    for (var /** @type {?} */ i = 0; i < this.service.multipleDeletion.length; i++) {
                        if (dataKeyvalue == this.service.multipleDeletion[i]) {
                            this.service.multipleDeletion.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    this.displayData.subscribe(function (resp) {
                        _this.service.multipleDeletion.push(resp[index][_this.multipleSelectKey]);
                    });
                }
                // console.log('left '+dataKeyvalue,this.service.multipleDeletion) ;
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.getSearchColumns = /**
         * @return {?}
         */
            function () {
                return (this.hasAddButton) ? (this.enableDataExports) ? 'col-md-6 search-container' : 'col-md-7 search-container' :
                    (this.enableDataExports) ? 'col-md-7 search-container' : 'col-md-8 search-container';
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.disablePrevtButton = /**
         * @return {?}
         */
            function () {
                return Math.ceil(this.service.dataOffset / this.limit) <= 1;
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.disableNextButton = /**
         * @return {?}
         */
            function () {
                return Math.ceil(this.service.dataOffset / this.limit) == Math.ceil(this.service.totalItems / this.limit);
            };
        /**
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.isLazyloadingEnabled = /**
         * @return {?}
         */
            function () {
                return this.lazyloadingConfig.hasOwnProperty("apiOffsetKey") && this.lazyloadingConfig.apiOffsetKey;
            };
        /**
         * @param {?} type
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.nextPrevItem = /**
         * @param {?} type
         * @return {?}
         */
            function (type) {
                var _this = this;
                if (this.isLazyloadingEnabled()) {
                    this.service.loadFinish = false;
                    this.service.getDataLength().then(function (dataLength) {
                        _this.service.chageDataTable([]);
                        _this.service.dataOffset = (type == 'prev') ? ((_this.service.dataOffset - _this.limit) - _this.limit) : _this.service.dataOffset;
                        var /** @type {?} */ url = (_this.isLazyloadingEnabled()) ? _this.dataUrl + '&' + _this.lazyloadingConfig.apiOffsetKey + '=' + _this.service.dataOffset + '&' + _this.lazyloadingConfig.apiSearchKey + '=' : _this.dataUrl;
                        _this.service.loadFlxDataTableData(url);
                    }).catch(function (e) {
                        //console.log('error',e) ;
                    });
                    return;
                }
                // Paginate if lazyloading is disabled
                if (type == 'prev') {
                    this.paginateDatatableRecord((this.service.dataOffset - this.limit) - this.limit);
                }
                else {
                    if (this.service.dataOffset < this.limit) {
                        this.paginateDatatableRecord(this.service.dataOffset + (this.limit - 1));
                    }
                    else {
                        this.paginateDatatableRecord(this.service.dataOffset);
                    }
                }
            };
        /**
         * @param {?=} searchString
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.filterData = /**
         * @param {?=} searchString
         * @return {?}
         */
            function (searchString) {
                var _this = this;
                if (searchString === void 0) {
                    searchString = '';
                }
                this.changeDisplayData([]);
                this.service.flxData.subscribe(function (data) {
                    var /** @type {?} */ searchResults = [];
                    //If no string provided. Register all the previous data to the dataset
                    if (searchString.trim() == '') {
                        _this.changeDisplayData(_this.searchDataTempOffset);
                        return;
                    }
                    //Check if searchKeys are set else use dataKeys as searchKeys
                    var /** @type {?} */ searchKeys = (_this.searchKeys.length < 1) ? _this.dataKeys : _this.searchKeys;
                    for (var /** @type {?} */ i = 0; i < data.length; i++) {
                        //Variable to check if a data is found
                        var /** @type {?} */ found = -1;
                        for (var /** @type {?} */ x = 0; x < searchKeys.length; x++) {
                            try {
                                if (data[i][String(searchKeys[x])].toLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) {
                                    found = i;
                                    break;
                                }
                            }
                            catch (e) { }
                        }
                        //If found push the index of the data to the searchResults variable
                        if (found > -1) {
                            searchResults.push(data[found]);
                        }
                    }
                    //Register the results to the dataset
                    //Register the results to the dataset
                    _this.changeDisplayData(searchResults);
                });
            };
        /**
         * @param value offset value
         */
        /**
         * @param {?} value offset value
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.paginateDatatable = /**
         * @param {?} value offset value
         * @return {?}
         */
            function (value) {
                var _this = this;
                // Check if lazy loading is enabled
                if (this.isLazyloadingEnabled()) {
                    this.service.loadFinish = false;
                    // Subscribe to get the data length
                    this.service.getDataLength().then(function () {
                        _this.service.chageDataTable([]);
                        // Check if all is selected to prevent NAN value
                        if (value != 'all') {
                            _this.service.dataOffset = parseInt(value);
                        }
                        // setup url
                        var /** @type {?} */ url = (_this.isLazyloadingEnabled()) ? _this.dataUrl + '&' + _this.lazyloadingConfig.apiOffsetKey + '=' + value + '&' + _this.lazyloadingConfig.apiSearchKey + '=' : _this.dataUrl;
                        // paginate
                        // paginate
                        _this.service.loadFlxDataTableData(url, false);
                    }).catch(function (e) {
                        // console.log('error',e) ;
                    });
                    return;
                }
                this.paginateDatatableRecord(value);
            };
        /**
         *
         * @param value pagination number
         * Perform pagination to the dataset
         * @return
         */
        /**
         *
         * @param {?} value pagination number
         * Perform pagination to the dataset
         * @return {?}
         */
        FlxUiDatatableComponent.prototype.paginateDatatableRecord = /**
         *
         * @param {?} value pagination number
         * Perform pagination to the dataset
         * @return {?}
         */
            function (value) {
                var _this = this;
                if (this.lazyloadingConfig.hasOwnProperty("apiOffsetKey") && this.lazyloadingConfig.apiOffsetKey) {
                    this.service.loadFinish = false;
                    this.service.getDataLength().then(function (dataLength) {
                        _this.service.chageDataTable([]);
                        _this.service.dataOffset = parseInt(value) + _this.limit;
                        _this.service.loadFlxDataTableData(_this.dataUrl + '&' + _this.lazyloadingConfig.apiOffsetKey + '=' + value + '&' + _this.lazyloadingConfig.apiSearchKey + '=');
                    }).catch(function (e) {
                        // console.log('error',e) ;
                    });
                    return;
                }
                var /** @type {?} */ num = parseInt(value);
                if (num <= 0) {
                    this.offset = 1;
                    this.service.dataOffset = this.limit;
                }
                else {
                    if (value != 'all') {
                        this.offset = num + 1;
                        this.service.dataOffset = num + this.limit;
                    }
                    else {
                        this.offset = 1;
                    }
                }
                this.service.flxData.subscribe(function (data) {
                    if (value !== 'all') {
                        var /** @type {?} */ paginateResult = [];
                        for (var /** @type {?} */ i = value; i < (_this.limit + parseInt(value)); i++) {
                            if (data[i]) {
                                paginateResult.push(data[i]);
                            }
                        }
                        if (paginateResult.length > 0) {
                            _this.changeDisplayData(paginateResult);
                        }
                    }
                    else {
                        _this.changeDisplayData(data);
                        _this.searchDataTempOffset = data;
                    }
                });
            };
        FlxUiDatatableComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'flx-ui-datatable',
                        template: "<div class=\"col-md-12 flx-ui-datatable-main {{ classes?.maincontainer }}\">\n    <div id=\"export_loading\" class=\"col-md-12 text-center\" style=\"display: none;margin-bottom:0.5em;color:#dddddd;font-size:13px;font-weight:bold;\">Exporting...</div>\n    <div class=\"col-md-12 flx-ui-datatable-header\">\n        <div class=\"col-xs-3 col-sm-3 pagination-select col-md-2\" style=\"position:relative;z-index: 1;\">\n            <select class=\"form-control rmsh rmrd {{ classes?.paginationselect }}\" (change)=\"paginateDatatable($event?.target?.value)\">\n                <option *ngFor=\"let paging of service?.pagination\" [value]=\"paging?.value\">{{ paging?.label }}</option>\n            </select>\n        </div>\n        <div class=\"col-xs-5 col-sm-5 col-md-2 text-center flx-datatable-pagination rmpd\" style=\"position:relative;z-index: 2;\">\n            <button mat-icon-button [ngClass]=\"{'flx-pagination-end': disablePrevtButton()}\" (click)=\"nextPrevItem('prev')\" [disabled]=\"disablePrevtButton()\" class=\"flx-ui-datatable-pagination-buttons {{ classes?.paginationButton }}\"><span class=\"fa fa-angle-double-left fa-1x\"></span> <span class=\"flx-datatable-tooltip-prev\" [ngClass]=\"{'flx-pagination-end': disablePrevtButton()}\">Previous</span> </button>\n                {{ service?.dataOffset | ceil: limit }} / {{ service?.totalItems | ceil: limit }}\n            <button mat-icon-button [ngClass]=\"{'flx-pagination-end': disableNextButton()}\" (click)=\"nextPrevItem('next')\" [disabled]=\"disableNextButton()\" class=\"flx-ui-datatable-pagination-buttons {{ classes?.paginationButton }}\"><span class=\"fa fa-angle-double-right fa-1x\"></span> <span class=\"flx-datatable-tooltip-next\" [ngClass]=\"{'flx-pagination-end': disableNextButton()}\">Next</span></button>\n        </div>\n        <div [class]=\"'search-bar '+getSearchColumns()\">\n            <input type=\"text\" *ngIf=\"!isLazyloadingEnabled()\" [style.background]=\"searchBar?.background\" [style.color]=\"searchBar?.textColor\" [ngStyle]=\"{border:searchBar?.borderSize +' solid '+ searchBar?.borderColor} \" (keyup)=\"filterData($event?.target?.value)\" class=\"form-control rmsh rmrd customclass\" [placeholder]=\"searchPlaceholder\">\n            <form (ngSubmit)=\"searchDataInApi(srch?.value,srch)\" #srch=\"ngForm\" *ngIf=\"isLazyloadingEnabled()\">\n                <div class=\"input-group\">\n                    <input type=\"text\" required name=\"searchString\" ngModel [style.background]=\"searchBar?.background\" [style.color]=\"searchBar?.textColor\" [ngStyle]=\"{border:searchBar?.borderSize +' solid '+ searchBar?.borderColor} \" class=\"form-control rmsh rmrd {{ classes?.searchbar }}\" [placeholder]=\"searchPlaceholder\">\n                    <span class=\"input-group-addon\">\n                        <button [disabled]=\"!srch?.valid\" type=\"submit\" class=\"btn btn-default btn-clear btn-md\">\n                            <i class=\"fa fa-search\"></i>\n                        </button>\n                    </span>\n                </div>\n            </form>\n        </div>\n        <div class=\"col-md-1 text-right rmpd\" *ngIf=\"hasAddButton\">\n            <button (click)=\"addButtonClick()\" class=\"{{ classes?.addButton }}\" [style.background]=\"addButton?.background\" [style.borderColor]=\"addButton?.background\" [style.color]=\"addButton?.textColor\"><span class=\"glyphicon glyphicon-plus\"></span> Add</button>\n        </div>\n        <div class=\"col-md-1 text-right rmpd export-cnt\" *ngIf=\"enableDataExports\">\n            <span class=\"dropdown\">\n                <button class=\"btn btn-default {{ classes?.exportButton }} dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">\n                \n                <i class=\"caret\"></i>\n                </button>\n                <ul class=\"dropdown-menu dropdown-menu-export\">\n                    <li class=\"dropdown-header\">{{ dataExportsConfig?.title }}. <input type=\"checkbox\" (change)=\"checkToExportOption($event?.target?.checked)\" style=\"position: relative;top:0.3em;\"> <sup style=\"font-size:10px;color:#999;\"> All</sup></li> \n                    <li class=\"divider\"></li>\n                    <li class=\"dropdown-submenu\" *ngFor=\"let export of dataExportsConfig?.exportsTo\" (click)=\"exportDocumentsAs(export)\">\n                        <a href=\"javascript:void(0)\" *ngIf=\"export=='print'\"><i class=\"glyphicon glyphicon-print\"></i> Print</a>\n                        <a href=\"javascript:void(0)\" *ngIf=\"export=='pdf'\" style=\"color:#ff0000\"><i class=\"glyphicon glyphicon-file\"></i> PDF</a>\n                        <a href=\"javascript:void(0)\" *ngIf=\"export=='excel'\" style=\"color:#009900;\"><i class=\"glyphicon glyphicon-file\"></i> Excel</a>            \n                        <a href=\"javascript:void(0)\" *ngIf=\"export=='word'\" style=\"color:#335599;\"><i class=\"glyphicon glyphicon-file\"></i> Word</a>                        \n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"dropdown-header\">\n                        <span  *ngIf=\"!isExportAll\">{{ (displayData | async)?.length }}</span>\n                        <span  *ngIf=\"isExportAll\">{{ (service?.flxData | async)?.length }}</span> \n                    </li>\n                </ul>\n            </span>\n        </div>\n    </div>\n    <div class=\"col-md-12 rmpd table-responsive\">\n        <table class=\"table {{ classes?.tableType }} table-responsive\" id=\"flx_ui_table_tag\">\n            <thead class=\"{{ classes?.tableHeader }}\">\n                <tr>\n                    <th *ngIf=\"!hideNumbers\">N<sup><u>o</u></sup></th>\n                    <th *ngFor=\"let header of headers\">{{ header }}</th>\n                    <th *ngIf=\"hasActionButtons\">{{ actionHeader }} \n                        <input type=\"checkbox\" [checked]=\"service?.multipleDeletion?.length>0\" (change)=\"addRemove($event?.target?.checked)\" *ngIf=\"enableMultipleSelection\">\n                        <button class=\"btn btn-danger btn-xs flx-multiple-deletion-button\" *ngIf=\"enableMultipleSelection && service?.multipleDeletion?.length>0\" (click)=\"confirmDelete()\"><span [class]=\"multipleSelectButton?.icon\"></span> {{ multipleSelectButton?.text }}</button>\n                    </th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr *ngIf=\"!service?.loadFinish\">                    \n                    <td colspan=\"20\" class=\"text-center\">\n                        <img *ngIf=\"spinnerSrc\" [class]=\"classes?.spinner\" [src]=\"spinnerSrc\" style=\"margin-top:1em;margin-bottom:1em;\">\n                    </td>\n                </tr>\n                <tr class=\"flxuidatatablerow\" id=\"flxdatatable_singlerow\" *ngFor=\"let data of displayData | async;let i=index\">\n                    <!-- Numbers -->\n                    <td class=\"{{ classes?.tableData }}\" *ngIf=\"!hideNumbers\" style=\"color: #999;\">{{ offset+i }}</td>\n                    <!-- Main -->\n                    <td class=\"{{ classes?.tableData }}\" *ngFor=\"let dataKey of dataKeys;let x=index\">\n                        <img *ngIf=\"hasImageEmbeded() && x==embedPictures?.index\" [class]=\"'img-fall-back ' +embedPictures?.class\" [src]=\"embedPictures?.rootFolder+data[dataKey]\" [flx-ui-datatable-img-fallback]=\"embedPictures?.fallbackUrl\" >\n                        <span *ngIf=\"!hasImageEmbeded() || x!=embedPictures?.index\">{{ data[dataKey] }}</span>\n                    </td>\n                    <!-- Buttons -->\n                    <td class=\"table-buttons\" *ngIf=\"hasActionButtons\" scope=\"row\">\n                        <span *ngFor=\"let aButton of actionButtons;let buttonIndex=index\">\n                            <button (click)=\"actionButtonClicked(i,buttonIndex)\" class=\"btn {{ aButton?.class }}\">\n                                <div class=\"toltip\" class=\"flx-tooltip\" [ngClass]=\"{'flx-tooltip-left':aButton?.tooltipPosition=='left','flx-tooltip-bottom':aButton?.tooltipPosition=='bottom','flx-tooltip-right':aButton?.tooltipPosition=='right'}\" *ngIf=\"aButton?.tooltip\">{{ aButton?.tooltip }}</div>\n                                <span class=\"action-button-icon-left\" [class]=\"aButton?.icon\" *ngIf=\"!aButton?.iconPosition || aButton?.iconPosition!='right'\"></span>\n                                <span class=\"button-text\"> {{ aButton?.text }} </span>\n                                <span [class]=\"aButton?.icon\" *ngIf=\"aButton?.iconPosition=='right'\"></span>\n                            </button>\n                        </span> \n                        <input type=\"checkbox\" checked (change)=\"addRemoveDeleteItem(data[multipleSelectKey],i,$event?.target?.checked)\" *ngIf=\"enableMultipleSelection && service?.multipleDeletion?.length>0\">\n                    </td>\n                </tr>\n                <tr *ngIf=\"tData?.length<1\">\n                    <td colspan=\"10\" class=\"text-center\" *ngIf=\"service?.loadFinish\">\n                        <span style=\"color:#ff0000;font-size:13px;\">No data found</span> <br>\n                        <button style=\"margin-top:1em;\" (click)=\"reload()\" class=\"btn btn-default {{ classes?.reloadbutton }}\" color=\"primary\"><span class=\"fa fa-refresh\"></span> Reload</button>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n        <div class=\"col-md-12 rmpd flx-total-data\" *ngIf=\"showBottomInfo\">\n            <div class=\"col-md-4 text-left rmpd\">Total pagination: <span> {{ service?.totalItems | ceil: limit }}</span></div>\n            <div class=\"col-md-4 text-center rmpd\"># of items per pagination: <span>{{ limit }}</span></div>\n            <div class=\"col-md-4 text-right rmpd\">Total items: <span>{{ (service?.flxData | async)?.length }}</span></div>\n        </div>\n    </div>\n</div>",
                        styles: [".flx-ui-datatable-main{background-color:#fff;padding-top:1em;padding-bottom:1em}.flx-ui-datatable-main .btn-danger{background-color:#f50057;border:1px solid #f50057;box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px;margin-left:.3em}.flx-ui-datatable-main img.img-fall-back{width:30px;height:30px}.flx-ui-datatable-main .pagination-select input[type=text],.flx-ui-datatable-main .pagination-select select,.flx-ui-datatable-main .search-bar input[type=text],.flx-ui-datatable-main .search-bar select{border-top:none!important;border-left:none!important;border-right:none!important;border-bottom:2px solid #ddd!important;border-radius:0!important;box-shadow:0 0 0 0 transparent!important;-moz-box-shadow:0 0 0 0 transparent!important;-webkit-box-shadow:0 0 0 0 transparent!important;-o-box-shadow:0 0 0 0 transparent!important;-ms-box-shadow:0 0 0 0 transparent!important}.flx-ui-datatable-main .pagination-select input[type=text]:focus,.flx-ui-datatable-main .pagination-select select:focus,.flx-ui-datatable-main .search-bar input[type=text]:focus,.flx-ui-datatable-main .search-bar select:focus{border-bottom-color:#359!important;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .pagination-select select,.flx-ui-datatable-main .search-bar select{-webkit-appearance:none;appearance:none;-moz-appearance:none}.flx-ui-datatable-main .flx-datatable-pagination{padding-top:.5em}.flx-ui-datatable-main .flx-datatable-pagination button{width:35px!important;height:35px!important;border-radius:50em!important;border:none!important;box-shadow:0 3px 10px 0 #b3c4e6;-moz-box-shadow:0 3px 10px 0 #b3c4e6;-webkit-box-shadow:0 3px 10px 0 #b3c4e6;-o-box-shadow:0 3px 10px 0 #b3c4e6;-ms-box-shadow:0 3px 10px 0 #b3c4e6;background-color:#359;color:#fff;font-size:23px;font-weight:700;position:absolute;top:0}.flx-ui-datatable-main .flx-datatable-pagination button:first-child{left:0}.flx-ui-datatable-main .flx-datatable-pagination button:first-child .flx-datatable-tooltip-prev{position:absolute;left:0;font-size:13px;font-weight:400;color:#fff;background-color:#359;padding-left:.3em;padding-right:.3em;border-radius:3px;margin-left:-57px;margin-top:.5em;box-shadow:0 3px 10px 0 #b3c4e6!important;-moz-box-shadow:0 3px 10px 0 #b3c4e6!important;-webkit-box-shadow:0 3px 10px 0 #b3c4e6!important;-o-box-shadow:0 3px 10px 0 #b3c4e6!important;-ms-box-shadow:0 3px 10px 0 #b3c4e6!important;visibility:hidden}.flx-ui-datatable-main .flx-datatable-pagination button:hover>span.flx-datatable-tooltip-next,.flx-ui-datatable-main .flx-datatable-pagination button:hover>span.flx-datatable-tooltip-prev{visibility:visible}.flx-ui-datatable-main .flx-datatable-pagination .flx-pagination-end{background-color:#f50057!important;box-shadow:0 3px 10px 0 #ffc2d8!important;-moz-box-shadow:0 3px 10px 0 #ffc2d8!important;-webkit-box-shadow:0 3px 10px 0 #ffc2d8!important;-o-box-shadow:0 3px 10px 0 #ffc2d8!important;-ms-box-shadow:0 3px 10px 0 #ffc2d8!important;cursor:not-allowed}.flx-ui-datatable-main .flx-datatable-pagination .flx-pagination-end:hover>span.flx-datatable-tooltip-next,.flx-ui-datatable-main .flx-datatable-pagination .flx-pagination-end:hover>span.flx-datatable-tooltip-prev{visibility:hidden}.flx-ui-datatable-main .flx-datatable-pagination button:last-child{right:0}.flx-ui-datatable-main .flx-datatable-pagination button:last-child .flx-datatable-tooltip-next{position:absolute;left:0;font-size:13px;font-weight:400;color:#fff;background-color:#359;padding-left:.3em;padding-right:.3em;border-radius:3px;margin-left:35px;margin-top:.5em;box-shadow:0 3px 10px 0 #b3c4e6!important;-moz-box-shadow:0 3px 10px 0 #b3c4e6!important;-webkit-box-shadow:0 3px 10px 0 #b3c4e6!important;-o-box-shadow:0 3px 10px 0 #b3c4e6!important;-ms-box-shadow:0 3px 10px 0 #b3c4e6!important;visibility:hidden}.flx-ui-datatable-main .export-cnt button{border-radius:50em!important}.flx-ui-datatable-main table{margin-top:1.5em}.flx-ui-datatable-main table tbody tr{padding-top:0!important}.flx-ui-datatable-main table tbody tr td{padding-top:.5em;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}.flx-ui-datatable-main table tbody tr td button{margin-right:.3em;margin-left:0}.flx-ui-datatable-main table tbody tr td button div.flx-tooltip{position:absolute;background-color:rgba(32,27,27,.808);text-align:center;font-size:13px;color:#fff;border-radius:3px;box-shadow:0 3px 20px 0 #4b4949;-moz-box-shadow:0 3px 20px 0 #4b4949;-webkit-box-shadow:0 3px 20px 0 #4b4949;-o-box-shadow:0 3px 20px 0 #4b4949;-ms-box-shadow:0 3px 20px 0 #4b4949;margin-left:-2.5em;margin-top:-2.8em;visibility:hidden;width:80px;padding:.3em .5em}.flx-ui-datatable-main table tbody tr td button .flx-tooltip-left{margin-left:-95px!important;margin-top:-.3em!important}.flx-ui-datatable-main table tbody tr td button .flx-tooltip-bottom{margin-top:2.3em!important}.flx-ui-datatable-main table tbody tr td button .flx-tooltip-right{margin-left:28px!important;margin-top:-.3em!important}.flx-ui-datatable-main table tbody tr td button:hover>div.flx-tooltip{transition:.3s;visibility:visible}.flx-ui-datatable-main table tbody tr td.table-buttons{padding-top:.2em;padding-bottom:.2em}.flx-ui-datatable-main table tbody tr:nth-of-type(even){background-color:#f8f9fa}.flx-ui-datatable-main table tbody tr:nth-of-type(odd){background-color:#fff}.flx-ui-datatable-main .btn-danger:hover{background-color:#ff146b;border:1px solid #ff146b;box-shadow:0 3px 10px 1px #ff5fb6;-moz-box-shadow:0 3px 10px 1px #ff5fb6;-webkit-box-shadow:0 3px 10px 1px #ff5fb6;-o-box-shadow:0 3px 10px 1px #ff5fb6;-ms-box-shadow:0 3px 10px 1px #ff5fb6;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-danger:focus{background-color:#f50057;border:1px solid #f50057}.flx-ui-datatable-main .btn-white{background-color:#fff}.flx-ui-datatable-main .btn-dark{background-color:#222!important}.flx-ui-datatable-main .btn-primary{background-color:#359;color:#fff;border:1px solid #359;box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px}.flx-ui-datatable-main .btn-primary:hover{background-color:#4769ad;border:1px solid #4769ad;box-shadow:0 3px 10px 0 #b3c4e6;-moz-box-shadow:0 3px 10px 0 #b3c4e6;-webkit-box-shadow:0 3px 10px 0 #b3c4e6;-o-box-shadow:0 3px 10px 0 #b3c4e6;-ms-box-shadow:0 3px 10px 0 #b3c4e6;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-primary:focus{background-color:#359;border:1px solid #359}.flx-ui-datatable-main .btn-large{padding-top:1em!important;padding-bottom:1em!important}.flx-ui-datatable-main .btn-medium{padding-top:.7em!important;padding-bottom:.7em!important}.flx-ui-datatable-main .btn-success{box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px;background-color:#5cb85c;border:1px solid #5cb85c}.flx-ui-datatable-main .btn-success:hover{background-color:#70cc70;border:1px solid #70cc70;box-shadow:0 3px 10px 1px #9df99d;-moz-box-shadow:0 3px 10px 1px #9df99d;-webkit-box-shadow:0 3px 10px 1px #9df99d;-o-box-shadow:0 3px 10px 1px #9df99d;-ms-box-shadow:0 3px 10px 1px #9df99d;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-success:focus{background-color:#5cb85c;border:1px solid #5cb85c}.flx-ui-datatable-main .btn-default{background-color:#fff;box-shadow:0 3px 5px 1px #eee;-moz-box-shadow:0 3px 5px 1px #eee;-webkit-box-shadow:0 3px 5px 1px #eee;-o-box-shadow:0 3px 5px 1px #eee;-ms-box-shadow:0 3px 5px 1px #eee;border-radius:3px;border:1px solid #ddd}.flx-ui-datatable-main .btn-default:hover{background-color:#fff;border:1px solid #e7e7e7;box-shadow:0 3px 10px 1px #e2e2e2;-moz-box-shadow:0 3px 10px 1px #e2e2e2;-webkit-box-shadow:0 3px 10px 1px #e2e2e2;-o-box-shadow:0 3px 10px 1px #e2e2e2;-ms-box-shadow:0 3px 10px 1px #e2e2e2;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-default:focus{background-color:#fff;border:1px solid #ddd}.flx-ui-datatable-main .btn-secondary{box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px;background-color:#1e88e5;color:#fff}.flx-ui-datatable-main .btn-secondary:hover{color:#fff;background-color:#2892ef;border:1px solid #2892ef;box-shadow:0 3px 10px 1px #55bfff;-moz-box-shadow:0 3px 10px 1px #55bfff;-webkit-box-shadow:0 3px 10px 1px #55bfff;-o-box-shadow:0 3px 10px 1px #55bfff;-ms-box-shadow:0 3px 10px 1px #55bfff;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-secondary:focus{color:#fff}.flx-ui-datatable-main .pagination-button{background-color:#359;color:#fff}.flx-ui-datatable-main .table-font{font-family:Khula,sans-serif!important}.flx-ui-datatable-main .table-header-icon{position:absolute;right:.2em;width:80px;height:80px;font-size:50px;margin-top:-30px;border-radius:5px!important}.flx-ui-datatable-main .table-title{background-color:#359;color:#fff;border-radius:2px;padding:1em;font-size:15px;font-weight:700;margin-bottom:1.5em;font-family:Roboto,sans-serif;box-shadow:0 1px 5px 1px #ddd;-moz-box-shadow:0 1px 5px 1px #ddd;-webkit-box-shadow:0 1px 5px 1px #ddd;-o-box-shadow:0 1px 5px 1px #ddd;-ms-box-shadow:0 1px 5px 1px #ddd}.flx-ui-datatable-main .danger{background-color:#f50057;color:#fff}.flx-ui-datatable-main .primary{background-color:#359;color:#fff}.flx-ui-datatable-main .success{background-color:#5cb85c;color:#fff}.flx-ui-datatable-main .default{background-color:#fff;color:#000}.flx-ui-datatable-main .secondary{background-color:#1e88e5;color:#fff}.flx-ui-datatable-main .btn-clear{border:none!important;box-shadow:none!important}.flx-ui-datatable-main .input-group,.flx-ui-datatable-main .input-group input{background-color:transparent!important}.flx-ui-datatable-main .input-group-addon{border:none!important;padding:0!important;box-shadow:none!important;background-color:transparent!important}.flx-ui-datatable-main .input-group-addon button{border:1px solid transparent!important;box-shadow:none!important;border-top:none!important;border-bottom:none!important;background-color:transparent!important;border-radius:50em!important;color:#359;width:30px;height:30px}.flx-ui-datatable-main .input-group-addon button i{font-size:18px}.flx-ui-datatable-main .input-group-addon button:disabled{background-color:transparent!important}.flx-ui-datatable-main .input-group-addon button:disabled i{color:#f50057}"]
                    },] },
        ];
        /** @nocollapse */
        FlxUiDatatableComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder },
                { type: FlxUiDatatableService }
            ];
        };
        FlxUiDatatableComponent.propDecorators = {
            classes: [{ type: core.Input }],
            headers: [{ type: core.Input }],
            lazyloadingConfig: [{ type: core.Input }],
            embedPictures: [{ type: core.Input }],
            dataKeys: [{ type: core.Input }],
            enableDataExports: [{ type: core.Input }],
            dataExportsConfig: [{ type: core.Input }],
            showBottomInfo: [{ type: core.Input }],
            searchKeys: [{ type: core.Input }],
            dataSrcKey: [{ type: core.Input }],
            hasActionButtons: [{ type: core.Input }],
            hideNumbers: [{ type: core.Input }],
            enableMultipleSelection: [{ type: core.Input }],
            multipleSelectKey: [{ type: core.Input }],
            hasAddButton: [{ type: core.Input }],
            dataUrl: [{ type: core.Input }],
            actionButtonStart: [{ type: core.Input }],
            multipleSelectButton: [{ type: core.Input }],
            searchPlaceholder: [{ type: core.Input }],
            actionHeader: [{ type: core.Input }],
            limit: [{ type: core.Input }],
            spinnerSrc: [{ type: core.Input }],
            actionButtons: [{ type: core.Input }],
            paginationButtons: [{ type: core.Input }],
            tableHeader: [{ type: core.Input }],
            searchButton: [{ type: core.Input }],
            addButton: [{ type: core.Input }],
            searchBar: [{ type: core.Input }],
            firstActionButtonClicked: [{ type: core.Output }],
            secondActionButtonClicked: [{ type: core.Output }],
            thirdActionButtonClicked: [{ type: core.Output }],
            multipleSelectClicked: [{ type: core.Output }],
            addButtonClicked: [{ type: core.Output }]
        };
        return FlxUiDatatableComponent;
    }());
    var ImageFallBack = (function () {
        function ImageFallBack(el) {
            this.isApplied = false;
            this.EVENT_TYPE = 'error';
            this.el = el.nativeElement;
            this.el.addEventListener(this.EVENT_TYPE, this.onError.bind(this));
        }
        /**
         * @return {?}
         */
        ImageFallBack.prototype.onError = /**
         * @return {?}
         */
            function () {
                this.removeEvents();
                if (!this.isApplied) {
                    this.isApplied = true;
                    this.el.setAttribute('src', this.imgSrc);
                }
            };
        /**
         * @return {?}
         */
        ImageFallBack.prototype.removeEvents = /**
         * @return {?}
         */
            function () {
                this.el.removeEventListener(this.EVENT_TYPE, this.onError);
            };
        /**
         * @return {?}
         */
        ImageFallBack.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.removeEvents();
            };
        ImageFallBack.decorators = [
            { type: core.Directive, args: [{
                        selector: '[flx-ui-datatable-img-fallback]'
                    },] },
        ];
        /** @nocollapse */
        ImageFallBack.ctorParameters = function () {
            return [
                { type: core.ElementRef }
            ];
        };
        ImageFallBack.propDecorators = {
            imgSrc: [{ type: core.Input, args: ['flx-ui-datatable-img-fallback',] }]
        };
        return ImageFallBack;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Ceil = (function () {
        function Ceil() {
        }
        /**
         * @param {?} value
         * @param {?} limit
         * @return {?}
         */
        Ceil.prototype.transform = /**
         * @param {?} value
         * @param {?} limit
         * @return {?}
         */
            function (value, limit) {
                return Math.ceil(value / limit);
            };
        Ceil.decorators = [
            { type: core.Pipe, args: [{
                        name: 'ceil'
                    },] },
        ];
        /** @nocollapse */
        Ceil.ctorParameters = function () { return []; };
        return Ceil;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var FlxUiDatatableModule = (function () {
        function FlxUiDatatableModule() {
        }
        FlxUiDatatableModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule, forms.ReactiveFormsModule, forms.FormsModule, http.HttpModule
                        ],
                        declarations: [
                            FlxUiDatatableComponent, Ceil, ImageFallBack
                        ],
                        exports: [FlxUiDatatableComponent, Ceil],
                        providers: [FlxUiDatatableService]
                    },] },
        ];
        return FlxUiDatatableModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.FlxUiDataTable = FlxUiDataTable;
    exports.FlxUiDatatableModule = FlxUiDatatableModule;
    exports.ɵd = Ceil;
    exports.ɵb = FlxUiDatatableComponent;
    exports.ɵc = ImageFallBack;
    exports.ɵa = FlxUiDatatableService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx4LXVpLWRhdGF0YWJsZS51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ZseC11aS1kYXRhdGFibGUvbGliL2ZseC11aS1kYXRhdGFibGUuc2VydmljZS50cyIsIm5nOi8vZmx4LXVpLWRhdGF0YWJsZS9saWIvZmx4LXVpLWRhdGF0YWJsZS1zZXJ2aWNlLnNlcnZpY2UudHMiLG51bGwsIm5nOi8vZmx4LXVpLWRhdGF0YWJsZS9saWIvZmx4LXVpLWRhdGF0YWJsZS5jb21wb25lbnQudHMiLCJuZzovL2ZseC11aS1kYXRhdGFibGUvbGliL2NlaWwucGlwZS50cyIsIm5nOi8vZmx4LXVpLWRhdGF0YWJsZS9saWIvZmx4LXVpLWRhdGF0YWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnIDtcbmltcG9ydCB7IEh0dHAsSGVhZGVycyxSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvaHR0cCcgO1xuaW1wb3J0IHsgbWFwLHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnIDtcbmltcG9ydCB7IE9ic2VydmFibGUscGlwZSxCZWhhdmlvclN1YmplY3QsU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmx4VWlEYXRhdGFibGVTZXJ2aWNle1xuICAvL1VzZXIgZGF0YSBBUEkgdXJsXG4gIHByaXZhdGUgZGF0YVVybDogc3RyaW5nID0gJycgO1xuICBwdWJsaWMgYmVoYXZpb3I6IEJlaGF2aW9yU3ViamVjdDxhbnk+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KFtdKSA7XG4gIC8vSG9sZCBhbGwgZGF0YSBmcm9tIEFQSVxuICBwdWJsaWMgZmx4RGF0YSA9IHRoaXMuYmVoYXZpb3IuYXNPYnNlcnZhYmxlKCk7ICBcbiAgLy9IZWFkZXIgc2VsZWN0IHBhZ2luYXRpb25cbiAgcHVibGljIHBhZ2luYXRpb246IEFycmF5PE9iamVjdD4gPSBbXSA7XG4gIC8vSG9sZCB0b3RhbCBpdGVtcyBsb2FkZWQgZnJvbSBBUElcbiAgcHVibGljIHRvdGFsSXRlbXM6IG51bWJlciA9IDAgO1xuICAvL0tlZXAgdHJhY2sgb2YgY3VycmVudCBwYWdpbmF0aW9uIG9mZnNldFxuICBwdWJsaWMgZGF0YU9mZnNldDogbnVtYmVyID0gMCA7XG4gIC8vVXNlciBkZWZpbmVkIGxpbWl0IGZvciBudW1iZXIgb2YgaXRlbXMgcGVyIHBhZ2luYXRpb25cbiAgcHVibGljIGxpbWl0OiBudW1iZXIgPSAyMCA7XG4gIC8vRGF0YSBzb3VyY2Uga2V5IHRvIHJlYWQgZnJvbSBBUEkgcGF5bG9hZCByZXNwb25zZVxuICBwdWJsaWMgZGF0YVNyY0tleTpzdHJpbmcgPSAnJztcbiAgLy9Ib2xkIGl0ZW1zIHNlbGVjdGVkIGZvciBtdWx0aXBsZSBzZWxlY3RcbiAgbXVsdGlwbGVEZWxldGlvbjpBcnJheTxhbnk+ID0gW10gO1xuICAvL0hvbGQgc3Vic2NyaXB0aW9uIG9mIGFwaSBjYWxscyB3aGljaCBjYW4gYmUgY2FuY2VkIGJ5IGNhbGxpbmcgY2FuY2VsTG9hZGluZygpIFxuICBsb2FkZXI6IFN1YnNjcmlwdGlvbiA7ICBcbiAgLy9LZWVwIHRyYWNrIGlmIEFQSSBjYWxsIGlzIGNvbXBsZXRlZFxuICBsb2FkRmluaXNoOiBib29sZWFuID0gZmFsc2UgO1xuICAvLyBMYXp5IGxvYWRpbmcgY29uZmlnXG4gIHByaXZhdGUgbGF6eWxvYWRpbmdDb25maWc6IGFueSA9IHt9IDtcbiAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHApe1xuICAgICAgXG4gIH1cblxuICBwdWJsaWMgc2V0TGF6eWxvYWRpbmdDb25maWcoY29uZmlnOmFueSl7XG4gICAgdGhpcy5sYXp5bG9hZGluZ0NvbmZpZyA9IGNvbmZpZyA7XG4gIH1cblxuICAvL0dFVCByZXF1ZXN0IHRvIHVzZXIncyBBUEkgdXJsXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHVybCBVc2VyIGFwaSBydWxcbiAgICovXG4gIHB1YmxpYyBnZXREYXRhKHVybDpzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT57XG4gICAgICBsZXQgaGVhZGVyczogSGVhZGVycyA9IG5ldyBIZWFkZXJzKCkgO1xuICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIDtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCx7aGVhZGVyczpoZWFkZXJzfSkucGlwZShyZXRyeSg1KSxtYXAoKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKSkgO1xuICB9XG5cbiAgLy9Qb3N0IHJlcXVlc3QgZm9yIGRhdGEgZXhwb3J0XG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHVybCBTZXJ2aWNlIGFwaSB1cmxcbiAgICogQHBhcmFtIGlkIERhdGF0eXBlIGlkIHRvIGV4cG9ydFxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIGV4cG9ydFxuICAgKi9cbiAgcHVibGljIHBvc3REYXRhKHVybDpzdHJpbmcsaWQ6YW55LGRhdGE6c3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+e1xuICAgIGxldCBoZWFkZXJzOiBIZWFkZXJzID0gbmV3IEhlYWRlcnMoKSA7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKSA7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCtpZCxkYXRhLHtoZWFkZXJzOmhlYWRlcnN9KS5waXBlKG1hcCgocmVzcDogUmVzcG9uc2UpID0+IHJlc3AuanNvbigpKSkgO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0gZGF0YVVybCBTZXQgZGF0YXVybFxuICAgKi9cbiAgcHVibGljIHNldERhdGFVcmwoZGF0YVVybDpzdHJpbmcpOnZvaWR7XG4gICAgdGhpcy5kYXRhVXJsID0gZGF0YVVybCA7XG4gIH1cblxuICAvL0dldCBkYXRhIHVybCBcbiAgcHVibGljIGdldERhdGFVcmwoKTpzdHJpbmd7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVVybCA7XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSBkYXRhIFJlZ2lzdGVyIG5ldyBkYXRhIGZyb20gdXNlciBBUElcbiAgICovXG4gIHB1YmxpYyBjaGFnZURhdGFUYWJsZShkYXRhOmFueSl7XG4gICAgdGhpcy5iZWhhdmlvci5uZXh0KGRhdGEpIDtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIG51bWJlck9mTGlzdCBUb3RhbCBudW1iZXIgb2YgbGlzdFxuICAgKiBAcGFyYW0gbGltaXQgUGFnaW5hdGlvbiBsaW1pdFxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVQYWdpbmF0aW9uKG51bWJlck9mTGlzdDpudW1iZXIsbGltaXQ6bnVtYmVyKTogQXJyYXk8T2JqZWN0PntcbiAgICBsZXQgb2JqOiBBcnJheTxPYmplY3Q+ID0gW10gO1xuICAgIGxldCBjb3VudGVyOiBudW1iZXIgPSAxIDtcbiAgICBmb3IobGV0IGk9MDtpPG51bWJlck9mTGlzdDtpKz1saW1pdCl7XG4gICAgICAgIG9iai5wdXNoKHtsYWJlbDpjb3VudGVyLHZhbHVlOml9KSA7XG4gICAgICAgIGNvdW50ZXIrKyA7XG4gICAgfVxuICAgIGlmKCF0aGlzLmlzTGF6eUxvYWRpbmdFbmFibGVkKXtcbiAgICAgIG9iai5wdXNoKHsgbGFiZWw6ICdBbGwnLCB2YWx1ZTogJ2FsbCcgfSk7XG4gICAgfVxuICAgIHJldHVybiBvYmogO1xuICB9XG5cbiAgcHVibGljIGlzTGF6eUxvYWRpbmdFbmFibGVkKCl7XG4gICAgcmV0dXJuIHRoaXMubGF6eWxvYWRpbmdDb25maWcuaGFzT3duUHJvcGVydHkoXCJhcGlPZmZzZXRLZXlcIikgJiYgdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkgO1xuICB9XG5cbiAgLy9FdmVudCB0byBsb2FkIGRhdGEgZnJvbSB1c2VycyBhcGlcbiAgcHVibGljIGxvYWRGbHhEYXRhVGFibGVEYXRhKGRhdGFVcmw6c3RyaW5nLHNldFNlbGVjdFBhZ2luYXRpb246Ym9vbGVhbj10cnVlKXtcbiAgICB0aGlzLmxvYWRGaW5pc2ggPSBmYWxzZSA7XG4gICAgICB0aGlzLmxvYWRlciA9IHRoaXMuZ2V0RGF0YShkYXRhVXJsKS5zdWJzY3JpYmUoKHJlc3BvbnNlRGF0YSkgPT4ge1xuICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgdGhpcy5tdWx0aXBsZURlbGV0aW9uID0gW10gO1xuICAgICAgICAgICAgICB2YXIgZGF0YSA9ICh0aGlzLmRhdGFTcmNLZXkpID8gcmVzcG9uc2VEYXRhW3RoaXMuZGF0YVNyY0tleV0gOiByZXNwb25zZURhdGE7XG4gICAgICAgICAgICAgIHRoaXMuY2hhZ2VEYXRhVGFibGUoZGF0YSkgO1xuICAgICAgICAgICAgICBpZih0aGlzLmlzTGF6eUxvYWRpbmdFbmFibGVkKCkpeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXRlbXMgPSByZXNwb25zZURhdGEudG90YWwgO1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSAxIHBhZ2luYXRpb24gb3V0IG9mIHplcm8gcHJvYmxlbSAxLzAgIGluc3RlYWQgb2YgMC8wIGlmIG5vIGRhdGEgaXMgY29tbWluZ1xuICAgICAgICAgICAgICAgIGlmKGRhdGEubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhT2Zmc2V0ID0gdGhpcy5kYXRhT2Zmc2V0K3RoaXMubGltaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXRlbXMgPSBkYXRhLmxlbmd0aCA7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhT2Zmc2V0ID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihzZXRTZWxlY3RQYWdpbmF0aW9uKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzTGF6eUxvYWRpbmdFbmFibGVkKCkpe1xuICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gdGhpcy5jcmVhdGVQYWdpbmF0aW9uKHJlc3BvbnNlRGF0YS50b3RhbCwgdGhpcy5saW1pdCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSB0aGlzLmNyZWF0ZVBhZ2luYXRpb24oZGF0YS5sZW5ndGgsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmxvYWRGaW5pc2ggPSB0cnVlO1xuICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIHJlYWRpbmcgZGF0YSBpbiAnLGUpIDtcbiAgICAgICAgICB9XG4gICAgICB9LChlID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRGaW5pc2ggPSB0cnVlIDtcbiAgICAgIH0pKVxuICB9XG5cbiAgLy9DYW5jZWwgYXBpIEdFVCByZXF1ZXN0IHRvIGFwaVxuICBwdWJsaWMgY2FuY2VsTG9hZGluZygpe1xuICAgIHRoaXMubG9hZGVyLnVuc3Vic2NyaWJlKCkgO1xuICB9ICBcblxuICAvL1NldCBzb3VyY2Uga2V5IHRvIHJlYWQgZnJvbSBwYXlsb2FkIHJlc3BvbnNlIEpTT05cbiAgc2V0RGF0YVNyY0tleShzcmNLZXk6c3RyaW5nKTp2b2lkIHtcbiAgICB0aGlzLmRhdGFTcmNLZXkgPSBzcmNLZXk7XG4gIH1cblxuICBnZXREYXRhTGVuZ3RoKCk6IFByb21pc2U8bnVtYmVyPntcbiAgICByZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSkgPT57XG4gICAgICB0aGlzLmZseERhdGEuc3Vic2NyaWJlKChyZXNwKSA9PntcbiAgICAgICAgcmVzb2x2ZShyZXNwLmxlbmd0aCkgO1xuICAgICAgfSwoZT0+e1xuICAgICAgICByZXNvbHZlKDApIDtcbiAgICAgIH0pKVxuICAgIH0pIDtcbiAgfVxufSIsImltcG9ydCB7IEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnIDtcbmltcG9ydCB7IEZseFVpRGF0YXRhYmxlU2VydmljZSB9IGZyb20gJy4vZmx4LXVpLWRhdGF0YWJsZS5zZXJ2aWNlJyA7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZseFVpRGF0YVRhYmxle1xuICAgIGJlaGF2aW9yOiBCZWhhdmlvclN1YmplY3Q8YW55PiA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuICAgIGZseERhdGF0YWJsZURhdGEgPSB0aGlzLmJlaGF2aW9yLmFzT2JzZXJ2YWJsZSgpO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogRmx4VWlEYXRhdGFibGVTZXJ2aWNlKXtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmZseERhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLkNoYW5nZURhdGEocmVzcCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIENoYW5nZSB0YWJsZSBkYXRhIHdpdGggbmV3IGRhdGFcbiAgICAgKi9cbiAgICBDaGFuZ2VEYXRhKGRhdGEpIHtcbiAgICAgICAgdGhpcy5iZWhhdmlvci5uZXh0KGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbG9hZCBkYXRhIGZyb20gYXBpOiB2b2lkXG4gICAgICovXG4gICAgcHVibGljIHJlbG9hZERhdGEoKTogdm9pZHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGbHhEYXRhVGFibGVEYXRhKHRoaXMuc2VydmljZS5nZXREYXRhVXJsKCkpIDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWJvcnRSZXF1ZXN0KCl7XG4gICAgICAgIHRoaXMuc2VydmljZS5jYW5jZWxMb2FkaW5nKCkgO1xuICAgIH1cbn0iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLCBPbkluaXQsQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUdyb3VwLFZhbGlkYXRvcnMsRm9ybUJ1aWxkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJyA7XG5pbXBvcnQgeyBGbHhVaURhdGF0YWJsZVNlcnZpY2UgfSBmcm9tICcuL2ZseC11aS1kYXRhdGFibGUuc2VydmljZScgO1xuaW1wb3J0IHsgQXN5bmNQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJyA7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuZGVjbGFyZSB2YXIgcHJpbnRKUzogYW55IDtcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjonZmx4LXVpLWRhdGF0YWJsZScsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBmbHgtdWktZGF0YXRhYmxlLW1haW4ge3sgY2xhc3Nlcz8ubWFpbmNvbnRhaW5lciB9fVwiPlxuICAgIDxkaXYgaWQ9XCJleHBvcnRfbG9hZGluZ1wiIGNsYXNzPVwiY29sLW1kLTEyIHRleHQtY2VudGVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO21hcmdpbi1ib3R0b206MC41ZW07Y29sb3I6I2RkZGRkZDtmb250LXNpemU6MTNweDtmb250LXdlaWdodDpib2xkO1wiPkV4cG9ydGluZy4uLjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgZmx4LXVpLWRhdGF0YWJsZS1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0zIGNvbC1zbS0zIHBhZ2luYXRpb24tc2VsZWN0IGNvbC1tZC0yXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OiAxO1wiPlxuICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbCBybXNoIHJtcmQge3sgY2xhc3Nlcz8ucGFnaW5hdGlvbnNlbGVjdCB9fVwiIChjaGFuZ2UpPVwicGFnaW5hdGVEYXRhdGFibGUoJGV2ZW50Py50YXJnZXQ/LnZhbHVlKVwiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IHBhZ2luZyBvZiBzZXJ2aWNlPy5wYWdpbmF0aW9uXCIgW3ZhbHVlXT1cInBhZ2luZz8udmFsdWVcIj57eyBwYWdpbmc/LmxhYmVsIH19PC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNSBjb2wtc20tNSBjb2wtbWQtMiB0ZXh0LWNlbnRlciBmbHgtZGF0YXRhYmxlLXBhZ2luYXRpb24gcm1wZFwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDogMjtcIj5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIFtuZ0NsYXNzXT1cInsnZmx4LXBhZ2luYXRpb24tZW5kJzogZGlzYWJsZVByZXZ0QnV0dG9uKCl9XCIgKGNsaWNrKT1cIm5leHRQcmV2SXRlbSgncHJldicpXCIgW2Rpc2FibGVkXT1cImRpc2FibGVQcmV2dEJ1dHRvbigpXCIgY2xhc3M9XCJmbHgtdWktZGF0YXRhYmxlLXBhZ2luYXRpb24tYnV0dG9ucyB7eyBjbGFzc2VzPy5wYWdpbmF0aW9uQnV0dG9uIH19XCI+PHNwYW4gY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3VibGUtbGVmdCBmYS0xeFwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJmbHgtZGF0YXRhYmxlLXRvb2x0aXAtcHJldlwiIFtuZ0NsYXNzXT1cInsnZmx4LXBhZ2luYXRpb24tZW5kJzogZGlzYWJsZVByZXZ0QnV0dG9uKCl9XCI+UHJldmlvdXM8L3NwYW4+IDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIHt7IHNlcnZpY2U/LmRhdGFPZmZzZXQgfCBjZWlsOiBsaW1pdCB9fSAvIHt7IHNlcnZpY2U/LnRvdGFsSXRlbXMgfCBjZWlsOiBsaW1pdCB9fVxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gW25nQ2xhc3NdPVwieydmbHgtcGFnaW5hdGlvbi1lbmQnOiBkaXNhYmxlTmV4dEJ1dHRvbigpfVwiIChjbGljayk9XCJuZXh0UHJldkl0ZW0oJ25leHQnKVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlTmV4dEJ1dHRvbigpXCIgY2xhc3M9XCJmbHgtdWktZGF0YXRhYmxlLXBhZ2luYXRpb24tYnV0dG9ucyB7eyBjbGFzc2VzPy5wYWdpbmF0aW9uQnV0dG9uIH19XCI+PHNwYW4gY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3VibGUtcmlnaHQgZmEtMXhcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiZmx4LWRhdGF0YWJsZS10b29sdGlwLW5leHRcIiBbbmdDbGFzc109XCJ7J2ZseC1wYWdpbmF0aW9uLWVuZCc6IGRpc2FibGVOZXh0QnV0dG9uKCl9XCI+TmV4dDwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgW2NsYXNzXT1cIidzZWFyY2gtYmFyICcrZ2V0U2VhcmNoQ29sdW1ucygpXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAqbmdJZj1cIiFpc0xhenlsb2FkaW5nRW5hYmxlZCgpXCIgW3N0eWxlLmJhY2tncm91bmRdPVwic2VhcmNoQmFyPy5iYWNrZ3JvdW5kXCIgW3N0eWxlLmNvbG9yXT1cInNlYXJjaEJhcj8udGV4dENvbG9yXCIgW25nU3R5bGVdPVwie2JvcmRlcjpzZWFyY2hCYXI/LmJvcmRlclNpemUgKycgc29saWQgJysgc2VhcmNoQmFyPy5ib3JkZXJDb2xvcn0gXCIgKGtleXVwKT1cImZpbHRlckRhdGEoJGV2ZW50Py50YXJnZXQ/LnZhbHVlKVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIHJtc2ggcm1yZCBjdXN0b21jbGFzc1wiIFtwbGFjZWhvbGRlcl09XCJzZWFyY2hQbGFjZWhvbGRlclwiPlxuICAgICAgICAgICAgPGZvcm0gKG5nU3VibWl0KT1cInNlYXJjaERhdGFJbkFwaShzcmNoPy52YWx1ZSxzcmNoKVwiICNzcmNoPVwibmdGb3JtXCIgKm5nSWY9XCJpc0xhenlsb2FkaW5nRW5hYmxlZCgpXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIG5hbWU9XCJzZWFyY2hTdHJpbmdcIiBuZ01vZGVsIFtzdHlsZS5iYWNrZ3JvdW5kXT1cInNlYXJjaEJhcj8uYmFja2dyb3VuZFwiIFtzdHlsZS5jb2xvcl09XCJzZWFyY2hCYXI/LnRleHRDb2xvclwiIFtuZ1N0eWxlXT1cIntib3JkZXI6c2VhcmNoQmFyPy5ib3JkZXJTaXplICsnIHNvbGlkICcrIHNlYXJjaEJhcj8uYm9yZGVyQ29sb3J9IFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIHJtc2ggcm1yZCB7eyBjbGFzc2VzPy5zZWFyY2hiYXIgfX1cIiBbcGxhY2Vob2xkZXJdPVwic2VhcmNoUGxhY2Vob2xkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBbZGlzYWJsZWRdPVwiIXNyY2g/LnZhbGlkXCIgdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1jbGVhciBidG4tbWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEgdGV4dC1yaWdodCBybXBkXCIgKm5nSWY9XCJoYXNBZGRCdXR0b25cIj5cbiAgICAgICAgICAgIDxidXR0b24gKGNsaWNrKT1cImFkZEJ1dHRvbkNsaWNrKClcIiBjbGFzcz1cInt7IGNsYXNzZXM/LmFkZEJ1dHRvbiB9fVwiIFtzdHlsZS5iYWNrZ3JvdW5kXT1cImFkZEJ1dHRvbj8uYmFja2dyb3VuZFwiIFtzdHlsZS5ib3JkZXJDb2xvcl09XCJhZGRCdXR0b24/LmJhY2tncm91bmRcIiBbc3R5bGUuY29sb3JdPVwiYWRkQnV0dG9uPy50ZXh0Q29sb3JcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj4gQWRkPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEgdGV4dC1yaWdodCBybXBkIGV4cG9ydC1jbnRcIiAqbmdJZj1cImVuYWJsZURhdGFFeHBvcnRzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCB7eyBjbGFzc2VzPy5leHBvcnRCdXR0b24gfX0gZHJvcGRvd24tdG9nZ2xlXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImNhcmV0XCI+PC9pPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1leHBvcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCI+e3sgZGF0YUV4cG9ydHNDb25maWc/LnRpdGxlIH19LiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgKGNoYW5nZSk9XCJjaGVja1RvRXhwb3J0T3B0aW9uKCRldmVudD8udGFyZ2V0Py5jaGVja2VkKVwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO3RvcDowLjNlbTtcIj4gPHN1cCBzdHlsZT1cImZvbnQtc2l6ZToxMHB4O2NvbG9yOiM5OTk7XCI+IEFsbDwvc3VwPjwvbGk+IFxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkaXZpZGVyXCI+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24tc3VibWVudVwiICpuZ0Zvcj1cImxldCBleHBvcnQgb2YgZGF0YUV4cG9ydHNDb25maWc/LmV4cG9ydHNUb1wiIChjbGljayk9XCJleHBvcnREb2N1bWVudHNBcyhleHBvcnQpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgKm5nSWY9XCJleHBvcnQ9PSdwcmludCdcIj48aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcHJpbnRcIj48L2k+IFByaW50PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiICpuZ0lmPVwiZXhwb3J0PT0ncGRmJ1wiIHN0eWxlPVwiY29sb3I6I2ZmMDAwMFwiPjxpIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1maWxlXCI+PC9pPiBQREY8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgKm5nSWY9XCJleHBvcnQ9PSdleGNlbCdcIiBzdHlsZT1cImNvbG9yOiMwMDk5MDA7XCI+PGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZpbGVcIj48L2k+IEV4Y2VsPC9hPiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiICpuZ0lmPVwiZXhwb3J0PT0nd29yZCdcIiBzdHlsZT1cImNvbG9yOiMzMzU1OTk7XCI+PGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZpbGVcIj48L2k+IFdvcmQ8L2E+ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICAqbmdJZj1cIiFpc0V4cG9ydEFsbFwiPnt7IChkaXNwbGF5RGF0YSB8IGFzeW5jKT8ubGVuZ3RoIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gICpuZ0lmPVwiaXNFeHBvcnRBbGxcIj57eyAoc2VydmljZT8uZmx4RGF0YSB8IGFzeW5jKT8ubGVuZ3RoIH19PC9zcGFuPiBcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHJtcGQgdGFibGUtcmVzcG9uc2l2ZVwiPlxuICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB7eyBjbGFzc2VzPy50YWJsZVR5cGUgfX0gdGFibGUtcmVzcG9uc2l2ZVwiIGlkPVwiZmx4X3VpX3RhYmxlX3RhZ1wiPlxuICAgICAgICAgICAgPHRoZWFkIGNsYXNzPVwie3sgY2xhc3Nlcz8udGFibGVIZWFkZXIgfX1cIj5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0aCAqbmdJZj1cIiFoaWRlTnVtYmVyc1wiPk48c3VwPjx1Pm88L3U+PC9zdXA+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoICpuZ0Zvcj1cImxldCBoZWFkZXIgb2YgaGVhZGVyc1wiPnt7IGhlYWRlciB9fTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aCAqbmdJZj1cImhhc0FjdGlvbkJ1dHRvbnNcIj57eyBhY3Rpb25IZWFkZXIgfX0gXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgW2NoZWNrZWRdPVwic2VydmljZT8ubXVsdGlwbGVEZWxldGlvbj8ubGVuZ3RoPjBcIiAoY2hhbmdlKT1cImFkZFJlbW92ZSgkZXZlbnQ/LnRhcmdldD8uY2hlY2tlZClcIiAqbmdJZj1cImVuYWJsZU11bHRpcGxlU2VsZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzIGZseC1tdWx0aXBsZS1kZWxldGlvbi1idXR0b25cIiAqbmdJZj1cImVuYWJsZU11bHRpcGxlU2VsZWN0aW9uICYmIHNlcnZpY2U/Lm11bHRpcGxlRGVsZXRpb24/Lmxlbmd0aD4wXCIgKGNsaWNrKT1cImNvbmZpcm1EZWxldGUoKVwiPjxzcGFuIFtjbGFzc109XCJtdWx0aXBsZVNlbGVjdEJ1dHRvbj8uaWNvblwiPjwvc3Bhbj4ge3sgbXVsdGlwbGVTZWxlY3RCdXR0b24/LnRleHQgfX08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHIgKm5nSWY9XCIhc2VydmljZT8ubG9hZEZpbmlzaFwiPiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMjBcIiBjbGFzcz1cInRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nICpuZ0lmPVwic3Bpbm5lclNyY1wiIFtjbGFzc109XCJjbGFzc2VzPy5zcGlubmVyXCIgW3NyY109XCJzcGlubmVyU3JjXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjFlbTttYXJnaW4tYm90dG9tOjFlbTtcIj5cbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImZseHVpZGF0YXRhYmxlcm93XCIgaWQ9XCJmbHhkYXRhdGFibGVfc2luZ2xlcm93XCIgKm5nRm9yPVwibGV0IGRhdGEgb2YgZGlzcGxheURhdGEgfCBhc3luYztsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8IS0tIE51bWJlcnMgLS0+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInt7IGNsYXNzZXM/LnRhYmxlRGF0YSB9fVwiICpuZ0lmPVwiIWhpZGVOdW1iZXJzXCIgc3R5bGU9XCJjb2xvcjogIzk5OTtcIj57eyBvZmZzZXQraSB9fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwhLS0gTWFpbiAtLT5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwie3sgY2xhc3Nlcz8udGFibGVEYXRhIH19XCIgKm5nRm9yPVwibGV0IGRhdGFLZXkgb2YgZGF0YUtleXM7bGV0IHg9aW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgKm5nSWY9XCJoYXNJbWFnZUVtYmVkZWQoKSAmJiB4PT1lbWJlZFBpY3R1cmVzPy5pbmRleFwiIFtjbGFzc109XCInaW1nLWZhbGwtYmFjayAnICtlbWJlZFBpY3R1cmVzPy5jbGFzc1wiIFtzcmNdPVwiZW1iZWRQaWN0dXJlcz8ucm9vdEZvbGRlcitkYXRhW2RhdGFLZXldXCIgW2ZseC11aS1kYXRhdGFibGUtaW1nLWZhbGxiYWNrXT1cImVtYmVkUGljdHVyZXM/LmZhbGxiYWNrVXJsXCIgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhaGFzSW1hZ2VFbWJlZGVkKCkgfHwgeCE9ZW1iZWRQaWN0dXJlcz8uaW5kZXhcIj57eyBkYXRhW2RhdGFLZXldIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8IS0tIEJ1dHRvbnMgLS0+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWJ1dHRvbnNcIiAqbmdJZj1cImhhc0FjdGlvbkJ1dHRvbnNcIiBzY29wZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nRm9yPVwibGV0IGFCdXR0b24gb2YgYWN0aW9uQnV0dG9ucztsZXQgYnV0dG9uSW5kZXg9aW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIChjbGljayk9XCJhY3Rpb25CdXR0b25DbGlja2VkKGksYnV0dG9uSW5kZXgpXCIgY2xhc3M9XCJidG4ge3sgYUJ1dHRvbj8uY2xhc3MgfX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvbHRpcFwiIGNsYXNzPVwiZmx4LXRvb2x0aXBcIiBbbmdDbGFzc109XCJ7J2ZseC10b29sdGlwLWxlZnQnOmFCdXR0b24/LnRvb2x0aXBQb3NpdGlvbj09J2xlZnQnLCdmbHgtdG9vbHRpcC1ib3R0b20nOmFCdXR0b24/LnRvb2x0aXBQb3NpdGlvbj09J2JvdHRvbScsJ2ZseC10b29sdGlwLXJpZ2h0JzphQnV0dG9uPy50b29sdGlwUG9zaXRpb249PSdyaWdodCd9XCIgKm5nSWY9XCJhQnV0dG9uPy50b29sdGlwXCI+e3sgYUJ1dHRvbj8udG9vbHRpcCB9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFjdGlvbi1idXR0b24taWNvbi1sZWZ0XCIgW2NsYXNzXT1cImFCdXR0b24/Lmljb25cIiAqbmdJZj1cIiFhQnV0dG9uPy5pY29uUG9zaXRpb24gfHwgYUJ1dHRvbj8uaWNvblBvc2l0aW9uIT0ncmlnaHQnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJ1dHRvbi10ZXh0XCI+IHt7IGFCdXR0b24/LnRleHQgfX0gPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBbY2xhc3NdPVwiYUJ1dHRvbj8uaWNvblwiICpuZ0lmPVwiYUJ1dHRvbj8uaWNvblBvc2l0aW9uPT0ncmlnaHQnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPiBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkIChjaGFuZ2UpPVwiYWRkUmVtb3ZlRGVsZXRlSXRlbShkYXRhW211bHRpcGxlU2VsZWN0S2V5XSxpLCRldmVudD8udGFyZ2V0Py5jaGVja2VkKVwiICpuZ0lmPVwiZW5hYmxlTXVsdGlwbGVTZWxlY3Rpb24gJiYgc2VydmljZT8ubXVsdGlwbGVEZWxldGlvbj8ubGVuZ3RoPjBcIj5cbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0ciAqbmdJZj1cInREYXRhPy5sZW5ndGg8MVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjEwXCIgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiICpuZ0lmPVwic2VydmljZT8ubG9hZEZpbmlzaFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjojZmYwMDAwO2ZvbnQtc2l6ZToxM3B4O1wiPk5vIGRhdGEgZm91bmQ8L3NwYW4+IDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJtYXJnaW4tdG9wOjFlbTtcIiAoY2xpY2spPVwicmVsb2FkKClcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCB7eyBjbGFzc2VzPy5yZWxvYWRidXR0b24gfX1cIiBjb2xvcj1cInByaW1hcnlcIj48c3BhbiBjbGFzcz1cImZhIGZhLXJlZnJlc2hcIj48L3NwYW4+IFJlbG9hZDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHJtcGQgZmx4LXRvdGFsLWRhdGFcIiAqbmdJZj1cInNob3dCb3R0b21JbmZvXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgdGV4dC1sZWZ0IHJtcGRcIj5Ub3RhbCBwYWdpbmF0aW9uOiA8c3Bhbj4ge3sgc2VydmljZT8udG90YWxJdGVtcyB8IGNlaWw6IGxpbWl0IH19PC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00IHRleHQtY2VudGVyIHJtcGRcIj4jIG9mIGl0ZW1zIHBlciBwYWdpbmF0aW9uOiA8c3Bhbj57eyBsaW1pdCB9fTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCB0ZXh0LXJpZ2h0IHJtcGRcIj5Ub3RhbCBpdGVtczogPHNwYW4+e3sgKHNlcnZpY2U/LmZseERhdGEgfCBhc3luYyk/Lmxlbmd0aCB9fTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLmZseC11aS1kYXRhdGFibGUtbWFpbntiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7cGFkZGluZy10b3A6MWVtO3BhZGRpbmctYm90dG9tOjFlbX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tZGFuZ2Vye2JhY2tncm91bmQtY29sb3I6I2Y1MDA1Nztib3JkZXI6MXB4IHNvbGlkICNmNTAwNTc7Ym94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW1vei1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy1vLWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy1tcy1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDtib3JkZXItcmFkaXVzOjNweDttYXJnaW4tbGVmdDouM2VtfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gaW1nLmltZy1mYWxsLWJhY2t7d2lkdGg6MzBweDtoZWlnaHQ6MzBweH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5wYWdpbmF0aW9uLXNlbGVjdCBpbnB1dFt0eXBlPXRleHRdLC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnBhZ2luYXRpb24tc2VsZWN0IHNlbGVjdCwuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5zZWFyY2gtYmFyIGlucHV0W3R5cGU9dGV4dF0sLmZseC11aS1kYXRhdGFibGUtbWFpbiAuc2VhcmNoLWJhciBzZWxlY3R7Ym9yZGVyLXRvcDpub25lIWltcG9ydGFudDtib3JkZXItbGVmdDpub25lIWltcG9ydGFudDtib3JkZXItcmlnaHQ6bm9uZSFpbXBvcnRhbnQ7Ym9yZGVyLWJvdHRvbToycHggc29saWQgI2RkZCFpbXBvcnRhbnQ7Ym9yZGVyLXJhZGl1czowIWltcG9ydGFudDtib3gtc2hhZG93OjAgMCAwIDAgdHJhbnNwYXJlbnQhaW1wb3J0YW50Oy1tb3otYm94LXNoYWRvdzowIDAgMCAwIHRyYW5zcGFyZW50IWltcG9ydGFudDstd2Via2l0LWJveC1zaGFkb3c6MCAwIDAgMCB0cmFuc3BhcmVudCFpbXBvcnRhbnQ7LW8tYm94LXNoYWRvdzowIDAgMCAwIHRyYW5zcGFyZW50IWltcG9ydGFudDstbXMtYm94LXNoYWRvdzowIDAgMCAwIHRyYW5zcGFyZW50IWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5wYWdpbmF0aW9uLXNlbGVjdCBpbnB1dFt0eXBlPXRleHRdOmZvY3VzLC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnBhZ2luYXRpb24tc2VsZWN0IHNlbGVjdDpmb2N1cywuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5zZWFyY2gtYmFyIGlucHV0W3R5cGU9dGV4dF06Zm9jdXMsLmZseC11aS1kYXRhdGFibGUtbWFpbiAuc2VhcmNoLWJhciBzZWxlY3Q6Zm9jdXN7Ym9yZGVyLWJvdHRvbS1jb2xvcjojMzU5IWltcG9ydGFudDt0cmFuc2l0aW9uOi41czstbW96LXRyYW5zaXRpb246LjVzOy13ZWJraXQtdHJhbnNpdGlvbjouNXM7LW8tdHJhbnNpdGlvbjouNXM7LW1zLXRyYW5zaXRpb246LjVzfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnBhZ2luYXRpb24tc2VsZWN0IHNlbGVjdCwuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5zZWFyY2gtYmFyIHNlbGVjdHstd2Via2l0LWFwcGVhcmFuY2U6bm9uZTthcHBlYXJhbmNlOm5vbmU7LW1vei1hcHBlYXJhbmNlOm5vbmV9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9ue3BhZGRpbmctdG9wOi41ZW19LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIGJ1dHRvbnt3aWR0aDozNXB4IWltcG9ydGFudDtoZWlnaHQ6MzVweCFpbXBvcnRhbnQ7Ym9yZGVyLXJhZGl1czo1MGVtIWltcG9ydGFudDtib3JkZXI6bm9uZSFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2Oy1vLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7YmFja2dyb3VuZC1jb2xvcjojMzU5O2NvbG9yOiNmZmY7Zm9udC1zaXplOjIzcHg7Zm9udC13ZWlnaHQ6NzAwO3Bvc2l0aW9uOmFic29sdXRlO3RvcDowfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBidXR0b246Zmlyc3QtY2hpbGR7bGVmdDowfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBidXR0b246Zmlyc3QtY2hpbGQgLmZseC1kYXRhdGFibGUtdG9vbHRpcC1wcmV2e3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDtmb250LXNpemU6MTNweDtmb250LXdlaWdodDo0MDA7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kLWNvbG9yOiMzNTk7cGFkZGluZy1sZWZ0Oi4zZW07cGFkZGluZy1yaWdodDouM2VtO2JvcmRlci1yYWRpdXM6M3B4O21hcmdpbi1sZWZ0Oi01N3B4O21hcmdpbi10b3A6LjVlbTtib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2IWltcG9ydGFudDstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50Oy13ZWJraXQtYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50O3Zpc2liaWxpdHk6aGlkZGVufS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBidXR0b246aG92ZXI+c3Bhbi5mbHgtZGF0YXRhYmxlLXRvb2x0aXAtbmV4dCwuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5mbHgtZGF0YXRhYmxlLXBhZ2luYXRpb24gYnV0dG9uOmhvdmVyPnNwYW4uZmx4LWRhdGF0YWJsZS10b29sdGlwLXByZXZ7dmlzaWJpbGl0eTp2aXNpYmxlfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiAuZmx4LXBhZ2luYXRpb24tZW5ke2JhY2tncm91bmQtY29sb3I6I2Y1MDA1NyFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDNweCAxMHB4IDAgI2ZmYzJkOCFpbXBvcnRhbnQ7LW1vei1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjZmZjMmQ4IWltcG9ydGFudDstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNmZmMyZDghaW1wb3J0YW50Oy1vLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNmZmMyZDghaW1wb3J0YW50Oy1tcy1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjZmZjMmQ4IWltcG9ydGFudDtjdXJzb3I6bm90LWFsbG93ZWR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIC5mbHgtcGFnaW5hdGlvbi1lbmQ6aG92ZXI+c3Bhbi5mbHgtZGF0YXRhYmxlLXRvb2x0aXAtbmV4dCwuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5mbHgtZGF0YXRhYmxlLXBhZ2luYXRpb24gLmZseC1wYWdpbmF0aW9uLWVuZDpob3Zlcj5zcGFuLmZseC1kYXRhdGFibGUtdG9vbHRpcC1wcmV2e3Zpc2liaWxpdHk6aGlkZGVufS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBidXR0b246bGFzdC1jaGlsZHtyaWdodDowfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBidXR0b246bGFzdC1jaGlsZCAuZmx4LWRhdGF0YWJsZS10b29sdGlwLW5leHR7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjQwMDtjb2xvcjojZmZmO2JhY2tncm91bmQtY29sb3I6IzM1OTtwYWRkaW5nLWxlZnQ6LjNlbTtwYWRkaW5nLXJpZ2h0Oi4zZW07Ym9yZGVyLXJhZGl1czozcHg7bWFyZ2luLWxlZnQ6MzVweDttYXJnaW4tdG9wOi41ZW07Ym94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7LW1vei1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2IWltcG9ydGFudDstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50Oy1vLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50Oy1tcy1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2IWltcG9ydGFudDt2aXNpYmlsaXR5OmhpZGRlbn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5leHBvcnQtY250IGJ1dHRvbntib3JkZXItcmFkaXVzOjUwZW0haW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGV7bWFyZ2luLXRvcDoxLjVlbX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRye3BhZGRpbmctdG9wOjAhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHIgdGR7cGFkZGluZy10b3A6LjVlbTtib3JkZXItdG9wOjFweCBzb2xpZCAjZjBmMGYwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmMGYwZjB9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZCBidXR0b257bWFyZ2luLXJpZ2h0Oi4zZW07bWFyZ2luLWxlZnQ6MH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyIHRkIGJ1dHRvbiBkaXYuZmx4LXRvb2x0aXB7cG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDMyLDI3LDI3LC44MDgpO3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czozcHg7Ym94LXNoYWRvdzowIDNweCAyMHB4IDAgIzRiNDk0OTstbW96LWJveC1zaGFkb3c6MCAzcHggMjBweCAwICM0YjQ5NDk7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDIwcHggMCAjNGI0OTQ5Oy1vLWJveC1zaGFkb3c6MCAzcHggMjBweCAwICM0YjQ5NDk7LW1zLWJveC1zaGFkb3c6MCAzcHggMjBweCAwICM0YjQ5NDk7bWFyZ2luLWxlZnQ6LTIuNWVtO21hcmdpbi10b3A6LTIuOGVtO3Zpc2liaWxpdHk6aGlkZGVuO3dpZHRoOjgwcHg7cGFkZGluZzouM2VtIC41ZW19LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZCBidXR0b24gLmZseC10b29sdGlwLWxlZnR7bWFyZ2luLWxlZnQ6LTk1cHghaW1wb3J0YW50O21hcmdpbi10b3A6LS4zZW0haW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHIgdGQgYnV0dG9uIC5mbHgtdG9vbHRpcC1ib3R0b217bWFyZ2luLXRvcDoyLjNlbSFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZCBidXR0b24gLmZseC10b29sdGlwLXJpZ2h0e21hcmdpbi1sZWZ0OjI4cHghaW1wb3J0YW50O21hcmdpbi10b3A6LS4zZW0haW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHIgdGQgYnV0dG9uOmhvdmVyPmRpdi5mbHgtdG9vbHRpcHt0cmFuc2l0aW9uOi4zczt2aXNpYmlsaXR5OnZpc2libGV9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZC50YWJsZS1idXR0b25ze3BhZGRpbmctdG9wOi4yZW07cGFkZGluZy1ib3R0b206LjJlbX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyOm50aC1vZi10eXBlKGV2ZW4pe2JhY2tncm91bmQtY29sb3I6I2Y4ZjlmYX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyOm50aC1vZi10eXBlKG9kZCl7YmFja2dyb3VuZC1jb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kYW5nZXI6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZmYxNDZiO2JvcmRlcjoxcHggc29saWQgI2ZmMTQ2Yjtib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICNmZjVmYjY7LW1vei1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICNmZjVmYjY7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICNmZjVmYjY7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjZmY1ZmI2Oy1tcy1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICNmZjVmYjY7dHJhbnNpdGlvbjouNXM7LW1vei10cmFuc2l0aW9uOi41czstd2Via2l0LXRyYW5zaXRpb246LjVzOy1vLXRyYW5zaXRpb246LjVzOy1tcy10cmFuc2l0aW9uOi41c30uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tZGFuZ2VyOmZvY3Vze2JhY2tncm91bmQtY29sb3I6I2Y1MDA1Nztib3JkZXI6MXB4IHNvbGlkICNmNTAwNTd9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXdoaXRle2JhY2tncm91bmQtY29sb3I6I2ZmZn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tZGFya3tiYWNrZ3JvdW5kLWNvbG9yOiMyMjIhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1wcmltYXJ5e2JhY2tncm91bmQtY29sb3I6IzM1OTtjb2xvcjojZmZmO2JvcmRlcjoxcHggc29saWQgIzM1OTtib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbW96LWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW8tYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW1zLWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkO2JvcmRlci1yYWRpdXM6M3B4fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1wcmltYXJ5OmhvdmVye2JhY2tncm91bmQtY29sb3I6IzQ3NjlhZDtib3JkZXI6MXB4IHNvbGlkICM0NzY5YWQ7Ym94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2Oy1vLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7dHJhbnNpdGlvbjouNXM7LW1vei10cmFuc2l0aW9uOi41czstd2Via2l0LXRyYW5zaXRpb246LjVzOy1vLXRyYW5zaXRpb246LjVzOy1tcy10cmFuc2l0aW9uOi41c30uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tcHJpbWFyeTpmb2N1c3tiYWNrZ3JvdW5kLWNvbG9yOiMzNTk7Ym9yZGVyOjFweCBzb2xpZCAjMzU5fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1sYXJnZXtwYWRkaW5nLXRvcDoxZW0haW1wb3J0YW50O3BhZGRpbmctYm90dG9tOjFlbSFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLW1lZGl1bXtwYWRkaW5nLXRvcDouN2VtIWltcG9ydGFudDtwYWRkaW5nLWJvdHRvbTouN2VtIWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tc3VjY2Vzc3tib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbW96LWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW8tYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW1zLWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkO2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQtY29sb3I6IzVjYjg1Yztib3JkZXI6MXB4IHNvbGlkICM1Y2I4NWN9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXN1Y2Nlc3M6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojNzBjYzcwO2JvcmRlcjoxcHggc29saWQgIzcwY2M3MDtib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICM5ZGY5OWQ7LW1vei1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICM5ZGY5OWQ7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICM5ZGY5OWQ7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjOWRmOTlkOy1tcy1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICM5ZGY5OWQ7dHJhbnNpdGlvbjouNXM7LW1vei10cmFuc2l0aW9uOi41czstd2Via2l0LXRyYW5zaXRpb246LjVzOy1vLXRyYW5zaXRpb246LjVzOy1tcy10cmFuc2l0aW9uOi41c30uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tc3VjY2Vzczpmb2N1c3tiYWNrZ3JvdW5kLWNvbG9yOiM1Y2I4NWM7Ym9yZGVyOjFweCBzb2xpZCAjNWNiODVjfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kZWZhdWx0e2JhY2tncm91bmQtY29sb3I6I2ZmZjtib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2VlZTstbW96LWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZWVlOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNlZWU7LW8tYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNlZWU7LW1zLWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZWVlO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlcjoxcHggc29saWQgI2RkZH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tZGVmYXVsdDpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyOjFweCBzb2xpZCAjZTdlN2U3O2JveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2UyZTJlMjstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2UyZTJlMjstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2UyZTJlMjstby1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICNlMmUyZTI7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2UyZTJlMjt0cmFuc2l0aW9uOi41czstbW96LXRyYW5zaXRpb246LjVzOy13ZWJraXQtdHJhbnNpdGlvbjouNXM7LW8tdHJhbnNpdGlvbjouNXM7LW1zLXRyYW5zaXRpb246LjVzfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kZWZhdWx0OmZvY3Vze2JhY2tncm91bmQtY29sb3I6I2ZmZjtib3JkZXI6MXB4IHNvbGlkICNkZGR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXNlY29uZGFyeXtib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbW96LWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW8tYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW1zLWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkO2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQtY29sb3I6IzFlODhlNTtjb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1zZWNvbmRhcnk6aG92ZXJ7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kLWNvbG9yOiMyODkyZWY7Ym9yZGVyOjFweCBzb2xpZCAjMjg5MmVmO2JveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzU1YmZmZjstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzU1YmZmZjstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzU1YmZmZjstby1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICM1NWJmZmY7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzU1YmZmZjt0cmFuc2l0aW9uOi41czstbW96LXRyYW5zaXRpb246LjVzOy13ZWJraXQtdHJhbnNpdGlvbjouNXM7LW8tdHJhbnNpdGlvbjouNXM7LW1zLXRyYW5zaXRpb246LjVzfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1zZWNvbmRhcnk6Zm9jdXN7Y29sb3I6I2ZmZn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5wYWdpbmF0aW9uLWJ1dHRvbntiYWNrZ3JvdW5kLWNvbG9yOiMzNTk7Y29sb3I6I2ZmZn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC50YWJsZS1mb250e2ZvbnQtZmFtaWx5OktodWxhLHNhbnMtc2VyaWYhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnRhYmxlLWhlYWRlci1pY29ue3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0Oi4yZW07d2lkdGg6ODBweDtoZWlnaHQ6ODBweDtmb250LXNpemU6NTBweDttYXJnaW4tdG9wOi0zMHB4O2JvcmRlci1yYWRpdXM6NXB4IWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC50YWJsZS10aXRsZXtiYWNrZ3JvdW5kLWNvbG9yOiMzNTk7Y29sb3I6I2ZmZjtib3JkZXItcmFkaXVzOjJweDtwYWRkaW5nOjFlbTtmb250LXNpemU6MTVweDtmb250LXdlaWdodDo3MDA7bWFyZ2luLWJvdHRvbToxLjVlbTtmb250LWZhbWlseTpSb2JvdG8sc2Fucy1zZXJpZjtib3gtc2hhZG93OjAgMXB4IDVweCAxcHggI2RkZDstbW96LWJveC1zaGFkb3c6MCAxcHggNXB4IDFweCAjZGRkOy13ZWJraXQtYm94LXNoYWRvdzowIDFweCA1cHggMXB4ICNkZGQ7LW8tYm94LXNoYWRvdzowIDFweCA1cHggMXB4ICNkZGQ7LW1zLWJveC1zaGFkb3c6MCAxcHggNXB4IDFweCAjZGRkfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmRhbmdlcntiYWNrZ3JvdW5kLWNvbG9yOiNmNTAwNTc7Y29sb3I6I2ZmZn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5wcmltYXJ5e2JhY2tncm91bmQtY29sb3I6IzM1OTtjb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnN1Y2Nlc3N7YmFja2dyb3VuZC1jb2xvcjojNWNiODVjO2NvbG9yOiNmZmZ9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZGVmYXVsdHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Y29sb3I6IzAwMH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5zZWNvbmRhcnl7YmFja2dyb3VuZC1jb2xvcjojMWU4OGU1O2NvbG9yOiNmZmZ9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLWNsZWFye2JvcmRlcjpub25lIWltcG9ydGFudDtib3gtc2hhZG93Om5vbmUhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmlucHV0LWdyb3VwLC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmlucHV0LWdyb3VwIGlucHV0e2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmlucHV0LWdyb3VwLWFkZG9ue2JvcmRlcjpub25lIWltcG9ydGFudDtwYWRkaW5nOjAhaW1wb3J0YW50O2JveC1zaGFkb3c6bm9uZSFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuaW5wdXQtZ3JvdXAtYWRkb24gYnV0dG9ue2JvcmRlcjoxcHggc29saWQgdHJhbnNwYXJlbnQhaW1wb3J0YW50O2JveC1zaGFkb3c6bm9uZSFpbXBvcnRhbnQ7Ym9yZGVyLXRvcDpub25lIWltcG9ydGFudDtib3JkZXItYm90dG9tOm5vbmUhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6NTBlbSFpbXBvcnRhbnQ7Y29sb3I6IzM1OTt3aWR0aDozMHB4O2hlaWdodDozMHB4fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmlucHV0LWdyb3VwLWFkZG9uIGJ1dHRvbiBpe2ZvbnQtc2l6ZToxOHB4fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmlucHV0LWdyb3VwLWFkZG9uIGJ1dHRvbjpkaXNhYmxlZHtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50IWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5pbnB1dC1ncm91cC1hZGRvbiBidXR0b246ZGlzYWJsZWQgaXtjb2xvcjojZjUwMDU3fWBdXG59KVxuZXhwb3J0IGNsYXNzIEZseFVpRGF0YXRhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LEFmdGVyVmlld0luaXR7XG4gIEBJbnB1dCgpIGNsYXNzZXM6IGFueSA9IHt9IDsvL3ttYWluY29udGFpbmVyfHNwaW5uZXJ8YWRkQnV0dG9ufHRhYmxlSGVhZGVyfHRhYmxlRGF0YXxleHBvcnRCdXR0b258U2VhcmNoQmFyfHRhYmxlVHlwZX1cbiAgQElucHV0KCkgaGVhZGVyczogQXJyYXk8c3RyaW5nPiA9IFtdIDsgLy8gVGFibGUgaGVhZGVycyAodjogMS4wLjApIFxuICBASW5wdXQoKSBsYXp5bG9hZGluZ0NvbmZpZzogYW55ID0ge30gO1xuICBASW5wdXQoKSBlbWJlZFBpY3R1cmVzOiBhbnkgPSB7fSA7XG4gIEBJbnB1dCgpIGRhdGFLZXlzOiBBcnJheTxzdHJpbmc+ID0gW10gOyAvLyBEYXRhIGtleXMgdG8gcG9wdWxhdGUuICAodjogMS4wLjApXG4gIEBJbnB1dCgpIGVuYWJsZURhdGFFeHBvcnRzOiBib29sZWFuID0gZmFsc2UgOy8vRGVmYXVsdCB0byBmYWxzZTsgKHY6IDEuMC4xKVxuICBASW5wdXQoKSBkYXRhRXhwb3J0c0NvbmZpZzogYW55ID0ge30gOy8vIGRhdGEgZXhwb3J0cyBjb25maWd1cmF0aW9uOiB7ZXhwb3J0c1RvOlsncHJpbnQnLCd3b3JkJywncGRmJywnZXhjZWwnXSx0aXRsZTonRXhwb3J0cyBkYXRhJyxkYXRhQ29sdW1uczpbXX19IERhdGEgY29sdW1ucyB0byBleHBvcnRcbiAgQElucHV0KCkgc2hvd0JvdHRvbUluZm86IGZhbHNlIDsgLy8gVG8gZW5hYmxlIHRhYmxlIGJvdHRvbSBpbmZvcm1hdGlvblxuICBASW5wdXQoKSBzZWFyY2hLZXlzID0gW10gOyAvLyBLZXlzIHRvIHNlYXJjaCBmb3Igc2VhcmNoIG9wdGltaXphdGlvbi4gICh2OiAxLjAuMClcbiAgQElucHV0KCkgZGF0YVNyY0tleTogc3RyaW5nID0gJycgLy8gRGF0YSB0byByZWFkIGZyb20ganNvbiByZXNwb25zZS4gICh2OiAxLjAuMClcbiAgQElucHV0KCkgaGFzQWN0aW9uQnV0dG9uczogYm9vbGVhbiA9IGZhbHNlIDsgLy9zcGVjaWZ5IGlmIGRhdGF0YWJsZSBzaG91bGQgaGF2ZSBhbmQgYWRkIGJ1dHRvbi4gKHY6IDEuMC4wKVxuICBASW5wdXQoKSBoaWRlTnVtYmVyczogYm9vbGVhbiA9IGZhbHNlIDsgLy9zcGVjaWZ5IGlmIHRoZSBudW1iZXJzLiAgKHY6IDEuMC4wKVxuICBASW5wdXQoKSBlbmFibGVNdWx0aXBsZVNlbGVjdGlvbjogYm9vbGVhbiA9IGZhbHNlIDsgLy8gRW5hYmxlIG11bHRpcGxlIHNlbGVjdCBpbnB1dCBib3ggdG8gYXBwZWFyLiAodjogMS4wLjApIGVuYWJsZU11bHRpcGxlRGVsZXRlIHJlbmFtZWQgdG8gZW5hYmxlTXVsdGlwbGVTZWxlY3Rpb24gaW4gKHY6MS4wLjEpXG4gIEBJbnB1dCgpIG11bHRpcGxlU2VsZWN0S2V5OiBzdHJpbmcgPSAnJyA7IC8vIFNwZWNpZnkgd2hpY2gga2V5IHRvIHNlbGVjdC4gKHY6MS4wLjApIG11bHRpcGxlRGVsZXRlS2V5IHJlbmFtZWQgdG8gbXVsdGlwbGVTZWxlY3RLZXkgaW4gKHY6MS4wLjApIDtcbiAgQElucHV0KCkgaGFzQWRkQnV0dG9uOiBib29sZWFuID0gZmFsc2UgOyAvLyBFbmFibGUgdG8gc2hvdyBhZGQgYnV0dG9uIG9uIHRoZSBoZWFkZXIuICh2OiAxLjAuMClcbiAgQElucHV0KCkgZGF0YVVybDogc3RyaW5nID0gJycgOyAvLyBVcmwgdG8gbG9hZCB0YWJsZSBkYXRhLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIGFjdGlvbkJ1dHRvblN0YXJ0OiBib29sZWFuID0gZmFsc2UgO1xuICBASW5wdXQoKSBtdWx0aXBsZVNlbGVjdEJ1dHRvbiA9IHsgdGV4dDogJ1NlbGVjdGVkJywgaWNvbjogJycgfTsgLy8gQ2hhbmdlIHRleHQgYW5kIGljb24gb24gbXVsdGlwbGUgc2VsZWN0IGJ1dHRvbi4gKHY6IDEuMC4xKVxuICBASW5wdXQoKSBzZWFyY2hQbGFjZWhvbGRlcjogc3RyaW5nID0gJ0VudGVyIG5hbWUgdG8gc2VhcmNoJyA7IC8vIENoYW5nZSBzZWFyY2ggYmFyIHBsYWNlaG9sZGVyLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIGFjdGlvbkhlYWRlcjogc3RyaW5nID0gJ0FjdGlvbnMnIDsgLy8gQ2hhbmdlIHRleHQgZm9yIGFjdGlvbiBidXR0b25zIGhlYWRlci4gKHY6IDEuMC4wKVxuICBASW5wdXQoKSBsaW1pdDogbnVtYmVyID0gMjAgOyAvLyBTcGVjaWZ5IG51bWJlciBvZiBpdGVtcyBwZXIgcGFnaW5hdGlvbi4gKHY6IDEuMC4wKVxuICBASW5wdXQoKSBzcGlubmVyU3JjOiBhbnkgPSAnJyA7IC8vIFNwaW5uZXIgdG8gc2hvdyB3aGVuIGxvYWRpbmcgZGF0YSBmcm9tIEFQSS4gKHY6IDEuMC4xKVxuICBASW5wdXQoKSBhY3Rpb25CdXR0b25zOiBBcnJheTxPYmplY3Q+ID0gW10gOyAvLyBTcGVjaWZ5IGFjdGlvbiBidXR0b25zLiBNYWtlIHN1cmUgdG8gc2V0IGhhc0FjdGlvbkJ1dHRvbnMgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IGJ1dHRvbiBpbiB0aGUgdGFibGUgcm93LiAodjogMS4wLjApXG4gIEBJbnB1dCgpIHBhZ2luYXRpb25CdXR0b25zOiBhbnkgPSB7YmFja2dyb3VuZDonI2RkZGRkZCcsdGV4dENvbG9yOicjMzM1NTk5J30gOyAvLyBDaGFuZ2UgYnV0dG9uIGJ1dHRvbiBiYWNrZ3JvdW5kIGFuZCB0ZXh0Q29sb3IuICh2OiAxLjAuMClcbiAgQElucHV0KCkgdGFibGVIZWFkZXI6IGFueSA9IHtiYWNrZ3JvdW5kOicjZmZmZmZmJyx0ZXh0Q29sb3I6JyMzMzU1OTknfSA7IC8vIENoYW5nZSB0YWJsZSBoZWFkZXIgYmFja2dyb3VuZCBhbmQgdGV4dCBjb2xvci4gKHY6IDEuMC4wKVxuICBASW5wdXQoKSBzZWFyY2hCdXR0b246IGFueSA9IHtiYWNrZ3JvdW5kOicjY2NjY2NjJyx0ZXh0Q29sb3I6JyMzMzU1OTknfSA7IC8vIENoYW5nZSBiYWNrZ3JvdW5kIGFuZCB0ZXh0IGNvbG9yIG9mIHRoZSBzZWFyY2ggYnV0dG9uLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYW55ID0ge30gOyAvL0NoYW5nZSBiYWNrZ3JvdW5kIGFuZCB0ZXh0IGNvbG9yIG9mIHRoZSBhZGQgYnV0dG9uLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIHNlYXJjaEJhcjogYW55ID0ge2JvcmRlclNpemU6JzFweCcsYm9yZGVyQ29sb3I6JyNjY2MnLGJhY2tncm91bmQ6JyNmZmZmZmYnLHRleHRDb2xvcjonIzAwMDAwMCd9IDsgLy8gQ2hhbmdlIGJhY2tncm91bmQgYW5kIHRleHQgY29sb3Igb2YgdGhlIHNlYXJjaCBiYXIuICh2OiAxLjAuMClcbiAgQE91dHB1dCgpIGZpcnN0QWN0aW9uQnV0dG9uQ2xpY2tlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKSA7IC8vIEhhbmRsZSBmaXJzdCBhY3Rpb24gYnV0dG9uLiAodjogMS4wLjApXG4gIEBPdXRwdXQoKSBzZWNvbmRBY3Rpb25CdXR0b25DbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpIDsgLy8gSGFuZGxlIHNlY29uZCBhY3Rpb24gYnV0dG9uLiAodjogMS4wLjApXG4gIEBPdXRwdXQoKSB0aGlyZEFjdGlvbkJ1dHRvbkNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gICBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKSA7IC8vIEhhbmRsZSB0aGlyZCBhY3Rpb24gYnV0dG9uLiAodjogMS4wLjApXG4gIEBPdXRwdXQoKSBtdWx0aXBsZVNlbGVjdENsaWNrZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCkgOyAvLyBIYW5kbGUgbXVsdGlwbGUgc2VsZWN0IGJ1dHRvbi4gKHY6IDEuMC4wKVxuICBAT3V0cHV0KCkgYWRkQnV0dG9uQ2xpY2tlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKSA7IC8vIEhhbmRsZSBhZGQgYnV0dG9uLiAodjogMS4wLjApXG4gIGlzRXhwb3J0QWxsOiBib29sZWFuID0gZmFsc2UgO1xuICBzZWFyY2hGb3JtOiBGb3JtR3JvdXAgO1xuICB0RGF0YTogYW55ID0gW10gO1xuICBiZWhhdmlvcjogQmVoYXZpb3JTdWJqZWN0PGFueT4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcbiAgLy9LZWVwIHRyYWNrIG9mIGN1cnJlbnQgZGF0YSBhZnRlciBzZWFyY2guIElmIHNlYXJjaCBzdHJpbmcgaXMgZW1wdHkgc2V0IGN1cnJlbnQgdmlldyBkYXRhXG4gIHB1YmxpYyBzZWFyY2hEYXRhVGVtcE9mZnNldCA9IFtdO1xuICAvL0RhdGEgdG8gZGlzcGxheSBpbiB0aGUgdGFibGUgYmFzZWQgb24gb2Zmc2V0XG4gIHB1YmxpYyBkaXNwbGF5RGF0YSA9IHRoaXMuYmVoYXZpb3IuYXNPYnNlcnZhYmxlKCk7IFxuICAvL0tlZXAgdHJhY2sgb2YgcGFnaW5hdGlvbiBudW1iZXJzXG4gIHB1YmxpYyBvZmZzZXQgPSAxO1xuICBwdWJsaWMgcmVsb2FkVXJsOnN0cmluZyAgO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX19mb3JtOiBGb3JtQnVpbGRlcixwdWJsaWMgc2VydmljZTogRmx4VWlEYXRhdGFibGVTZXJ2aWNlKXtcbiAgICBcbiAgfSAgXG4gIFxuICByZWxvYWQoKXtcbiAgICAgIHRoaXMuc2VydmljZS5sb2FkRmx4RGF0YVRhYmxlRGF0YSh0aGlzLnJlbG9hZFVybCx0cnVlKVxuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0gY2hlY2tlZCBFeHBvcnQgYWxsIHNlbGVjdGlvblxuICAgKi9cbiAgY2hlY2tUb0V4cG9ydE9wdGlvbihjaGVja2VkOmJvb2xlYW4pe1xuICAgIHRoaXMuaXNFeHBvcnRBbGwgPSBjaGVja2VkIDtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIGV4cG9ydFR5cGUgRXhwb3J0IHR5cGU6IHByaW50fHBkZnxleGNlbHx3b3JkXG4gICAqL1xuICBleHBvcnREb2N1bWVudHNBcyhleHBvcnRUeXBlOnN0cmluZyl7XG4gICAgbGV0IGxvYWRpbmc6IEhUTUxEaXZFbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV4cG9ydF9sb2FkaW5nXCIpIDtcbiAgICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snIDtcbiAgICBsZXQgaGVhZGVycyA9ICghdGhpcy5kYXRhRXhwb3J0c0NvbmZpZy5kYXRhQ29sdW1ucyB8fCB0aGlzLmRhdGFFeHBvcnRzQ29uZmlnLmRhdGFDb2x1bW5zLmxlbmd0aDwxKSA/IHRoaXMuZGF0YUtleXMgOiB0aGlzLmRhdGFFeHBvcnRzQ29uZmlnLmRhdGFDb2x1bW5zIDtcbiAgICBsZXQgZGF0YVRvRXhwb3J0ID0gKCF0aGlzLmlzRXhwb3J0QWxsKSA/IHRoaXMuZGlzcGxheURhdGEgOiB0aGlzLnNlcnZpY2UuZmx4RGF0YSA7XG4gICAgXG4gICAgLy9TdWJzY3JpYmUgdG8gZGF0YVxuICAgIGRhdGFUb0V4cG9ydC5zdWJzY3JpYmUoKGRhdGEpID0+IHsgICAgICAgICAgICAgIFxuICAgICAgICBsZXQgYXJyYXlPYmo6IEFycmF5PGFueT4gPSBbXSA7XG4gICAgICAgIC8vTG9vcCBhbmQgcHVzaCBkYXRhXG4gICAgICAgIGZvcihsZXQgZCBvZiBkYXRhKXtcbiAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IHt9IDtcbiAgICAgICAgICAgIGZvcihsZXQgaD0wO2g8aGVhZGVycy5sZW5ndGg7aCsrKXtcbiAgICAgICAgICAgICAgICBvYmpbaGVhZGVyc1toXV0gPSBkW2hlYWRlcnNbaF1dIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFycmF5T2JqLnB1c2gob2JqKSA7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZXhwb3J0VHlwZT09J3ByaW50Jyl7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICBwcmludEpTKHtwcmludGFibGU6YXJyYXlPYmoscHJvcGVydGllczpoZWFkZXJzLHR5cGU6J2pzb24nfSkgO1xuICAgICAgICAgICAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnIDtcbiAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJyA7XG4gICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUHJpbnRKUyBub3QgZm91bmQuIEFkZCBgaHR0cHM6Ly9wcmludGpzLTRkZTYua3hjZG4uY29tL3ByaW50Lm1pbi5qc2AgdG8geW91ciBpbmRleC5odG1sIG9yIGFkZCBhcyBwYXJ0IG9mIGFuZ3VsYXIuanNvbiBzY3JpcHQnKSA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGV4dGVuc2lvbiA9IChleHBvcnRUeXBlPT0ncGRmJykgPyAncGRmJzogKGV4cG9ydFR5cGU9PSdleGNlbCcpID8gJ3hsc3gnOiAnZG9jeCdcbiAgICAgICAgICAgIGxldCBwYWdlSWQgPSAoZXhwb3J0VHlwZT09J3BkZicpID8gMzogKGV4cG9ydFR5cGU9PSdleGNlbCcpID8gNTogNCA7XG5cbiAgICAgICAgICAgIGxldCByZXF1ZXN0RGF0YTogYW55ID0ge1wiZGF0YVwiOkpTT04uc3RyaW5naWZ5KGFycmF5T2JqKX1cbiAgICAgICAgICAgIHRoaXMuc2VydmljZS5wb3N0RGF0YSgnaHR0cDovL2V4cG9ydGVyLmF6dXJld2Vic2l0ZXMubmV0L2FwaS9leHBvcnQvRXhwb3J0RnJvbUpTT04vJyxwYWdlSWQscmVxdWVzdERhdGEpLnN1YnNjcmliZSgocmVzcCkgPT57XG4gICAgICAgICAgICAgICAgdmFyIGRvd25sb2FkID0gJ2h0dHA6Ly9leHBvcnRlci5henVyZXdlYnNpdGVzLm5ldC9hcGkvZXhwb3J0L0dldEZpbGUvJyArIHJlc3AgO1xuICAgICAgICAgICAgICAgIGRvd25sb2FkICs9IFwiP2ZpbGVOYW1lPWFuZHJlaSZleHRlbnNpb249XCIrIGV4dGVuc2lvbjtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGRvd25sb2FkIDtcbiAgICAgICAgICAgICAgICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScgO1xuICAgICAgICAgICAgfSwoZSA9PiB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZmlsZSBleHBvcnQgZXJyb3InLGUpIDtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pLnVuc3Vic2NyaWJlKCkgOyAgICBcbiAgfVxuXG4gIGhhc0ltYWdlRW1iZWRlZCgpOiBib29sZWFue1xuICAgIHJldHVybiB0aGlzLmVtYmVkUGljdHVyZXMuaGFzT3duUHJvcGVydHkoXCJpbmRleFwiKSA7XG4gIH1cblxuICBnZXRJbWFnZSgpe1xuICAgICAgY29uc29sZS5sb2coJ2VvZW9lJylcbiAgICAvLyAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKSA7XG4gICAgLy8gICBpbWcuc3JjID0gaW1hZ2VTcmMgO1xuICAgIC8vICAgaW1nLm9ubG9hZCA9ICgoZSk9PntcbiAgICAvLyAgICAgICByZXR1cm4gaW1hZ2VTcmMgO1xuICAgIC8vICAgfSkgO1xuICAgIC8vICAgaW1nLm9uZXJyb3IgPSAoKGUpPT57XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmVtYmVkUGljdHVyZXMuZmFsbGJhY2tVcmwgO1xuICAgIC8vICAgfSlcbiAgfVxuXG4gIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xuICAgIFxuICAgIHZhciBDU1YgPSAnJzsgICAgXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXG4gICAgXG4gICAgQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XG5cbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxuICAgIGlmIChTaG93TGFiZWwpIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG4gICAgXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cblxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gICBcbiAgICBcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXG4gICAgdmFyIGZpbGVOYW1lID0gXCJNeVJlcG9ydF9cIjtcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxuICAgIFxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsJyArIGVzY2FwZShDU1YpO1xuICAgIFxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcbiAgICBcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXG4gICAgdmFyIGxpbms6IGFueSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcbiAgICBsaW5rLmhyZWYgPSB1cmk7XG4gICAgXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xuICAgIFxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaW5rLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbn1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSBuZXdEYXRhIFxuICAgKi9cbiAgY2hhbmdlRGlzcGxheURhdGEobmV3RGF0YSkge1xuICAgIHRoaXMuYmVoYXZpb3IubmV4dChuZXdEYXRhKTtcbiAgfVxuXG4gIG5nT25Jbml0KCl7XG4gICAgaWYodGhpcy5pc0xhenlsb2FkaW5nRW5hYmxlZCgpKXtcbiAgICAgICAgdGhpcy5yZWxvYWRVcmwgPSB0aGlzLmRhdGFVcmwrJyYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpT2Zmc2V0S2V5Kyc9MCYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpU2VhcmNoS2V5Kyc9JyA7XG4gICAgfWVsc2V7XG4gICAgICAgIHRoaXMucmVsb2FkVXJsID0gdGhpcy5kYXRhVXJsIDtcbiAgICB9XG4gICAgICB0aGlzLnNlYXJjaEZvcm0gPSB0aGlzLl9fZm9ybS5ncm91cCh7XG4gICAgICAgICAgc2VhcmNoU3RyaW5nOlsnJyxWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNlYXJjaEZvcm0gPSB0aGlzLl9fZm9ybS5ncm91cCh7XG4gICAgICAgIHNlYXJjaFN0cmluZzogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgIH0pO1xuICAgIHRoaXMuc2VydmljZS5saW1pdCA9IHRoaXMubGltaXQ7XG4gICAgdGhpcy5zZXJ2aWNlLnNldExhenlsb2FkaW5nQ29uZmlnKHRoaXMubGF6eWxvYWRpbmdDb25maWcpIDtcbiAgICB0aGlzLnNlcnZpY2Uuc2V0RGF0YVVybCh0aGlzLmRhdGFVcmwpO1xuICAgIHRoaXMuc2VydmljZS5zZXREYXRhU3JjS2V5KHRoaXMuZGF0YVNyY0tleSk7XG4gICAgbGV0IHVybCA9ICh0aGlzLmlzTGF6eWxvYWRpbmdFbmFibGVkKCkpID8gdGhpcy5kYXRhVXJsKycmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaU9mZnNldEtleSsnPTAmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaVNlYXJjaEtleSsnPScgOiAgdGhpcy5kYXRhVXJsIDtcbiAgICB0aGlzLnNlcnZpY2UubG9hZEZseERhdGFUYWJsZURhdGEodXJsKTtcbiAgICAgIHRoaXMuc2VydmljZS5mbHhEYXRhLnN1YnNjcmliZSgocmVzcCkgPT4ge1xuICAgICAgICB0aGlzLnREYXRhID0gcmVzcCA7XG4gICAgICAgIGxldCBvYmo6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMudERhdGEubGVuZ3RoID4gdGhpcy5saW1pdCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbWl0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBvYmoucHVzaCh0aGlzLnREYXRhW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgLy8gdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPSB0aGlzLmxpbWl0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGNvdW50ZXI6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvYmoucHVzaCh0aGlzLnREYXRhW2ldKTtcbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIC8vIHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0ID0gb2JqLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlYXJjaERhdGFUZW1wT2Zmc2V0ID0gb2JqO1xuICAgICAgICB0aGlzLmNoYW5nZURpc3BsYXlEYXRhKG9iaik7XG4gICAgfSlcbiAgfVxuXG5zZWFyY2hEYXRhSW5BcGkodmFsdWVzLGZvcm0pe1xuICAgIHRoaXMuc2VydmljZS5jaGFnZURhdGFUYWJsZShbXSkgOyAgICAgICAgICAgXG4gICAgdGhpcy5zZXJ2aWNlLmxvYWRGbHhEYXRhVGFibGVEYXRhKHRoaXMuZGF0YVVybCsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkrJz0wJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlTZWFyY2hLZXkrJz0nK3ZhbHVlcy5zZWFyY2hTdHJpbmcpIDtcbn1cblxuICBuZ0FmdGVyVmlld0luaXQoKXtcbi8vIGFsZXJ0KHdpbmRvdy5pbm5lcldpZHRoKVxuICB9XG5cbiAgYWN0aW9uQnV0dG9uQ2xpY2tlZChpbmRleDpudW1iZXIsYnV0dG9uSW5kZXg6bnVtYmVyKXtcbiAgICBpZiAoYnV0dG9uSW5kZXggPT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maXJzdEFjdGlvbkJ1dHRvbkNsaWNrZWQuZW1pdCh7IGluZGV4OiBpbmRleCwgZGF0YTogdGhpcy50RGF0YVtpbmRleF0gfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGJ1dHRvbkluZGV4ID09IDEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vjb25kQWN0aW9uQnV0dG9uQ2xpY2tlZC5lbWl0KHsgaW5kZXg6IGluZGV4LCBkYXRhOiB0aGlzLnREYXRhW2luZGV4XSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMudGhpcmRBY3Rpb25CdXR0b25DbGlja2VkLmVtaXQoeyBpbmRleDogaW5kZXgsIGRhdGE6IHRoaXMudERhdGFbaW5kZXhdIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFkZEJ1dHRvbkNsaWNrKCl7XG4gICAgdGhpcy5hZGRCdXR0b25DbGlja2VkLmVtaXQoKSA7XG4gIH1cblxuICBjb25maXJtRGVsZXRlKCl7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGVTZWxlY3RDbGlja2VkLmVtaXQodGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24pO1xuICB9XG5cbiAgYWRkUmVtb3ZlKGNoZWNrZWQ6Ym9vbGVhbil7XG4gICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5RGF0YS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxldCBjb3VudGVyOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24ucHVzaChpW3RoaXMubXVsdGlwbGVTZWxlY3RLZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnNlcnZpY2UubXVsdGlwbGVEZWxldGlvbikgO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc2VydmljZS5tdWx0aXBsZURlbGV0aW9uID0gW107XG4gICAgfSAgICAgICAgXG4gIH1cblxuICBhZGRSZW1vdmVEZWxldGVJdGVtKGRhdGFLZXl2YWx1ZTphbnksIGluZGV4Om51bWJlciwgc2VsZWN0ZWQ6Ym9vbGVhbil7XG4gICAgaWYgKCFzZWxlY3RlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VydmljZS5tdWx0aXBsZURlbGV0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGF0YUtleXZhbHVlID09IHRoaXMuc2VydmljZS5tdWx0aXBsZURlbGV0aW9uW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BsYXlEYXRhLnN1YnNjcmliZSgocmVzcCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24ucHVzaChyZXNwW2luZGV4XVt0aGlzLm11bHRpcGxlU2VsZWN0S2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgIC8vIGNvbnNvbGUubG9nKCdsZWZ0ICcrZGF0YUtleXZhbHVlLHRoaXMuc2VydmljZS5tdWx0aXBsZURlbGV0aW9uKSA7XG4gIH1cblxuICBnZXRTZWFyY2hDb2x1bW5zKCl7XG4gICAgcmV0dXJuICh0aGlzLmhhc0FkZEJ1dHRvbikgPyAodGhpcy5lbmFibGVEYXRhRXhwb3J0cykgPyAnY29sLW1kLTYgc2VhcmNoLWNvbnRhaW5lcicgOiAnY29sLW1kLTcgc2VhcmNoLWNvbnRhaW5lcicgOlxuICAgICh0aGlzLmVuYWJsZURhdGFFeHBvcnRzKSA/ICdjb2wtbWQtNyBzZWFyY2gtY29udGFpbmVyJyA6ICdjb2wtbWQtOCBzZWFyY2gtY29udGFpbmVyJztcbiAgfVxuXG4gIGRpc2FibGVQcmV2dEJ1dHRvbigpe1xuICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnNlcnZpY2UuZGF0YU9mZnNldC90aGlzLmxpbWl0KTw9MSA7XG4gIH1cblxuICBkaXNhYmxlTmV4dEJ1dHRvbigpe1xuICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnNlcnZpY2UuZGF0YU9mZnNldC90aGlzLmxpbWl0KT09TWF0aC5jZWlsKHRoaXMuc2VydmljZS50b3RhbEl0ZW1zL3RoaXMubGltaXQpIDtcbiAgfVxuXG4gIGlzTGF6eWxvYWRpbmdFbmFibGVkKCk6IGJvb2xlYW57XG4gICAgICByZXR1cm4gdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImFwaU9mZnNldEtleVwiKSAmJiB0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaU9mZnNldEtleSA7XG4gIH1cblxuICBuZXh0UHJldkl0ZW0odHlwZTpzdHJpbmcpe1xuICAgIGlmKHRoaXMuaXNMYXp5bG9hZGluZ0VuYWJsZWQoKSl7XG4gICAgICAgIHRoaXMuc2VydmljZS5sb2FkRmluaXNoID0gZmFsc2UgO1xuICAgICAgICB0aGlzLnNlcnZpY2UuZ2V0RGF0YUxlbmd0aCgpLnRoZW4oZGF0YUxlbmd0aD0+eyAgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS5jaGFnZURhdGFUYWJsZShbXSkgOyAgIFxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPSAodHlwZT09J3ByZXYnKSA/ICgodGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgLSB0aGlzLmxpbWl0KSAtIHRoaXMubGltaXQpIDogdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQ7ICBcbiAgICAgICAgICAgIGxldCB1cmwgPSAodGhpcy5pc0xhenlsb2FkaW5nRW5hYmxlZCgpKSA/IHRoaXMuZGF0YVVybCsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkrJz0nKyB0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCArJyYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpU2VhcmNoS2V5Kyc9JyA6ICB0aGlzLmRhdGFVcmwgOyAgXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UubG9hZEZseERhdGFUYWJsZURhdGEodXJsKSA7XG4gICAgICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2Vycm9yJyxlKSA7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiA7XG4gICAgfVxuXG4gICAgLy8gUGFnaW5hdGUgaWYgbGF6eWxvYWRpbmcgaXMgZGlzYWJsZWRcbiAgICBpZiAodHlwZSA9PSAncHJldicpIHtcbiAgICAgICAgdGhpcy5wYWdpbmF0ZURhdGF0YWJsZVJlY29yZCgodGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgLSB0aGlzLmxpbWl0KSAtIHRoaXMubGltaXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0IDwgdGhpcy5saW1pdCkge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0ZURhdGF0YWJsZVJlY29yZCh0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCArICh0aGlzLmxpbWl0IC0gMSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0ZURhdGF0YWJsZVJlY29yZCh0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCk7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaWx0ZXJEYXRhKHNlYXJjaFN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5jaGFuZ2VEaXNwbGF5RGF0YShbXSk7XG4gICAgdGhpcy5zZXJ2aWNlLmZseERhdGEuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBzZWFyY2hSZXN1bHRzOiBBcnJheTxhbnk+ID0gW107XG4gICAgICAgIC8vSWYgbm8gc3RyaW5nIHByb3ZpZGVkLiBSZWdpc3RlciBhbGwgdGhlIHByZXZpb3VzIGRhdGEgdG8gdGhlIGRhdGFzZXRcbiAgICAgICAgaWYgKHNlYXJjaFN0cmluZy50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGlzcGxheURhdGEodGhpcy5zZWFyY2hEYXRhVGVtcE9mZnNldCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy9DaGVjayBpZiBzZWFyY2hLZXlzIGFyZSBzZXQgZWxzZSB1c2UgZGF0YUtleXMgYXMgc2VhcmNoS2V5c1xuICAgICAgICBsZXQgc2VhcmNoS2V5czogQXJyYXk8c3RyaW5nPiA9ICh0aGlzLnNlYXJjaEtleXMubGVuZ3RoIDwgMSkgPyB0aGlzLmRhdGFLZXlzIDogdGhpcy5zZWFyY2hLZXlzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vVmFyaWFibGUgdG8gY2hlY2sgaWYgYSBkYXRhIGlzIGZvdW5kXG4gICAgICAgICAgICBsZXQgZm91bmQgPSAtMTtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2VhcmNoS2V5cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaV1bU3RyaW5nKHNlYXJjaEtleXNbeF0pXS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoU3RyaW5nLnRvTG9jYWxlTG93ZXJDYXNlKCkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9JZiBmb3VuZCBwdXNoIHRoZSBpbmRleCBvZiB0aGUgZGF0YSB0byB0aGUgc2VhcmNoUmVzdWx0cyB2YXJpYWJsZVxuICAgICAgICAgICAgaWYgKGZvdW5kID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hSZXN1bHRzLnB1c2goZGF0YVtmb3VuZF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vUmVnaXN0ZXIgdGhlIHJlc3VsdHMgdG8gdGhlIGRhdGFzZXRcbiAgICAgICAgdGhpcy5jaGFuZ2VEaXNwbGF5RGF0YShzZWFyY2hSZXN1bHRzKTtcbiAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gdmFsdWUgb2Zmc2V0IHZhbHVlXG4gICAgICovXG4gICAgcGFnaW5hdGVEYXRhdGFibGUodmFsdWUpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgbGF6eSBsb2FkaW5nIGlzIGVuYWJsZWRcbiAgICAgICAgaWYodGhpcy5pc0xhenlsb2FkaW5nRW5hYmxlZCgpKXtcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS5sb2FkRmluaXNoID0gZmFsc2UgO1xuICAgICAgICAgICAgLy8gU3Vic2NyaWJlIHRvIGdldCB0aGUgZGF0YSBsZW5ndGhcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS5nZXREYXRhTGVuZ3RoKCkudGhlbigoKT0+eyAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2UuY2hhZ2VEYXRhVGFibGUoW10pIDtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbGwgaXMgc2VsZWN0ZWQgdG8gcHJldmVudCBOQU4gdmFsdWUgICBcbiAgICAgICAgICAgICAgICBpZih2YWx1ZSE9J2FsbCcpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCA9IHBhcnNlSW50KHZhbHVlKSA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNldHVwIHVybFxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSAodGhpcy5pc0xhenlsb2FkaW5nRW5hYmxlZCgpKSA/IHRoaXMuZGF0YVVybCsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkrJz0nKyB2YWx1ZSArJyYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpU2VhcmNoS2V5Kyc9JyA6IHRoaXMuZGF0YVVybCA7XG4gICAgICAgICAgICAgICAgLy8gcGFnaW5hdGVcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2UubG9hZEZseERhdGFUYWJsZURhdGEodXJsLGZhbHNlKSA7XG4gICAgICAgICAgICB9KS5jYXRjaChlPT57XG4gICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZXJyb3InLGUpIDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgXG4gICAgICAgIHRoaXMucGFnaW5hdGVEYXRhdGFibGVSZWNvcmQodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIHBhZ2luYXRpb24gbnVtYmVyXG4gICAgICogUGVyZm9ybSBwYWdpbmF0aW9uIHRvIHRoZSBkYXRhc2V0XG4gICAgICogQHJldHVyblxuICAgICAqL1xuICAgIHBhZ2luYXRlRGF0YXRhYmxlUmVjb3JkKHZhbHVlKSB7XG4gICAgICAgIGlmKHRoaXMubGF6eWxvYWRpbmdDb25maWcuaGFzT3duUHJvcGVydHkoXCJhcGlPZmZzZXRLZXlcIikgJiYgdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkpeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS5sb2FkRmluaXNoID0gZmFsc2UgO1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmdldERhdGFMZW5ndGgoKS50aGVuKGRhdGFMZW5ndGg9PnsgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmNoYWdlRGF0YVRhYmxlKFtdKSA7IFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0ID0gcGFyc2VJbnQodmFsdWUpK3RoaXMubGltaXQgOyAgICAgICAgICBcbiAgICAgICAgICAgICAgIHRoaXMuc2VydmljZS5sb2FkRmx4RGF0YVRhYmxlRGF0YSh0aGlzLmRhdGFVcmwrJyYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpT2Zmc2V0S2V5Kyc9Jyt2YWx1ZSsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlTZWFyY2hLZXkrJz0nKSA7XG4gICAgICAgICAgICB9KS5jYXRjaChlPT57XG4gICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZXJyb3InLGUpIDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG51bTpudW1iZXIgPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgICAgIGlmIChudW0gPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSAxO1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPSB0aGlzLmxpbWl0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSBudW0gKyAxO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0ID0gbnVtICsgdGhpcy5saW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlcnZpY2UuZmx4RGF0YS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFnaW5hdGVSZXN1bHQ6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gdmFsdWU7IGkgPCAodGhpcy5saW1pdCArIHBhcnNlSW50KHZhbHVlKSk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGVSZXN1bHQucHVzaChkYXRhW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFnaW5hdGVSZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURpc3BsYXlEYXRhKHBhZ2luYXRlUmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURpc3BsYXlEYXRhKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoRGF0YVRlbXBPZmZzZXQgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmltcG9ydCB7RGlyZWN0aXZlLEVsZW1lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnIDtcbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2ZseC11aS1kYXRhdGFibGUtaW1nLWZhbGxiYWNrXSdcbn0pXG5leHBvcnQgY2xhc3MgSW1hZ2VGYWxsQmFjayB7XG4gICAgQElucHV0KCdmbHgtdWktZGF0YXRhYmxlLWltZy1mYWxsYmFjaycpIGltZ1NyYzogc3RyaW5nO1xuICAgIHByaXZhdGUgZWw6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgaXNBcHBsaWVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBFVkVOVF9UWVBFOiBzdHJpbmcgPSAnZXJyb3InO1xuICBcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZikge1xuICAgICAgdGhpcy5lbCA9IGVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5FVkVOVF9UWVBFLCB0aGlzLm9uRXJyb3IuYmluZCh0aGlzKSlcbiAgICB9XG4gIFxuICAgIHByaXZhdGUgb25FcnJvcigpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRzKCk7XG4gIFxuICAgICAgaWYgKCF0aGlzLmlzQXBwbGllZCkge1xuICAgICAgICB0aGlzLmlzQXBwbGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLmltZ1NyYyk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIHtcbiAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLkVWRU5UX1RZUEUsIHRoaXMub25FcnJvcik7XG4gICAgfVxuICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRzKCk7XG4gICAgfVxufSIsImltcG9ydCB7IFBpcGUsUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnIDtcbkBQaXBlKHtcbiAgICBuYW1lOidjZWlsJ1xufSlcbmV4cG9ydCBjbGFzcyBDZWlsIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgfVxuXG4gICAgdHJhbnNmb3JtKHZhbHVlOm51bWJlcixsaW1pdDpudW1iZXIpe1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHZhbHVlL2xpbWl0KSA7XG4gICAgfVxufSIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSxGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJyA7XG5pbXBvcnQgeyBGbHhVaURhdGF0YWJsZUNvbXBvbmVudCxJbWFnZUZhbGxCYWNrIH0gZnJvbSAnLi9mbHgtdWktZGF0YXRhYmxlLmNvbXBvbmVudCcgO1xuaW1wb3J0IHsgSHR0cE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnIDtcbmltcG9ydCB7IEZseFVpRGF0YXRhYmxlU2VydmljZSB9IGZyb20gJy4vZmx4LXVpLWRhdGF0YWJsZS5zZXJ2aWNlJyA7XG5pbXBvcnQgeyBDZWlsIH0gZnJvbSAnLi9jZWlsLnBpcGUnIDtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxSZWFjdGl2ZUZvcm1zTW9kdWxlLEZvcm1zTW9kdWxlLEh0dHBNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRmx4VWlEYXRhdGFibGVDb21wb25lbnQsQ2VpbCxJbWFnZUZhbGxCYWNrXG4gIF0sXG4gIGV4cG9ydHM6W0ZseFVpRGF0YXRhYmxlQ29tcG9uZW50LENlaWxdLFxuICBwcm92aWRlcnM6W0ZseFVpRGF0YXRhYmxlU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgRmx4VWlEYXRhdGFibGVNb2R1bGUge1xuICBcbn1cbiJdLCJuYW1lcyI6WyJodHRwIiwiQmVoYXZpb3JTdWJqZWN0IiwiSGVhZGVycyIsInJldHJ5IiwibWFwIiwiSW5qZWN0YWJsZSIsIkh0dHAiLCJFdmVudEVtaXR0ZXIiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiVmFsaWRhdG9ycyIsIkNvbXBvbmVudCIsIkZvcm1CdWlsZGVyIiwiSW5wdXQiLCJPdXRwdXQiLCJEaXJlY3RpdmUiLCJFbGVtZW50UmVmIiwiUGlwZSIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIkZvcm1zTW9kdWxlIiwiSHR0cE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBNkJFLCtCQUFtQkEsT0FBVTtZQUFWLFNBQUksR0FBSkEsT0FBSSxDQUFNOzJCQXRCSCxFQUFFOzRCQUNZLElBQUlDLG9CQUFlLENBQU0sRUFBRSxDQUFDOzJCQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTs4QkFFVixFQUFFOzhCQUVULENBQUM7OEJBRUQsQ0FBQzt5QkFFTixFQUFFOzhCQUVFLEVBQUU7O29DQUVDLEVB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