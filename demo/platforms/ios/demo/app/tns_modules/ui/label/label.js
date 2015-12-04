var common = require("./label-common");
var utils = require("utils/utils");
var viewModule = require("ui/core/view");
var enums = require("ui/enums");
global.moduleMerge(common, exports);
var UILabelImpl = (function (_super) {
    __extends(UILabelImpl, _super);
    function UILabelImpl() {
        _super.apply(this, arguments);
    }
    UILabelImpl.initWithOwner = function (owner) {
        var labelImpl = UILabelImpl.new();
        labelImpl._owner = owner;
        return labelImpl;
    };
    UILabelImpl.prototype.textRectForBoundsLimitedToNumberOfLines = function (bounds, numberOfLines) {
        var rect = _super.prototype.textRectForBoundsLimitedToNumberOfLines.call(this, bounds, numberOfLines);
        var owner = this._owner.get();
        if (owner) {
            var size = rect.size;
            rect = CGRectMake(-(owner.borderWidth + owner.style.paddingLeft), -(owner.borderWidth + owner.style.paddingTop), size.width + (owner.borderWidth + owner.style.paddingLeft + owner.style.paddingRight + owner.borderWidth), size.height + (owner.borderWidth + owner.style.paddingTop + owner.style.paddingBottom + owner.borderWidth));
        }
        return rect;
    };
    UILabelImpl.prototype.drawTextInRect = function (rect) {
        var owner = this._owner.get();
        var textRect;
        var size = rect.size;
        if (owner) {
            textRect = CGRectMake((owner.borderWidth + owner.style.paddingLeft), (owner.borderWidth + owner.style.paddingTop), size.width - (owner.borderWidth + owner.style.paddingLeft + owner.style.paddingRight + owner.borderWidth), size.height - (owner.borderWidth + owner.style.paddingTop + owner.style.paddingBottom + owner.borderWidth));
        }
        else {
            textRect = CGRectMake(0, 0, size.width, size.height);
        }
        _super.prototype.drawTextInRect.call(this, textRect);
    };
    return UILabelImpl;
})(UILabel);
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(options) {
        _super.call(this, options);
        this._ios = UILabelImpl.initWithOwner(new WeakRef(this));
        this._ios.userInteractionEnabled = true;
    }
    Object.defineProperty(Label.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Label.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeView = this._nativeView;
        if (nativeView) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            if (widthMode === utils.layout.UNSPECIFIED) {
                width = Number.POSITIVE_INFINITY;
            }
            if (heightMode === utils.layout.UNSPECIFIED) {
                height = Number.POSITIVE_INFINITY;
            }
            var nativeSize = nativeView.sizeThatFits(CGSizeMake(width, height));
            var labelWidth = nativeSize.width;
            if (!this.textWrap && this.style.whiteSpace !== enums.WhiteSpace.nowrap) {
                labelWidth = Math.min(labelWidth, width);
            }
            var measureWidth = Math.max(labelWidth, this.minWidth);
            var measureHeight = Math.max(nativeSize.height, this.minHeight);
            var widthAndState = viewModule.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = viewModule.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    return Label;
})(common.Label);
exports.Label = Label;
