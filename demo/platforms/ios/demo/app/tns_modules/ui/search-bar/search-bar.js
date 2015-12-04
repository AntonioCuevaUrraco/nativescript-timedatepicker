var common = require("./search-bar-common");
var color = require("color");
var types = require("utils/types");
function onTextPropertyChanged(data) {
    var bar = data.object;
    bar.ios.text = data.newValue;
}
common.SearchBar.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
function onTextFieldBackgroundColorPropertyChanged(data) {
    var bar = data.object;
    if (data.newValue instanceof color.Color) {
        var tf = bar._textField;
        if (tf) {
            tf.backgroundColor = data.newValue.ios;
        }
    }
}
common.SearchBar.textFieldBackgroundColorProperty.metadata.onSetNativeValue = onTextFieldBackgroundColorPropertyChanged;
function onTextFieldHintColorPropertyChanged(data) {
    try {
    }
    catch (Err) {
    }
}
common.SearchBar.textFieldHintColorProperty.metadata.onSetNativeValue = onTextFieldHintColorPropertyChanged;
function onHintPropertyChanged(data) {
    var bar = data.object;
    if (!bar.ios) {
        return;
    }
    var newValue = data.newValue;
    if (types.isString(newValue)) {
        bar.ios.placeholder = newValue;
    }
}
common.SearchBar.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
global.moduleMerge(common, exports);
var UISearchBarDelegateImpl = (function (_super) {
    __extends(UISearchBarDelegateImpl, _super);
    function UISearchBarDelegateImpl() {
        _super.apply(this, arguments);
    }
    UISearchBarDelegateImpl.initWithOwner = function (owner) {
        var delegate = UISearchBarDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UISearchBarDelegateImpl.prototype.searchBarTextDidChange = function (searchBar, searchText) {
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        owner._onPropertyChangedFromNative(common.SearchBar.textProperty, searchText);
        if (searchText === "" && this._searchText !== searchText) {
            owner._emit(common.SearchBar.clearEvent);
        }
        this._searchText = searchText;
    };
    UISearchBarDelegateImpl.prototype.searchBarCancelButtonClicked = function (searchBar) {
        searchBar.resignFirstResponder();
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        owner._emit(common.SearchBar.clearEvent);
    };
    UISearchBarDelegateImpl.prototype.searchBarSearchButtonClicked = function (searchBar) {
        searchBar.resignFirstResponder();
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        owner._emit(common.SearchBar.submitEvent);
    };
    UISearchBarDelegateImpl.ObjCProtocols = [UISearchBarDelegate];
    return UISearchBarDelegateImpl;
})(NSObject);
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.call(this);
        this._ios = new UISearchBar();
        this._delegate = UISearchBarDelegateImpl.initWithOwner(new WeakRef(this));
    }
    SearchBar.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    SearchBar.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    SearchBar.prototype.dismissSoftInput = function () {
        this.ios.resignFirstResponder();
    };
    Object.defineProperty(SearchBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, "_textField", {
        get: function () {
            if (!this.__textField) {
                this.__textField = this.ios.valueForKey("searchField");
            }
            return this.__textField;
        },
        enumerable: true,
        configurable: true
    });
    return SearchBar;
})(common.SearchBar);
exports.SearchBar = SearchBar;
