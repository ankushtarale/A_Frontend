import { Injectable, Component, Input, Output, EventEmitter, Directive, ElementRef, Pipe, NgModule } from '@angular/core';
import { Http, Headers, HttpModule } from '@angular/http';
import { map, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FlxUiDatatableService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        this.dataUrl = '';
        this.behavior = new BehaviorSubject([]);
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
    setLazyloadingConfig(config) {
        this.lazyloadingConfig = config;
    }
    /**
     *
     * @param {?} url User api rul
     * @return {?}
     */
    getData(url) {
        let /** @type {?} */ headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(url, { headers: headers }).pipe(retry(5), map((response) => response.json()));
    }
    /**
     *
     * @param {?} url Service api url
     * @param {?} id Datatype id to export
     * @param {?} data Data to export
     * @return {?}
     */
    postData(url, id, data) {
        let /** @type {?} */ headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        return this.http.post(url + id, data, { headers: headers }).pipe(map((resp) => resp.json()));
    }
    /**
     *
     * @param {?} dataUrl Set dataurl
     * @return {?}
     */
    setDataUrl(dataUrl) {
        this.dataUrl = dataUrl;
    }
    /**
     * @return {?}
     */
    getDataUrl() {
        return this.dataUrl;
    }
    /**
     *
     * @param {?} data Register new data from user API
     * @return {?}
     */
    chageDataTable(data) {
        this.behavior.next(data);
    }
    /**
     *
     * @param {?} numberOfList Total number of list
     * @param {?} limit Pagination limit
     * @return {?}
     */
    createPagination(numberOfList, limit) {
        let /** @type {?} */ obj = [];
        let /** @type {?} */ counter = 1;
        for (let /** @type {?} */ i = 0; i < numberOfList; i += limit) {
            obj.push({ label: counter, value: i });
            counter++;
        }
        if (!this.isLazyLoadingEnabled) {
            obj.push({ label: 'All', value: 'all' });
        }
        return obj;
    }
    /**
     * @return {?}
     */
    isLazyLoadingEnabled() {
        return this.lazyloadingConfig.hasOwnProperty("apiOffsetKey") && this.lazyloadingConfig.apiOffsetKey;
    }
    /**
     * @param {?} dataUrl
     * @param {?=} setSelectPagination
     * @return {?}
     */
    loadFlxDataTableData(dataUrl, setSelectPagination = true) {
        this.loadFinish = false;
        this.loader = this.getData(dataUrl).subscribe((responseData) => {
            try {
                this.multipleDeletion = [];
                var /** @type {?} */ data = (this.dataSrcKey) ? responseData[this.dataSrcKey] : responseData;
                this.chageDataTable(data);
                if (this.isLazyLoadingEnabled()) {
                    this.totalItems = responseData.total;
                    // Handle 1 pagination out of zero problem 1/0  instead of 0/0 if no data is comming
                    if (data.length > 0) {
                        this.dataOffset = this.dataOffset + this.limit;
                    }
                }
                else {
                    this.totalItems = data.length;
                    this.dataOffset = 1;
                }
                if (setSelectPagination) {
                    if (this.isLazyLoadingEnabled()) {
                        this.pagination = this.createPagination(responseData.total, this.limit);
                    }
                    else {
                        this.pagination = this.createPagination(data.length, this.limit);
                    }
                }
                this.loadFinish = true;
            }
            catch (/** @type {?} */ e) {
                console.log('Error in reading data in ', e);
            }
        }, (e => {
            this.loadFinish = true;
        }));
    }
    /**
     * @return {?}
     */
    cancelLoading() {
        this.loader.unsubscribe();
    }
    /**
     * @param {?} srcKey
     * @return {?}
     */
    setDataSrcKey(srcKey) {
        this.dataSrcKey = srcKey;
    }
    /**
     * @return {?}
     */
    getDataLength() {
        return new Promise((resolve) => {
            this.flxData.subscribe((resp) => {
                resolve(resp.length);
            }, (e => {
                resolve(0);
            }));
        });
    }
}
FlxUiDatatableService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
FlxUiDatatableService.ctorParameters = () => [
    { type: Http }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FlxUiDataTable {
    /**
     * @param {?} service
     */
    constructor(service) {
        this.service = service;
        this.behavior = new BehaviorSubject([]);
        this.flxDatatableData = this.behavior.asObservable();
        this.service.flxData.subscribe((resp) => {
            this.ChangeData(resp);
        });
    }
    /**
     *
     * @param {?} data Change table data with new data
     * @return {?}
     */
    ChangeData(data) {
        this.behavior.next(data);
    }
    /**
     * Reload data from api: void
     * @return {?}
     */
    reloadData() {
        this.service.loadFlxDataTableData(this.service.getDataUrl());
    }
    /**
     * @return {?}
     */
    abortRequest() {
        this.service.cancelLoading();
    }
}
FlxUiDataTable.decorators = [
    { type: Injectable },
];
/** @nocollapse */
FlxUiDataTable.ctorParameters = () => [
    { type: FlxUiDatatableService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FlxUiDatatableComponent {
    /**
     * @param {?} __form
     * @param {?} service
     */
    constructor(__form, service) {
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
        this.firstActionButtonClicked = new EventEmitter();
        this.secondActionButtonClicked = new EventEmitter();
        this.thirdActionButtonClicked = new EventEmitter();
        this.multipleSelectClicked = new EventEmitter();
        this.addButtonClicked = new EventEmitter();
        this.isExportAll = false;
        this.tData = [];
        this.behavior = new BehaviorSubject([]);
        this.searchDataTempOffset = [];
        this.displayData = this.behavior.asObservable();
        this.offset = 1;
    }
    /**
     * @return {?}
     */
    reload() {
        this.service.loadFlxDataTableData(this.reloadUrl, true);
    }
    /**
     *
     * @param {?} checked Export all selection
     * @return {?}
     */
    checkToExportOption(checked) {
        this.isExportAll = checked;
    }
    /**
     *
     * @param {?} exportType Export type: print|pdf|excel|word
     * @return {?}
     */
    exportDocumentsAs(exportType) {
        let /** @type {?} */ loading = /** @type {?} */ (document.getElementById("export_loading"));
        loading.style.display = 'block';
        let /** @type {?} */ headers = (!this.dataExportsConfig.dataColumns || this.dataExportsConfig.dataColumns.length < 1) ? this.dataKeys : this.dataExportsConfig.dataColumns;
        let /** @type {?} */ dataToExport = (!this.isExportAll) ? this.displayData : this.service.flxData;
        //Subscribe to data
        dataToExport.subscribe((data) => {
            let /** @type {?} */ arrayObj = [];
            //Loop and push data
            for (let /** @type {?} */ d of data) {
                let /** @type {?} */ obj = {};
                for (let /** @type {?} */ h = 0; h < headers.length; h++) {
                    obj[headers[h]] = d[headers[h]];
                }
                arrayObj.push(obj);
            }
            if (exportType == 'print') {
                try {
                    printJS({ printable: arrayObj, properties: headers, type: 'json' });
                    loading.style.display = 'none';
                }
                catch (/** @type {?} */ e) {
                    loading.style.display = 'none';
                    // console.log('PrintJS not found. Add `https://printjs-4de6.kxcdn.com/print.min.js` to your index.html or add as part of angular.json script') ;
                }
            }
            else {
                let /** @type {?} */ extension = (exportType == 'pdf') ? 'pdf' : (exportType == 'excel') ? 'xlsx' : 'docx';
                let /** @type {?} */ pageId = (exportType == 'pdf') ? 3 : (exportType == 'excel') ? 5 : 4;
                let /** @type {?} */ requestData = { "data": JSON.stringify(arrayObj) };
                this.service.postData('http://exporter.azurewebsites.net/api/export/ExportFromJSON/', pageId, requestData).subscribe((resp) => {
                    var /** @type {?} */ download = 'http://exporter.azurewebsites.net/api/export/GetFile/' + resp;
                    download += "?fileName=andrei&extension=" + extension;
                    window.location.href = download;
                    loading.style.display = 'none';
                }, (e => {
                    //console.log('file export error',e) ;
                }));
            }
        }).unsubscribe();
    }
    /**
     * @return {?}
     */
    hasImageEmbeded() {
        return this.embedPictures.hasOwnProperty("index");
    }
    /**
     * @return {?}
     */
    getImage() {
        console.log('eoeoe');
        //   let img = new Image() ;
        //   img.src = imageSrc ;
        //   img.onload = ((e)=>{
        //       return imageSrc ;
        //   }) ;
        //   img.onerror = ((e)=>{
        //     return this.embedPictures.fallbackUrl ;
        //   })
    }
    /**
     * @param {?} JSONData
     * @param {?} ReportTitle
     * @param {?} ShowLabel
     * @return {?}
     */
    JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
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
    }
    /**
     *
     * @param {?} newData
     * @return {?}
     */
    changeDisplayData(newData) {
        this.behavior.next(newData);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.isLazyloadingEnabled()) {
            this.reloadUrl = this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=0&' + this.lazyloadingConfig.apiSearchKey + '=';
        }
        else {
            this.reloadUrl = this.dataUrl;
        }
        this.searchForm = this.__form.group({
            searchString: ['', Validators.required]
        });
        this.searchForm = this.__form.group({
            searchString: ['', Validators.required]
        });
        this.service.limit = this.limit;
        this.service.setLazyloadingConfig(this.lazyloadingConfig);
        this.service.setDataUrl(this.dataUrl);
        this.service.setDataSrcKey(this.dataSrcKey);
        let /** @type {?} */ url = (this.isLazyloadingEnabled()) ? this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=0&' + this.lazyloadingConfig.apiSearchKey + '=' : this.dataUrl;
        this.service.loadFlxDataTableData(url);
        this.service.flxData.subscribe((resp) => {
            this.tData = resp;
            let /** @type {?} */ obj = [];
            if (this.tData.length > this.limit) {
                for (let /** @type {?} */ i = 0; i < this.limit; i++) {
                    obj.push(this.tData[i]);
                }
                // this.service.dataOffset = this.limit;
            }
            else {
                for (let /** @type {?} */ i = 0; i < this.tData.length; i++) {
                    obj.push(this.tData[i]);
                }
                // this.service.dataOffset = obj.length;
            }
            this.searchDataTempOffset = obj;
            this.changeDisplayData(obj);
        });
    }
    /**
     * @param {?} values
     * @param {?} form
     * @return {?}
     */
    searchDataInApi(values, form) {
        this.service.chageDataTable([]);
        this.service.loadFlxDataTableData(this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=0&' + this.lazyloadingConfig.apiSearchKey + '=' + values.searchString);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // alert(window.innerWidth)
    }
    /**
     * @param {?} index
     * @param {?} buttonIndex
     * @return {?}
     */
    actionButtonClicked(index, buttonIndex) {
        if (buttonIndex == 0) {
            return this.firstActionButtonClicked.emit({ index: index, data: this.tData[index] });
        }
        else if (buttonIndex == 1) {
            return this.secondActionButtonClicked.emit({ index: index, data: this.tData[index] });
        }
        else {
            this.thirdActionButtonClicked.emit({ index: index, data: this.tData[index] });
        }
    }
    /**
     * @return {?}
     */
    addButtonClick() {
        this.addButtonClicked.emit();
    }
    /**
     * @return {?}
     */
    confirmDelete() {
        return this.multipleSelectClicked.emit(this.service.multipleDeletion);
    }
    /**
     * @param {?} checked
     * @return {?}
     */
    addRemove(checked) {
        if (checked) {
            this.displayData.subscribe((data) => {
                for (let /** @type {?} */ i of data) {
                    try {
                        this.service.multipleDeletion.push(i[this.multipleSelectKey]);
                    }
                    catch (/** @type {?} */ e) { }
                }
                // console.log(this.service.multipleDeletion) ;
            });
        }
        else {
            this.service.multipleDeletion = [];
        }
    }
    /**
     * @param {?} dataKeyvalue
     * @param {?} index
     * @param {?} selected
     * @return {?}
     */
    addRemoveDeleteItem(dataKeyvalue, index, selected) {
        if (!selected) {
            for (var /** @type {?} */ i = 0; i < this.service.multipleDeletion.length; i++) {
                if (dataKeyvalue == this.service.multipleDeletion[i]) {
                    this.service.multipleDeletion.splice(i, 1);
                    break;
                }
            }
        }
        else {
            this.displayData.subscribe((resp) => {
                this.service.multipleDeletion.push(resp[index][this.multipleSelectKey]);
            });
        }
        // console.log('left '+dataKeyvalue,this.service.multipleDeletion) ;
    }
    /**
     * @return {?}
     */
    getSearchColumns() {
        return (this.hasAddButton) ? (this.enableDataExports) ? 'col-md-6 search-container' : 'col-md-7 search-container' :
            (this.enableDataExports) ? 'col-md-7 search-container' : 'col-md-8 search-container';
    }
    /**
     * @return {?}
     */
    disablePrevtButton() {
        return Math.ceil(this.service.dataOffset / this.limit) <= 1;
    }
    /**
     * @return {?}
     */
    disableNextButton() {
        return Math.ceil(this.service.dataOffset / this.limit) == Math.ceil(this.service.totalItems / this.limit);
    }
    /**
     * @return {?}
     */
    isLazyloadingEnabled() {
        return this.lazyloadingConfig.hasOwnProperty("apiOffsetKey") && this.lazyloadingConfig.apiOffsetKey;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    nextPrevItem(type) {
        if (this.isLazyloadingEnabled()) {
            this.service.loadFinish = false;
            this.service.getDataLength().then(dataLength => {
                this.service.chageDataTable([]);
                this.service.dataOffset = (type == 'prev') ? ((this.service.dataOffset - this.limit) - this.limit) : this.service.dataOffset;
                let /** @type {?} */ url = (this.isLazyloadingEnabled()) ? this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=' + this.service.dataOffset + '&' + this.lazyloadingConfig.apiSearchKey + '=' : this.dataUrl;
                this.service.loadFlxDataTableData(url);
            }).catch(e => {
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
    }
    /**
     * @param {?=} searchString
     * @return {?}
     */
    filterData(searchString = '') {
        this.changeDisplayData([]);
        this.service.flxData.subscribe((data) => {
            let /** @type {?} */ searchResults = [];
            //If no string provided. Register all the previous data to the dataset
            if (searchString.trim() == '') {
                this.changeDisplayData(this.searchDataTempOffset);
                return;
            }
            //Check if searchKeys are set else use dataKeys as searchKeys
            let /** @type {?} */ searchKeys = (this.searchKeys.length < 1) ? this.dataKeys : this.searchKeys;
            for (let /** @type {?} */ i = 0; i < data.length; i++) {
                //Variable to check if a data is found
                let /** @type {?} */ found = -1;
                for (let /** @type {?} */ x = 0; x < searchKeys.length; x++) {
                    try {
                        if (data[i][String(searchKeys[x])].toLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) {
                            found = i;
                            break;
                        }
                    }
                    catch (/** @type {?} */ e) { }
                }
                //If found push the index of the data to the searchResults variable
                if (found > -1) {
                    searchResults.push(data[found]);
                }
            }
            //Register the results to the dataset
            this.changeDisplayData(searchResults);
        });
    }
    /**
     * @param {?} value offset value
     * @return {?}
     */
    paginateDatatable(value) {
        // Check if lazy loading is enabled
        if (this.isLazyloadingEnabled()) {
            this.service.loadFinish = false;
            // Subscribe to get the data length
            this.service.getDataLength().then(() => {
                this.service.chageDataTable([]);
                // Check if all is selected to prevent NAN value
                if (value != 'all') {
                    this.service.dataOffset = parseInt(value);
                }
                // setup url
                let /** @type {?} */ url = (this.isLazyloadingEnabled()) ? this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=' + value + '&' + this.lazyloadingConfig.apiSearchKey + '=' : this.dataUrl;
                // paginate
                this.service.loadFlxDataTableData(url, false);
            }).catch(e => {
                // console.log('error',e) ;
            });
            return;
        }
        this.paginateDatatableRecord(value);
    }
    /**
     *
     * @param {?} value pagination number
     * Perform pagination to the dataset
     * @return {?}
     */
    paginateDatatableRecord(value) {
        if (this.lazyloadingConfig.hasOwnProperty("apiOffsetKey") && this.lazyloadingConfig.apiOffsetKey) {
            this.service.loadFinish = false;
            this.service.getDataLength().then(dataLength => {
                this.service.chageDataTable([]);
                this.service.dataOffset = parseInt(value) + this.limit;
                this.service.loadFlxDataTableData(this.dataUrl + '&' + this.lazyloadingConfig.apiOffsetKey + '=' + value + '&' + this.lazyloadingConfig.apiSearchKey + '=');
            }).catch(e => {
                // console.log('error',e) ;
            });
            return;
        }
        let /** @type {?} */ num = parseInt(value);
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
        this.service.flxData.subscribe((data) => {
            if (value !== 'all') {
                let /** @type {?} */ paginateResult = [];
                for (let /** @type {?} */ i = value; i < (this.limit + parseInt(value)); i++) {
                    if (data[i]) {
                        paginateResult.push(data[i]);
                    }
                }
                if (paginateResult.length > 0) {
                    this.changeDisplayData(paginateResult);
                }
            }
            else {
                this.changeDisplayData(data);
                this.searchDataTempOffset = data;
            }
        });
    }
}
FlxUiDatatableComponent.decorators = [
    { type: Component, args: [{
                selector: 'flx-ui-datatable',
                template: `<div class="col-md-12 flx-ui-datatable-main {{ classes?.maincontainer }}">
    <div id="export_loading" class="col-md-12 text-center" style="display: none;margin-bottom:0.5em;color:#dddddd;font-size:13px;font-weight:bold;">Exporting...</div>
    <div class="col-md-12 flx-ui-datatable-header">
        <div class="col-xs-3 col-sm-3 pagination-select col-md-2" style="position:relative;z-index: 1;">
            <select class="form-control rmsh rmrd {{ classes?.paginationselect }}" (change)="paginateDatatable($event?.target?.value)">
                <option *ngFor="let paging of service?.pagination" [value]="paging?.value">{{ paging?.label }}</option>
            </select>
        </div>
        <div class="col-xs-5 col-sm-5 col-md-2 text-center flx-datatable-pagination rmpd" style="position:relative;z-index: 2;">
            <button mat-icon-button [ngClass]="{'flx-pagination-end': disablePrevtButton()}" (click)="nextPrevItem('prev')" [disabled]="disablePrevtButton()" class="flx-ui-datatable-pagination-buttons {{ classes?.paginationButton }}"><span class="fa fa-angle-double-left fa-1x"></span> <span class="flx-datatable-tooltip-prev" [ngClass]="{'flx-pagination-end': disablePrevtButton()}">Previous</span> </button>
                {{ service?.dataOffset | ceil: limit }} / {{ service?.totalItems | ceil: limit }}
            <button mat-icon-button [ngClass]="{'flx-pagination-end': disableNextButton()}" (click)="nextPrevItem('next')" [disabled]="disableNextButton()" class="flx-ui-datatable-pagination-buttons {{ classes?.paginationButton }}"><span class="fa fa-angle-double-right fa-1x"></span> <span class="flx-datatable-tooltip-next" [ngClass]="{'flx-pagination-end': disableNextButton()}">Next</span></button>
        </div>
        <div [class]="'search-bar '+getSearchColumns()">
            <input type="text" *ngIf="!isLazyloadingEnabled()" [style.background]="searchBar?.background" [style.color]="searchBar?.textColor" [ngStyle]="{border:searchBar?.borderSize +' solid '+ searchBar?.borderColor} " (keyup)="filterData($event?.target?.value)" class="form-control rmsh rmrd customclass" [placeholder]="searchPlaceholder">
            <form (ngSubmit)="searchDataInApi(srch?.value,srch)" #srch="ngForm" *ngIf="isLazyloadingEnabled()">
                <div class="input-group">
                    <input type="text" required name="searchString" ngModel [style.background]="searchBar?.background" [style.color]="searchBar?.textColor" [ngStyle]="{border:searchBar?.borderSize +' solid '+ searchBar?.borderColor} " class="form-control rmsh rmrd {{ classes?.searchbar }}" [placeholder]="searchPlaceholder">
                    <span class="input-group-addon">
                        <button [disabled]="!srch?.valid" type="submit" class="btn btn-default btn-clear btn-md">
                            <i class="fa fa-search"></i>
                        </button>
                    </span>
                </div>
            </form>
        </div>
        <div class="col-md-1 text-right rmpd" *ngIf="hasAddButton">
            <button (click)="addButtonClick()" class="{{ classes?.addButton }}" [style.background]="addButton?.background" [style.borderColor]="addButton?.background" [style.color]="addButton?.textColor"><span class="glyphicon glyphicon-plus"></span> Add</button>
        </div>
        <div class="col-md-1 text-right rmpd export-cnt" *ngIf="enableDataExports">
            <span class="dropdown">
                <button class="btn btn-default {{ classes?.exportButton }} dropdown-toggle" type="button" data-toggle="dropdown">
                
                <i class="caret"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-export">
                    <li class="dropdown-header">{{ dataExportsConfig?.title }}. <input type="checkbox" (change)="checkToExportOption($event?.target?.checked)" style="position: relative;top:0.3em;"> <sup style="font-size:10px;color:#999;"> All</sup></li> 
                    <li class="divider"></li>
                    <li class="dropdown-submenu" *ngFor="let export of dataExportsConfig?.exportsTo" (click)="exportDocumentsAs(export)">
                        <a href="javascript:void(0)" *ngIf="export=='print'"><i class="glyphicon glyphicon-print"></i> Print</a>
                        <a href="javascript:void(0)" *ngIf="export=='pdf'" style="color:#ff0000"><i class="glyphicon glyphicon-file"></i> PDF</a>
                        <a href="javascript:void(0)" *ngIf="export=='excel'" style="color:#009900;"><i class="glyphicon glyphicon-file"></i> Excel</a>            
                        <a href="javascript:void(0)" *ngIf="export=='word'" style="color:#335599;"><i class="glyphicon glyphicon-file"></i> Word</a>                        
                    </li>
                    <li class="divider"></li>
                    <li class="dropdown-header">
                        <span  *ngIf="!isExportAll">{{ (displayData | async)?.length }}</span>
                        <span  *ngIf="isExportAll">{{ (service?.flxData | async)?.length }}</span> 
                    </li>
                </ul>
            </span>
        </div>
    </div>
    <div class="col-md-12 rmpd table-responsive">
        <table class="table {{ classes?.tableType }} table-responsive" id="flx_ui_table_tag">
            <thead class="{{ classes?.tableHeader }}">
                <tr>
                    <th *ngIf="!hideNumbers">N<sup><u>o</u></sup></th>
                    <th *ngFor="let header of headers">{{ header }}</th>
                    <th *ngIf="hasActionButtons">{{ actionHeader }} 
                        <input type="checkbox" [checked]="service?.multipleDeletion?.length>0" (change)="addRemove($event?.target?.checked)" *ngIf="enableMultipleSelection">
                        <button class="btn btn-danger btn-xs flx-multiple-deletion-button" *ngIf="enableMultipleSelection && service?.multipleDeletion?.length>0" (click)="confirmDelete()"><span [class]="multipleSelectButton?.icon"></span> {{ multipleSelectButton?.text }}</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr *ngIf="!service?.loadFinish">                    
                    <td colspan="20" class="text-center">
                        <img *ngIf="spinnerSrc" [class]="classes?.spinner" [src]="spinnerSrc" style="margin-top:1em;margin-bottom:1em;">
                    </td>
                </tr>
                <tr class="flxuidatatablerow" id="flxdatatable_singlerow" *ngFor="let data of displayData | async;let i=index">
                    <!-- Numbers -->
                    <td class="{{ classes?.tableData }}" *ngIf="!hideNumbers" style="color: #999;">{{ offset+i }}</td>
                    <!-- Main -->
                    <td class="{{ classes?.tableData }}" *ngFor="let dataKey of dataKeys;let x=index">
                        <img *ngIf="hasImageEmbeded() && x==embedPictures?.index" [class]="'img-fall-back ' +embedPictures?.class" [src]="embedPictures?.rootFolder+data[dataKey]" [flx-ui-datatable-img-fallback]="embedPictures?.fallbackUrl" >
                        <span *ngIf="!hasImageEmbeded() || x!=embedPictures?.index">{{ data[dataKey] }}</span>
                    </td>
                    <!-- Buttons -->
                    <td class="table-buttons" *ngIf="hasActionButtons" scope="row">
                        <span *ngFor="let aButton of actionButtons;let buttonIndex=index">
                            <button (click)="actionButtonClicked(i,buttonIndex)" class="btn {{ aButton?.class }}">
                                <div class="toltip" class="flx-tooltip" [ngClass]="{'flx-tooltip-left':aButton?.tooltipPosition=='left','flx-tooltip-bottom':aButton?.tooltipPosition=='bottom','flx-tooltip-right':aButton?.tooltipPosition=='right'}" *ngIf="aButton?.tooltip">{{ aButton?.tooltip }}</div>
                                <span class="action-button-icon-left" [class]="aButton?.icon" *ngIf="!aButton?.iconPosition || aButton?.iconPosition!='right'"></span>
                                <span class="button-text"> {{ aButton?.text }} </span>
                                <span [class]="aButton?.icon" *ngIf="aButton?.iconPosition=='right'"></span>
                            </button>
                        </span> 
                        <input type="checkbox" checked (change)="addRemoveDeleteItem(data[multipleSelectKey],i,$event?.target?.checked)" *ngIf="enableMultipleSelection && service?.multipleDeletion?.length>0">
                    </td>
                </tr>
                <tr *ngIf="tData?.length<1">
                    <td colspan="10" class="text-center" *ngIf="service?.loadFinish">
                        <span style="color:#ff0000;font-size:13px;">No data found</span> <br>
                        <button style="margin-top:1em;" (click)="reload()" class="btn btn-default {{ classes?.reloadbutton }}" color="primary"><span class="fa fa-refresh"></span> Reload</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="col-md-12 rmpd flx-total-data" *ngIf="showBottomInfo">
            <div class="col-md-4 text-left rmpd">Total pagination: <span> {{ service?.totalItems | ceil: limit }}</span></div>
            <div class="col-md-4 text-center rmpd"># of items per pagination: <span>{{ limit }}</span></div>
            <div class="col-md-4 text-right rmpd">Total items: <span>{{ (service?.flxData | async)?.length }}</span></div>
        </div>
    </div>
</div>`,
                styles: [`.flx-ui-datatable-main{background-color:#fff;padding-top:1em;padding-bottom:1em}.flx-ui-datatable-main .btn-danger{background-color:#f50057;border:1px solid #f50057;box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px;margin-left:.3em}.flx-ui-datatable-main img.img-fall-back{width:30px;height:30px}.flx-ui-datatable-main .pagination-select input[type=text],.flx-ui-datatable-main .pagination-select select,.flx-ui-datatable-main .search-bar input[type=text],.flx-ui-datatable-main .search-bar select{border-top:none!important;border-left:none!important;border-right:none!important;border-bottom:2px solid #ddd!important;border-radius:0!important;box-shadow:0 0 0 0 transparent!important;-moz-box-shadow:0 0 0 0 transparent!important;-webkit-box-shadow:0 0 0 0 transparent!important;-o-box-shadow:0 0 0 0 transparent!important;-ms-box-shadow:0 0 0 0 transparent!important}.flx-ui-datatable-main .pagination-select input[type=text]:focus,.flx-ui-datatable-main .pagination-select select:focus,.flx-ui-datatable-main .search-bar input[type=text]:focus,.flx-ui-datatable-main .search-bar select:focus{border-bottom-color:#359!important;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .pagination-select select,.flx-ui-datatable-main .search-bar select{-webkit-appearance:none;appearance:none;-moz-appearance:none}.flx-ui-datatable-main .flx-datatable-pagination{padding-top:.5em}.flx-ui-datatable-main .flx-datatable-pagination button{width:35px!important;height:35px!important;border-radius:50em!important;border:none!important;box-shadow:0 3px 10px 0 #b3c4e6;-moz-box-shadow:0 3px 10px 0 #b3c4e6;-webkit-box-shadow:0 3px 10px 0 #b3c4e6;-o-box-shadow:0 3px 10px 0 #b3c4e6;-ms-box-shadow:0 3px 10px 0 #b3c4e6;background-color:#359;color:#fff;font-size:23px;font-weight:700;position:absolute;top:0}.flx-ui-datatable-main .flx-datatable-pagination button:first-child{left:0}.flx-ui-datatable-main .flx-datatable-pagination button:first-child .flx-datatable-tooltip-prev{position:absolute;left:0;font-size:13px;font-weight:400;color:#fff;background-color:#359;padding-left:.3em;padding-right:.3em;border-radius:3px;margin-left:-57px;margin-top:.5em;box-shadow:0 3px 10px 0 #b3c4e6!important;-moz-box-shadow:0 3px 10px 0 #b3c4e6!important;-webkit-box-shadow:0 3px 10px 0 #b3c4e6!important;-o-box-shadow:0 3px 10px 0 #b3c4e6!important;-ms-box-shadow:0 3px 10px 0 #b3c4e6!important;visibility:hidden}.flx-ui-datatable-main .flx-datatable-pagination button:hover>span.flx-datatable-tooltip-next,.flx-ui-datatable-main .flx-datatable-pagination button:hover>span.flx-datatable-tooltip-prev{visibility:visible}.flx-ui-datatable-main .flx-datatable-pagination .flx-pagination-end{background-color:#f50057!important;box-shadow:0 3px 10px 0 #ffc2d8!important;-moz-box-shadow:0 3px 10px 0 #ffc2d8!important;-webkit-box-shadow:0 3px 10px 0 #ffc2d8!important;-o-box-shadow:0 3px 10px 0 #ffc2d8!important;-ms-box-shadow:0 3px 10px 0 #ffc2d8!important;cursor:not-allowed}.flx-ui-datatable-main .flx-datatable-pagination .flx-pagination-end:hover>span.flx-datatable-tooltip-next,.flx-ui-datatable-main .flx-datatable-pagination .flx-pagination-end:hover>span.flx-datatable-tooltip-prev{visibility:hidden}.flx-ui-datatable-main .flx-datatable-pagination button:last-child{right:0}.flx-ui-datatable-main .flx-datatable-pagination button:last-child .flx-datatable-tooltip-next{position:absolute;left:0;font-size:13px;font-weight:400;color:#fff;background-color:#359;padding-left:.3em;padding-right:.3em;border-radius:3px;margin-left:35px;margin-top:.5em;box-shadow:0 3px 10px 0 #b3c4e6!important;-moz-box-shadow:0 3px 10px 0 #b3c4e6!important;-webkit-box-shadow:0 3px 10px 0 #b3c4e6!important;-o-box-shadow:0 3px 10px 0 #b3c4e6!important;-ms-box-shadow:0 3px 10px 0 #b3c4e6!important;visibility:hidden}.flx-ui-datatable-main .export-cnt button{border-radius:50em!important}.flx-ui-datatable-main table{margin-top:1.5em}.flx-ui-datatable-main table tbody tr{padding-top:0!important}.flx-ui-datatable-main table tbody tr td{padding-top:.5em;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}.flx-ui-datatable-main table tbody tr td button{margin-right:.3em;margin-left:0}.flx-ui-datatable-main table tbody tr td button div.flx-tooltip{position:absolute;background-color:rgba(32,27,27,.808);text-align:center;font-size:13px;color:#fff;border-radius:3px;box-shadow:0 3px 20px 0 #4b4949;-moz-box-shadow:0 3px 20px 0 #4b4949;-webkit-box-shadow:0 3px 20px 0 #4b4949;-o-box-shadow:0 3px 20px 0 #4b4949;-ms-box-shadow:0 3px 20px 0 #4b4949;margin-left:-2.5em;margin-top:-2.8em;visibility:hidden;width:80px;padding:.3em .5em}.flx-ui-datatable-main table tbody tr td button .flx-tooltip-left{margin-left:-95px!important;margin-top:-.3em!important}.flx-ui-datatable-main table tbody tr td button .flx-tooltip-bottom{margin-top:2.3em!important}.flx-ui-datatable-main table tbody tr td button .flx-tooltip-right{margin-left:28px!important;margin-top:-.3em!important}.flx-ui-datatable-main table tbody tr td button:hover>div.flx-tooltip{transition:.3s;visibility:visible}.flx-ui-datatable-main table tbody tr td.table-buttons{padding-top:.2em;padding-bottom:.2em}.flx-ui-datatable-main table tbody tr:nth-of-type(even){background-color:#f8f9fa}.flx-ui-datatable-main table tbody tr:nth-of-type(odd){background-color:#fff}.flx-ui-datatable-main .btn-danger:hover{background-color:#ff146b;border:1px solid #ff146b;box-shadow:0 3px 10px 1px #ff5fb6;-moz-box-shadow:0 3px 10px 1px #ff5fb6;-webkit-box-shadow:0 3px 10px 1px #ff5fb6;-o-box-shadow:0 3px 10px 1px #ff5fb6;-ms-box-shadow:0 3px 10px 1px #ff5fb6;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-danger:focus{background-color:#f50057;border:1px solid #f50057}.flx-ui-datatable-main .btn-white{background-color:#fff}.flx-ui-datatable-main .btn-dark{background-color:#222!important}.flx-ui-datatable-main .btn-primary{background-color:#359;color:#fff;border:1px solid #359;box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px}.flx-ui-datatable-main .btn-primary:hover{background-color:#4769ad;border:1px solid #4769ad;box-shadow:0 3px 10px 0 #b3c4e6;-moz-box-shadow:0 3px 10px 0 #b3c4e6;-webkit-box-shadow:0 3px 10px 0 #b3c4e6;-o-box-shadow:0 3px 10px 0 #b3c4e6;-ms-box-shadow:0 3px 10px 0 #b3c4e6;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-primary:focus{background-color:#359;border:1px solid #359}.flx-ui-datatable-main .btn-large{padding-top:1em!important;padding-bottom:1em!important}.flx-ui-datatable-main .btn-medium{padding-top:.7em!important;padding-bottom:.7em!important}.flx-ui-datatable-main .btn-success{box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px;background-color:#5cb85c;border:1px solid #5cb85c}.flx-ui-datatable-main .btn-success:hover{background-color:#70cc70;border:1px solid #70cc70;box-shadow:0 3px 10px 1px #9df99d;-moz-box-shadow:0 3px 10px 1px #9df99d;-webkit-box-shadow:0 3px 10px 1px #9df99d;-o-box-shadow:0 3px 10px 1px #9df99d;-ms-box-shadow:0 3px 10px 1px #9df99d;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-success:focus{background-color:#5cb85c;border:1px solid #5cb85c}.flx-ui-datatable-main .btn-default{background-color:#fff;box-shadow:0 3px 5px 1px #eee;-moz-box-shadow:0 3px 5px 1px #eee;-webkit-box-shadow:0 3px 5px 1px #eee;-o-box-shadow:0 3px 5px 1px #eee;-ms-box-shadow:0 3px 5px 1px #eee;border-radius:3px;border:1px solid #ddd}.flx-ui-datatable-main .btn-default:hover{background-color:#fff;border:1px solid #e7e7e7;box-shadow:0 3px 10px 1px #e2e2e2;-moz-box-shadow:0 3px 10px 1px #e2e2e2;-webkit-box-shadow:0 3px 10px 1px #e2e2e2;-o-box-shadow:0 3px 10px 1px #e2e2e2;-ms-box-shadow:0 3px 10px 1px #e2e2e2;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-default:focus{background-color:#fff;border:1px solid #ddd}.flx-ui-datatable-main .btn-secondary{box-shadow:0 3px 5px 1px #ddd;-moz-box-shadow:0 3px 5px 1px #ddd;-webkit-box-shadow:0 3px 5px 1px #ddd;-o-box-shadow:0 3px 5px 1px #ddd;-ms-box-shadow:0 3px 5px 1px #ddd;border-radius:3px;background-color:#1e88e5;color:#fff}.flx-ui-datatable-main .btn-secondary:hover{color:#fff;background-color:#2892ef;border:1px solid #2892ef;box-shadow:0 3px 10px 1px #55bfff;-moz-box-shadow:0 3px 10px 1px #55bfff;-webkit-box-shadow:0 3px 10px 1px #55bfff;-o-box-shadow:0 3px 10px 1px #55bfff;-ms-box-shadow:0 3px 10px 1px #55bfff;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;-o-transition:.5s;-ms-transition:.5s}.flx-ui-datatable-main .btn-secondary:focus{color:#fff}.flx-ui-datatable-main .pagination-button{background-color:#359;color:#fff}.flx-ui-datatable-main .table-font{font-family:Khula,sans-serif!important}.flx-ui-datatable-main .table-header-icon{position:absolute;right:.2em;width:80px;height:80px;font-size:50px;margin-top:-30px;border-radius:5px!important}.flx-ui-datatable-main .table-title{background-color:#359;color:#fff;border-radius:2px;padding:1em;font-size:15px;font-weight:700;margin-bottom:1.5em;font-family:Roboto,sans-serif;box-shadow:0 1px 5px 1px #ddd;-moz-box-shadow:0 1px 5px 1px #ddd;-webkit-box-shadow:0 1px 5px 1px #ddd;-o-box-shadow:0 1px 5px 1px #ddd;-ms-box-shadow:0 1px 5px 1px #ddd}.flx-ui-datatable-main .danger{background-color:#f50057;color:#fff}.flx-ui-datatable-main .primary{background-color:#359;color:#fff}.flx-ui-datatable-main .success{background-color:#5cb85c;color:#fff}.flx-ui-datatable-main .default{background-color:#fff;color:#000}.flx-ui-datatable-main .secondary{background-color:#1e88e5;color:#fff}.flx-ui-datatable-main .btn-clear{border:none!important;box-shadow:none!important}.flx-ui-datatable-main .input-group,.flx-ui-datatable-main .input-group input{background-color:transparent!important}.flx-ui-datatable-main .input-group-addon{border:none!important;padding:0!important;box-shadow:none!important;background-color:transparent!important}.flx-ui-datatable-main .input-group-addon button{border:1px solid transparent!important;box-shadow:none!important;border-top:none!important;border-bottom:none!important;background-color:transparent!important;border-radius:50em!important;color:#359;width:30px;height:30px}.flx-ui-datatable-main .input-group-addon button i{font-size:18px}.flx-ui-datatable-main .input-group-addon button:disabled{background-color:transparent!important}.flx-ui-datatable-main .input-group-addon button:disabled i{color:#f50057}`]
            },] },
];
/** @nocollapse */
FlxUiDatatableComponent.ctorParameters = () => [
    { type: FormBuilder },
    { type: FlxUiDatatableService }
];
FlxUiDatatableComponent.propDecorators = {
    classes: [{ type: Input }],
    headers: [{ type: Input }],
    lazyloadingConfig: [{ type: Input }],
    embedPictures: [{ type: Input }],
    dataKeys: [{ type: Input }],
    enableDataExports: [{ type: Input }],
    dataExportsConfig: [{ type: Input }],
    showBottomInfo: [{ type: Input }],
    searchKeys: [{ type: Input }],
    dataSrcKey: [{ type: Input }],
    hasActionButtons: [{ type: Input }],
    hideNumbers: [{ type: Input }],
    enableMultipleSelection: [{ type: Input }],
    multipleSelectKey: [{ type: Input }],
    hasAddButton: [{ type: Input }],
    dataUrl: [{ type: Input }],
    actionButtonStart: [{ type: Input }],
    multipleSelectButton: [{ type: Input }],
    searchPlaceholder: [{ type: Input }],
    actionHeader: [{ type: Input }],
    limit: [{ type: Input }],
    spinnerSrc: [{ type: Input }],
    actionButtons: [{ type: Input }],
    paginationButtons: [{ type: Input }],
    tableHeader: [{ type: Input }],
    searchButton: [{ type: Input }],
    addButton: [{ type: Input }],
    searchBar: [{ type: Input }],
    firstActionButtonClicked: [{ type: Output }],
    secondActionButtonClicked: [{ type: Output }],
    thirdActionButtonClicked: [{ type: Output }],
    multipleSelectClicked: [{ type: Output }],
    addButtonClicked: [{ type: Output }]
};
class ImageFallBack {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.isApplied = false;
        this.EVENT_TYPE = 'error';
        this.el = el.nativeElement;
        this.el.addEventListener(this.EVENT_TYPE, this.onError.bind(this));
    }
    /**
     * @return {?}
     */
    onError() {
        this.removeEvents();
        if (!this.isApplied) {
            this.isApplied = true;
            this.el.setAttribute('src', this.imgSrc);
        }
    }
    /**
     * @return {?}
     */
    removeEvents() {
        this.el.removeEventListener(this.EVENT_TYPE, this.onError);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.removeEvents();
    }
}
ImageFallBack.decorators = [
    { type: Directive, args: [{
                selector: '[flx-ui-datatable-img-fallback]'
            },] },
];
/** @nocollapse */
ImageFallBack.ctorParameters = () => [
    { type: ElementRef }
];
ImageFallBack.propDecorators = {
    imgSrc: [{ type: Input, args: ['flx-ui-datatable-img-fallback',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Ceil {
    constructor() {
    }
    /**
     * @param {?} value
     * @param {?} limit
     * @return {?}
     */
    transform(value, limit) {
        return Math.ceil(value / limit);
    }
}
Ceil.decorators = [
    { type: Pipe, args: [{
                name: 'ceil'
            },] },
];
/** @nocollapse */
Ceil.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FlxUiDatatableModule {
}
FlxUiDatatableModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule, ReactiveFormsModule, FormsModule, HttpModule
                ],
                declarations: [
                    FlxUiDatatableComponent, Ceil, ImageFallBack
                ],
                exports: [FlxUiDatatableComponent, Ceil],
                providers: [FlxUiDatatableService]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { FlxUiDataTable, FlxUiDatatableModule, Ceil as ɵd, FlxUiDatatableComponent as ɵb, ImageFallBack as ɵc, FlxUiDatatableService as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx4LXVpLWRhdGF0YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZmx4LXVpLWRhdGF0YWJsZS9saWIvZmx4LXVpLWRhdGF0YWJsZS5zZXJ2aWNlLnRzIiwibmc6Ly9mbHgtdWktZGF0YXRhYmxlL2xpYi9mbHgtdWktZGF0YXRhYmxlLXNlcnZpY2Uuc2VydmljZS50cyIsIm5nOi8vZmx4LXVpLWRhdGF0YWJsZS9saWIvZmx4LXVpLWRhdGF0YWJsZS5jb21wb25lbnQudHMiLCJuZzovL2ZseC11aS1kYXRhdGFibGUvbGliL2NlaWwucGlwZS50cyIsIm5nOi8vZmx4LXVpLWRhdGF0YWJsZS9saWIvZmx4LXVpLWRhdGF0YWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnIDtcbmltcG9ydCB7IEh0dHAsSGVhZGVycyxSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvaHR0cCcgO1xuaW1wb3J0IHsgbWFwLHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnIDtcbmltcG9ydCB7IE9ic2VydmFibGUscGlwZSxCZWhhdmlvclN1YmplY3QsU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmx4VWlEYXRhdGFibGVTZXJ2aWNle1xuICAvL1VzZXIgZGF0YSBBUEkgdXJsXG4gIHByaXZhdGUgZGF0YVVybDogc3RyaW5nID0gJycgO1xuICBwdWJsaWMgYmVoYXZpb3I6IEJlaGF2aW9yU3ViamVjdDxhbnk+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KFtdKSA7XG4gIC8vSG9sZCBhbGwgZGF0YSBmcm9tIEFQSVxuICBwdWJsaWMgZmx4RGF0YSA9IHRoaXMuYmVoYXZpb3IuYXNPYnNlcnZhYmxlKCk7ICBcbiAgLy9IZWFkZXIgc2VsZWN0IHBhZ2luYXRpb25cbiAgcHVibGljIHBhZ2luYXRpb246IEFycmF5PE9iamVjdD4gPSBbXSA7XG4gIC8vSG9sZCB0b3RhbCBpdGVtcyBsb2FkZWQgZnJvbSBBUElcbiAgcHVibGljIHRvdGFsSXRlbXM6IG51bWJlciA9IDAgO1xuICAvL0tlZXAgdHJhY2sgb2YgY3VycmVudCBwYWdpbmF0aW9uIG9mZnNldFxuICBwdWJsaWMgZGF0YU9mZnNldDogbnVtYmVyID0gMCA7XG4gIC8vVXNlciBkZWZpbmVkIGxpbWl0IGZvciBudW1iZXIgb2YgaXRlbXMgcGVyIHBhZ2luYXRpb25cbiAgcHVibGljIGxpbWl0OiBudW1iZXIgPSAyMCA7XG4gIC8vRGF0YSBzb3VyY2Uga2V5IHRvIHJlYWQgZnJvbSBBUEkgcGF5bG9hZCByZXNwb25zZVxuICBwdWJsaWMgZGF0YVNyY0tleTpzdHJpbmcgPSAnJztcbiAgLy9Ib2xkIGl0ZW1zIHNlbGVjdGVkIGZvciBtdWx0aXBsZSBzZWxlY3RcbiAgbXVsdGlwbGVEZWxldGlvbjpBcnJheTxhbnk+ID0gW10gO1xuICAvL0hvbGQgc3Vic2NyaXB0aW9uIG9mIGFwaSBjYWxscyB3aGljaCBjYW4gYmUgY2FuY2VkIGJ5IGNhbGxpbmcgY2FuY2VsTG9hZGluZygpIFxuICBsb2FkZXI6IFN1YnNjcmlwdGlvbiA7ICBcbiAgLy9LZWVwIHRyYWNrIGlmIEFQSSBjYWxsIGlzIGNvbXBsZXRlZFxuICBsb2FkRmluaXNoOiBib29sZWFuID0gZmFsc2UgO1xuICAvLyBMYXp5IGxvYWRpbmcgY29uZmlnXG4gIHByaXZhdGUgbGF6eWxvYWRpbmdDb25maWc6IGFueSA9IHt9IDtcbiAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHApe1xuICAgICAgXG4gIH1cblxuICBwdWJsaWMgc2V0TGF6eWxvYWRpbmdDb25maWcoY29uZmlnOmFueSl7XG4gICAgdGhpcy5sYXp5bG9hZGluZ0NvbmZpZyA9IGNvbmZpZyA7XG4gIH1cblxuICAvL0dFVCByZXF1ZXN0IHRvIHVzZXIncyBBUEkgdXJsXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHVybCBVc2VyIGFwaSBydWxcbiAgICovXG4gIHB1YmxpYyBnZXREYXRhKHVybDpzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT57XG4gICAgICBsZXQgaGVhZGVyczogSGVhZGVycyA9IG5ldyBIZWFkZXJzKCkgO1xuICAgICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIDtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCx7aGVhZGVyczpoZWFkZXJzfSkucGlwZShyZXRyeSg1KSxtYXAoKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKSkgO1xuICB9XG5cbiAgLy9Qb3N0IHJlcXVlc3QgZm9yIGRhdGEgZXhwb3J0XG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHVybCBTZXJ2aWNlIGFwaSB1cmxcbiAgICogQHBhcmFtIGlkIERhdGF0eXBlIGlkIHRvIGV4cG9ydFxuICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIGV4cG9ydFxuICAgKi9cbiAgcHVibGljIHBvc3REYXRhKHVybDpzdHJpbmcsaWQ6YW55LGRhdGE6c3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+e1xuICAgIGxldCBoZWFkZXJzOiBIZWFkZXJzID0gbmV3IEhlYWRlcnMoKSA7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKSA7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCtpZCxkYXRhLHtoZWFkZXJzOmhlYWRlcnN9KS5waXBlKG1hcCgocmVzcDogUmVzcG9uc2UpID0+IHJlc3AuanNvbigpKSkgO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0gZGF0YVVybCBTZXQgZGF0YXVybFxuICAgKi9cbiAgcHVibGljIHNldERhdGFVcmwoZGF0YVVybDpzdHJpbmcpOnZvaWR7XG4gICAgdGhpcy5kYXRhVXJsID0gZGF0YVVybCA7XG4gIH1cblxuICAvL0dldCBkYXRhIHVybCBcbiAgcHVibGljIGdldERhdGFVcmwoKTpzdHJpbmd7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVVybCA7XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSBkYXRhIFJlZ2lzdGVyIG5ldyBkYXRhIGZyb20gdXNlciBBUElcbiAgICovXG4gIHB1YmxpYyBjaGFnZURhdGFUYWJsZShkYXRhOmFueSl7XG4gICAgdGhpcy5iZWhhdmlvci5uZXh0KGRhdGEpIDtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIG51bWJlck9mTGlzdCBUb3RhbCBudW1iZXIgb2YgbGlzdFxuICAgKiBAcGFyYW0gbGltaXQgUGFnaW5hdGlvbiBsaW1pdFxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVQYWdpbmF0aW9uKG51bWJlck9mTGlzdDpudW1iZXIsbGltaXQ6bnVtYmVyKTogQXJyYXk8T2JqZWN0PntcbiAgICBsZXQgb2JqOiBBcnJheTxPYmplY3Q+ID0gW10gO1xuICAgIGxldCBjb3VudGVyOiBudW1iZXIgPSAxIDtcbiAgICBmb3IobGV0IGk9MDtpPG51bWJlck9mTGlzdDtpKz1saW1pdCl7XG4gICAgICAgIG9iai5wdXNoKHtsYWJlbDpjb3VudGVyLHZhbHVlOml9KSA7XG4gICAgICAgIGNvdW50ZXIrKyA7XG4gICAgfVxuICAgIGlmKCF0aGlzLmlzTGF6eUxvYWRpbmdFbmFibGVkKXtcbiAgICAgIG9iai5wdXNoKHsgbGFiZWw6ICdBbGwnLCB2YWx1ZTogJ2FsbCcgfSk7XG4gICAgfVxuICAgIHJldHVybiBvYmogO1xuICB9XG5cbiAgcHVibGljIGlzTGF6eUxvYWRpbmdFbmFibGVkKCl7XG4gICAgcmV0dXJuIHRoaXMubGF6eWxvYWRpbmdDb25maWcuaGFzT3duUHJvcGVydHkoXCJhcGlPZmZzZXRLZXlcIikgJiYgdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkgO1xuICB9XG5cbiAgLy9FdmVudCB0byBsb2FkIGRhdGEgZnJvbSB1c2VycyBhcGlcbiAgcHVibGljIGxvYWRGbHhEYXRhVGFibGVEYXRhKGRhdGFVcmw6c3RyaW5nLHNldFNlbGVjdFBhZ2luYXRpb246Ym9vbGVhbj10cnVlKXtcbiAgICB0aGlzLmxvYWRGaW5pc2ggPSBmYWxzZSA7XG4gICAgICB0aGlzLmxvYWRlciA9IHRoaXMuZ2V0RGF0YShkYXRhVXJsKS5zdWJzY3JpYmUoKHJlc3BvbnNlRGF0YSkgPT4ge1xuICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgdGhpcy5tdWx0aXBsZURlbGV0aW9uID0gW10gO1xuICAgICAgICAgICAgICB2YXIgZGF0YSA9ICh0aGlzLmRhdGFTcmNLZXkpID8gcmVzcG9uc2VEYXRhW3RoaXMuZGF0YVNyY0tleV0gOiByZXNwb25zZURhdGE7XG4gICAgICAgICAgICAgIHRoaXMuY2hhZ2VEYXRhVGFibGUoZGF0YSkgO1xuICAgICAgICAgICAgICBpZih0aGlzLmlzTGF6eUxvYWRpbmdFbmFibGVkKCkpeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXRlbXMgPSByZXNwb25zZURhdGEudG90YWwgO1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSAxIHBhZ2luYXRpb24gb3V0IG9mIHplcm8gcHJvYmxlbSAxLzAgIGluc3RlYWQgb2YgMC8wIGlmIG5vIGRhdGEgaXMgY29tbWluZ1xuICAgICAgICAgICAgICAgIGlmKGRhdGEubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhT2Zmc2V0ID0gdGhpcy5kYXRhT2Zmc2V0K3RoaXMubGltaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXRlbXMgPSBkYXRhLmxlbmd0aCA7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhT2Zmc2V0ID0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihzZXRTZWxlY3RQYWdpbmF0aW9uKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzTGF6eUxvYWRpbmdFbmFibGVkKCkpe1xuICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gdGhpcy5jcmVhdGVQYWdpbmF0aW9uKHJlc3BvbnNlRGF0YS50b3RhbCwgdGhpcy5saW1pdCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSB0aGlzLmNyZWF0ZVBhZ2luYXRpb24oZGF0YS5sZW5ndGgsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmxvYWRGaW5pc2ggPSB0cnVlO1xuICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIHJlYWRpbmcgZGF0YSBpbiAnLGUpIDtcbiAgICAgICAgICB9XG4gICAgICB9LChlID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRGaW5pc2ggPSB0cnVlIDtcbiAgICAgIH0pKVxuICB9XG5cbiAgLy9DYW5jZWwgYXBpIEdFVCByZXF1ZXN0IHRvIGFwaVxuICBwdWJsaWMgY2FuY2VsTG9hZGluZygpe1xuICAgIHRoaXMubG9hZGVyLnVuc3Vic2NyaWJlKCkgO1xuICB9ICBcblxuICAvL1NldCBzb3VyY2Uga2V5IHRvIHJlYWQgZnJvbSBwYXlsb2FkIHJlc3BvbnNlIEpTT05cbiAgc2V0RGF0YVNyY0tleShzcmNLZXk6c3RyaW5nKTp2b2lkIHtcbiAgICB0aGlzLmRhdGFTcmNLZXkgPSBzcmNLZXk7XG4gIH1cblxuICBnZXREYXRhTGVuZ3RoKCk6IFByb21pc2U8bnVtYmVyPntcbiAgICByZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPigocmVzb2x2ZSkgPT57XG4gICAgICB0aGlzLmZseERhdGEuc3Vic2NyaWJlKChyZXNwKSA9PntcbiAgICAgICAgcmVzb2x2ZShyZXNwLmxlbmd0aCkgO1xuICAgICAgfSwoZT0+e1xuICAgICAgICByZXNvbHZlKDApIDtcbiAgICAgIH0pKVxuICAgIH0pIDtcbiAgfVxufSIsImltcG9ydCB7IEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnIDtcbmltcG9ydCB7IEZseFVpRGF0YXRhYmxlU2VydmljZSB9IGZyb20gJy4vZmx4LXVpLWRhdGF0YWJsZS5zZXJ2aWNlJyA7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZseFVpRGF0YVRhYmxle1xuICAgIGJlaGF2aW9yOiBCZWhhdmlvclN1YmplY3Q8YW55PiA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuICAgIGZseERhdGF0YWJsZURhdGEgPSB0aGlzLmJlaGF2aW9yLmFzT2JzZXJ2YWJsZSgpO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogRmx4VWlEYXRhdGFibGVTZXJ2aWNlKXtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmZseERhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLkNoYW5nZURhdGEocmVzcCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBkYXRhIENoYW5nZSB0YWJsZSBkYXRhIHdpdGggbmV3IGRhdGFcbiAgICAgKi9cbiAgICBDaGFuZ2VEYXRhKGRhdGEpIHtcbiAgICAgICAgdGhpcy5iZWhhdmlvci5uZXh0KGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbG9hZCBkYXRhIGZyb20gYXBpOiB2b2lkXG4gICAgICovXG4gICAgcHVibGljIHJlbG9hZERhdGEoKTogdm9pZHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGbHhEYXRhVGFibGVEYXRhKHRoaXMuc2VydmljZS5nZXREYXRhVXJsKCkpIDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWJvcnRSZXF1ZXN0KCl7XG4gICAgICAgIHRoaXMuc2VydmljZS5jYW5jZWxMb2FkaW5nKCkgO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsIE9uSW5pdCxBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsVmFsaWRhdG9ycyxGb3JtQnVpbGRlcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnIDtcbmltcG9ydCB7IEZseFVpRGF0YXRhYmxlU2VydmljZSB9IGZyb20gJy4vZmx4LXVpLWRhdGF0YWJsZS5zZXJ2aWNlJyA7XG5pbXBvcnQgeyBBc3luY1BpcGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nIDtcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5kZWNsYXJlIHZhciBwcmludEpTOiBhbnkgO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOidmbHgtdWktZGF0YXRhYmxlJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIGZseC11aS1kYXRhdGFibGUtbWFpbiB7eyBjbGFzc2VzPy5tYWluY29udGFpbmVyIH19XCI+XG4gICAgPGRpdiBpZD1cImV4cG9ydF9sb2FkaW5nXCIgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1jZW50ZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7bWFyZ2luLWJvdHRvbTowLjVlbTtjb2xvcjojZGRkZGRkO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OmJvbGQ7XCI+RXhwb3J0aW5nLi4uPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBmbHgtdWktZGF0YXRhYmxlLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTMgY29sLXNtLTMgcGFnaW5hdGlvbi1zZWxlY3QgY29sLW1kLTJcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6IDE7XCI+XG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sIHJtc2ggcm1yZCB7eyBjbGFzc2VzPy5wYWdpbmF0aW9uc2VsZWN0IH19XCIgKGNoYW5nZSk9XCJwYWdpbmF0ZURhdGF0YWJsZSgkZXZlbnQ/LnRhcmdldD8udmFsdWUpXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgcGFnaW5nIG9mIHNlcnZpY2U/LnBhZ2luYXRpb25cIiBbdmFsdWVdPVwicGFnaW5nPy52YWx1ZVwiPnt7IHBhZ2luZz8ubGFiZWwgfX08L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy01IGNvbC1zbS01IGNvbC1tZC0yIHRleHQtY2VudGVyIGZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBybXBkXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OiAyO1wiPlxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gW25nQ2xhc3NdPVwieydmbHgtcGFnaW5hdGlvbi1lbmQnOiBkaXNhYmxlUHJldnRCdXR0b24oKX1cIiAoY2xpY2spPVwibmV4dFByZXZJdGVtKCdwcmV2JylcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZVByZXZ0QnV0dG9uKClcIiBjbGFzcz1cImZseC11aS1kYXRhdGFibGUtcGFnaW5hdGlvbi1idXR0b25zIHt7IGNsYXNzZXM/LnBhZ2luYXRpb25CdXR0b24gfX1cIj48c3BhbiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvdWJsZS1sZWZ0IGZhLTF4XCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImZseC1kYXRhdGFibGUtdG9vbHRpcC1wcmV2XCIgW25nQ2xhc3NdPVwieydmbHgtcGFnaW5hdGlvbi1lbmQnOiBkaXNhYmxlUHJldnRCdXR0b24oKX1cIj5QcmV2aW91czwvc3Bhbj4gPC9idXR0b24+XG4gICAgICAgICAgICAgICAge3sgc2VydmljZT8uZGF0YU9mZnNldCB8IGNlaWw6IGxpbWl0IH19IC8ge3sgc2VydmljZT8udG90YWxJdGVtcyB8IGNlaWw6IGxpbWl0IH19XG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiBbbmdDbGFzc109XCJ7J2ZseC1wYWdpbmF0aW9uLWVuZCc6IGRpc2FibGVOZXh0QnV0dG9uKCl9XCIgKGNsaWNrKT1cIm5leHRQcmV2SXRlbSgnbmV4dCcpXCIgW2Rpc2FibGVkXT1cImRpc2FibGVOZXh0QnV0dG9uKClcIiBjbGFzcz1cImZseC11aS1kYXRhdGFibGUtcGFnaW5hdGlvbi1idXR0b25zIHt7IGNsYXNzZXM/LnBhZ2luYXRpb25CdXR0b24gfX1cIj48c3BhbiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvdWJsZS1yaWdodCBmYS0xeFwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJmbHgtZGF0YXRhYmxlLXRvb2x0aXAtbmV4dFwiIFtuZ0NsYXNzXT1cInsnZmx4LXBhZ2luYXRpb24tZW5kJzogZGlzYWJsZU5leHRCdXR0b24oKX1cIj5OZXh0PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBbY2xhc3NdPVwiJ3NlYXJjaC1iYXIgJytnZXRTZWFyY2hDb2x1bW5zKClcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiICpuZ0lmPVwiIWlzTGF6eWxvYWRpbmdFbmFibGVkKClcIiBbc3R5bGUuYmFja2dyb3VuZF09XCJzZWFyY2hCYXI/LmJhY2tncm91bmRcIiBbc3R5bGUuY29sb3JdPVwic2VhcmNoQmFyPy50ZXh0Q29sb3JcIiBbbmdTdHlsZV09XCJ7Ym9yZGVyOnNlYXJjaEJhcj8uYm9yZGVyU2l6ZSArJyBzb2xpZCAnKyBzZWFyY2hCYXI/LmJvcmRlckNvbG9yfSBcIiAoa2V5dXApPVwiZmlsdGVyRGF0YSgkZXZlbnQ/LnRhcmdldD8udmFsdWUpXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgcm1zaCBybXJkIGN1c3RvbWNsYXNzXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaFBsYWNlaG9sZGVyXCI+XG4gICAgICAgICAgICA8Zm9ybSAobmdTdWJtaXQpPVwic2VhcmNoRGF0YUluQXBpKHNyY2g/LnZhbHVlLHNyY2gpXCIgI3NyY2g9XCJuZ0Zvcm1cIiAqbmdJZj1cImlzTGF6eWxvYWRpbmdFbmFibGVkKClcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmFtZT1cInNlYXJjaFN0cmluZ1wiIG5nTW9kZWwgW3N0eWxlLmJhY2tncm91bmRdPVwic2VhcmNoQmFyPy5iYWNrZ3JvdW5kXCIgW3N0eWxlLmNvbG9yXT1cInNlYXJjaEJhcj8udGV4dENvbG9yXCIgW25nU3R5bGVdPVwie2JvcmRlcjpzZWFyY2hCYXI/LmJvcmRlclNpemUgKycgc29saWQgJysgc2VhcmNoQmFyPy5ib3JkZXJDb2xvcn0gXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgcm1zaCBybXJkIHt7IGNsYXNzZXM/LnNlYXJjaGJhciB9fVwiIFtwbGFjZWhvbGRlcl09XCJzZWFyY2hQbGFjZWhvbGRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIFtkaXNhYmxlZF09XCIhc3JjaD8udmFsaWRcIiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWNsZWFyIGJ0bi1tZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMSB0ZXh0LXJpZ2h0IHJtcGRcIiAqbmdJZj1cImhhc0FkZEJ1dHRvblwiPlxuICAgICAgICAgICAgPGJ1dHRvbiAoY2xpY2spPVwiYWRkQnV0dG9uQ2xpY2soKVwiIGNsYXNzPVwie3sgY2xhc3Nlcz8uYWRkQnV0dG9uIH19XCIgW3N0eWxlLmJhY2tncm91bmRdPVwiYWRkQnV0dG9uPy5iYWNrZ3JvdW5kXCIgW3N0eWxlLmJvcmRlckNvbG9yXT1cImFkZEJ1dHRvbj8uYmFja2dyb3VuZFwiIFtzdHlsZS5jb2xvcl09XCJhZGRCdXR0b24/LnRleHRDb2xvclwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPiBBZGQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMSB0ZXh0LXJpZ2h0IHJtcGQgZXhwb3J0LWNudFwiICpuZ0lmPVwiZW5hYmxlRGF0YUV4cG9ydHNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZHJvcGRvd25cIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IHt7IGNsYXNzZXM/LmV4cG9ydEJ1dHRvbiB9fSBkcm9wZG93bi10b2dnbGVcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiY2FyZXRcIj48L2k+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LWV4cG9ydFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIj57eyBkYXRhRXhwb3J0c0NvbmZpZz8udGl0bGUgfX0uIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAoY2hhbmdlKT1cImNoZWNrVG9FeHBvcnRPcHRpb24oJGV2ZW50Py50YXJnZXQ/LmNoZWNrZWQpXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7dG9wOjAuM2VtO1wiPiA8c3VwIHN0eWxlPVwiZm9udC1zaXplOjEwcHg7Y29sb3I6Izk5OTtcIj4gQWxsPC9zdXA+PC9saT4gXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93bi1zdWJtZW51XCIgKm5nRm9yPVwibGV0IGV4cG9ydCBvZiBkYXRhRXhwb3J0c0NvbmZpZz8uZXhwb3J0c1RvXCIgKGNsaWNrKT1cImV4cG9ydERvY3VtZW50c0FzKGV4cG9ydClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiAqbmdJZj1cImV4cG9ydD09J3ByaW50J1wiPjxpIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wcmludFwiPjwvaT4gUHJpbnQ8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgKm5nSWY9XCJleHBvcnQ9PSdwZGYnXCIgc3R5bGU9XCJjb2xvcjojZmYwMDAwXCI+PGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWZpbGVcIj48L2k+IFBERjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiAqbmdJZj1cImV4cG9ydD09J2V4Y2VsJ1wiIHN0eWxlPVwiY29sb3I6IzAwOTkwMDtcIj48aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZmlsZVwiPjwvaT4gRXhjZWw8L2E+ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgKm5nSWY9XCJleHBvcnQ9PSd3b3JkJ1wiIHN0eWxlPVwiY29sb3I6IzMzNTU5OTtcIj48aSBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZmlsZVwiPjwvaT4gV29yZDwvYT4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gICpuZ0lmPVwiIWlzRXhwb3J0QWxsXCI+e3sgKGRpc3BsYXlEYXRhIHwgYXN5bmMpPy5sZW5ndGggfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAgKm5nSWY9XCJpc0V4cG9ydEFsbFwiPnt7IChzZXJ2aWNlPy5mbHhEYXRhIHwgYXN5bmMpPy5sZW5ndGggfX08L3NwYW4+IFxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgcm1wZCB0YWJsZS1yZXNwb25zaXZlXCI+XG4gICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHt7IGNsYXNzZXM/LnRhYmxlVHlwZSB9fSB0YWJsZS1yZXNwb25zaXZlXCIgaWQ9XCJmbHhfdWlfdGFibGVfdGFnXCI+XG4gICAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJ7eyBjbGFzc2VzPy50YWJsZUhlYWRlciB9fVwiPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoICpuZ0lmPVwiIWhpZGVOdW1iZXJzXCI+TjxzdXA+PHU+bzwvdT48L3N1cD48L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGggKm5nRm9yPVwibGV0IGhlYWRlciBvZiBoZWFkZXJzXCI+e3sgaGVhZGVyIH19PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoICpuZ0lmPVwiaGFzQWN0aW9uQnV0dG9uc1wiPnt7IGFjdGlvbkhlYWRlciB9fSBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBbY2hlY2tlZF09XCJzZXJ2aWNlPy5tdWx0aXBsZURlbGV0aW9uPy5sZW5ndGg+MFwiIChjaGFuZ2UpPVwiYWRkUmVtb3ZlKCRldmVudD8udGFyZ2V0Py5jaGVja2VkKVwiICpuZ0lmPVwiZW5hYmxlTXVsdGlwbGVTZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4teHMgZmx4LW11bHRpcGxlLWRlbGV0aW9uLWJ1dHRvblwiICpuZ0lmPVwiZW5hYmxlTXVsdGlwbGVTZWxlY3Rpb24gJiYgc2VydmljZT8ubXVsdGlwbGVEZWxldGlvbj8ubGVuZ3RoPjBcIiAoY2xpY2spPVwiY29uZmlybURlbGV0ZSgpXCI+PHNwYW4gW2NsYXNzXT1cIm11bHRpcGxlU2VsZWN0QnV0dG9uPy5pY29uXCI+PC9zcGFuPiB7eyBtdWx0aXBsZVNlbGVjdEJ1dHRvbj8udGV4dCB9fTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgIDx0ciAqbmdJZj1cIiFzZXJ2aWNlPy5sb2FkRmluaXNoXCI+ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIyMFwiIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgKm5nSWY9XCJzcGlubmVyU3JjXCIgW2NsYXNzXT1cImNsYXNzZXM/LnNwaW5uZXJcIiBbc3JjXT1cInNwaW5uZXJTcmNcIiBzdHlsZT1cIm1hcmdpbi10b3A6MWVtO21hcmdpbi1ib3R0b206MWVtO1wiPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiZmx4dWlkYXRhdGFibGVyb3dcIiBpZD1cImZseGRhdGF0YWJsZV9zaW5nbGVyb3dcIiAqbmdGb3I9XCJsZXQgZGF0YSBvZiBkaXNwbGF5RGF0YSB8IGFzeW5jO2xldCBpPWluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDwhLS0gTnVtYmVycyAtLT5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwie3sgY2xhc3Nlcz8udGFibGVEYXRhIH19XCIgKm5nSWY9XCIhaGlkZU51bWJlcnNcIiBzdHlsZT1cImNvbG9yOiAjOTk5O1wiPnt7IG9mZnNldCtpIH19PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPCEtLSBNYWluIC0tPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ7eyBjbGFzc2VzPy50YWJsZURhdGEgfX1cIiAqbmdGb3I9XCJsZXQgZGF0YUtleSBvZiBkYXRhS2V5cztsZXQgeD1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyAqbmdJZj1cImhhc0ltYWdlRW1iZWRlZCgpICYmIHg9PWVtYmVkUGljdHVyZXM/LmluZGV4XCIgW2NsYXNzXT1cIidpbWctZmFsbC1iYWNrICcgK2VtYmVkUGljdHVyZXM/LmNsYXNzXCIgW3NyY109XCJlbWJlZFBpY3R1cmVzPy5yb290Rm9sZGVyK2RhdGFbZGF0YUtleV1cIiBbZmx4LXVpLWRhdGF0YWJsZS1pbWctZmFsbGJhY2tdPVwiZW1iZWRQaWN0dXJlcz8uZmFsbGJhY2tVcmxcIiA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFoYXNJbWFnZUVtYmVkZWQoKSB8fCB4IT1lbWJlZFBpY3R1cmVzPy5pbmRleFwiPnt7IGRhdGFbZGF0YUtleV0gfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwhLS0gQnV0dG9ucyAtLT5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtYnV0dG9uc1wiICpuZ0lmPVwiaGFzQWN0aW9uQnV0dG9uc1wiIHNjb3BlPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdGb3I9XCJsZXQgYUJ1dHRvbiBvZiBhY3Rpb25CdXR0b25zO2xldCBidXR0b25JbmRleD1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKGNsaWNrKT1cImFjdGlvbkJ1dHRvbkNsaWNrZWQoaSxidXR0b25JbmRleClcIiBjbGFzcz1cImJ0biB7eyBhQnV0dG9uPy5jbGFzcyB9fVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9sdGlwXCIgY2xhc3M9XCJmbHgtdG9vbHRpcFwiIFtuZ0NsYXNzXT1cInsnZmx4LXRvb2x0aXAtbGVmdCc6YUJ1dHRvbj8udG9vbHRpcFBvc2l0aW9uPT0nbGVmdCcsJ2ZseC10b29sdGlwLWJvdHRvbSc6YUJ1dHRvbj8udG9vbHRpcFBvc2l0aW9uPT0nYm90dG9tJywnZmx4LXRvb2x0aXAtcmlnaHQnOmFCdXR0b24/LnRvb2x0aXBQb3NpdGlvbj09J3JpZ2h0J31cIiAqbmdJZj1cImFCdXR0b24/LnRvb2x0aXBcIj57eyBhQnV0dG9uPy50b29sdGlwIH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uLWJ1dHRvbi1pY29uLWxlZnRcIiBbY2xhc3NdPVwiYUJ1dHRvbj8uaWNvblwiICpuZ0lmPVwiIWFCdXR0b24/Lmljb25Qb3NpdGlvbiB8fCBhQnV0dG9uPy5pY29uUG9zaXRpb24hPSdyaWdodCdcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYnV0dG9uLXRleHRcIj4ge3sgYUJ1dHRvbj8udGV4dCB9fSA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIFtjbGFzc109XCJhQnV0dG9uPy5pY29uXCIgKm5nSWY9XCJhQnV0dG9uPy5pY29uUG9zaXRpb249PSdyaWdodCdcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+IFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQgKGNoYW5nZSk9XCJhZGRSZW1vdmVEZWxldGVJdGVtKGRhdGFbbXVsdGlwbGVTZWxlY3RLZXldLGksJGV2ZW50Py50YXJnZXQ/LmNoZWNrZWQpXCIgKm5nSWY9XCJlbmFibGVNdWx0aXBsZVNlbGVjdGlvbiAmJiBzZXJ2aWNlPy5tdWx0aXBsZURlbGV0aW9uPy5sZW5ndGg+MFwiPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyICpuZ0lmPVwidERhdGE/Lmxlbmd0aDwxXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMTBcIiBjbGFzcz1cInRleHQtY2VudGVyXCIgKm5nSWY9XCJzZXJ2aWNlPy5sb2FkRmluaXNoXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImNvbG9yOiNmZjAwMDA7Zm9udC1zaXplOjEzcHg7XCI+Tm8gZGF0YSBmb3VuZDwvc3Bhbj4gPGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT1cIm1hcmdpbi10b3A6MWVtO1wiIChjbGljayk9XCJyZWxvYWQoKVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IHt7IGNsYXNzZXM/LnJlbG9hZGJ1dHRvbiB9fVwiIGNvbG9yPVwicHJpbWFyeVwiPjxzcGFuIGNsYXNzPVwiZmEgZmEtcmVmcmVzaFwiPjwvc3Bhbj4gUmVsb2FkPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgcm1wZCBmbHgtdG90YWwtZGF0YVwiICpuZ0lmPVwic2hvd0JvdHRvbUluZm9cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCB0ZXh0LWxlZnQgcm1wZFwiPlRvdGFsIHBhZ2luYXRpb246IDxzcGFuPiB7eyBzZXJ2aWNlPy50b3RhbEl0ZW1zIHwgY2VpbDogbGltaXQgfX08L3NwYW4+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgdGV4dC1jZW50ZXIgcm1wZFwiPiMgb2YgaXRlbXMgcGVyIHBhZ2luYXRpb246IDxzcGFuPnt7IGxpbWl0IH19PC9zcGFuPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00IHRleHQtcmlnaHQgcm1wZFwiPlRvdGFsIGl0ZW1zOiA8c3Bhbj57eyAoc2VydmljZT8uZmx4RGF0YSB8IGFzeW5jKT8ubGVuZ3RoIH19PC9zcGFuPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PmAsXG4gIHN0eWxlczogW2AuZmx4LXVpLWRhdGF0YWJsZS1tYWlue2JhY2tncm91bmQtY29sb3I6I2ZmZjtwYWRkaW5nLXRvcDoxZW07cGFkZGluZy1ib3R0b206MWVtfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kYW5nZXJ7YmFja2dyb3VuZC1jb2xvcjojZjUwMDU3O2JvcmRlcjoxcHggc29saWQgI2Y1MDA1Nztib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbW96LWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW8tYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LW1zLWJveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkO2JvcmRlci1yYWRpdXM6M3B4O21hcmdpbi1sZWZ0Oi4zZW19LmZseC11aS1kYXRhdGFibGUtbWFpbiBpbWcuaW1nLWZhbGwtYmFja3t3aWR0aDozMHB4O2hlaWdodDozMHB4fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnBhZ2luYXRpb24tc2VsZWN0IGlucHV0W3R5cGU9dGV4dF0sLmZseC11aS1kYXRhdGFibGUtbWFpbiAucGFnaW5hdGlvbi1zZWxlY3Qgc2VsZWN0LC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnNlYXJjaC1iYXIgaW5wdXRbdHlwZT10ZXh0XSwuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5zZWFyY2gtYmFyIHNlbGVjdHtib3JkZXItdG9wOm5vbmUhaW1wb3J0YW50O2JvcmRlci1sZWZ0Om5vbmUhaW1wb3J0YW50O2JvcmRlci1yaWdodDpub25lIWltcG9ydGFudDtib3JkZXItYm90dG9tOjJweCBzb2xpZCAjZGRkIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjAhaW1wb3J0YW50O2JveC1zaGFkb3c6MCAwIDAgMCB0cmFuc3BhcmVudCFpbXBvcnRhbnQ7LW1vei1ib3gtc2hhZG93OjAgMCAwIDAgdHJhbnNwYXJlbnQhaW1wb3J0YW50Oy13ZWJraXQtYm94LXNoYWRvdzowIDAgMCAwIHRyYW5zcGFyZW50IWltcG9ydGFudDstby1ib3gtc2hhZG93OjAgMCAwIDAgdHJhbnNwYXJlbnQhaW1wb3J0YW50Oy1tcy1ib3gtc2hhZG93OjAgMCAwIDAgdHJhbnNwYXJlbnQhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnBhZ2luYXRpb24tc2VsZWN0IGlucHV0W3R5cGU9dGV4dF06Zm9jdXMsLmZseC11aS1kYXRhdGFibGUtbWFpbiAucGFnaW5hdGlvbi1zZWxlY3Qgc2VsZWN0OmZvY3VzLC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnNlYXJjaC1iYXIgaW5wdXRbdHlwZT10ZXh0XTpmb2N1cywuZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5zZWFyY2gtYmFyIHNlbGVjdDpmb2N1c3tib3JkZXItYm90dG9tLWNvbG9yOiMzNTkhaW1wb3J0YW50O3RyYW5zaXRpb246LjVzOy1tb3otdHJhbnNpdGlvbjouNXM7LXdlYmtpdC10cmFuc2l0aW9uOi41czstby10cmFuc2l0aW9uOi41czstbXMtdHJhbnNpdGlvbjouNXN9LmZseC11aS1kYXRhdGFibGUtbWFpbiAucGFnaW5hdGlvbi1zZWxlY3Qgc2VsZWN0LC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnNlYXJjaC1iYXIgc2VsZWN0ey13ZWJraXQtYXBwZWFyYW5jZTpub25lO2FwcGVhcmFuY2U6bm9uZTstbW96LWFwcGVhcmFuY2U6bm9uZX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5mbHgtZGF0YXRhYmxlLXBhZ2luYXRpb257cGFkZGluZy10b3A6LjVlbX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5mbHgtZGF0YXRhYmxlLXBhZ2luYXRpb24gYnV0dG9ue3dpZHRoOjM1cHghaW1wb3J0YW50O2hlaWdodDozNXB4IWltcG9ydGFudDtib3JkZXItcmFkaXVzOjUwZW0haW1wb3J0YW50O2JvcmRlcjpub25lIWltcG9ydGFudDtib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2Oy1tb3otYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjstbXMtYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjtiYWNrZ3JvdW5kLWNvbG9yOiMzNTk7Y29sb3I6I2ZmZjtmb250LXNpemU6MjNweDtmb250LXdlaWdodDo3MDA7cG9zaXRpb246YWJzb2x1dGU7dG9wOjB9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIGJ1dHRvbjpmaXJzdC1jaGlsZHtsZWZ0OjB9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIGJ1dHRvbjpmaXJzdC1jaGlsZCAuZmx4LWRhdGF0YWJsZS10b29sdGlwLXByZXZ7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjQwMDtjb2xvcjojZmZmO2JhY2tncm91bmQtY29sb3I6IzM1OTtwYWRkaW5nLWxlZnQ6LjNlbTtwYWRkaW5nLXJpZ2h0Oi4zZW07Ym9yZGVyLXJhZGl1czozcHg7bWFyZ2luLWxlZnQ6LTU3cHg7bWFyZ2luLXRvcDouNWVtO2JveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50Oy1tb3otYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2IWltcG9ydGFudDstby1ib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2IWltcG9ydGFudDstbXMtYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7dmlzaWJpbGl0eTpoaWRkZW59LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIGJ1dHRvbjpob3Zlcj5zcGFuLmZseC1kYXRhdGFibGUtdG9vbHRpcC1uZXh0LC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiBidXR0b246aG92ZXI+c3Bhbi5mbHgtZGF0YXRhYmxlLXRvb2x0aXAtcHJldnt2aXNpYmlsaXR5OnZpc2libGV9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIC5mbHgtcGFnaW5hdGlvbi1lbmR7YmFja2dyb3VuZC1jb2xvcjojZjUwMDU3IWltcG9ydGFudDtib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjZmZjMmQ4IWltcG9ydGFudDstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNmZmMyZDghaW1wb3J0YW50Oy13ZWJraXQtYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2ZmYzJkOCFpbXBvcnRhbnQ7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2ZmYzJkOCFpbXBvcnRhbnQ7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNmZmMyZDghaW1wb3J0YW50O2N1cnNvcjpub3QtYWxsb3dlZH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5mbHgtZGF0YXRhYmxlLXBhZ2luYXRpb24gLmZseC1wYWdpbmF0aW9uLWVuZDpob3Zlcj5zcGFuLmZseC1kYXRhdGFibGUtdG9vbHRpcC1uZXh0LC5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmZseC1kYXRhdGFibGUtcGFnaW5hdGlvbiAuZmx4LXBhZ2luYXRpb24tZW5kOmhvdmVyPnNwYW4uZmx4LWRhdGF0YWJsZS10b29sdGlwLXByZXZ7dmlzaWJpbGl0eTpoaWRkZW59LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIGJ1dHRvbjpsYXN0LWNoaWxke3JpZ2h0OjB9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZmx4LWRhdGF0YWJsZS1wYWdpbmF0aW9uIGJ1dHRvbjpsYXN0LWNoaWxkIC5mbHgtZGF0YXRhYmxlLXRvb2x0aXAtbmV4dHtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7Zm9udC1zaXplOjEzcHg7Zm9udC13ZWlnaHQ6NDAwO2NvbG9yOiNmZmY7YmFja2dyb3VuZC1jb2xvcjojMzU5O3BhZGRpbmctbGVmdDouM2VtO3BhZGRpbmctcmlnaHQ6LjNlbTtib3JkZXItcmFkaXVzOjNweDttYXJnaW4tbGVmdDozNXB4O21hcmdpbi10b3A6LjVlbTtib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2IWltcG9ydGFudDstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50Oy13ZWJraXQtYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNiFpbXBvcnRhbnQ7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTYhaW1wb3J0YW50O3Zpc2liaWxpdHk6aGlkZGVufS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmV4cG9ydC1jbnQgYnV0dG9ue2JvcmRlci1yYWRpdXM6NTBlbSFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZXttYXJnaW4tdG9wOjEuNWVtfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHJ7cGFkZGluZy10b3A6MCFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZHtwYWRkaW5nLXRvcDouNWVtO2JvcmRlci10b3A6MXB4IHNvbGlkICNmMGYwZjA7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2YwZjBmMH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyIHRkIGJ1dHRvbnttYXJnaW4tcmlnaHQ6LjNlbTttYXJnaW4tbGVmdDowfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHIgdGQgYnV0dG9uIGRpdi5mbHgtdG9vbHRpcHtwb3NpdGlvbjphYnNvbHV0ZTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMzIsMjcsMjcsLjgwOCk7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjEzcHg7Y29sb3I6I2ZmZjtib3JkZXItcmFkaXVzOjNweDtib3gtc2hhZG93OjAgM3B4IDIwcHggMCAjNGI0OTQ5Oy1tb3otYm94LXNoYWRvdzowIDNweCAyMHB4IDAgIzRiNDk0OTstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMjBweCAwICM0YjQ5NDk7LW8tYm94LXNoYWRvdzowIDNweCAyMHB4IDAgIzRiNDk0OTstbXMtYm94LXNoYWRvdzowIDNweCAyMHB4IDAgIzRiNDk0OTttYXJnaW4tbGVmdDotMi41ZW07bWFyZ2luLXRvcDotMi44ZW07dmlzaWJpbGl0eTpoaWRkZW47d2lkdGg6ODBweDtwYWRkaW5nOi4zZW0gLjVlbX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyIHRkIGJ1dHRvbiAuZmx4LXRvb2x0aXAtbGVmdHttYXJnaW4tbGVmdDotOTVweCFpbXBvcnRhbnQ7bWFyZ2luLXRvcDotLjNlbSFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZCBidXR0b24gLmZseC10b29sdGlwLWJvdHRvbXttYXJnaW4tdG9wOjIuM2VtIWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyIHRkIGJ1dHRvbiAuZmx4LXRvb2x0aXAtcmlnaHR7bWFyZ2luLWxlZnQ6MjhweCFpbXBvcnRhbnQ7bWFyZ2luLXRvcDotLjNlbSFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiB0YWJsZSB0Ym9keSB0ciB0ZCBidXR0b246aG92ZXI+ZGl2LmZseC10b29sdGlwe3RyYW5zaXRpb246LjNzO3Zpc2liaWxpdHk6dmlzaWJsZX0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIHRhYmxlIHRib2R5IHRyIHRkLnRhYmxlLWJ1dHRvbnN7cGFkZGluZy10b3A6LjJlbTtwYWRkaW5nLWJvdHRvbTouMmVtfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHI6bnRoLW9mLXR5cGUoZXZlbil7YmFja2dyb3VuZC1jb2xvcjojZjhmOWZhfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gdGFibGUgdGJvZHkgdHI6bnRoLW9mLXR5cGUob2RkKXtiYWNrZ3JvdW5kLWNvbG9yOiNmZmZ9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLWRhbmdlcjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmZjE0NmI7Ym9yZGVyOjFweCBzb2xpZCAjZmYxNDZiO2JveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2ZmNWZiNjstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2ZmNWZiNjstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2ZmNWZiNjstby1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICNmZjVmYjY7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2ZmNWZiNjt0cmFuc2l0aW9uOi41czstbW96LXRyYW5zaXRpb246LjVzOy13ZWJraXQtdHJhbnNpdGlvbjouNXM7LW8tdHJhbnNpdGlvbjouNXM7LW1zLXRyYW5zaXRpb246LjVzfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kYW5nZXI6Zm9jdXN7YmFja2dyb3VuZC1jb2xvcjojZjUwMDU3O2JvcmRlcjoxcHggc29saWQgI2Y1MDA1N30uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4td2hpdGV7YmFja2dyb3VuZC1jb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kYXJre2JhY2tncm91bmQtY29sb3I6IzIyMiFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXByaW1hcnl7YmFja2dyb3VuZC1jb2xvcjojMzU5O2NvbG9yOiNmZmY7Ym9yZGVyOjFweCBzb2xpZCAjMzU5O2JveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy1tb3otYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstby1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbXMtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7Ym9yZGVyLXJhZGl1czozcHh9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXByaW1hcnk6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojNDc2OWFkO2JvcmRlcjoxcHggc29saWQgIzQ3NjlhZDtib3gtc2hhZG93OjAgM3B4IDEwcHggMCAjYjNjNGU2Oy1tb3otYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAwICNiM2M0ZTY7LW8tYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjstbXMtYm94LXNoYWRvdzowIDNweCAxMHB4IDAgI2IzYzRlNjt0cmFuc2l0aW9uOi41czstbW96LXRyYW5zaXRpb246LjVzOy13ZWJraXQtdHJhbnNpdGlvbjouNXM7LW8tdHJhbnNpdGlvbjouNXM7LW1zLXRyYW5zaXRpb246LjVzfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1wcmltYXJ5OmZvY3Vze2JhY2tncm91bmQtY29sb3I6IzM1OTtib3JkZXI6MXB4IHNvbGlkICMzNTl9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLWxhcmdle3BhZGRpbmctdG9wOjFlbSFpbXBvcnRhbnQ7cGFkZGluZy1ib3R0b206MWVtIWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tbWVkaXVte3BhZGRpbmctdG9wOi43ZW0haW1wb3J0YW50O3BhZGRpbmctYm90dG9tOi43ZW0haW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1zdWNjZXNze2JveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy1tb3otYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstby1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbXMtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZC1jb2xvcjojNWNiODVjO2JvcmRlcjoxcHggc29saWQgIzVjYjg1Y30uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tc3VjY2Vzczpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiM3MGNjNzA7Ym9yZGVyOjFweCBzb2xpZCAjNzBjYzcwO2JveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzlkZjk5ZDstbW96LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzlkZjk5ZDstd2Via2l0LWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzlkZjk5ZDstby1ib3gtc2hhZG93OjAgM3B4IDEwcHggMXB4ICM5ZGY5OWQ7LW1zLWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzlkZjk5ZDt0cmFuc2l0aW9uOi41czstbW96LXRyYW5zaXRpb246LjVzOy13ZWJraXQtdHJhbnNpdGlvbjouNXM7LW8tdHJhbnNpdGlvbjouNXM7LW1zLXRyYW5zaXRpb246LjVzfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1zdWNjZXNzOmZvY3Vze2JhY2tncm91bmQtY29sb3I6IzVjYjg1Yztib3JkZXI6MXB4IHNvbGlkICM1Y2I4NWN9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLWRlZmF1bHR7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZWVlOy1tb3otYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNlZWU7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2VlZTstby1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2VlZTstbXMtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNlZWU7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyOjFweCBzb2xpZCAjZGRkfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmJ0bi1kZWZhdWx0OmhvdmVye2JhY2tncm91bmQtY29sb3I6I2ZmZjtib3JkZXI6MXB4IHNvbGlkICNlN2U3ZTc7Ym94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjZTJlMmUyOy1tb3otYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjZTJlMmUyOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjZTJlMmUyOy1vLWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggI2UyZTJlMjstbXMtYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjZTJlMmUyO3RyYW5zaXRpb246LjVzOy1tb3otdHJhbnNpdGlvbjouNXM7LXdlYmtpdC10cmFuc2l0aW9uOi41czstby10cmFuc2l0aW9uOi41czstbXMtdHJhbnNpdGlvbjouNXN9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLWRlZmF1bHQ6Zm9jdXN7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlcjoxcHggc29saWQgI2RkZH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tc2Vjb25kYXJ5e2JveC1zaGFkb3c6MCAzcHggNXB4IDFweCAjZGRkOy1tb3otYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7LXdlYmtpdC1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstby1ib3gtc2hhZG93OjAgM3B4IDVweCAxcHggI2RkZDstbXMtYm94LXNoYWRvdzowIDNweCA1cHggMXB4ICNkZGQ7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZC1jb2xvcjojMWU4OGU1O2NvbG9yOiNmZmZ9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXNlY29uZGFyeTpob3Zlcntjb2xvcjojZmZmO2JhY2tncm91bmQtY29sb3I6IzI4OTJlZjtib3JkZXI6MXB4IHNvbGlkICMyODkyZWY7Ym94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjNTViZmZmOy1tb3otYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjNTViZmZmOy13ZWJraXQtYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjNTViZmZmOy1vLWJveC1zaGFkb3c6MCAzcHggMTBweCAxcHggIzU1YmZmZjstbXMtYm94LXNoYWRvdzowIDNweCAxMHB4IDFweCAjNTViZmZmO3RyYW5zaXRpb246LjVzOy1tb3otdHJhbnNpdGlvbjouNXM7LXdlYmtpdC10cmFuc2l0aW9uOi41czstby10cmFuc2l0aW9uOi41czstbXMtdHJhbnNpdGlvbjouNXN9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuYnRuLXNlY29uZGFyeTpmb2N1c3tjb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnBhZ2luYXRpb24tYnV0dG9ue2JhY2tncm91bmQtY29sb3I6IzM1OTtjb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnRhYmxlLWZvbnR7Zm9udC1mYW1pbHk6S2h1bGEsc2Fucy1zZXJpZiFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAudGFibGUtaGVhZGVyLWljb257cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6LjJlbTt3aWR0aDo4MHB4O2hlaWdodDo4MHB4O2ZvbnQtc2l6ZTo1MHB4O21hcmdpbi10b3A6LTMwcHg7Ym9yZGVyLXJhZGl1czo1cHghaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnRhYmxlLXRpdGxle2JhY2tncm91bmQtY29sb3I6IzM1OTtjb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6MnB4O3BhZGRpbmc6MWVtO2ZvbnQtc2l6ZToxNXB4O2ZvbnQtd2VpZ2h0OjcwMDttYXJnaW4tYm90dG9tOjEuNWVtO2ZvbnQtZmFtaWx5OlJvYm90byxzYW5zLXNlcmlmO2JveC1zaGFkb3c6MCAxcHggNXB4IDFweCAjZGRkOy1tb3otYm94LXNoYWRvdzowIDFweCA1cHggMXB4ICNkZGQ7LXdlYmtpdC1ib3gtc2hhZG93OjAgMXB4IDVweCAxcHggI2RkZDstby1ib3gtc2hhZG93OjAgMXB4IDVweCAxcHggI2RkZDstbXMtYm94LXNoYWRvdzowIDFweCA1cHggMXB4ICNkZGR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuZGFuZ2Vye2JhY2tncm91bmQtY29sb3I6I2Y1MDA1Nztjb2xvcjojZmZmfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnByaW1hcnl7YmFja2dyb3VuZC1jb2xvcjojMzU5O2NvbG9yOiNmZmZ9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuc3VjY2Vzc3tiYWNrZ3JvdW5kLWNvbG9yOiM1Y2I4NWM7Y29sb3I6I2ZmZn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5kZWZhdWx0e2JhY2tncm91bmQtY29sb3I6I2ZmZjtjb2xvcjojMDAwfS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLnNlY29uZGFyeXtiYWNrZ3JvdW5kLWNvbG9yOiMxZTg4ZTU7Y29sb3I6I2ZmZn0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5idG4tY2xlYXJ7Ym9yZGVyOm5vbmUhaW1wb3J0YW50O2JveC1zaGFkb3c6bm9uZSFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuaW5wdXQtZ3JvdXAsLmZseC11aS1kYXRhdGFibGUtbWFpbiAuaW5wdXQtZ3JvdXAgaW5wdXR7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnR9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuaW5wdXQtZ3JvdXAtYWRkb257Ym9yZGVyOm5vbmUhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnQ7Ym94LXNoYWRvdzpub25lIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50IWltcG9ydGFudH0uZmx4LXVpLWRhdGF0YWJsZS1tYWluIC5pbnB1dC1ncm91cC1hZGRvbiBidXR0b257Ym9yZGVyOjFweCBzb2xpZCB0cmFuc3BhcmVudCFpbXBvcnRhbnQ7Ym94LXNoYWRvdzpub25lIWltcG9ydGFudDtib3JkZXItdG9wOm5vbmUhaW1wb3J0YW50O2JvcmRlci1ib3R0b206bm9uZSFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7Ym9yZGVyLXJhZGl1czo1MGVtIWltcG9ydGFudDtjb2xvcjojMzU5O3dpZHRoOjMwcHg7aGVpZ2h0OjMwcHh9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuaW5wdXQtZ3JvdXAtYWRkb24gYnV0dG9uIGl7Zm9udC1zaXplOjE4cHh9LmZseC11aS1kYXRhdGFibGUtbWFpbiAuaW5wdXQtZ3JvdXAtYWRkb24gYnV0dG9uOmRpc2FibGVke2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50fS5mbHgtdWktZGF0YXRhYmxlLW1haW4gLmlucHV0LWdyb3VwLWFkZG9uIGJ1dHRvbjpkaXNhYmxlZCBpe2NvbG9yOiNmNTAwNTd9YF1cbn0pXG5leHBvcnQgY2xhc3MgRmx4VWlEYXRhdGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsQWZ0ZXJWaWV3SW5pdHtcbiAgQElucHV0KCkgY2xhc3NlczogYW55ID0ge30gOy8ve21haW5jb250YWluZXJ8c3Bpbm5lcnxhZGRCdXR0b258dGFibGVIZWFkZXJ8dGFibGVEYXRhfGV4cG9ydEJ1dHRvbnxTZWFyY2hCYXJ8dGFibGVUeXBlfVxuICBASW5wdXQoKSBoZWFkZXJzOiBBcnJheTxzdHJpbmc+ID0gW10gOyAvLyBUYWJsZSBoZWFkZXJzICh2OiAxLjAuMCkgXG4gIEBJbnB1dCgpIGxhenlsb2FkaW5nQ29uZmlnOiBhbnkgPSB7fSA7XG4gIEBJbnB1dCgpIGVtYmVkUGljdHVyZXM6IGFueSA9IHt9IDtcbiAgQElucHV0KCkgZGF0YUtleXM6IEFycmF5PHN0cmluZz4gPSBbXSA7IC8vIERhdGEga2V5cyB0byBwb3B1bGF0ZS4gICh2OiAxLjAuMClcbiAgQElucHV0KCkgZW5hYmxlRGF0YUV4cG9ydHM6IGJvb2xlYW4gPSBmYWxzZSA7Ly9EZWZhdWx0IHRvIGZhbHNlOyAodjogMS4wLjEpXG4gIEBJbnB1dCgpIGRhdGFFeHBvcnRzQ29uZmlnOiBhbnkgPSB7fSA7Ly8gZGF0YSBleHBvcnRzIGNvbmZpZ3VyYXRpb246IHtleHBvcnRzVG86WydwcmludCcsJ3dvcmQnLCdwZGYnLCdleGNlbCddLHRpdGxlOidFeHBvcnRzIGRhdGEnLGRhdGFDb2x1bW5zOltdfX0gRGF0YSBjb2x1bW5zIHRvIGV4cG9ydFxuICBASW5wdXQoKSBzaG93Qm90dG9tSW5mbzogZmFsc2UgOyAvLyBUbyBlbmFibGUgdGFibGUgYm90dG9tIGluZm9ybWF0aW9uXG4gIEBJbnB1dCgpIHNlYXJjaEtleXMgPSBbXSA7IC8vIEtleXMgdG8gc2VhcmNoIGZvciBzZWFyY2ggb3B0aW1pemF0aW9uLiAgKHY6IDEuMC4wKVxuICBASW5wdXQoKSBkYXRhU3JjS2V5OiBzdHJpbmcgPSAnJyAvLyBEYXRhIHRvIHJlYWQgZnJvbSBqc29uIHJlc3BvbnNlLiAgKHY6IDEuMC4wKVxuICBASW5wdXQoKSBoYXNBY3Rpb25CdXR0b25zOiBib29sZWFuID0gZmFsc2UgOyAvL3NwZWNpZnkgaWYgZGF0YXRhYmxlIHNob3VsZCBoYXZlIGFuZCBhZGQgYnV0dG9uLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIGhpZGVOdW1iZXJzOiBib29sZWFuID0gZmFsc2UgOyAvL3NwZWNpZnkgaWYgdGhlIG51bWJlcnMuICAodjogMS4wLjApXG4gIEBJbnB1dCgpIGVuYWJsZU11bHRpcGxlU2VsZWN0aW9uOiBib29sZWFuID0gZmFsc2UgOyAvLyBFbmFibGUgbXVsdGlwbGUgc2VsZWN0IGlucHV0IGJveCB0byBhcHBlYXIuICh2OiAxLjAuMCkgZW5hYmxlTXVsdGlwbGVEZWxldGUgcmVuYW1lZCB0byBlbmFibGVNdWx0aXBsZVNlbGVjdGlvbiBpbiAodjoxLjAuMSlcbiAgQElucHV0KCkgbXVsdGlwbGVTZWxlY3RLZXk6IHN0cmluZyA9ICcnIDsgLy8gU3BlY2lmeSB3aGljaCBrZXkgdG8gc2VsZWN0LiAodjoxLjAuMCkgbXVsdGlwbGVEZWxldGVLZXkgcmVuYW1lZCB0byBtdWx0aXBsZVNlbGVjdEtleSBpbiAodjoxLjAuMCkgO1xuICBASW5wdXQoKSBoYXNBZGRCdXR0b246IGJvb2xlYW4gPSBmYWxzZSA7IC8vIEVuYWJsZSB0byBzaG93IGFkZCBidXR0b24gb24gdGhlIGhlYWRlci4gKHY6IDEuMC4wKVxuICBASW5wdXQoKSBkYXRhVXJsOiBzdHJpbmcgPSAnJyA7IC8vIFVybCB0byBsb2FkIHRhYmxlIGRhdGEuICh2OiAxLjAuMClcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uU3RhcnQ6IGJvb2xlYW4gPSBmYWxzZSA7XG4gIEBJbnB1dCgpIG11bHRpcGxlU2VsZWN0QnV0dG9uID0geyB0ZXh0OiAnU2VsZWN0ZWQnLCBpY29uOiAnJyB9OyAvLyBDaGFuZ2UgdGV4dCBhbmQgaWNvbiBvbiBtdWx0aXBsZSBzZWxlY3QgYnV0dG9uLiAodjogMS4wLjEpXG4gIEBJbnB1dCgpIHNlYXJjaFBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnRW50ZXIgbmFtZSB0byBzZWFyY2gnIDsgLy8gQ2hhbmdlIHNlYXJjaCBiYXIgcGxhY2Vob2xkZXIuICh2OiAxLjAuMClcbiAgQElucHV0KCkgYWN0aW9uSGVhZGVyOiBzdHJpbmcgPSAnQWN0aW9ucycgOyAvLyBDaGFuZ2UgdGV4dCBmb3IgYWN0aW9uIGJ1dHRvbnMgaGVhZGVyLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIGxpbWl0OiBudW1iZXIgPSAyMCA7IC8vIFNwZWNpZnkgbnVtYmVyIG9mIGl0ZW1zIHBlciBwYWdpbmF0aW9uLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIHNwaW5uZXJTcmM6IGFueSA9ICcnIDsgLy8gU3Bpbm5lciB0byBzaG93IHdoZW4gbG9hZGluZyBkYXRhIGZyb20gQVBJLiAodjogMS4wLjEpXG4gIEBJbnB1dCgpIGFjdGlvbkJ1dHRvbnM6IEFycmF5PE9iamVjdD4gPSBbXSA7IC8vIFNwZWNpZnkgYWN0aW9uIGJ1dHRvbnMuIE1ha2Ugc3VyZSB0byBzZXQgaGFzQWN0aW9uQnV0dG9ucyB0byB0cnVlIGlmIHlvdSB3YW50IHRvIHNob3cgYnV0dG9uIGluIHRoZSB0YWJsZSByb3cuICh2OiAxLjAuMClcbiAgQElucHV0KCkgcGFnaW5hdGlvbkJ1dHRvbnM6IGFueSA9IHtiYWNrZ3JvdW5kOicjZGRkZGRkJyx0ZXh0Q29sb3I6JyMzMzU1OTknfSA7IC8vIENoYW5nZSBidXR0b24gYnV0dG9uIGJhY2tncm91bmQgYW5kIHRleHRDb2xvci4gKHY6IDEuMC4wKVxuICBASW5wdXQoKSB0YWJsZUhlYWRlcjogYW55ID0ge2JhY2tncm91bmQ6JyNmZmZmZmYnLHRleHRDb2xvcjonIzMzNTU5OSd9IDsgLy8gQ2hhbmdlIHRhYmxlIGhlYWRlciBiYWNrZ3JvdW5kIGFuZCB0ZXh0IGNvbG9yLiAodjogMS4wLjApXG4gIEBJbnB1dCgpIHNlYXJjaEJ1dHRvbjogYW55ID0ge2JhY2tncm91bmQ6JyNjY2NjY2MnLHRleHRDb2xvcjonIzMzNTU5OSd9IDsgLy8gQ2hhbmdlIGJhY2tncm91bmQgYW5kIHRleHQgY29sb3Igb2YgdGhlIHNlYXJjaCBidXR0b24uICh2OiAxLjAuMClcbiAgQElucHV0KCkgYWRkQnV0dG9uOiBhbnkgPSB7fSA7IC8vQ2hhbmdlIGJhY2tncm91bmQgYW5kIHRleHQgY29sb3Igb2YgdGhlIGFkZCBidXR0b24uICh2OiAxLjAuMClcbiAgQElucHV0KCkgc2VhcmNoQmFyOiBhbnkgPSB7Ym9yZGVyU2l6ZTonMXB4Jyxib3JkZXJDb2xvcjonI2NjYycsYmFja2dyb3VuZDonI2ZmZmZmZicsdGV4dENvbG9yOicjMDAwMDAwJ30gOyAvLyBDaGFuZ2UgYmFja2dyb3VuZCBhbmQgdGV4dCBjb2xvciBvZiB0aGUgc2VhcmNoIGJhci4gKHY6IDEuMC4wKVxuICBAT3V0cHV0KCkgZmlyc3RBY3Rpb25CdXR0b25DbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpIDsgLy8gSGFuZGxlIGZpcnN0IGFjdGlvbiBidXR0b24uICh2OiAxLjAuMClcbiAgQE91dHB1dCgpIHNlY29uZEFjdGlvbkJ1dHRvbkNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCkgOyAvLyBIYW5kbGUgc2Vjb25kIGFjdGlvbiBidXR0b24uICh2OiAxLjAuMClcbiAgQE91dHB1dCgpIHRoaXJkQWN0aW9uQnV0dG9uQ2xpY2tlZDogRXZlbnRFbWl0dGVyPGFueT4gPSAgIG5ldyBFdmVudEVtaXR0ZXI8YW55PigpIDsgLy8gSGFuZGxlIHRoaXJkIGFjdGlvbiBidXR0b24uICh2OiAxLjAuMClcbiAgQE91dHB1dCgpIG11bHRpcGxlU2VsZWN0Q2xpY2tlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKSA7IC8vIEhhbmRsZSBtdWx0aXBsZSBzZWxlY3QgYnV0dG9uLiAodjogMS4wLjApXG4gIEBPdXRwdXQoKSBhZGRCdXR0b25DbGlja2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpIDsgLy8gSGFuZGxlIGFkZCBidXR0b24uICh2OiAxLjAuMClcbiAgaXNFeHBvcnRBbGw6IGJvb2xlYW4gPSBmYWxzZSA7XG4gIHNlYXJjaEZvcm06IEZvcm1Hcm91cCA7XG4gIHREYXRhOiBhbnkgPSBbXSA7XG4gIGJlaGF2aW9yOiBCZWhhdmlvclN1YmplY3Q8YW55PiA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuICAvL0tlZXAgdHJhY2sgb2YgY3VycmVudCBkYXRhIGFmdGVyIHNlYXJjaC4gSWYgc2VhcmNoIHN0cmluZyBpcyBlbXB0eSBzZXQgY3VycmVudCB2aWV3IGRhdGFcbiAgcHVibGljIHNlYXJjaERhdGFUZW1wT2Zmc2V0ID0gW107XG4gIC8vRGF0YSB0byBkaXNwbGF5IGluIHRoZSB0YWJsZSBiYXNlZCBvbiBvZmZzZXRcbiAgcHVibGljIGRpc3BsYXlEYXRhID0gdGhpcy5iZWhhdmlvci5hc09ic2VydmFibGUoKTsgXG4gIC8vS2VlcCB0cmFjayBvZiBwYWdpbmF0aW9uIG51bWJlcnNcbiAgcHVibGljIG9mZnNldCA9IDE7XG4gIHB1YmxpYyByZWxvYWRVcmw6c3RyaW5nICA7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfX2Zvcm06IEZvcm1CdWlsZGVyLHB1YmxpYyBzZXJ2aWNlOiBGbHhVaURhdGF0YWJsZVNlcnZpY2Upe1xuICAgIFxuICB9ICBcbiAgXG4gIHJlbG9hZCgpe1xuICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGbHhEYXRhVGFibGVEYXRhKHRoaXMucmVsb2FkVXJsLHRydWUpXG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSBjaGVja2VkIEV4cG9ydCBhbGwgc2VsZWN0aW9uXG4gICAqL1xuICBjaGVja1RvRXhwb3J0T3B0aW9uKGNoZWNrZWQ6Ym9vbGVhbil7XG4gICAgdGhpcy5pc0V4cG9ydEFsbCA9IGNoZWNrZWQgO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0gZXhwb3J0VHlwZSBFeHBvcnQgdHlwZTogcHJpbnR8cGRmfGV4Y2VsfHdvcmRcbiAgICovXG4gIGV4cG9ydERvY3VtZW50c0FzKGV4cG9ydFR5cGU6c3RyaW5nKXtcbiAgICBsZXQgbG9hZGluZzogSFRNTERpdkVsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXhwb3J0X2xvYWRpbmdcIikgO1xuICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdibG9jaycgO1xuICAgIGxldCBoZWFkZXJzID0gKCF0aGlzLmRhdGFFeHBvcnRzQ29uZmlnLmRhdGFDb2x1bW5zIHx8IHRoaXMuZGF0YUV4cG9ydHNDb25maWcuZGF0YUNvbHVtbnMubGVuZ3RoPDEpID8gdGhpcy5kYXRhS2V5cyA6IHRoaXMuZGF0YUV4cG9ydHNDb25maWcuZGF0YUNvbHVtbnMgO1xuICAgIGxldCBkYXRhVG9FeHBvcnQgPSAoIXRoaXMuaXNFeHBvcnRBbGwpID8gdGhpcy5kaXNwbGF5RGF0YSA6IHRoaXMuc2VydmljZS5mbHhEYXRhIDtcbiAgICBcbiAgICAvL1N1YnNjcmliZSB0byBkYXRhXG4gICAgZGF0YVRvRXhwb3J0LnN1YnNjcmliZSgoZGF0YSkgPT4geyAgICAgICAgICAgICAgXG4gICAgICAgIGxldCBhcnJheU9iajogQXJyYXk8YW55PiA9IFtdIDtcbiAgICAgICAgLy9Mb29wIGFuZCBwdXNoIGRhdGFcbiAgICAgICAgZm9yKGxldCBkIG9mIGRhdGEpe1xuICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge30gO1xuICAgICAgICAgICAgZm9yKGxldCBoPTA7aDxoZWFkZXJzLmxlbmd0aDtoKyspe1xuICAgICAgICAgICAgICAgIG9ialtoZWFkZXJzW2hdXSA9IGRbaGVhZGVyc1toXV0gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJyYXlPYmoucHVzaChvYmopIDtcbiAgICAgICAgfVxuICAgICAgICBpZihleHBvcnRUeXBlPT0ncHJpbnQnKXtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgIHByaW50SlMoe3ByaW50YWJsZTphcnJheU9iaixwcm9wZXJ0aWVzOmhlYWRlcnMsdHlwZTonanNvbid9KSA7XG4gICAgICAgICAgICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScgO1xuICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnIDtcbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdQcmludEpTIG5vdCBmb3VuZC4gQWRkIGBodHRwczovL3ByaW50anMtNGRlNi5reGNkbi5jb20vcHJpbnQubWluLmpzYCB0byB5b3VyIGluZGV4Lmh0bWwgb3IgYWRkIGFzIHBhcnQgb2YgYW5ndWxhci5qc29uIHNjcmlwdCcpIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gKGV4cG9ydFR5cGU9PSdwZGYnKSA/ICdwZGYnOiAoZXhwb3J0VHlwZT09J2V4Y2VsJykgPyAneGxzeCc6ICdkb2N4J1xuICAgICAgICAgICAgbGV0IHBhZ2VJZCA9IChleHBvcnRUeXBlPT0ncGRmJykgPyAzOiAoZXhwb3J0VHlwZT09J2V4Y2VsJykgPyA1OiA0IDtcblxuICAgICAgICAgICAgbGV0IHJlcXVlc3REYXRhOiBhbnkgPSB7XCJkYXRhXCI6SlNPTi5zdHJpbmdpZnkoYXJyYXlPYmopfVxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLnBvc3REYXRhKCdodHRwOi8vZXhwb3J0ZXIuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2V4cG9ydC9FeHBvcnRGcm9tSlNPTi8nLHBhZ2VJZCxyZXF1ZXN0RGF0YSkuc3Vic2NyaWJlKChyZXNwKSA9PntcbiAgICAgICAgICAgICAgICB2YXIgZG93bmxvYWQgPSAnaHR0cDovL2V4cG9ydGVyLmF6dXJld2Vic2l0ZXMubmV0L2FwaS9leHBvcnQvR2V0RmlsZS8nICsgcmVzcCA7XG4gICAgICAgICAgICAgICAgZG93bmxvYWQgKz0gXCI/ZmlsZU5hbWU9YW5kcmVpJmV4dGVuc2lvbj1cIisgZXh0ZW5zaW9uO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZG93bmxvYWQgO1xuICAgICAgICAgICAgICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJyA7XG4gICAgICAgICAgICB9LChlID0+IHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmaWxlIGV4cG9ydCBlcnJvcicsZSkgO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSkudW5zdWJzY3JpYmUoKSA7ICAgIFxuICB9XG5cbiAgaGFzSW1hZ2VFbWJlZGVkKCk6IGJvb2xlYW57XG4gICAgcmV0dXJuIHRoaXMuZW1iZWRQaWN0dXJlcy5oYXNPd25Qcm9wZXJ0eShcImluZGV4XCIpIDtcbiAgfVxuXG4gIGdldEltYWdlKCl7XG4gICAgICBjb25zb2xlLmxvZygnZW9lb2UnKVxuICAgIC8vICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpIDtcbiAgICAvLyAgIGltZy5zcmMgPSBpbWFnZVNyYyA7XG4gICAgLy8gICBpbWcub25sb2FkID0gKChlKT0+e1xuICAgIC8vICAgICAgIHJldHVybiBpbWFnZVNyYyA7XG4gICAgLy8gICB9KSA7XG4gICAgLy8gICBpbWcub25lcnJvciA9ICgoZSk9PntcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuZW1iZWRQaWN0dXJlcy5mYWxsYmFja1VybCA7XG4gICAgLy8gICB9KVxuICB9XG5cbiAgSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XG4gICAgXG4gICAgdmFyIENTViA9ICcnOyAgICBcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcbiAgICBcbiAgICBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcblxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXG4gICAgaWYgKFNob3dMYWJlbCkge1xuICAgICAgICB2YXIgcm93ID0gXCJcIjtcbiAgICAgICAgXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xuICAgICAgICB9XG5cbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cbiAgICBcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xuICAgICAgICB9XG5cbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcbiAgICAgICAgXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XG4gICAgfVxuXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfSAgIFxuICAgIFxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcbiAgICB2YXIgZmlsZU5hbWUgPSBcIk15UmVwb3J0X1wiO1xuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXG4gICAgXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCwnICsgZXNjYXBlKENTVik7XG4gICAgXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxuICAgIFxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcbiAgICB2YXIgbGluazogYW55ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XG4gICAgXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xufVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIG5ld0RhdGEgXG4gICAqL1xuICBjaGFuZ2VEaXNwbGF5RGF0YShuZXdEYXRhKSB7XG4gICAgdGhpcy5iZWhhdmlvci5uZXh0KG5ld0RhdGEpO1xuICB9XG5cbiAgbmdPbkluaXQoKXtcbiAgICBpZih0aGlzLmlzTGF6eWxvYWRpbmdFbmFibGVkKCkpe1xuICAgICAgICB0aGlzLnJlbG9hZFVybCA9IHRoaXMuZGF0YVVybCsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkrJz0wJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlTZWFyY2hLZXkrJz0nIDtcbiAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5yZWxvYWRVcmwgPSB0aGlzLmRhdGFVcmwgO1xuICAgIH1cbiAgICAgIHRoaXMuc2VhcmNoRm9ybSA9IHRoaXMuX19mb3JtLmdyb3VwKHtcbiAgICAgICAgICBzZWFyY2hTdHJpbmc6WycnLFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2VhcmNoRm9ybSA9IHRoaXMuX19mb3JtLmdyb3VwKHtcbiAgICAgICAgc2VhcmNoU3RyaW5nOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG4gICAgdGhpcy5zZXJ2aWNlLmxpbWl0ID0gdGhpcy5saW1pdDtcbiAgICB0aGlzLnNlcnZpY2Uuc2V0TGF6eWxvYWRpbmdDb25maWcodGhpcy5sYXp5bG9hZGluZ0NvbmZpZykgO1xuICAgIHRoaXMuc2VydmljZS5zZXREYXRhVXJsKHRoaXMuZGF0YVVybCk7XG4gICAgdGhpcy5zZXJ2aWNlLnNldERhdGFTcmNLZXkodGhpcy5kYXRhU3JjS2V5KTtcbiAgICBsZXQgdXJsID0gKHRoaXMuaXNMYXp5bG9hZGluZ0VuYWJsZWQoKSkgPyB0aGlzLmRhdGFVcmwrJyYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpT2Zmc2V0S2V5Kyc9MCYnK3RoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpU2VhcmNoS2V5Kyc9JyA6ICB0aGlzLmRhdGFVcmwgO1xuICAgIHRoaXMuc2VydmljZS5sb2FkRmx4RGF0YVRhYmxlRGF0YSh1cmwpO1xuICAgICAgdGhpcy5zZXJ2aWNlLmZseERhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XG4gICAgICAgIHRoaXMudERhdGEgPSByZXNwIDtcbiAgICAgICAgbGV0IG9iajogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICBpZiAodGhpcy50RGF0YS5sZW5ndGggPiB0aGlzLmxpbWl0KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGltaXQ7IGkrKykge1xuICAgICAgICAgICAgICAgIG9iai5wdXNoKHRoaXMudERhdGFbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAvLyB0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCA9IHRoaXMubGltaXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgY291bnRlcjogbnVtYmVyID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG9iai5wdXNoKHRoaXMudERhdGFbaV0pO1xuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgLy8gdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPSBvYmoubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VhcmNoRGF0YVRlbXBPZmZzZXQgPSBvYmo7XG4gICAgICAgIHRoaXMuY2hhbmdlRGlzcGxheURhdGEob2JqKTtcbiAgICB9KVxuICB9XG5cbnNlYXJjaERhdGFJbkFwaSh2YWx1ZXMsZm9ybSl7XG4gICAgdGhpcy5zZXJ2aWNlLmNoYWdlRGF0YVRhYmxlKFtdKSA7ICAgICAgICAgICBcbiAgICB0aGlzLnNlcnZpY2UubG9hZEZseERhdGFUYWJsZURhdGEodGhpcy5kYXRhVXJsKycmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaU9mZnNldEtleSsnPTAmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaVNlYXJjaEtleSsnPScrdmFsdWVzLnNlYXJjaFN0cmluZykgO1xufVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuLy8gYWxlcnQod2luZG93LmlubmVyV2lkdGgpXG4gIH1cblxuICBhY3Rpb25CdXR0b25DbGlja2VkKGluZGV4Om51bWJlcixidXR0b25JbmRleDpudW1iZXIpe1xuICAgIGlmIChidXR0b25JbmRleCA9PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpcnN0QWN0aW9uQnV0dG9uQ2xpY2tlZC5lbWl0KHsgaW5kZXg6IGluZGV4LCBkYXRhOiB0aGlzLnREYXRhW2luZGV4XSB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYnV0dG9uSW5kZXggPT0gMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRBY3Rpb25CdXR0b25DbGlja2VkLmVtaXQoeyBpbmRleDogaW5kZXgsIGRhdGE6IHRoaXMudERhdGFbaW5kZXhdIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy50aGlyZEFjdGlvbkJ1dHRvbkNsaWNrZWQuZW1pdCh7IGluZGV4OiBpbmRleCwgZGF0YTogdGhpcy50RGF0YVtpbmRleF0gfSk7XG4gICAgfVxuICB9XG5cbiAgYWRkQnV0dG9uQ2xpY2soKXtcbiAgICB0aGlzLmFkZEJ1dHRvbkNsaWNrZWQuZW1pdCgpIDtcbiAgfVxuXG4gIGNvbmZpcm1EZWxldGUoKXtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZVNlbGVjdENsaWNrZWQuZW1pdCh0aGlzLnNlcnZpY2UubXVsdGlwbGVEZWxldGlvbik7XG4gIH1cblxuICBhZGRSZW1vdmUoY2hlY2tlZDpib29sZWFuKXtcbiAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICB0aGlzLmRpc3BsYXlEYXRhLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvdW50ZXI6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpIG9mIGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2UubXVsdGlwbGVEZWxldGlvbi5wdXNoKGlbdGhpcy5tdWx0aXBsZVNlbGVjdEtleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkgeyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2VydmljZS5tdWx0aXBsZURlbGV0aW9uKSA7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24gPSBbXTtcbiAgICB9ICAgICAgICBcbiAgfVxuXG4gIGFkZFJlbW92ZURlbGV0ZUl0ZW0oZGF0YUtleXZhbHVlOmFueSwgaW5kZXg6bnVtYmVyLCBzZWxlY3RlZDpib29sZWFuKXtcbiAgICBpZiAoIXNlbGVjdGVkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkYXRhS2V5dmFsdWUgPT0gdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb25baV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2UubXVsdGlwbGVEZWxldGlvbi5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzcGxheURhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UubXVsdGlwbGVEZWxldGlvbi5wdXNoKHJlc3BbaW5kZXhdW3RoaXMubXVsdGlwbGVTZWxlY3RLZXldKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgLy8gY29uc29sZS5sb2coJ2xlZnQgJytkYXRhS2V5dmFsdWUsdGhpcy5zZXJ2aWNlLm11bHRpcGxlRGVsZXRpb24pIDtcbiAgfVxuXG4gIGdldFNlYXJjaENvbHVtbnMoKXtcbiAgICByZXR1cm4gKHRoaXMuaGFzQWRkQnV0dG9uKSA/ICh0aGlzLmVuYWJsZURhdGFFeHBvcnRzKSA/ICdjb2wtbWQtNiBzZWFyY2gtY29udGFpbmVyJyA6ICdjb2wtbWQtNyBzZWFyY2gtY29udGFpbmVyJyA6XG4gICAgKHRoaXMuZW5hYmxlRGF0YUV4cG9ydHMpID8gJ2NvbC1tZC03IHNlYXJjaC1jb250YWluZXInIDogJ2NvbC1tZC04IHNlYXJjaC1jb250YWluZXInO1xuICB9XG5cbiAgZGlzYWJsZVByZXZ0QnV0dG9uKCl7XG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0L3RoaXMubGltaXQpPD0xIDtcbiAgfVxuXG4gIGRpc2FibGVOZXh0QnV0dG9uKCl7XG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0L3RoaXMubGltaXQpPT1NYXRoLmNlaWwodGhpcy5zZXJ2aWNlLnRvdGFsSXRlbXMvdGhpcy5saW1pdCkgO1xuICB9XG5cbiAgaXNMYXp5bG9hZGluZ0VuYWJsZWQoKTogYm9vbGVhbntcbiAgICAgIHJldHVybiB0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmhhc093blByb3BlcnR5KFwiYXBpT2Zmc2V0S2V5XCIpICYmIHRoaXMubGF6eWxvYWRpbmdDb25maWcuYXBpT2Zmc2V0S2V5IDtcbiAgfVxuXG4gIG5leHRQcmV2SXRlbSh0eXBlOnN0cmluZyl7XG4gICAgaWYodGhpcy5pc0xhenlsb2FkaW5nRW5hYmxlZCgpKXtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGaW5pc2ggPSBmYWxzZSA7XG4gICAgICAgIHRoaXMuc2VydmljZS5nZXREYXRhTGVuZ3RoKCkudGhlbihkYXRhTGVuZ3RoPT57ICAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmNoYWdlRGF0YVRhYmxlKFtdKSA7ICAgXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCA9ICh0eXBlPT0ncHJldicpID8gKCh0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCAtIHRoaXMubGltaXQpIC0gdGhpcy5saW1pdCkgOiB0aGlzLnNlcnZpY2UuZGF0YU9mZnNldDsgIFxuICAgICAgICAgICAgbGV0IHVybCA9ICh0aGlzLmlzTGF6eWxvYWRpbmdFbmFibGVkKCkpID8gdGhpcy5kYXRhVXJsKycmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaU9mZnNldEtleSsnPScrIHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0ICsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlTZWFyY2hLZXkrJz0nIDogIHRoaXMuZGF0YVVybCA7ICBcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS5sb2FkRmx4RGF0YVRhYmxlRGF0YSh1cmwpIDtcbiAgICAgICAgfSkuY2F0Y2goZT0+e1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZXJyb3InLGUpIDtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIDtcbiAgICB9XG5cbiAgICAvLyBQYWdpbmF0ZSBpZiBsYXp5bG9hZGluZyBpcyBkaXNhYmxlZFxuICAgIGlmICh0eXBlID09ICdwcmV2Jykge1xuICAgICAgICB0aGlzLnBhZ2luYXRlRGF0YXRhYmxlUmVjb3JkKCh0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCAtIHRoaXMubGltaXQpIC0gdGhpcy5saW1pdCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPCB0aGlzLmxpbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRlRGF0YXRhYmxlUmVjb3JkKHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0ICsgKHRoaXMubGltaXQgLSAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRlRGF0YXRhYmxlUmVjb3JkKHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbHRlckRhdGEoc2VhcmNoU3RyaW5nID0gJycpIHtcbiAgICB0aGlzLmNoYW5nZURpc3BsYXlEYXRhKFtdKTtcbiAgICB0aGlzLnNlcnZpY2UuZmx4RGF0YS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdHM6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgLy9JZiBubyBzdHJpbmcgcHJvdmlkZWQuIFJlZ2lzdGVyIGFsbCB0aGUgcHJldmlvdXMgZGF0YSB0byB0aGUgZGF0YXNldFxuICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEaXNwbGF5RGF0YSh0aGlzLnNlYXJjaERhdGFUZW1wT2Zmc2V0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL0NoZWNrIGlmIHNlYXJjaEtleXMgYXJlIHNldCBlbHNlIHVzZSBkYXRhS2V5cyBhcyBzZWFyY2hLZXlzXG4gICAgICAgIGxldCBzZWFyY2hLZXlzOiBBcnJheTxzdHJpbmc+ID0gKHRoaXMuc2VhcmNoS2V5cy5sZW5ndGggPCAxKSA/IHRoaXMuZGF0YUtleXMgOiB0aGlzLnNlYXJjaEtleXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy9WYXJpYWJsZSB0byBjaGVjayBpZiBhIGRhdGEgaXMgZm91bmRcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IC0xO1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzZWFyY2hLZXlzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXVtTdHJpbmcoc2VhcmNoS2V5c1t4XSldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hTdHJpbmcudG9Mb2NhbGVMb3dlckNhc2UoKSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1jYXRjaChlKXt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL0lmIGZvdW5kIHB1c2ggdGhlIGluZGV4IG9mIHRoZSBkYXRhIHRvIHRoZSBzZWFyY2hSZXN1bHRzIHZhcmlhYmxlXG4gICAgICAgICAgICBpZiAoZm91bmQgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMucHVzaChkYXRhW2ZvdW5kXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9SZWdpc3RlciB0aGUgcmVzdWx0cyB0byB0aGUgZGF0YXNldFxuICAgICAgICB0aGlzLmNoYW5nZURpc3BsYXlEYXRhKHNlYXJjaFJlc3VsdHMpO1xuICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB2YWx1ZSBvZmZzZXQgdmFsdWVcbiAgICAgKi9cbiAgICBwYWdpbmF0ZURhdGF0YWJsZSh2YWx1ZSkge1xuICAgICAgICAvLyBDaGVjayBpZiBsYXp5IGxvYWRpbmcgaXMgZW5hYmxlZFxuICAgICAgICBpZih0aGlzLmlzTGF6eWxvYWRpbmdFbmFibGVkKCkpe1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGaW5pc2ggPSBmYWxzZSA7XG4gICAgICAgICAgICAvLyBTdWJzY3JpYmUgdG8gZ2V0IHRoZSBkYXRhIGxlbmd0aFxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmdldERhdGFMZW5ndGgoKS50aGVuKCgpPT57ICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZS5jaGFnZURhdGFUYWJsZShbXSkgO1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFsbCBpcyBzZWxlY3RlZCB0byBwcmV2ZW50IE5BTiB2YWx1ZSAgIFxuICAgICAgICAgICAgICAgIGlmKHZhbHVlIT0nYWxsJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZS5kYXRhT2Zmc2V0ID0gcGFyc2VJbnQodmFsdWUpIDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gc2V0dXAgdXJsXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9ICh0aGlzLmlzTGF6eWxvYWRpbmdFbmFibGVkKCkpID8gdGhpcy5kYXRhVXJsKycmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaU9mZnNldEtleSsnPScrIHZhbHVlICsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlTZWFyY2hLZXkrJz0nIDogdGhpcy5kYXRhVXJsIDtcbiAgICAgICAgICAgICAgICAvLyBwYWdpbmF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZS5sb2FkRmx4RGF0YVRhYmxlRGF0YSh1cmwsZmFsc2UpIDtcbiAgICAgICAgICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlcnJvcicsZSkgO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgdGhpcy5wYWdpbmF0ZURhdGF0YWJsZVJlY29yZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgcGFnaW5hdGlvbiBudW1iZXJcbiAgICAgKiBQZXJmb3JtIHBhZ2luYXRpb24gdG8gdGhlIGRhdGFzZXRcbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgcGFnaW5hdGVEYXRhdGFibGVSZWNvcmQodmFsdWUpIHtcbiAgICAgICAgaWYodGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImFwaU9mZnNldEtleVwiKSAmJiB0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaU9mZnNldEtleSl7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGaW5pc2ggPSBmYWxzZSA7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UuZ2V0RGF0YUxlbmd0aCgpLnRoZW4oZGF0YUxlbmd0aD0+eyAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2UuY2hhZ2VEYXRhVGFibGUoW10pIDsgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPSBwYXJzZUludCh2YWx1ZSkrdGhpcy5saW1pdCA7ICAgICAgICAgIFxuICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmxvYWRGbHhEYXRhVGFibGVEYXRhKHRoaXMuZGF0YVVybCsnJicrdGhpcy5sYXp5bG9hZGluZ0NvbmZpZy5hcGlPZmZzZXRLZXkrJz0nK3ZhbHVlKycmJyt0aGlzLmxhenlsb2FkaW5nQ29uZmlnLmFwaVNlYXJjaEtleSsnPScpIDtcbiAgICAgICAgICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlcnJvcicsZSkgO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbnVtOm51bWJlciA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgaWYgKG51bSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IDE7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UuZGF0YU9mZnNldCA9IHRoaXMubGltaXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IG51bSArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLmRhdGFPZmZzZXQgPSBudW0gKyB0aGlzLmxpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmZzZXQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VydmljZS5mbHhEYXRhLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSAnYWxsJykge1xuICAgICAgICAgICAgICAgIGxldCBwYWdpbmF0ZVJlc3VsdDogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSB2YWx1ZTsgaSA8ICh0aGlzLmxpbWl0ICsgcGFyc2VJbnQodmFsdWUpKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0ZVJlc3VsdC5wdXNoKGRhdGFbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYWdpbmF0ZVJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGlzcGxheURhdGEocGFnaW5hdGVSZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGlzcGxheURhdGEoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hEYXRhVGVtcE9mZnNldCA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuaW1wb3J0IHtEaXJlY3RpdmUsRWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZScgO1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbZmx4LXVpLWRhdGF0YWJsZS1pbWctZmFsbGJhY2tdJ1xufSlcbmV4cG9ydCBjbGFzcyBJbWFnZUZhbGxCYWNrIHtcbiAgICBASW5wdXQoJ2ZseC11aS1kYXRhdGFibGUtaW1nLWZhbGxiYWNrJykgaW1nU3JjOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBlbDogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpc0FwcGxpZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIEVWRU5UX1RZUEU6IHN0cmluZyA9ICdlcnJvcic7XG4gIFxuICAgIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmKSB7XG4gICAgICB0aGlzLmVsID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLkVWRU5UX1RZUEUsIHRoaXMub25FcnJvci5iaW5kKHRoaXMpKVxuICAgIH1cbiAgXG4gICAgcHJpdmF0ZSBvbkVycm9yKCkge1xuICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcbiAgXG4gICAgICBpZiAoIXRoaXMuaXNBcHBsaWVkKSB7XG4gICAgICAgIHRoaXMuaXNBcHBsaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMuaW1nU3JjKTtcbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIHByaXZhdGUgcmVtb3ZlRXZlbnRzKCkge1xuICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuRVZFTlRfVFlQRSwgdGhpcy5vbkVycm9yKTtcbiAgICB9XG4gIFxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgUGlwZSxQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZScgO1xuQFBpcGUoe1xuICAgIG5hbWU6J2NlaWwnXG59KVxuZXhwb3J0IGNsYXNzIENlaWwgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3Jte1xuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICB9XG5cbiAgICB0cmFuc2Zvcm0odmFsdWU6bnVtYmVyLGxpbWl0Om51bWJlcil7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwodmFsdWUvbGltaXQpIDtcbiAgICB9XG59IiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlLEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnIDtcbmltcG9ydCB7IEZseFVpRGF0YXRhYmxlQ29tcG9uZW50LEltYWdlRmFsbEJhY2sgfSBmcm9tICcuL2ZseC11aS1kYXRhdGFibGUuY29tcG9uZW50JyA7XG5pbXBvcnQgeyBIdHRwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCcgO1xuaW1wb3J0IHsgRmx4VWlEYXRhdGFibGVTZXJ2aWNlIH0gZnJvbSAnLi9mbHgtdWktZGF0YXRhYmxlLnNlcnZpY2UnIDtcbmltcG9ydCB7IENlaWwgfSBmcm9tICcuL2NlaWwucGlwZScgO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFJlYWN0aXZlRm9ybXNNb2R1bGUsRm9ybXNNb2R1bGUsSHR0cE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBGbHhVaURhdGF0YWJsZUNvbXBvbmVudCxDZWlsLEltYWdlRmFsbEJhY2tcbiAgXSxcbiAgZXhwb3J0czpbRmx4VWlEYXRhdGFibGVDb21wb25lbnQsQ2VpbF0sXG4gIHByb3ZpZGVyczpbRmx4VWlEYXRhdGFibGVTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBGbHhVaURhdGF0YWJsZU1vZHVsZSB7XG4gIFxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7SUE2QkUsWUFBbUIsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07dUJBdEJILEVBQUU7d0JBQ1ksSUFBSSxlQUFlLENBQU0sRUFBRSxDQUFDO3VCQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTswQkFFVixFQUFFOzBCQUVULENBQUM7MEJBRUQsQ0FBQztxQkFFTixFQUFFOzBCQUVFLEVBQUU7O2dDQUVDLEVBQUU7OzBCQUlWLEtBQUs7aUNBRU0sRUFBRTtLQUdsQzs7Ozs7SUFFTSxvQkFBb0IsQ0FBQyxNQUFVO1FBQ3BDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUU7Ozs7Ozs7SUFRNUIsT0FBTyxDQUFDLEdBQVU7UUFDckIscUJBQUksT0FBTyxHQUFZLElBQUksT0FBTyxFQUFFLENBQUU7UUFDdEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUMsbUNBQW1DLENBQUMsQ0FBRTtRQUNwRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsUUFBa0IsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFFOzs7Ozs7Ozs7SUFVdEcsUUFBUSxDQUFDLEdBQVUsRUFBQyxFQUFNLEVBQUMsSUFBVztRQUMzQyxxQkFBSSxPQUFPLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBRTtRQUN0QyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBQyxpQ0FBaUMsQ0FBQyxDQUFFO1FBQ2xFLE9BQU8sSUFBSSxDQUFDLElB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